import { gql } from '@apollo/client';

// export const QUERY_MOVIES = gql`
// query Movies {
//   movies {
//     _id
//     movieTitle
//     createdAt
//     username
//   }
// }
  
// `;
// export const QUERY_MOVIE = gql`
//   query movie($id: ID!) {
//     movie(_id: $id) {
//       _id
//       movieTitle
//       createdAt
//       username
//       reactionCount
//       reactions {
//         _id
//         createdAt
//         username
//         reactionBody
//       }
//     }
//   }
// `;

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      friendCount
      age
      role
      friends {
        _id
        username
      }
      thoughts {
        _id
        thoughtText
        createdAt
        reactionCount
      }
    }
  }
`;

export const QUERY_USERS = gql`
query Users {
  users {
    _id
    friends{
      _id
      username
    }
    username
    age
    height
    weight
    ethnicity
    role
    photoURL
    description
    location
  }
}
`;

export const QUERY_USERS_BY_ROLE = gql`
query usersByRole($role: String!) {
  usersByRole(role: $role) {
    _id
    username
    age
    height
    weight
    ethnicity
    role
    photoURL
    description
    location
  }
}
`;

export const QUERY_USERS_BY_ID = gql`
query usersById($_id: [ID!]) {
  usersById(_id: $_id) {
    _id
    username
    interests
    role
  }
}
`;

export const QUERY_ME = gql`
query Query {
  me {
    _id
    username
    weight
    height
    ethnicity
    role
    age
    interests
    location
    friends{
      _id
      username
    }
    description
    photoURL
   
  }
}
`;

export const QUERY_MESSAGES = gql`
query messages {
  messages {
    _id
    username
    text
  }
}
`;

export const QUERY_MESSAGES_TO_RECIPIENT = gql`
query messagesToRecipient($username: String!, $recipient: String!) {
  messagesToRecipient(username: $username, recipient: $recipient) {
    _id
    username
    recipient
    createdAt
    text
  }
}
`;