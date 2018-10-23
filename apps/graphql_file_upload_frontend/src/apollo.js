import { createLink } from 'apollo-absinthe-upload-link';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';

const url = `http://localhost:4000/graphql`

export const getApolloClient = () => {
  return new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.map(({ message, locations, path }) => console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ));
        }
        if (networkError) {
          console.log(`[Network error]: ${networkError}`);
        }
      }),
      createLink({
        uri: url
      }),
    ]),
  });
};
