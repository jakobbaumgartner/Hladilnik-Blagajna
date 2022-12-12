import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';





export default class HistoryReportsComponent extends Component {
    
    constructor(props) {
        super(props);
        this.state = {bonus: 0, boughtPrice: this.props.boughtPrice}
        this.changeSlider = this.changeSlider.bind(this)
    }

    changeSlider (event) {

        console.log(event.target.value)
        // var newBonus = event.target.value 
        this.setState({bonus: Math.round(event.target.value * this.props.boughtPrice) / 100,
                        boughtPrice: Math.round((Number(this.props.boughtPrice) + this.state.bonus)*100)/100})
        
    }

    

    render() {  

        return(
            
            <Accordion id="historyReport">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Accordion Item #1</Accordion.Header>
              <Accordion.Body>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                culpa qui officia deserunt mollit anim id est laborum.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Accordion Item #2</Accordion.Header>
              <Accordion.Body>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                culpa qui officia deserunt mollit anim id est laborum.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

        )

    }
  }

