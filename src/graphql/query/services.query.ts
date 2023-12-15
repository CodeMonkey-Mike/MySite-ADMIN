import { gql } from '@apollo/client';

export const SERVICES = gql`
  query {
    getServices {
      errors {
        message
      }
      services {
        id
        name
        image
      }
    }
  }
`;
