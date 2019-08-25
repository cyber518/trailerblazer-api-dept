# trailerblazer-api

A movie trailer API project that serves Youtube video trailer ID's and titles for requested string.

## Server Responses

200 OK - The request was successful.  
400 Bad Request - The request could not be understood or was missing required parameters.  
401 Unauthorized - Authentication failed.  
404 Not Found - Resource was not found.  

## User creation

To be able to retrieve data from API, users should create a user on database to be able to retrieve Authorization token.
Without Authorization, there is no way to get result from API.

Here is a sample JSON body for user creation request:

Method: `POST`  
URL: https://trailerblazer.herokuapp.com/user/register  
Body:  
`{  
  "name": "John Doe",  
  "email": "johndoe@email.com",  
  "password": "123456789"  
}`

Sample response on success:

`{  
  "user": "<<user_id>>"
}`

## Get Authorization Token

Before making API calls to get Youtube trai videos, users should get Authorization token with registered user. Here is a sample login
flow to get authorization token:

Method: `POST`  
URL: https://trailerblazer.herokuapp.com/user/login  
Body:  
`{  
  "email": "johndoe@email.com",  
  "password": "123456789"  
}`

Sample response on success:

`eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1NjY3Njg2NjQsImV4cCI6MTU5ODMwNDY2NCwiYXVkIjoid3`

## Get Search Key Related Youtube Trailer Videos

After getting authorization token, there is just last one step to do, make a API call with search string. Here is a sample request:

URL: https://trailerblazer.herokuapp.com/search?movie=harry+potter  
METHOD: `GET`  
Header: `Authorization: <<token>>`  
Result Structure:   
`
[  
  {  
    "name": "",  
    "year": "",  
    "imdbID: "",  
    "image": "",  
    "youtubeID": ""  
  }  
]
`
