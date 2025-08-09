-- 1) Staging table that matches your CSV columns (all TEXT for safety)
DROP TABLE IF EXISTS staging_bank_accounts;
CREATE TABLE staging_bank_accounts (
  plaid_item_id       TEXT,
  plaid_account_id    TEXT,
  account_name        TEXT,
  account_mask        TEXT,
  account_type        TEXT,
  institution_name    TEXT,
  is_active           TEXT,
  sync_cursor         TEXT,
  last_sync_date      TEXT,
  connection_status   TEXT,
  id                  TEXT,
  created_date        TEXT,
  updated_date        TEXT,
  created_by_id       TEXT,
  created_by          TEXT,
  is_sample           TEXT
);

-- 2) Load the CSV into the staging table
\copy staging_bank_accounts FROM 'BankAccount_export.csv' WITH (FORMAT csv, HEADER true)

-- 3) Move data from staging into the real table with proper types
--    We also assign user_id to Alice so the data shows up under your dev user.
INSERT INTO bank_accounts (
  user_id,
  plaid_item_id,
  plaid_account_id,
  account_name,
  account_mask,
  account_type,
  institution_name,
  is_active,
  sync_cursor,
  last_sync_date,
  connection_status,
  created_by
)
SELECT
  '00000000-0000-0000-0000-000000000001'::uuid,                     -- Alice (from seed)
  plaid_item_id,
  plaid_account_id,
  account_name,
  account_mask,
  CASE LOWER(account_type)
    WHEN 'checking' THEN 'checking'
    WHEN 'savings'  THEN 'savings'
    WHEN 'credit'   THEN 'credit'
    ELSE NULL
  END::bank_account_type_enum,
  institution_name,
  CASE LOWER(is_active)
    WHEN 'true'  THEN TRUE
    WHEN 'false' THEN FALSE
    ELSE TRUE
  END,
  NULLIF(sync_cursor,''),
  NULLIF(last_sync_date,'')::timestamptz,
  CASE LOWER(connection_status)
    WHEN 'connected'          THEN 'connected'
    WHEN 'reconnect_required' THEN 'reconnect_required'
    WHEN 'error'              THEN 'error'
    ELSE 'connected'
  END::bank_account_status_enum,
  COALESCE(NULLIF(created_by,''), 'alice@example.com')
FROM staging_bank_accounts
-- Skip sample rows if is_sample is true
WHERE COALESCE(NULLIF(is_sample,''), 'false')::boolean IS NOT TRUE
ON CONFLICT (plaid_item_id, plaid_account_id) DO NOTHING;
