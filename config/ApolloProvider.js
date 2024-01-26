import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri:
    process.env.REACT_APP_GRAPHQL_ENDPOINT ||
    "http://192.168.0.104:1337/graphql",
  cache: new InMemoryCache(),
});

// ApolloProvider.js

const ApolloProviderWrapper = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloProviderWrapper;
