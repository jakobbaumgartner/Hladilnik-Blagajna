import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import Table from 'react-bootstrap/Table';

import AddReportComponent from './AddReportComponent';
import HistoryReportsComponent from './HistoryReportsComponent.js'
import DownloadButton from './DownloadButton';

import validator from 'validator';
import { getBoughtList, calcualteAllItemsSold, calculateBoughtSum, getRegisterData, getInventoryBasePriceSum } from './firebase';





export default class Mail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            odpis: 0
        }
        this.autoSelectSenders = this.autoSelectSenders.bind(this)
        this.removeSelection = this.removeSelection.bind(this)

    }



    componentDidMount() {
        calcualteAllItemsSold().then(([allData, totalBought, totalCash, surPlus, odpis]) => {
            console.log(allData);
            
            allData.forEach((value) => {
                value.send = false
            });

            this.setState({ "allData": allData })
        }).catch((error) => {
            console.error(error);
        });


    }

    getRowStyle = (difference) => {
        if (difference < -5) {
            return { backgroundColor: '#EF2929' };
        } else if (difference > 5) {
            return { backgroundColor: '#73D216' };
        } else if (difference >= -5 && difference <= 5) {
            return { backgroundColor: '#EDD400' };
        }
    };

    updateObjectSendField(id, send) {
        // Find the index of the object with the matching id field
        const index = this.state.allData.findIndex(obj => obj.id === id);

        console.log(id)
        console.log(send)
        console.log(this.state.allData[index])
      
        // If no object with the matching id field is found, return false
        if (index === -1) {
          return false;
        }
      
        // Update the send field of the matching object with the specified value
        var data = this.state.allData[index].send = send;

        console.log(data)
        this.setState({"allData": this.state.allData})
      
        // Return true to indicate that an object was updated
        return true;
      }

      autoSelectSenders() {


        const maxDefficit = -5;

        var senderData = this.state.allData.map((item) => {

            if (item.sumCash - item.sumArticles < maxDefficit) {
                item.send = true;
            }

            console.log(item)

        })

        this.setState({allData: this.state.allData})

      }

      removeSelection() {

        this.state.allData.map((item) => {
                item.send = false;
        })

        this.setState({allData: this.state.allData})

      }

      sendMails () {

        var senderList = []


        this.state.allData.map((item) => {

            if (item.send) {

                senderList.push({"hiddenid": item.hiddenid, "name": item.name, "mail": item.mail, "deficit": item.sumCash - item.sumArticles})
            }

        })

        console.log(senderList)

      }


    render() {


        if (this.state.allData) {
            console.log("Got data")
            console.log(this.state.allData)

            var tableData = this.state.allData.map((item) => (
                <tr key={item.id} >
                    <td> <Form>
                        <Form.Check
                            type="switch"
                            id={"switch-"+item.id}
                            onChange={(event) => this.updateObjectSendField(item.id, event.target.checked)}
                            checked = {item.send}
                        />
                    </Form></td>
                    <td>{item.name}</td>
                    <td>{item.hiddenid}</td>
                    <td>{item.mail}</td>
                    <td style={this.getRowStyle(item.sumCash - item.sumArticles)}>{parseFloat(item.sumCash - item.sumArticles).toFixed(2)} €</td>
                </tr>
            ))
        }

        else {
            var tableData = <div></div>
        }




        return (

            <div id="pregledContainer">
                <div className="d-flex justify-content-between">
                    <ButtonGroup>
                        <Button variant="primary" onClick={this.autoSelectSenders}>Izberi avtomatsko</Button>
                        <Button variant="danger" onClick={this.removeSelection}>Odstrani vse</Button>
                    </ButtonGroup>

                    <div className="ml-auto">
                        {/* <Button variant="success" onClick={this.sendEmailSMTPAndSendGrid}>Pošlji</Button> */}
                        <DownloadButton allData={this.state.allData}/>
                    </div>
                </div>

                <Table hover style={{ "marginTop": '20px', "marginBottom": '20px' }}>
                    <thead>
                        <tr>
                            <th>Mail</th>
                            <th>Ime</th>
                            <th>Hidden ID</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData}
                    </tbody>
                </Table>

            </div>
        )

    }

    // icons:
    // <a href="https://www.flaticon.com/free-icons/expense" title="expense icons">Expense icons created by Freepik - Flaticon</a>

}

