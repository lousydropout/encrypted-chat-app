import { createSignal } from "solid-js";
const [hasLoggedIn, setHasLoggedIn] = createSignal(false);

const toggleHasLoggedIn = () => {
  setHasLoggedIn((prev) => !prev);
};

export { hasLoggedIn, toggleHasLoggedIn };
