import { gql } from '@apollo/client';

export const CREATE_POLL = gql`
  mutation createPoll($title: String!, $topic: String!, $category: String!, $options: String!) {
    createPoll(options: { title: $title, topic: $topic, category: $category, options: $options }) {
      errors {
        field
        message
      }
      polls {
        id
        title
        topic
        category
        options
      }
    }
  }
`;

export const DELETE_POLL = gql`
  mutation deletePoll($id: Float!) {
    deletePoll(id: $id) {
      errors {
        field
        message
      }
      polls {
        id
        title
        topic
        category
        options
      }
    }
  }
`;

export const UPDATE_POLL = gql`
  mutation updatePoll(
    $id: Float!
    $title: String!
    $topic: String!
    $category: String!
    $options: String!
  ) {
    updatePoll(
      options: { id: $id, title: $title, topic: $topic, category: $category, options: $options }
    ) {
      errors {
        field
        message
      }
      polls {
        id
        title
        topic
        category
        options
      }
    }
  }
`;
