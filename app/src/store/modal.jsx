import { createSignal } from "solid-js";

const modalNull = { visible: false, content: null, states: [] };

const [modal, setModal] = createSignal(modalNull);

export { modalNull, modal, setModal };
