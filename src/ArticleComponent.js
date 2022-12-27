import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';





export default class ArticleComponent extends Component {
    
    constructor(props) {
        super(props);
        this.state = {bonus: 0, boughtPrice: this.props.boughtPrice}
        this.changeSlider = this.changeSlider.bind(this)
    }

    changeSlider (event) {

        // console.log(event.target.value)
        // var newBonus = event.target.value 
        this.setState({bonus: Math.round(event.target.value * this.props.boughtPrice) / 100,
                        boughtPrice: Math.round((Number(this.props.boughtPrice) + this.state.bonus)*100)/100})
        
    }

    

    render() {  

        return(
            
            <Card style={{margin: 'auto', width: '90%', maxWidth: '1000px', marginBottom: '20px'}}>
            <Card.Header as="h4">{this.props.Name}</Card.Header>
            <Card.Body>
              <div className='articlePrice'>Cena: {this.props.boughtPrice} + {this.state.bonus} = {this.state.boughtPrice} €</div>
             <Form.Range id={this.props.uniqid + '-range'} defaultValue={this.props.overHead} onChange={this.changeSlider}/>

            </Card.Body>
            <Card.Body>
            <Button variant="success" onClick={this.props.addArticles}>Dodaj</Button>
            <Button style={{marginLeft: '10px'}} variant="danger" onClick={this.props.removeArticle}>Odstrani</Button>

            </Card.Body>
          </Card>

        )

    }
  }

