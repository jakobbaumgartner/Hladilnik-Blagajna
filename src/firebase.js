import { initializeApp } from "firebase/app";

import {
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

import { getFirestore, collection, getDocs } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrE37q6MYmBUDOizljWYATH3zkvJPi0OE",
  authDomain: "hladilnikfe.firebaseapp.com",
  projectId: "hladilnikfe",
  storageBucket: "hladilnikfe.appspot.com",
  messagingSenderId: "183131767802",
  appId: "1:183131767802:web:6706cfc9f8bb51492eda43"
};

const app = initializeApp(firebaseConfig);

// AUTH

const auth = getAuth(app);

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password) //.then((a) => console.log(auth.currentUser));
    
  } catch (err) {
    console.log(email)
    console.log(password)
    console.error(err);
    alert(err.message);
  }
};

const logOut = async () => {
  await signOut(auth).then(()=>console.log(auth.currentUser));
};


// DATABASE
const db = getFirestore(app);

const getUsers = async () => {
  const querySnapshot = await getDocs(collection(db, "users",));
  // console.log(querySnapshot)
  // querySnapshot.forEach((doc) => {
  //   console.log(doc.id);
  //   console.log(doc.data())
  // });
  return querySnapshot
}

const getRecords = async (userid) => {
  const querySnapshot = await getDocs(collection(db, "users", userid, "records"));
  // console.log(querySnapshot)
  // querySnapshot.forEach((doc) => {
  //   console.log(doc.id);
  //   console.log(doc.data())
  // });
}



export {
  auth,
  // db,
  logInWithEmailAndPassword,
  logOut,
  getUsers,
  getRecords
};