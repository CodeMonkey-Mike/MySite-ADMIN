import { useContext, useMemo } from 'react';
import { DetailContext } from 'src/contexts/detail/detail.context';
import { IItem } from 'src/interfaces';

export const usePreview = () => {
  const { detailState, detailDispatch } = useContext<any>(DetailContext);

  const onPreview = ({ data, id }: IItem) => {
    if (detailState.data && detailState.data.title === data.title) {
    } else {
      detailDispatch({
        type: 'REQUEST_PREVIEW',
        data,
        id,
      });
    }
  };

  const onCancelPreview = () => {
    detailDispatch({
      type: 'REQUEST_PREVIEW_CANCEL',
    });
  };

  const itemPreview = useMemo(() => detailState && detailState.data, [detailState]);
  const align = useMemo(() => detailState && detailState.align, [detailState]);
  return {
    onPreview,
    onCancelPreview,
    itemPreview,
    align,
  };
};
