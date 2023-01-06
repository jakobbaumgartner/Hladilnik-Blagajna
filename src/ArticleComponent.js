import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';





export default class ArticleComponent extends Component {
    
    render() {  

        return(
            
            <Card style={{margin: 'auto', width: '90%', maxWidth: '1000px', marginBottom: '20px'}}>
            <Card.Header as="h4">{this.props.Name}</Card.Header>
            <Card.Body>
              <div className='articlePrice'>Cena: {parseFloat(this.props.boughtPrice).toFixed(2)} + {this.props.overHead} % = {parseFloat(this.props.boughtPrice + this.props.boughtPrice * this.props.overHead / 100).toFixed(2)} €</div>
             <Form.Range id={this.props.uniqid + '-range'} defaultValue={this.props.overHead} onChange={(event) => this.props.changeSliderValue(this.props.uniqid, event.target.value)  }/>

            </Card.Body>
            <Card.Body>
            <Button variant="success" onClick={() => this.props.addArticles(this.props.uniqid)}>Dodaj</Button>
            <Button style={{marginLeft: '10px'}} variant="danger" onClick={() => this.props.removeArticle(this.props.uniqid)}>Odstrani</Button>

            </Card.Body>
            <Card.Footer>Na voljo: {this.props.number}</Card.Footer>
          </Card>

        )

    }
  }

