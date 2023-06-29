import { showLogin } from "../store/showLogin";
import Signin from "./Signin";
import Signup from "./Signup";

const Login = () => {
  return (
    <div class="h-full login-background">
      <div class="flex justify-center ">
        <Show when={showLogin()} fallback={Signup}>
          <Signin />
        </Show>
      </div>
    </div>
  );
};

export default Login;
