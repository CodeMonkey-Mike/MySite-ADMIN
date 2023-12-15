import { useQuery } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { STATE_LIST } from 'src/graphql/query/state.query';

interface IState {
  code: string;
  name: string;
}

export const useStates = () => {
  const { data, loading: stateLoading, refetch } = useQuery(STATE_LIST);

  const states = useMemo(() => {
    if (data && data.states) {
      return data.states.map((item: IState) => {
        return {
          value: item.code,
          label: item.name,
        };
      });
    }
  }, [data]);

  const getStateById = useCallback(
    (id: number) =>
      refetch({
        id: id,
      }),
    [refetch]
  );

  const refetchState = useCallback(() => refetch(), [refetch]);

  return {
    states,
    stateLoading,
    refetchState,
    getStateById,
  };
};
