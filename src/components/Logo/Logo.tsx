import React from 'react';
import Router from 'next/router';
import { LogoBox, LogoImage } from './Logo.style';

type LogoProps = {
  src?: string;
  alt?: string;
  onClick?: () => void;
};

export const Logo: React.FC<LogoProps> = ({ src, alt = '', onClick }) => {
  const onLogoClick = () => onClick || Router.push('/');
  return (
    <LogoBox onClick={onLogoClick}>
      <LogoImage src={src} alt={alt} />
    </LogoBox>
  );
};
