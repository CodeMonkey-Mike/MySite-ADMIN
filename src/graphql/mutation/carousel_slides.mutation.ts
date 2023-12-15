import { gql } from '@apollo/client';

export const CREATE_CAROUSEL_SLIDE = gql`
  mutation createCarouselSlide(
    $description: String!
    $hashtag: String!
    $sequence: String!
    $carousel_id: Float!
  ) {
    createPoll(
      options: {
        description: $description
        hashtag: $hashtag
        sequence: $sequence
        carousel_id: $carousel_id
      }
    ) {
      errors {
        field
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

export const DELETE_CAROUSEL_SLIDE = gql`
  mutation deleteCarouselSlide($id: Float!) {
    deleteCarouselSlide(id: $id) {
      errors {
        field
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

export const UPDATE_CAROUSEL_SLIDE = gql`
  mutation updateCarouselSlide(
    $id: Float!
    $description: String!
    $hashtag: String!
    $sequence: String!
    $carousel_id: Float
  ) {
    updateCarouselSlide(
      options: {
        id: $id
        description: $description
        hashtag: $hashtag
        sequence: $sequence
        carousel_id: $carousel_id
      }
    ) {
      errors {
        field
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
