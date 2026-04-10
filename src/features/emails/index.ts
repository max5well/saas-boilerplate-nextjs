// Templates
export { PasswordResetEmail } from './password-reset-email';
export type { LineItem } from './payment-receipt';
export { PaymentReceipt } from './payment-receipt';
export { SubscriptionCanceled } from './subscription-canceled';
export { SubscriptionStarted } from './subscription-started';
export { SubscriptionUpdated } from './subscription-updated';
export { VerificationEmail } from './verification-email';
export { WelcomeEmail } from './welcome';

// Components
export { EmailButton } from './components/email-button';
export { EmailFooter } from './components/email-footer';
export { EmailLayout } from './components/email-layout';

// Senders
export type { SendEmailOptions, SendEmailResult } from './utils/email-sender';
export {
  sendEmail,
  sendPasswordResetEmail,
  sendPaymentReceiptEmail,
  sendSubscriptionCanceledEmail,
  sendSubscriptionStartedEmail,
  sendSubscriptionUpdatedEmail,
  sendVerificationEmail,
} from './utils/email-sender';
