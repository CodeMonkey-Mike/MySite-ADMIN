import { gql } from '@apollo/client';

export const VIDEO = gql`
  query {
    getVideo {
      errors {
        field
        message
      }
      video {
        id
        url
        title
      }
    }
  }
`;
