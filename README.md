Packages used:

1. axios  
2. bcrypt  
3. dotenv  
4. express  
5. jsonwebtoken  
6. newsapi  
7. redis  
8. validator

Caching Layer:

1. Redis is used as caching layer for caching the news articles.


Command to start redis: sudo service redis-server start

Auth APIs:

POST /users/signup: User can register himself using this api

Body: 
{
    "name": "Varun",
    "email": "varun@yopmail.com",
    "preferences": ["sports","movies"],
    "password": "Varun@123"
}

POST /users/login: User can login using this api

Body:
{    
    "email": "varun@yopmail.com",
    "password": "Varun@123"
}

Response:

{
    "token": <JWT-TOKEN>,
    "message": "Logged in successfully",
}

Preferences APIs:

PUT /users/preferences: Updates the preferences of the logged in user

Body:
{
    "preferences": ["economical","science"]
}

GET /users/preferences: Helps return the logged in user preferences

Response:

{
    "status": 200,
    "preferences": [
        "sports",
        "movies"
    ]
}

News API:

GET /news: Helps to return all the news based on the users preferences from external service like news api.

Response:
{   "news": [
        {
            "id": "bbc-sport",
            "name": "BBC Sport",
            "description": "The home of BBC Sport online. Includes live sports coverage, breaking news, results, video, audio and analysis on Football, F1, Cricket, Rugby Union, Rugby League, Golf, Tennis and all the main world sports, plus major events such as the Olympic Games.",
            "url": "http://www.bbc.co.uk/sport",
            "category": "sports",
            "language": "en",
            "country": "gb"
        },
        {
            "id": "bleacher-report",
            "name": "Bleacher Report",
            "description": "Sports journalists and bloggers covering NFL, MLB, NBA, NHL, MMA, college football and basketball, NASCAR, fantasy sports and more. News, photos, mock drafts, game scores, player profiles and more!",
            "url": "http://www.bleacherreport.com",
            "category": "sports",
            "language": "en",
            "country": "us"
        },
    ],      
    "status": 200,
    "message": "Articles list fetched successfully"
}