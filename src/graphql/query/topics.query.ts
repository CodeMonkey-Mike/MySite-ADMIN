import { gql } from '@apollo/client';

export const TOPICS = gql`
  query {
    getNewsletterTopics {
      errors {
        field
        message
      }
      newsletterTopics {
        id
        title
      }
    }
  }
`;
