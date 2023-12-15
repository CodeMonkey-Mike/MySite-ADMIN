import { gql } from '@apollo/client';
import { portfolioFragment } from '../query/portfolios.query';

export const CREATE_PORTFOLIO = gql`
  mutation createPortfolio(
    $file: Upload!,
    $gallery: [Upload!],
    $type: String!,
    $client: String!,
    $description: String!,
    $category: String,
    $url: String,
    $year: String,
    $detail: String,
    $facebook: String,
    $twitter: String,
    $pinterest: String,
    $linkedin: String,
    $sequence: Float!
    ) {
    createPortfolio(
      options: { 
        type: $type,
        client: $client,
        description: $description,
        category: $category,
        url: $url,
        year: $year,
        detail: $detail,
        facebook: $facebook,
        twitter: $twitter,
        pinterest: $pinterest,
        linkedin: $linkedin,
        sequence: $sequence
      },
      file: $file
      gallery: $gallery
      ) {
      errors {
        field
        message
      }
      portfolios {
        ${portfolioFragment}
      }
      photos {
        id
        url
        parent_id
        category
      }
    }
  }
`;

export const DELETE_PORTFOLIO = gql`
  mutation deletePortfolio($id: Float!) {
    deletePortfolio(id: $id) {
      errors {
        field
        message
      }
      portfolios {
        ${portfolioFragment}
      }
    }
  }
`;

export const UPDATE_PORTFOLIO = gql`
  mutation updatePortfolio(
      $id: Float!,
      $file: Upload,
      $gallery: [Upload!],
      $deleted_gl: [DPhoto!],
      $type: String!,
      $client: String!,
      $description: String!,
      $category: String,
      $url: String,
      $year: String,
      $detail: String,
      $facebook: String,
      $twitter: String,
      $pinterest: String,
      $linkedin: String,
      $sequence: Float!
    ) {
    updatePortfolio(
      options: { 
        id: $id, 
        type: $type,
        client: $client,
        description: $description,
        category: $category,
        url: $url,
        year: $year,
        detail: $detail,
        facebook: $facebook,
        twitter: $twitter,
        pinterest: $pinterest,
        linkedin: $linkedin,
        sequence: $sequence
      },
      file: $file,
      gallery: $gallery,
      deleted_gl: $deleted_gl
      ) {
      errors {
        field
        message
      }
      portfolios {
        ${portfolioFragment}
      }
    }
  }
`;

export const BULK_UPDATE_PORTFOLIO = gql`
  mutation bulkUpdatePortfolios($options: [PortfoliosTypes!]!) {
    bulkUpdatePortfolios(options: $options) {
      errors {
        field
        message
      }
      portfolios {
        ${portfolioFragment}
      }
    }
  }
`;
