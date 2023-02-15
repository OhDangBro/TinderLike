import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { EDIT_USER, ADD_USER_INTERESTS, DELETE_USER_INTERESTS } from "../../utils/mutations";
import { QUERY_ME } from "../../utils/queries";
import auth from "../../utils/auth";
import Subheader from "../Subheader";
import "../../css/editprofile.css";
import { Link } from "react-router-dom";
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

// Subheader Props to Pass
const link = "/profile";
const pageTitle = "Edit Profile";
const previousPageTitle = "Profile";

const EditProfile = () => {

  let [profileHeightUpdated, setProfileHeightUpdated] = useState(false);
  let [profileRoleUpdated, setProfileRoleUpdated] = useState(false);
  let [profileUpdated, setProfileUpdated] = useState(false);

  const [selectableInterests, setSelectableInterests] = useState([
    //define list interests in typeDefs for use on frontend 
    'ART',
    'BIKING',
    'COOKING',
    'DANCING',
    'HIKING',
  ])

  const [deletableInterests, setDeletableInterests] = useState([]) //empty list that we will push/pull from first list on to this one, they will pass values back and forth on click

  const [addUserInterests, { error: addUserInterestsError }] = useMutation(ADD_USER_INTERESTS); //setup the mutations adding interests
  const [deleteUserInterests, { error: deleteUserInterestsError }] = useMutation(DELETE_USER_INTERESTS); //more mutations for deleting interests

  const handleAddInterest = (interest) => { //on click we pass the interest to addUserInterests mutation
    return async () => {
      try {
        await addUserInterests({
          variables: { interests: [interest] }, // <- here she goes, it has to be in an array item thats what the resolver expects to use
        });
        setSelectableInterests(selectableInterests => selectableInterests.filter(item => item !== interest).sort()) //remove the passed interest from the selectable list cuz they clicked on it
        setDeletableInterests([...deletableInterests, interest].sort()) // move the interest to the deletable list
        // check if current user has token in localstorage
        auth.loggedIn();
        setProfileUpdated(true);
      } catch (e) {
        console.error(e);
      }
    }
  }

  const handleDeleteInterest = (interest) => { // on click we pass the interest to deleteUserInterests mutation
    return async () => {
      try {
        await deleteUserInterests({
          variables: { interests: [interest] }, //<- here she goes like adding before
        });
        setDeletableInterests(deletableInterests => deletableInterests.filter(item => item !== interest).sort()) // remove the passed interest from the deletable list cuz they clicked on it
        setSelectableInterests([...selectableInterests, interest].sort()) // move the interest back to the first selectable list
        // check if current user has token in localstorage
        auth.loggedIn();
        setProfileUpdated(true);
      } catch (e) {
        console.error(e);
      }
    }
  }

  const { username: userParam } = useParams();
  const { loading, data } = useQuery(QUERY_ME, {
    variables: { username: userParam },
  });
  // const user = data?.me || {};
  const user = data?.me || data?.user || {};
  console.log('fetched user data: ', user)
  //new
  const [formState, setFormState] = useState({
    age: user.age,
    height: user.height,
    weight: user.weight,
    role: user.role,
    interests: user.interests,
    ethnicity: user.ethnicity,
    description: user.description,
  });

  // edit personal user info using the imported mutation
  const [editUser, { error }] = useMutation(EDIT_USER);

  // update state based on form input changes
  const handleChange = (e) => {
    // console.log("e here: ", e.target.name);

    //reset profile updated to false
    setProfileHeightUpdated(false);
    var value = e.target.type === "true" ? e.target.checked : e.target.value;
    const name = e.target.name;
    // console.log(name, value);

    // Height Value to String
    if (e.target.name === 'height') {
      var heightValue = value.toString()
      value = toFeetandInch(heightValue)

      // Change height in inches to feet and inches
      function toFeetandInch(inches) {
        return (parseInt(inches / 12) + " ' " + Math.round(inches % 12, 1) + ' " ')
      }
      heightValue = value
    }

    if (e.target.name === 'age') { 
      var agevalue = e.target.type === "true" ? e.target.checked : e.target.value;
      var today = new Date();
      var birthDate = new Date(value);
      var age = today.getFullYear() - birthDate.getFullYear();
      console.log('age before changing value: ', age)
      agevalue = age.toString()
      console.log('age value to string: ', agevalue)
     
      const name = e.target.name;
      console.log('bruh what is all this then: ', name, agevalue);
    }

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSlider = (e) => {
    // console.log("e", e);


    //reset profile updated to false
    setProfileUpdated(false);
    var value = e.target.type === "true" ? e.target.checked : e.target.value;

    const name = e.target.name;
    console.log(name, value);

    // Turns numberical value into string//
    var weightValue = value.toString()
    value = weightValue



    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // State for ethnicity //
  const { white, black, asian, pacificislander, americanindian, mixed, other } = formState;




  // Values for height/labels for every 6 inches //
  const marks = [
    {
      value: 48,
      label: "4'0",
    },
    {
      value: 49,

    },
    {
      value: 50,

    },
    {
      value: 51,
      label: "4'3",
    },

    {
      value: 52,

    },
    {
      value: 53,

    },
    {
      value: 54,
      label: "4'6",
    },
    {
      value: 55,

    },
    {
      value: 56,

    },
    {
      value: 57,
      label: "4'9",
    },
    {
      value: 58,

    },
    {
      value: 59,

    },
    {
      value: 60,
      label: "5'0",
    },
    {
      value: 61,
    },
    {
      value: 62,
    },
    {
      value: 63,
      label: "5'3",
    },
    {
      value: 64,

    },
    {
      value: 65,

    },
    {
      value: 66,
      label: "5'6",
    },
    {
      value: 67,

    },
    {
      value: 68,

    },
    {
      value: 69,
      label: "5'9",
    },
    {
      value: 70,

    },
    {
      value: 71,

    },
    {
      value: 72,
      label: "6'0",
    },
    {
      value: 73,

    },
    {
      value: 74,

    },
    {
      value: 75,
      label: "6'3",
    },
    {
      value: 76,

    },
    {
      value: 77,

    },
    {
      value: 78,
      label: "6'6",
    },


  ];


  //Values for weight//labels every 5lbs
  const markss = [
    {
      value: 90,
      label: "90lbs",
    },
    {
      value: 95,

    },
    {
      value: 100,
      label: "100lbs"
    },
    {
      value: 105,

    },

    {
      value: 110,
      label: "110lbs"
    },
    {
      value: 115,

    },
    {
      value: 120,
      label: "120lbs"
    },
    {
      value: 125,

    },
    {
      value: 130,
      label: "130lbs"
    },
    {
      value: 135,

    },
    {
      value: 140,
      label: "140lbs"
    },
    {
      value: 145,

    },
    {
      value: 150,
      label: "150lbs"
    },
    {
      value: 155,

    },
    {
      value: 160,
      label: "160lbs"
    },
    {
      value: 165,

    },
    {
      value: 170,
      label: "170lbs"
    },
    {
      value: 175,

    },
    {
      value: 180,
      label: "180lbs"
    },
    {
      value: 185,

    },
    {
      value: 190,
      label: "190lbs"
    },
    {
      value: 195,

    },
    {
      value: 200,
      label: "200lbs"
    },
    {
      value: 205,

    },
    {
      value: 210,
      label: "210lbs"
    },
    {
      value: 215,

    },
    {
      value: 220,
      label: "220lbs"
    },
    {
      value: 225,

    },
    {
      value: 230,
      label: "230lbs"
    },
    {
      value: 235,

    },
    {
      value: 240,
      label: "240lbs"
    },
    {
      value: 245,

    },
    {
      value: 250,
      label: "250lbs"
    },
    {
      value: 255,

    },
    {
      value: 260,
      label: "260lbs"
    },
    {
      value: 265,

    },
    {
      value: 270,
      label: "270lbs"
    },
    {
      value: 275,

    },
    {
      value: 280,
      label: "280lbs"
    },
    {
      value: 285,

    },
    {
      value: 290,
      label: "290lbs"
    },
    {
      value: 295,

    },
    {
      value: 300,
      label: "300lbs"
    },


  ];

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      await editUser({
        variables: { ...formState },
      });
      // check if current user has token in localstorage
      auth.loggedIn();
      setProfileUpdated(true);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (

    <main className="flex-column align-content-center mb-4">

      <Subheader
        link={link}
        pageTitle={pageTitle}
        previousPageTitle={previousPageTitle}
      />
      <div className="container">
        <div className="editProfile">
          {/* ---------FORM START-------------- */}
          <div className="card-container">
          <form onSubmit={handleFormSubmit}>
            {user.photoURL == 'placeholder' ? (
              <img className="avatar" src="https://via.placeholder.com/468" alt="" />
            )
              : (
                <img className="avatar" src={user.photoURL} alt="" />
              )
            }
            <Link
              style={{
                color: "white",
                fontFamily: "sans-serif",
                textAlign: "center",
              }}
              to="/fileupload"
            >
              {" "}
              Edit Profile Picture →
            </Link>
            <div className="flex-row mb-3 prof-movies">
              {/* AGE INPUT Start*/}

              <TextField
                label="Birthday"
                type="date"
                id="date"
                name="age"
                defaultValue="2017-05-24"
                inputFormat="MM/DD/YYYY"
                value={formState.age}
                onChange={handleChange}
                minDate={"01/01/1900"}
                maxDate={"01/01/200"}
              />


              <br></br>


              {/* AGE INPUT End*/}
            </div>

            {/* -----HEIGHT & WEIGHT START------  */}

            <div>
              <Slider
                defaultValue={user.height}

                aria-labelledby="discrete-slider-always"
                step={1}
                min={48}
                max={78}
                marks={marks}
                name="height"
                type="height"
                id="height"
                value={formState.heightValue}
                valueLabelDisplay="off"
                onChange={handleChange}
              />
            </div>
            <div> Weight </div>
            <Slider defaultValue={150}

              aria-labelledby="discrete-slider-always"
              step={1}
              min={90}
              max={300}
              marks={markss}
              name="weight"
              type="weight"
              id="weight"
              value={formState.weightValue}
              valueLabelDisplay="on"
              onChange={handleSlider}


            />


            {/* -----HEIGHT & WEIGHT END------  */}


            {/* -----ROLE------  */}

            <h2 className="options-editprofile">Role:</h2>
            <div className="multiple-input-container">
              <label htmlFor="white">Female</label>
              <input
                className="form-input"
                placeholder="Role"
                name="role"
                type="radio"
                id="female"
                value="female"
                onChange={handleChange}
                checked={formState.role === "female"}
              />
              <label htmlFor="black">Male</label>
              <input
                className="form-input"
                placeholder="Role"
                name="role"
                type="radio"
                id="male"
                value="male"
                onChange={handleChange}
                checked={formState.role === "male"}
              />
            </div>
            {/* -----------ROLE END------- */}

            {/* -----ETHNICITY START------  */}
            <h2 className="options-editprofile">Ethnicity:</h2>
            <div className="multiple-input-container">
              <label htmlFor="white">White</label>
              <input
                className="form-input"
                placeholder="Ethnicity"
                name="ethnicity"
                type="radio"
                id="white"
                value="white"
                onChange={handleChange}
                checked={formState.ethnicity === "white"}
              />
              <label htmlFor="black">black</label>
              <input
                className="form-input"
                placeholder="Ethnicity"
                name="ethnicity"
                type="radio"
                id="black"
                value="black"
                onChange={handleChange}
                checked={formState.ethnicity === "black"}
              />
              <label htmlFor="asian">asian</label>
              <input
                className="form-input"
                placeholder="Ethnicity"
                name="ethnicity"
                type="radio"
                id="asian"
                value="asian"
                onChange={handleChange}
                checked={formState.ethnicity === "asian"}
              />
              <label htmlFor="pacific-islander">pacific islander</label>
              <input
                className="form-input"
                placeholder="Ethnicity"
                name="ethnicity"
                type="radio"
                id="pacific-islander"
                value="pacific-islander"
                onChange={handleChange}
                checked={formState.ethnicity === "pacific-islander"}
              />
              <label htmlFor="american-indian">american indian</label>
              <input
                className="form-input"
                placeholder="Ethnicity"
                name="ethnicity"
                type="radio"
                id="american-indian"
                value="american-indian"
                onChange={handleChange}
                checked={formState.ethnicity === "american-indian"}
              />
              <label htmlFor="other-ethnicity">other</label>
              <input
                className="form-input"
                placeholder="Ethnicity"
                name="ethnicity"
                type="radio"
                id="other-ethnicity"
                value="other"
                onChange={handleChange}
                checked={formState.ethnicity === "other"}
              />
            </div>
            {/* -----ETHNICITY START------  */}
            {/* -----INTERESTS------  */}
            <div>
              {user.interests.length > 0 && ( //check if deletable interests array has anything inside of it
                <h2 className="options-editprofile">My Interests:</h2>
              )}
              <Stack style={{ flexWrap: 'wrap', paddingLeft: '1em' }} direction="row" spacing={1}>
                {user.interests.length > 0 && user.interests.map(interest =>
                  <Chip key={interest + '-deletable'} label={interest.toLowerCase()} onClick={handleDeleteInterest(interest)} onDelete={handleDeleteInterest(interest)} />
                )}
              </Stack>
              <h3 className="options-editprofile">Choose More Interests Below:</h3>
              <Stack style={{ flexWrap: 'wrap', paddingLeft: '1em' }} direction="row" spacing={1}>
                {selectableInterests
                  .filter(item => !user.interests.includes(item))
                  .map(interest =>
                    <Chip key={interest + '-selectable'} style={{ marginBottom: '1em', marginLeft: '0', marginRight: '8px' }} label={interest.toLowerCase()} onClick={handleAddInterest(interest)} />
                  )}
              </Stack>
            </div>

            <br />
            {/* -----DESCRIPTION------  */}
            <input
              className="form-input"
              placeholder="Description"
              name="description"
              type="text"
              id="description"
              value={formState.description}
              onChange={handleChange}
            />

            <button type="submit">Edit Profile</button>
          </form>
          </div>
          {/* ---------FORM END-------------- */}
          {error || addUserInterestsError || deleteUserInterestsError && (
            <div>Error saving your profile. Please try again later.</div>
          )}
          {profileUpdated && <div>Your profile was updated!</div>}
        </div>
        <Link
          style={{
            color: "white",
            fontFamily: "sans-serif",
            textAlign: "center",
          }}
          to="/profile"
        >
          {" "}
          Back To Profile →
        </Link>
      </div>
    </main>
  );
};

export default EditProfile;
