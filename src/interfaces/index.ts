export interface Product {}
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
export interface Me {
  id: number;
  username: string;
  email: string;
}
export interface IInstance {
  alignContent?: 'start' | 'end';
  alignItems?: 'start' | 'end';
  justifyContent?: 'start' | 'end';
  flexWrap?: 'wrap' | 'nowrap';
  maxWidth?: string;
  padding?: string;
}

export interface IItem {
  id?: number;
  data: {
    image?: string;
    title?: string;
    description?: string;
  };
}

export interface IIcon {
  fill?: string;
  height?: string;
  width?: string;
  className?: string;
  onClick?: () => void;
}

export interface IItemList {
  icon?: React.ReactNode | React.ReactChild;
  label: string;
  href?: string;
  onClick?: () => void;
}

export enum BlogStatus {
  PUBLIC = 'public',
  DRAFT = 'draft',
}

export const BlogStatuses = [
  {
    label: 'Public',
    value: BlogStatus.PUBLIC,
  },
  {
    label: 'Draft',
    value: BlogStatus.DRAFT,
  },
];
