import { gql } from "@apollo/client";

export const ADD_MOVIE = gql`
mutation addMovie($movieTitle: String!) {
  addMovie (movieTitle: $movieTitle) {
    _id
    movieTitle
    username
  }
}
`;
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const EDIT_USER = gql`
  mutation editUser($username: String, $age: String $weight: String, $height: String, $role: String, $ethnicity: String, $description: String, $photoURL: String,) {
    editUser(username: $username, age: $age, weight: $weight, height: $height, role: $role, ethnicity: $ethnicity, description: $description, photoURL: $photoURL) {
      token
      user {
        _id
        username
        weight
        height
        age
        role
        ethnicity
        description
        photoURL
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER_INTERESTS = gql`
  mutation addUserInterests($interests: [Interests]) {
    addUserInterests(interests: $interests) {
      token
      user {
        _id
        username
        interests
      }
    }
  }
`;

export const DELETE_USER_INTERESTS = gql`
  mutation deleteUserInterests($interests: [Interests]) {
    deleteUserInterests(interests: $interests) {
      token
      user {
        _id
        username
        interests
      }
    }
  }
`;

export const ADD_FRIEND = gql`
  mutation addFriend($id: ID!) {
    addFriend(friendId: $id) {
      _id
      username
      friendCount
      friends {
        _id
        username
      }
    }
  }
`;

export const POST_MESSAGE = gql`
mutation postMessage($username: String, $text: String, $recipient: String) {
  postMessage (username: $username, text: $text, recipient: $recipient) {
    _id
    text
    username
    recipient
    createdAt
  }
}
`;
