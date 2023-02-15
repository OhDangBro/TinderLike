import React from 'react';


const MovieList = ({ movies, title }) => {

  if (!movies.length) {
    return <h3>No Thoughts Yet</h3>;
  }


  return (
    <div>
      <h3>{title}</h3>
      {movies &&
        movies.map(movie => (
          <div key={movie._id} className="card mb-3">
            <div className="card-body">
              <p>{movie.movieTitle}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default MovieList;