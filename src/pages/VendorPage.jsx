import { Link, useParams } from "react-router";
import { useVendor } from "../hooks/useVendor.js";
import MenuList from "../components/MenuList.jsx";
import { Loading, ErrorMessage } from "../components/Status.jsx";

function VendorPage() {
  const { id } = useParams();
  const { vendor, menu, loading, error } = useVendor(id);

  if (loading) return <Loading />;

  if (error) {
    return (
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    );
  }

  if (!vendor) {
    return (
      <p>
        Vendor not found. <Link to="/">Back to vendors</Link>
      </p>
    );
  }

  // Each menu item keeps its vendor information
  const items = menu.map((item) => ({
    ...item,
    vendorName: vendor.name,
  }));

  return (
    <section>
      <p>
        <Link to="/">← All vendors</Link>
      </p>

      <h2 className="section-title">{vendor.name}</h2>

      <p className="muted">
        {vendor.location} · {vendor.openHours}
      </p>

      <MenuList items={items} />
    </section>
  );
}

export default VendorPage;
