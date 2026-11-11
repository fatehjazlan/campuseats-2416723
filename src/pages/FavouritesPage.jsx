import { Link } from "react-router";
import { useCart } from "../hooks/useCart.js";
import { useAuth } from "../hooks/useAuth.js";
import { useVendors } from "../hooks/useVendors.js";
import MenuItemCard from "../components/MenuItemCard.jsx";
import { Loading, ErrorMessage } from "../components/Status.jsx";

function FavouritesPage() {
  const { user } = useAuth();
  const { favourites, toggleFavourite, addToCart } = useCart();
  const { vendors, loading, error, reload } = useVendors();

  if (!user) {
    return (
      <section>
        <h2 className="section-title">My Favourite Items ❤️</h2>
        <p className="muted">Log in to save and view your favourite items.</p>
        <Link to="/login">Log in</Link>
      </section>
    );
  }

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  const allItems = vendors.flatMap((vendor) => vendor.menu || []);

  const favouriteItems = allItems.filter((item) =>
    favourites.includes(item.id),
  );

  return (
    <section>
      <h2 className="section-title">My Favourite Items ❤️</h2>

      {favouriteItems.length === 0 ? (
        <p className="muted">No favourite items yet.</p>
      ) : (
        <div className="grid">
          {favouriteItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onAdd={addToCart}
              isFavourite={true}
              onToggleFavourite={toggleFavourite}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default FavouritesPage;
