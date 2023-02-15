/// -- import the gql tagged template function -- ///
const { gql } = require("graphql-tag");

/// ----  create our typeDefs ---- ///
const typeDefs = gql`

  enum Interests {
    ART
    BIKING
    COOKING
    DANCING
    HIKING
  }

  type Message {
    _id: ID
    username: String
    text: String
    createdAt: String
    recipient: String
  }

  type User {
    _id: ID
    username: String
    age: String
    email: String
    height: String
    weight: String
    role: String
    ethnicity: String
    description: String
    photoURL: String
    friendCount: Int
    interests: [Interests]
    friends: [User]
    messages: [Message]
    location: [Float]
  }

  type Movie {
    _id: ID
    movieTitle: String
    createdAt: String
    username: String
  }
  type Auth {
    token: ID!
    user: User
  }

  type Subscription {
    messagePosted: Message
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    usersByRole(role: String!): [User]
    usersById(_id: [ID!]): [User]
    messages: [Message!]  
    messagesToRecipient(username: String!, recipient: String!): [Message!]
  }
  
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    editUser(username: String, age: String, height: String, weight: String, role: String, ethnicity: String, description: String, photoURL: String,): Auth
    addUserInterests(interests: [Interests]) : Auth
    deleteUserInterests(interest: [Interests]) : Auth
    addMovie(movieTitle: String!): Movie
    addReaction(movieId: ID!, reactionBody: String!): Movie
    addFriend(friendId: ID!): User
    removeFriend(friendId: ID!): User
    postMessage(username: String, text: String, recipient: String): Message
  }
`;

// export the typeDefs
module.exports = typeDefs;
