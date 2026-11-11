import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import "../index.css";

function MenuItemCard({ item, onAdd, isFavourite, onToggleFavourite }) {
  const { user } = useAuth();

  return (
    <article className="card menu-card">
      <div className="thumb" aria-hidden="true">
        {item.name.charAt(0)}
      </div>

      <p className="tag">{item.category}</p>
      <h3>{item.name}</h3>
      <p className="muted">{item.description}</p>
      <p className="price">RM {item.price.toFixed(2)}</p>

      {user ? (
        <button
          type="button"
          className="btn"
          onClick={() => onToggleFavourite(item.id)}
        >
          {isFavourite ? "♥ Favourite" : "♡ Add to Favourite"}
        </button>
      ) : (
        <p className="muted">
          <Link to="/login">Log in to save favourites</Link>
        </p>
      )}

      <button
        type="button"
        className="btn"
        disabled={!item.available}
        onClick={() => onAdd(item)}
      >
        {item.available ? "Add to cart" : "Sold out"}
      </button>
    </article>
  );
}

export default MenuItemCard;
