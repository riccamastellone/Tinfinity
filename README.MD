<div style="text-align:center"><img src="public/images/logo.png?raw=true" alt="Tinfinity" width="250px"></div>

# Tinfinity Web Server
This web server has been developed to support the iOS Tinfinity application.
Please refer to [this repo](https://github.com/Seba0691/Tinfinity) for the client source code.

It is written using Node.js, in particular the [Express](http://expressjs.com) framework and uses MongoDB as a database.
These have been preferred over many alternatives for performance reasons, as they support a very high number of concurrent connections with very little resources. Additionally, websockets are nativly supported using [SocketIO](http://socket.io/), allowing a real-time, bidirectional and reliable chat system.

![API Schema](public/images/schema.png?raw=true)


The structure of the web server have been developed so to not be tightly coupled with the client architecture (iOS), hence other clients (e.g., Web, Androind) can be easily created from the APIs documentation.

All the security checks are done server-side, not disclosing any unwanted information unless explicitly requested by the user.

MongoDb offers natively Geospatial data type support, and near users are retreived directly querying the database with the user current position.

## Dependencies

- Node.js
- npm
- nodemon

## Installation

1 - Install nodemon

        sudo npm install nodemon -g

2 - Install mongodb ( [OSX Instructions](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/?_ga=1.141921522.1728431311.1429018228) )

3 - Launch mongodb daemon

        mongod --config=/usr/local/etc/mongod.conf

4 - Install dependencies

        sudo npm install        (run this command in the server directory)

5 - Run the server

        npm start


NOTE: To use MongoDB Geospacital tools, the users position must be set as a 2dindex: 
```
db.users.ensureIndex({position:"2d"});
```

### Test data

Let's seed the db with at least a couple of test users
```
db.users.insert({ "name" : "Riccardo", "surname" : "Mastellone", "email" : "riccardo.mastellone@gmail.com", "token" : "thisisatoken" })
db.users.insert({ "name" : "Giovanni", "surname" : "Palazzo", "email" : "giovanni.palazzo@gmail.com", "token" : "thisisanothertoken" , "latitude" : "45.484083899999995", "longitude" : "9.209376899999999"})
```
# API #
To make any request, you need to be autheticated. You may do this by adding `X-Api-Token` and the associated token to the HTTP request header.
For security reasons, the token must be refreshed every time the app logs in.
All the images are base 64 encoded, and when uploading new images, the econding should be done locally.

### Authentication 
Just send the Facebook access token and it will return all the information about the Tinfinity user.
```
POST /api/auth/fb
token=.....
```
Example response
```
{
    "_id": "553d67e6e76c4761ccb25077",
    "facebook_id": "10154184687275109",
    "name": "Riccardo",
    "surname": "Mastellone",
    "gender": "male",
    "token": "1dd45c7cedf1460bf218cdb206982ec8d6b70e11fdd60193ad27356e40069f5c",
    "images": {
        "0": BASE64DATA"
    },
    "updated_at": 1430087797216,
    "created_at": 1430087654568
}
```


### Users

#### Retrive info about myself
```
GET /api/users/me
```
Example response
```
{
    "_id": "5530d2eb218629bd9fac825a",
    "name": "Riccardo",
    "surname": "Mastellone",
    "email": "riccardo.mastellone@gmail.com",
    "token": "thisisatoken",
    "position": {
        "latitude": "45.484083899999995",
        "longitude": "9.209276899999999",
    }
    "relationships": {
        "5530d2ec218629bd9fac825b": "requested"
    }
}
```

#### Retrive info about my relationships
```
GET /api/users/me/relationships
```

#### Retrive the list of nearby users

```
POST /api/users
lat=45.484083899999995&lon=9.209276899999999
```
Example response
```
{
    "user": {
        "_id": "5530d2ec218629bd9fac825b",
        "name": "Giovanni",
        "surname": "P.",
        "images": {
            "0": BASE64DATA"
        },
        "relationship": null
    },
    "position": {
        "latitude": 45.484083899999995,
        "longitude": 9.209376899999999
    }
}
```
All the data is already filtered bases on the relationships between users.
If a relationship request is null or `requested`, only the firstname and the initial of the surname will be shown.
Otherwise, complete surname, image and age will also be provided

#### Retrieve specific user details
```
GET /api/users/{id}
```
Example response with no relationship
```
{
    "_id": "5530d2ec218629bd9fac825b",
    "name": "Giovanni",
    "surname": "P.",
    "images": {
        "0": BASE64DATA"
    },
    "relationship": null
}
```
#### Relationship request
```
GET /api/users/{id}/add
```
Example response
```
{
    "relationship": "requested"
}
```

#### Accept friend request
```
GET /api/users/{id}/accept
```
Example response
```
{
    "relationship": "accepted"
}
```

#### Decline friend request
```
GET /api/users/{id}/decline
```
Example response
```
{
    "relationship": "decline"
}
```


### Chat

#### Retrive conversation history
```
GET /api/chat/{id}
```
#### Retrive conversation history starting from a precise point in time
```
GET /api/chat/{id}/{message-id}
```
Example response
```
{
    "_id": {
        "_id":  "5530d2eb218629bd9fac825a",
        "user1": "5530d2eb218629bd9fac825a",
        "user2": "5530d2ec218629bd9fac825b"
    },
    "user1": [
        {
            "_id": "553d001b0d840383ba1002c8",
            "message": "messaggio1",
            "timestamp": 1430061083351
        },{
            "_id": "553d001d0d840383ba1002ca",
            "message": "messaggio2",
            "timestamp": 1430061085214
        },{
            "_id": "553d0279c93f1a29bd78ae8f",
            "message": "ciao",
            "timestamp": 1430061689521
        }
    ],
    "user2": [
        {
            "_id": "553d010077739d88bb8fff1d",
            "message": "bella zio",
            "timestamp": 1430061312797
        },{
            "_id": "553d02be5e48e475bd7fe2d1",
            "message": "ciao",
            "timestamp": 1430061758347
        }
    ]
}
```

If the conversation does not exists, the response will be an empty array.

#### Real-time Websocket Chat
You may listen to your Socket.io channel `message-{id}`, where `{id}` is your user id.

To send a message, you may send the following json to the Socket.io channel named `message` 
```
{
   "user1" : "YOUR USER ID",
   "user2" : "RECIPIENT USER ID",
   "token" : "YOUR TOKEN",
   "message" : "YOUR MESSAGE"
}
```
If the token is invalid or your are not allowed to communicate with the requested user, you will get in your channel the following response
```
{
    'error' : 'Not authorized'
}
```

When receiving a message, it will be in the following form
```
{
  _id : "MESSAGE ID",
  user_id : "SENDER USER ID",
  message : "MESSAGE",
  timestamp : UNIX_TIMESTAMP 
}
```