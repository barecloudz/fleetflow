import { getResend, FROM } from './resend'
import WelcomeEmail from '@/emails/welcome'
import InvoicePaidEmail from '@/emails/invoice-paid'
import TrialEndingEmail from '@/emails/trial-ending'
import ShopCreatedEmail from '@/emails/shop-created-by-admin'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://fleetflow.app'

async function send(payload: Parameters<ReturnType<typeof getResend>['emails']['send']>[0]) {
  const { data, error } = await getResend().emails.send(payload)
  if (error) throw new Error(error.message)
  return data
}

export async function sendWelcomeEmail({
  to,
  shopName,
  firstName,
}: {
  to: string
  shopName: string
  firstName: string
}) {
  return send({
    from: FROM,
    to,
    subject: `Welcome to FleetFlow — ${shopName} is live 🚀`,
    react: WelcomeEmail({ shopName, firstName, loginUrl: `${APP_URL}/login` }),
  })
}

export async function sendShopCreatedEmail({
  to,
  shopName,
  tempPassword,
  plan,
}: {
  to: string
  shopName: string
  tempPassword: string
  plan: string
}) {
  return send({
    from: FROM,
    to,
    subject: `Your FleetFlow account for ${shopName} is ready`,
    react: ShopCreatedEmail({
      shopName,
      email: to,
      tempPassword,
      plan,
      loginUrl: `${APP_URL}/login`,
    }),
  })
}

export async function sendInvoicePaidEmail({
  to,
  shopName,
  customerName,
  invoiceNumber,
  amount,
  paidAt,
}: {
  to: string
  shopName: string
  customerName: string
  invoiceNumber: string
  amount: string
  paidAt: string
}) {
  return send({
    from: FROM,
    to,
    subject: `Payment received — ${invoiceNumber} for ${amount}`,
    react: InvoicePaidEmail({
      shopName,
      customerName,
      invoiceNumber,
      amount,
      paidAt,
      dashboardUrl: `${APP_URL}/payments`,
    }),
  })
}

export async function sendTrialEndingEmail({
  to,
  shopName,
  firstName,
  daysLeft,
}: {
  to: string
  shopName: string
  firstName: string
  daysLeft: number
}) {
  return send({
    from: FROM,
    to,
    subject: daysLeft <= 3
      ? `⚠️ Your FleetFlow trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`
      : `Your FleetFlow trial ends in ${daysLeft} days`,
    react: TrialEndingEmail({ shopName, firstName, daysLeft, upgradeUrl: `${APP_URL}/settings` }),
  })
}
