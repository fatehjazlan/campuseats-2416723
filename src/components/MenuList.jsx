import { useState } from "react";
import MenuItemCard from "./MenuItemCard.jsx";
import { useCart } from "../hooks/useCart.js";
import "../index.css";

function MenuList({ items }) {
  const { addToCart, favourites, toggleFavourite } = useCart();

  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);

  const visibleItems = showFavouritesOnly
    ? items.filter((item) => favourites.includes(item.id))
    : items;

  return (
    <>
      <div className="favourite-filter">
        <label>
          <input
            type="checkbox"
            checked={showFavouritesOnly}
            onChange={(e) => setShowFavouritesOnly(e.target.checked)}
          />
          Favourites Only ❤️
        </label>
      </div>

      {visibleItems.length === 0 ? (
        <p className="muted">
          {showFavouritesOnly
            ? "No favourite items yet."
            : "No items on this menu yet."}
        </p>
      ) : (
        <div className="grid">
          {visibleItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onAdd={addToCart}
              isFavourite={favourites.includes(item.id)}
              onToggleFavourite={toggleFavourite}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default MenuList;
