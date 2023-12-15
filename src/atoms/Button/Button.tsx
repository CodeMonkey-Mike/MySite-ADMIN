import React from 'react';
import styled from 'styled-components';
import { buttonStyle, colorStyle, buttonSize } from '../../theme/customVariant';

export type ButtonProps = {
  children: React.ReactChild;
  onClick?: (e: any) => void;
  color?: string;
  variant?: string;
  size?: string;
  width?: string;
  height?: string;
  disabled?: boolean;
};

const ButtonStyled = styled.button<ButtonProps>`
  cursor: pointer;
  ${buttonStyle}
  ${colorStyle}
  ${buttonSize}
  width: ${({ width }) => (width ? width : '100%')};
`;

export const Button = ({ children, onClick, ...props }: ButtonProps) => {
  return (
    <ButtonStyled onClick={onClick} {...props}>
      {children}
    </ButtonStyled>
  );
};
