// js/player.js
import { auth, db } from './firebase-config.js';
import { ref, push } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

export function registerPlayer(name, age, team) {
  return push(ref(db, 'players/'), { name, age, team });
}
