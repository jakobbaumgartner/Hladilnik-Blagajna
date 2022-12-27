import { initializeApp } from "firebase/app";

import {
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

import { getFirestore, collection, getDocs } from "firebase/firestore";


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


  //   (getUsers().then((querySnapshot) => {
  //     var users = {};

  //     querySnapshot.forEach((doc) => {

  //         var dat = doc.data()
  //         users[doc.id] = doc.data();
  //         this.setState({ credit: dat.credit })
  //     });

  //     this.setState({users: users})

  // }))

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

    await getDocs(collection(db, "users",userid, "records", key, "articles")).then((articles) => {

      listArtic = {};

      articles.forEach((doc) => {
        // console.log(doc.id)
        // console.log(doc.data())
        articles[doc.id] = doc.data()

        listArtic[doc.id] = doc.data()
  
      })

      records[key].Articles = listArtic


      // console.log(listArtic)
  }
);

  }


  


  // console.log(records)

  return records;
}



export {
  auth,
  // db,
  logInWithEmailAndPassword,
  logOut,
  getUsers,
  getRecords
};