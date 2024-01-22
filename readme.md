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
