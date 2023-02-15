import { gql } from '@apollo/client';


export const GET_MESSAGES = gql`
  subscription OnMessagePosted {
    messagePosted {
      _id
      username
      text
    }
  }
`;