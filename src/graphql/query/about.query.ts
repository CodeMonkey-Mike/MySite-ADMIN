import { gql } from '@apollo/client';

export const ABOUT_ME = gql`
  query {
    getProfile {
      errors {
        message
      }
      profile {
        id
        address
        address1
        bio
        birthPlace
        dob
        email
        hobby
        name
        phone
        web
        cv
        media_kit
        hide_experience
        slider_images
      }
    }
  }
`;
