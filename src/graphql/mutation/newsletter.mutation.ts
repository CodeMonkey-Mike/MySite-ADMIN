import { gql } from '@apollo/client';

export const DELETE_NEWSLETTER = gql`
  mutation deleteNewsletter($id: Float!) {
    deleteNewsletter(id: $id)
  }
`;

export const UPDATE_NEWSLETTER = gql`
  mutation updateNewsletter($id: Float!, $email: String!, $topics: String!) {
    updateNewsletter(options: { id: $id, email: $email, topics: $topics }) {
      errors {
        field
        message
      }
      newsletter {
        id
        email
        topics
      }
    }
  }
`;
