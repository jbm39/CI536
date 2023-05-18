import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
import { getFirestore, collection, getDocs, getDoc, where, query, orderBy, limit, deleteDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBw5eHb_dQs9kz2fMMl1Tna-L1cV3XJS7k",
    authDomain: "brighton-uni-marketplace.firebaseapp.com",
    projectId: "brighton-uni-marketplace",
    storageBucket: "brighton-uni-marketplace.appspot.com",
    messagingSenderId: "389607392934",
    appId: "1:389607392934:web:406b10d68b4b71feb55667"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage();

window.addEventListener("load", function() {    
    const explore = document.querySelector("#exploreBtn");
    explore.addEventListener("click", () => navigateToProducts());

    const catBtn = document.querySelector("#catBtn");
    catBtn.addEventListener("click", () => { window.location.href = "../products/products.html"});

    try {
        // Check if user is logged in
        auth.onAuthStateChanged(function(user) {
            if (user) {
                // If user logged in, display sell items and log out instead of login and signup
                document.querySelector(".signup").style.display = 'none';
                const logIn = document.querySelector(".login");
                logIn.style.display = 'none';
                
                const sell = document.createElement("li");
                sell.setAttribute("class", "sell");
                sell.style.display = 'inline-block';

                const sellbtn = document.createElement("a");
                sellbtn.textContent = "Sell Item";
                sellbtn.style.cursor = 'pointer';
                sellbtn.addEventListener('click', () => navigateToSellPage())

                const logOut = document.createElement("li");
                logOut.setAttribute("class", "logout");
                logOut.style.display = 'inline-block';

                const logOutBtn = document.createElement("a");
                logOutBtn.textContent = "Log Out";
                logOutBtn.style.cursor = "pointer";
                logOutBtn.addEventListener('click',() => logout());

                sell.appendChild(sellbtn)
                logOut.appendChild(logOutBtn);

                const navbar = document.querySelector(".navbar-pages");
                navbar.appendChild(sell);
                navbar.appendChild(logOut);

            } else {
                // If not logged in, show login and signup buttons and hide logout button
                try {
                    document.querySelector(".logout").style.display = 'none';
                    document.querySelector(".login").style.display = 'inline-block'
                    document.querySelector(".signup").style.display = 'inline-block';
                } catch (e) {
                    console.log(e);
                }
               
            }
          });
    } catch (e) {
        console.error("Error adding document: ", e);
    }

    // Start displaying products
    getProducts();

    const catTiles = document.querySelectorAll(".col-4");
    for (let i = 0; i < catTiles.length; i++) {
        catTiles[i].addEventListener("click", () => categoriesNav(catTiles[i].children));
    }
    
})

async function getProducts() {
    const q = query(collection(db, "products"), orderBy("timestamp", "desc"), limit(10));
    const snap = await getDocs(q);
    // Create the display for each product
    snap.forEach((doc) => {
        // Get where the products will be shown
        const prodDisplay = document.querySelector(".showProds");
        // Create Image
        const newProd = document.createElement("div");
        newProd.setAttribute("class", "product");
        const newProdImgDiv = document.createElement("div");
        newProdImgDiv.setAttribute("class", "prodImg");
        const newProdImg = document.createElement("img");
        newProdImg.setAttribute("src", doc.data().imgDownloadURL);
        newProdImgDiv.appendChild(newProdImg);
        // Create product details 
        const newProdDetailsDiv = document.createElement("div");
        newProdDetailsDiv.setAttribute("class", "prodDetails");

        const name = document.createElement("h3");
        name.setAttribute("class","prodName");
        name.textContent = doc.data().name;

        const desc = document.createElement("p");
        desc.setAttribute("class","prodDesc");
        desc.textContent = doc.data().desc;

        const price = document.createElement("p");
        price.setAttribute("class","prodPrice");
        price.innerHTML = '£<b>' + doc.data().price + '</b>';

        const date = document.createElement("p");
        date.setAttribute("class","prodDate");
        date.innerHTML = 'Posted on <b>' + doc.data().timestamp.toDate().toLocaleDateString('en-uk') + '</b>';

        const seller = document.createElement("p");
        seller.setAttribute("class","prodSeller");
        seller.innerHTML = 'Posted by <b>' + doc.data().username + '</b>';
        
        newProdDetailsDiv.appendChild(name);
        newProdDetailsDiv.appendChild(desc);
        newProdDetailsDiv.appendChild(price);
        newProdDetailsDiv.appendChild(date);
        newProdDetailsDiv.appendChild(seller);

        // Create buy button
        const newBuyBtn = document.createElement("button");
        newBuyBtn.setAttribute("class", "buyBtn");
        newBuyBtn.textContent = "Buy";
        newBuyBtn.addEventListener("click", () => buyItem(doc.id));

        const newBuyBtnDiv = document.createElement("div");
        newBuyBtnDiv.setAttribute("class", "buyBtnDiv");
        newBuyBtnDiv.appendChild(newBuyBtn);

        // Add Image, product details and buy button to page
        newProd.appendChild(newProdImgDiv);
        newProd.appendChild(newProdDetailsDiv);
        newProd.appendChild(newBuyBtnDiv);

        prodDisplay.appendChild(newProd);
    })
    return snap;
}

function logout() {
    signOut(auth).then(() => {
        // Sign-out successful.
        location.reload()
      }).catch((error) => {
        // An error happened.
        console.log(error);
      });
}

function navigateToSellPage() {
    window.location.href = '../sell/sell.html'
}
function navigateToProducts() {
    const prods = document.querySelector(".showProds");
    prods.scrollIntoView();
}
async function buyItem(id) {
    const docRef = doc(db, "products", id)
    const snap = await getDoc(docRef)
    if (snap.exists()) {
        console.log(snap.data())
        await setDoc(doc(db, "soldProducts", id), {
            name: snap.data().name,
            desc: snap.data().desc,
            price: snap.data().price,
            timestamp: snap.data().timestamp,
            imgDownloadURL: snap.data().imgDownloadURL
          });
        await deleteDoc(doc(db, "products", id));
        location.reload();
    }
    //
}

function categoriesNav(tile) {
    console.log(tile);
    console.log(tile[1].innerHTML);
    window.location.href = "../products/products.html?" + tile[1].innerHTML.toLowerCase();
}