import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../index.css";
import Swipe from "../TinderSwipe";
import MovieListHeading from "../MovieListHeading";

//Random number generated to pick movie from list below//
const numberRandom = Math.floor(Math.random() * 3);

// Start of App function //
const Home = () => {
  // Set movies to empty state //
  const [movies, setMovies] = useState([]);

  // Start List of possible movies //
  const movieName = [
    
    {
      Link: "/Images/ironman.jpg",
      Movie_Name: "Memento",
      Rating: "⭐⭐⭐⭐",
      Year: "2000",
    },
    {
      Link: "/Images/ironman.jpg",
      Movie_Name: "Wall-E",
      Rating: "⭐⭐⭐⭐",
      Year: "2008",
    },
    {
      Link: "/Images/joker.jpg",
      Movie_Name: "Joker",
      Rating: "⭐⭐⭐⭐⭐",
      Year: "2019",
    },
  ];
  // End List of possible movies //

  //Function to take Movie_Name from list and pit it into API //
  const getMovieRequest = async (searchValue) => {
    movieName.forEach((el, index) => {});
    const url = `https://www.omdbapi.com/?s=${movieName[numberRandom].Movie_Name}&apikey=263d22d8`;
    const response = await fetch(url);
    const responseJson = await response.json();
    // Response is put into JSON format, sliced to only show first movie //
    if (responseJson.Search) {
      setMovies(responseJson.Search.slice(0, 1));
    }
  };
  // Runs function about with inputed api info //
  useEffect(() => {
    getMovieRequest(movieName[numberRandom].Movie_Name);
  },[] );

  // Return the generated info onto the page //
  return (
    <>
    <div className="container movie-app ">
      
      <div style={{ display: "flex", justifyContent: "center" }}>
        {/* Swipe shows movie poster on page*/}
        <Swipe movies={movies} />
      </div>
    </div>
    </>
  );
};

export default Home;