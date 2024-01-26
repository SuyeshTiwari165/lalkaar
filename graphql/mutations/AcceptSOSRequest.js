import { gql } from "@apollo/client";

export const ACCEPT_SOS_REQUEST = gql(
  `mutation(
    $accepted: Boolean
    $live_location: JSON
    $sos_request: ID
    $users_permissions_user: ID
  ) {
    createAcceptSosRequest(
      data: {
        accepted: $accepted
        live_location: $live_location
        sos_request: $sos_request
        users_permissions_user: $users_permissions_user
      }
    ) {
      data {
        id
        attributes {
          live_location
        }
      }
    }
  }
  `
);
