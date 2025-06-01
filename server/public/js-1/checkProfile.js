import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import { db } from './firebase-config.js';

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    const userRef = ref(db, `players/${user.uid}`);
    get(userRef).then(snapshot => {
      if (!snapshot.exists()) {
        // Redirect to profile form page
        window.location.href = "profile.html";
      }
    });
  } else {
    window.location.href = "login.html"; // not signed in
  }
});
