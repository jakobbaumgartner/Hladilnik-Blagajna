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
import uniqid from 'uniqid';
import { getUsers, getRecords, getInventory, addCash, getRegisterData, saveReport, addUserData } from './firebase';





export default class Poraba extends Component {

    constructor(props) {
        // const d = new Date();
        super(props);
        this.state = {
            users: [],
            storage: {},
            newReport: {
                // Date: {
                //     day: d.getDate(),
                //     month: d.getMonth(),
                //     year: d.getFullYear()
                // },
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
            dialogSaveReport: 0,
            dialogAddUser: 0
        }

        this.closeDialog = this.closeDialog.bind(this)
        this.opendialogAddChange = this.opendialogAddChange.bind(this)
        this.opendialogAddArticle = this.opendialogAddArticle.bind(this)
        this.openSaveDialog = this.openSaveDialog.bind(this)
        this.openDialogRemoveArticle = this.openDialogRemoveArticle.bind(this)
        this.removeArticle = this.removeArticle.bind(this)
        // this.getStorage = this.getStorage.bind(this)
        this.getUsersData = this.getUsersData.bind(this)
        this.chargeAccount = this.chargeAccount.bind(this)
        this.selectArticle = this.selectArticle.bind(this)
        this.addArticle = this.addArticle.bind(this)
        this.saveReportDialog = this.saveReportDialog.bind(this)
        this.openDialogAddUser = this.openDialogAddUser.bind(this)
        this.addUser = this.addUser.bind(this)



    }

    opendialogAddChange() {
        this.setState({ dialogAddChange: 1 })
    }

    openDialogAddUser() {
        this.setState({ dialogAddUser: 1 })
    }

    opendialogAddArticle() {
        this.setState({ dialogAddArticle: 1 })
    }


    closeDialog() {
        this.setState({ dialogAddChange: 0, dialogAddArticle: 0, dialogRemoveArticle: 0, dialogSaveReport: 0, dialogAddUser: 0});
    }

    openSaveDialog() {
        this.setState({ dialogSaveReport: 1 })
    }

    openDialogRemoveArticle(id) {
        // console.log(id)
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


        var storage = this.props.inventory
        var itemStorage = this.props.inventory[id]
        var itemReport = this.state.newReport.Articles[id]

        console.log(itemStorage)
        console.log(itemReport)

        // check if item with id exists
        if (itemStorage) {
            console.log(itemStorage)

            // check if it is a number
            if (validator.isInt(number)) {

                var numAveliable = itemStorage.amount

                // if already some on the report list count them as not aveliable
                if (itemReport) {
                    numAveliable = itemStorage.amount - itemReport.number
                }

                // check if enough items & not a negative number
                if (numAveliable >= number & number > 0 ) {

                    // add to report list

                    var report = this.state.newReport

                    // if item already exists on report
                    if (report.Articles[id]) {
                        var old_item = report.Articles[id];
                        report.Articles[id] = {name: itemStorage.name, number: Number(old_item.number) + Number(number), price: Number(itemStorage.basePrice) * (1 + Number(itemStorage.overHead)/100)}
                    } 
                    else {
                        report.Articles[id] = {name: itemStorage.name, number: Number(number), price: Number(itemStorage.basePrice) * (1 + Number(itemStorage.overHead)/100)}
                    }
                    
                    
                    console.log(report)

                    // remove from current storage

                    // storage[id].amount = storage[id].amount - number

                    // close dialog
                    this.closeDialog() 
                    
                }

            }
        }
  

    }

    addUser() {

        var name = document.getElementById('addUserName').children[1].value
        var nickname = document.getElementById('addUserNickname').children[1].value
        var ID = document.getElementById('addUserID').children[1].value

        console.log(name)
        console.log(nickname)
        console.log(ID)
        var hiddenid = uniqid()


        if(ID == '') {
            ID = uniqid(nickname+'-')
        }

        addUserData(name, nickname, ID, hiddenid).then((a)=>{this.getUsersData()})

        // this.closeDialog()

    }

    selectArticle(id) {
        console.log(id)
    }

    async getUsersData() {
        await getUsers().then((querySnapshot) => {
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

        this.closeDialog()

    }

    saveReportDialog() { 
        var sum = 0
        var articlePrice = 0

        console.log(this.state.newReport.Articles)

        for (const [key, value] of Object.entries(this.state.newReport.Articles)) {

            console.log(this.props.inventory[key])

            articlePrice = Number(this.props.inventory[key].basePrice)*(1 + Number(this.props.inventory[key].overHead)/100)

            console.log(articlePrice)
            console.log(value.number)
            sum = Number(sum + articlePrice * Number(value.number)) 

            
        }

        console.log(sum)


        // this.state.newReport.Sum = sum

        var report = { ...this.state.newReport}
        report.Sum = sum


        saveReport(this.state.selectedUser, report).then(()=> {
            this.setState({newReport: {Articles: {}}})
            this.getUsersData()
            getRecords(this.state.selectedUser).then((records) => {

                this.setState({ reports: records })

    
            }).then(()=> {
                this.props.getStorage()    
                this.props.changeUpdateStatus(1)
            }
                )
            


        })



        this.closeDialog()
    }

    componentDidMount() {

        console.log('reloaded!!!')

        // this.getStorage()
        this.getUsersData()


    }

    render() {



        const listNames = [];

        for (const [key, user] of Object.entries(this.state.users)) {
            // console.log(`${key}: ${user}`);
            if(user.name !== 'Odpis') {
                listNames.push(<Dropdown.Item as="button" id={key} key={key} onClick={() => this.selectUser(key)}>{user.name}</Dropdown.Item>)
            }
           
        }
        listNames.push(<Dropdown.Divider />)
        listNames.push(<Dropdown.Item as="button" id={'Odpis'} key={'Odpis'} onClick={() => this.selectUser('Odpis')}><b>{'Odpis'}</b></Dropdown.Item>)
        listNames.push(<Dropdown.Item as="button" id='addUser' key='addUser' onClick={this.openDialogAddUser}><b>Dodaj Uporabnika</b></Dropdown.Item>)


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

            // console.log(this.state.newReport)
            // console.log('---------------------hhh')
            // console.log(this.state.storage['dd'])

            artikels.push(<option><p></p></option>)


            for (const [key, value] of Object.entries(this.props.inventory)) {
                // console.log(`${key}: ${value}`);

                var number = value.amount;

                if (this.state.newReport.Articles[key]) {
                    // console.log("hereee")
                    // console.log(value.amount)
                    // console.log(this.state.newReport.Articles[key].number)
                    number = value.amount - this.state.newReport.Articles[key].number
                }


                artikels.push(<option id={key}><p>{value.name}  ( {number} ) </p></option>)


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
            if(this.state.selectedUser) {
                dialog = <Modal show="true">
                    <Modal.Header closeButton onClick={this.closeDialog}>
                        <Modal.Title>Shrani vnos</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeDialog}>Prekliči</Button>
                        <Button variant="success" onClick={this.saveReportDialog}>Potrdi</Button>
                    </Modal.Footer>
                </Modal>
            }
            else {
                dialog = <Modal show="true">
                <Modal.Header closeButton onClick={this.closeDialog}>
                    <Modal.Title>Uporabnik ni izbran.</Modal.Title>
                </Modal.Header>
              
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.closeDialog}>Prekliči</Button>
                </Modal.Footer>
            </Modal>
            }

        }
        else if (this.state.dialogAddUser) {
            dialog = <Modal show="true">
            <Modal.Header closeButton onClick={this.closeDialog}>
                <Modal.Title>Dodaj uporabnika</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                
                    <InputGroup className="mb-3" id="addUserName" >
                        <InputGroup.Text>Ime in priimek: </InputGroup.Text>
                        <Form.Control/>
                    </InputGroup>

                    <InputGroup className="mb-3" id="addUserNickname">
                        <InputGroup.Text>Nickname: </InputGroup.Text>
                        <Form.Control />
                    </InputGroup>

                    <InputGroup className="mb-3" id="addUserID">
                        <InputGroup.Text>ID: </InputGroup.Text>
                        <Form.Control placeholder="Pusti prazno za avtomatsko."/>
                    </InputGroup>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={this.addUser}>
                    Shrani
                </Button>
            </Modal.Footer>
        </Modal>
        }
        else if (this.state.dialogRemoveArticle) {

            dialog = <Modal show="true">
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

            <div id="porabacontainer">

                {dialog}

                <div id="displayStanje">

                    <ListGroup horizontal id="stanje">
                        <ListGroup.Item><h5>Stanje</h5><br />{parseFloat(stanje).toFixed(2)} €</ListGroup.Item>
                    </ListGroup>

                    <Button variant="warning" id="polni" onClick={this.opendialogAddChange}>Polni</Button>

                    <DropdownButton variant="warning" id="dropdown-names-button" title={this.state.userName}  >
                        {listNames}
                    </DropdownButton>

                </div>

                <div id="porabaDisplay">

                    <AddReportComponent inventory={this.props.inventory} newReportData={this.state.newReport} opendialogAddArticle={this.opendialogAddArticle} opendialogRemoveArticle={this.openDialogRemoveArticle} dialogSave={this.openSaveDialog} />

                    <HistoryReportsComponent userId={this.state.selectedUser} reports={this.state.reports} />

                </div>

            </div>
        )

    }
}

