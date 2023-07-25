from flask_restful import Resource, reqparse
from flask_jwt_extended import create_access_token, create_refresh_token
from models import User, UserSchema
from extensions import bcrypt, db

users_schema = UserSchema(many=True)

class Users(Resource):
    def get(self):
        # Logic to fetch all users from the database
        users = User.query.all()
        return users_schema.dump(users)

class Register(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', required=True)
        parser.add_argument('email', required=True)
        parser.add_argument('password', required=True)
        #parser.add_argument('profile_picture', required=False)
        args = parser.parse_args()

        # Create a new User instance
        new_user = User(
            name=args['name'],
            email=args['email'],
            password=bcrypt.generate_password_hash(args['password']).decode('utf-8'),
            #profile_picture=args['profile_picture']
        )

        # Save the new user to the database
        db.session.add(new_user)
        db.session.commit()

        # Return a success message or the newly created user data
        return {'message': 'User registered successfully'}, 201

class Login(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', required=True)
        parser.add_argument('password', required=True)
        args = parser.parse_args()

        # Retrieve the user from the database based on the provided email
        user = User.query.filter_by(email=args['email']).first()

        # Check if the user exists and verify the password
        if user and bcrypt.check_password_hash(user.password, args['password']):
            # Generate access and refresh tokens
            access_token = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)

            # Return the tokens as a response
            return {
                'access_token': access_token,
                'refresh_token': refresh_token
            }, 200
        else:
            return {'message': 'Invalid credentials'}, 401
