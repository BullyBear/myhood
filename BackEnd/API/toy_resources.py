from flask import request, jsonify, Flask
from flask_restful import Resource, reqparse
from extensions import db
#from models import Toy, User, ToySchema, UserSchema, UserToyAction, UserToyActionSchema, toybox_association
from models import Toy, User, ToySchema, UserSchema, UserToyAction, UserToyActionSchema, toybox_association
import boto3
from botocore.exceptions import BotoCoreError, NoCredentialsError
import uuid
from config import bucketName, region
from geopy.distance import geodesic
import requests
from PIL import Image
from io import BytesIO
from sqlalchemy import and_, delete




toy_schema = ToySchema()
toys_schema = ToySchema(many=True)

user_toy_action_schema = UserToyActionSchema()
user_toy_actions_schema = UserToyActionSchema(many=True)


def get_image_from_url(image_url):
    try:
        response = requests.get(image_url)
        response.raise_for_status()
        img_data = BytesIO(response.content)
        if 'image' not in response.headers.get('Content-Type', ''):
            raise ValueError("URL content is not an image")
        return img_data
    except Exception as e:
        print(f"Error fetching image from URL: {str(e)}")
        return None


class ToyList(Resource):
    def get(self):
        user_id = request.args.get('user_id', None)
        mode = request.args.get('mode', 'all')  # New parameter to distinguish
        if user_id:
            if mode == 'uninteracted':
                interacted_toys = [x.toy_id for x in UserToyAction.query.filter_by(user_id=user_id).all()]
                if interacted_toys:
                    toys = Toy.query.filter(Toy.id.notin_(interacted_toys), Toy.user_id != user_id).all()
                else:
                    toys = Toy.query.filter(Toy.user_id != user_id).all()
            else:
                toys = Toy.query.filter_by(user_id=user_id).all()
            
            result = toys_schema.dump(toys)
            return {"toys": result}, 200
        else:
            return {"error": "user_id is required"}, 400

    def post(self):
        print("[ToyList POST] - Request received.")

        user_id = request.json.get('user_id')
        image_urls = request.json.get('image_urls', [])
        user_latitude = request.json.get('user_latitude')
        user_longitude = request.json.get('user_longitude')

        existing_toy = Toy.query.filter_by(user_id=user_id).first()
        if existing_toy:
            existing_toy.image_url_one = image_urls[0] if len(image_urls) > 0 else existing_toy.image_url_one
            existing_toy.image_url_two = image_urls[1] if len(image_urls) > 1 else existing_toy.image_url_two
            existing_toy.image_url_three = image_urls[2] if len(image_urls) > 2 else existing_toy.image_url_three
            existing_toy.image_url_four = image_urls[3] if len(image_urls) > 3 else existing_toy.image_url_four
            existing_toy.image_url_five = image_urls[4] if len(image_urls) > 4 else existing_toy.image_url_five
            existing_toy.toy_latitude = user_latitude
            existing_toy.toy_longitude = user_longitude
            db.session.commit()
            serialized_toy = toy_schema.dump(existing_toy)
            return {**serialized_toy, "message": "Toy updated"}, 200
        else:
            new_toy = Toy(
                image_url_one=image_urls[0] if len(image_urls) > 0 else None,
                image_url_two=image_urls[1] if len(image_urls) > 1 else None,
                image_url_three=image_urls[2] if len(image_urls) > 2 else None,
                image_url_four=image_urls[3] if len(image_urls) > 3 else None,
                image_url_five=image_urls[4] if len(image_urls) > 4 else None,
                user_id=user_id,
                toy_latitude=user_latitude,
                toy_longitude=user_longitude
            )
            db.session.add(new_toy)
            db.session.commit()
            serialized_toy = toy_schema.dump(new_toy)
            return {**serialized_toy, "caution": "A new toy has been created"}, 201



class ToyResourceTime(Resource):
    def get(self, toy_id):
        toy = Toy.query.get_or_404(toy_id)
        return toy_schema.dump(toy), 200

    def put(self, toy_id):
        toy = Toy.query.get_or_404(toy_id)
        image_urls = request.json.get('image_urls', [])

        # Explicitly handle image removal by setting to None
        toy.image_url_one = image_urls[0] if len(image_urls) > 0 else None
        toy.image_url_two = image_urls[1] if len(image_urls) > 1 else None
        toy.image_url_three = image_urls[2] if len(image_urls) > 2 else None
        toy.image_url_four = image_urls[3] if len(image_urls) > 3 else None
        toy.image_url_five = image_urls[4] if len(image_urls) > 4 else None

        db.session.commit()
        return toy_schema.dump(toy), 200


    def delete(self, toy_id):
        try:
            # Create a DELETE statement for all associations with the toy_id
            delete_statement = delete(toybox_association).where(toybox_association.c.toy_id == toy_id)
            
            # Execute the DELETE statement
            db.session.execute(delete_statement)

            # Now, delete the toy from the toys table
            toy = Toy.query.get_or_404(toy_id)
            db.session.delete(toy)
            db.session.commit()
            return {"message": 'Toy deleted successfully'}, 200
        except Exception as e:
            db.session.rollback()  # Rollback in case of error
            print(f"Error details: {str(e)}")
            return {"message": f"Error deleting toy: {str(e)}"}, 400





class ToysInRadius(Resource):
    def get(self):
        user_latitude = request.args.get('user_latitude')
        user_longitude = request.args.get('user_longitude')

        if user_latitude is None or user_longitude is None:
            return {'error': 'user_latitude and user_longitude must be provided'}, 400

        try:
            user_latitude = float(user_latitude)
            user_longitude = float(user_longitude)
        except ValueError:
            return {'error': 'Invalid latitude or longitude'}, 400

        user_location = (user_latitude, user_longitude)

        max_distance = 10
        toys_within_radius = []

        all_toys = Toy.query.all()

        for toy in all_toys:
            toy_location = (toy.toy_latitude, toy.toy_longitude)
            distance = geodesic(user_location, toy_location).miles
            if distance <= max_distance:
                toys_within_radius.append(toy)

        return toys_schema.dump(toys_within_radius), 200



# class ToySwipe(Resource):
#     def post(self):
#         user_id = request.json.get('user_id')
#         toy_id = request.json.get('toy_id')
#         action = request.json.get('action')  # Should be 'left', 'right', or 'none'

#         if action not in ['left', 'right', 'none']:
#             return {"error": "Invalid action type"}, 400

#         new_action = UserToyAction(
#             user_id=user_id,
#             toy_id=toy_id,
#             action=action
#         )

#         db.session.add(new_action)

#         # Updating the user's last_interacted_toy_id
#         user = User.query.filter_by(id=user_id).first()
#         if user:
#             user.last_interacted_toy_id = toy_id

#         db.session.commit()

#         serialized_action = user_toy_action_schema.dump(new_action)
#         return {**serialized_action, "message": "Swipe action recorded"}, 201




class ToySwipe(Resource):
    def post(self):
        swiper_user_id = request.json.get('user_id')
        toy_id = request.json.get('toy_id')
        action = request.json.get('action')  # Should be 'left', 'right', or 'none'

        if action not in ['left', 'right', 'none']:
            return {"error": "Invalid action type"}, 400
        
        # Fetch the toy to determine its creator
        toy = Toy.query.get(toy_id)
        if not toy:
            return {"error": "Toy not found"}, 404

        creator_user_id = toy.user_id
        
        # Check if this swipe record already exists
        existing_swipe = db.session.query(toybox_association).filter_by(
            toy_id=toy_id, 
            creator_user_id=creator_user_id, 
            swiper_user_id=swiper_user_id).first()
        
        if existing_swipe:
            # Update the action if record already exists
            stmt = toybox_association.update().where(
                and_(
                    toybox_association.c.toy_id == toy_id,
                    toybox_association.c.creator_user_id == creator_user_id,
                    toybox_association.c.swiper_user_id == swiper_user_id
                )
            ).values(action=action)
            db.session.execute(stmt)
        else:
            # Create a new swipe record
            new_swipe = toybox_association.insert().values(
                toy_id=toy_id,
                creator_user_id=creator_user_id,
                swiper_user_id=swiper_user_id,
                action=action
            )
            db.session.execute(new_swipe)

        db.session.commit()

        return {"message": "Swipe action recorded"}, 201
    


class AddToyToToybox(Resource):
    def post(self, user_id, toy_id):
        try:
            data = request.json

            if data["user_id"] != user_id or data["toy_id"] != toy_id:
                return {"message": "Mismatch in provided data"}, 400

            # Check if the user and toy exist
            user = User.query.get(user_id)
            toy = Toy.query.get(toy_id)

            if not user or not toy:
                return {"message": "User or toy not found"}, 404

            # Check if the user has already the toy in their toybox
            if toy in user.toybox:
                return {"message": "Toy is already in the user's toybox"}, 400

            # Add the toy to the user's toybox
            user.toybox.append(toy)
            db.session.commit()

            # Determine the pushToken
            push_token = None
            if toy.owner:
                if toy.owner.push_token and toy.owner.push_token != user.push_token:
                    push_token = toy.owner.push_token

            print(f"Push Token: {push_token}")  # Print for debugging

            # Return toy details and the push token of the toy owner
            return {
                "message": "Toy added to user's toybox successfully",
                "toy": toy_schema.dump(toy),
                "pushToken": push_token
            }, 201

        except Exception as e:
            return {"message": f"An error occurred: {str(e)}"}, 500




# class AddToyToToybox(Resource):
#     def post(self, user_id, toy_id):
#         try:
#             data = request.json

#             if data["user_id"] != user_id or data["toy_id"] != toy_id:
#                 return {"message": "Mismatch in provided data"}, 400

#             # Check if the user and toy exist
#             user = User.query.get(user_id)
#             toy = Toy.query.get(toy_id)

#             if not user or not toy:
#                 return {"message": "User or toy not found"}, 404

#             # Check if the user has already the toy in their toybox
#             if toy in user.toybox:
#                 return {"message": "Toy is already in the user's toybox"}, 400

#             # Add the toy to the user's toybox
#             user.toybox.append(toy)
#             db.session.commit()

#             return {"message": "Toy added to user's toybox successfully", "toy": toy.to_dict()}, 201

#         except Exception as e:
#             return {"message": f"An error occurred: {str(e)}"}, 500







