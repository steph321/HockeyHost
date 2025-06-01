// js/event.js
import { db } from './firebase-config.js';
import { ref, push, get, onValue } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

// Add event (admin only)
export function addEvent(title, description,location, date) {
  return push(ref(db, 'events/'), { title, description,location, date });
}

// Get all events (for viewing)
export function fetchEvents(callback) {
  const eventsRef = ref(db, 'events/');
  onValue(eventsRef, snapshot => {
    const events = snapshot.val() || {};
    callback(events);
  });
}
