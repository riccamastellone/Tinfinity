
## Description

Web server, written in NodeJS, for the IOS application Tinfinity.

### Something more about it

Let's seed the db with at least a couple users
```
db.users.insert({ "name" : "Riccardo", "surname" : "Mastellone", "email" : "riccardo.mastellone@gmail.com", "token" : "thisisatoken" })
db.users.insert({ "name" : "Giovanni", "surname" : "Palazzo", "email" : "giovanni.palazzo@gmail.com", "token" : "thisisanothertoken" , "latitude" : "45.484083899999995", "longitude" : "9.209376899999999"})
```
# API #
To make any request, you need to be autheticated. You may do this adding the `X-Api-Auth` header in the request with the associated token.

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
