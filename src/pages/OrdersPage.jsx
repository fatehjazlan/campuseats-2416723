import { useCart } from "../hooks/useCart.js";

function OrdersPage() {
  const { orders } = useCart();

  return (
    <section>
      <h2 className="section-title">My Orders</h2>

      {orders.length === 0 ? (
        <p className="muted">No orders yet.</p>
      ) : (
        [...orders].reverse().map((order, index) => (
          <div className="card" key={index}>
            <h3>Order #{index + 1}</h3>

            <p>Name: {order.name}</p>
            <p>Mahallah: {order.mahallah}</p>
            <p>Pickup Time: {order.pickupTime}</p>

            <h4>Items:</h4>

            {order.items.map((line) => (
              <p key={line.item.id}>
                {line.item.name} × {line.qty}
              </p>
            ))}

            <strong>Total: RM {order.total.toFixed(2)}</strong>
          </div>
        ))
      )}
    </section>
  );
}

export default OrdersPage;
