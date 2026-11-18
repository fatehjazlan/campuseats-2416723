import { useEffect, useState } from "react";
import { subscribeToVendors } from "../services/vendors.js";

export function useVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToVendors(
      (data) => {
        setVendors(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [reloadKey]);

  function reload() {
    setReloadKey((key) => key + 1);
  }

  return { vendors, loading, error, reload };
}
