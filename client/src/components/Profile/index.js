import React from "react";
import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Auth from "../../utils/auth";
import { useQuery } from "@apollo/client";
import { QUERY_USER, QUERY_ME } from "../../utils/queries";
import { Link } from "react-router-dom";
import Subheader from "../Subheader";

// Subheader Props to Pass
const link = "/";
const pageTitle = "Profile";
const previousPageTitle = "Browse";

const Profile = (props) => {
  const { username: userParam } = useParams();
  // const { loading, data } = useQuery(QUERY_ME, {
  //   variables: { username: userParam },
  // });
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || data?.user || {};
  // navigate to personal profile page if username is yours

  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/profile" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </h4>
    );
  }

  return (
    <div className="flex-column align-content-center">
      <Subheader
        link={link}
        pageTitle={pageTitle}
        previousPageTitle={previousPageTitle}
      />

      <div style={{ margin: "0 auto" }} className="">
        <div className="">
          <div className="flex-row mb-3 prof-movies">
            
          </div>
          <p> {user.username}</p>
          {user.photoURL == 'placeholder' ? (
              <img className="avatar" src="https://via.placeholder.com/468" alt=""/>

            )
            : (
              <img className="avatar" src={user.photoURL} alt=""/>
            )
          }



          <p>Age: {user.age} </p>
          <p>Height: {user.height} </p>
          <p>Weight: {user.weight}</p>
          <p>Ethnicity: {user.ethnicity}</p>
          <p>Role: {user.role}</p>
          <p>Interests:</p>
          <ul>
            {user.interests.map(interest => 
              <li key={interest}>{interest}</li>
            )}
          </ul>
          <p>Description: {user.description}</p>
          <Link
            style={{
              color: "white",
              fontFamily: "sans-serif",
              textAlign: "center",
            }}
            to="/editprofile"
          >
            {" "}
            Edit Profile →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
