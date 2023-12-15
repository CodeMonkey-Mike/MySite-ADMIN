import { gql } from '@apollo/client';

export const experienceFragment = `
    id
    title
    description
    website
    website_url
    company
    current
    hide
    startMonth
    startYear
    endMonth
    endYear
    sequence
`;

export const EDUCATIONS = gql`
  query {
    getExperiences {
      errors {
        message
      }
      experiences {
        ${experienceFragment}
      }
    }
  }
`;
