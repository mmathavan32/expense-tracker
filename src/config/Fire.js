import firebase from "firebase";

const config = {
  apiKey: "AIzaSyCptBP2yktgx_BGZozDRw1vKxyTqyDrtO0",
  authDomain: "expense-tracker-643b4.firebaseapp.com",
  projectId: "expense-tracker-643b4",
  storageBucket: "expense-tracker-643b4.appspot.com",
  messagingSenderId: "986811549723",
  appId: "1:986811549723:web:7cf1ae42f10ee931c790be",
  measurementId: "G-CBPNFKX8J9",
  databaseURL:
    "https://expense-tracker-643b4-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const fire = firebase.initializeApp(config);

export default fire;
