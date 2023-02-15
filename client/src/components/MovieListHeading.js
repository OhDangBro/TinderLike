import React from 'react';


//MovieListHeading Function //
const MovieListHeading = (props) => {
	return (
		<div className='col'>
			<h1>{props.heading}</h1>
		</div>
	);
};

//Export MovieListHeading//
export default MovieListHeading;