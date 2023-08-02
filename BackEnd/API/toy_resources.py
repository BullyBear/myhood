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

# Helper function to get image file-like object from URL
def get_image_from_url(image_url):
    response = requests.get(image_url)
    img_data = BytesIO(response.content)
    return img_data

toy_schema = ToySchema()
toys_schema = ToySchema(many=True)

class ToyList(Resource):
    def get(self):
        # Get all toys from the database
        all_toys = Toy.query.all()
        # Return all toys in JSON format
        return jsonify(toys_schema.dump(all_toys))

    def post(self):
        data = request.get_json()
        if 'user_id' not in data or 'image_url' not in data:
            return {"message": "User ID and image must be provided in the request body"}, 400

        user_id = data['user_id']
        image_url = data['image_url']

        # Generate a unique filename and set the S3 destination file key
        unique_filename = f'{uuid.uuid4().hex}.jpg'
        destination_file_key = f'images/{unique_filename}'

        # use the helper function to get a file-like object
        image = get_image_from_url(image_url)

        # Open the image with PIL (Python Imaging Library) for further processing
        image = Image.open(image)

        # Upload the image to AWS S3
        s3 = boto3.client('s3')
        try:
            with BytesIO() as output:
                image.save(output, format="JPEG")
                output.seek(0)
                s3.upload_fileobj(output, bucketName, destination_file_key)
        except (BotoCoreError, NoCredentialsError) as e:
            print(f"Error uploading image to S3: {str(e)}")
            return {'message': 'Error uploading image'}, 500

        # Get the image URL
        image_url = f"https://{bucketName}.s3.amazonaws.com/{destination_file_key}"

        # Get the user's latitude and longitude from the request
        user_latitude = float(request.args.get('user_latitude'))
        user_longitude = float(request.args.get('user_longitude'))

        # Create a new toy instance
        new_toy = Toy(image_url=image_url, user_id=user_id, toy_latitude=user_latitude, toy_longitude=user_longitude)

        # Save the new toy to the database
        db.session.add(new_toy)
        db.session.commit()

        return jsonify(toy_schema.dump(new_toy)), 201




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
        user_latitude = float(request.args.get('user_latitude'))
        user_longitude = float(request.args.get('user_longitude'))
        user_location = (user_latitude, user_longitude)
        
        max_distance = 10  # miles
        toys_within_radius = []

        # Get all toys from the database
        all_toys = Toy.query.all()

        for toy in all_toys:
            toy_location = (toy.toy_latitude, toy.toy_longitude)
            distance = geodesic(user_location, toy_location).miles
            if distance <= max_distance:
                toys_within_radius.append(toy)
        
        return jsonify(toys_schema.dump(toys_within_radius))


