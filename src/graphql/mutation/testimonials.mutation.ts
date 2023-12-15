import { gql } from '@apollo/client';

export const CREATE_TESTIMONIAL = gql`
  mutation createTestimonial($name: String!, $company: String!, $quote: String!) {
    createTestimonial(options: { name: $name, company: $company, quote: $quote }) {
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

export const DELETE_TESTIMONIAL = gql`
  mutation deleteTestimonial($id: Float!) {
    deleteTestimonial(id: $id) {
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

export const UPDATE_TESTIMONIAL = gql`
  mutation updateTestimonial($id: Float!, $name: String!, $company: String!, $quote: String!) {
    updateTestimonial(options: { id: $id, name: $name, company: $company, quote: $quote }) {
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
