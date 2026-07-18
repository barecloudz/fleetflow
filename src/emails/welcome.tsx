import {
  Body, Button, Container, Head, Heading, Hr, Html,
  Img, Preview, Section, Text, Tailwind,
} from '@react-email/components'

interface WelcomeEmailProps {
  shopName: string
  firstName: string
  loginUrl: string
}

export default function WelcomeEmail({ shopName, firstName, loginUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to FleetFlow — your 14-day free trial has started</Preview>
      <Tailwind>
        <Body style={body}>
          <Container style={container}>
            {/* Header */}
            <Section style={header}>
              <Text style={logo}>⚡ FleetFlow</Text>
            </Section>

            {/* Hero */}
            <Section style={heroSection}>
              <Heading style={h1}>Welcome, {firstName}!</Heading>
              <Text style={subtext}>
                <strong>{shopName}</strong> is ready to go. Your free 14-day trial has started —
                no credit card required.
              </Text>
              <Button href={loginUrl} style={primaryButton}>
                Go to Your Dashboard →
              </Button>
            </Section>

            <Hr style={divider} />

            {/* What you get */}
            <Section style={section}>
              <Heading style={h2}>Everything included in your trial</Heading>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                {[
                  ['📋', 'Work Orders', 'Create, assign & track every repair job'],
                  ['👥', 'Customers', 'Full customer profiles with vehicle history'],
                  ['📦', 'Inventory', 'Real-time parts tracking with low-stock alerts'],
                  ['💳', 'Payments', 'Invoices, payment tracking & more'],
                  ['📅', 'Calendar', 'Appointment scheduling built-in'],
                  ['🔧', 'Technicians', 'Time tracking & job assignment'],
                ].map(([icon, title, desc]) => (
                  <tr key={title}>
                    <td style={featureIcon}>{icon}</td>
                    <td style={featureContent}>
                      <Text style={featureTitle}>{title}</Text>
                      <Text style={featureDesc}>{desc}</Text>
                    </td>
                  </tr>
                ))}
              </table>
            </Section>

            <Hr style={divider} />

            {/* CTA */}
            <Section style={{ ...section, textAlign: 'center' as const }}>
              <Heading style={h2}>Ready to get started?</Heading>
              <Text style={subtext}>
                Sign in and add your first customer or work order — it only takes 2 minutes.
              </Text>
              <Button href={loginUrl} style={primaryButton}>
                Open FleetFlow
              </Button>
            </Section>

            <Hr style={divider} />

            {/* Footer */}
            <Section style={footer}>
              <Text style={footerText}>
                Questions? Reply to this email and we'll help you out.
              </Text>
              <Text style={footerText}>
                © 2026 FleetFlow · Built for modern auto shops
              </Text>
              <Text style={{ ...footerText, marginTop: '8px' }}>
                You're receiving this because you signed up at fleetflow.app
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

WelcomeEmail.PreviewProps = {
  shopName: "Mike's Auto Repair",
  firstName: 'Mike',
  loginUrl: 'https://fleetflow.app/login',
}

// ── Styles ────────────────────────────────────────────────────────────────────

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
  padding: '28px 40px',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
}

const logo: React.CSSProperties = {
  color: '#7c9ff5',
  fontSize: '22px',
  fontWeight: '800',
  margin: '0',
  letterSpacing: '-0.5px',
}

const heroSection: React.CSSProperties = {
  padding: '40px 40px 32px',
  textAlign: 'center' as const,
}

const h1: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '30px',
  fontWeight: '700',
  margin: '0 0 12px',
  lineHeight: '1.2',
}

const h2: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
}

const subtext: React.CSSProperties = {
  color: 'rgba(255,255,255,0.55)',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 24px',
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
  boxShadow: '0 4px 16px rgba(59,110,245,0.4)',
}

const section: React.CSSProperties = {
  padding: '32px 40px',
}

const divider: React.CSSProperties = {
  borderColor: 'rgba(255,255,255,0.07)',
  margin: '0',
}

const featureIcon: React.CSSProperties = {
  fontSize: '20px',
  padding: '8px 12px 8px 0',
  verticalAlign: 'top',
  width: '36px',
}

const featureContent: React.CSSProperties = {
  padding: '6px 0',
  verticalAlign: 'top',
}

const featureTitle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
}

const featureDesc: React.CSSProperties = {
  color: 'rgba(255,255,255,0.45)',
  fontSize: '13px',
  margin: '2px 0 0',
}

const footer: React.CSSProperties = {
  padding: '24px 40px 32px',
  textAlign: 'center' as const,
}

const footerText: React.CSSProperties = {
  color: 'rgba(255,255,255,0.25)',
  fontSize: '12px',
  margin: '4px 0',
}
