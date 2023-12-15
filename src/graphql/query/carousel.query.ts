import { gql } from '@apollo/client';

export const CAROUSEL = gql`
  query {
    getCarousels {
      errors {
        message
      }
      carousel {
        id
        title
        created_at
      }
    }
  }
`;
