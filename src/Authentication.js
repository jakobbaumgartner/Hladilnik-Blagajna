import React, { Component, useEffect, useState } from 'react';
import { auth, logInWithEmailAndPassword, logOut } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import ReactDOM from 'react-dom/client';
import Button from 'react-bootstrap/Button';



export default function Authentication(props) {

  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);


  return (
    <div className="Auth-form-container">
      <form className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Prijava</h3>
          <div className="form-group mt-3">
            <label className="AuthLabel">e-mail</label>
            <input
              id="email_input"
              type="email"
              className="form-control mt-1"
              placeholder="Enter email"
            />
          </div>
          <div className="form-group mt-3">
            <label className="AuthLabel">geslo</label>
            <input
              id="password_input"
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary" onClick={(e) => {
              e.preventDefault()
              logInWithEmailAndPassword(document.getElementById("email_input").value, document.getElementById("password_input").value).then(()=>props.refreshPage())
            }}>
              Pošlji
            </button>
            {/* <Button variant="danger" onClick={(e) => {
              e.preventDefault()
              logOut()
            }
            }>Logout</Button>{' '} */}
            {/* <Button variant="success" onClick={(e) => {
              e.preventDefault()
              // console.log(auth.currentUser)
            }
            }>CheckUser</Button>{' '} */}

          </div>

        </div>
      </form>
    </div>
  )
}