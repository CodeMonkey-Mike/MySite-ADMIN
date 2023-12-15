import { gql } from '@apollo/client';

export const MY_SKILLS = gql`
  query {
    getSkills {
      errors {
        message
      }
      skills {
        id
        name
        strength
        sequence
      }
    }
  }
`;
