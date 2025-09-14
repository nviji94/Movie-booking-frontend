import { ReactNode } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import NavigationTabs from "./NavigationTabs";
import Footer from "./Footer";

interface Props {
  children: ReactNode;
  role: string | null;
  token: string | null;
  setToken: (val: string | null) => void;
  setRole: (val: string | null) => void;
}

export default function Layout({
  children,
  role,
  token,
  setToken,
  setRole,
}: Props) {
  const location = useLocation();
  const params = useParams(); // for dynamic routes like /book/:id

  let title = "My Movie Booking App";
  let description = "Book movies online easily.";

  switch (location.pathname) {
    case "/movies":
      title = "Movies | My Movie Booking App";
      description = "Browse all movies currently available for booking.";
      break;
    case "/my-bookings":
      title = "My Bookings | My Movie Booking App";
      description =
        "View your booked movies, theater, showtime, seats, and duration.";
      break;
    case "/contact":
      title = "Contact | My Movie Booking App";
      description = "Get in touch with our team for support and queries.";
      break;
    case "/about":
      title = "About Us | My Movie Booking App";
      description = "Learn more about our movie booking platform.";
      break;
    default:
      if (location.pathname.startsWith("/book/") && params.id) {
        title = `Booking ${params.id} | My Movie Booking App`;
        description = `Select seats and showtime for movie ID ${params.id}.`;
      }
      break;
  }

  const hideLayoutRoutes = ["/login", "/register"];
  const hideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {!hideLayout && token && (
        <NavigationTabs setToken={setToken} setRole={setRole} role={role} />
      )}

      <main className="flex-1">{children}</main>

      {!hideLayout && token && <Footer />}
    </div>
  );
}
