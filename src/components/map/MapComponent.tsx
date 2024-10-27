import { Icon } from "leaflet";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";

type LatLngTuple = [number, number];
interface TripData {
  pickup_longitude: string;
  pickup_latitude: string;
  dropoff_longitude: string;
  dropoff_latitude: string;
}

// Create a custom marker icon
const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapComponent({ tripData }: { tripData: TripData }) {
  const {
    pickup_latitude,
    pickup_longitude,
    dropoff_latitude,
    dropoff_longitude,
  } = tripData;

  const [route, setRoute] = useState<LatLngTuple[]>([]);

  // Convert coordinates from string to number
  const pickupCoords: LatLngTuple = [
    parseFloat(pickup_latitude),
    parseFloat(pickup_longitude),
  ];
  const dropoffCoords: LatLngTuple = [
    parseFloat(dropoff_latitude),
    parseFloat(dropoff_longitude),
  ];

  // Fetch route from OpenRouteService API
  const fetchRoute = async () => {
    const apiKey = import.meta.env.VITE_API_KEY;
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}`;

    const body = JSON.stringify({
      coordinates: [
        [pickupCoords[1], pickupCoords[0]],
        [dropoffCoords[1], dropoffCoords[0]],
      ],
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch route");
      }

      const data = await response.json();
      const geometry = data.routes[0].geometry;
      const decoded = decodePolyline(geometry);
      setRoute(decoded);
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  // Decode polyline from OpenRouteService response
  const decodePolyline = (polyline: string): LatLngTuple[] => {
    let index = 0,
      lat = 0,
      lng = 0;
    const coordinates: LatLngTuple[] = [];
    const shiftAndDecode = () => {
      let result = 0,
        shift = 0,
        byte: number;
      do {
        byte = polyline.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      return (result & 1 ? ~(result >> 1) : result >> 1) / 1e5;
    };
    while (index < polyline.length) {
      lat += shiftAndDecode();
      lng += shiftAndDecode();
      coordinates.push([lat, lng]);
    }
    return coordinates;
  };

  useEffect(() => {
    fetchRoute();
  }, []);

  return (
    <MapContainer
      className="overflow-hidden"
      center={pickupCoords}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={pickupCoords} icon={customIcon}>
        <Popup>Pickup Location</Popup>
      </Marker>
      <Marker position={dropoffCoords} icon={customIcon}>
        <Popup>Dropoff Location</Popup>
      </Marker>
      {route.length > 0 && <Polyline weight={8} positions={route} color="#267FCA" />}
    </MapContainer>
  );
}
