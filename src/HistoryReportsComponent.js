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
    this.state = {
      reports: {
        $6854jgfh: {
          Sort: 'articles',
          Date: {
            day: 12,
            month: 3,
            year: 2022
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
        },
        $6854jfdf:{
          Sort: 'money',
          Date: {
            day: 8,
            month: 4,
            year: 2022
          },
          Amount: 25
        },
        $68gfjgfh: {
          Sort: 'articles',
          Date: {
            day: 8,
            month: 4,
            year: 2022
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
        },
        $685ajfdf:{
          Sort: 'bonus',
          Date: {
            day: 1,
            month: 1,
            year: 2022
          },
          Amount: 13.4
        },
      }
    }
  }



  render() {

    // list every inputed article on the list
    var HistoryReports = [];
    var listNewArticles = [];

    for (const [key, value] of Object.entries(this.state.reports)) {

      if (value.Sort == 'articles') {

      listNewArticles = [];

      console.log(value.Articles)

      for (const [k, v] of Object.entries(value.Articles)) {
   

        listNewArticles.push(
            <Row className="rounded" style={{ margin: '5px', padding: '5px' }}>

                <Col>{v.name}</Col>
                <Col>{v.price} €</Col>
                <Col>{v.number}</Col>
                <Col>{Math.round(v.price * v.number * 100) / 100} €</Col>
            </Row>
        )
    }

      HistoryReports.push(
        <Accordion.Item eventKey={key}>
          <Accordion.Header><h5>{value.Date.day}.{value.Date.month + 1}.{value.Date.year}</h5></Accordion.Header>
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
                          <Col><b>Skupaj: {value.Sum} €</b></Col>
                        </Row>
                    </Container>
          </Accordion.Body>
        </Accordion.Item>
      )
      }

      if (value.Sort == 'money') {
        HistoryReports.push(
          <Accordion.Item eventKey={key}>
            <Accordion.Header><h5>{value.Date.day}.{value.Date.month + 1}.{value.Date.year}</h5></Accordion.Header>
            <Accordion.Body>
            <Container>
                          <Row>
                            <Col><b>Polnitev: {value.Amount} €</b></Col>
                          </Row>
                      </Container>
            </Accordion.Body>
          </Accordion.Item>)
    }

    if (value.Sort == 'bonus') {
      HistoryReports.push(
        <Accordion.Item eventKey={key}>
          <Accordion.Header><h5>{value.Date.day}.{value.Date.month + 1}.{value.Date.year} </h5></Accordion.Header>
          <Accordion.Body>
          <Container>
                        <Row>
                          <Col><b>Pripis: {value.Amount} €</b></Col>
                        </Row>
                    </Container>
          </Accordion.Body>
        </Accordion.Item>)
  }

  }
  

    return (

      <Accordion id="historyReport">
        {HistoryReports}

      </Accordion>

    )

  }
}

