import { gql } from '@apollo/client';

export const AWARD = gql`
  query {
    getAwards {
      errors {
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
