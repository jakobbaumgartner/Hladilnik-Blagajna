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
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import Table from 'react-bootstrap/Table';

import AddReportComponent from './AddReportComponent';
import HistoryReportsComponent from './HistoryReportsComponent.js'
import validator from 'validator';
import { getBoughtList, calcualteAllItemsSold, calculateBoughtSum, getRegisterData, getInventoryBasePriceSum } from './firebase';





export default class Pregled extends Component {

    constructor(props) {
        super(props);
        this.state = {
            odpis: 0
        }
    }



    componentDidMount() {
        calcualteAllItemsSold().then(([allData, totalBought, totalCash, surPlus, odpis]) => {
            console.log(allData);
            this.setState({ "allData": allData, "totalSold": totalBought, "totalCash": totalCash, "surPlus": surPlus, "odpis": odpis.value })
        }).catch((error) => {
            console.error(error);
        });

        // Call the calculateSum() function and log the result to the console
        calculateBoughtSum()
            .then((sum) => {
                console.log(`The total sum of bought items is ${sum}`)
                this.setState({ "amountTotalBought": sum })
            })
            .catch((error) => console.error(error));

        // get inventory value
        getRegisterData().then((querySnapshot) => {
            var data
            // console.log(querySnapshot.data())
            querySnapshot.forEach((doc) => {
                data = doc.data();
            });
            this.setState({ inventory: data.cashRegister })
        })

        // Call the function to retrieve the sum of all "basePrice" values in the "inventory" collection
        getInventoryBasePriceSum().then(([sum, sumSell]) => {
            console.log(`Sum of all base prices: ${sum}`);
            this.setState({ "inventory": sum, "sellValue": sumSell })
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

    render() {

        if (this.state.allData) {
            console.log("Got data")
            console.log(this.state.allData)

            var tableData = this.state.allData.map((item) => (
                <tr key={item.id} >
                    <td>{item.name}</td>
                    <td>{item.hiddenid}</td>
                    <td>{parseFloat(item.sumArticles).toFixed(2)} €</td>
                    <td>{parseFloat(item.sumCash).toFixed(2)} €</td>
                    <td style={this.getRowStyle(item.sumCash - item.sumArticles)}>{parseFloat(item.sumCash - item.sumArticles).toFixed(2)} €</td>
                </tr>
            ))
        }

        else {
            var tableData = <div></div>
        }




        return (

            <div id="pregledContainer">

                <Row xs={1} md={5} className="g-4">
                    <Col>
                        <Card>
                            <Card.Img variant="top" src="inventory.png" className="mx-auto" style={{ width: '50px', height: '50px', marginTop: '20px' }} />
                            <Card.Body>
                                <Card.Title>Inventorij</Card.Title>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>{parseFloat(this.state.inventory).toFixed(2)} €</ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col>
                        <Card>
                            <Card.Img variant="top" src="cost.png" className="mx-auto" style={{ width: '50px', height: '50px', marginTop: '20px' }} />
                            <Card.Body>
                                <Card.Title>Prodaja</Card.Title>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>{parseFloat(this.state.sellValue).toFixed(2)} €</ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col>
                        <Card>
                            <Card.Img variant="top" src="employee.png" className="mx-auto" style={{ width: '50px', height: '50px', marginTop: '20px' }} />
                            <Card.Body>
                                <Card.Title>Polnitve</Card.Title>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>{parseFloat(this.state.surPlus).toFixed(2)} €</ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col>
                        <Card>
                            <Card.Img variant="top" src="money-bag.png" className="mx-auto" style={{ width: '50px', height: '50px', marginTop: '20px' }} />
                            <Card.Body>
                                <Card.Title>Blagajna</Card.Title>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>{parseFloat(50 - this.state.amountTotalBought + this.state.totalSold + this.state.surPlus).toFixed(2)} €</ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col>
                        <Card>
                            <Card.Img variant="top" src="coins.png" className="mx-auto" style={{ width: '50px', height: '50px', marginTop: '20px' }} />
                            <Card.Body>
                                <Card.Title>Presežek</Card.Title>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>{parseFloat(50 - this.state.amountTotalBought + this.state.totalSold).toFixed(2)} € €</ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Table hover style={{ "marginTop": '20px', "marginBottom": '20px' }}>
                    <thead>
                        <tr>
                            <th>Ime</th>
                            <th>Hidden ID</th>
                            <th>Kupljeno</th>
                            <th>Polnjeno</th>
                            <th>Stanje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData}
                    </tbody>
                </Table>

                <Table hover style={{ "marginTop": '20px', "marginBottom": '20px' }}>
        
                    <tbody>
                        <tr>
                            <th>Odpis</th>
                            <td>{parseFloat(this.state.odpis).toFixed(2)} €</td>
                        </tr>

                    </tbody>
                </Table>




            </div>
        )

    }

    // icons:
    // <a href="https://www.flaticon.com/free-icons/expense" title="expense icons">Expense icons created by Freepik - Flaticon</a>

}

