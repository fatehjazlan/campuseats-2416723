import MenuItemCard from "./MenuItemCard.jsx";

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
      <button
        type="button"
        onClick={() => onShowFavouritesOnlyChange(!showFavouritesOnly)}
      >
        {showFavouritesOnly ? "Show All Items" : "Favourites Only"}
      </button>

      {visibleItems.length === 0 ? (
        <p className="muted">No items to display.</p>
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
