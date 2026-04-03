import z from 'zod';

export const priceCardVariantSchema = z.enum(['basic', 'pro', 'enterprise']);

/**
 * Product metadata schema.
 *
 * These fields are set in the Stripe Dashboard on each product's metadata.
 * When you customise your plans, update the keys here and the rendering in
 * `price-card.tsx` to match.
 *
 * Default fields:
 *  - price_card_variant: 'basic' | 'pro' | 'enterprise'
 *  - features:           comma-separated feature list, e.g. "5 projects,10 GB storage,Email support"
 *  - support_level:      'email' | 'priority' | 'dedicated'
 */
export const productMetadataSchema = z
  .object({
    price_card_variant: priceCardVariantSchema,
    features: z.string().optional().default(''),
    support_level: z.string().optional().default('email'),
  })
  .transform((data) => ({
    priceCardVariant: data.price_card_variant,
    features: data.features
      ? data.features.split(',').map((f) => f.trim()).filter(Boolean)
      : [],
    supportLevel: data.support_level,
  }));

export type ProductMetadata = z.infer<typeof productMetadataSchema>;
export type PriceCardVariant = z.infer<typeof priceCardVariantSchema>;
