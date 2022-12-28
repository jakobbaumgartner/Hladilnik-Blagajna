import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import ArticleComponent from './ArticleComponent';
import './index.css';
import './App.css';
import uniqid from 'uniqid';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import { getInventory, getRegisterData } from './firebase';







export default class Inventorij extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inventory: {},
            dialogNewArticle: 0, dialogAddArticles: 0, dialogRemoveArticle: 0
        }
        this.closeDialog = this.closeDialog.bind(this)
        this.openDialogNew = this.openDialogNew.bind(this)
        this.openDialogAdd = this.openDialogAdd.bind(this)
        this.removeArticle = this.removeArticle.bind(this)



    }

    closeDialog() {
        this.setState({ dialogNewArticle: 0, dialogAddArticles: 0, dialogRemoveArticle: 0 });
    }

    openDialogNew() {
        this.setState({ dialogNewArticle: 1 })
    }

    openDialogAdd() {
        this.setState({ dialogAddArticles: 1 })
    }

    removeArticle() {
        this.setState({ dialogRemoveArticle: 1 })
    }

    componentDidMount() {

        getInventory().then((querySnapshot) => {

            var inventory = {};

            querySnapshot.forEach((doc) => {
                inventory[doc.id] = doc.data()
            });

            this.setState({ inventory: inventory })
        })

        getRegisterData().then((querySnapshot) => {
            var data
            // console.log(querySnapshot.data())
            querySnapshot.forEach((doc) => {
               data = doc.data();
            });
            this.setState({cash: data.cashRegister, articlesValue: data.articlesValue, debt: data.usersDebt})
        })
    }

    render() {

        if (this.state.dialogNewArticle) {

            var dialog = <Modal show="true">
                <Modal.Header closeButton onClick={this.closeDialog}>
                    <Modal.Title>Dodaj nov artikel</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Ime: </InputGroup.Text>
                            <Form.Control />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Število: </InputGroup.Text>
                            <Form.Control />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Cena €:</InputGroup.Text>
                            <Form.Control />
                        </InputGroup>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" >
                        Dodaj
                    </Button>

                </Modal.Footer>
            </Modal>

        }

        else if (this.state.dialogAddArticles) {

            var dialog = <Modal show="true">
                <Modal.Header closeButton onClick={this.closeDialog}>
                    <Modal.Title>Dodaj artikle</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Dodaj: </InputGroup.Text>
                            <Form.Control />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Cena €:</InputGroup.Text>
                            <Form.Control />
                        </InputGroup>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" >
                        Dodaj
                    </Button>

                </Modal.Footer>
            </Modal>

        }
        else if (this.state.dialogRemoveArticle) {

            var dialog = <Modal show="true">
                <Modal.Header closeButton onClick={this.closeDialog}>
                    <Modal.Title>Odstrani Artikel</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.closeDialog}>Prekliči</Button>
                    <Button variant="danger">Odstrani</Button>
                </Modal.Footer>
            </Modal>
        }
        else {
            var dialog = <></>
        }

        var listItems = [];

        for (const [k, v] of Object.entries(this.state.inventory)) {

            listItems.push(
                <ArticleComponent uniqid={k} Name={v.name} boughtPrice={v.basePrice} overHead={v.overHead} number={v.amount} addArticles={this.openDialogAdd} removeArticle={this.removeArticle} />
            )
        }



        return (

            <div id="inventorij" style={{ width: '100%' }}>

                {dialog}

                <div id="displayMainButtons">

                    <Button id="addArticleButton" variant="success" size="lg" onClick={this.openDialogNew}> Dodaj Artikel </Button>


                    <ListGroup horizontal id="counters">
                        <ListGroup.Item><span title="Denar v blagajni."><h5>Blagajna</h5><br />{this.state.cash}</span></ListGroup.Item>
                        <ListGroup.Item><span title="Prodajna vrednost artiklov v blagajni."><h5>Artikli</h5><br />{this.state.articlesValue}</span></ListGroup.Item>
                        <ListGroup.Item><span title="Vrednost dolga uporabnikov."><h5>Dolg</h5><br />{this.state.debt}</span></ListGroup.Item>
                        <ListGroup.Item><span title="Vsota = blagajna + artikli + dolg"><h5>Vsota</h5><br />{this.state.cash + this.state.articlesValue + this.state.debt}</span></ListGroup.Item>
                    </ListGroup>
                </div>

                <div id="listOfArticles">

                    {listItems}

                </div>
            </div>

        )

    }
}

