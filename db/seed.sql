-- Sample seed data for sadaqa-buddy with UUIDs and created_by
INSERT INTO users (id, name, email, role, created_by) VALUES
 ('00000000-0000-0000-0000-000000000001', 'Alice', 'alice@example.com', 'user', 'system'),
 ('00000000-0000-0000-0000-000000000002', 'Bob', 'bob@example.com', 'user', 'system');

INSERT INTO bank_accounts (id, user_id, plaid_item_id, plaid_account_id, account_name, account_mask, account_type, institution_name, created_by)
VALUES
 ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'item123', 'acc456', 'Alice Checking', '1234', 'checking', 'Test Bank', 'alice@example.com');

INSERT INTO charities (id, name, description, ein, category, zakat_eligible, address, created_by)
VALUES
 ('00000000-0000-0000-0000-000000000201', 'Helping Hands', 'Provides aid and support to families', '12-3456789', 'relief', true, '{"city":"Springfield","state":"IL","country":"US"}', 'system'),
 ('00000000-0000-0000-0000-000000000202', 'Water Wells', 'Builds clean water wells', '98-7654321', 'health', false, '{"city":"Denver","state":"CO","country":"US"}', 'system');

INSERT INTO transactions (id, bank_account_id, plaid_transaction_id, merchant_name, amount, date, category, category_primary, round_up_amount, status, created_by)
VALUES
 ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000101', 'txn1', 'Grocery Store', 23.45, '2024-05-01', '["Shops","Groceries"]', 'groceries', 0.55, 'posted', 'alice@example.com'),
 ('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000101', 'txn2', 'Coffee Shop', 4.20, '2024-05-02', '["Food","Coffee"]', 'coffee', 0.80, 'posted', 'alice@example.com');

INSERT INTO pledges (id, transaction_id, amount, charity_id, status, donation_type, month_year, created_by)
VALUES
 ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000301', 0.55, '00000000-0000-0000-0000-000000000201', 'included_in_donation', 'sadaqah', '2024-05', 'alice@example.com'),
 ('00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000302', 0.80, '00000000-0000-0000-0000-000000000202', 'pending', 'sadaqah', '2024-05', 'alice@example.com');

INSERT INTO donations (id, user_id, charity_id, bank_account_id, amount, donation_date, status, donation_type, receipt_number, created_by)
VALUES
 ('00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 50.00, '2024-06-01', 'completed', 'sadaqah', 'don123', 'alice@example.com');

UPDATE pledges SET donation_id = '00000000-0000-0000-0000-000000000501', status = 'included_in_donation' WHERE id = '00000000-0000-0000-0000-000000000401';

