import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import 'leaflet.fullscreen/Control.FullScreen.css';
import L from 'leaflet';
import 'leaflet.fullscreen';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import './LeafletHospitalMap.css';
import personIconImage from '../../assets/person-icon.png';

const API_KEY = 'e0d03330b1bc40f3b07fa65f9befaa09';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 33.8938,
  lng: 35.5018,
};

const personIcon = new L.Icon({
  iconUrl: personIconImage,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const FullscreenControl = () => {
  const map = useMapEvents({});
  useEffect(() => {
    L.control.fullscreen({ position: 'topright' }).addTo(map);
  }, [map]);
  return null;
};

const LocationMarker = ({ setUserLocation }) => {
  const map = useMapEvents({
    locationfound: (event) => {
      setUserLocation(event.latlng);
      map.flyTo(event.latlng, map.getZoom());
    },
    locationerror: (error) => {
      console.error("Location error:", error);
      alert("Location access denied.");
    },
  });

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true, timeout: 10000 });
  }, [map]);

  return null;
};

const RoutingControl = ({ from, to }) => {
  const map = useMapEvents({});
  useEffect(() => {
    if (!from || !to) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(from.lat, from.lng),
        L.latLng(to.lat, to.lng)
      ],
      routeWhileDragging: true,
    }).addTo(map);

    return () => {
      if (map.hasLayer(routingControl)) {
        map.removeControl(routingControl);
      }
    };
  }, [from, to, map]);

  return null;
};

const LeafletHospitalMap = () => {
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const [hospitalsResponse, bloodRequestsResponse] = await Promise.all([
        axios.get('/data/hospitals.json'),
        axios.get('/data/bloodRequests.json')
      ]);

      const hospitals = hospitalsResponse.data;
      const bloodRequests = bloodRequestsResponse.data;

      const hospitalIds = bloodRequests
        .filter(request => request.quantity > 0)
        .map(request => request.hospital_id);

      const filteredHospitals = hospitals.filter(hospital =>
        hospitalIds.includes(hospital.id)
      );

      const newLocations = await Promise.all(
        filteredHospitals.map(async (hospital) => {
          const response = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
              hospital.address
            )}&key=${API_KEY}`
          );
          const { lat, lng } = response.data.results[0].geometry;
          return { ...hospital, lat, lng };
        })
      );

      setLocations(newLocations);
    };

    fetchCoordinates();
  }, []);

  return (
    <div className="map-container">
      <h2 className="map-title">Find a Hospital Near You</h2>
      <p className="map-subtitle">Click on the markers to see hospital name and location</p>
      <MapContainer center={center} zoom={10} style={containerStyle}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <FullscreenControl />
        <LocationMarker setUserLocation={setUserLocation} />
        {userLocation && (
          <Marker position={userLocation} icon={personIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}
        {locations.map((hospital) => (
          <Marker
            key={hospital.id}
            position={{ lat: hospital.lat, lng: hospital.lng }}
            eventHandlers={{
              click: () => {
                setSelected(hospital);
              },
            }}
          >
            {selected && selected.id === hospital.id && (
              <Popup
                position={{ lat: hospital.lat, lng: hospital.lng }}
                onClose={() => setSelected(null)}
              >
                <div className="popup-content">
                  <h3>{hospital.name}</h3>
                  <p>{hospital.address}</p>
                  {userLocation && (
                    <button
                      onClick={() => {
                        setSelected({
                          ...hospital,
                          from: userLocation,
                          to: { lat: hospital.lat, lng: hospital.lng },
                        });
                      }}
                    >
                      Get Directions
                    </button>
                  )}
                </div>
              </Popup>
            )}
          </Marker>
        ))}
        {selected && selected.from && selected.to && (
          <RoutingControl from={selected.from} to={selected.to} />
        )}
      </MapContainer>
    </div>
  );
};

export default LeafletHospitalMap;
