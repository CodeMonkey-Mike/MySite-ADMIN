import { gql } from '@apollo/client';

export const CREATE_CAROUSEL_TOPICS = gql`
  mutation createCarouselTopic($topic: String, $content: String!) {
    createCarouselTopic(options: { topic: $topic, content: $content }) {
      errors {
        field
        message
      }
      carouselTopics {
        id
        topic
        content
      }
    }
  }
`;

export const DELETE_CAROUSEL_TOPICS = gql`
  mutation deleteCarouselTopic($id: Float!) {
    deleteCarouselTopic(id: $id) {
      errors {
        field
        message
      }
      carouselTopics {
        id
        topic
        content
      }
    }
  }
`;

export const UPDATE_CAROUSEL_TOPICS = gql`
  mutation updateCarouselTopic($id: Float!, $topic: String!, $content: String!) {
    updateCarouselTopic(options: { id: $id, topic: $topic, content: $content }) {
      errors {
        field
        message
      }
      carouselTopics {
        id
        topic
        content
      }
    }
  }
`;
