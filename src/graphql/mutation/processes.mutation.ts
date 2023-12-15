import { gql } from '@apollo/client';

export const CREATE_PROCESS = gql`
  mutation createProcess($name: String!, $icon: String!, $sequence: Float!) {
    createProcess(options: { name: $name, icon: $icon, sequence: $sequence }) {
      errors {
        field
        message
      }
      processes {
        id
        name
        sequence
        icon
      }
    }
  }
`;

export const DELETE_PROCESS = gql`
  mutation deleteProcess($id: Float!) {
    deleteProcess(id: $id) {
      errors {
        field
        message
      }
      processes {
        id
        name
        sequence
        icon
      }
    }
  }
`;

export const UPDATE_PROCESS = gql`
  mutation updateProcess($id: Float!, $name: String!, $icon: String!, $sequence: Float!) {
    updateProcess(options: { id: $id, name: $name, icon: $icon, sequence: $sequence }) {
      errors {
        field
        message
      }
      processes {
        id
        name
        sequence
        icon
      }
    }
  }
`;

export const BULK_UPDATE_PROCESS = gql`
  mutation bulkUpdateProcesses($options: [ProcessesTypes!]!) {
    bulkUpdateProcesses(options: $options) {
      errors {
        field
        message
      }
      processes {
        id
        name
        sequence
        icon
      }
    }
  }
`;
