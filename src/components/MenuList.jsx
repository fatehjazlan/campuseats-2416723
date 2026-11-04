import MenuItemCard from "./MenuItemCard.jsx";
import "../index.css";

function MenuList({
  items,
  onAdd,
  favourites,
  onToggleFavourite,
  showFavouritesOnly,
  onShowFavouritesOnlyChange,
}) {
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
            onChange={(e) => onShowFavouritesOnlyChange(e.target.checked)}
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
              onAdd={onAdd}
              isFavourite={favourites.includes(item.id)}
              onToggleFavourite={onToggleFavourite}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default MenuList;
