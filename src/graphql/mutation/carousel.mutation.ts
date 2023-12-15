import { gql } from '@apollo/client';

export const DELETE_CAROUSEL = gql`
  mutation deleteCarousel($id: Float!) {
    deleteCarousel(id: $id) {
      errors {
        field
        message
      }
      carousel {
        id
        title
      }
    }
  }
`;
