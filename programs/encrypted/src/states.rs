use anchor_lang::prelude::*;

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
