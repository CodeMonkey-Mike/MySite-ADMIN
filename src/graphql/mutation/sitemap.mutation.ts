import { gql } from '@apollo/client';

export const UPDATE_SITEMAP = gql`
  mutation updateSitemap($id: Float!, $sitemap: String!) {
    updateSitemap(id: $id, sitemap: $sitemap)
  }
`;
