// auth-check.js
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userRef = ref(db, `players/${user.uid}`);
    get(userRef).then(snapshot => {
      if (!snapshot.exists()) {
        // Redirect to profile form page if profile not filled
        window.location.href = "profile.html";
      }
    });
  } else {
    // Not logged in, redirect to login
    window.location.href = "login.html";
  }
});
