import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './App.css'
import { Col, Container, Row } from 'react-bootstrap';





export default class AddReportComponent extends Component {


    removeArticleDialog(key) {
        console.log(key)

    }


    render() {

        // list every inputed article on the list
        var listNewArticles = [];

        for (const [key, value] of Object.entries(this.props.newReportData.Articles)) {

            listNewArticles.push(
                <Row onClick={() => this.props.opendialogRemoveArticle(key)} className="rounded newlistArticle" style={{ margin: '5px', padding: '5px' }}>

                    <Col>{value.name}</Col>
                    <Col>{Math.round(value.price* 100) / 100} €</Col>
                    <Col>{value.number}</Col>
                    <Col>{Math.round(value.price * value.number * 100) / 100} €</Col>

                </Row>
            )
        }


        return (

            <Card className="text-center" id="newReportCard">
                <Card.Header as="h4">Poraba {this.props.newReportData.Date.day}.{this.props.newReportData.Date.month + 1}.{this.props.newReportData.Date.year}</Card.Header>
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
                                <b>Skupaj: {Math.round(this.props.newReportData.Sum * 100) / 100} € </b>
                            </Col>
                            <Col>
                                <Button variant="success" onClick={this.props.dialogSave}>Shrani</Button>
                            </Col>
                        </Row>
                    </Container>
                </Card.Footer>
            </Card>

        )

    }
}
