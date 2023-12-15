import dynamic from 'next/dynamic';

export const CodeEditor = dynamic(
  // @ts-ignore
  () => import('@uiw/react-textarea-code-editor').then((mod) => mod.default),
  { ssr: false }
);
