import React, { useState, useEffect } from "react";
import Auth from '../utils/auth';
import "../index.css";
import Dashboard from "./Dashboard";
import { useQuery } from "@apollo/client";
import {  QUERY_ME } from '../utils/queries';

// Start of App function //
const Home = () => {
  const loggedIn = Auth.loggedIn(); // assign the auth login to one word variable makes it easier to type
  const [me, setMe] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  // const [userLocation, setUserLocation] = useState({
  //   latitude: 40.730610,
  //   longitude: -73.935242
  // });

  const { loading, data: myData } = useQuery(QUERY_ME);

  useEffect(() => {
    setMe(myData);
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, [myData]);

  console.log(me)

  if(!userLocation) {
    return (
      <div>loading...</div>
    )
  }

  if(loggedIn && me && userLocation) {
    return (
     <Dashboard me={me} userLocation={userLocation} />
    )
  }

  return (
    <div className="container movie-app ">
      <>
        <p>Display Signup/Landing/Info Components</p>
      </>
    </div>
  );
};

export default Home;
