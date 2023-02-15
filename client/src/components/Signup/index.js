import React, { useState } from "react";
import { ADD_USER } from "../../utils/mutations";
import { useMutation } from "@apollo/client";
import auth from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';


const Signup = () => {
  let [profileUpdated, setProfileUpdated] = useState(false);
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
    height: "",
    weight: "",
    role: "",
    ethnicity: "",
    interests: "",
    description: "",
    photoURL: ""
  });

  


  //State for checkboxes//
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);

  //Requirements for checkboxes to allow submit button to be enabled//
  const isAgreedAll = agree1 && agree2;
  const isDisabled = !isAgreedAll

  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/editprofile`;
    navigate(path);
  }

  // addUser using the mutation
  const [addUser] = useMutation(ADD_USER);

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
 


    setFormState({
      ...formState,
      [name]: value,

    });
  };



  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // TODO mutation
    try {
      const { data } = await addUser({
        variables: { ...formState },

      });

      // call Auth here to pass in the token and verify the token
      auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <main className="flex-row justify-center mb-4">
      <div className="col-12 col-md-6">
        <div className="card bg-secondary">
          <h5 className="mx-4">Sign Up</h5>
          <div className="card-body">
            <form onSubmit={handleFormSubmit}>
              {/* USERNAME INPUT START*/}
              <input
                className="form-input"
                placeholder="Your username"
                name="username"
                type="username"
                id="username"
                value={formState.username}
                onChange={handleChange}

              />
              {/* USERNAME INPUT END*/}
              {/* EMAIL INPUT START*/}
              <input
                className="form-input"
                placeholder="Your email"
                name="email"
                type="email"
                id="email"
                value={formState.email}
                onChange={handleChange}
              />
              {/* EMAIL INPUT END*/}
              {/* PASSWORD INPUT START*/}
              <input
                className="form-input"
                placeholder="******"
                name="password"
                type="password"
                id="password"
                value={formState.password}
                onChange={handleChange}
              />
              {/* PASSWORD INPUT END*/}

              {/* TERMS AGREEMENT START*/}
              <label>Agree to Terms</label>
              <div>
                <div>
                  {/* CHECKBOX 18 or older START */}
                  <input
                    type="checkbox"
                    name="agree1"
                    value="agree1"
                    checked={agree1}
                    onChange={(e) => setAgree1(e.target.checked)}
                  />
                  <label>I am 18 or older</label>
                </div>
                {/* CHECKBOX 18 or older END  */}
                {/* CHECKBOX Terms of Service Start  */}
                <div>
                  <input
                    type="checkbox"
                    name="agree2"
                    value="agree2"
                    checked={agree2}
                    onChange={(e) => setAgree2(e.target.checked)}
                  />
                  <label>I agree to terms of use and privacy policy.</label>
                </div>
                {/* CHECKBOX Terms of Service End  */}
              </div>
              <button
                type="submit"
                // onClick={routeChange}
                disabled={isDisabled}
                name="button"
              >Submit</button>
            </form>
          </div>
          <div className="login-link">
            <p>
              Have an account?<br></br>
              <a href="./Login">Login Here</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;