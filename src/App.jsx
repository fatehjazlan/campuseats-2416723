import { useEffect, useState } from "react";

import Header from "./components/Header.jsx";
import VendorCard from "./components/VendorCard.jsx";
import MenuList from "./components/MenuList.jsx";
import CartPage from "./components/CartPage.jsx";
import Footer from "./components/Footer.jsx";
import { Loading, ErrorMessage } from "./components/Status.jsx";

function App() {
  // B2: Fetched data
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // B3: Cart and selected vendor
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState("menu");

  // B5: Last order
  const [lastOrder, setLastOrder] = useState(null);

  // B6: Favourite items (matric digit 3)
  const [favourites, setFavourites] = useState([]);
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);

  // B2: Fetch vendors
  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetch("/api/vendors.json", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setVendors(data);
        setSelectedVendorId((current) => current ?? data[0]?.id ?? null);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [reloadKey]);

  // Find selected vendor
  const selectedVendor = vendors.find(
    (vendor) => vendor.id === selectedVendorId,
  );

  // B3: Cart badge shows total quantity
  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0);

  // B3: Add item to cart
  function handleAdd(item) {
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

  // B3: Change item quantity
  function handleChangeQty(itemId, delta) {
    setCart((prev) =>
      prev
        .map((line) =>
          line.item.id === itemId ? { ...line, qty: line.qty + delta } : line,
        )
        .filter((line) => line.qty > 0),
    );
  }

  // B3: Remove item
  function handleRemove(itemId) {
    setCart((prev) => prev.filter((line) => line.item.id !== itemId));
  }

  // B5: Place order
  function handlePlaceOrder(details) {
    const total = cart.reduce(
      (sum, line) => sum + line.item.price * line.qty,
      0,
    );

    setLastOrder({ ...details, total });
    setCart([]);
    setView("done");
  }

  // B6: Toggle favourite item
  function handleToggleFavourite(itemId) {
    setFavourites((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  }

  // Choose what to show from the view state
  let content;

  if (view === "cart") {
    content = (
      <CartPage
        cart={cart}
        onChangeQty={handleChangeQty}
        onRemove={handleRemove}
        onPlaceOrder={handlePlaceOrder}
      />
    );
  } else if (view === "done") {
    content = (
      <section className="card">
        <h2>Order placed.</h2>
        {lastOrder && (
          <>
            <p>Name: {lastOrder.name}</p>
            <p>Mahallah: {lastOrder.mahallah}</p>
            <p>Pickup time: {lastOrder.pickupTime}</p>
            <p>Total: RM {lastOrder.total.toFixed(2)}</p>
          </>
        )}
      </section>
    );
  } else if (loading) {
    content = <Loading />;
  } else if (error) {
    content = (
      <ErrorMessage
        message={error}
        onRetry={() => setReloadKey((k) => k + 1)}
      />
    );
  } else {
    content = (
      <>
        <section>
          <h2 className="section-title">Choose a vendor</h2>

          <div className="vendor-grid">
            {vendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                isSelected={vendor.id === selectedVendorId}
                onSelect={setSelectedVendorId}
              />
            ))}
          </div>
        </section>

        {selectedVendor && (
          <section>
            <h2 className="section-title">Menu: {selectedVendor.name}</h2>

            <MenuList
              items={selectedVendor.menu}
              onAdd={handleAdd}
              favourites={favourites}
              onToggleFavourite={handleToggleFavourite}
              showFavouritesOnly={showFavouritesOnly}
              onShowFavouritesOnlyChange={setShowFavouritesOnly}
            />
          </section>
        )}

        {vendors.length === 0 && <p className="muted">No vendors available.</p>}
      </>
    );
  }

  return (
    <>
      <Header
        cartCount={cartCount}
        onShowMenu={() => setView("menu")}
        onShowCart={() => setView("cart")}
      />

      <main className="container">{content}</main>

      <Footer />
    </>
  );
}

export default App;
