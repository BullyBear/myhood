from flask import request
from flask_restful import Resource
from extensions import db
from models import Toy, User, ToySchema, UserSchema
import boto3
from botocore.exceptions import BotoCoreError, NoCredentialsError
import uuid
from config import bucketName, region
from geopy.distance import geodesic

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

        # Get the user's latitude and longitude
        user_latitude = user.user_latitude
        user_longitude = user.user_longitude

        # Create a new toy instance
        new_toy = Toy(image_url=image_url, user_id=user_id, toy_latitude=user_latitude, toy_longitude=user_longitude)

        # Save the new toy to the database
        db.session.add(new_toy)
        db.session.commit()

        return toy_schema.dump(new_toy), 201

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

class ToysInRadius(Resource):
    def get(self):
        # Assuming you have a user's location data as latitude and longitude in the request
        user_latitude = float(request.args.get('user_latitude'))
        user_longitude = float(request.args.get('user_longitude'))

        # Filter toys based on geolocation within a certain radius (e.g., 10 miles)
        max_distance = 10
        toys_within_radius = [toy for toy in Toy.query.all() if geodesic((user_latitude, user_longitude), (toy.toy_latitude, toy.toy_longitude)).miles <= max_distance]

        return toys_schema.dump(toys_within_radius)