// Templates
export { WelcomeEmail } from './welcome';
export { VerificationEmail } from './verification-email';
export { PasswordResetEmail } from './password-reset-email';
export { PaymentReceipt } from './payment-receipt';
export type { LineItem } from './payment-receipt';
export { SubscriptionStarted } from './subscription-started';
export { SubscriptionUpdated } from './subscription-updated';
export { SubscriptionCanceled } from './subscription-canceled';

// Components
export { EmailLayout } from './components/email-layout';
export { EmailButton } from './components/email-button';
export { EmailFooter } from './components/email-footer';

// Senders
export {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPaymentReceiptEmail,
  sendSubscriptionStartedEmail,
  sendSubscriptionUpdatedEmail,
  sendSubscriptionCanceledEmail,
} from './utils/email-sender';
export type { SendEmailOptions, SendEmailResult } from './utils/email-sender';
