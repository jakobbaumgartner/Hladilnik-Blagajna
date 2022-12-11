import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './App.css'
import { Col, Container, Row } from 'react-bootstrap';





export default class AddReportComponent extends Component {

    constructor(props) {

        const d = new Date();

        super(props);
        this.state = {
            newReport: {
                Date: {
                    day: d.getDate(),
                    month: d.getMonth(),
                    year: d.getFullYear()
                },
                Articles: {
                    $4n5pxq24kriob12ogd: {
                        name: 'Twix 50g',
                        price: 0.8,
                        number: 7
                    },
                    $4n5pxq24ksiob12ogl: {
                        name: 'Bounty',
                        price: 0.68,
                        number: 4
                    },
                    $4n5pxq24krio242oab: {
                        name: 'Radenska',
                        price: 0.9,
                        number: 2
                    }
                },
                Sum: 10.12
            }
        }
    }

    rowa() {
        console.log("hii")
    }



    render() {

        // list every inputed article on the list
        var listNewArticles = [];

        for (const [key, value] of Object.entries(this.state.newReport.Articles)) {

            listNewArticles.push(
                <Row onClick={this.rowa} className="rounded newlistArticle" style={{ margin: '5px', padding: '5px' }}>

                    <Col>{value.name}</Col>
                    <Col>{value.price} €</Col>
                    <Col>{value.number}</Col>
                    <Col>{Math.round(value.price * value.number * 100) / 100} €</Col>

                </Row>
            )
        }


        return (

            <Card className="text-center" id="newReportCard" style={{ margin: 'auto', width: '90%', maxWidth: '1250px' }}>
                <Card.Header as="h4">Poraba {this.state.newReport.Date.day}.{this.state.newReport.Date.month + 1}.{this.state.newReport.Date.year}</Card.Header>
                <Card.Body>
                    <Container>
                        <Row>
                            <Col><b>Artikel</b></Col>
                            <Col><b>Cena</b></Col>
                            <Col><b>Število</b></Col>
                            <Col><b>Skupaj</b></Col>
                        </Row>
                        {listNewArticles}
                    </Container>
                </Card.Body>
                <Card.Footer >
                    <Container>
                        <Row>
                            <Col>
                                <Button variant="success" onClick={this.props.opendialogAddArticle}>Dodaj</Button>
                            </Col>

                            <Col>
                                <b>Skupaj: {this.state.newReport.Sum} € </b>
                            </Col>
                            <Col>
                                <Button variant="success">Shrani</Button>
                            </Col>
                        </Row>
                    </Container>
                </Card.Footer>
            </Card>

        )

    }
}
