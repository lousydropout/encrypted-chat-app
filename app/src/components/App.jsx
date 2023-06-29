import { ChatApp } from "./ChatApp";
import {
  fetchRegistryAccounts,
  fetchChatLogs,
  fetchChatLogsByOwner,
  initializeChat,
  sendMessage,
} from "../helpers/encryptedChatApp";

const App = async () => {
  const registry = await fetchRegistryAccounts();
  console.log("registry: ", registry);
  // const chatlogs = await initializeChat("test2", "abc");
  const chatlogs = await fetchChatLogsByOwner("test2");
  console.log("chatlogs: ", chatlogs);

  // send message
  const messageResult = await sendMessage(
    "abc",
    "test2",
    new Date().toUTCString(),
    "yo. this is a test message."
  );
  console.log("messageResult: ", messageResult);

  return (
    <div class="md:grid md:grid-cols-[30%_1fr] w-full h-full rounded-xl bg-zinc-700 overflow-hidden">
      <div class="bg-zinc-600 opacity-[15%]"></div>
      <div></div>
    </div>
  );
};

export default App;
