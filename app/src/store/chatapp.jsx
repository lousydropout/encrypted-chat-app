import { createStore } from "solid-js/store";
const [chatLogs, setChatLogs] = createStore([]);
const [chatMessages, setChatMessages] = createStore([]);
const [registry, setRegistry] = createStore([]);

export {
  chatLogs,
  setChatLogs,
  chatMessages,
  setChatMessages,
  registry,
  setRegistry,
};
