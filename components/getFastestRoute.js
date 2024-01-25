import axios from "axios";

const getFastestRoute = async (origin, destination, apiKey) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${apiKey}&mode=driving&traffic_model=best_guess&departure_time=now`
    );

    const routes = response.data.routes;
    if (routes.length > 0) {
      const fastestRoute = routes[0];
      return fastestRoute;
    } else {
      throw new Error("No routes found.");
    }
  } catch (error) {
    console.error("Error fetching route:", error);
    throw error;
  }
};

export default getFastestRoute;
