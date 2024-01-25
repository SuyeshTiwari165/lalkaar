import { gql } from "@apollo/client";

export const ACCEPT_SOS_REQUEST_DATA = gql`
  query {
    acceptSosRequests {
      data {
        id
        attributes {
          live_location
          accepted
          sos_request {
            data {
              id
            }
          }
          users_permissions_user {
            data {
              id
              attributes {
                firstName
                mobileNumber
                defaultAddress
              }
            }
          }
        }
      }
    }
  }
`;
