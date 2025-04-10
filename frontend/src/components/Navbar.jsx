import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { pathname } = useLocation();
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Jobs", path: "/job" },
    { label: "Candidates", path: "/candidate" },
    { label: "Appointments", path: "/appointment" },
    { label: "Conversations", path: "/conversation" },
  ];

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">Interactly</h1>
      <div className="flex gap-6">
        {navItems.map(({ label, path }) => (
          <Link
            key={path}
            to={path}
            className={`text-gray-700 hover:text-blue-600 ${
              pathname === path ? "font-semibold underline" : ""
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
