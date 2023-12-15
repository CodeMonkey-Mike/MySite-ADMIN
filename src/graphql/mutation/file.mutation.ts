import { gql } from '@apollo/client';

export const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload!) {
    uploadFile(file: $file) {
      file {
        id
        path
      }
    }
  }
`;

export const DELETE_FILE = gql`
  mutation deleteFile($ids: [Float!]!) {
    deleteFile(ids: $ids)
  }
`;
