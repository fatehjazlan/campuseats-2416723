import {
  doc,
  onSnapshot,
  setDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { db } from "../firebase.js";

// Listen to a user's favourites
export function subscribeToFavourites(uid, onData, onError) {
  return onSnapshot(
    doc(db, "favourites", uid),
    (snapshot) => {
      onData(snapshot.exists() ? (snapshot.data().itemIds ?? []) : []);
    },
    onError,
  );
}

// Add a favourite item
export function addFavourite(uid, itemId) {
  return setDoc(
    doc(db, "favourites", uid),
    { itemIds: arrayUnion(itemId) },
    { merge: true },
  );
}

// Remove a favourite item
export function removeFavourite(uid, itemId) {
  return setDoc(
    doc(db, "favourites", uid),
    { itemIds: arrayRemove(itemId) },
    { merge: true },
  );
}
