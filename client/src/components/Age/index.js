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
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
// import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
// import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

// Subheader Props to Pass
const link = "/profile";
const pageTitle = "Edit Profile";
const previousPageTitle = "Profile";


const Age = () => {

  let [profileUpdated, setProfileUpdated] = useState(false);




  const { username: userParam } = useParams();
  const { loading, data } = useQuery(QUERY_ME, {
    variables: { username: userParam },
  });
  // const user = data?.me || {};
  const user = data?.me || data?.user || {};
  console.log('fetched user data: ', user)
  //new
  const [formState, setFormState] = useState({

    age: user.age
  });



  // edit personal user info using the imported mutation
  const [editUser, { error }] = useMutation(EDIT_USER);

  // update state based on form input changes
  const handleChange = (e) => {
    console.log("e's name: ", e.target.name);

    setProfileUpdated(false);
    var value = e.target.type === "true" ? e.target.checked : e.target.value;
    var today = new Date();
    var birthDate = new Date(value);

    var age = today.getFullYear() - birthDate.getFullYear();
    console.log(age)
    value = age.toString()
    console.log(value)
    const names = e.target.name;
    console.log(names, value);
    ;
  };


  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log('before mutation whats age: ', formState)
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
          <form onSubmit={handleFormSubmit}>
            {user.photoURL === 'placeholder' ? (
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
            {/* 
             <div>
              <Slider
                defaultValue={user.height}
                getAriaValueText={valuetext}
                aria-labelledby="discrete-slider-always"
                step={1}
                 min={48}
                 max={78}
                 marks={marks}
               name="height"
                type="height"
                id="height"
                value={formState.heightValue}
                 valueLabelDisplay="on"
                 onChange={handleChange}
               />
             </div>
             <div> Weight </div>
             <Slider defaultValue={150}
               getAriaValueText={valuetext}
               aria-labelledby="discrete-slider-always"
               step={1}
               min={90}
               max={300}
              marks={markss}
               name="weight"
               type="weight"
               id="weight"
               value= {formState.weightValue}
               valueLabelDisplay="on"
               onChange={handleSlider}
               
               
                />  */}


            {/* -----HEIGHT & WEIGHT END------  */}

            {/* -----ROLE START ------  */}

            {/* <Box sx={{ display: 'flex' }}>
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">Role:</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="Female"
                  name="radio-buttons-group">
                  <FormControlLabel
                    name="role"
                    type="radio"
                    id="female"
                    value="female"
                    onChange={handleChange}
                    checked={female}
                    control={<Radio />}
                    label="Female" />
                  <FormControlLabel
                    name="role"
                    type="radio"
                    id="male"
                    value="male"
                    onChange={handleChange}
                    checked={male}
                    control={<Radio />}
                    label="Male" />
                </RadioGroup>
              </FormControl>
              <FormHelperText>Please only pick one!</FormHelperText>
            </Box> */}

            {/* -----------ROLE END------- */}

            {/* -----ETHNICITY START------  */}
            {/* <h2 className="options-editprofile">Ethnicity:</h2>
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
            </div> */}
            {/* -----ETHNICITY START------  */}
            {/* -----INTERESTS------  */}
            {/* <input
              className="form-input"
              placeholder="Interests"
              name="interests"
              type="text"
              id="interests"
              value={formState.interests}
              onChange={handleChange}
            /> */}
            {/* -----DESCRIPTION------  */}
            {/* <input
              className="form-input"
              placeholder="Description"
              name="description"
              type="text"
              id="description"
              value={formState.description}
              onChange={handleChange} />  */}

            {/* -----DESCRIPTION END------  */}

            <button type="submit">Edit Profile</button>
          </form>

          {/* ---------FORM END-------------- */}
          {error && (
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

export default Age;