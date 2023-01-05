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
import { getInventory, getRegisterData, addArticleData, removeArticleData } from './firebase';







export default class Inventorij extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inventory: {},
            dialogNewArticle: 0, dialogAddArticles: 0, dialogRemoveArticle: 0,
            chosenArticle: ''
        }
        this.closeDialog = this.closeDialog.bind(this)
        this.openDialogNew = this.openDialogNew.bind(this)
        this.openDialogAdd = this.openDialogAdd.bind(this)
        this.removeArticle = this.removeArticle.bind(this)
        this.addArticle = this.addArticle.bind(this)
        this.removeArticleDatabase = this.removeArticleDatabase.bind(this)





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

    removeArticle(id) {
        this.setState({ dialogRemoveArticle: 1, chosenArticle: id })
    }

    addArticle () {
        var name = document.getElementById('newArticleName').children[1].value;
        var number = document.getElementById('newArticleNumber').children[1].value;
        var price = document.getElementById('newArticlePrice').children[1].value;

        addArticleData(name, price, number).then((()=> {

                getInventory().then((querySnapshot) => {

                    console.log(querySnapshot)
    
                    var inventory = {};
        
                    querySnapshot.forEach((doc) => {
                        inventory[doc.id] = doc.data()
                    });
        
                    this.setState({ inventory: inventory })
                })
            }))
            
        this.setState({ dialogNewArticle: 0 })

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

    removeArticleDatabase () {
        removeArticleData(this.state.chosenArticle).then((()=> {

            getInventory().then((querySnapshot) => {

                var inventory = {};
    
                querySnapshot.forEach((doc) => {
                    inventory[doc.id] = doc.data()
                });
    
                this.setState({ inventory: inventory })
            })
        }))
        this.setState({dialogRemoveArticle: 0})
    }

    render() {

        if (this.state.dialogNewArticle) {

            var dialog = <Modal show="true">
                <Modal.Header closeButton onClick={this.closeDialog}>
                    <Modal.Title>Dodaj nov artikel</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <InputGroup className="mb-3" id="newArticleName">
                            <InputGroup.Text id="newArticleName">Ime: </InputGroup.Text>
                            <Form.Control />
                        </InputGroup>
                        <InputGroup className="mb-3" id="newArticleNumber">
                            <InputGroup.Text >Število: </InputGroup.Text>
                            <Form.Control />
                        </InputGroup>
                        <InputGroup className="mb-3" id="newArticlePrice">
                            <InputGroup.Text >Cena €:</InputGroup.Text>
                            <Form.Control />
                        </InputGroup>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button  variant="success" onClick={this.addArticle}>
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
                    <Button variant="danger" onClick={this.removeArticleDatabase}>Odstrani</Button>
                </Modal.Footer>
            </Modal>
        }
        else {
            var dialog = <></>
        }

        var listItems = [];

        for (const [k, v] of Object.entries(this.state.inventory)) {

            listItems.push(
                <ArticleComponent uniqid={k} Name={v.name} boughtPrice={v.basePrice} overHead={v.overHead} number={v.amount} addArticles={this.openDialogAdd} removeArticle={(id) => this.removeArticle(id)} />
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

