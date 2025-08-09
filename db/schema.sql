-- PostgreSQL schema for sadaqa-buddy aligned with spec
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- enums
CREATE TYPE user_role AS ENUM ('user','admin');
CREATE TYPE donation_mode_enum AS ENUM ('sadaqah','zakat');
CREATE TYPE transaction_status_enum AS ENUM ('pending','posted','excluded');
CREATE TYPE pledge_status_enum AS ENUM ('pending','included_in_donation','canceled');
CREATE TYPE donation_status_enum AS ENUM ('pending','completed','failed');
CREATE TYPE bank_account_type_enum AS ENUM ('checking','savings','credit');
CREATE TYPE bank_account_status_enum AS ENUM ('connected','reconnect_required','error');
CREATE TYPE disbursement_method_enum AS ENUM ('ach','check');
CREATE TYPE charity_category_enum AS ENUM ('education','health','relief','other');

-- users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    notification_preferences JSONB DEFAULT '{}'::jsonb,
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ DEFAULT NOW(),
    updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- bank accounts
CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plaid_item_id TEXT NOT NULL,
    plaid_account_id TEXT NOT NULL,
    account_name TEXT NOT NULL,
    account_mask TEXT,
    account_type bank_account_type_enum,
    institution_name TEXT,
    is_active BOOLEAN DEFAULT true,
    sync_cursor TEXT,
    last_sync_date TIMESTAMPTZ,
    connection_status bank_account_status_enum DEFAULT 'connected',
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ DEFAULT NOW(),
    updated_date TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(plaid_item_id, plaid_account_id)
);
CREATE INDEX idx_bank_accounts_user_id ON bank_accounts(user_id);
CREATE INDEX idx_bank_accounts_created_by ON bank_accounts(created_by);

-- charities
CREATE TABLE charities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    ein TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    website_url TEXT,
    address JSONB,
    zakat_eligible BOOLEAN DEFAULT false,
    category charity_category_enum,
    subcategories JSONB,
    total_raised NUMERIC(12,2) DEFAULT 0,
    donor_count INTEGER DEFAULT 0,
    verified_date DATE,
    is_active BOOLEAN DEFAULT true,
    guidestar_profile TEXT,
    payment_details JSONB,
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ DEFAULT NOW(),
    updated_date TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_charities_is_active ON charities(is_active);

-- donations
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    charity_id UUID REFERENCES charities(id) ON DELETE SET NULL,
    bank_account_id UUID REFERENCES bank_accounts(id) ON DELETE SET NULL,
    amount NUMERIC(12,2) NOT NULL,
    donation_date TIMESTAMPTZ DEFAULT NOW(),
    status donation_status_enum DEFAULT 'completed',
    donation_type donation_mode_enum,
    receipt_number TEXT,
    payment_method TEXT,
    stripe_payment_intent_id TEXT,
    stripe_charge_id TEXT,
    pledge_count INTEGER,
    processing_fee NUMERIC(12,2),
    tax_deductible_amount NUMERIC(12,2),
    receipt_sent_date DATE,
    disbursement_date DATE,
    disbursement_method disbursement_method_enum,
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ DEFAULT NOW(),
    updated_date TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_donations_user_id ON donations(user_id);
CREATE INDEX idx_donations_charity_id ON donations(charity_id);
CREATE INDEX idx_donations_created_by ON donations(created_by);

-- transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bank_account_id UUID REFERENCES bank_accounts(id) ON DELETE CASCADE,
    plaid_transaction_id TEXT NOT NULL UNIQUE,
    merchant_name TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    date DATE NOT NULL,
    category JSONB,
    category_primary TEXT,
    round_up_amount NUMERIC(12,2),
    status transaction_status_enum DEFAULT 'pending',
    is_eligible_for_roundup BOOLEAN DEFAULT true,
    exclusion_reason TEXT,
    pending_transaction_id TEXT,
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ DEFAULT NOW(),
    updated_date TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_transactions_bank_account_id ON transactions(bank_account_id);
CREATE INDEX idx_transactions_created_by ON transactions(created_by);
CREATE INDEX idx_transactions_date ON transactions(date);

-- pledges
CREATE TABLE pledges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL,
    charity_id UUID REFERENCES charities(id) ON DELETE SET NULL,
    status pledge_status_enum DEFAULT 'pending',
    donation_id UUID REFERENCES donations(id) ON DELETE SET NULL,
    donation_type donation_mode_enum,
    month_year CHAR(7),
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ DEFAULT NOW(),
    updated_date TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_pledges_charity_id ON pledges(charity_id);
CREATE INDEX idx_pledges_created_by ON pledges(created_by);

