import { gql } from '@apollo/client';

export const CREATE_AWARD = gql`
  mutation createAward($file: Upload!, $title: String!, $company: String!, $awardTime: String!) {
    createAward(options: { title: $title, company: $company, awardTime: $awardTime }, file: $file) {
      errors {
        field
        message
      }
      awards {
        id
        title
        image
        company
        awardTime
      }
    }
  }
`;

export const DELETE_AWARD = gql`
  mutation deleteAward($id: Float!) {
    deleteAward(id: $id) {
      errors {
        field
        message
      }
      awards {
        id
        title
        image
        company
        awardTime
      }
    }
  }
`;

export const UPDATE_AWARD = gql`
  mutation updateAward(
    $id: Float!
    $file: Upload
    $title: String!
    $company: String!
    $awardTime: String!
  ) {
    updateAward(
      options: { id: $id, title: $title, company: $company, awardTime: $awardTime }
      file: $file
    ) {
      errors {
        field
        message
      }
      awards {
        id
        title
        image
        company
        awardTime
      }
    }
  }
`;
