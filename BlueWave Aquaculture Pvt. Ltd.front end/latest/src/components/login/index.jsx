import "./index.css";
import { Link } from "react-router-dom";
const Login = () => {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>BlueWave Optimizer</h1>
        <h2>BlueWave Aquaculture Pvt. Ltd.</h2> 
        <form className="login-form">
          <input type="email" placeholder="Email Address" />
          <input type="password" placeholder="Password" />
          <button type="submit">Login</button>
        </form>
        <h3>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </h3>
        </div>
    </div>
  );
}
export default Login;    