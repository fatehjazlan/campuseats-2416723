import { useEffect, useMemo, useState } from "react";
import { CartContext } from "./cart-context.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { useAuth } from "../hooks/useAuth.js";
import {
  subscribeToFavourites,
  addFavourite,
  removeFavourite,
} from "../services/favourites.js";

export function CartProvider({ children }) {
  const { user } = useAuth();

  const [cart, setCart] = useLocalStorage("campuseats-cart", []);

  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    setFavourites([]);

    if (!user) return;

    const unsubscribe = subscribeToFavourites(user.uid, setFavourites, (err) =>
      console.error("Favourites error:", err),
    );

    return unsubscribe;
  }, [user?.uid]);

  const count = cart.reduce((sum, line) => sum + line.qty, 0);

  const total = cart.reduce((sum, line) => sum + line.item.price * line.qty, 0);

  function addToCart(item) {
    setCart((prev) => {
      const existing = prev.find((line) => line.item.id === item.id);

      if (existing) {
        return prev.map((line) =>
          line.item.id === item.id ? { ...line, qty: line.qty + 1 } : line,
        );
      }

      return [...prev, { item, qty: 1 }];
    });
  }

  function changeQty(itemId, delta) {
    setCart((prev) =>
      prev
        .map((line) =>
          line.item.id === itemId ? { ...line, qty: line.qty + delta } : line,
        )
        .filter((line) => line.qty > 0),
    );
  }

  function removeFromCart(itemId) {
    setCart((prev) => prev.filter((line) => line.item.id !== itemId));
  }

  // Clear cart after placing an order
  function clearCart() {
    setCart([]);
  }

  async function toggleFavourite(itemId) {
    if (!user) return;

    try {
      if (favourites.includes(itemId)) {
        await removeFavourite(user.uid, itemId);
      } else {
        await addFavourite(user.uid, itemId);
      }
    } catch (error) {
      console.error("Could not update favourite:", error);
    }
  }

  const value = useMemo(
    () => ({
      cart,
      count,
      total,
      addToCart,
      changeQty,
      removeFromCart,
      clearCart,
      favourites: user ? favourites : [],
      toggleFavourite,
    }),
    [cart, count, total, favourites, user],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
