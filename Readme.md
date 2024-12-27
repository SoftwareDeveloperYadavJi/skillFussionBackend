# PUCODE HACKATHON

## Getting Started

1. **Clone the repository**
    ```bash
    git clone https://github.com/your-username/PUCODE.git
    cd PUCODE/Backend
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Set up environment variables**
    Create a [.env](http://_vscodecontentref_/1) file in the root of the `Backend` directory and add the following environment variables:
    ```env
    DATABASE_URL=your_database_url
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GOOGLE_CALLBACK_URL=your_google_callback_url
    ```

4. **Generate Prisma client**
    ```bash
    npx prisma generate
    ```

5. **Run database migrations**
    ```bash
    npx prisma migrate dev --name init
    ```

6. **Start the server**
    ```bash
    npm start
    ```

## API Endpoints

### User Authentication

- **Google OAuth Login**
    ```
    GET /auth/google
    ```

- **Google OAuth Callback**
    ```
    GET /auth/google/callback
    ```

### User Management

- **Update Social Media Links**
    ```
    PUT /user/:userId/social-media
    Request Body:
    {
        "github": "www.github.com/username",
        "linkedin": "www.linkedin.com/in/username",
        "twitter": "www.twitter.com/username",
        "website": "www.website.com"
    }
    ```

- **Update Education**
    ```
    PUT /user/:userId/education/:educationId
    Request Body:
    {
        "institute": "New Institute Name",
        "degree": "New Degree"
    }
    ```

### Connection Management

- **Create Connection Request**
    ```
    POST /user/connection-request
    Request Body:
    {
        "userId": "user_id",
        "requestedUserId": "requested_user_id"
    }
    ```

- **Accept Connection Request**
    ```
    PUT /user/connection-request/:requestId/accept
    ```


## Technologies Used

- Node.js
- Express.js
- Prisma
- PostgreSQL
- Google OAuth
- Google Calendar API

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature-branch`)
6. Open a pull request

## License

This project is licensed under the MIT License.