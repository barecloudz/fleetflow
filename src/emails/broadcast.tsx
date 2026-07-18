import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from '@react-email/components'

interface BroadcastEmailProps {
  shopName: string
  subject: string
  body: string
}

export default function BroadcastEmail({ shopName, subject, body }: BroadcastEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={bodyStyle}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>⚡ FleetFlow</Text>
          </Section>

          <Section style={{ padding: '36px 40px 28px' }}>
            <Heading style={h1}>{subject}</Heading>
            <Text style={greeting}>Hi {shopName},</Text>
            {body.split('\n').filter(Boolean).map((line, i) => (
              <Text key={i} style={paragraph}>{line}</Text>
            ))}
          </Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this because you&apos;re a FleetFlow customer.
            </Text>
            <Text style={footerText}>© 2026 FleetFlow · Built for modern auto shops</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

BroadcastEmail.PreviewProps = {
  shopName: "Mike's Auto Repair",
  subject: 'Scheduled maintenance tonight',
  body: "We'll be performing scheduled maintenance tonight from 11pm–1am EST.\n\nFleetFlow will be unavailable during this window. We apologize for any inconvenience.",
}

const bodyStyle: React.CSSProperties = {
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

const h1: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 16px',
}

const greeting: React.CSSProperties = {
  color: 'rgba(255,255,255,0.6)',
  fontSize: '15px',
  margin: '0 0 12px',
}

const paragraph: React.CSSProperties = {
  color: 'rgba(255,255,255,0.5)',
  fontSize: '15px',
  lineHeight: '1.7',
  margin: '0 0 10px',
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
