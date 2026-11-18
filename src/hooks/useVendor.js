import { useEffect, useState } from "react";
import { subscribeToVendor, subscribeToMenu } from "../services/vendors.js";

export function useVendor(vendorId) {
  const [vendor, setVendor] = useState(undefined);
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stopVendor = subscribeToVendor(vendorId, setVendor, (err) =>
      setError(err.message),
    );

    const stopMenu = subscribeToMenu(vendorId, setMenu, (err) =>
      setError(err.message),
    );

    return () => {
      stopVendor();
      stopMenu();
    };
  }, [vendorId]);

  return {
    vendor,
    menu,
    loading: vendor === undefined && !error,
    error,
  };
}
