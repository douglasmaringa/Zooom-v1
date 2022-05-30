import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/firebase-storage'


const firebaseConfig = {
  apiKey: "AIzaSyBYeK9BToQTDQoxF3rNAvjM6FaoPW0MpqM",
    authDomain: "storyeaselrn.firebaseapp.com",
    projectId: "storyeaselrn",
    storageBucket: "storyeaselrn.appspot.com",
    messagingSenderId: "472204209789",
    appId: "1:472204209789:web:6f96fbbdc3bdffad5e8b14",
    measurementId: "G-FCTC1NFXH0"
};

const fire = firebase.initializeApp(firebaseConfig)

const db = fire.firestore()
const auth = fire.auth()
const storage = fire.storage();


export { db, auth,storage }
export default firebase
