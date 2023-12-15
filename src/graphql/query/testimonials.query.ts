import { gql } from '@apollo/client';

export const TESTIMONIALS = gql`
  query {
    getTestimonials {
      errors {
        field
        message
      }
      testimonials {
        id
        name
        company
        quote
      }
    }
  }
`;
