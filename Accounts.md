# `Encrypted`'s account and PDA definitions

### Account definitions

```rust
#[account]
pub struct RegistryAccount {
    pub username: String,
    pub messaging_pubkey: String,
    pub pubkey: Pubkey,
}

#[account]
pub struct MessageAccount {
    pub author: String,
    pub timestamp: String,
    pub encrypted_message: String,
}

#[account]
pub struct ChatAccount {
    pub owner: String,
    pub chatting_with: String,
    pub idx: u64,
}
```

### PDA definitions

```rust
#[derive(Accounts)]
#[instruction(username: String)]
pub struct Register<'info> {
    #[account(
        init,
        payer = signer,
        space = 8 + 4 * 216 + std::mem::size_of::<RegistryAccount>(),
        seeds = [b"registry", username.as_bytes()],
        bump,
    )]
    pub registry_account: Account<'info, RegistryAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(alice: String, bob: String)]
pub struct InitChat<'info> {
    #[account(
        init,
        payer = signer,
        space = 8 + 4 * 40 + std::mem::size_of::<ChatAccount>(),
        seeds = [b"chat", alice.as_bytes(), bob.as_bytes()],
        bump,
    )]
    pub alice_chat_account: Account<'info, ChatAccount>,

    #[account(
        init,
        payer = signer,
        space = 8 + 4 * 40 + std::mem::size_of::<ChatAccount>(),
        seeds = [b"chat", bob.as_bytes(), alice.as_bytes()],
        bump,
    )]
    pub bob_chat_account: Account<'info, ChatAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(alice: String, bob: String)]
pub struct SendMessage<'info> {
    #[account(
        mut,
        seeds = [b"registry", alice.as_bytes()],
        bump,
    )]
    pub registry_account: Account<'info, RegistryAccount>,

    #[account(
        mut,
        seeds = [b"chat", alice.as_bytes(), bob.as_bytes()],
        bump,
    )]
    pub alice_chat_account: Account<'info, ChatAccount>,

    #[account(
        mut,
        seeds = [b"chat", bob.as_bytes(), alice.as_bytes()],
        bump,
    )]
    pub bob_chat_account: Account<'info, ChatAccount>,

    #[account(
        init,
        payer = signer,
        space = 8 + 4 * 180 +  std::mem::size_of::<MessageAccount>(),
        seeds = [b"message", alice.as_bytes(), bob.as_bytes(), &alice_chat_account.idx.to_le_bytes()],
        bump
    )]
    pub alice_message_account: Account<'info, MessageAccount>,

    #[account(
        init,
        payer = signer,
        space = 8 + 4 * 180 + std::mem::size_of::<MessageAccount>(),
        seeds = [b"message", bob.as_bytes(), alice.as_bytes(), &alice_chat_account.idx.to_le_bytes()],
        bump
    )]
    pub bob_message_account: Account<'info, MessageAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
```
