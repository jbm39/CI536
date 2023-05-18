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
const username = document.querySelector(".username");
const password = document.querySelector(".psword");
const passwordRepeat = document.querySelector(".psword-repeat");
const checkbox = document.querySelector('.agree');

window.addEventListener("load", function() {
    

    const signUpBtn = document.querySelector("#btn");
    signUpBtn.addEventListener('click', () => signUp());

    //createUserWithEmailAndPassword(auth, email, password)
})

async function signUp() {
    errMes.textContent = "";
    // get all user docs
    const userSnap = await getDocs(collection(db, "users"))

    if (email.value != "" && username.value != "" && password.value != "" && passwordRepeat.value != "") {
        if (password.value === passwordRepeat.value) {
            
            if (checkbox.checked) { 
                let usernameClash = false;
                    userSnap.forEach((user) => {
                        if (user.data().username === username.value.toLowerCase()) {
                            usernameClash =  true;
                        }
                    });
                    if (!usernameClash) {
                        await createUserWithEmailAndPassword(auth, email.value, password.value).then(
                            async (userCredentials) => {
                                const u = userCredentials.user;
                                await setDoc(doc(db, "users", u.uid.toString()), {
                                    email: u.email,
                                    username: username.value
                                })

                                signInWithEmailAndPassword(auth, email.value, password.value);
                                window.location.href = "../homepage/homepage.html"
                            }
                        ).catch((error) => {
                            const errMes = document.querySelector(".errMes");
                            switch (error.code) {
                                case 'auth/email-already-in-use':
                                errMes.textContent = `Email address ${email.value} already in use.`;
                                break;
                                case 'auth/invalid-email':
                                    errMes.textContent = `Email address ${email.value} is invalid.`;
                                break;
                                case 'auth/operation-not-allowed':
                                    errMes.textContent = `Error during sign up.`;
                                break;
                                case 'auth/weak-password':
                                    errMes.textContent = 'Password is not strong enough. Add additional characters including special characters and numbers.';
                                break;
                                default:
                                console.log(error.message);
                                break;
                            }
                    }) 
                } else {
                    const errMes = document.querySelector(".errMes");
                    errMes.textContent = "Username already exists";
                }
            } else {
                const errMes = document.querySelector(".errMes");
                errMes.textContent = "Please accept our T&Cs"
            }
        } else {
            const errMes = document.querySelector(".errMes");
            errMes.textContent = "Passwords do not match";
        }
    } else {
        const errMes = document.querySelector(".errMes");
        errMes.textContent = "Please complete all fields";
    }

}



