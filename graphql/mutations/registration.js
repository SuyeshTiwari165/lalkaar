import { gql } from "@apollo/client";

export const REGISTRATION = gql(`
mutation(
    $username: String
    $email: String
    $password: String
    $role: ID
    $firstName: String
    $lastName: String
    $mobileNumber: Long
    $defaultAddress: JSON
    $profilePicture: ID
  ) {
    createUsersPermissionsUser(
      data: {
        username: $username
        email: $email
        password: $password
        role: $role
        firstName: $firstName
        lastName: $lastName
        mobileNumber: $mobileNumber
        defaultAddress: $defaultAddress
        profilePicture: $profilePicture
      }
    ) {
      data {
        id
        attributes {
          username
          email
          blocked
          role {
            data {
              attributes {
                name
                description
              }
            }
          }
          mobileNumber
          defaultAddress
        }
      }
    }
  }`);
