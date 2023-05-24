from flask import Flask, request
from flask_restful import Api, Resource
from models import User, Toy
from config import DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
from API import user_resources, toy_resources
from extensions import db, ma, bcrypt, jwt, cors  

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS
app.config['JWT_SECRET_KEY'] = 'your-secret-key'

db.init_app(app)
ma.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)
cors.init_app(app)

api = Api(app)

@app.before_first_request
def create_tables():
    db.create_all()

# Add the Home class here
class Home(Resource):
    def get(self):
        return {'message': 'Hello, World!'}

# Register the Home route here
api.add_resource(Home, '/')

# The rest of your routes
api.add_resource(user_resources.Register, '/register')
api.add_resource(user_resources.Login, '/login')
api.add_resource(toy_resources.ToyList, '/toys')
api.add_resource(toy_resources.ToyResourceTime, '/toys/<int:toy_id>')

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=8000, debug=True)

if __name__ == '__main__':
    app.run(host='192.168.1.142', port=8000, debug=True)


