import { ReactNode, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ApiClient, { User } from "../api";
import toast from "react-hot-toast";

const apiClient = new ApiClient();

interface BaseLayoutProps {
  children: ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(stored));
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await apiClient.logout();
    } catch {
      // even if the API fails, clear local state
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out");
    navigate("/login");
  };

  const isCitizen = user?.role === "citizen";
  const isPoliceOrAdmin = user?.role === "police" || user?.role === "admin";

  return (
    <div className="layout">
      <header className="d-flex align-items-center my-1 bg-light navbar-mx">
        <h3 className="d-flex align-items-center gap-2 mb-0">
          <Link className="text-decoration-none text-dark d-flex align-items-center gap-2" to="/dashboard" style={{ transition: 'transform 0.2s' }} onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')} onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
            LawConnect
            <img src="/logo.jpeg" alt="LawConnect Logo" style={{ height: 36 }} />
          </Link>
        </h3>
        <div className="flex-grow-1"></div>
        <nav>
          <ul className="nav align-items-center">
            {isCitizen && (
              <>
                <li className="nav-item">
                  <Button variant="outline-secondary" className="me-2" onClick={() => navigate("/my-reports")}>
                    My Reports
                  </Button>
                </li>
                <li className="nav-item">
                  <Button variant="danger" className="me-2 text-white" onClick={() => navigate("/report-crime")}>
                    Report Crime
                  </Button>
                </li>
              </>
            )}
            {isPoliceOrAdmin && (
              <li className="nav-item">
                <Button variant="outline-secondary" className="me-2" onClick={() => navigate("/reports")}>
                  All Reports
                </Button>
              </li>
            )}
            <li className="nav-item">
              <Button variant="outline-dark" onClick={handleLogout}>
                Logout
              </Button>
            </li>
          </ul>
        </nav>
      </header>
      <main id="content">{children}</main>
    </div>
  );
};

export default BaseLayout;
