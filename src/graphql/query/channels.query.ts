import { gql } from '@apollo/client';

export const CHANNELS = gql`
  query {
    getChannels {
      errors {
        message
      }
      channels {
        id
        url
        icon
        visible
        sequence
      }
    }
  }
`;
