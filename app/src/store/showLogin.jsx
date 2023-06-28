import { createSignal } from "solid-js";
const [showLogin, setShowLogin] = createSignal(false);

const toggleShowLogin = () => {
  setShowLogin((prev) => !prev);
};

export { showLogin, toggleShowLogin };
