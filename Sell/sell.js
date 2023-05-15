import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
import { Timestamp, getFirestore, collection, getDoc, doc, setDoc, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL  } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-storage.js";

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
const storage = getStorage();

const errMes = document.querySelector('.errMes');

const itemName = document.querySelector('.name');
const desc = document.querySelector('.description');
const category = document.querySelector('.category');
const price = document.querySelector('.price');
const image = document.querySelector('.image');
const btn = document.querySelector('#btn');
btn.addEventListener("click", (event) => upload(event))

const logoutBtn = document.querySelector(".logout");
logoutBtn.addEventListener("click", () => logout());

window.addEventListener("load", function() {   
    auth.onAuthStateChanged(function(user) {
        if (user) {
          
        } else {
          window.location.href = "../homepage/homepage.html";
        }
    })

});

async function upload(e) {
  errMes.textContent = "";
  if (itemName.value != "" && desc.value != "" && price.value != "" && category.value != "" && image.value != "") {

      // Check if user is signed in
      auth.onAuthStateChanged(async function(user) {
        if (user) {

          // Get users document
          const snap = await getDoc(doc(db, "users", user.uid));
          if (snap.exists()) {

            const docRef = await addDoc(collection(db, "products"), {
              name: itemName.value,
              desc: desc.value,
              price: price.value,
              category: category.value,
              username: snap.data().username,
              timestamp: Timestamp.fromDate(new Date())
            });

            // Set storage path with the same id as the product id
            const storageImgRef = ref(storage, 'productImages/'+docRef.id);

            // Get uploaded image details
            const img = document.querySelector('.image').files[0];

            // Set metadata (not necessary/doesn't work)
            const metadata = {
              contentType: img.type,
              timestamp: new Date().getTime(),
              imageName: img.name
            };

            // Save image to storage
            uploadBytes(storageImgRef, img, metadata).then((snapshot) => {
              console.log('Uploaded a file!', snapshot);
              // Get image download link and save to product document
              getDownloadURL(storageImgRef).then(async (url) => {
                console.log(url);
                await updateDoc(docRef, {
                  imgDownloadURL: url
                }); 

                // Navigate home
                window.location.href = "../homepage/homepage.html";
              })
            });
          }
          // Create new product document
          
        }
      }) 
  } else {
    errMes.textContent = "Please fill in all fields"
  }

  
}
function logout() {
  signOut(auth).then(() => {
      // Sign-out successful.
      window.location.href = "../homepage/homepage.html";
    }).catch((error) => {
      // An error happened.
      console.log(error);
    });
}