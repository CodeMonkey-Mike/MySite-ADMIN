import { gql } from '@apollo/client';

export const CREATE_EDUCATION = gql`
  mutation createEducation(
    $degree: String!
    $description: String!
    $location: String!
    $school: String!
    $startMonth: Float!
    $startYear: Float!
    $endMonth: Float!
    $endYear: Float!
  ) {
    createEducation(
      options: {
        degree: $degree
        description: $description
        location: $location
        school: $school
        startMonth: $startMonth
        startYear: $startYear
        endMonth: $endMonth
        endYear: $endYear
      }
    ) {
      errors {
        field
        message
      }
      educations {
        id
        degree
        location
        description
        school
        startMonth
        startYear
        endMonth
        endYear
      }
    }
  }
`;

export const DELETE_EDUCATION = gql`
  mutation deleteEducation($id: Float!) {
    deleteEducation(id: $id) {
      errors {
        field
        message
      }
      educations {
        id
        degree
        location
        description
        school
        startMonth
        startYear
        endMonth
        endYear
      }
    }
  }
`;

export const UPDATE_EDUCATION = gql`
  mutation updateEducation(
    $id: Float!
    $degree: String!
    $description: String!
    $location: String!
    $school: String!
    $startMonth: Float!
    $startYear: Float!
    $endMonth: Float!
    $endYear: Float!
  ) {
    updateEducation(
      options: {
        id: $id
        degree: $degree
        description: $description
        location: $location
        school: $school
        startMonth: $startMonth
        startYear: $startYear
        endMonth: $endMonth
        endYear: $endYear
      }
    ) {
      errors {
        field
        message
      }
      educations {
        id
        description
        degree
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
