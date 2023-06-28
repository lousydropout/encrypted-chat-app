import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Encrypted } from "../target/types/encrypted";

describe("encrypted", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Encrypted as Program<Encrypted>;

  it("Is initialized!", async () => {
    // Add your test here.
  });
});
