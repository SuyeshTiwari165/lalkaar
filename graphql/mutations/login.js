import { gql } from "@apollo/client";

export const LOGIN = gql(
  `mutation($identifier: String!, $password: String!) {
    login(input: { identifier: $identifier, password: $password }) {
      jwt
      user {
        id
        username
        email
      }
    }
  }`
);
