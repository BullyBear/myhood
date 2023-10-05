from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS  # Import the CORS object
from config import DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
from extensions import db, ma, bcrypt, jwt, cors
from flask_migrate import Migrate
from geopy.distance import geodesic
from flask_socketio import SocketIO, join_room, leave_room

from models import User, Toy, UserSchema, ToySchema

from API.toy_resources import ToyList, ToyResourceTime, ToysInRadius, ToySwipe, AddToyToToybox 
from API.user_resources import Users, Register, Login, Invite, Forgot, UserUpdate, UserProfile, UserProfileBox, UsersByIds, UserProfileByID
from API.chat_resources import ChatMessagesResource

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS
app.config['JWT_SECRET_KEY'] = 'your-secret-key'

db.init_app(app)
ma.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)
#cors.init_app(app)

socketio = SocketIO(app, cors_allowed_origins="*")

cors = CORS(app, resources={r"*": {"origins": "*"}})

migrate = Migrate(app, db)

api = Api(app)

@app.before_first_request
def create_tables():
    db.create_all()


@app.errorhandler(500)
def internal_error(error):
    return jsonify(error="Internal server error"), 500


# Define the chat event
@socketio.on('message')
def handle_message(data):
    room = data['roomId']
    socketio.emit(f'room {room}', data, room=room)

@socketio.on('join')
def on_join(data):
    #username = data['username']
    room = data['room']
    join_room(room)
    socketio.emit('message', {'message': f'A user has entered the room.'}, room=room)

@socketio.on('leave')
def on_leave(data):
    #username = data['username']
    room = data['room']
    leave_room(room)
    socketio.emit('message', {'message': f'A user has left the room.'}, room=room)


class Home(Resource):
    def get(self):
        return {'message': 'Hello, World!'}

api.add_resource(Home, '/')

api.add_resource(Users, '/users')
api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(ToyList, '/toys')
api.add_resource(ToysInRadius, '/toys/in_radius')
api.add_resource(ToyResourceTime, '/toys/<int:toy_id>')
api.add_resource(Invite, '/invite')
api.add_resource(Forgot, '/forgot')
api.add_resource(UserUpdate, '/user/update')
api.add_resource(UserProfile, '/user/data')
api.add_resource(UserProfileByID, '/user/<int:user_id>')  
api.add_resource(UsersByIds, '/fetchUsersByIds')
api.add_resource(UserProfileBox, '/user/<int:user_id>/addProfile')
api.add_resource(ToySwipe, '/api/toyswipe')
api.add_resource(AddToyToToybox, '/user/<int:user_id>/toy/<int:toy_id>/add-toy-to-toybox')


api.add_resource(ChatMessagesResource, '/chat-messages/<string:roomId>')




# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=8000, debug=True, threaded=True)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8000, debug=True)




