// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// Your Firebase config (same as in your HTML)
const firebaseConfig = {
  apiKey: "AIzaSyBKQhimkiF4vvWOzuAYe2aPwdxOcnxszIk",
  authDomain: "hockey-app-34130.firebaseapp.com",
  projectId: "hockey-app-34130",
  storageBucket: "hockey-app-34130.firebasestorage.app",
  messagingSenderId: "339250713825",
  appId: "1:339250713825:web:4afcd188cbf4575d6953a0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Redirect if not logged in
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "login.html";
  }
});

// Logout button logic
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  signOut(auth)
    .then(() => {
      alert("Logged out successfully.");
      window.location.href = "login.html";
    })
    .catch(error => {
      console.error("Logout failed:", error);
      alert("Error logging out.");
    });
});
