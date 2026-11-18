import { collection, doc, onSnapshot, writeBatch } from "firebase/firestore";

import { db } from "../firebase.js";

// Listen to all vendors
export function subscribeToVendors(onData, onError) {
  return onSnapshot(
    collection(db, "vendors"),
    (snapshot) => onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError,
  );
}

// Listen to one vendor
export function subscribeToVendor(vendorId, onData, onError) {
  return onSnapshot(
    doc(db, "vendors", vendorId),
    (snap) => onData(snap.exists() ? { id: snap.id, ...snap.data() } : null),
    onError,
  );
}

// Listen to a vendor's menu
export function subscribeToMenu(vendorId, onData, onError) {
  return onSnapshot(
    collection(db, "vendors", vendorId, "menu"),
    (snapshot) =>
      onData(
        snapshot.docs.map((d) => ({
          id: d.id,
          vendorId,
          ...d.data(),
        })),
      ),
    onError,
  );
}

// Copy vendors.json data into Firestore
export async function seedDemoData(vendors) {
  const batch = writeBatch(db);

  for (const { menu, id, ...vendor } of vendors) {
    batch.set(doc(db, "vendors", id), vendor);

    for (const { id: itemId, ...item } of menu) {
      batch.set(doc(db, "vendors", id, "menu", itemId), item);
    }
  }

  await batch.commit();
}
