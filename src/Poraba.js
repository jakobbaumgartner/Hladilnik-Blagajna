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





export default class Poraba extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: ['Jakob Baumgartner', 'Aljaž Blažič', 'Miha Ožbot', 'Miloš Antič'],
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
            selectedUser: 'Jakob Baumgarter',
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
        console.log("hts")
    }


    closeDialog() {
        this.setState({ dialogAddChange: 0, dialogAddArticle: 0, dialogSaveReport: 0 });
    }

    openSaveDialog() {
        this.setState({ dialogSaveReport: 1 })
    }

    render() {

        const listNames = this.state.users.map((name) =>
            <Dropdown.Item as="button">{name}</Dropdown.Item>
        );

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
                console.log(`${key}: ${value}`);
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

            <div style={{width: '100%'}}>

                {dialog}

                <div id="displayMainButtons">

                    <ListGroup horizontal id="stanje">
                        <ListGroup.Item><h5>Stanje</h5><br />15eur</ListGroup.Item>
                    </ListGroup>

                    <Button variant="warning" id="polni" onClick={this.opendialogAddChange}>Polni</Button>

                    <DropdownButton variant="warning" id="dropdown-names-button" title={this.state.selectedUser}  >
                        {listNames}
                    </DropdownButton>

                </div>

                <div id="porabaDisplay">
                    <AddReportComponent opendialogAddArticle={this.opendialogAddArticle} dialogSave={this.openSaveDialog} />

                    <HistoryReportsComponent />
                </div>

            </div>
        )

    }
}

