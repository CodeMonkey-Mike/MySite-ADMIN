import { gql } from '@apollo/client';

export const YOUTUBES = gql`
  query {
    getYoutubes {
      errors {
        message
      }
      youtubes {
        id
        title
        url
        code
        sequence
      }
    }
  }
`;
