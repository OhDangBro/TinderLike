// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref,uploadBytes, listAll, getDownloadURL } from 'firebase/storage';



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIxPnExjtSOzAUL-YUNpBht13YoPcVVnQ",
  authDomain: "uploadingfile-1701c.firebaseapp.com",
  projectId: "uploadingfile-1701c",
  storageBucket: "uploadingfile-1701c.appspot.com",
  messagingSenderId: "267893601050",
  appId: "1:267893601050:web:3d82603cc729ebe10bf2a3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage();


//Storage



export async function upload(file, currentUser, setLoading) {
const fileRef= ref(storage, currentUser.uid + 'png')
setLoading(true);
const snapshot = await uploadBytes(fileRef, file);
setLoading(false)
alert('Uploaded file!')
}






