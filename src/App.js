import React, { Component } from 'react';
import './App.css';
import DisplayMain from './DisplayMain';
import Poraba from './Poraba';
import Inventorij from './Inventorij';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';


class App extends Component {

  constructor(props) {
      super(props);
      this.state = {date: new Date(), page: 'inventorij'};
      this.changePage = this.changePage.bind(this);

  }

  changePage(page) {
    console.log(page)
    this.setState({page: page})
  }
  
  render() {
    
      return (
        <div className="App">
          <Tabs
          id="controlled-tab-example"
          activeKey={this.state.page}
          onSelect={(k) => this.setState({page: k})}
          className="mb-3"
        >
      <Tab eventKey="inventorij" title="Inventorij">
          <Inventorij changePage={this.changePage}/>
      </Tab>
      <Tab eventKey="poraba" title="Poraba">
      <Poraba changePage={this.changePage}/>
      </Tab>
    </Tabs>
      </div>)
    }

}


export default App;
