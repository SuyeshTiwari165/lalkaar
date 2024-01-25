import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import { StyledContainer } from "../components/Theme/Styles";
import { useRoute } from "@react-navigation/native";
import { Text, Button } from "react-native-paper";
import axios from "axios";
import getFastestRoute from "../components/getFastestRoute";

const MapScreen = ({ navigation }, props) => {
  console.log("navigation", navigation);
  const [estimatedTime, setEstimatedTime] = useState(null);
  // const [location, setLocation] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const destinationCoordinates = {
    latitude: 19.2978825,
    longitude: 72.8664324,
  };

  const route = useRoute();
  // useEffect(() => {
  //   if (route.params.locationData) {
  //     setLocation(route.params.locationData);
  //   }
  // }, []);

  const location = route.params?.locationData;
  console.log("iddddddddddddddddddddddddddd", route.params.locationData);
  // console.log("lat", route.params.locationData.coordinates.lat);
  // console.log("lng", route.params.locationData.coordinates.lng);

  useEffect(() => {
    let isMounted = true;

    const calculateEstimatedTime = async () => {
      if (location && destinationCoordinates) {
        const fastestRoute = await getFastestRoute(
          location,
          destinationCoordinates,
          "AIzaSyD9wJ7WF55Ke2akLDeDo6wSUR1R3Jm7wiM"
        );
        const estimatedTimeInSeconds =
          fastestRoute.legs[0].duration_in_traffic.value;
        const estimatedTime = formatTime(estimatedTimeInSeconds);
        setEstimatedTime(estimatedTime);
      }
    };

    const calculateDistance = (startCoords, endCoords) => {
      const lat1 = startCoords.latitude;
      const lon1 = startCoords.longitude;
      const lat2 = endCoords.latitude;
      const lon2 = endCoords.longitude;

      const R = 6371; // Radius of the Earth in kilometers
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c * 1000; // Convert distance to meters
      console.log("distanceee", distance);
      return distance;
    };

    const deg2rad = (deg) => {
      return deg * (Math.PI / 180);
    };

    const formatTime = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    };

    const startTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Location permission not granted");
        return;
      }

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          // setLocation(newLocation.coords);
          calculateEstimatedTime();
        }
      );
    };

    startTracking();

    return () => {
      // Cleanup function if component unmounts
      isMounted = false;
    };
  }, [destinationCoordinates]);

  return (
    <StyledContainer>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Marker Title"
            description="Marker Description"
          />
          <Marker
            coordinate={{
              latitude: destinationCoordinates.latitude,
              longitude: destinationCoordinates.longitude,
            }}
            title="Marker Title"
            description="Marker Description"
          />
        </MapView>
        <View>
          {location ? (
            <Text>
              Current Location: Latitude {location.latitude}, Longitude{" "}
              {location.longitude}
            </Text>
          ) : (
            <Text>Loading location...</Text>
          )}

          {estimatedTime ? (
            <Text>Estimated Time to Destination: {estimatedTime}</Text>
          ) : (
            <Text>Calculating estimated time...</Text>
          )}

          <Button
            title="Stop Tracking"
            onPress={() => setEstimatedTime(null)}
          />
        </View>
      </View>
    </StyledContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
