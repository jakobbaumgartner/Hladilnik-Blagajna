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





export default class Poraba extends Component {

    constructor(props) {
        super(props);
        this.state = { users: ['Jakob Baumgartner', 'Aljaž Blažič', 'Miha Ožbot', 'Miloš Antič'], selectedUser: 'Jakob Baumgarter', dialogAddChange: 1 }

        this.closeDialog = this.closeDialog.bind(this)
        this.opendialogAddChange = this.opendialogAddChange.bind(this)
        // this.openDialogAdd = this.openDialogAdd.bind(this)
        // this.removeArticle = this.removeArticle.bind(this)

    }

    opendialogAddChange() {
        this.setState({ dialogAddChange: 1 })
    }

    
    closeDialog() {
        this.setState({ dialogAddChange: 0 });
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
                <Button variant="primary" >
                    Dodaj
                </Button>
            </Modal.Footer>
        </Modal>
        }
        else {
            dialog = '';
        }



        return (

            <div id="displayMainButtons">

                {dialog}

    <ListGroup horizontal id="stanje">
                    <ListGroup.Item><h5>Stanje</h5><br />15eur</ListGroup.Item>
                </ListGroup>

                <Button variant="primary" id="polni" onClick={this.opendialogAddChange}>Polni</Button>

                <DropdownButton id="dropdown-names-button" title={this.state.selectedUser}  >
                    {listNames}
                </DropdownButton>
            

                <AddReportComponent />

            </div>
        )

    }
}

