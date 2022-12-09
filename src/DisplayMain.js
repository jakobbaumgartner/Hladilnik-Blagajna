import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';



export default class DisplayMain extends Component {
    render() {

        return(
        
        <div id="displayMainButtons">
            
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

