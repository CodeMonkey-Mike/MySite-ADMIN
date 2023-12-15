import { Avatar as Instance } from 'theme-ui';

export interface IAvatar {
  dataTestId: string;
}
export const Avatar = ({ dataTestId, ...props }: IAvatar & any) => (
  <Instance
    style={{ border: '5px solid #ccc', width: 100, height: 100, cursor: 'pointer' }}
    data-testid={dataTestId}
    {...props}
  />
);
