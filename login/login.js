// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
import { getFirestore, collection, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
    apiKey: "AIzaSyBw5eHb_dQs9kz2fMMl1Tna-L1cV3XJS7k",
    authDomain: "brighton-uni-marketplace.firebaseapp.com",
    projectId: "brighton-uni-marketplace",
    storageBucket: "brighton-uni-marketplace.appspot.com",
    messagingSenderId: "389607392934",
    appId: "1:389607392934:web:406b10d68b4b71feb55667"
  };

// // Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const email = document.querySelector(".email");
const password = document.querySelector(".psword");

window.addEventListener("load", function() {
    

    const loginBtn = document.querySelector("#btn");
    loginBtn.addEventListener('click', () => login());

    //createUserWithEmailAndPassword(auth, email, password)
})

async function login() {
    if (email.value !== "" && password.value !== "") {
        signInWithEmailAndPassword(auth, email.value, password.value)
        .then((user) => {
            console.log(user);
            window.location.href = "../homepage/homepage.html";
        });
        
    } else {
        const errMes = document.querySelector(".errMes");
        const message = document.createTextNode("Please fill in all fields");
        errMes.appendChild(message);
        errMes.style.display = "block";
    }

    
}