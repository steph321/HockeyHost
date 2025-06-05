// auth.js
import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

// Signup function
export function signup(fullname, email, password, role) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      return set(ref(db, 'users/' + user.uid), {
        fullname,
        email,
        role
      });
    });
}

// Login function
export async function login(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  const snapshot = await get(ref(db, 'users/' + uid));
  if (snapshot.exists()) {
    const userData = snapshot.val();
    if (userData.role === 'admin') {
      window.location.href = 'admin-dashboard.html';
    } else if (userData.role === 'player') {
      window.location.href = 'player-dashboard.html';
    } else {
      alert('Unknown role.');
    }
  } else {
    alert('No user data found.');
  }
}
