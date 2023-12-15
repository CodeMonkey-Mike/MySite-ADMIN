import { gql } from '@apollo/client';

export const CREATE_SKILL = gql`
  mutation createSkill($name: String!, $strength: Float!, $sequence: Float!) {
    createSkill(options: { name: $name, strength: $strength, sequence: $sequence }) {
      errors {
        field
        message
      }
      skills {
        id
        name
        sequence
        strength
      }
    }
  }
`;

export const DELETE_SKILL = gql`
  mutation deleteSkill($id: Float!) {
    deleteSkill(id: $id) {
      errors {
        field
        message
      }
      skills {
        id
        name
        sequence
        strength
      }
    }
  }
`;

export const UPDATE_SKILL = gql`
  mutation updateSkill($id: Float!, $name: String!, $strength: Float!, $sequence: Float!) {
    updateSkill(options: { id: $id, name: $name, strength: $strength, sequence: $sequence }) {
      errors {
        field
        message
      }
      skills {
        id
        name
        sequence
        strength
      }
    }
  }
`;

export const BULK_UPDATE_SKILL = gql`
  mutation bulkUpdateSkills($options: [SkillsTypes!]!) {
    bulkUpdateSkills(options: $options) {
      errors {
        field
        message
      }
      skills {
        id
        name
        sequence
        strength
      }
    }
  }
`;
