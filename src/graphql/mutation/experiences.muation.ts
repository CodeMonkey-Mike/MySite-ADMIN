import { gql } from '@apollo/client';
import { experienceFragment } from 'src/graphql/query/experiences.query';

export const CREATE_EXPERIENCE = gql`
  mutation createExperience(
    $title: String!,
    $description: String!,
    $website: String,
    $website_url: String,
    $company: String!,
    $current: Boolean!,
    $hide: Boolean!,
    $startMonth: Float!,
    $startYear: Float!,
    $endMonth: Float!,
    $endYear: Float!,
    $sequence: Float!
  ) {
    createExperience(
      options: {
        title: $title,
        website: $website,
        website_url: $website_url,
        company: $company,
        description: $description,
        current: $current,
        hide: $hide,
        startMonth: $startMonth,
        startYear: $startYear,
        endMonth: $endMonth,
        endYear: $endYear,
        sequence: $sequence
      }
    ) {
      errors {
        field
        message
      }
      experiences {
        ${experienceFragment}
      }
    }
  }
`;

export const DELETE_EXPERIENCE = gql`
  mutation deleteExperience($id: Float!) {
    deleteExperience(id: $id) {
      errors {
        field
        message
      }
      experiences {
        ${experienceFragment}
      }
    }
  }
`;

export const UPDATE_EXPERIENCE = gql`
  mutation updateExperience(
    $id: Float!,
    $title: String!,
    $description: String!,
    $website: String,
    $website_url: String,
    $company: String!,
    $current: Boolean!,
    $hide: Boolean!,
    $startMonth: Float!,
    $startYear: Float!,
    $endMonth: Float!,
    $endYear: Float!,
    $sequence: Float!
  ) {
    updateExperience(
      options: {
        id: $id,
        title: $title,
        description: $description,
        website: $website,
        website_url: $website_url,
        company: $company,
        current: $current,
        hide: $hide,
        startMonth: $startMonth,
        startYear: $startYear,
        endMonth: $endMonth,
        endYear: $endYear,
        sequence: $sequence
      }
    ) {
      errors {
        field
        message
      }
      experiences {
        ${experienceFragment}
      }
    }
  }
`;

export const BULK_UPDATE_EXPERIENCE = gql`
  mutation bulkUpdateExperiences($options: [ExperiencesTypes!]!) {
    bulkUpdateExperiences(options: $options) {
      errors {
        field
        message
      }
      experiences {
        ${experienceFragment}
      }
    }
  }
`;
