/**
 * PERFORMANCE INDEXES
 * Adds indexes for columns frequently used in queries.
 */

-- The webhook handler looks up customers by stripe_customer_id
create index if not exists idx_customers_stripe_customer_id on customers (stripe_customer_id);

-- Subscriptions are queried by user_id and status
create index if not exists idx_subscriptions_user_id on subscriptions (user_id);

-- Prices are queried by product_id
create index if not exists idx_prices_product_id on prices (product_id);
