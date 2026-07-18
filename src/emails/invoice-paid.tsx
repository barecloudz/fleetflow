import {
  Body, Button, Container, Head, Heading, Hr, Html,
  Preview, Section, Text, Tailwind, Row, Column,
} from '@react-email/components'

interface InvoicePaidEmailProps {
  shopName: string
  customerName: string
  invoiceNumber: string
  amount: string
  paidAt: string
  dashboardUrl: string
}

export default function InvoicePaidEmail({
  shopName,
  customerName,
  invoiceNumber,
  amount,
  paidAt,
  dashboardUrl,
}: InvoicePaidEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Payment received — Invoice {invoiceNumber} for {amount}</Preview>
      <Tailwind>
        <Body style={body}>
          <Container style={container}>
            {/* Header */}
            <Section style={header}>
              <Text style={logo}>⚡ FleetFlow</Text>
              <Text style={shopLabel}>{shopName}</Text>
            </Section>

            {/* Hero */}
            <Section style={{ padding: '40px 40px 32px', textAlign: 'center' as const }}>
              <div style={iconCircle}>✓</div>
              <Heading style={h1}>Payment Received</Heading>
              <Text style={subtext}>
                {customerName} has paid invoice {invoiceNumber}.
              </Text>
            </Section>

            {/* Invoice summary box */}
            <Section style={{ padding: '0 40px 32px' }}>
              <div style={summaryBox}>
                <Row>
                  <Column style={summaryLabel}>Invoice</Column>
                  <Column style={summaryValue}>{invoiceNumber}</Column>
                </Row>
                <Row>
                  <Column style={summaryLabel}>Customer</Column>
                  <Column style={summaryValue}>{customerName}</Column>
                </Row>
                <Row>
                  <Column style={summaryLabel}>Amount</Column>
                  <Column style={{ ...summaryValue, color: '#4ade80', fontWeight: '700', fontSize: '20px' }}>{amount}</Column>
                </Row>
                <Row>
                  <Column style={summaryLabel}>Paid</Column>
                  <Column style={summaryValue}>{paidAt}</Column>
                </Row>
              </div>
            </Section>

            <Hr style={divider} />

            <Section style={{ padding: '32px 40px', textAlign: 'center' as const }}>
              <Button href={dashboardUrl} style={primaryButton}>
                View in Dashboard →
              </Button>
            </Section>

            <Hr style={divider} />

            <Section style={footer}>
              <Text style={footerText}>© 2026 FleetFlow · Built for modern auto shops</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

InvoicePaidEmail.PreviewProps = {
  shopName: "Mike's Auto Repair",
  customerName: 'James Wilson',
  invoiceNumber: 'INV-1042',
  amount: '$320.00',
  paidAt: 'July 18, 2026',
  dashboardUrl: 'https://fleetflow.app/payments',
}

const body: React.CSSProperties = {
  backgroundColor: '#0c0e1a',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: '0',
  padding: '40px 0',
}

const container: React.CSSProperties = {
  backgroundColor: '#131628',
  borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.08)',
  maxWidth: '560px',
  margin: '0 auto',
  overflow: 'hidden',
}

const header: React.CSSProperties = {
  background: 'linear-gradient(135deg, #1e2a6e 0%, #0f1535 100%)',
  padding: '24px 40px',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
}

const logo: React.CSSProperties = {
  color: '#7c9ff5',
  fontSize: '20px',
  fontWeight: '800',
  margin: '0',
}

const shopLabel: React.CSSProperties = {
  color: 'rgba(255,255,255,0.35)',
  fontSize: '12px',
  margin: '2px 0 0',
}

const h1: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '700',
  margin: '12px 0 8px',
}

const iconCircle: React.CSSProperties = {
  backgroundColor: 'rgba(74,222,128,0.15)',
  border: '1px solid rgba(74,222,128,0.3)',
  borderRadius: '50%',
  color: '#4ade80',
  display: 'inline-block',
  fontSize: '22px',
  fontWeight: '700',
  height: '52px',
  lineHeight: '52px',
  width: '52px',
}

const subtext: React.CSSProperties = {
  color: 'rgba(255,255,255,0.5)',
  fontSize: '15px',
  margin: '0',
}

const summaryBox: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '20px 24px',
}

const summaryLabel: React.CSSProperties = {
  color: 'rgba(255,255,255,0.4)',
  fontSize: '13px',
  padding: '6px 0',
  width: '40%',
}

const summaryValue: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '500',
  padding: '6px 0',
}

const primaryButton: React.CSSProperties = {
  backgroundColor: '#3b6ef5',
  borderRadius: '10px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: '600',
  padding: '13px 28px',
  textDecoration: 'none',
}

const divider: React.CSSProperties = {
  borderColor: 'rgba(255,255,255,0.07)',
  margin: '0',
}

const footer: React.CSSProperties = {
  padding: '24px 40px',
  textAlign: 'center' as const,
}

const footerText: React.CSSProperties = {
  color: 'rgba(255,255,255,0.25)',
  fontSize: '12px',
  margin: '0',
}
