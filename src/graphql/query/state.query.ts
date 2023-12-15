import { gql } from '@apollo/client';

export const STATE_LIST = gql`
  query getStateByCountry($id: Float!) {
    getStateByCountry(id: $id) {
      id
      name
      country_id
    }
  }
`;
