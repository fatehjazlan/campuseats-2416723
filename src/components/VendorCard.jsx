function VendorCard() {
  const name = "Cafe Faruq";
  const location = "Mahallah Faruq IIUM Gombak";
  const openHours = "7 AM - 10 PM";
  const isOpen = true;

  return (
    <div className="thumb">
      {name[0]}
      <h2>{name}</h2>
      <p>{location}</p>
      <p>{openHours}</p>

      <span className={isOpen ? "status open" : "status closed"}>
        {isOpen ? "Open now" : "Closed"}
      </span>
    </div>
  );
}
export default VendorCard;
