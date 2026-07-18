import {
  Body, Button, Container, Head, Heading, Hr, Html,
  Preview, Section, Text, Tailwind,
} from '@react-email/components'

interface TrialEndingEmailProps {
  shopName: string
  firstName: string
  daysLeft: number
  upgradeUrl: string
}

export default function TrialEndingEmail({
  shopName,
  firstName,
  daysLeft,
  upgradeUrl,
}: TrialEndingEmailProps) {
  const urgent = daysLeft <= 3

  return (
    <Html>
      <Head />
      <Preview>
        {urgent
          ? `⚠️ Your FleetFlow trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`
          : `Your FleetFlow trial ends in ${daysLeft} days — keep the momentum going`}
      </Preview>
      <Tailwind>
        <Body style={body}>
          <Container style={container}>
            {/* Header */}
            <Section style={urgent ? urgentHeader : header}>
              <Text style={logo}>⚡ FleetFlow</Text>
            </Section>

            {/* Hero */}
            <Section style={{ padding: '40px 40px 32px', textAlign: 'center' as const }}>
              <div style={urgent ? urgentBadge : trialBadge}>
                {urgent ? '⚠️' : '📅'} {daysLeft} day{daysLeft === 1 ? '' : 's'} left
              </div>
              <Heading style={h1}>
                {urgent ? 'Your trial is almost over' : `Keep the momentum going, ${firstName}`}
              </Heading>
              <Text style={subtext}>
                {urgent
                  ? `${shopName}'s free trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}. Upgrade now to keep all your data and never miss a beat.`
                  : `${shopName}'s free trial ends in ${daysLeft} days. Upgrade to a paid plan to keep everything running smoothly.`}
              </Text>
              <Button href={upgradeUrl} style={urgent ? urgentButton : primaryButton}>
                Upgrade Now — Keep My Data →
              </Button>
              <Text style={{ ...subtext, fontSize: '13px', marginTop: '12px' }}>
                Starting at $49/mo · Cancel anytime
              </Text>
            </Section>

            <Hr style={divider} />

            {/* What you'll lose */}
            <Section style={{ padding: '28px 40px' }}>
              <Heading style={h2}>What happens when your trial ends</Heading>
              {[
                ['🔒', 'Your account is locked', 'You won\'t be able to log in or access your data'],
                ['📋', 'Work orders paused', 'All open jobs will be frozen until you upgrade'],
                ['👥', 'Customer history preserved', 'Your data is safe — we hold it for 30 days'],
              ].map(([icon, title, desc]) => (
                <div key={title} style={warningItem}>
                  <Text style={warningIcon}>{icon}</Text>
                  <div>
                    <Text style={warningTitle}>{title}</Text>
                    <Text style={warningDesc}>{desc}</Text>
                  </div>
                </div>
              ))}
            </Section>

            <Hr style={divider} />

            <Section style={{ padding: '32px 40px', textAlign: 'center' as const }}>
              <Heading style={h2}>Pick a plan that fits your shop</Heading>
              <Text style={subtext}>
                <strong style={{ color: '#fff' }}>Starter ($49/mo)</strong> — 1 bay, 1 user, full work order & invoicing{'\n'}
                <strong style={{ color: '#fff' }}>Pro ($149/mo)</strong> — Unlimited bays, 5 users, inventory & scheduling{'\n'}
                <strong style={{ color: '#fff' }}>Enterprise</strong> — Multi-location, unlimited everything
              </Text>
              <Button href={upgradeUrl} style={primaryButton}>
                Choose My Plan →
              </Button>
            </Section>

            <Hr style={divider} />

            <Section style={footer}>
              <Text style={footerText}>
                Questions? Just reply to this email.
              </Text>
              <Text style={footerText}>© 2026 FleetFlow · Built for modern auto shops</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

TrialEndingEmail.PreviewProps = {
  shopName: "Mike's Auto Repair",
  firstName: 'Mike',
  daysLeft: 3,
  upgradeUrl: 'https://fleetflow.app/settings',
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

const urgentHeader: React.CSSProperties = {
  background: 'linear-gradient(135deg, #7c1d1d 0%, #3d0d0d 100%)',
  padding: '24px 40px',
  borderBottom: '1px solid rgba(255,100,100,0.15)',
}

const logo: React.CSSProperties = {
  color: '#7c9ff5',
  fontSize: '20px',
  fontWeight: '800',
  margin: '0',
}

const trialBadge: React.CSSProperties = {
  backgroundColor: 'rgba(59,110,245,0.12)',
  border: '1px solid rgba(59,110,245,0.3)',
  borderRadius: '100px',
  color: '#7c9ff5',
  display: 'inline-block',
  fontSize: '13px',
  fontWeight: '600',
  marginBottom: '16px',
  padding: '5px 14px',
}

const urgentBadge: React.CSSProperties = {
  backgroundColor: 'rgba(239,68,68,0.12)',
  border: '1px solid rgba(239,68,68,0.3)',
  borderRadius: '100px',
  color: '#f87171',
  display: 'inline-block',
  fontSize: '13px',
  fontWeight: '600',
  marginBottom: '16px',
  padding: '5px 14px',
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
  lineHeight: '1.7',
  margin: '0 0 20px',
  whiteSpace: 'pre-line',
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

const urgentButton: React.CSSProperties = {
  backgroundColor: '#ef4444',
  borderRadius: '10px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: '600',
  padding: '13px 28px',
  textDecoration: 'none',
}

const warningItem: React.CSSProperties = {
  alignItems: 'flex-start',
  display: 'flex',
  gap: '12px',
  marginBottom: '14px',
}

const warningIcon: React.CSSProperties = {
  fontSize: '18px',
  margin: '0',
  minWidth: '24px',
}

const warningTitle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
}

const warningDesc: React.CSSProperties = {
  color: 'rgba(255,255,255,0.4)',
  fontSize: '13px',
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
