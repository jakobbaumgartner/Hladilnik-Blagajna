import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import AddReportComponent from './AddReportComponent';
import HistoryReportsComponent from './HistoryReportsComponent.js'
import validator from 'validator';
import { getUsers, getRecords, getInventory, addCash, getRegisterData } from './firebase';





export default class Poraba extends Component {

    constructor(props) {
        const d = new Date();
        super(props);
        this.state = {
            users: [],
            storage: {},
            newReport: {
                Date: {
                    day: d.getDate(),
                    month: d.getMonth(),
                    year: d.getFullYear()
                },
                Articles: {

                },
                Sum: 0
            },
            reports: {},
            selectedUser: '',
            selectedArticle: '',
            userName: 'izberi uporabnika',
            dialogAddChange: 0,
            dialogAddArticle: 0,
            dialogRemoveArticle: 0,
            dialogSaveReport: 0
        }

        this.closeDialog = this.closeDialog.bind(this)
        this.opendialogAddChange = this.opendialogAddChange.bind(this)
        this.opendialogAddArticle = this.opendialogAddArticle.bind(this)
        this.openSaveDialog = this.openSaveDialog.bind(this)
        this.openDialogRemoveArticle = this.openDialogRemoveArticle.bind(this)
        this.removeArticle = this.removeArticle.bind(this)
        this.getStorage = this.getStorage.bind(this)
        this.getUsersData = this.getUsersData.bind(this)
        this.chargeAccount = this.chargeAccount.bind(this)
        this.selectArticle = this.selectArticle.bind(this)
        this.addArticle = this.addArticle.bind(this)



    }

    opendialogAddChange() {
        this.setState({ dialogAddChange: 1 })
    }

    opendialogAddArticle() {
        this.setState({ dialogAddArticle: 1 })
    }


    closeDialog() {
        this.setState({ dialogAddChange: 0, dialogAddArticle: 0, dialogRemoveArticle: 0, dialogSaveReport: 0 });
    }

    openSaveDialog() {
        this.setState({ dialogSaveReport: 1 })
    }

    openDialogRemoveArticle(id) {
        console.log(id)
        this.setState({ selectedArticle: id })
        this.setState({ dialogRemoveArticle: 1 })
    }

    removeArticle() {

        var report = this.state.newReport;

        delete report.Articles[this.state.selectedArticle]

        this.closeDialog()

    }


    selectUser(user) {
        this.setState({
            selectedUser: user,
            //    credit: this.state.users[user].credit,
            userName: this.state.users[user].name
        })

        getRecords(user).then((records) => {

            this.setState({ reports: records })

        })

    }

    async getStorage() {
        await getInventory().then((querySnapshot) => {

            var inventory = {};

            querySnapshot.forEach((doc) => {
                inventory[doc.id] = doc.data()
            });

            this.setState({ storage: inventory })

            // console.log(inventory)
        })
    }



    addArticle() {
        var nameDropdown = document.getElementById('addArtikelName').children
        var number = document.getElementById('addArtikelNumber').children[1].value
        var id = ''
        var item

        console.log(number)


        for (let i = 0; i < nameDropdown.length; i++) {

            item = nameDropdown[i]

            if (item.selected) {
                console.log(item.id)
                id = item.id
            }
        }


        var storage = this.state.storage
        var itemStorage = this.state.storage[id]

        // check if item with id exists
        if (itemStorage) {
            console.log(itemStorage)

            // check if it is a number
            if (validator.isInt(number)) {

                // check if enough items
                if (itemStorage.amount >= number) {

                    // add to report list

                    var report = this.state.newReport

                    // if item already exists on report
                    if (report.Articles[id]) {
                        var old_item = report.Articles[id];
                        report.Articles[id] = {name: itemStorage.name, number: Number(old_item.number) + Number(number), price: Number(itemStorage.basePrice) * (1 + Number(itemStorage.overHead)/100), sum:  old_item.sum + Number(itemStorage.basePrice) * (1 + Number(itemStorage.overHead)/100) * number}
                    } 
                    else {
                        report.Articles[id] = {name: itemStorage.name, number: Number(number), price: Number(itemStorage.basePrice) * (1 + Number(itemStorage.overHead)/100), sum:  Number(itemStorage.basePrice) * (1 + Number(itemStorage.overHead)/100) * number}
                    }

                    report.Sum = report.Sum + Number(itemStorage.basePrice) * (1 + Number(itemStorage.overHead)/100) * number
                    
                    
                    console.log(report)

                    // remove from storage

                    storage[id].amount = storage[id].amount - number

                    // close dialog
                    this.closeDialog() 
                    
                }

            }
        }
  

    }

    selectArticle(id) {
        console.log(id)
    }

    getUsersData() {
        getUsers().then((querySnapshot) => {
            var users = {};

            querySnapshot.forEach((doc) => {

                var dat = doc.data()
                users[doc.id] = doc.data();
                this.setState({ credit: dat.credit })
            });

            this.setState({ users: users })

        })
    }

    chargeAccount() {

        var id = this.state.selectedUser
        console.log(id)

        var value = document.getElementById('addCash').children[1].value
        console.log(value)


        addCash(id, value).then(() => {

            getRecords(this.state.selectedUser).then((records) => {

                this.setState({ reports: records })

                this.props.changeUpdateStatus(1)

            })

        }

        )

    }

    componentDidMount() {

        console.log('reloaded!!!')

        this.getStorage()
        this.getUsersData()


    }

    render() {



        const listNames = [];

        for (const [key, user] of Object.entries(this.state.users)) {
            // console.log(`${key}: ${user}`);
            listNames.push(<Dropdown.Item as="button" id={key} key={key} onClick={() => this.selectUser(key)}>{user.name}</Dropdown.Item>)
        }

        var stanje = 0;

        for (const [k, v] of Object.entries(this.state.reports)) {

            // console.log(v)

            if (v.Sort == "articles") {
                stanje = stanje - v.Sum;
            }
            else if (v.Sort == "credit") {
                stanje = stanje + v.Sum;
            }

        }


        var dialog;

        if (this.state.dialogAddChange) {

            dialog = <Modal show="true">
                <Modal.Header closeButton onClick={this.closeDialog}>
                    <Modal.Title>Polni račun</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <InputGroup className="mb-3" id="addCash">
                            <InputGroup.Text>Polni €</InputGroup.Text>
                            <Form.Control />
                        </InputGroup>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" onClick={this.chargeAccount}>
                        Dodaj
                    </Button>
                </Modal.Footer>
            </Modal>
        }
        else if (this.state.dialogAddArticle) {

            var artikels = [];

            artikels.push(<option><p></p></option>)


            for (const [key, value] of Object.entries(this.state.storage)) {
                console.log(`${key}: ${value}`);
                artikels.push(<option id={key}><p>{value.name}  ( {value.amount} ) </p></option>)
            }



            dialog = <Modal show="true">
                <Modal.Header closeButton onClick={this.closeDialog}>
                    <Modal.Title>Dodaj artikel</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <InputGroup className="mb-3" >
                            <InputGroup.Text>Artikel: </InputGroup.Text>
                            <Form.Select defaultValue="" id="addArtikelName">
                                {artikels}
                            </Form.Select>
                        </InputGroup>

                        <InputGroup className="mb-3" id="addArtikelNumber">
                            <InputGroup.Text>Število: </InputGroup.Text>
                            <Form.Control />
                        </InputGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={this.addArticle}>
                        Dodaj
                    </Button>
                </Modal.Footer>
            </Modal>

        }
        else if (this.state.dialogSaveReport) {
            dialog = <Modal show="true">
                <Modal.Header closeButton onClick={this.closeDialog}>
                    <Modal.Title>Shrani vnos</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.closeDialog}>Prekliči</Button>
                    <Button variant="success">Potrdi</Button>
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
                    <Button variant="danger" onClick={this.removeArticle}>Odstrani</Button>
                </Modal.Footer>
            </Modal>

        }
        else {
            dialog = '';
        }

        console.log('loaded poraba')


        return (

            <div style={{ width: '100%' }}>

                {dialog}

                <div id="displayMainButtons">

                    <ListGroup horizontal id="stanje">
                        <ListGroup.Item><h5>Stanje</h5><br />{stanje} €</ListGroup.Item>
                    </ListGroup>

                    <Button variant="warning" id="polni" onClick={this.opendialogAddChange}>Polni</Button>

                    <DropdownButton variant="warning" id="dropdown-names-button" title={this.state.userName}  >
                        {listNames}
                    </DropdownButton>

                </div>

                <div id="porabaDisplay">

                    <AddReportComponent newReportData={this.state.newReport} opendialogAddArticle={this.opendialogAddArticle} opendialogRemoveArticle={this.openDialogRemoveArticle} dialogSave={this.openSaveDialog} />

                    <HistoryReportsComponent userId={this.state.selectedUser} reports={this.state.reports} />

                </div>

            </div>
        )

    }
}

