import { Routes, Route } from "@solidjs/router";
import Chat from "./Chat";
import SignupComponent from "./Signup";
import SigninComponent from "./Signin";

function App() {
  return (
    <Routes>
      <Route path="/" component={SigninComponent}></Route>
      <Route path="/chat" component={Chat}></Route>
      <Route path="/sign-in" component={SigninComponent}></Route>
      <Route path="/sign-up" component={SignupComponent}></Route>
    </Routes>
  );
}

export default App;
