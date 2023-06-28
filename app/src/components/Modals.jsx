import { onCleanup } from "solid-js";

const clickOutside = (el, accessor) => {
  const onClick = (e) => !el.contains(e.target) && accessor()?.();
  document.body.addEventListener("click", onClick);

  onCleanup(() => document.body.removeEventListener("click", onClick));
};

const Loading = () => <h1>Loading...</h1>;

export { Loading, clickOutside };
