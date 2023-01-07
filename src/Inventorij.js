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
import { getInventory, getRegisterData, addArticleData, removeArticleData, updateStockData, setPriceOverheadData } from './firebase';







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
        this.addStock = this.addStock.bind(this)





    }

    closeDialog() {
        this.setState({ dialogNewArticle: 0, dialogAddArticles: 0, dialogRemoveArticle: 0 });
    }

    openDialogNew() {
        this.setState({ dialogNewArticle: 1 })
    }

    openDialogAdd(id) {
        this.setState({ dialogAddArticles: 1, chosenArticle: id  })
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
            this.setState({cash: data.cashRegister})
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

    addStock () {
        var number = document.getElementById('addStockNumber').children[1].value;
        var price = document.getElementById('addStockPrice').children[1].value;

        var articleId = this.state.chosenArticle;

        var article = this.state.inventory[articleId]

        console.log(article)

        var newNumber = Number(article.amount) + Number(number);
        console.log(newNumber)
        var price = (Number(article.amount) * Number(article.basePrice) + Number(number) * Number(price)) / (newNumber);
        console.log(price)

        updateStockData (articleId, newNumber, price).then((()=> {

            getInventory().then((querySnapshot) => {

                var inventory = {};
    
                querySnapshot.forEach((doc) => {
                    inventory[doc.id] = doc.data()
                });
    
                this.setState({ inventory: inventory })
            })
        }))

        this.setState({dialogAddArticles: 0})
    
    }

    changeSliderValue(id, value) {

        setPriceOverheadData(id, value).then((()=> {

            getInventory().then((querySnapshot) => {

                var inventory = {};
    
                querySnapshot.forEach((doc) => {
                    inventory[doc.id] = doc.data()
                });
    
                this.setState({ inventory: inventory })
            })
        }))
    }

    render() {

        console.log(this.props.updateStatus)

        if (this.props.updateStatus) {


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
                this.setState({cash: data.cashRegister})
            })

            this.props.changeUpdateStatus(0)
        }
        

        console.log('inventorij mounted')

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
                        <InputGroup className="mb-3" id="addStockNumber">
                            <InputGroup.Text>Količina: </InputGroup.Text>
                            <Form.Control />
                        </InputGroup>
                        <InputGroup className="mb-3" id="addStockPrice">
                            <InputGroup.Text>Cena €:</InputGroup.Text>
                            <Form.Control />
                        </InputGroup>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={this.addStock}>
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
        var vsotaArtiklov = 0;

        for (const [k, v] of Object.entries(this.state.inventory)) {

            listItems.push(
                <ArticleComponent uniqid={k} Name={v.name} boughtPrice={v.basePrice} overHead={v.overHead} number={v.amount} addArticles={this.openDialogAdd} removeArticle={(id) => this.removeArticle(id)} changeSliderValue={(id, value) => {this.changeSliderValue(id, value)}}/>
            )

            vsotaArtiklov = vsotaArtiklov + Number(v.amount) * (Number(v.basePrice) * (1 + Number(v.overHead)/100));
        }



        return (

            <div id="inventorij" style={{ width: '100%' }}>

                {dialog}

                <div id="displayMainButtons">

                    <Button id="addArticleButton" variant="success" size="lg" onClick={this.openDialogNew}> Dodaj Artikel </Button>


                    <ListGroup horizontal id="counters">
                        <ListGroup.Item><span title="Denar v blagajni."><h5>Blagajna</h5><br />{this.state.cash} €</span></ListGroup.Item>
                        <ListGroup.Item><span title="Prodajna vrednost artiklov v blagajni."><h5>Artikli</h5><br />{parseFloat(vsotaArtiklov).toFixed(2)} €</span></ListGroup.Item>                        
                        <ListGroup.Item><span title="Vsota = blagajna + artikli + dolg"><h5>Vsota</h5><br />{parseFloat(Number(this.state.cash) - vsotaArtiklov).toFixed(2) } €</span></ListGroup.Item>
                    </ListGroup>
                </div>

                <div id="listOfArticles">

                    {listItems}

                </div>
            </div>

        )

    }
}

