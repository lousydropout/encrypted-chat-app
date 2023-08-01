import { showLogin } from "../store/showLogin";
import Signin from "./Signin";
import Signup from "./Signup";

const Login = () => {
  return (
    <div class="h-full login-background flex justify-center">
      <h1>Sign in</h1>
      <Signin />
    </div>
  );
};

export default Login;
