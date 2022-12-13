import React, { Component } from 'react';
import './App.css';
import DisplayMain from './DisplayMain';
import Poraba from './Poraba';
import Inventorij from './Inventorij';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Auth from "./Authentication.js"


import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut  } from "firebase/auth";



class App extends Component {

  constructor(props) {
    super(props);
    this.state = { date: new Date(), page: 'login', email: '' };
    this.changePage = this.changePage.bind(this);
  }

  changePage(page) {
    console.log(page)
    this.setState({ page: page })
  }

  componentDidMount () {
    // console.log(this.props.auth)
    // console.log(this.props.auth)
    const auth = getAuth();
signOut(auth).then(() => {
  // Sign-out successful.
  console.log("totally out")
  console.log(auth)
}).catch((error) => {
  // An error happened.
});

    if(getAuth().currentUser) {
      console.log("logggedin")
    }

  }


   

  render() {

    if (this.state.page == 'login') {

      return(
      <Auth/>)

    }

    return (
      <div className="App">
        <Tabs
          id="controlled-tab-example"
          activeKey={this.state.page}
          onSelect={(k) => this.setState({ page: k })}
          className="mb-3"
        >
          <Tab eventKey="inventorij" title="Inventorij">
            <Inventorij changePage={this.changePage} />
          </Tab>
          <Tab eventKey="poraba" title="Poraba">
            <Poraba changePage={this.changePage} />
          </Tab>
        </Tabs>
      </div>)
  }

}


export default App;
