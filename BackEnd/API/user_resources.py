from flask_restful import Resource, reqparse
from flask_jwt_extended import create_access_token, create_refresh_token
from models import User, UserSchema
from extensions import bcrypt, db

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
        args = parser.parse_args()

        existing_user = User.query.filter_by(email=args['email']).first()
        if existing_user:
            return {'message': 'Email is already registered'}, 400

        new_user = User(
            name=args['name'],
            email=args['email'],
            password=bcrypt.generate_password_hash(args['password']).decode('utf-8'),
        )

        db.session.add(new_user)
        db.session.commit()

        return {'message': 'User registered successfully'}, 201

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
