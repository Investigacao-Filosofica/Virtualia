use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("11111111111111111111111111111111");

#[program]
pub mod virtualia {
    use super::*;

    pub fn initialize_user(ctx: Context<InitializeUser>, bump: u8) -> Result<()> {
        let profile = &mut ctx.accounts.profile;
        profile.owner = ctx.accounts.authority.key();
        profile.bump = bump;
        profile.total_mints = 0;
        Ok(())
    }

    pub fn mint_content(ctx: Context<MintContent>, metadata: ContentMetadata) -> Result<()> {
        require!(!metadata.title.is_empty(), VirtualiaError::InvalidMetadata);
        require!(
            metadata.uri.starts_with("http") || metadata.uri.starts_with("ipfs://"),
            VirtualiaError::InvalidMetadata
        );

        let profile = &mut ctx.accounts.profile;
        profile.total_mints = profile.total_mints.checked_add(1).ok_or(VirtualiaError::Overflow)?;

        let content = &mut ctx.accounts.content;
        content.owner = ctx.accounts.authority.key();
        content.title = metadata.title;
        content.description = metadata.description;
        content.uri = metadata.uri;
        content.content_type = metadata.content_type;
        content.reward_lamports = metadata.reward_lamports;
        content.bump = *ctx.bumps.get("content").unwrap();
        content.created_at = Clock::get()?.unix_timestamp;

        Ok(())
    }

    pub fn distribute_reward(ctx: Context<DistributeReward>, amount: u64) -> Result<()> {
        require!(amount > 0, VirtualiaError::InvalidReward);
        let seeds = &[b"profile", ctx.accounts.authority.key().as_ref(), &[ctx.accounts.profile.bump]];
        let signer = &[&seeds[..]];
        let cpi_accounts = Transfer {
            from: ctx.accounts.treasury.to_account_info(),
            to: ctx.accounts.recipient.to_account_info(),
            authority: ctx.accounts.profile.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_accounts, signer);
        token::transfer(cpi_ctx, amount)?;
        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct ContentMetadata {
    pub title: String,
    pub description: String,
    pub uri: String,
    pub content_type: String,
    pub reward_lamports: u64,
}

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct InitializeUser<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        seeds = [b"profile", authority.key().as_ref()],
        bump,
        space = 8 + Profile::INIT_SPACE,
    )]
    pub profile: Account<'info, Profile>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintContent<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        seeds = [b"profile", authority.key().as_ref()],
        bump = profile.bump,
    )]
    pub profile: Account<'info, Profile>,
    #[account(
        init,
        payer = authority,
        seeds = [b"content", authority.key().as_ref(), &profile.total_mints.to_le_bytes()],
        bump,
        space = 8 + Content::INIT_SPACE,
    )]
    pub content: Account<'info, Content>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DistributeReward<'info> {
    pub token_program: Program<'info, Token>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        seeds = [b"profile", authority.key().as_ref()],
        bump = profile.bump,
    )]
    pub profile: Account<'info, Profile>,
    #[account(mut)]
    pub treasury: Account<'info, TokenAccount>,
    #[account(mut)]
    pub recipient: Account<'info, TokenAccount>,
}

#[account]
pub struct Profile {
    pub owner: Pubkey,
    pub total_mints: u64,
    pub bump: u8,
}

impl Space for Profile {
    const INIT_SPACE: usize = 32 + 8 + 1;
}

#[account]
pub struct Content {
    pub owner: Pubkey,
    pub title: String,
    pub description: String,
    pub uri: String,
    pub content_type: String,
    pub reward_lamports: u64,
    pub created_at: i64,
    pub bump: u8,
}

impl Space for Content {
    const INIT_SPACE: usize = 32 + (4 + 64) + (4 + 240) + (4 + 128) + (4 + 32) + 8 + 8 + 1;
}

#[error_code]
pub enum VirtualiaError {
    #[msg("Metadados inválidos: verifique título e URI")]
    InvalidMetadata,
    #[msg("Valor de recompensa inválido")]
    InvalidReward,
    #[msg("Overflow detectado")]
    Overflow,
}
