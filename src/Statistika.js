import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import AddReportComponent from './AddReportComponent';
import HistoryReportsComponent from './HistoryReportsComponent.js'
import validator from 'validator';
import { getUsers, getRecords, getInventory, addCash, getRegisterData, saveReport } from './firebase';





export default class Statistika extends Component {

    constructor(props) {
        // const d = new Date();
        super(props);
        this.state = {
            users: [],
            storage: {},
            newReport: {
                // Date: {
                //     day: d.getDate(),
                //     month: d.getMonth(),
                //     year: d.getFullYear()
                // },
                Articles: {

                },
                Sum: 0
            },
            reports: {},
            selectedUser: '',
            selectedArticle: '',
            userName: 'izberi uporabnika',
            dialogAddChange: 0,
            dialogAddArticle: 0,
            dialogRemoveArticle: 0,
            dialogSaveReport: 0
        }

        this.getUsersData = this.getUsersData.bind(this)

    }

   
 




  


    getUsersData() {
        getUsers().then((querySnapshot) => {
            var users = {};

            querySnapshot.forEach((doc) => {

                var dat = doc.data()
                users[doc.id] = doc.data();
                this.setState({ credit: dat.credit })
            });

            const listNames = [];

            for (const [key, user] of Object.entries(users)) {
                // console.log(`${key}: ${user}`);
    
                if(this.props.userID == user.hiddenid) {
                    console.log(user.name)


                    this.setState({
                        selectedUser: key,
                        //    credit: this.state.users[user].credit,
                        userName: users[key].name
                    })
            
                    getRecords(key).then((records) => {
            
                        this.setState({ reports: records })
            
                    })

                }
            }
            this.setState({ users: users })

        })
    }

  

    componentDidMount() {

        console.log('reloaded!!!')

        // this.getStorage()
        this.getUsersData()

        console.log(this.state.userName)

    }

    render() {

        
        const listNames = [];

        for (const [key, user] of Object.entries(this.state.users)) {
            // console.log(`${key}: ${user}`);
            listNames.push(<Dropdown.Item as="button" id={key} key={key} onClick={() => this.selectUser(key)}>{user.name}</Dropdown.Item>)

            if(this.props.userID == user.hiddenid) {
                console.log(user.name)
            }
        }

        var stanje = 0;

        for (const [k, v] of Object.entries(this.state.reports)) {

            // console.log(v)

            if (v.Sort == "articles") {
                stanje = stanje - v.Sum;
            }
            else if (v.Sort == "credit") {
                stanje = stanje + v.Sum;
            }

        }


   
        console.log('loaded statistika')


        return (

            <div id="statistikacontainer">

                <div id="displayStanje">

                    <ListGroup horizontal id="stanje">
                        <ListGroup.Item><h5>Stanje</h5><br />{parseFloat(stanje).toFixed(2)} €</ListGroup.Item>
                    </ListGroup>

                    <ListGroup horizontal id="userName">
                        <ListGroup.Item><h5>{this.state.userName}</h5></ListGroup.Item>
                    </ListGroup>

                </div>

                <div id="statistikaDisplay">

                    <HistoryReportsComponent userId={this.state.selectedUser} reports={this.state.reports} />

                </div>

            </div>
        )

    }
}

