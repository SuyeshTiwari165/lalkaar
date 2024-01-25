import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { Button } from "react-native-paper";
import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  StyledFormArea,
  LeftIcon,
  StyledInputlable,
  StyledTextInput,
  RightIcon,
  StyledButton,
  ButtonText,
  Colors,
  SOSButton,
} from "../components/Theme/Styles";
import { useNavigation } from "@react-navigation/native";
import { ACCEPT_SOS_REQUEST_DATA } from "../graphql/queries/AcceptRequestData";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";

const DataTable = (props) => {
  const navigation = useNavigation();
  const [acceptedUserslist, setAcceptedUserslist] = useState([]);
  // useEffect(() => {
  //   getAcceptedUsers();
  // }, []);

  useEffect(() => {
    if (data) {
      setAcceptedUserslist(data.acceptSosRequests.data);
    }
  }, [data]);

  const { loading, error, data, refetch, networkStatus } = useQuery(
    ACCEPT_SOS_REQUEST_DATA
  );

  if (loading) {
    return <Text>loading</Text>;
  }

  // const [getAcceptedUsers, { loading, error, data }] = useLazyQuery(
  //   ACCEPT_SOS_REQUEST_DATA
  // );

  return (
    <View style={styles.wrapper}>
      {/* Table Container */}
      <View style={styles.table}>
        {/* Table Head */}
        <View style={styles.table_head}>
          <View style={{ width: "18%" }}>
            <Text style={styles.table_head_captions}>Sr. No</Text>
          </View>
          <View style={{ width: "30%" }}>
            <Text style={styles.table_head_captions}>Name</Text>
          </View>
          <View style={{ width: "30%" }}>
            <Text style={styles.table_head_captions}>Mobile No.</Text>
          </View>
          <View style={{ width: "30%" }}>
            <Text style={styles.table_head_captions}>Actions</Text>
          </View>
        </View>

        {data.acceptSosRequests.data &&
          data.acceptSosRequests.data.map((request, index) => {
            return (
              <View key={request.id} style={styles.table_body_single_row}>
                <View style={{ width: "15%" }}>
                  <Text style={styles.table_data}>{index + 1}</Text>
                </View>
                <View style={{ width: "30%" }}>
                  <Text style={styles.table_data}>
                    {`${request.attributes.users_permissions_user.data.attributes.firstName}`}
                  </Text>
                </View>
                <View style={{ width: "30%" }}>
                  <Text style={styles.table_data}>
                    {
                      request.attributes.users_permissions_user.data.attributes
                        .mobileNumber
                    }
                  </Text>
                </View>
                <View style={{ width: "30%" }}>
                  <Button
                    onPress={() =>
                      navigation.navigate("MapScreen", {
                        locationData: props.props,
                      })
                    }
                    style={styles.table_data}
                  >
                    view
                  </Button>
                </View>
              </View>
            );
          })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  table_head: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    padding: 7,
    backgroundColor: "#3bcd6b",
  },
  table_head_captions: {
    fontSize: 15,
    color: "white",
  },

  table_body_single_row: {
    backgroundColor: "#fff",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    padding: 7,
  },
  table_data: {
    fontSize: 11,
  },
  table: {
    margin: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
    backgroundColor: "#fff",
  },
});

export default DataTable;
