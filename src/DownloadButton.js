import React from 'react';
import Button from 'react-bootstrap/Button';


class DownloadButton extends React.Component {
  constructor(props) {
    super(props);
 
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const date = new Date();
    const formattedDate = date.toLocaleDateString().replace(/\//g, '-');
    const filteredArray = this.props.allData.filter(obj => obj.send === true);
    console.log(filteredArray);
    const content = JSON.stringify(filteredArray);
    const element = document.createElement('a');
    const file = new Blob([content], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = `${formattedDate}_mydata.json`;
    document.body.appendChild(element);
    element.click();
  }

  render() {
    return (
      <Button variant="success" onClick={this.handleClick}>Pridobi seznam prejemnikov</Button>
    );
  }
}

export default DownloadButton;