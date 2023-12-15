import styled from 'styled-components';

interface IInstance {
  alignContent?: 'start' | 'end';
  alignItems?: 'start' | 'end';
  justifyContent?: 'start' | 'end';
}

export const Instance = styled.div<IInstance>`
  flex: 1;
  display: flex;
  padding-top: 40px;
  align-content: ${({ alignContent }) => (alignContent ? `flex-${alignContent}` : 'center')};
  align-items: ${({ alignItems }) => (alignItems ? `flex-${alignItems}` : 'center')};
  justify-content: ${({ justifyContent }) =>
    justifyContent ? `flex-${justifyContent}` : 'center'};
`;

const Loading = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-content: center;
`;
export interface IContainer {
  children: React.ReactNode;
  loading?: boolean;
}

export const Container = ({ children, loading, ...props }: IContainer & IInstance) => {
  return (
    <Instance {...props}>
      {loading && <Loading>Loading...</Loading>}
      {children}
    </Instance>
  );
};
