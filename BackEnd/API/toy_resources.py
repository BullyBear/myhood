#toy_resources.py: Defines the resource classes for toy-related routes. 
#It includes methods for fetching all toys, creating a new toy with an uploaded image, 
#retrieving a specific toy by ID, updating a toy, and deleting a toy


from flask import request
from flask_restful import Resource
from extensions import db
from models import Toy, User, ToySchema, UserSchema
import boto3
from botocore.exceptions import BotoCoreError, NoCredentialsError
import uuid
from config import bucketName, region

toy_schema = ToySchema()
toys_schema = ToySchema(many=True)


class ToyList(Resource):
    def get(self):
        toys = Toy.query.all()
        return toys_schema.dump(toys)

    def post(self):
        if 'user_id' not in request.json:
            return {"message": "No user_id provided"}, 400

        user_id = request.json['user_id']
        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found"}, 404

        image_file = request.files['image']

        # Generate a unique file name
        unique_filename = f'{uuid.uuid4().hex}.jpg'

        # Set the S3 destination file key
        destination_file_key = f'images/{unique_filename}'

        # Upload the image to AWS S3
        s3 = boto3.client('s3')
        try:
            s3.upload_fileobj(image_file, bucketName, destination_file_key)
        except (BotoCoreError, NoCredentialsError) as e:
            print(f"Error uploading image to S3: {str(e)}")
            return {'message': 'Error uploading image'}, 500

        # Get the image URL
        image_url = f"https://{bucketName}.s3.amazonaws.com/{destination_file_key}"

        # Create a new toy instance
        new_toy = Toy(image_url=image_url, user_id=user_id)

        # Save the new toy to the database
        db.session.add(new_toy)
        db.session.commit()

        return toy_schema.dump(new_toy), 201


# class ToyList(Resource):
#     def get(self):
#         toys = Toy.query.all()
#         return toys_schema.dump(toys)

#     def post(self):
#         if 'user_id' not in request.json:
#             return {"message": "No user_id provided"}, 400

#         user_id = request.json['user_id']
#         user = User.query.get(user_id)
#         if not user:
#             return {"message": "User not found"}, 404
        
#         if 'image_url' not in request.json:
#             return {"message": "No image_url provided"}, 400

#         image_url = request.json['image_url']

#         # Create a new toy instance
#         new_toy = Toy(image_url=image_url, user_id=user_id)

#         # Save the new toy to the database
#         db.session.add(new_toy)
#         db.session.commit()

#         return toy_schema.dump(new_toy), 201





class ToyResourceTime(Resource):
    def get(self, toy_id):
        toy = Toy.query.get_or_404(toy_id)
        return toy_schema.dump(toy)

    def put(self, toy_id):
        toy = Toy.query.get_or_404(toy_id)
        toy.user_id = request.json.get('user_id', toy.user_id)
        db.session.commit()
        new_user_id = request.json.get('user_id')
        new_user = User.query.get(new_user_id)
        if not new_user:
            return {"message": "User not found"}, 404
        toy.user_id = new_user_id

        return toy_schema.dump(toy)

    def delete(self, toy_id):
        toy = Toy.query.get_or_404(toy_id)
        db.session.delete(toy)
        db.session.commit()
        return '', 204
