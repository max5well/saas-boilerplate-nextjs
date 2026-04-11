/**
 * EMAIL PREFERENCES
 * Adds email notification preferences to the users table.
 * Users can opt out of non-essential emails (marketing, product updates).
 * Transactional emails (password reset, payment receipts) are always sent.
 */

-- Add email preference columns
alter table users add column email_product_updates boolean not null default true;
alter table users add column email_marketing boolean not null default true;
