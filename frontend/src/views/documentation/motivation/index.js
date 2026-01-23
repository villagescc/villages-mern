import React from 'react';
import { Typography, Box, Grid, Paper, Container, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// Import images
import heroImage from 'assets/images/pages/motivation-hero.png';
import problemImage from 'assets/images/pages/motivation-problem.png';
import connectionImage from 'assets/images/pages/motivation-connection.png';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #fef9f3 0%, #fdf4eb 50%, #f0f9fc 100%)',
  borderRadius: '24px',
  padding: theme.spacing(6),
  marginBottom: theme.spacing(6),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
}));

const HeroImage = styled('img')({
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '16px',
  boxShadow: '0 20px 60px rgba(22, 149, 200, 0.15)',
});

const SectionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: '24px',
  marginBottom: theme.spacing(4),
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
  border: '1px solid #e8ecef',
}));

const SectionImage = styled('img')({
  width: '100%',
  height: 'auto',
  borderRadius: '16px',
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: '#1d90b5',
  fontWeight: 700,
  marginBottom: theme.spacing(3),
}));

const QuoteBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1695c8 0%, #1d90b5 100%)',
  borderRadius: '16px',
  padding: theme.spacing(4),
  color: 'white',
  textAlign: 'center',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const ComparisonCard = styled(Box)(({ theme, variant }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  height: '100%',
  backgroundColor: variant === 'negative' ? '#fef5f5' : '#f0faf5',
  border: `2px solid ${variant === 'negative' ? '#ffcdd2' : '#c8e6c9'}`,
}));

const Index = () => {
  const moneyGoals = [
    'Price stability',
    'Low unemployment',
    'Foreign trade',
    'Steady growth in GDP',
  ];

  const humanGoals = [
    'Happiness',
    'Love & relationships',
    'Peace of mind',
    'Strong local communities',
    'Health & wellbeing',
    'Clean environment',
  ];

  return (
    <Box sx={{ pb: 6 }}>
      {/* Hero Section */}
      <HeroSection>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="overline"
              sx={{
                color: '#1d90b5',
                fontWeight: 600,
                letterSpacing: 2,
                mb: 1,
                display: 'block',
              }}
            >
              OUR MISSION
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: '#1a1a2e',
                mb: 3,
                fontSize: { xs: '2rem', md: '2.5rem' },
                lineHeight: 1.2,
              }}
            >
              Helping People Do What They{' '}
              <Box component="span" sx={{ color: '#1d90b5' }}>Love</Box>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#555',
                fontSize: '1.1rem',
                lineHeight: 1.8,
                mb: 3,
              }}
            >
              Many of us struggle with the contradiction between what we want to do 
              and what we need to do to earn money. Rather than change ourselves to 
              suit what money asks of us, we want to change money to suit who we are.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#555',
                fontSize: '1.1rem',
                lineHeight: 1.8,
              }}
            >
              We're creating a system of interconnected, overlapping economic villages, 
              where personal relationships take precedence over numbers, and each person 
              is supported in following their passion.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <HeroImage src={heroImage} alt="Freedom to follow your passion" />
          </Grid>
        </Grid>
      </HeroSection>

      {/* Problem with Money Section */}
      <SectionCard>
        <Grid container spacing={5} alignItems="center">
          <Grid item xs={12} md={5}>
            <SectionImage src={problemImage} alt="The problem with traditional money" />
          </Grid>
          <Grid item xs={12} md={7}>
            <SectionTitle variant="h3">
              The Problem With Money
            </SectionTitle>
            <Typography
              variant="body1"
              sx={{ color: '#555', lineHeight: 1.8, mb: 3 }}
            >
              When we use regular money, we participate in a system managed for purposes 
              that don't align with what matters most to us as human beings.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <ComparisonCard variant="negative">
                  <Typography variant="h6" sx={{ color: '#c62828', mb: 2, fontWeight: 600 }}>
                    What Money Optimizes For
                  </Typography>
                  <List dense>
                    {moneyGoals.map((goal, idx) => (
                      <ListItem key={idx} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CancelIcon sx={{ color: '#e57373', fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={goal} 
                          primaryTypographyProps={{ variant: 'body2', color: '#555' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </ComparisonCard>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ComparisonCard variant="positive">
                  <Typography variant="h6" sx={{ color: '#2e7d32', mb: 2, fontWeight: 600 }}>
                    What Actually Matters
                  </Typography>
                  <List dense>
                    {humanGoals.map((goal, idx) => (
                      <ListItem key={idx} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon sx={{ color: '#66bb6a', fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={goal} 
                          primaryTypographyProps={{ variant: 'body2', color: '#555' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </ComparisonCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </SectionCard>

      {/* Quote */}
      <QuoteBox>
        <Typography variant="h5" sx={{ fontWeight: 500, lineHeight: 1.6, fontStyle: 'italic' }}>
          "Why must we settle for a system of money whose values are not our own, 
          just so it can be managed by a central committee?"
        </Typography>
      </QuoteBox>

      {/* Historical Context */}
      <SectionCard sx={{ background: 'linear-gradient(135deg, #fafbfc 0%, #f5f7f9 100%)' }}>
        <SectionTitle variant="h3">
          Before Banks & Central Committees
        </SectionTitle>
        <Typography
          variant="body1"
          sx={{ color: '#555', lineHeight: 1.9, mb: 3, fontSize: '1.05rem' }}
        >
          In villages where everyone knew everyone else, people didn't need money — 
          they simply offered what was needed and kept track through a natural system 
          of gifts and obligations. Because they managed their own economy, their 
          values as human beings were never trumped by abstract economic goals.
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: '#555', lineHeight: 1.9, fontSize: '1.05rem' }}
        >
          As economies grew larger and trade involved more strangers, abstract systems 
          of keeping score developed. Many of us became materially richer, but we lost 
          some of our autonomy and much of our connection to the people around us.
        </Typography>
      </SectionCard>

      {/* Money for People Section */}
      <SectionCard>
        <Grid container spacing={5} alignItems="center">
          <Grid item xs={12} md={7}>
            <SectionTitle variant="h3">
              Money For People
            </SectionTitle>
            <Typography
              variant="body1"
              sx={{ color: '#555', lineHeight: 1.9, mb: 3, fontSize: '1.05rem' }}
            >
              <strong>We are all connected.</strong> Any two people on the planet are 
              bound to be linked by a web of personal relationships. Instead of using 
              money to cooperate with each other, two strangers can give to each other 
              like friends.
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#555', lineHeight: 1.9, mb: 3, fontSize: '1.05rem' }}
            >
              The resulting obligations are carried by the web of personal relationships 
              connecting them. All we really need is a system for finding these connections.
            </Typography>
            <Box
              sx={{
                p: 3,
                borderRadius: '12px',
                backgroundColor: '#e8f4f8',
                borderLeft: '4px solid #1d90b5',
              }}
            >
              <Typography variant="body1" sx={{ color: '#1d90b5', fontWeight: 500 }}>
                That system is <strong>RumplePay</strong> — the technology that powers 
                the Villages marketplace, enabling trust-based transactions between 
                people connected through their relationships.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <SectionImage src={connectionImage} alt="Connected community" />
          </Grid>
        </Grid>
      </SectionCard>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Paper
          sx={{
            py: 6,
            px: 4,
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #1695c8 0%, #1d90b5 100%)',
            color: 'white',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Join the Movement
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: '500px', mx: 'auto' }}>
            Be part of a community that values what truly matters — 
            relationships, passion, and human connection over abstract numbers.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Index;
