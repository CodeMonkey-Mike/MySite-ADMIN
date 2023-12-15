import { gql } from '@apollo/client';

const PROFILE_FRAGMENT = gql`
  fragment profile on Profile {
    id
    address1
    address2
    state_province
    postal_code
    gender
    country
    picture
  }
`;

export const LOGGED_IN = gql`
  query getUser {
    me {
      id
      username
      role_id
      email
      info {
        ...profile
      }
    }
  }
  ${PROFILE_FRAGMENT}
`;

export const USER_BY_ID = gql`
  query userById($id: Float!) {
    userById(id: $id) {
      id
      username
      role_id
      email
      info {
        ...profile
      }
    }
  }
  ${PROFILE_FRAGMENT}
`;

export const USER_BY_USERNAME = gql`
  query userByUsername($username: String!) {
    userByUsername(username: $username) {
      id
      username
      role_id
      email
      info {
        ...profile
      }
      country {
        id
        code
        name
      }
    }
  }
  ${PROFILE_FRAGMENT}
`;

export const USER_LIST = gql`
  query getUsers {
    userList {
      id
      username
      role_id
      email
    }
  }
`;

export const SUB_LIST = gql`
  query getSubmissionUsers {
    submissionList {
      id
      first_name
      last_name
      email
    }
  }
`;

export const REFRESH_TOKEN = gql`
  query refreshToken {
    refreshToken {
      errors {
        field
        message
      }
      token
    }
  }
`;
