import { initializeApp } from "firebase/app";

import {
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

import { getFirestore, collection, collectionGroup, getDocs, getDoc, setDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";

import uniqid from 'uniqid';



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrE37q6MYmBUDOizljWYATH3zkvJPi0OE",
  authDomain: "hladilnikfe.firebaseapp.com",
  projectId: "hladilnikfe",
  storageBucket: "hladilnikfe.appspot.com",
  messagingSenderId: "183131767802",
  appId: "1:183131767802:web:6706cfc9f8bb51492eda43"
};


const app = initializeApp(firebaseConfig);

// AUTH

const auth = getAuth(app);

const logInWithEmailAndPassword = async (email, password) => {

  await signInWithEmailAndPassword(auth, email, password) //.then((a) => console.log(auth.currentUser));
};

const logOut = async () => {
  await signOut(auth).then(() => console.log(auth.currentUser));
};


// DATABASE
const db = getFirestore(app);

const getUsers = async () => {

  const querySnapshot = await getDocs(collection(db, "users",));

  return querySnapshot
}

const getAllUsersData = async () => {

  var allUsers = {}

  const querySnapshot = await getDocs(collection(db, "users",));

  console.log("USERDATA")

  querySnapshot.forEach((doc) => {

    var dat = doc.data()
    var id = doc.id

    allUsers[id] = dat

});


console.log(allUsers)

}

const getBoughtList = async () => {

  const querySnapshot = await getDocs(collection(db, "bought"));

  return querySnapshot
}

const getInventory = async () => {

  const querySnapshot = await getDocs(collection(db, "inventory",));

  return querySnapshot
}

const getRecords = async (userid) => {


  var records = {};

  if (userid == '') {
    // console.log('no user')
    return records
  }

  const querySnapshot = await getDocs(collection(db, "users", userid, "records"));

  querySnapshot.forEach((doc) => {
    // console.log(doc.id);
    // console.log(doc.data())

    var dateFormat = ((doc.data().date).toDate())

    var articles = {};

    records[doc.id] = {
      Articles: articles,
      Sort: doc.data().type,
      Date: {
        day: dateFormat.getDate(),
        month: (dateFormat.getMonth() + 1),
        year: 2022
      },
      Sum: doc.data().amount
    }

  });


  var listArtic = {};

  for (const [key, value] of Object.entries(records)) {
    // console.log(`${key}: ${value}`);

    await getDocs(collection(db, "users", userid, "records", key, "articles")).then((articles) => {

      listArtic = {};

      articles.forEach((doc) => {
        // console.log(doc.id)
        // console.log(doc.data())
        articles[doc.id] = doc.data()

        listArtic[doc.id] = doc.data()

      })

      records[key].Articles = listArtic

    }
    );

  }


  return records;
}

const getRegisterData = async () => {

  const querySnapshot = await getDocs(collection(db, "register",));

  return querySnapshot
}

const addArticleData = async (name, basePrice, number) => {

  var postResponse = setDoc(doc(db, "inventory", uniqid('article-')), {
    name: name,
    basePrice: Number(basePrice),
    overHead: Number(0),
    amount: Number(number)
  });

  var postResponse = setDoc(doc(db, "bought", uniqid()), {
    name: name,
    basePrice: Number(basePrice),
    amount: Number(number),
    date: Timestamp.now()
  });

  return "sentData"

}

const removeArticleData = async (id) => {

  await deleteDoc(doc(db, "inventory", id));

}

const updateStockData = async (articleId, newNumber, price, number, boughtPrice, articleName) => {

  await setDoc(doc(db, 'inventory', articleId), { amount: newNumber, basePrice: price }, { merge: true });

  var postResponse = setDoc(doc(db, "bought", uniqid()), {
    name: articleName,
    basePrice: Number(boughtPrice),
    amount: Number(number),
    date: Timestamp.now()
  });

}

const setPriceOverheadData = async (id, value) => {

  await setDoc(doc(db, 'inventory', id), { overHead: value }, { merge: true });

}

const addCash = async (id, value) => {

  var date = new Date()

  await setDoc(doc(db, "users", id, 'records', uniqid('record-')), {
    type: 'credit',
    amount: Number(value),
    date: date
  });

  const querySnapshot = await getDocs(collection(db, "register",));

  var register;
  // console.log(querySnapshot.data())
  querySnapshot.forEach((doc) => {
    register = doc.data();
  });

  console.log(register.cashRegister)

  await setDoc(doc(db, 'register', 'status'), { cashRegister: Number(register.cashRegister) + Number(value) }, { merge: true });


}

const saveReport = async (username, newReport) => {

  // check if any articles are on the list
  if (Object.keys(newReport.Articles).length) {

    var date = new Date()

    var recordID = uniqid('record-');

    const querySnapshot = await getDocs(collection(db, "register",));

    var register;
    // console.log(querySnapshot.data())
    querySnapshot.forEach((doc) => {
      register = doc.data();
    });

    await setDoc(doc(db, 'register', 'status'), { cashRegister: Number(register.cashRegister) - Number(newReport.Sum) }, { merge: true });

    await setDoc(doc(db, 'users', username, 'records', recordID), {


      date: date,
      type: 'articles',
      amount: newReport.Sum

    }, { merge: true })
      .then(() => {

        for (const [key, value] of Object.entries(newReport.Articles)) {

          // add articles to the list
          setDoc(doc(db, 'users', username, 'records', recordID, 'articles', key), {
            name: value.name,
            amount: value.number,
            price: value.price
          }, { merge: true });


          // remove articles from inventory
          getDoc(doc(db, "inventory", key)).then((state) => {

            var newnumber = Number(state.data().amount) - Number(value.number)

            setDoc(doc(db, 'inventory', key), {
              amount: newnumber
            }, { merge: true });



          }


          );

        }


      })

  }
}

const addUserData = async (name, nickname, ID, hiddenid) => {

  var postResponse = await setDoc(doc(db, "users", ID), {
    name: name, 
    nickname: nickname,
    hiddenid: hiddenid
  });

}

const calcualteAllItemsSold = async () => {
  console.log("Started Calculations")
  
  // get a reference to the "users" collection
const usersCollectionRef = collection(db, 'users');

var allData = []

var totalSumArticles = 0;
var totalSumCash = 0;

// retrieve all documents in the "users" collection
getDocs(usersCollectionRef)
  .then((querySnapshot) => {
    querySnapshot.forEach((userDoc) => {
      // get a reference to the "records" sub-collection for this user
      const recordsCollectionRef = collection(userDoc.ref, 'records');

      // create a query to filter the documents by user ID
      // const userQuery = query(recordsCollectionRef, where('userId', '==', userDoc.id));

      // initialize sum to 0
      let sumSoldArticles = 0;
      let sumCashInflow = 0;


      // retrieve all documents in the "records" sub-collection for this user
      getDocs(recordsCollectionRef).then((recordsQuerySnapshot) => {
        recordsQuerySnapshot.forEach((recordDoc) => {
          // add the "amount" field to the sum

          if (recordDoc.data().type == "articles") {
            sumSoldArticles += recordDoc.data().amount;
          }

          if (recordDoc.data().type == "credit") {
            sumCashInflow += recordDoc.data().amount;
          }

        });

        totalSumArticles += sumSoldArticles;
        totalSumCash += sumCashInflow;
  
        allData.push({"id": userDoc.id, "name": userDoc.name, "hiddenid": userDoc.hiddenid, "sumArticles": sumSoldArticles, "sumCash":  sumCashInflow})

        console.log(`User ${userDoc.id} total amount articles: ${sumSoldArticles}, total amount input: ${sumCashInflow}`);
      });
    
      // WORKS NEEDED HERE !!!!!!!!!!!!!!!!!!!!!!!!!

    });
  })


}

async function calculateBoughtSum() {
  // Define a function to calculate the sum of "amount" * "basePrice" for each document

  let sum = 0;

  const boughtRef = collection(db, "bought");

  const querySnapshot = await getDocs(boughtRef);
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    sum += data.amount * data.basePrice;
  });
  return sum;
}



export {
  auth,
  // db,
  logInWithEmailAndPassword,
  logOut,
  getUsers,
  getRecords,
  getInventory,
  getRegisterData,
  addArticleData,
  removeArticleData,
  updateStockData,
  setPriceOverheadData,
  addCash,
  saveReport,
  addUserData,
  getAllUsersData,
  getBoughtList,
  calcualteAllItemsSold,
  calculateBoughtSum
};