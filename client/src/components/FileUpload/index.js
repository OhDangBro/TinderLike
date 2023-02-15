import React from "react";
import { useState, useEffect } from "react";
import { storage } from "../../firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { QUERY_ME } from "../../utils/queries";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { EDIT_USER } from "../../utils/mutations";
import { useMutation } from "@apollo/client";
import auth from "../../utils/auth";
import Subheader from "../Subheader";

const link = "/editprofile";

function FileUpload() {
  const [imageUpload, setImageUpload] = useState(null);
  let currentImage;

  const { username: userParam } = useParams();
  const { loading } = useQuery(QUERY_ME, {
    variables: { username: userParam },
  });
  const imageListRef = ref(storage, "images/");

  // new

  const uploadImage = async () => {
    let upload;
    let getURL;
    if (imageUpload == null) return;
    try {
      const imageRef = ref(storage, `images/${imageUpload.username + v4()}`);
      upload = await uploadBytes(imageRef, imageUpload);
      console.log(upload.ref);
      getURL = await getDownloadURL(upload.ref);
      console.log(getURL);
      currentImage = getURL;
      await editUser({
        variables: { photoURL: getURL },
      });
    } catch (error) {
      console.error(error);
    }
    // setImageList((prev) => [...prev, getURL]);
  };

  // old
  // const uploadImage = async() => {
  //     if (imageUpload == null) return;
  //     const imageRef = ref(storage, `images/${imageUpload.username + v4()}`);
  //     uploadBytes(imageRef, imageUpload).then((snapshot) => {
  //         getDownloadURL(snapshot.ref).then((url) => {
  //             currentImage = url;
  //             setFormState({...formState, photoURL: currentImage}, myFunction)

  //             console.log('uploadImage formstate:', formState)
  //             setImageList((prev) => [...prev, url]);
  //         })
  //     })
  // };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await editUser({
        // variables: { ...formState },
        variables: { photoURL: currentImage },
      });
      // check if current user has token in localstorage
      auth.loggedIn();
      setImageUpload(true);
    } catch (e) {
      console.error(e);
    }
  };

  //new

  // edit personal user info using the imported mutation
  const [editUser] = useMutation(EDIT_USER);

  // update state based on form input changes
  const handleChange = (event) => {
    //reset profile updated to false
    setImageUpload(event.target.files[0]);
  };

  useEffect(() => {
    listAll(imageListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {});
      });
    });
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
<div class="button-container">
  <div>
    {/* Post fake image path */}
    <form onSubmit={handleFormSubmit}>
      <input
        type="file"
        name="photoURL"
        id="photoURL"
        onChange={handleChange}
      />
      <button onClick={uploadImage}> Upload Image</button>
    </form>
    <button type="submit">Save Changes</button>
  </div>

  <Subheader
    link={link}
  />
</div>
    
  );
}

export default FileUpload;
