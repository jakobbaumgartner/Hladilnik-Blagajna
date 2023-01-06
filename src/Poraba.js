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
import { getUsers, getRecords } from './firebase';





export default class Poraba extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            storage: {
                $4n5pxq24kriob12ogd: {
                    name: 'Twix 50g',
                    price: 0.8,
                    number: 20
                },
                $4n5pxq24ksiob12ogl: {
                    name: 'Bounty',
                    price: 0.68,
                    number: 15
                },
                $4n5pxq24krio242oab: {
                    name: 'Radenska',
                    price: 0.9,
                    number: 4
                }
            },
            reports: {},
            selectedUser: '',
            userName: 'izberi uporabnika',
            dialogAddChange: 0,
            dialogAddArticle: 0,
            dialogSaveReport: 0
        }

        this.closeDialog = this.closeDialog.bind(this)
        this.opendialogAddChange = this.opendialogAddChange.bind(this)
        this.opendialogAddArticle = this.opendialogAddArticle.bind(this)
        this.openSaveDialog = this.openSaveDialog.bind(this)

    }

    opendialogAddChange() {
        this.setState({ dialogAddChange: 1 })
    }

    opendialogAddArticle() {
        this.setState({ dialogAddArticle: 1 })
    }


    closeDialog() {
        this.setState({ dialogAddChange: 0, dialogAddArticle: 0, dialogSaveReport: 0 });
    }

    openSaveDialog() {
        this.setState({ dialogSaveReport: 1 })
    }


    selectUser(user) {
        this.setState({selectedUser: user,
                       credit: this.state.users[user].credit,
                       userName: this.state.users[user].name
                    })

        getRecords(user).then((records) => {

            this.setState({reports: records})
        
            })
            

        // getRecords(user)
    }

    componentDidMount() {   
        (getUsers().then((querySnapshot) => {
            var users = {};

            querySnapshot.forEach((doc) => {

                var dat = doc.data()
                users[doc.id] = doc.data();
                this.setState({ credit: dat.credit })
            });

            this.setState({users: users})

        }))

    }

    render() {

        const listNames = [];

        for (const [key, user] of Object.entries(this.state.users)) {
            // console.log(`${key}: ${user}`);
            listNames.push(<Dropdown.Item as="button" id={key} key={key} onClick={() => this.selectUser(key)}>{user.name}</Dropdown.Item>)
          }

        var stanje = 0;  

        for (const [k, v] of Object.entries(this.state.reports)) {

            // listItems.push(
            //     <ArticleComponent uniqid={k} Name={v.name} boughtPrice={v.basePrice} overHead={v.overHead} number={v.amount} addArticles={this.openDialogAdd} removeArticle={(id) => this.removeArticle(id)} changeSliderValue={(id, value) => {this.changeSliderValue(id, value)}}/>
            // )

            console.log(v)

            if (v.Sort == "articles") {
                stanje = stanje - v.Sum;
            }
            else if (v.Sort == "credit") {
                stanje = stanje + v.Sum;
            }

        }
        

        var dialog;

        if (this.state.dialogAddChange) {

            dialog = <Modal show="true">
                <Modal.Header closeButton onClick={this.closeDialog}>
                    <Modal.Title>Polni račun</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Polni €</InputGroup.Text>
                            <Form.Control />
                        </InputGroup>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" >
                        Dodaj
                    </Button>
                </Modal.Footer>
            </Modal>
        }
        else if (this.state.dialogAddArticle) {

            var artikels = [];

            for (const [key, value] of Object.entries(this.state.storage)) {
                // console.log(`${key}: ${value}`);
                artikels.push(<option><p>{value.name}  ( {value.number} ) </p></option>)
            }



            dialog = <Modal show="true">
                <Modal.Header closeButton onClick={this.closeDialog}>
                    <Modal.Title>Dodaj artikel</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Artikel: </InputGroup.Text>
                            <Form.Select defaultValue="">
                                {artikels}
                            </Form.Select>
                        </InputGroup>

                        <InputGroup className="mb-3">
                            <InputGroup.Text>Število: </InputGroup.Text>
                            <Form.Control />
                        </InputGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success">
                        Dodaj
                    </Button>
                </Modal.Footer>
            </Modal>

        }
        else if (this.state.dialogSaveReport) {
            dialog = <Modal show="true">
                <Modal.Header closeButton onClick={this.closeDialog}>
                    <Modal.Title>Shrani vnos</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.closeDialog}>Prekliči</Button>
                    <Button variant="success">Potrdi</Button>
                </Modal.Footer>
            </Modal>

        }
        else {
            dialog = '';
        }

      

        return (

            <div style={{ width: '100%' }}>

                {dialog}

                <div id="displayMainButtons">

                    <ListGroup horizontal id="stanje">
                        <ListGroup.Item><h5>Stanje</h5><br />{stanje}</ListGroup.Item>
                    </ListGroup>

                    <Button variant="warning" id="polni" onClick={this.opendialogAddChange}>Polni</Button>

                    <DropdownButton variant="warning" id="dropdown-names-button" title={this.state.userName}  >
                        {listNames}
                    </DropdownButton>

                </div>

                <div id="porabaDisplay">
                    <AddReportComponent opendialogAddArticle={this.opendialogAddArticle} dialogSave={this.openSaveDialog} />

                    <HistoryReportsComponent userId={this.state.selectedUser} reports={this.state.reports}/>
                </div>

            </div>
        )

    }
}

