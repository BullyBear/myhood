from flask import request, jsonify, Flask
from flask_restful import Resource, reqparse
from extensions import db
from models import Toy, User, ToySchema, UserSchema
import boto3
from botocore.exceptions import BotoCoreError, NoCredentialsError
import uuid
from config import bucketName, region
from geopy.distance import geodesic
import requests
from PIL import Image
from io import BytesIO


toy_schema = ToySchema()
toys_schema = ToySchema(many=True)


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
        if user_id:
            toys = Toy.query.filter_by(user_id=user_id).all()
        else:
            toys = Toy.query.all()

        #result = toy_schema.dump(toys)
        result = toys_schema.dump(toys)

        return {"toys": result}, 200

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

        toy.user_id = request.json.get('user_id', toy.user_id)

        image_urls = request.json.get('image_urls', None)
        if image_urls and isinstance(image_urls, list):
            toy.image_url_one = image_urls[0] if len(image_urls) > 0 else toy.image_url_one
            toy.image_url_two = image_urls[1] if len(image_urls) > 1 else toy.image_url_two
            toy.image_url_three = image_urls[2] if len(image_urls) > 2 else toy.image_url_three
            toy.image_url_four = image_urls[3] if len(image_urls) > 3 else toy.image_url_four
            toy.image_url_five = image_urls[4] if len(image_urls) > 4 else toy.image_url_five

        toy.toy_latitude = request.json.get('user_latitude', toy.toy_latitude)
        toy.toy_longitude = request.json.get('user_longitude', toy.toy_longitude)

        db.session.commit()

        return toy_schema.dump(toy), 200

    def delete(self, toy_id):
        toy = Toy.query.get_or_404(toy_id)
        db.session.delete(toy)
        db.session.commit()
        return {"message": 'Toy deleted successfully'}, 200


class ToysInRadius(Resource):
    def get(self):
        user_latitude = float(request.args.get('user_latitude'))
        user_longitude = float(request.args.get('user_longitude'))
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
