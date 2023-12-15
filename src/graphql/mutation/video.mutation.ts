import { gql } from '@apollo/client';

export const CREATE_VIDEO = gql`
  mutation createVideo($url: String!, $title: String!) {
    createVideo(options: { url: $url, title: $title }) {
      errors {
        field
        message
      }
      video {
        id
        url
        title
      }
    }
  }
`;
export const UPDATE_VIDEO = gql`
  mutation updateVideo($id: Float!, $url: String!, $title: String!) {
    updateVideo(options: { id: $id, url: $url, title: $title }) {
      errors {
        field
        message
      }
      video {
        id
        url
        title
      }
    }
  }
`;
