import "../Global.css";
// import logo from "../assets/Logo1.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <nav className="navbar transparent scrolled">
        <div className="logo">
          {/* <img src={logo} alt="" /> */}
          <h5>
            <pre>
              Waste<br />
              2<br />
              Worth
            </pre>
          </h5>
        </div>
        <div className="nav-links">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/store">Store</Link></li>
            <li><Link to="/userdash">User Panel</Link></li>
          </ul>
        </div>
        <div className="nav-buttons">
          <Link to="/login">
            <button className="nav-btn">Login</button>
          </Link>
          <Link to="/register">
            <button className="nav-btn">Register</button>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
