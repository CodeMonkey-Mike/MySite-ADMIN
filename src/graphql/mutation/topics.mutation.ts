import { gql } from '@apollo/client';

export const DELETE_TOPICS = gql`
  mutation deleteNewsletterTopics($id: Float!) {
    deleteNewsletterTopics(id: $id)
  }
`;

export const CREATE_TOPICS = gql`
  mutation createNewsletterTopics($title: String!) {
    createNewsletterTopics(options: { title: $title }) {
      errors {
        field
        message
      }
      newsletterTopics {
        id
        title
      }
    }
  }
`;

export const UPDATE_TOPICS = gql`
  mutation updateNewsletterTopics($id: Float!, $title: String!) {
    updateNewsletterTopics(options: { id: $id, title: $title }) {
      errors {
        field
        message
      }
      newsletterTopics {
        id
        title
      }
    }
  }
`;

export const BULK_UPDATE_TOPICS = gql`
  mutation bulkUpdateNewsletters($options: [NewsletterTopicsTypes!]!) {
    bulkUpdateNewsletters(options: $options) {
      errors {
        field
        message
      }
      newsletterTopics {
        id
        sequence
        title
      }
    }
  }
`;
