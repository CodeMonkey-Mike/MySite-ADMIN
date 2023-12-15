import dynamic from 'next/dynamic';
import { Loader } from 'src/components';
import 'react-quill/dist/quill.snow.css';

export const Editor = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    // @ts-ignore
    return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
  },
  {
    ssr: false,
    loading: () => <Loader loading={true} />,
  }
);
