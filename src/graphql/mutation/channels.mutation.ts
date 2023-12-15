import { gql } from '@apollo/client';

export const CREATE_CHANNEL = gql`
  mutation createChannel($url: String!, $icon: String!, $sequence: Float!, $visible: Boolean!) {
    createChannel(options: { url: $url, icon: $icon, sequence: $sequence, visible: $visible }) {
      errors {
        field
        message
      }
      channels {
        id
        url
        sequence
        icon
        visible
      }
    }
  }
`;

export const DELETE_CHANNEL = gql`
  mutation deleteChannel($id: Float!) {
    deleteChannel(id: $id) {
      errors {
        field
        message
      }
      channels {
        id
        url
        sequence
        icon
        visible
      }
    }
  }
`;

export const UPDATE_CHANNEL = gql`
  mutation updateChannel(
    $id: Float!
    $url: String!
    $icon: String!
    $sequence: Float!
    $visible: Boolean!
  ) {
    updateChannel(
      options: { id: $id, url: $url, icon: $icon, sequence: $sequence, visible: $visible }
    ) {
      errors {
        field
        message
      }
      channels {
        id
        url
        sequence
        icon
        visible
      }
    }
  }
`;

export const BULK_UPDATE_CHANNEL = gql`
  mutation bulkUpdateChanneles($options: [ChannelesTypes!]!) {
    bulkUpdateChanneles(options: $options) {
      errors {
        field
        message
      }
      channels {
        id
        url
        sequence
        icon
        visible
      }
    }
  }
`;
