import React from 'react';
// TO DO: access the user to be able to gather movie data 
// Display list for all the movies
//map over them and display a card 
// const MoviesLiked = (props.user.) => {

const MoviesLiked = () => {
    const likedMovies = [
        {name: 'John'},{name:'Sarah'},{name:'Bill'}
        ]
    return (
        <div>
          <p>Movies Liked</p> 
          <ul className='List'>
            {likedMovies.map((movie) => 
            <li>{movie.name}
            </li>)}
        </ul>
        </div>
    );
};
