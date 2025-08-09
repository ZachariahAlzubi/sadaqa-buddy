#!/usr/bin/env bash
set -e

# Import CSV exports into tables if the files exist.
# Skips any missing files so the command is safe without exports.

run_copy() {
  local file="$1"
  local table="$2"
  local columns="$3"
  if [ -f "$file" ]; then
    echo "Importing $file into $table"
    psql "$DATABASE_URL" -c "\\copy $table($columns) FROM '$file' WITH (FORMAT csv, HEADER true)"
  else
    echo "Skipping $file (not found)"
  fi
}

run_copy "BankAccount_export.csv" "bank_accounts" "plaid_item_id,plaid_account_id,account_name,account_mask,account_type,institution_name,is_active,sync_cursor,last_sync_date,connection_status,created_by"
run_copy "Charity_export.csv" "charities" "name,description,ein,logo_url,website_url,address,zakat_eligible,category,subcategories,total_raised,donor_count,verified_date,is_active,guidestar_profile,payment_details,created_by"
run_copy "Donation_export.csv" "donations" "amount,charity_name,charity_id,charity_ein,donation_type,receipt_number,status,payment_method,stripe_payment_intent_id,stripe_charge_id,pledge_count,processing_fee,tax_deductible_amount,receipt_sent_date,disbursement_date,disbursement_method,created_by"
run_copy "Pledge_export.csv" "pledges" "transaction_id,amount,charity_id,status,donation_id,donation_type,month_year,created_by"
run_copy "Transaction_export.csv" "transactions" "plaid_transaction_id,bank_account_id,merchant_name,amount,date,category,category_primary,round_up_amount,status,is_eligible_for_roundup,exclusion_reason,pending_transaction_id,created_by"

