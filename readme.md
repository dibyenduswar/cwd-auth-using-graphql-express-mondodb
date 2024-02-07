**Express GraphQL and MongoDB Authentication Server**

This is a simple authentication server built using Express.js, GraphQL, and MongoDB. It provides functionality for user authentication, password hashing, token generation, and user management. The server is secured using JWT (JSON Web Tokens) for authentication. 

Read the full article: https://codewithdweep.com/javascript/secure-authentication-with-graphql-express-js-and-mongodb/

**Getting Started** To run this server locally, make sure you have Node.js and MongoDB installed on your machine.

    Clone this repository.
    Install dependencies using npm install.
    Make sure MongoDB is running on your machine.
    Start the server using npm start.

**Dependencies**
    
    express: Web framework for Node.js.
    jsonwebtoken: Library for generating and verifying JSON Web Tokens.
    bcrypt: Library for hashing passwords.
    mongoose: MongoDB object modeling tool designed to work in an asynchronous environment.
    apollo-server: GraphQL server library.
    
**Usage**

    The server exposes a GraphQL API endpoint for user authentication and management.
    The REST API is available at the root (/) for simple testing.
    
**Configuration**

    MongoDB connection string: mongodb://127.0.0.1:27025/db_egwja
    Port: 3000 for Express server, 5000 for GraphQL server
    JWT Secret: just-a-secret
    Salt Rounds for password hashing: 12
    
**REST Endpoints**

    GET /: Returns "Hello World!"

**Graphql Sample Queries**
    Operation - UserCreation

    mutation CeateUserMutation( $user: UserCreateInput! ) {
        createUser(user: $user) {
            name,
            email,
            roles,
            id,
            created
        }
    }

    Variables:
    {
        "user" : {
            "name": "John Doe",
            "email": "johndoe@gmail.com",
            "roles": ["enduser"]
        }
    }

Operation - UserLogin

    mutation CeateLoginMutation( $user: UserLoginInput! ) {
        loginUser(user: $user) {
            id,
            token
        }
    }

    Variables:
    {
        "user" : {
            "email": "johndoe@gmail.com",
            "password": "123456"
        }
    }

    Headers:
    Authorization Bearer <token>

Operation - ChangePassword

    mutation ChangePasswordMutation( $credentials: UserChangePasswordInput! ) {
        changePassword(credentials: $credentials) {
            id,
            name,
            email
        }
    }

    Variables:
    {
        "credentials" : {
            "old_password": "123456",
            "new_password": "123456"
        }
    }

    Headers:
    Authorization Bearer <token>

Operation - getAuthUserDetails

    query getAuthUserDetails{
        getAuthUser {
            id,
            name,
            email
        }
    }

    Headers:
    Authorization Bearer <token>

**Contributing**: Feel free to contribute to this project by submitting pull requests or reporting issues.

