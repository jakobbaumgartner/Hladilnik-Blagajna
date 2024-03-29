import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Col, Container, Row } from 'react-bootstrap';



export default class HistoryReportsComponent extends Component {

  constructor(props) {
    super(props);
  }



  render() {

    // list every inputed article on the list
    var HistoryReports = [];
    var listNewArticles = [];

    // console.log(this.props.reports)



    for (const [key, value] of Object.entries(this.props.reports)) {

      // console.log(value)

      if (value.Sort == 'articles') {

      listNewArticles = [];

      // console.log(value.Articles)

      for (const [k, v] of Object.entries(value.Articles)) {
   

        listNewArticles.push(
            <Row className="rounded" style={{ margin: '5px', padding: '5px' }}>

                <Col>{v.name}</Col>
                <Col>{parseFloat(v.price).toFixed(2)} €</Col>
                <Col>{parseFloat(v.amount).toFixed(2)}</Col>
                <Col>{parseFloat(v.price * v.amount).toFixed(2)} €</Col>
            </Row>
        )
    }

      HistoryReports.push(
        <Accordion.Item eventKey={key}>
          <Accordion.Header><h5>{value.Date.day}.{value.Date.month}.{value.Date.year+1}</h5></Accordion.Header>
          <Accordion.Body>
          <Container>
                        <Row>
                            <Col><b>Artikel</b></Col>
                            <Col><b>Cena</b></Col>
                            <Col><b>Število</b></Col>
                            <Col><b>Skupaj</b></Col>
                        </Row>
                        {listNewArticles}
                        <Row>
                          <Col><b>Vsota: - {parseFloat(value.Sum).toFixed(2)} €</b></Col>
                        </Row>
                    </Container>
          </Accordion.Body>
        </Accordion.Item>
      )
      }

      if (value.Sort == 'credit') {
        HistoryReports.push(
          <Accordion.Item eventKey={key}>
            <Accordion.Header><h5>{value.Date.day}.{value.Date.month}.{value.Date.year+1}</h5></Accordion.Header>
            <Accordion.Body>
            <Container>
                          <Row>
                            <Col><b>Polnitev:  {value.Sum} €</b></Col>
                          </Row>
                      </Container>
            </Accordion.Body>
          </Accordion.Item>)
    }

    if (value.Sort == 'bonus') {
      HistoryReports.push(
        <Accordion.Item eventKey={key}>
          <Accordion.Header><h5>{value.Date.day}.{value.Date.month}.{value.Date.year+1} </h5></Accordion.Header>
          <Accordion.Body>
          <Container>
                        <Row>
                          <Col><b>Pripis:  {parseFloat(value.Sum).toFixed(2)} €</b></Col>
                        </Row>
                    </Container>
          </Accordion.Body>
        </Accordion.Item>)
  }

  }
  

    return (

      <Accordion id="historyReport" alwaysOpen>
        {HistoryReports}

      </Accordion>
   
    )

  }
}

