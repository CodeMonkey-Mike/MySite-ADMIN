import React from 'react';
import { LeftMenuItem } from './Style';

interface IItem {
  onClick?: () => void;
  className?: string;
}

export const Item = (props: IItem & React.HTMLProps<HTMLDivElement> & any) => (
  <LeftMenuItem {...props} />
);
