const express = require('express')
const app = express()
const port = 3000
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;
const JWT_SECRET = 'just-a-secret';

// MongoDB Section
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27025/db_egwja');

const userSchemaMongo = new mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, index: true, unique: true },
    roles: [String],
    password: { type: String, require: true },
    created: { type: Date, default: new Date()},
});

userSchemaMongo.set('toObject', { virtuals: true });
userSchemaMongo.set('toJSON', { virtuals: true });
userSchemaMongo.virtual('id').get(function() {
    return this._id.toHexString();
});

const DbUser = mongoose.model('User', userSchemaMongo);

let createNewUser = async (user) => {
    if(!user) return false;
    try{
        user['password'] = await bcrypt.hash(user['password'], SALT_ROUNDS);
        let data = await DbUser.create(user);
        return data;
    } catch(err) {
       return false;
    }
}

let loginUser = async (user) => {
    if(!user) return false;
    try{
       let db_user = await DbUser.findOne({ email: user.email });
       if(!db_user) return false;
       if(!await bcrypt.compare(user.password, db_user['password'])) return false;
       return {
        id: db_user.id,
        token: jwt.sign({id:db_user.id, email: db_user.email, name: db_user.name}, JWT_SECRET)
       };
    } catch(err) {
       return false;
    }
}

let verifyJWT = async (token) => {    
    try{
        let authData = jwt.verify(token.split(' ')[1], JWT_SECRET);
        return authData;
    } catch(err) {
        return false;
    }
}

let changePassword = async (id, credentials) => {
    try{
        let db_user = await DbUser.findById(id);
        if(!db_user) return false;  

        if(!await bcrypt.compare(credentials.old_password, db_user['password'])) return false;

        db_user['password'] = await bcrypt.hash(credentials.new_password, SALT_ROUNDS);
        let data = await DbUser.findByIdAndUpdate(db_user._id, db_user, {new: true});
        return data;
    } catch(err) {
       return false;
    }
}

let getUserDetails = async (id) => {
    try{
        let db_user = await DbUser.findById(id);
        if(!db_user) return false;   
        return db_user;
    } catch(err) {
       return false;
    }
}

// GraphQL Section

const { ApolloServer, gql } = require('apollo-server');
const { GraphQLError } = require('graphql');

const typeDefs = `#graphql
    type User {
        id: String,
        name: String
        email: String
        roles: [String]
        created: String
    }

    type UserToken {
        id: String,
        token: String
    }

    input UserCreateInput {
        name: String!
        email: String!
        roles: [String]!
        password: String!
    }

    input UserLoginInput {
        email: String!
        password: String!
    }

    input UserChangePasswordInput {
        old_password: String!
        new_password: String!
    }
   
    type Mutation {
        createUser(user: UserCreateInput): User
    }   

    type Mutation {
        loginUser(user: UserLoginInput): UserToken
    }    

    type Mutation {
        changePassword(credentials: UserChangePasswordInput): User
    }
    
    type Query {
        getAuthUser: User
    }
`;

const resolvers = {
    Mutation: {
        createUser: async (parent, args, context, info) => {
            let data = await createNewUser(args.user);
            if(!data) {
                throw new GraphQLError ('Uable to create new user.', {
                    extensions: {
                      code: 'BAD_USER_INPUT',
                    },
                });
            }
            return data;
        },
        loginUser: async (parent, args, context, info) => {
            let data = await loginUser(args.user);
            if(!data) {
                throw new GraphQLError('Invalid Credentials.', {
                    extensions: {
                      code: 'FORBIDDEN',
                    },
                });
            }
            return data;
        },
        changePassword: async (parent, args, context, info) => {    
            let authUser = await verifyJWT(context.headers.authorization);   
            
            if(!authUser) {
                throw new GraphQLError('Unauthorized!', {
                    extensions: {
                        code: 'Unauthorized!',
                        http: {
                            status: 401
                        },
                    }
                });
            }
            let result =  await changePassword(authUser.id, args.credentials); 
            if(!result) {
                throw new GraphQLError('Unauthorized!', {
                    extensions: {
                        code: 'Unauthorized!',
                        http: {
                            status: 401
                        },
                    }
                });
            }
            return result; 
        }        
    },
    Query: {
        getAuthUser: async (parent, args, context, info) => {
            let authUser = await verifyJWT(context.headers.authorization);   
            if(!authUser) {
                throw new GraphQLError('Unauthorized!', {
                    extensions: {
                        code: 'Unauthorized!',
                        http: {
                            status: 401
                        },
                    }
                });
            }
            return await getUserDetails(authUser.id);
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        return req
    },
});

server.listen(5000).then(({ url }) => {
    console.log(`GraphQL🚀 Server ready at ${url}`);
});

// Rest of the Application
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})