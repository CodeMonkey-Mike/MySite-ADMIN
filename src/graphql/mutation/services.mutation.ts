import { gql } from '@apollo/client';

export const CREATE_SERVICE = gql`
  mutation createService($file: Upload!, $name: String!) {
    createService(options: { name: $name }, file: $file) {
      errors {
        field
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

export const DELETE_SERVICE = gql`
  mutation deleteService($id: Float!) {
    deleteService(id: $id) {
      errors {
        field
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

export const UPDATE_SERVICE = gql`
  mutation updateService($id: Float!, $file: Upload!, $name: String!) {
    updateService(options: { id: $id, name: $name }, file: $file) {
      errors {
        field
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
