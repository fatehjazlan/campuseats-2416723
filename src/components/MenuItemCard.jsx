function MenuItemCard() {
  const name = "Nasi Ayam Gepuk";
  const description = "Makanan berasal daripada Indonesia";
  const price = 6.0;
  const available = true;

  return (
    <div clasName="menu-item-card">
      <h3>{name}</h3>
      <p>{description}</p>
      <p>RM {price.toFixed(2)}</p>
      <button disabled={!available}>
        {available ? "add to cart" : "sold Out"}
      </button>
    </div>
  );
}
export default MenuItemCard;
