import React from 'react';
import Link from 'next/link';
import { List, Item } from 'src/atoms';
import { IItemList } from 'src/interfaces';
import { DropDownContainer } from './Style';

interface IDropdown {
  data: Array<IItemList>;
  className?: string;
}

export const Dropdown = ({ data, ...props }: IDropdown) => {
  return (
    <DropDownContainer {...props}>
      <List>
        {data.length > 0 &&
          data.map((item: IItemList, idx: number) => (
            <Item key={idx} onClick={item.onClick}>
              {item.icon}
              <Link href={item.href || '#'}>{item.label}</Link>
            </Item>
          ))}
        <Item>© {new Date().getFullYear()}</Item>
      </List>
    </DropDownContainer>
  );
};
