from flask import current_app, request
from flask_restful import Resource, reqparse
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from emails import send_invite_email, send_forgot_email
from models import User, UserSchema
from extensions import bcrypt, db
from sqlalchemy.exc import IntegrityError  
import logging
import json
from botocore.exceptions import ClientError

logging.basicConfig(level=logging.INFO)






user_schema = UserSchema()  
users_schema = UserSchema(many=True)


class Users(Resource):
    def get(self):
        users = User.query.all()
        return users_schema.dump(users)
    


class Register(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', required=True)
        parser.add_argument('email', required=True)
        parser.add_argument('password', required=True)
        parser.add_argument('bio', type=str, required=False, trim=True, help="Bio cannot be more than 300 characters.", location="json")
        parser.add_argument('profile_picture', type=str, required=False, help="URL of the profile picture.", location="json")
        parser.add_argument('user_latitude', type=float, required=False) 
        parser.add_argument('user_longitude', type=float, required=False)
        parser.add_argument('push_token', type=str, required=False, location="json")
        args = parser.parse_args()

        existing_user = User.query.filter_by(email=args['email']).first()
        if existing_user:
            return {'message': 'Email is already registered'}, 400
        
        bio = args['bio'][:300] if args['bio'] else None
        profile_picture = args['profile_picture'] if args['profile_picture'] else None
        user_latitude = args['user_latitude'] if args['user_latitude'] else None
        user_longitude = args['user_longitude'] if args['user_longitude'] else None

        new_user = User(
            name=args['name'],
            email=args['email'],
            password=bcrypt.generate_password_hash(args['password']).decode('utf-8'),
            bio=bio,
            profile_picture=profile_picture,
            user_latitude=user_latitude,  
            user_longitude=user_longitude,
            push_token=args['push_token'] if args['push_token'] else None
        )

        db.session.add(new_user)
        db.session.commit()

        return {'message': 'User registered successfully'}, 201
    

class Login(Resource):
    def post(self):
        print('Login POST received.')
        parser = reqparse.RequestParser()
        parser.add_argument('email', required=True)
        parser.add_argument('password', required=True)
        args = parser.parse_args()

        print('Parsed arguments:', args)

        user = User.query.filter_by(email=args['email']).first()

        if user:
            print(f'User found with email: {args["email"]}')  
        else:
            print(f'No user found with email: {args["email"]}') 

        if user and bcrypt.check_password_hash(user.password, args['password']):
            # include user id and name in the access token
            access_token = create_access_token(identity={'id': user.id, 'name': user.name})
            refresh_token = create_refresh_token(identity=user.id)

            user_data = UserSchema(exclude=("password",)).dump(user) 

            print('Login successful!')

            return {
                'access_token': access_token,
                'refresh_token': refresh_token,
                'user': user_data
            }, 200
        else:
            print('Invalid credentials!')
            return {'message': 'Invalid credentials'}, 401
        

#Do I want to include push_token here? 
class UserUpdate(Resource):
    # @jwt_required() 
    def put(self):
        try:
            current_app.logger.info("Received data: %s", str(request.json))
            current_app.logger.debug("Full request data: %s", request.data)
            current_app.logger.debug("Form data: %s", request.form)
            current_app.logger.debug("JSON data: %s", request.json)

            # Directly using Flask's request parsing
            data = request.json

            # Check for required fields
            if not all(k in data for k in ["user_id", "bio"]):
                current_app.logger.error("Required fields missing.")
                return {'message': 'Required fields missing'}, 400

            user = User.query.get(data['user_id'])
            current_app.logger.debug("Debug: User ID received in API call: %s", data['user_id'])  # <-- Add this line
            if user:
                current_app.logger.debug("Debug: User ID after fetching from DB: %s", user.id)  # <-- Add this line
            else:
                current_app.logger.error("User with user_id %s not found.", data['user_id'])
                return {'message': 'User not found'}, 404


            # Ensure mandatory fields are not None or empty
            if not user.name or not user.email or not user.password:
                current_app.logger.error("Mandatory fields are missing for user with user_id %s", data['user_id'])
                return {'message': 'User data incomplete. Update failed.'}, 400

            user.bio = data['bio'][:300]
            if 'profile_picture' in data:
                user.profile_picture = data['profile_picture']

            try:
                db.session.commit()
                current_app.logger.info("User with ID %s updated successfully", data['user_id'])
                return {'bio': user.bio, 'profile_picture': user.profile_picture}, 200  # Changed this line
            except IntegrityError as ie:
                current_app.logger.error("Database integrity error: %s", str(ie))
                return {'message': 'Database error. Update failed.'}, 500
            except Exception as e:
                current_app.logger.error("Error during database operation: %s", str(e))
                return {'message': 'Database error. Update failed.'}, 500

        except Exception as e:
            current_app.logger.error("Error in PUT method: %s", str(e))
            return {'message': 'Internal server error'}, 500






class UserProfile(Resource):
    # @jwt_required()
    def get(self):
        try:
            user_id = request.args.get('user_id')  # Fetching from query parameter

            if user_id is None:
                current_app.logger.error("User ID is missing in the request.")
                return {'message': 'User ID is missing in the request'}, 400

            user = User.query.get(user_id)

            if user:
                return {'bio': user.bio, 'profile_picture': user.profile_picture}, 200
            else:
                current_app.logger.error("User with user_id %s not found.", user_id)
                return {'message': 'User not found'}, 404

        except Exception as e:
            current_app.logger.error("Error in GET method: %s", str(e))
            return {'message': 'Internal server error'}, 500




class UserProfileByID(Resource):
    def get(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {'message': 'User not found'}, 404

        serialized_user = user_schema.dump(user)
        return serialized_user, 200



class UsersByIds(Resource):
    def post(self):
        ids = request.json.get('ids', [])
        if not ids:
            return {'message': 'List of ids is required'}, 400

        #users = User.query.filter(User.id.in_(ids)).all()
        users = User.query.filter(User.id.in_(ids), User.is_deleted == False).all()
        if not users:
            return {'message': 'No users found for the given IDs', 'users': []}, 200
        return users_schema.dump(users), 200





# class UserProfileBox(Resource):
#     def post(self, user_id):
#         logging.info(f"Handling POST request for user ID: {user_id}")

#         data = request.json
#         logging.info(f"Received request data: {data}")
#         logging.info(f"Received user_details data: {data.get('user_details', {})}")


#         user = User.query.get(user_id)
#         if not user:
#             return {'message': 'User not found'}, 404
        
#         if 'profile_picture' in data:
#             current_userBox = user.get_userBox()
#             logging.info(f"Current userBox before update: {current_userBox}")

#             # Assuming user details are stored in 'user_details' key in data
#             # new_entry = {
#             #     "id": user.id,  
#             #     "details": {
#             #         "name": data.get('user_details', {}).get('name', ''),
#             #         "bio": data.get('user_details', {}).get('bio', ''),
#             #     },
#             #     "profile_picture": data['profile_picture']
#             # }

#             new_entry = {
#                 "id": swiper_id,  # This is the ID of User B (the swiper), not the toy's creator.
#                 "details": {
#                     "name": data.get('user_details', {}).get('name', ''),
#                     "bio": data.get('user_details', {}).get('bio', ''),
#                 },
#                 "profile_picture": data['profile_picture']  # This should be User B's profile picture.
#             }


#             if new_entry not in current_userBox:
#                 current_userBox.append(new_entry)
#                 user.set_userBox(current_userBox)
#                 logging.info(f"Updated userBox: {current_userBox}")

#         db.session.commit()
        
#         serialized_user = user_schema.dump(user)
#         return {**serialized_user, 'message': 'Profile added to UserBox successfully'}, 200



class UserProfileBox(Resource):
    def post(self, user_id):
        logging.info(f"Handling POST request for user ID: {user_id}")

        data = request.json
        logging.info(f"Received request data: {data}")
        logging.info(f"Received user_details data: {data.get('user_details', {})}")

        user = User.query.get(user_id)
        if not user:
            return {'message': 'User not found'}, 404
        
        # This is the ID of User B (the swiper)
        swiper_id = data.get('swiper_id', None)
        # Optional: You can also fetch toy_id if needed for other logic
        toy_id = data.get('toy_id', None)

        # Check if required swiper_id is present in the data
        if not swiper_id:
            return {'message': 'swiper_id not found in request data'}, 400

        if 'profile_picture' in data:
            current_userBox = user.get_userBox()
            logging.info(f"Current userBox before update: {current_userBox}")

            new_entry = {
                "id": swiper_id,
                "details": {
                    "name": data.get('user_details', {}).get('name', ''),
                    "bio": data.get('user_details', {}).get('bio', ''),
                    #"toy_id": toy_id
                },
                "profile_picture": data['profile_picture']
            }

            # Check if the swiper's details are already in the userBox
            if new_entry not in current_userBox:
                current_userBox.append(new_entry)
                user.set_userBox(current_userBox)
                logging.info(f"Updated userBox: {current_userBox}")

        db.session.commit()
        
        serialized_user = user_schema.dump(user)
        return {**serialized_user, 'message': 'Profile added to UserBox successfully'}, 200







    
class Invite(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', type=str, required=True)  # Only expect 'email'
        args = parser.parse_args()

        email = args['email']

        # Send the invite email
        try:
            send_invite_email(email)
            return {'message': 'Invite sent successfully'}, 201

        except ClientError as e:
            print(e.response['Error']['Message'])




class Forgot(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', type=str, required=True)  # Only expect 'email'
        args = parser.parse_args()

        email = args['email']

        # Send the forgot email
        try:
            send_forgot_email(email)
            return {'message': 'Forgot email sent successfully'}, 201

        except ClientError as e:
            print(e.response['Error']['Message'])



# class Forgot(Resource):
#     def post(self):
#         parser = reqparse.RequestParser()
#         parser.add_argument('email', type=str, required=True)
#         args = parser.parse_args()

#         user = User.query.filter_by(email=args['email']).first()
#         if not user:
#             return {'message': 'User not found'}, 404

#         user.generate_password_reset_token()
#         send_forgot_email(user.email, user.password_reset_token)
        
#         return {'message': 'Password reset email sent'}, 200





# class ResetPassword(Resource):
#     def post(self):
#         parser = reqparse.RequestParser()
#         parser.add_argument('token', type=str, required=True)
#         parser.add_argument('new_password', type=str, required=True)
#         args = parser.parse_args()

#         user = User.verify_password_reset_token(args['token'])
#         if user is None:
#             return {'message': 'Invalid or expired token'}, 400
        
#         user.password = bcrypt.generate_password_hash(args['new_password']).decode('utf-8')
#         user.password_reset_token = None
#         user.password_reset_expiration = None
#         db.session.commit()

#         return {'message': 'Password has been reset'}, 200


