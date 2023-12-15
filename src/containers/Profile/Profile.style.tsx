import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';

const PageWrapper = styled.div`
  width: 100%;
  max-width: ${themeGet('breakpoints.desktopHd')};
  height: auto;
  display: flex;
  flex-wrap: wrap;
  background-color: var(--color-white);
  padding: 70px 40px;

  @media only screen and (max-width: 990px) {
    padding: 100px 0 60px;
  }

  @media only screen and (min-width: 991px) and (max-width: 1280px) {
    padding: 130px 15px 60px;
  }
`;

const SidebarSection = styled.div`
  width: 300px;
  flex-shrink: 0;
  margin-right: 30px;

  @media only screen and (max-width: 1199px) {
    margin-right: auto;
    margin-left: auto;
  }
`;

const ContentBox = styled.div`
  width: calc(100% - 360px);
  height: auto;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  padding: 30px 50px 20px;
  border: 1px solid ${themeGet('colors.borderColor', '#e6e6e6')};

  @media only screen and (max-width: 1199px) {
    width: 100%;
    border: 0;
    padding: 20px;
  }
`;

export { PageWrapper, SidebarSection, ContentBox };
