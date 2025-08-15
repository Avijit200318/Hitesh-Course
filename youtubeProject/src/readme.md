# API Documentation

## Endpoint: `http://localhost:3000/api/users/register`

### Description
This endpoint registers a new user by creating an account with their full name, email, username, password, and profile images.
It validates input fields, checks for duplicates, uploads images to Cloudinary, and stores the new user in the database.

### Method
`POST`

### Request Body
The request body should be a JSON object with the following fields.
Send a multipart/form-data request containing both text fields and file uploads.

#### Fields (Required)

- `fullName` – String, user’s full name (cannot be empty)

- `email` – String, valid email address (must be unique)

- `username` – String, desired username (must be unique)

- `password` – String, password for the account

#### Files

- `avatar` – Required – Profile image (JPEG/PNG), uploaded as avatar field.

- `coverImage` – Optional – Cover/banner image (JPEG/PNG), uploaded as coverImage field.

Example:
```json
{
    "fullName": John Doe,
    "username": Josh Doe,
    "email": john@example.com,
    "password": securePass123,
    "avatar": (binary file),
    "coverImage": (binary file, optional),
}
```

### Example Response
The response will be a JSON object with the following fields:

- `statusCode` **(number)**: HTTP status code indicating the outcome of the request.  
  - `200` → Successful user creation  
  - Other codes indicate an error  

- `data` **(object)**: Contains the created user’s details.
  - `_id` **(string)**: The user’s unique identifier.
  - `username` **(string)**: The chosen username.
  - `email` **(string)**: The user’s email address.
  - `fullName` **(string)**: The user’s full name.
  - `avatar` **(string)**: URL of the user’s profile picture stored on Cloudinary.
  - `coverImage` **(string)**: URL of the user’s cover image stored on Cloudinary (optional).
  - `watchHistory` **(array)**: List of video IDs the user has watched (empty if none).
  - `createdAt` **(string – ISO date)**: The date the account was created.
  - `updatedAt` **(string – ISO date)**: The date the account was last updated.
  - `__v` **(number)**: Mongoose document version key.

- `message` **(string)**: Human-readable description of the request result.  
  Example: `"User created successfully"`

- `success` **(boolean)**: Indicates whether the request was successful (`true`) or not (`false`).


Example:
```json
{
  {
    "statusCode": 200,
    "data": {
        "_id": "689f0a879ef2906c8135f0cb",
        "username": "demo1",
        "email": "demo140@gmail.com",
        "fullName": "demo1",
        "avatar": "http://res.cloudinary.com/dhj5s8ynm/imaage/...",
        "coverImage": "http://res.cloudinary.com/dhj5s8ynm/image/...",
        "watchHistory": [],
        "createdAt": "2025-08-15T10:23:03.578Z",
        "updatedAt": "2025-08-15T10:23:03.578Z",
        "__v": 0
    },
    "message": "User created successfully",
    "success": true
}
}
```

## Endpoint: `http://localhost:3000/api/users/sign-in`

### Description
This endpoint logs in a user by verifying credentials (email/username + password).
If successful, it generates an access token and refresh token, sets them in HTTP-only cookies, and returns user details.

### Method
`POST`

### Request Body
The request body should be a JSON object with the following fields:
- `email or username`: A valid email address (required)  or an unique username (required)
- `password`: A string

Example:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
or
{
    "username": "john doe",
    "password": "12341234"
}
```

### Example Response
The response will be a JSON object with the following fields:

- `statusCode` **(number)**: HTTP status code indicating the outcome of the request.  
  - `200` → Successful login  
  - Other codes indicate an error  

- `data` **(object)**: Contains the logged-in user details and authentication tokens.
  - `user` **(object)**: The user’s profile data.
    - `_id` **(string)**: The user’s unique identifier.
    - `username` **(string)**: The chosen username.
    - `email` **(string)**: The user’s email address.
    - `fullName` **(string)**: The user’s full name.
    - `avatar` **(string)**: URL of the user’s profile picture stored on Cloudinary.
    - `coverImage` **(string)**: URL of the user’s cover image stored on Cloudinary (optional).
    - `watchHistory` **(array)**: List of video IDs the user has watched (empty if none).
    - `createdAt` **(string – ISO date)**: The date the account was created.
    - `updatedAt` **(string – ISO date)**: The date the account was last updated.
    - `__v` **(number)**: Mongoose document version key.
  - `accessToken` **(string)**: A short-lived JSON Web Token (JWT) used for API authentication.
  - `refreshToken` **(string)**: A long-lived JSON Web Token used to refresh access tokens without requiring re-login.

- `message` **(string)**: Human-readable description of the request result.  
  Example: `"User logged in successfully"`

- `success` **(boolean)**: Indicates whether the request was successful (`true`) or not (`false`).


Example:
```json
{
    "statusCode": 200,
    "data": {
        "user": {
            "_id": "689f2ad25ee2c67cfac91827",
            "username": "john1234",
            "email": "john.doe@example.com",
            "fullName": "john",
            "avatar": "http://res.cloudinary.com/dhj5s8ynm/image/...",
            "coverImage": "http://res.cloudinary.com/dhj5s8ynm/image/../",
            "watchHistory": [],
            "createdAt": "2025-08-15T12:40:50.607Z",
            "updatedAt": "2025-08-15T12:48:02.978Z",
            "__v": 0
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "message": "User logged in successfully",
    "success": true
}
```
## Endpoint: `/users/profile`

### Description
This endpoint is used to get the profile of the authenticated user.

### Method
`GET`

### Headers
- `Authorization`: Bearer token (required)

### Example Response
The response will be a JSON object containing the user data:
- `_id`: The user's unique identifier
- `fullName`: An object containing:
  - `firstName`: The user's first name
  - `lastName`: The user's last name
- `email`: The user's email address

Example:
```json
{
  "_id": "user_id_here",
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com"
}
```
