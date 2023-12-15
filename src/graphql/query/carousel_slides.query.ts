import { gql } from '@apollo/client';

export const CAROUSEL_SLIDES = gql`
  query getCarouselSlides($carousel_id: Float!) {
    getCarouselSlides(carousel_id: $carousel_id) {
      errors {
        message
      }
      carouselSlides {
        id
        description
        hashtag
        sequence
        carousel_id
        created_at
      }
    }
  }
`;
