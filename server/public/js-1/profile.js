import { db } from './firebase-config.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { ref, get, set } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import {signOut} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
const auth = getAuth();
const profileForm = document.getElementById('profileForm');
const playerInfo = document.getElementById('playerInfo');
const teamInfo = document.getElementById('teamInfo');
const viewSection = document.getElementById('viewSection');
const editBtn = document.getElementById('editBtn');
const logoutBtn = document.getElementById('logoutBtn');

onAuthStateChanged(auth, user => {
  if (user) {
    const playerRef = ref(db, `players/${user.uid}`);

    get(playerRef).then(snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        showProfile(data);
        fetchTeam(data.teamName);
      } else {
        profileForm.style.display = 'block';
        viewSection.style.display = 'none';
      }
    });

    // ✅ Attach this OUTSIDE the get() block so it always works
    profileForm.addEventListener('submit', e => {
      e.preventDefault();

      const playerData = {
        fullName: document.getElementById('fullName').value,
        teamName: document.getElementById('teamName').value,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        position: document.getElementById('position').value,
        shirtNumber: document.getElementById('shirtNumber').value,
        phone: document.getElementById('phone').value,
        school: document.getElementById('school').value,
        emergencyContact: document.getElementById('emergencyContact').value,
        medical: document.getElementById('medical').value || ""
      };

      set(playerRef, playerData)
        .then(() => {
          alert('Profile saved!');
          showProfile(playerData);
          fetchTeam(playerData.teamName);
        })
        .catch(error => {
          console.error("Error saving profile:", error);
          alert("Failed to save profile. See console for details.");
        });
    });

    // Move this outside too
    editBtn.addEventListener('click', () => {
      profileForm.style.display = 'block';
      viewSection.style.display = 'none';

    get(ref(db, `players/${auth.currentUser.uid}`)).then(snapshot => {
    const data = snapshot.val();
    document.getElementById('fullName').value = data.fullName || "";
    document.getElementById('teamName').value = data.teamName || "";
    document.getElementById('age').value = data.age || "";
    document.getElementById('gender').value = data.gender || "";
    document.getElementById('position').value = data.position || "";
    document.getElementById('shirtNumber').value = data.shirtNumber || "";
    document.getElementById('phone').value = data.phone || "";
    document.getElementById('school').value = data.school || "";
    document.getElementById('emergencyContact').value = data.emergencyContact || "";
    document.getElementById('medical').value = data.medical || "";
  });
});


  } else {
    window.location.href = 'login.html'; // not logged in
  }
});

logoutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  signOut(auth)
    .then(() => {
      alert("You have been logged out.");
      window.location.href = 'login.html'; // redirect to login page
    })
    .catch((error) => {
      console.error("Logout failed:", error);
      alert("Failed to logout. Please try again.");
    });
});


function showProfile(data) {
  profileForm.style.display = 'none';
  viewSection.style.display = 'block';

  playerInfo.innerHTML = `
    <strong>Name:</strong> ${data.fullName}<br>
    <strong>Age:</strong> ${data.age}<br>
    <strong>Gender:</strong> ${data.gender}<br>
    <strong>Position:</strong> ${data.position}<br>
    <strong>Shirt Number:</strong> ${data.shirtNumber}<br>
    <strong>Phone:</strong> ${data.phone}<br>
    <strong>School:</strong> ${data.school}<br>
    <strong>Emergency Contact:</strong> ${data.emergencyContact}<br>
    <strong>Medical Info:</strong> ${data.medical || 'None'}<br>
  `;
}

function fetchTeam(teamName) {
  const teamRef = ref(db, 'teams/');
  get(teamRef).then(snapshot => {
    const teams = snapshot.val();
    for (let key in teams) {
      if (teams[key].teamName === teamName) {
        teamInfo.innerText = `Team: ${teams[key].teamName}, Coach: ${teams[key].coach}, Category: ${teams[key].category}`;
        break;
      }
    }
  });
}
