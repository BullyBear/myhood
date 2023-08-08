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


# Helper function to get image file-like object from URL
def get_image_from_url(image_url):
    try:
        response = requests.get(image_url)
        response.raise_for_status()  # Raise an exception for HTTP errors
        img_data = BytesIO(response.content)
        # Check if the content type is an image
        if 'image' not in response.headers.get('Content-Type', ''):
            raise ValueError("URL content is not an image")
        return img_data
    except Exception as e:
        print(f"Error fetching image from URL: {str(e)}")
        return None



class ToyList(Resource):

    def get(self):
        print("[ToyList GET] - Fetching all toys.")
        toys = Toy.query.all()
        # Serialize the toys
        toy_schema = ToySchema(many=True)
        result = toy_schema.dump(toys)
        return {"toys": result}, 200



    def post(self):

        print("[ToyList POST] - Request received.")

        user_id = request.json.get('user_id')
        if not user_id:
            return {"message": "User ID must be provided in the request body"}, 400

        image_url = request.json.get('image_url')
        if not image_url:
            return {"message": "Image URL must be provided in the request body"}, 400

        user_latitude = request.json.get('user_latitude')
        user_longitude = request.json.get('user_longitude')

        if user_latitude is None or user_longitude is None:
            return {"message": "User latitude and longitude must be provided in the request body"}, 400
        
        print(f"[ToyList POST] - Received data: user_id={user_id}, image_url={image_url}, user_latitude={user_latitude}, user_longitude={user_longitude}")
        
        # Generate a unique filename and set the S3 destination file key
        # unique_filename = f'{uuid.uuid4().hex}.jpg'
        # destination_file_key = f'images/{unique_filename}'

        # use the helper function to get a file-like object
        # image = get_image_from_url(image_url)

        # print(f"Type of image object: {type(image)}")

        # # Open the image with PIL (Python Imaging Library) for further processing
        # try:
        #     # Open the image with PIL (Python Imaging Library) for further processing
        #     image = Image.open(image)
        # except Exception as e:
        #     print(f"Error opening image with PIL: {str(e)}")
        #     return {"message": "Failed to process image."}, 500

        # # Upload the image to AWS S3
        # s3 = boto3.client('s3')
        # try:
        #     with BytesIO() as output:
        #         image.save(output, format="JPEG")
        #         output.seek(0)
        #         s3.upload_fileobj(output, bucketName, destination_file_key)
        #     print("[ToyList POST] - Image uploaded to S3 successfully.")
        # except (BotoCoreError, NoCredentialsError) as e:
        #     print(f"[ToyList POST] - Error uploading image to S3: {str(e)}")
        #     return {'message': 'Error uploading image'}, 500

        # # Get the image URL
        # image_url = f"https://{bucketName}.s3.amazonaws.com/{destination_file_key}"

        new_toy = Toy(image_url=image_url, user_id=user_id, toy_latitude=user_latitude, toy_longitude=user_longitude)

        db.session.add(new_toy)
        db.session.commit()
        
        print("[ToyList POST] - Toy added to the database.")

        serialized_toy = toy_schema.dump(new_toy)
        #return jsonify(serialized_toy), 201
    
        return serialized_toy, 201
    
        #return jsonify(toy_schema.dump(new_toy)), 201






class ToyResourceTime(Resource):
    def get(self, toy_id):
        toy = Toy.query.get_or_404(toy_id)
        return toy_schema.dump(toy), 200

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
        return jsonify({'message': 'Toy deleted successfully'}), 200
    



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
        
        #return jsonify(toys_schema.dump(toys_within_radius))
        return toys_schema.dump(toys_within_radius), 200