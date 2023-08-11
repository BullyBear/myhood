from flask import current_app, request
from flask_restful import Resource, reqparse
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models import User, UserSchema
from extensions import bcrypt, db
from sqlalchemy.exc import IntegrityError  


users_schema = UserSchema(many=True)

class Users(Resource):
    def get(self):
        users = User.query.all()
        return users_schema.dump(users)
    


class Login(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', required=True)
        parser.add_argument('password', required=True)
        args = parser.parse_args()

        user = User.query.filter_by(email=args['email']).first()

        if user and bcrypt.check_password_hash(user.password, args['password']):
            # include user id and name in the access token
            access_token = create_access_token(identity={'id': user.id, 'name': user.name})
            refresh_token = create_refresh_token(identity=user.id)

            user_data = UserSchema(exclude=("password",)).dump(user) 

            return {
                'access_token': access_token,
                'refresh_token': refresh_token,
                'user': user_data
            }, 200
        else:
            return {'message': 'Invalid credentials'}, 401
        


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
        args = parser.parse_args()

        existing_user = User.query.filter_by(email=args['email']).first()
        if existing_user:
            return {'message': 'Email is already registered'}, 400

        new_user = User(
            name=args['name'],
            email=args['email'],
            password=bcrypt.generate_password_hash(args['password']).decode('utf-8'),
            bio=args['bio'][:300],  
            profile_picture=args['profile_picture'],
            user_latitude=args['user_latitude'],  
            user_longitude=args['user_longitude']
        )

        db.session.add(new_user)
        db.session.commit()

        return {'message': 'User registered successfully'}, 201

 

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
            
            if not user:
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
                return {'message': 'User updated successfully'}, 200
            except IntegrityError as ie:
                current_app.logger.error("Database integrity error: %s", str(ie))
                return {'message': 'Database error. Update failed.'}, 500
            except Exception as e:
                current_app.logger.error("Error during database operation: %s", str(e))
                return {'message': 'Database error. Update failed.'}, 500

        except Exception as e:
            current_app.logger.error("Error in PUT method: %s", str(e))
            return {'message': 'Internal server error'}, 500








class Invite(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', type=str, required=True)  # Only expect 'email'
        args = parser.parse_args()

        email = args['email']

        return {'message': 'Invite sent successfully'}, 201
    


class Forgot(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', type=str, required=True)  # Only expect 'email'
        args = parser.parse_args()

        email = args['email']

        return {'message': 'Password reset email sent successfully'}, 200
