
## Description

Web server, written in NodeJS, for the IOS application Tinfinity.

## Dependencies

- nodeJS
- npm
- nodemon

## Installation

1 - Install nodemon

        sudo npm install nodemon -g

2 - Install mongodb ( [OSX Instructions](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/?_ga=1.141921522.1728431311.1429018228) )

3 - Launch mongodb daemon

        mongod

4 - Install dependencies

        sudo npm install        (run this command in the server directory)

5 - Run the server

        npm start

### Something more about it


Let's seed the db with at least a couple users
```
db.users.insert({ "name" : "Riccardo", "surname" : "Mastellone", "email" : "riccardo.mastellone@gmail.com", "token" : "thisisatoken" })
db.users.insert({ "name" : "Giovanni", "surname" : "Palazzo", "email" : "giovanni.palazzo@gmail.com", "token" : "thisisanothertoken" , "latitude" : "45.484083899999995", "longitude" : "9.209376899999999"})
```
# API #
To make any request, you need to be autheticated. You may do this adding the `X-Api-Token` header in the request with the associated token.

### Authentication 
Just send the Facebook access token and it will return all the information about the Tinfinity user
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
    "image": "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xtf1/v/t1.0-1/p200x200/10351916_10154591446635109_1356913014075742012_n.jpg",
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
    "latitude": "45.484083899999995",
    "longitude": "9.209276899999999",
    "relationships": {
        "5530d2ec218629bd9fac825b": "requested"
    }
}
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
        "relationship": null
    },
    "distance": 8,
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


### Chat

#### Retrive conversation history
```
GET /api/chat/{id}
```
#### Retrive conversation history starting from a precise point in time
```
GET /api/chat/{id}/{timestamp}
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