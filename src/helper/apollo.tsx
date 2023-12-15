// @ts-nocheck
import { useMemo } from 'react';
import {
  ApolloLink,
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  fromPromise,
  ApolloError,
} from '@apollo/client';
import { NextPage } from 'next';
import { createUploadLink } from 'apollo-upload-client';
import { getAccessToken, setAccessToken } from './accessToken';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { REFRESH_TOKEN } from 'src/graphql/query/user.query';

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;
let isRefreshing = false;
let pendingRequests: any = [];

const resolvePendingRequests = () => {
  pendingRequests.map((callback: any) => callback());
  pendingRequests = [];
};

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  const client = apolloClient ?? createApolloClient();

  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      console.log(
        `[GraphQL error]: Message: ${err.message}, Location: ${err.locations}, Path: ${err.path}`
      );
    }
  }

  if (networkError && 'statusCode' in networkError) {
    switch (networkError.statusCode) {
      case 401:
        let forward$;

        if (!isRefreshing) {
          isRefreshing = true;
          forward$ = fromPromise(
            client
              .query({
                query: REFRESH_TOKEN,
                fetchPolicy: 'network-only',
              })
              .then(({ data }) => {
                if (data?.refreshToken?.token) {
                  setAccessToken(data.refreshToken.token);
                  return true;
                } else {
                  pendingRequests = [];
                  return false;
                }
              })
              .then((success) => {
                if (success) {
                  resolvePendingRequests();
                } else {
                  setAccessToken(null);
                  Router.replace('/login');
                }
                return true;
              })
              .catch((e) => {
                pendingRequests = [];
                return new ApolloError({ errorMessage: 'Authentication error' });
              })
              .finally(() => {
                isRefreshing = false;
              })
          );
        } else {
          forward$ = fromPromise(
            new Promise<void>((resolve) => {
              pendingRequests.push(() => resolve());
            })
          );
        }

        return forward$.flatMap(() => forward(operation));
      default:
        console.log(`[Network error 1]: ${networkError}`);
    }
  } else if (networkError) {
    console.log(`[Network error 2]: ${networkError}`);
  }
});

const authLink = setContext(async (_operation, { headers }) => {
  const token = getAccessToken();

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`,
    },
  };
});

const createApiEndpoint = () => {
  if (
    process.env.NODE_ENV == 'development' &&
    process.env.NEXT_PUBLIC_API_URL?.includes('localhost')
  ) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return [
    process.env.NEXT_PUBLIC_API_URL,
    process.env.NEXT_PUBLIC_API_PR,
    '.',
    process.env.NEXT_PUBLIC_API_DOMAIN,
    process.env.NEXT_PUBLIC_API_PATH,
  ].join('');
};

const httpLink = createUploadLink({ uri: createApiEndpoint(), credentials: 'include' });
export const client = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(initialState: NormalizedCacheObject | null = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: NormalizedCacheObject) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}

export function withApollo(PageComponent: NextPage, {} = {}) {
  const WithApollo = ({
    apolloClient,
    apolloState,
    ...pageProps
  }: {
    apolloClient: ApolloClient<NormalizedCacheObject>;
    apolloState: NormalizedCacheObject;
  }) => {
    const client = apolloClient || initializeApollo(apolloState);
    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    );
  };
  // Set the correct displayName in development
  if (process.env.NODE_ENV !== 'production') {
    const displayName = PageComponent.displayName || PageComponent.name || 'Component';

    if (displayName === 'App') {
      console.warn('This withApollo HOC only works with PageComponents.');
    }

    WithApollo.displayName = `withApollo(${displayName})`;
  }
  return WithApollo;
}
