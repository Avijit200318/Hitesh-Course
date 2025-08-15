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

## Endpoint: `/users/login`

### Description
This endpoint is used to log in an existing user. It validates the input data, checks the user's credentials, and returns a JSON Web Token (JWT) along with the user data.

### Method
`POST`

### Request Body
The request body should be a JSON object with the following fields:
- `email`: A valid email address (required)
- `password`: A string with a minimum length of 6 characters (required)

Example:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Example Response
The response will be a JSON object with the following fields:
- `token`: A JSON Web Token (JWT) for authentication
- `user`: An object containing the user data:
  - `_id`: The user's unique identifier
  - `fullName`: An object containing:
    - `firstName`: The user's first name
    - `lastName`: The user's last name
  - `email`: The user's email address

Example:
```json
{
  "token": "your_jwt_token_here",
  "user": {
    "_id": "user_id_here",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com"
  }
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
