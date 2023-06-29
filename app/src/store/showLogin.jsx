import { createSignal } from "solid-js";
const [showLogin, setShowLogin] = createSignal(true);

const toggleShowLogin = () => {
  setShowLogin((prev) => !prev);
};

export { showLogin, toggleShowLogin };
