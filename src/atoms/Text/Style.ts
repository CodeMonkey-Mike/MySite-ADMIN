import styled, { css } from 'styled-components';

interface IText {
  width?: string;
  margin?: string;
  center?: boolean;
  size?: string;
  lineHeight?: number;
  filterImg?: boolean;
}

export const P = styled.div<IText>`
  font-size: ${({ size }) => (size ? `${size}` : 'var(--text-base)')};
  margin: ${({ margin }) => (margin ? `${margin}` : '0')};
  ${({ center }) => center && `text-align: center`};
  width: ${({ width }) => (width ? `${width}` : 'auto')};
  line-height: ${({ lineHeight }) => (lineHeight ? `${lineHeight}` : 1)};
  ${({ filterImg }) =>
    filterImg &&
    css`
      img {
        display: none;
      }
    `};
`;

export const H1 = styled.h1<IText>`
  font-size: ${({ size }) => (size ? `${size}` : 'var(--text-5xl)')};
  margin: ${({ margin }) => (margin ? `${margin}` : '0')};
  ${({ center }) => center && `text-align: center`};
  width: ${({ width }) => (width ? `${width}` : 'auto')};
  font-weight: bold;
`;

export const H2 = styled.h2<IText>`
  font-size: ${({ size }) => (size ? `${size}` : 'var(--text-lg)')};
  margin: ${({ margin }) => (margin ? `${margin}` : '0')};
  ${({ center }) => center && `text-align: center`};
  width: ${({ width }) => (width ? `${width}` : 'auto')};
  font-weight: bold;
`;

export const H3 = styled.h3<IText>`
  font-size: ${({ size }) => (size ? `${size}` : 'var(--text-sm)')};
  margin: ${({ margin }) => (margin ? `${margin}` : '0')};
  ${({ center }) => center && `text-align: center`};
  width: ${({ width }) => (width ? `${width}` : 'auto')};
  font-weight: bold;
`;
