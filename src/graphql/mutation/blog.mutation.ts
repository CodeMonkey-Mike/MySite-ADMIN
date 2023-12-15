import { gql } from '@apollo/client';

export const CREATE_BLOG = gql`
  mutation createPost(
    $title: String!
    $status: String
    $content: String!
    $author: String!
    $tags: String
    $anchor_title: String
    $editor_type: String!
    $category: String!
    $file: Upload
  ) {
    createPost(
      options: {
        title: $title
        status: $status
        content: $content
        author: $author
        tags: $tags
        anchor_title: $anchor_title
        editor_type: $editor_type
        category: $category
      }
      file: $file
    ) {
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
        anchor_title
        editor_type
        category
      }
    }
  }
`;

export const DELETE_BLOG = gql`
  mutation deletePost($id: Float!) {
    deletePost(id: $id) {
      errors {
        field
        message
      }
      posts {
        id
        status
        title
        image
        content
        author
        tags
        anchor_title
        editor_type
        category
      }
    }
  }
`;

export const UPDATE_BLOG = gql`
  mutation updatePost(
    $id: Float!
    $title: String!
    $content: String!
    $author: String!
    $tags: String!
    $status: String!
    $slug: String
    $anchor_title: String
    $editor_type: String!
    $category: String!
    $file: Upload
  ) {
    updatePost(
      options: {
        id: $id
        title: $title
        status: $status
        content: $content
        slug: $slug
        anchor_title: $anchor_title
        editor_type: $editor_type
        category: $category
        author: $author
        tags: $tags
      }
      file: $file
    ) {
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
