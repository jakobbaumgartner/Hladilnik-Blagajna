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
import { getBoughtList, calcualteAllItemsSold, calculateBoughtSum } from './firebase';





export default class Pregled extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }



    componentDidMount() {
        calcualteAllItemsSold()

        // Call the calculateSum() function and log the result to the console
        calculateBoughtSum()
            .then((sum) => {
                console.log(`The total sum of bought items is ${sum}`)
                this.setState({ "amountTotalBought": sum })
            })
            .catch((error) => console.error(error));

    }

    render() {



        return (

            <div id="statistikacontainer">



            </div>
        )

    }
}

