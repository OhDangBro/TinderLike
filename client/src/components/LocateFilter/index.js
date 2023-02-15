import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from "@apollo/client";
import { QUERY_USERS } from '../../utils/queries';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'

import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';


/* Notes

- the filter function is pretty much useless
- we need to pass in location on login or component load everytime
- if they dont allow location we need a fallback or different strategy
- need to write a function that changes userLocation so they can search near other places

*/

function LocateFilter() {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loadUsers, { loading, data }] = useLazyQuery(QUERY_USERS);

  const [position, setPosition] = useState([40.730610, -73.935242]);

  const onClick = (e) => {
    setPosition([e.latlng.lat, e.latlng.lng]);
    let lat = e.latlng.lat
    let lng = e.latlng.lng
    setUserLocation({
      latitude: lat,
      longitude: lng
    });

  };

  console.log('new position: ' + position)

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  useEffect(() => {
    loadUsers();
  }, [])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => { // this should be called way before we even get to users, like on website visit or login so its present on load of filtering component 
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    if (userLocation && data) {
      // const sortedUsers = users.sort((a, b) => {
      let arrayForSort = [...data.users]
      const sortedUsers = arrayForSort.sort((a, b) => {
        const distanceA = getDistanceFromLatLonInKm(
          userLocation.latitude,
          userLocation.longitude,
          // a.location.latitude,
          // a.location.longitude
          a.location[0],
          a.location[1]
        );
        const distanceB = getDistanceFromLatLonInKm(
          userLocation.latitude,
          userLocation.longitude,
          // b.location.latitude,
          // b.location.longitude
          b.location[0],
          b.location[1]
        );
        return distanceA - distanceB;
      });
      setFilteredUsers(sortedUsers);
    }
  }, [userLocation]);

  console.log('user location: ', userLocation);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ul>
        {filteredUsers.map((user) => (
          <li key={user._id}>{user.username}</li>
        ))}
      </ul>
      <div>
      {/* <MapContainer style={{height: '500px', overflow: 'hidden'}} center={position} zoom={13} onClick={onClick}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} />
      </MapContainer> */}
      </div>
      
    </div>
  );
};

export default LocateFilter;