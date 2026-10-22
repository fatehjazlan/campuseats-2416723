import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import VendorCard from "./components/VendorCard.jsx";
import MenuList from "./components/MenuList.jsx";
import CartPage from "./components/CartPage.jsx";
import Footer from "./components/Footer.jsx";
import { Loading, ErrorMessage } from "./components/Status.jsx";

function App() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState("menu");
  const [lastOrder, setLastOrder] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);

  // Load vendors from the mock API
  useEffect(() => {
    const controller = new AbortController();

    async function loadVendors() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/vendors.json", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setVendors(data);
        setSelectedVendorId((current) => current ?? data[0]?.id);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadVendors();

    return () => controller.abort();
  }, [reloadKey]);

  const selectedVendor = vendors.find(
    (vendor) => vendor.id === selectedVendorId,
  );

  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0);

  function handleAdd(item) {
    setCart((current) => {
      const existing = current.find((line) => line.item.id === item.id);

      if (existing) {
        return current.map((line) =>
          line.item.id === item.id ? { ...line, qty: line.qty + 1 } : line,
        );
      }

      return [...current, { item, qty: 1 }];
    });
  }

  function handleChangeQty(itemId, delta) {
    setCart((current) =>
      current
        .map((line) =>
          line.item.id === itemId ? { ...line, qty: line.qty + delta } : line,
        )
        .filter((line) => line.qty > 0),
    );
  }

  function handleRemove(itemId) {
    setCart((current) => current.filter((line) => line.item.id !== itemId));
  }

  function handlePlaceOrder(details) {
    const total = cart.reduce(
      (sum, line) => sum + line.item.price * line.qty,
      0,
    );

    setLastOrder({ ...details, total });
    setCart([]);
    setView("done");
  }
  function handleToggleFavourite(itemId) {
    setFavourites((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  }
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
        <h2>Order placed!</h2>
        <p>Name: {lastOrder?.name}</p>
        <p>Mahallah: {lastOrder?.mahallah}</p>
        <p>Pickup time: {lastOrder?.pickupTime}</p>
        <p>Total: RM {lastOrder?.total.toFixed(2)}</p>
        <button className="btn" onClick={() => setView("menu")}>
          Back to menu
        </button>
      </section>
    );
  } else if (loading) {
    content = <Loading />;
  } else if (error) {
    content = (
      <ErrorMessage
        message={error}
        onRetry={() => setReloadKey((key) => key + 1)}
      />
    );
  } else if (!selectedVendor) {
    content = <p>No vendors available.</p>;
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
