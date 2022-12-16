import React, { Component } from 'react';
import './App.css';
import DisplayMain from './DisplayMain';
import Poraba from './Poraba';
import Inventorij from './Inventorij';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Button from 'react-bootstrap/Button';
import Auth from "./Authentication.js"
import { auth, logOut } from "./firebase";




class App extends Component {

  constructor(props) {
    super(props);
    this.state = { date: new Date(), page: 'inventorij'};
    this.changePage = this.changePage.bind(this);
    this.refreshPage = this.refreshPage.bind(this);
    this.backToLogin = this.backToLogin.bind(this)
  }

  changePage(page) {
    console.log(page)
    this.setState({ page: page })
  }

  refreshPage() {

    // console.log(auth.currentUser.email)
    this.setState({page: 'inventorij'})
  }

  backToLogin () {
    this.setState({page: 'login'})
  }


  componentDidMount() {

    const user =  auth.onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        console.log("User logged in.")
        console.log(user)
        
      } else {

        console.log("User logged out.")
      }
    });

    console.log("AAAAAAAAAA")

  }


  render() {

    // !auth.currentUser

    // auth.currentUser.then(


      
    // )

    if (!auth.currentUser) {

      return (
          <Auth refreshPage={this.refreshPage}/>
        )

    }
    else {

    return (
      <div className="App">

          <div id="logout" ><Button className='border' variant="light" onClick={(e) => {
              e.preventDefault()
              logOut().then(() => this.refreshPage())
            } }>Odjava</Button>
</div>
        
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

}


export default App;
