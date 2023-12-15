import { gql } from '@apollo/client';

export const COUNTRY_LIST = gql`
  query countries {
    countries {
      id
      code
      name
    }
  }
`;

export const COUNTRY_BY_CODE = gql`
  query countryByCode($code: String!) {
    countryByCode(code: $code) {
      id
      code
      name
    }
  }
`;
