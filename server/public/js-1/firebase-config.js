 // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
  import { getDatabase } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBKQhimkiF4vvWOzuAYe2aPwdxOcnxszIk",
    authDomain: "hockey-app-34130.firebaseapp.com",
    databaseURL: "https://hockey-app-34130-default-rtdb.firebaseio.com",
    projectId: "hockey-app-34130",
    storageBucket: "hockey-app-34130.firebasestorage.app",
    messagingSenderId: "339250713825",
    appId: "1:339250713825:web:4afcd188cbf4575d6953a0"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { app, db, auth };