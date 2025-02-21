import { Link } from "react-router-dom";
import logo from "../../Assets/Logo/Logo.jpg";
import { useAuth } from "react-oidc-context";
import { BsSun, BsMoon } from "react-icons/bs";
import { useState, useEffect } from "react";

const Header = () => {
  const auth = useAuth();

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  const signoutRedirect = () => {
    const clientId = "6c1sk5bjlf8ritr0vmkec9f2eq";
    const logoutUri = "https://main.deealfgqu77r6.amplifyapp.com";
    const cognitoDomain =
      "https://ap-south-1jly2yib3q.auth.ap-south-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
    auth.removeUser();
  };

  useEffect(() => {
    document.body.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    auth.signinSilent().catch(() => {
      console.log("User session expired or not found.");
    });
  }, [auth]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const isAdmin = auth.user?.profile?.["cognito:groups"]?.includes("Admin");

  return (
    <header className="fixed-dark-header text-white pt-0">
      <div className="container-fluid">
        <div className="row align-items-center w-100">
          {/* Logo Section */}
          <div className="col-auto p-0">
            <img
              src={logo}
              alt="Logo"
              className="rounded-circle"
              style={{ height: "50px", objectFit: "contain" }}
            />
          </div>

          {/* Title Section */}
          <div className="col text-center">
            <h1>MyStreetPets</h1>
          </div>

          {/* Authentication & Theme Toggle Section */}
          <div className="col-auto ml-auto d-flex align-items-center">
            {/* Dark Mode Toggle Button */}
            <button
              className="btn btn-outline-light me-2"
              onClick={toggleTheme}
            >
              {theme === "light" ? <BsSun /> : <BsMoon />}
            </button>

            {auth.isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {auth.user?.profile?.nickname || "User"}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userDropdown"
                >
                  {isAdmin && (
                    <li>
                      <button
                        className="dropdown-item"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
                      >
                        Add Animal
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <Link
                            className="dropdown-item"
                            to="/upload-street-animal"
                          >
                            Street Animal
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            to="/upload-adoption-animal"
                          >
                            Adoption Animal
                          </Link>
                        </li>
                      </ul>
                    </li>
                  )}
                  <li>
                    <button className="dropdown-item" onClick={signoutRedirect}>
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <button
                className="btn btn-outline-light"
                onClick={auth.signinRedirect}
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Navigation Section */}
        <div className="row">
          <div className="col-12">
            <nav className="navbar navbar-expand-lg navbar-dark">
              {/* Home Option */}
              <ul className="navbar-nav me-auto align-items-end">
                <li className="nav-item">
                  <Link className="nav-link text-white fw-bold fs-4" to="/">
                    Home
                  </Link>
                </li>
              </ul>

              {/* Burger Menu */}
              <button
                className="navbar-toggler ms-auto"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarContent"
                aria-controls="navbarContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse justify-content-end"
                id="navbarContent"
              >
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/street-animals">
                      Street Animals
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link text-white"
                      to="/adoption-animals"
                    >
                      Adoption
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
