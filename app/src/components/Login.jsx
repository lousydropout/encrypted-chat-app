import { showLogin } from "../store/showLogin";
import Signin from "./Signin";
import Signup from "./Signup";
// import { grabfromCache } from "../store/user";

const Login = () => {
  // grabfromCache();

  return (
    <div class="h-full login-background overflow-y-auto">
      <div class="flex justify-center my-2 sm:my-8 md:mt-24">
        <Show when={showLogin()} fallback={Signup}>
          <Signin />
        </Show>
      </div>
    </div>
  );
};

export default Login;
