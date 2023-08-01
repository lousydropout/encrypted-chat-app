import { A } from "@solidjs/router";
import { logUserOut } from "../store/user";

// navs
const top_navs = [
  { name: "Home", route: "/", click: null },
  { name: "Sign In", route: "/sign-in", click: null },
  { name: "Sign Up", route: "/sign-up", click: null },
];
const bottom_navs = [
  {
    name: "Logout",
    route: "/",
    click: () => logUserOut(),
  },
];

// Nav group
const NavGroup = (props) => (
  <section class="">
    <For each={props.nav_items}>
      {(page) => (
        <A
          href={page.route}
          class="flex items-center justify-start px-4 py-4 hover:bg-zinc-600"
          onClick={page.click}
        >
          <div>{page.name}</div>
        </A>
      )}
    </For>
  </section>
);

export default function () {
  return (
    <>
      <NavGroup nav_items={top_navs} />
      <NavGroup nav_items={bottom_navs} />
    </>
  );
}
