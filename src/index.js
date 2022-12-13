import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import * as firebase from 'firebase';
import reportWebVitals from './reportWebVitals';

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";


var firebase = require("firebase/app");
var fireauth = require("firebase/auth");

var firebaseConfig = {
  apiKey: "AIzaSyBrE37q6MYmBUDOizljWYATH3zkvJPi0OE",
  authDomain: "hladilnikfe.firebaseapp.com",
  projectId: "hladilnikfe",
  storageBucket: "hladilnikfe.appspot.com",
  messagingSenderId: "183131767802",
  appId: "1:183131767802:web:4907b12b95eb255f2eda43"
};

const app = firebase.initializeApp(firebaseConfig);

// const auth = getAuth();

  

// console.log(app)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
