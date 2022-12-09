import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';



export default class Poraba extends Component {
    render() {

        return(
        
        <div id="displayMainButtons">

            <h1>Poraba</h1>
            
            <div className='mainButton' onClick={() => this.props.changePage('poraba')}>
                <p>Poraba</p>
            </div>

            <div className='mainButton' onClick={() => this.props.changePage('inventorij')}>
                <p>Inventorij</p>
            </div>

        </div>
        )

    }
  }

