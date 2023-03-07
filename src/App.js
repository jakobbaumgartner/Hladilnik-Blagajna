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
import { auth, logOut, getUsers, getRecords, getInventory, getBoughtList, addCash, getRegisterData, saveReport, getAllUsersData } from './firebase';
import Statistika from './Statistika';
import Nakup from './Nakup';
import Pregled from './Pregled'
import Mail from './Mail';





class App extends Component {

  constructor(props) {
    super(props);
    this.state = { storage: {}, date: new Date(), page: 'inventorij', updateStatus: 0 };
    this.changePage = this.changePage.bind(this);
    this.refreshPage = this.refreshPage.bind(this);
    this.backToLogin = this.backToLogin.bind(this);
    this.changeUpdateStatus = this.changeUpdateStatus.bind(this);
    this.getStorage = this.getStorage.bind(this)
    this.getItems = this.getItems.bind(this)

  }


  getItems() {

    getBoughtList().then((querySnapshot) => {

      var sum = 0;
      var price
      var number

      var list = {};

      querySnapshot.forEach((doc) => {
        list[doc.id] = doc.data()
        price = Number(doc.data().basePrice);
        number = Number(doc.data().amount);

        sum = sum + price * number;
      });

      this.setState({ boughtList: list, boughtSum: sum })

      console.log(list)

      console.log('boughtList')
    })
  }


  changeUpdateStatus(status) {
    this.setState({ updateStatus: status })
  }

  changePage(page) {
    // console.log(page)
    this.setState({ page: page })
  }

  refreshPage() {

    // console.log(auth.currentUser.email)
    this.setState({ page: 'inventorij' })
  }

  backToLogin() {
    this.setState({ page: 'login' })
  }

  getStorage() {
    getInventory().then((querySnapshot) => {

      var inventory = {};

      querySnapshot.forEach((doc) => {
        inventory[doc.id] = doc.data()
      });

      this.setState({ storage: inventory })

      // console.log(inventory)

      console.log('storage')
    })
  }




  componentDidMount() {

    getAllUsersData()
    this.getItems()


    const user = auth.onAuthStateChanged(function (user) {
      // if (user) {
      //   // User is signed in.
      //   console.log("User logged in.")
      //   console.log(user)

      // } else {

      //   console.log("User logged out.")
      // }
    });

    // console.log("AAAAAAAAAA")

    this.getStorage()
  }


  render() {

    if (!auth.currentUser) {


      if (window.location.pathname == '/') {
        return (
          <Auth refreshPage={this.refreshPage} />
        )
      }
      else {
        var str = window.location.pathname
        var pathid = str.substring(1);
        console.log(pathid)

        return (
          <div className="App">
            <div id="topBanner">
              <img src='Logo_LAK.png' height='100%' alt="Logo" />
            </div>
            <Statistika userID={pathid} getStorage={this.getStorage} inventory={this.state.storage} changePage={this.changePage} updateStatus={this.state.updateStatus} changeUpdateStatus={this.changeUpdateStatus} />
          </div>
        )

      }


    }
    else {

      return (
        <div className="App">

          <div id="topBanner">
            <img src='Logo_LAK.png' height='100%' alt="Logo" />

          </div>

          <div id="logout" ><Button className='border' variant="light" onClick={(e) => {
            e.preventDefault()
            logOut().then(() => this.refreshPage())
          }}>Odjava</Button>
          </div>

          <Tabs
            id="controlled-tabs"
            activeKey={this.state.page}
            onSelect={(k) => this.setState({ page: k })}
            className="mb-3"
          >
            <Tab eventKey="inventorij" title="Inventorij">
              <Inventorij getStorage={this.getStorage} inventory={this.state.storage} changePage={this.changePage} updateStatus={this.state.updateStatus} changeUpdateStatus={this.changeUpdateStatus} boughtSum={this.state.boughtSum} boughtList={this.state.boughtList} updateBoughtList={this.getItems} />
            </Tab>
            <Tab eventKey="poraba" title="Poraba">
              <Poraba getStorage={this.getStorage} inventory={this.state.storage} changePage={this.changePage} updateStatus={this.state.updateStatus} changeUpdateStatus={this.changeUpdateStatus} />
            </Tab>
            <Tab eventKey="Nakup" title="Nakup">
              <Nakup boughtSum={this.state.boughtSum} boughtList={this.state.boughtList} updateBoughtList={this.getItems} />
            </Tab>
            <Tab eventKey="Pregled" title="Pregled">
              <Pregled/>
            </Tab>
            <Tab eventKey="Mail" title="Mail">
              <Mail/>
            </Tab>
          </Tabs>
        </div>)
    }
  }

}


export default App;
