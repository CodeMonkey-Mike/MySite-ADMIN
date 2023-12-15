import { gql } from '@apollo/client';

export const DELETE = gql`
  mutation deletePhoto(
    $id: Float!
    $parent_id: Float!
    category: String!
    ) {
    deletePhoto(
      id: $id
      parent_id: $parent_id
      category: $category
    ) {
      errors {
        field
        message
      }
    }
  }
`;
