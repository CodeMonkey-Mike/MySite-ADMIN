import { gql } from '@apollo/client';

export const TAGS = gql`
  query {
    getTags {
      errors {
        field
        message
      }
      tags {
        id
        title
        slug
      }
    }
  }
`;
