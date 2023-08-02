# Encrypted

An ecrypted chat app built on Solana.

## How it works

Since all data on a public blockchain such as Solana are by nature public, it is not possible to have a smart contract (or program) do the encryption for us. Instead, we opt to have the encryption and decryption process done on the client-side.

Each user, upon creation, has a `RegistryAccount` as defined below.

```rust
#[account]
pub struct RegistryAccount {
    pub username: String,
    pub messaging_pubkey: String,
    pub pubkey: Pubkey,
}
```

Note that `username` is any string that a user wants to go by (since one's pubkey is not very memorable). The `pubkey` refers to the user's Solana public key and `messaging_pubkey` refers to the user's encryption public key.

So, now if `Alice` wants to send `Bob` an encrypted message, she can encrypt the message with `Bob`'s `messaging_pubkey`. `Bob`, upon receiving the encrypted message, can decrypt it using his `secret key`. So long as this is done off-chain in a protected environment, the message remains safe from the eyes of interlopers.

Further, by having message senders also need to send a copy of the encrypted message (using their own `messaging_pubkey`) to themselves, they will be able to only read past conversations without having to wonder about the context.

Lastly, one might wonder "But, now I have to personally guard and remember my encryption `secret key`." To which, the answer is... sort of. In `Encrypted`, we take advantage of web browsers' password managers to store the `secret key`. We believe one's `secret key` is essentially one's `password` since, without which, no message can be decrypted.

(A consequence of this design choice is that the `Brave` and `Chrome` web browsers are incompatible with `Encrypted` as of this writing. `Brave` and `Chrome`'s password managers apparently truncates any password past a certain length. And, without warning! `Firefox` is currently the only web browser that is compatible with `Encrypted`.)

## Why use asymmetric encryption instead of symmetric encryption?

Some might ask, why use `asymmetric encryption` instead of `symmetric encryption` for the encrypting and decrypting of messages. The answer is that `symmetric encryption` provides no disincentive for a person to leak the symmetric key to a conversation. `Asymmetric encryption`, on the other hand, does.

For example, suppose `Alice` and `Bob` have been friends for a long time. As friends, `Alice` sometimes share personally details that she would hesitate telling anyone else. One day, they got into an argument, during which `Alice` criticizes `Bob`. Although `Alice` regrets her action, `Bob` is mad and comtemplates getting even.

If the messages were encrypted with a `symmetric key`, then `Bob` might, at the spur of the moment, release the `symmetric encryption key` to his and `Alice`'s conversations, allowing others to see their past conversations, including any and all embarrassing details that `Alice` shared in private. Although `Bob` also risk embarrassing himself by doing this, this conversation being made public is all `Bob` risks.

Instead, suppose their conversation had been encrypted using `asymmetric encryption`. Then, the only way for `Bob` credibly (i.e., instead of it being a he-said-she-said situation) to air his and `Alice`'s private conversation is to release his personal `secret key`. This, however, would not only allow people to read the conversation he and `Alice` shared, but also any conversation that he shared with anyone else while using that `public-key-secret-key pair`.

As such, we made the choice of encrypting messages using `asymmetric encryption` despite that most messaging apps encrypt using `symmetric encryption` (assuming they encrypt their users' messages at all).

## Running the frontend locally

To run the frontend and interact with `Encrypted`, enter the following commands on a terminal.

```bash
$ cd app/
$ pnpm install
$ pnpm run dev
```

Then, open the link using `Firefox` (other browers's password managers are incompatible) as provided by the above commands. Typically, this would be `http://localhost:3000`.

## Shortcomings and lessons learned

There are a number of shortcomings with our design choices. Some are due to intentional choices; others, unintended.

### Using asymmetric encryption

Although we remain resolute in our belief that `asymmetric encryption` was the correct choice, said choice is not without consequences. One such consequence is that messages have a size limit. With our choice of `asymmetric encryption` for `Encrypted`, the current size limit is approximately `120` characters.

### Storing both sides of a conversation in the same chain

One such choice has to do with how the `seeds` design. We opted to have both sides of a conversation in the same chain of `PDA`s with an index denoting the message index. This turned out to be a mistake since the two participants in a conversation might attempt to send a message at around the same time and so use the same index. As a result, one of the participant will have his or her message "interrupted," and the message will not be heard/read.

Instead, we now believe a better choice is to store the two parties' messages separately and then have the frontend sort them before showing them to the user. This would allow both party to send messages without worrying that the other party's about to send a message as well.

### Using usernames instead of pubkeys in PDA `seeds`

We also opted to have `PDA`s `seeds` utilize the users' usernames. We thought this would add to the usability, but the opposite turned out to be true. Whereas the Solana javascript SDK provides means to query all `PDA`s with the same "prefix," we have thusfar been unable to make use of this important feature.

Our assumption is that using usernames (`Strings`), which are of variable length, is a no-go. Our queries have always ended up returning all messages in the `PDA` instead, a very inefficient process because the frontend now has to filter through a bunch of irrelevant messages for the few that are relevant.

Further, this has the unfortunate consequence that, with each additional message sent using `Encrypted`, the amount of work needed for the frontend to receive **any** message also increases. We should have used the `pubkeys` in the `PDA seeds` instead.

## `Encrypted`'s smart contract

Despite the shortcomings, we are proud of how simple the smart contract for `Encrypted` is (since much of the work takes place off-chain) and so will include here in this readme as well.

If you wanna see the `PDA` and `account` definitions as well, they are included in the `Accounts.md` file (it's also not long).

```rust
#[program]
mod encrypted {
    use super::*;

    pub fn register(
        ctx: Context<Register>,
        username: String,
        messaging_pubkey: String,
    ) -> Result<()> {
        let registry = &mut ctx.accounts.registry_account;

        registry.username = username;
        registry.messaging_pubkey = messaging_pubkey;
        registry.pubkey = ctx.accounts.signer.key();

        Ok(())
    }

    pub fn init_chat(ctx: Context<InitChat>, alice: String, bob: String) -> Result<()> {
        let alice_chat_account = &mut ctx.accounts.alice_chat_account;
        let bob_chat_account = &mut ctx.accounts.bob_chat_account;

        alice_chat_account.idx = 0;
        bob_chat_account.idx = 0;

        alice_chat_account.owner = alice.clone();
        alice_chat_account.chatting_with = bob.clone();

        bob_chat_account.owner = bob;
        bob_chat_account.chatting_with = alice;

        Ok(())
    }

    pub fn send_message(
        ctx: Context<SendMessage>,
        alice: String,
        bob: String,
        timestamp: String,
        message_encrypted_for_alice: String,
        message_encrypted_for_bob: String,
    ) -> Result<()> {
        let alice_message_account = &mut ctx.accounts.alice_message_account;
        alice_message_account.author = alice.clone();
        alice_message_account.timestamp = timestamp.clone();
        alice_message_account.encrypted_message = message_encrypted_for_alice;

        let bob_message_account = &mut ctx.accounts.bob_message_account;
        bob_message_account.author = alice.clone();
        bob_message_account.timestamp = timestamp;
        bob_message_account.encrypted_message = message_encrypted_for_bob;

        let alice_chat_account = &mut ctx.accounts.alice_chat_account;
        alice_chat_account.idx = alice_chat_account.idx.checked_add(1).unwrap();

        let bob_chat_account = &mut ctx.accounts.bob_chat_account;
        bob_chat_account.idx = bob_chat_account.idx.checked_add(1).unwrap();

        Ok(())
    }
}
```

Note that certain checks have been removed due to, again, certain design choices whose consequences we only realized much later.
