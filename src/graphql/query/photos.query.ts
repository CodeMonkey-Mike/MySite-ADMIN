import { gql } from '@apollo/client';

export const PHOTOS = gql`
  query getPhoto($parent_id: Float!, $category: String!) {
    getPhoto(parent_id: $parent_id, category: $category) {
      errors {
        message
      }
      photos {
        id
        url
        parent_id
        category
      }
    }
  }
`;
