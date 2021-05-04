![nodejs](https://https://https://github.com/TahaDgn/course-app-api/blob/master/nodejs.png)
## You do not have to *readme.md*

```JavaScript
  const intro = 'This is the udemy back-end clone rest api project'  
  
  console.log(`Hello reader ! ${intro}`);
```


### Environment variables

Environment variables existed in the .env file that is in the same path with **sample.env**.

There is a sample.env file
```.env
NODE_ENV=development
PORT=

MONGO_URI =

GEOCODER_PROVIDER=mapquest
GEOCODER_API_KEY=

FILE_UPLOAD_PATH=../public/uploads
MAX_FILE_UPLOAD=

JWT_SECRET=
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

SMTP_HOST=
SMTP_PORT=
SMTP_EMAIL=
SMTP_PASSWORD=
FROM_EMAIL=
FROM_NAME=

CORS_WHITELIST=http://localhost:8080 https://localhost8081 http://localhost:5000 https://localhost:5001
```

*There is no dependency on any of the variable, you can change according to your needs*

### Scripts

```cli
    npm start -> for production
    npm run dev -> for development
```
