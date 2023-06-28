import { balance, getBalance } from "../utils";

const Balance = () => (
  <div class="flex justify-between items-center">
    <h2 class=" text-xl">Balance: {balance() ? `${balance()} SOL` : ""}</h2>
    <button class="px-4 py-3 border-2 rounded-lg" onClick={getBalance}>
      Get balance
    </button>
  </div>
);

export { Balance };
