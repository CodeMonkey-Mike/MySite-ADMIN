import { gql } from '@apollo/client';

export const PROCESSES = gql`
  query {
    getProcesses {
      errors {
        message
      }
      processes {
        id
        name
        icon
        sequence
      }
    }
  }
`;
