# Blog Application

This is a simple blog application built with Spring Boot. It allows users to create, read, update, and delete posts, as well as comment on and react to them. The application also includes user authentication and authorization using JWT.

## Features

- User registration and authentication (login/logout)
- Create, read, update, and delete posts
- Comment on posts
- React to posts (like/dislike)
- Get post statistics (likes, comments)
- Retweet a post on Twitter

## Technologies Used

- Java 21
- Spring Boot 3.3.4
- Spring Data JPA
- Spring Security
- PostgreSQL
- JWT (JSON Web Tokens)
- Maven
- springdoc-openapi (for API documentation)

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/blog.git
    cd blog
    ```

2.  **Create a PostgreSQL database:**

    -   Create a new PostgreSQL database named `fawry_blog`.
    -   Update the `spring.datasource.url`, `spring.datasource.username`, and `spring.datasource.password` properties in the `src/main/resources/application.properties` file with your database credentials.

3.  **Configure Twitter OAuth2:**

    -   Create a Twitter developer account and a new application to get your client ID and client secret.
    -   Update the `spring.security.oauth2.client.registration.twitter.client-id` and `spring.security.oauth2.client.registration.twitter.client-secret` properties in the `src/main/resources/application.properties` file with your Twitter application credentials.

4.  **Build and run the application:**

    ```bash
    mvn spring-boot:run
    ```

    The application will be available at `http://localhost:8080`.

## Architecture

The application follows a classic three-tier architecture:

-   **Presentation Layer (Controller):** Handles HTTP requests, delegates to the service layer, and returns responses. The `PostController` and `UserController` are the main entry points for the API.
-   **Business Logic Layer (Service):** Contains the core business logic of the application. The `PostService` and `UserService` handle the application's functionality.
-   **Data Access Layer (Repository):** Responsible for data persistence and retrieval. The `PostRepository`, `CommentRepository`, `ReactionRepository`, and `UserRepository` interfaces extend Spring Data JPA's `JpaRepository` to interact with the database.

## API Documentation

The API documentation is available at `http://localhost:8080/swagger-ui.html` after running the application. The following is a summary of the available endpoints:

### User Endpoints

-   `POST /api/users/register`: Register a new user.
-   `POST /api/users/authenticate`: Authenticate a user and get a JWT token.
-   `GET /api/users`: Get a list of all users.
-   `GET /api/users/{id}`: Get a user by their ID.
-   `PUT /api/users/{id}`: Update a user's information.
-   `DELETE /api/users/{id}`: Delete a user.

### Post Endpoints

-   `POST /api/posts`: Create a new post.
-   `GET /api/posts`: Get a list of all posts.
-   `GET /api/posts/{id}`: Get a post by its ID.
-   `DELETE /api/posts/{id}`: Delete a post.
-   `PUT /api/posts/{id}`: Update a post.
-   `POST /api/posts/comment`: Add a comment to a post.
-   `POST /api/posts/react`: React to a post (like/dislike).
-   `GET /api/posts/stats/{postId}`: Get statistics for a post.
-   `GET /api/posts/retweet/{postId}`: Retweet a post on Twitter.
