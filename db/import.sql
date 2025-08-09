-- Import CSV exports into tables. Assumes CSV files exist in cwd.
-- Adjust paths as necessary.
\copy bank_accounts(plaid_item_id,plaid_account_id,account_name,account_mask,account_type,institution_name,is_active,sync_cursor,last_sync_date,connection_status,created_by) FROM 'BankAccount_export.csv' WITH (FORMAT csv, HEADER true);

\copy charities(name,description,ein,logo_url,website_url,address,zakat_eligible,category,subcategories,total_raised,donor_count,verified_date,is_active,guidestar_profile,payment_details,created_by) FROM 'Charity_export.csv' WITH (FORMAT csv, HEADER true);

\copy donations(amount,charity_name,charity_id,charity_ein,donation_type,receipt_number,status,payment_method,stripe_payment_intent_id,stripe_charge_id,pledge_count,processing_fee,tax_deductible_amount,receipt_sent_date,disbursement_date,disbursement_method,created_by) FROM 'Donation_export.csv' WITH (FORMAT csv, HEADER true);

\copy pledges(transaction_id,amount,charity_id,status,donation_id,donation_type,month_year,created_by) FROM 'Pledge_export.csv' WITH (FORMAT csv, HEADER true);

\copy transactions(plaid_transaction_id,bank_account_id,merchant_name,amount,date,category,category_primary,round_up_amount,status,is_eligible_for_roundup,exclusion_reason,pending_transaction_id,created_by) FROM 'Transaction_export.csv' WITH (FORMAT csv, HEADER true);

