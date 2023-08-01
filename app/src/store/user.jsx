import { createSignal } from "solid-js";
// import { DOMAIN } from "../params/params";

const KEY = `KEYUser`;
const LOGGED_OUT = {
  loggedIn: false,
  username: null,
  decryptionKey: null,
  encryptionKey: null,
};

const [user, setUser] = createSignal(LOGGED_OUT);

const grabfromCache = () => {
  const cache = localStorage.getItem(KEY);

  if (cache && !user().loggedIn) {
    const x = JSON.parse(cache);
    setUser(x);
    return true;
  }
  return cache !== null;
};

const updateUser = (val) => {
  localStorage.setItem(KEY, JSON.stringify(val));
  setUser(val); // do this after storing in localStorage
};

const logUserOut = () => {
  setUser(LOGGED_OUT);
  localStorage.removeItem(KEY);
};

export { user, grabfromCache, updateUser, logUserOut };
