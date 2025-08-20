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
## Endpoint: `http://localhost:3000/api/users/logout`

### Description
This endpoint logs out the authenticated user by removing their stored `refreshToken` in the database and clearing the authentication cookies (`accessToken` and `refreshToken`).  
It ensures that the user must log in again to obtain new tokens.

### Method
`POST`

### Headers
- `Authorization`: Bearer token (required)

### Authentication
✅ Requires the user to be logged in (must include valid cookies: `accessToken` and `refreshToken`).

### Request Body
No request body is required.

### Example Response
The response will be a JSON object with the following fields:

- `statusCode` **(number)**: HTTP status code indicating the outcome of the request.  
- `data` **(object)**: Empty object since no user data is returned on logout.  
- `message` **(string)**: A message confirming logout. Example: `"User logged out successfully"`.  
- `success` **(boolean)**: Indicates whether the request was successful (`true`) or not (`false`).  


Example:
```json
{
    "statusCode": 200,
    "data": {},
    "message": "User logged out successfully",
    "success": true
}
```
## Endpoint: `http://localhost:3000/api/users/update-password`

### Description
This endpoint allows an authenticated user to change their current password.  
The user must provide their **old password** (for verification) and a **new password**.  
If the old password is correct, the system updates the stored password with the new one.

### Method
`POST`

### Headers
- `Authorization`: Bearer token (required)

### Authentication
✅ Requires the user to be logged in (must include a valid `accessToken` in cookies or Authorization header).

### Request Body
Send a JSON object with the following fields:

- `oldPassword` **(string, required)**: The user's current password.  
- `newPassword` **(string, required)**: The new password the user wants to set.  


Example:
```json
{
  "oldPassword": "currentPassword123",
  "newPassword": "newSecurePassword456"
}
```

### Example Response
The response will be a JSON object with the following fields:

- `statusCode` **(number)**: HTTP status code indicating the outcome of the request.  
- `data` **(object)**: Empty object since no user data is returned after password change.  
- `message` **(string)**: A message confirming the password update. Example: `"Password changed successfully"`.  
- `success` **(boolean)**: Indicates whether the request was successful (`true`) or not (`false`).  

Example:
```json
{
    "statusCode": 200,
    "data": {},
    "message": "Password changed successfully",
    "success": true
}
```
## Endpoint: `http://localhost:3000/api/users/current-user`

### Description
This endpoint retrieves the currently authenticated user's details.  
It returns the user information from the database (excluding sensitive fields like `password` and `refreshToken`).

### Method
`GET`

### Headers
- `Authorization`: Bearer token (required)

### Authentication
✅ Requires the user to be logged in (must include a valid `accessToken` cookie or `Authorization` header).

### Request Body
No request body is required.

### Example Response
The response will be a JSON object with the following fields:

- `statusCode` **(number)**: HTTP status code indicating the outcome of the request.  
- `data` **(object)**: Contains the authenticated user's profile details.  
  - `_id` **(string)**: The user's unique identifier.  
  - `username` **(string)**: The chosen username.  
  - `email` **(string)**: The user’s email address.  
  - `fullName` **(string)**: The user’s full name.  
  - `avatar` **(string)**: URL of the user’s profile picture.  
  - `coverImage` **(string)**: URL of the user’s cover image (optional).  
  - `watchHistory` **(array)**: List of watched video IDs (empty if none).  
  - `createdAt` **(string – ISO date)**: The date the account was created.  
  - `updatedAt` **(string – ISO date)**: The date the account was last updated.  
  - `__v` **(number)**: Mongoose document version key.  
- `message` **(string)**: Human-readable description of the request result. Example: `"Current user details"`.  
- `success` **(boolean)**: Indicates whether the request was successful (`true`) or not (`false`).  

Example:
```json
{
  "statusCode": 200,
  "data": {
    "_id": "689f2ad25ee2c67cfac91827",
    "username": "demoUser",
    "email": "demo@gmail.com",
    "fullName": "Demo User",
    "avatar": "http://res.cloudinary.com/.../avatar.png",
    "coverImage": "http://res.cloudinary.com/.../cover.png",
    "watchHistory": [],
    "createdAt": "2025-08-15T12:40:50.607Z",
    "updatedAt": "2025-08-15T12:48:02.978Z",
    "__v": 0
  },
  "message": "Current user details",
  "success": true
}
```
## Endpoint: `http://localhost:3000/api/users/update-account`

### Description
This endpoint allows the authenticated user to update their **account details**, specifically the `fullName` and `email`.  
It returns the updated user profile (excluding sensitive fields like `password` and `refreshToken`).

### Method
`PATCH`

### Headers
- `Authorization`: Bearer token (required)

### Authentication
✅ Requires the user to be logged in (must include a valid `accessToken` cookie or `Authorization` header).

### Request Body
Send a JSON object with the following fields:

- `fullName` **(string, required)**: The updated full name of the user.  
- `email` **(string, required)**: The updated email address of the user.  

#### Example Request
```json
{
  "fullName": "Updated User",
  "email": "updateduser@gmail.com"
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
        "_id": "689f2ad25ee2c67cfac91827",
        "username": "deletee4352",
        "email": "delete12354@gmail.com",
        "fullName": "new Delete",
        "avatar": "http://res.cloudinary.com/dhj5s8ynm/image/...",
        "coverImage": "http://res.cloudinary.com/dhj5s8ynm/image...",
        "watchHistory": [],
        "createdAt": "2025-08-15T12:40:50.607Z",
        "updatedAt": "2025-08-16T07:35:09.587Z",
        "__v": 0
    },
    "message": "Account details updated successfully",
    "success": true
}
```
## Endpoint: `http://localhost:3000/api/users/update-avatar`

### Description
This endpoint allows the authenticated user to **update their profile avatar**.  
The uploaded image is stored on **Cloudinary**, and the user document is updated with the new avatar URL.  

### Method
`PATCH`

### Headers
- `Authorization`: Bearer token (required)  
- `Content-Type`: `multipart/form-data`  

### Authentication
✅ Requires the user to be logged in (must include a valid `accessToken` cookie or `Authorization` header).  

### Request Body
Send a **multipart/form-data** request with the following field:

- `avatar` **(file, required)**: The new avatar image to upload.  

#### Example Request (form-data)
```
{
  avatar: "..."(file)
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
```
{
    "statusCode": 200,
    "data": {
        "_id": "689f2ad25ee2c67cfac91827",
        "username": "delete1343",
        "email": "deletedfs1@gmail.com",
        "fullName": "new Delete",
        "avatar": "http://res.cloudinary.com/dhj5s8ynm/image/...",
        "coverImage": "http://res.cloudinary.com/dhj5s8ynm/image/...",
        "watchHistory": [],
        "createdAt": "2025-08-15T12:40:50.607Z",
        "updatedAt": "2025-08-16T07:59:20.328Z",
        "__v": 0
    },
    "message": "Avatar updated successfully",
    "success": true
}
```
## Endpoint: `http://localhost:3000/api/users/update-coverImage`

### Description
This endpoint allows the authenticated user to **update their profile cover image**.  
The uploaded image is stored on **Cloudinary**, and the user document is updated with the new cover image URL.  

### Method
`PATCH`

### Headers
- `Authorization`: Bearer token (required)  
- `Content-Type`: `multipart/form-data`  

### Authentication
✅ Requires the user to be logged in (must include a valid `accessToken` cookie or `Authorization` header).  

### Request Body
Send a **multipart/form-data** request with the following field:

- `coverImage` **(file, required)**: The new cover image to upload.  

#### Example Request (form-data)
```json
{
  coverImage: "..."(file)
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
```
{
    "statusCode": 200,
    "data": {
        "_id": "689f2ad25ee2c67cfac91827",
        "username": "delete1343",
        "email": "deletedfs1@gmail.com",
        "fullName": "new Delete",
        "avatar": "http://res.cloudinary.com/dhj5s8ynm/image/...",
        "coverImage": "http://res.cloudinary.com/dhj5s8ynm/image/...",
        "watchHistory": [],
        "createdAt": "2025-08-15T12:40:50.607Z",
        "updatedAt": "2025-08-16T07:59:20.328Z",
        "__v": 0
    },
    "message": "CoverImage updated successfully",
    "success": true
}
```
## Endpoint: `http://localhost:3000/api/c/:username`

### Description
This endpoint retrieves a **channel profile** based on the provided `username`.  
It includes subscriber counts, channels the user is subscribed to, and whether the logged-in user is subscribed to this channel.

### Method
`GET`

### Headers
- `Authorization`: Bearer token (required)

### Authentication
✅ Requires the user to be logged in.

### Path Parameters
- `username` **(string, required)**: The username of the channel owner.

### Example Request
```http
GET http://localhost:3000/api/channel/demoUser
Authorization: Bearer <accessToken>
```
### Example Response
The response will be a JSON object with the following fields:

- `statusCode` **(number)**: HTTP status code indicating the outcome of the request.  
- `data` **(object)**: Channel profile details.  
  - `fullName` **(string)**: Full name of the channel owner.  
  - `username` **(string)**: The channel's unique username.  
  - `avatar` **(string)**: Profile picture URL.  
  - `coverImage` **(string)**: Channel cover image URL.  
  - `subscribersCount` **(number)**: Total number of subscribers to the channel.  
  - `channelsSubscribedToCount` **(number)**: Number of channels this user has subscribed to.  
  - `isSubscribed` **(boolean)**: Whether the logged-in user is subscribed to this channel.  
  - `email` **(string)**: Email address of the channel owner.  
- `message` **(string)**: Human-readable confirmation message.  
- `success` **(boolean)**: Indicates whether the request was successful.  

#### Example
```json
{
  "statusCode": 200,
  "data": {
    "fullName": "Demo User",
    "username": "demoUser",
    "avatar": "http://res.cloudinary.com/.../avatar.png",
    "coverImage": "http://res.cloudinary.com/.../cover.png",
    "subscribersCount": 120,
    "channelsSubscribedToCount": 15,
    "isSubscribed": true,
    "email": "demo@gmail.com"
  },
  "message": "Channel profile fetch successfully",
  "success": true
}
```
## Endpoint: `http://localhost:3000/api/users/history`

### Description
This endpoint retrieves the **watch history** of the authenticated user.  
It fetches all videos the user has watched, along with limited details about the video owner (full name, username, and avatar).  
The data is retrieved using MongoDB aggregation with `$lookup` to populate video and owner details.

### Method
`GET`

### Headers
- `Authorization`: Bearer token (required)

### Authentication
✅ Requires the user to be logged in.

### Request Body
No request body is required.

---

### Example Response
The response will be a JSON object with the following fields:

- `statusCode` **(number)**: HTTP status code indicating the outcome of the request.  
- `data` **(array)**: List of video objects in the user's watch history.  
  - Each video contains:  
    - `_id` **(string)**: Video ID.  
    - `title` **(string)**: Title of the video.  
    - `description` **(string)**: Description of the video.  
    - `thumbnail` **(string)**: Thumbnail image URL.  
    - `duration` **(number)**: Video duration in seconds.  
    - `createdAt` **(string – ISO date)**: When the video was uploaded.  
    - `owner` **(object)**: Limited details of the user who uploaded the video.  
      - `fullName` **(string)**: Owner's full name.  
      - `username` **(string)**: Owner's username.  
      - `avatar` **(string)**: Owner's profile image.  
- `message` **(string)**: Human-readable confirmation message. Example: `"Watched history fetch successfully"`.  
- `success` **(boolean)**: Indicates whether the request was successful (`true`) or not (`false`).  

---

#### Example
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "64ff21a23beac85f9d1b1234",
      "title": "Learning Node.js Basics",
      "description": "An introduction to Node.js for beginners",
      "thumbnail": "http://res.cloudinary.com/.../nodejs-thumb.png",
      "duration": 600,
      "createdAt": "2025-08-15T12:40:50.607Z",
      "owner": {
        "fullName": "John Doe",
        "username": "john_doe",
        "avatar": "http://res.cloudinary.com/.../john-avatar.png"
      }
    },
    {
      "_id": "64ff21a23beac85f9d1b5678",
      "title": "MongoDB Aggregation Explained",
      "description": "Deep dive into MongoDB aggregation pipelines",
      "thumbnail": "http://res.cloudinary.com/.../mongo-thumb.png",
      "duration": 1200,
      "createdAt": "2025-08-16T14:12:30.207Z",
      "owner": {
        "fullName": "Jane Smith",
        "username": "jane_smith",
        "avatar": "http://res.cloudinary.com/.../jane-avatar.png"
      }
    }
  ],
  "message": "Watched history fetch successfully",
  "success": true
}
```

## Endpoint: `http://localhost:3000/api/users/refresh-token`

### Description
This endpoint refreshes the **access token** and issues a new **refresh token**.  
It is used when the access token expires, allowing the user to remain logged in without having to re-enter credentials.

### Method
`POST`

### Headers
- `Authorization`: Bearer token (optional)  
- `Cookie`: `refreshToken` (optional if sent in request body)  

### Authentication
✅ Requires a valid **refresh token** either in cookies or request body.

### Request Body
Send a JSON object if the refresh token is not stored in cookies:

```json
{
  "refreshToken": "your_refresh_token_here"

  or send using headers

  "Authorization": "Bearer your_refresh_token_here"
}
```
### Example Response
The response will be a JSON object with the following fields:

- `statusCode` **(number)**: HTTP status code indicating the outcome of the request.  
- `data` **(object)**: Contains the newly issued tokens.  
  - `accessToken` **(string)**: New short-lived JWT for API authentication.  
  - `refreshToken` **(string)**: New long-lived JWT used for future refreshes.  
- `message` **(string)**: A message confirming the refresh. Example: `"Access token refresh successfully"`.  
- `success` **(boolean)**: Indicates whether the request was successful (`true`) or not (`false`).  

#### Example:
```json
{
  "statusCode": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Access token refresh successfully",
  "success": true
}
```