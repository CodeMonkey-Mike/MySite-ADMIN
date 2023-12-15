import { gql } from '@apollo/client';

export const EDUCATIONS = gql`
  query {
    getEducations {
      errors {
        message
      }
      educations {
        id
        degree
        description
        location
        school
        startMonth
        startYear
        endMonth
        endYear
      }
    }
  }
`;
