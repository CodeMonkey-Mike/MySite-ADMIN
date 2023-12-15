import { gql } from '@apollo/client';

export const NEWSLETTER = gql`
  query {
    getNewsletter {
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
