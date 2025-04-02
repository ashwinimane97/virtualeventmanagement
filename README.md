# News Aggregator API

This is a **News Aggregator API** built using Node.js, Express, and MongoDB. The API allows users to register, log in, manage their preferences, and fetch news articles based on their preferences.

## Features

- **User Authentication**: Register, log in, and verify email.
- **Preferences Management**: Update and retrieve user preferences for news categories and languages.
- **News Fetching**: Fetch news articles based on user preferences using the News API.
- **Rate Limiting**: Protect endpoints from abuse using rate-limiting middleware.
- **Error Handling**: Comprehensive error handling for better debugging and user feedback.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB
- News API Key (from [NewsAPI](https://newsapi.org/))

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd virtualmanagementsystem
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the following variables:
   ```properties
   SALT_ROUNDS=10
   MONGO_URI=mongodb://localhost:27017/Airtribe_task2
   PORT=3000
   EMAIL_USER=<your-email>
   EMAIL_PASS=<your-email-password>
   JWT_SECRET=<your-secret-key>
   NEWS_API_KEY=<your-news-api-key>
   ```

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication

- **POST /users/register**  
  Register a new user.  
  **Body**: `{ name, email, password, phone, preferences }`

- **POST /users/login**  
  Log in an existing user.  
  **Body**: `{ email, password }`

- **GET /users/verify-email**  
  Verify user email using a token.  
  **Query**: `?token=<verification-token>`

### Preferences

- **GET /preferences**  
  Get user preferences.  
  **Headers**: `Authorization: Bearer <token>`

- **POST /preferences**  
  Update user preferences.  
  **Headers**: `Authorization: Bearer <token>`  
  **Body**: `{ categories, language }`

### News

- **GET /news**  
  Fetch news articles based on user preferences.  
  **Headers**: `Authorization: Bearer <token>`

## Testing

Run the test suite using the following command:
```bash
npm test
```

## Project Structure

```
virtualmanagementsystem/
├── controller/         # API controllers
├── middleware/         # Middleware (auth, rate-limiting)
├── model/              # Mongoose models
├── routes/             # API routes
├── services/           # External services (e.g., News API)
├── test/               # Test cases
├── utils/              # Utility functions
├── app.js              # Main application file
├── server.js           # Server entry point
├── dbConnect.js        # MongoDB connection logic
└── README.md           # Project documentation
```

## Dependencies

- **Express**: Web framework for Node.js.
- **Mongoose**: MongoDB object modeling tool.
- **Joi**: Data validation library.
- **jsonwebtoken**: For generating and verifying JWTs.
- **bcryptjs**: For hashing passwords.
- **axios**: For making HTTP requests.
- **nodemailer**: For sending emails.
- **express-rate-limit**: For rate-limiting API requests.

## License

This project is licensed under the ISC License.