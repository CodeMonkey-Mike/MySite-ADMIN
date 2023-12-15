import { gql } from '@apollo/client';

export const portfolioFragment = `
  id
  type
  logo
  client
  description
  category
  url
  year
  detail
  facebook
  twitter
  pinterest
  linkedin
  sequence
`;

export const PORTFOLIO = gql`
  query {
    getPortfolios {
      errors {
        field
        message
      }
      portfolios {
        ${portfolioFragment}
      }
    }
  }
`;
