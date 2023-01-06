import { initializeApp } from "firebase/app";

import {
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

import { getFirestore, collection, getDocs, setDoc, deleteDoc, doc } from "firebase/firestore";

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
    basePrice: basePrice,
    overHead: 0,
    amount: number
  });

  return "sentData"

}

const removeArticleData = async (id) => {

  await deleteDoc(doc(db, "inventory", id));

}

const updateStockData = async (id, number, price) => {

  await setDoc(doc(db, 'inventory', id), { amount: number, basePrice: price }, { merge: true });

}

const setPriceOverheadData = async (id, value) => {
  
  await setDoc(doc(db, 'inventory', id), { overHead: value }, { merge: true });

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
  setPriceOverheadData
};