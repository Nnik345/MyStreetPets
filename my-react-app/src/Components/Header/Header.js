import { Link } from "react-router-dom";
import logo from "../../Assets/Logo/Logo.jpg";
import { useAuth } from "react-oidc-context";

const Header = () => {
  const auth = useAuth();

  const signoutRedirect = () => {
    const clientId = "6c1sk5bjlf8ritr0vmkec9f2eq";
    const logoutUri = "https://main.deealfgqu77r6.amplifyapp.com";
    const cognitoDomain = "https://ap-south-1jly2yib3q.auth.ap-south-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    auth.removeUser();
  };

  return (
    <header className="bg-dark text-white pt-0">
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
            <h1>My Street Pets</h1>
          </div>

          {/* Authentication Section */}
          <div className="col-auto ml-auto">
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
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
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
            <nav>
              <ul className="nav d-flex justify-content-between">
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">About</a>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/street-animals">Street Animals</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/adoption-animals">Adoption</Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">Contact</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;