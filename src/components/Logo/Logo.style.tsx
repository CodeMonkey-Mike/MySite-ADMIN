import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';

export const LogoBox = styled.div`
  text-align: left;
  padding: 5px 0;
`;

export const LogoImage = styled.img`
  display: inline-block;
  backface-wisibility: hidden;
  max-width: 100%;
  margin-left: 70px;
  cursor: pointer;
  @media only screen and (max-width: ${themeGet('breakpoints.middleMobile')}) {
    margin-left: 5px;
  }
`;

export const LogoFont = styled.span`
  font-family: ${themeGet('fontFamilies.somebubbles')};
  background: linear-gradient(to right, #9fc86c 0%, #6f913d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 3rem;
`;
