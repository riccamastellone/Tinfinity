
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
To make any request, you need to be autheticated. You may do this adding the `X-Api-Auth` header in the request with the associated token.

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
Example response
```
{
    "_id": "553d001b0d840383ba1002c9",
    "user1": "5530d2eb218629bd9fac825a",
    "user2": "5530d2ec218629bd9fac825b",
    "data": {
        "user1": [
            {
                "553d001b0d840383ba1002c8": [
                    "messaggio1",
                    1430061083351
                ]
            },
            {
                "553d001d0d840383ba1002ca": [
                    "messaggio2",
                    1430061085214
                ]
            },
            {
                "553d0279c93f1a29bd78ae8f": [
                    "ciao",
                    1430061689521
                ]
            },
        ],
        "user2": [
            {
                "553d010077739d88bb8fff1d": [
                    "bella zio",
                    1430061312797
                ]
            },
            {
                "553d02be5e48e475bd7fe2d1": [
                    "ciao",
                    1430061758347
                ]
            }
        ]
    }
}
```

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