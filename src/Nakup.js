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
import { getBoughtList } from './firebase';





export default class Nakup extends Component {

    constructor(props) {
        // const d = new Date();
        super(props);
        this.state = {

        }
    }



    componentDidMount() {

    }

    render() {

        var list = []

        for (const [k, v] of Object.entries(this.props.boughtList)) {

            console.log(v)

            list.push(<p text-align="left"	>IME: {v.name} -- KOLIČINA: {v.amount} -- CENA: {v.basePrice} € >>> VSOTA: {v.amount * v.basePrice} € -- DATUM: {v.date.toDate().getDate()} . {v.date.toDate().getMonth()+1} . {v.date.toDate().getFullYear()} </p>)

            console.log(v.date.toDate().getMonth())

        }



        console.log('loaded nakup')


        return (

            <div id="statistikacontainer">

                <div id="statistikaDisplay">
                    <h3>Skupaj kupljeno: {this.props.boughtSum} €</h3><br></br>

                    {list}
                    
                </div>

            </div>
        )

    }
}

