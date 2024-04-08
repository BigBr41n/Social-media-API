# MERN Blog API

## Description

This is a RESTful API for social media app with authentication , posts posting , stories , messages , comments and replies

## Installation

1. Clone the repository:

```
git clone https://github.com/BigBr41n/Social-media-API.git
```

2. Install dependencies:

```
    npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory and add the following variables:

```
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
```

Replace `<your-mongodb-uri>` with your MongoDB connection string and `<your-jwt-secret>` with a secret key for JWT token generation.

4. Run the server:

```
    npm start
```

## File Tree

- .env
- .gitignore
- api
  - config
    - db.js
  - controllers
    - userController.js
    - postsControllers.js
    - commentsControllers.js
    - messagesControllers.js
    - conversationsControllers.js
    - authController.js
  - middlewares
    - verifyToken.js
    - upload.js
  - routes
    - user.js
    - posts.js
    - comments.js
    - messages.js
    - conversations.js
    - auth.js
- app.js
- package-lock.json
- package.json
- server.js
- uploads

## Usage

### Endpoints

#### Users

- `POST /api/v1/auth/register`: Register a new user.
- `POST /api/v1/auth/login`: Login an existing user.
- `DELETE /api/v1/auth/logout`: Logout a user.
- `PUT /api/v1/users/update/:userId`: Update user profile (Protected route).
- `POST /api/v1/users/follow/:userId`: Follow a user (Protected route).
- `POST /api/v1/users/unfollow/:userId`: Unfollow a user (Protected route).
- `POST /api/v1/users/block/:userId`: Block a user (Protected route).
- `POST /api/v1/users/unblock/:userId`: Unblock a user (Protected route).
- `GET /api/v1/users/blocked/:userId`: Get blocked users (Protected route).
- `DELETE /api/v1/users/delete/:userId`: Delete user account (Protected route).
- `GET /api/v1/users/search/:query`: Search for users.

#### Posts

- `POST /api/v1/posts/create`: Create a new post (Protected route).
- `POST /api/v1/posts/create/:userId`: Create a post with images (Protected route).
- `PUT /api/v1/posts/update/:postId`: Update a post (Protected route).
- `GET /api/v1/posts/all/:userId`: Get all posts.
- `DELETE /api/v1/posts/delete/:postId`: Delete a post (Protected route).
- `POST /api/v1/posts/like/:postId`: Like a post (Protected route).
- `POST /api/v1/posts/dislike/:postId`: Dislike a post (Protected route).

#### Comments

- `POST /api/v1/comments/create`: Create a comment (Protected route).
- `POST /api/v1/comments/create/reply/:commentId`: Create a comment reply (Protected route).
- `PUT /api/v1/comments/update/:commentId`: Update a comment (Protected route).
- `PUT /api/v1/comments/update/:commentId/replies/:replyId`: Update a reply comment (Protected route).
- `GET /api/v1/comments/post/:postId`: Get comments by post (Protected route).
- `DELETE /api/v1/comments/delete/:commentId`: Delete a comment (Protected route).
- `DELETE /api/v1/comments/delete/:commentId/replies/:replyId`: Delete a reply comment (Protected route).
- `POST /api/v1/comments/like/:commentId`: Like a comment (Protected route).
- `POST /api/v1/comments/dislike/:commentId`: Dislike a comment (Protected route).
- `POST /api/v1/comments/:commentId/replies/like/:replyId`: Like a reply comment (Protected route).
- `POST /api/v1/comments/:commentId/replies/dislike/:replyId`: Dislike a reply comment (Protected route).

#### Messages

- `POST /api/v1/messages/create`: Create a message (Protected route).
- `GET /api/v1/messages/:conversationId`: Get messages in a conversation (Protected route).
- `DELETE /api/v1/messages/:messageId`: Delete a message (Protected route).

#### Conversations

- `POST /api/v1/conversations/create`: Create a new conversation (Protected route).
- `GET /api/v1/conversations/:userId`: Get conversations of a user (Protected route).
- `GET /api/v1/conversations/:firstUserId/:secondUserId`: Find conversation between two users (Protected route).
- `DELETE /api/v1/conversations/delete/:conversationId`: Delete a conversation (Protected route).

## Dependencies

- bcrypt: ^5.1.1
- cookie-parser: ^1.4.6
- dotenv: ^16.4.5
- express: ^4.19.2
- jsonwebtoken: ^9.0.2
- mongoose: ^8.3.0
- multer: ^1.4.5-lts.1
- nodemon: ^3.1.0
- path: ^0.12.7

### Error Handling

The API handles errors with custom middleware. It returns appropriate HTTP status codes and error messages in JSON format.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.
