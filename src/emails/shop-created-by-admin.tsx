import {
  Body, Button, Container, Head, Heading, Hr, Html,
  Img, Preview, Section, Text, Row, Column,
} from '@react-email/components'

interface ShopCreatedEmailProps {
  shopName: string
  email: string
  tempPassword: string
  plan: string
  loginUrl: string
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://fleetflowunited.com'

export default function ShopCreatedEmail({
  shopName,
  email,
  tempPassword,
  plan,
  loginUrl,
}: ShopCreatedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your FleetFlow account for {shopName} is ready — here are your login details</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Img
              src={`${APP_URL}/logo.png`}
              alt="FleetFlow"
              height={44}
              style={{ display: 'block' }}
            />
          </Section>

          {/* Hero */}
          <Section style={{ padding: '40px 40px 28px' }}>
            <Heading style={h1}>Your shop account is ready</Heading>
            <Text style={subtext}>
              <strong style={{ color: '#fff' }}>{shopName}</strong> has been set up on FleetFlow.
              Use the credentials below to sign in and get started.
            </Text>
          </Section>

          {/* Credentials box */}
          <Section style={{ padding: '0 40px 32px' }}>
            <div style={credentialsBox}>
              <Text style={credHeader}>Your Login Credentials</Text>
              <Row>
                <Column style={credLabel}>Login URL</Column>
                <Column style={credValue}>{loginUrl}</Column>
              </Row>
              <Hr style={credDivider} />
              <Row>
                <Column style={credLabel}>Email</Column>
                <Column style={credValue}>{email}</Column>
              </Row>
              <Hr style={credDivider} />
              <Row>
                <Column style={credLabel}>Password</Column>
                <Column style={{ ...credValue, fontFamily: 'monospace', letterSpacing: '1px' }}>
                  {tempPassword}
                </Column>
              </Row>
              <Hr style={credDivider} />
              <Row>
                <Column style={credLabel}>Plan</Column>
                <Column style={{ ...credValue, textTransform: 'capitalize' as const }}>{plan}</Column>
              </Row>
            </div>
            <Text style={warningText}>
              ⚠️ Change your password after your first login in Account Settings.
            </Text>
          </Section>

          <Section style={{ padding: '0 40px 32px', textAlign: 'center' as const }}>
            <Button href={loginUrl} style={primaryButton}>
              Sign In to FleetFlow →
            </Button>
          </Section>

          <Hr style={divider} />

          {/* Quick start */}
          <Section style={{ padding: '28px 40px' }}>
            <Heading style={h2}>Get started in 3 steps</Heading>
            {[
              ['1', 'Add your first customer', 'Go to Customers → New Customer'],
              ['2', 'Create a work order', 'Go to Work Orders → New Work Order'],
              ['3', 'Add your inventory', 'Go to Inventory → Add Parts'],
            ].map(([num, title, desc]) => (
              <div key={num} style={stepItem}>
                <div style={stepNumber}>{num}</div>
                <div>
                  <Text style={stepTitle}>{title}</Text>
                  <Text style={stepDesc}>{desc}</Text>
                </div>
              </div>
            ))}
          </Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              Questions? Reply to this email and we&apos;ll help you out.
            </Text>
            <Text style={footerText}>© 2026 FleetFlow · Built for modern auto shops</Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

ShopCreatedEmail.PreviewProps = {
  shopName: "Mike's Auto Repair",
  email: 'mike@mikesauto.com',
  tempPassword: 'FleetABC12341!',
  plan: 'starter',
  loginUrl: 'https://fleetflowunited.com/login',
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

const h1: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '26px',
  fontWeight: '700',
  margin: '0 0 12px',
}

const h2: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 16px',
}

const subtext: React.CSSProperties = {
  color: 'rgba(255,255,255,0.5)',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0',
}

const credentialsBox: React.CSSProperties = {
  backgroundColor: 'rgba(59,110,245,0.07)',
  border: '1px solid rgba(59,110,245,0.25)',
  borderRadius: '12px',
  padding: '20px 24px',
}

const credHeader: React.CSSProperties = {
  color: '#7c9ff5',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '1px',
  margin: '0 0 14px',
  textTransform: 'uppercase' as const,
}

const credLabel: React.CSSProperties = {
  color: 'rgba(255,255,255,0.4)',
  fontSize: '13px',
  padding: '5px 0',
  width: '35%',
}

const credValue: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '500',
  padding: '5px 0',
}

const credDivider: React.CSSProperties = {
  borderColor: 'rgba(255,255,255,0.06)',
  margin: '4px 0',
}

const warningText: React.CSSProperties = {
  color: 'rgba(251,191,36,0.7)',
  fontSize: '12px',
  margin: '10px 0 0',
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

const stepItem: React.CSSProperties = {
  alignItems: 'flex-start',
  display: 'flex',
  gap: '14px',
  marginBottom: '14px',
}

const stepNumber: React.CSSProperties = {
  backgroundColor: 'rgba(59,110,245,0.15)',
  border: '1px solid rgba(59,110,245,0.3)',
  borderRadius: '50%',
  color: '#7c9ff5',
  fontSize: '13px',
  fontWeight: '700',
  height: '28px',
  lineHeight: '28px',
  minWidth: '28px',
  textAlign: 'center' as const,
}

const stepTitle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  margin: '2px 0 0',
}

const stepDesc: React.CSSProperties = {
  color: 'rgba(255,255,255,0.35)',
  fontSize: '12px',
  margin: '2px 0 0',
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
  margin: '4px 0',
}
