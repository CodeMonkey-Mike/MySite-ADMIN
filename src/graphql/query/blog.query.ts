import { gql } from '@apollo/client';

export const BLOG = gql`
  query {
    getPosts {
      errors {
        field
        message
      }
      posts {
        id
        title
        status
        image
        content
        author
        tags
        slug
        anchor_title
        editor_type
        category
      }
    }
  }
`;

export const ALL_BLOG = gql`
  query {
    getAllPosts {
      errors {
        field
        message
      }
      posts {
        id
        title
        image
        content
        status
        slug
        author
        tags
        anchor_title
        editor_type
        category
      }
    }
  }
`;
