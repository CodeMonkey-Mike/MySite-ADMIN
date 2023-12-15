import { gql } from '@apollo/client';

export const SUBMISSION = gql`
  mutation submission($email: String!, $firstName: String!, $lastName: String!) {
    submission(options: { email: $email, first_name: $firstName, last_name: $lastName }) {
      errors {
        field
        message
      }
      user {
        id
        first_name
        last_name
        email
      }
    }
  }
`;

export const REGISTER = gql`
  mutation register($email: String!, $username: String!, $password: String!) {
    register(options: { email: $email, username: $username, password: $password }) {
      errors {
        field
        message
      }
      user {
        id
        username
        email
        role_id
      }
    }
  }
`;

export const LOGIN = gql`
  mutation login($usernameOrEmail: String!, $password: String!) {
    login(usernameOrEmail: $usernameOrEmail, password: $password) {
      errors {
        field
        message
      }
      user {
        id
        username
        email
        role_id
      }
      token
    }
  }
`;

export const LOGOUT = gql`
  mutation logout {
    logout
  }
`;

export const DELETE = gql`
  mutation delete($email: String!) {
    delete(email: $email)
  }
`;

export const UPDATE_ROLE = gql`
  mutation updateRole($id: Float!, $role_id: Float!) {
    updateUser(id: $id, role_id: $role_id) {
      errors {
        field
        message
      }
      user {
        id
        username
        email
        role_id
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($id: Float!, $email: String!, $username: String!) {
    updateUser(id: $id, email: $email, username: $username) {
      errors {
        field
        message
      }
      user {
        id
        username
        email
        role_id
      }
    }
  }
`;
