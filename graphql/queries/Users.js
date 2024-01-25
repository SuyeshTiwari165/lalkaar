import { gql } from "@apollo/client";

export const USER_DATA = gql`
  query ($id: ID) {
    usersPermissionsUser(id: $id) {
      data {
        id
        attributes {
          email
          firstName
          lastName
          username
          mobileNumber
          defaultAddress
          profilePicture {
            data {
              attributes {
                name
                url
              }
            }
          }
        }
      }
    }
  }
`;
