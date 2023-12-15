import { gql } from '@apollo/client';

export const CREATE_YOUTUBE = gql`
  mutation createYoutube($title: String!, $url: String!, $code: String!, $sequence: Float!) {
    createYoutube(options: { title: $title, url: $url, code: $code, sequence: $sequence }) {
      errors {
        field
        message
      }
      youtubes {
        id
        title
        code
        url
        sequence
      }
    }
  }
`;

export const DELETE_YOUTUBE = gql`
  mutation deleteYoutube($id: Float!) {
    deleteYoutube(id: $id) {
      errors {
        field
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

export const UPDATE_YOUTUBE = gql`
  mutation updateYoutube(
    $id: Float!
    $title: String!
    $url: String!
    $code: String!
    $sequence: Float!
  ) {
    updateYoutube(
      options: { id: $id, title: $title, url: $url, code: $code, sequence: $sequence }
    ) {
      errors {
        field
        message
      }
      youtubes {
        id
        url
        title
        code
        sequence
      }
    }
  }
`;

export const BULK_UPDATE_YOUTUBE = gql`
  mutation bulkUpdateYoutubes($options: [YoutubesTypes!]!) {
    bulkUpdateYoutubes(options: $options) {
      errors {
        field
        message
      }
      youtubes {
        id
        url
        title
        code
        sequence
      }
    }
  }
`;
