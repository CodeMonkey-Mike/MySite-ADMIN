import { gql } from '@apollo/client';

export const POLL = gql`
  query {
    getPolls {
      errors {
        message
      }
      polls {
        id
        title
        topic
        category
        created_at
        options
      }
    }
  }
`;
