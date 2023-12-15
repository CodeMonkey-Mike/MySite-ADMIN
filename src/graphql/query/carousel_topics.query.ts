import { gql } from '@apollo/client';

export const CAROUSEL_TOPICS = gql`
  query {
    getCarouselTopics {
      errors {
        message
      }
      carouselTopics {
        id
        topic
        content
        created_at
      }
    }
  }
`;
