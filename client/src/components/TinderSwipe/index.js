import React from "react";
import TinderCard from "react-tinder-card";
import { ADD_MOVIE } from '../../utils/mutations';
import { useMutation } from '@apollo/client';


// 'Simple Function' reloads page on swipe //
const Swipe = (props) => {
  
  const [addMovie] = useMutation(ADD_MOVIE)

  // const onCardLeftScreen = (direction) => {
  //   console.log(direction)
  //   if (direction === 'right') {
  //     handleSwipe()
  //   } else if (direction === 'left') {
  //     console.log("Not today!")
  //     window.location.reload(false);
  //   }
  // }

  const handleSwipe = async ( dir, movie) => {
    if (dir === 'right') {
      try {
        await addMovie({
          variables: { movieTitle: movie },
        });
      } catch (e) {
        console.error(e);
      }
      window.location.reload(false);
    } else 
      console.log(dir);
      window.location.reload(false);
  };

  //Movie Swiper Card  Start//
  return (
    <div className="movieSwiper">
      <p className="instructions">Swipe right to save a movie to your library or swipe left to ignore it.</p>
        {/* Links for Swipe Card Start */}
      <link
        href="https://fonts.googleapis.com/css?family=Damion&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Alatsi&display=swap"
        rel="stylesheet"
      />
      {/* Links for Swipe Card Start */}
      {/* Heading of Swipe Cards "watch or wouldnt" Start */}
      <div className="swipeHeader">
        <h1 className="ignore">
          {/* Arrow Icon pointing left Start */}
          {/* Arrow icon pointing left end*/}
          {/* Heading Text Over Cards: */}
          Maybe Later
        </h1>
        <h1 className="watch">
        Let's Watch!
          {/* Arrow Pointing Left Start */}
          
          {/* Arrow Pointing Left End */}
        </h1>
      </div>
      {/* Poster Image Start */}
      <div className="cardContainer">
        {props.movies.map((movie) => (
          <TinderCard
            className="swipe"
            key={movie.Title}
            // onCardLeftScreen={onCardLeftScreen}
            onSwipe={ (dir) => handleSwipe(dir, movie.Title) }
            // preventSwipe={['up', 'down']}
          >
            {/* inline styling in div for poster */}
            <div
              style={{
                backgroundImage: "url(" + movie.Poster + ")", 
                width: "400px",
                height: "550px",
                backgroundSize: "cover",
                margin: "auto"
              }}
              className="card"
            ></div>
          </TinderCard>
        ))}
      </div>
      {/* Poster Image End */}
    </div>
  );
};

export default Swipe;