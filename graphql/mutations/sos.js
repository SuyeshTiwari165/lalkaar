import { gql } from "@apollo/client";

export const CREATE_SOS = gql(`
mutation(
    $Description: String
    $Evidence: [ID]
    $useId: ID
    $Severity: ENUM_SOSREQUEST_SEVERITY
    $geolocation: JSON
    $peopleCount: Int
  ) {
    createSosRequest(
      data: {
        Description: $Description
        Evidence: $Evidence
        peopleCount:$peopleCount
        users_permissions_user: $useId
        Severity: $Severity
        getLocation: $geolocation
      }
    ) {
      data {
        id
      }
    }
  }`);
