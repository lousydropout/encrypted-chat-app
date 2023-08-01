import { Routes, Route } from "@solidjs/router";
import Home from "./Home";
import SignupComponent from "./Signup";
import SigninComponent from "./Signin";

function App() {
  return (
    <Routes>
      <Route path="/" component={Home}></Route>
      <Route path="/sign-in" component={SigninComponent}></Route>
      <Route path="/sign-up" component={SignupComponent}></Route>
    </Routes>
  );
}

export default App;
