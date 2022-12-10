import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './App.css'





export default class AddReportComponent extends Component {

    constructor(props) {

        const d = new Date();

        super(props);
        this.state = {
            newReportDate: {
                day: d.getDate(),
                month: d.getMonth(),
                year: d.getFullYear()
            }
        }
    }






    render() {

        return (

            <Card className="text-center" id="newReportCard" style={{ margin: 'auto', width: '90%', maxWidth: '1250px' }}>
                <Card.Header as="h4">Poraba {this.state.newReportDate.day}.{this.state.newReportDate.month+1}.{this.state.newReportDate.year}</Card.Header>
                <Card.Body>
                    <Card.Title>Special title treatment</Card.Title>
                    <Card.Text>
                        With supporting text below as a natural lead-in to additional content.
                    </Card.Text>
                    <Button variant="primary">Go somewhere</Button>
                </Card.Body>
                <Card.Footer className="text-muted">2 days ago</Card.Footer>
            </Card>

        )

    }
}
