import React from 'react';
import Head from 'next/head';
import { withApollo } from 'src/helper/apollo';
import { About } from 'src/containers';

const Index = () => {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <About />
    </>
  );
};

export default withApollo(Index);
