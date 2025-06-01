// js/team.js
import { db } from './firebase-config.js';
import { ref, push } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

export function registerTeam(name, coach, category) {
  return push(ref(db, 'teams/'), { name, coach, category });
}
