import { gql } from '@apollo/client';

export const CREATE_TAG = gql`
  mutation createTag($title: String!) {
    createTag(options: { title: $title }) {
      errors {
        field
        message
      }
      tags {
        id
        title
        slug
      }
    }
  }
`;

export const DELETE_TAG = gql`
  mutation deleteTag($id: Float!) {
    deleteTag(id: $id) {
      errors {
        field
        message
      }
      tags {
        id
        title
        slug
      }
    }
  }
`;
