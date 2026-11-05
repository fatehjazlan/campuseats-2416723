import { Link } from "react-router";

function NotFoundPage() {
  return (
    <section>
      <h2 className="section-title">404 - Page Not Found</h2>
      <p className="muted">
        Sorry, the page you are looking for does not exist.
      </p>

      <Link to="/" className="link">
        Back to Home
      </Link>
    </section>
  );
}

export default NotFoundPage;
