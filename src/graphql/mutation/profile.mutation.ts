import { gql } from '@apollo/client';

export const UPDATE_PROFILE = gql`
  mutation updateProfile(
    $id: Float
    $address: String
    $address1: String
    $name: String
    $phone: String
    $email: String
    $hobby: String
    $web: String
    $dob: String
    $birthPlace: String
    $bio: String
    $hide_experience: Boolean
  ) {
    updateProfile(
      options: {
        id: $id
        address: $address
        address1: $address1
        bio: $bio
        birthPlace: $birthPlace
        dob: $dob
        email: $email
        hobby: $hobby
        name: $name
        phone: $phone
        web: $web
        hide_experience: $hide_experience
      }
    ) {
      errors {
        field
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
        hide_experience
      }
    }
  }
`;

export const UPLOAD_CV = gql`
  mutation uploadCV($id: Float!, $file: Upload!) {
    uploadCV(id: $id, file: $file)
  }
`;

export const UPLOAD_MEDIA_KIT = gql`
  mutation uploadMediaKit($id: Float!, $file: Upload!) {
    uploadMediaKit(id: $id, file: $file)
  }
`;

export const UPLOAD_SLIDER = gql`
  mutation uploadSlides($id: Float!, $files: [Upload!], $deleted_files: [String!]) {
    uploadSlides(id: $id, files: $files, deleted_files: $deleted_files)
  }
`;
