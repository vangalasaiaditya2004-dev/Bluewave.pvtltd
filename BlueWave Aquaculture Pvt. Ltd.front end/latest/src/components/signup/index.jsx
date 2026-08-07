import "./index.css";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1>BlueWave Optimizer</h1>
        <h2>BlueWave Aquaculture Pvt. Ltd.</h2>

        <p>
          Create your account to manage fisheries inventory and procurement
          operations.
        </p>

        <form className="signup-form">
          <input type="text" placeholder="Full Name" />

          <input type="email" placeholder="Email Address" />

          <input type="password" placeholder="Password" />

          <input type="password" placeholder="Confirm Password" />

          <select>
            <option value="">Select Role</option>
            <option value="Procurement Manager">
              Procurement Manager
            </option>
            <option value="Inventory Planner">
              Inventory Planner
            </option>
            <option value="Warehouse User">
              Warehouse User
            </option>
            <option value="Supplier">
              Supplier
            </option>
            <option value="Finance Reviewer">
              Finance Reviewer
            </option>
            <option value="User">User</option>
          </select>

          <button type="submit">Create Account</button>
        </form>

        <h3>
          Already have an account? <Link to="/login">Login</Link>
        </h3>
      </div>
    </div>
  );
};

export default Signup;