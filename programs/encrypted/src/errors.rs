use anchor_lang::prelude::*;

#[error_code]
pub enum EncrytedAppError {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
}
