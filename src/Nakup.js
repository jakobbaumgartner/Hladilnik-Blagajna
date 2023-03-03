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
import Table from 'react-bootstrap/Table';
import validator from 'validator';




export default class Nakup extends Component {

    constructor(props) {
        // const d = new Date();
        super(props);
        this.state = {

        }
    }


    render() {

        var list = []

        console.log(this.props.boughtList)

        for (const [k, item] of Object.entries(this.props.boughtList)) {

            list.push(
                <tr>
                    <td>{item.name}</td>
                    <td>{parseFloat(item.basePrice).toFixed(2)} €</td>
                    <td>{parseFloat(item.amount).toFixed(2)}</td>
                    <td>{parseFloat(item.amount * item.basePrice).toFixed(2)} €</td>
                    <td>{item.date.toDate().getDate()} . {item.date.toDate().getMonth() + 1} . {item.date.toDate().getFullYear()}</td>
                </tr>
            )

        }



        return (

            <div id="statistikacontainer">

                <div id="statistikaDisplay">
                    <Table>
                        <tr>
                            <th>Skupaj: {this.props.boughtSum} €</th>
                        </tr>
                    </Table>
                    <Table striped hover style={{ "marginTop": '20px', "marginBottom": '20px' }}>
                        <thead>
                            <tr>
                                <th>Ime</th>
                                <th>Cena</th>
                                <th>Količina</th>
                                <th>Skupaj</th>
                                <th>Datum</th>
                            </tr>
                        </thead>

                        {list}
                    </Table>

                </div>

            </div>
        )

    }
}

