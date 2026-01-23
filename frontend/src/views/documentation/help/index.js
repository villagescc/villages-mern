import React from 'react';
import { Typography, Box, Grid, Card, CardContent, Container, Paper, Chip, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

// Import images
import heroImage from 'assets/images/pages/how-it-works-hero.png';
import stepEndorse from 'assets/images/pages/step-endorse.png';
import stepInteract from 'assets/images/pages/step-interact.png';
import stepPay from 'assets/images/pages/step-pay.png';
import cycle from 'assets/images/pages/cycle-of-credit.png';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f0f9fc 0%, #e8f4f8 100%)',
  borderRadius: '24px',
  padding: theme.spacing(6),
  marginBottom: theme.spacing(6),
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
}));

const HeroImage = styled('img')({
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '16px',
  marginTop: '24px',
  boxShadow: '0 20px 60px rgba(22, 149, 200, 0.15)',
});

const StepCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '20px',
  border: 'none',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  overflow: 'visible',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(22, 149, 200, 0.15)',
  },
}));

const StepNumber = styled(Box)(({ theme }) => ({
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #1695c8 0%, #1d90b5 100%)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.25rem',
  fontWeight: 700,
  marginBottom: theme.spacing(2),
}));

const StepImage = styled('img')({
  width: '100%',
  height: '220px',
  objectFit: 'contain',
  borderRadius: '12px',
  marginBottom: '16px',
  backgroundColor: '#fafbfc',
  padding: '12px',
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: '#1d90b5',
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  textAlign: 'center',
}));

const FeatureBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  textAlign: 'center',
  height: '100%',
  border: '2px solid #e8f4f8',
  boxShadow: 'none',
  transition: 'border-color 0.3s ease',
  '&:hover': {
    borderColor: '#1695c8',
  },
}));

const CycleImage = styled('img')({
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '16px',
});

const Index = () => {
  const steps = [
    {
      number: 1,
      title: 'Endorse',
      subtitle: 'Build your trust network',
      image: stepEndorse,
      description: 'Endorse people you trust to join your network. Set an hours credit limit that determines how much value they can transact through you.',
      highlights: ['Vouch for trusted connections', 'Set credit limits in hours', 'Write recommendations'],
    },
    {
      number: 2,
      title: 'Interact',
      subtitle: 'Connect with your community',
      image: stepInteract,
      description: 'Browse the feed to find services and skills. Post what you need or offer. Meet people connected through your trust network.',
      highlights: ['Find trusted service providers', 'Post offers & requests', 'See reputation scores'],
    },
    {
      number: 3,
      title: 'Pay',
      subtitle: 'Exchange value naturally',
      image: stepPay,
      description: 'Acknowledge help with Villages payments. Your "hours" flow through the trust network, creating a cycle of reciprocity.',
      highlights: ['Pay in community hours', 'Automatic trust routing', 'No money needed'],
    },
  ];

  return (
    <Box sx={{ pb: 6 }}>
      {/* Hero Section */}
      <HeroSection>
        <Typography variant="h2" sx={{ fontWeight: 700, color: '#1d90b5', mb: 2 }}>
          How Villages Works
        </Typography>
        <Typography variant="h6" sx={{ color: '#666', maxWidth: '600px', mx: 'auto', mb: 3, fontWeight: 400 }}>
          A trust-based community currency where your time and skills create real value for your neighbors
        </Typography>
        <HeroImage src={heroImage} alt="Villages community helping each other" />
      </HeroSection>

      {/* Steps Section */}
      <Box sx={{ mb: 8 }}>
        <SectionTitle variant="h3">Three Simple Steps</SectionTitle>
        <Typography variant="body1" sx={{ textAlign: 'center', color: '#666', mb: 5, maxWidth: '700px', mx: 'auto' }}>
          Villages makes it easy to exchange value with people you trust, without needing traditional money
        </Typography>

        <Grid container spacing={4}>
          {steps.map((step) => (
            <Grid item xs={12} md={4} key={step.number}>
              <StepCard>
                <CardContent sx={{ p: 3 }}>
                  <StepNumber>{step.number}</StepNumber>
                  <StepImage src={step.image} alt={step.title} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1d90b5', mb: 0.5 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#888', mb: 2, fontWeight: 500 }}>
                    {step.subtitle}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555', mb: 2, lineHeight: 1.7 }}>
                    {step.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {step.highlights.map((highlight, idx) => (
                      <Chip
                        key={idx}
                        label={highlight}
                        size="small"
                        sx={{
                          backgroundColor: '#e8f4f8',
                          color: '#1d90b5',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </StepCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Payment Flow Section */}
      <Box sx={{ mb: 8 }}>
        <Paper
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #fafbfc 0%, #f5f7f9 100%)',
            border: '1px solid #e8ecef',
          }}
        >
          <SectionTitle variant="h3">How Payments Flow</SectionTitle>
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#666', mb: 5, maxWidth: '800px', mx: 'auto' }}>
            Villages payments travel through your trust network. When you pay someone, the system finds a path of endorsed connections between you.
          </Typography>

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <CycleImage src={cycle} alt="Cycle of credit illustration" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ pl: { md: 3 } }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
                  The Trust Network in Action
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ color: '#555', mb: 2, lineHeight: 1.8 }}>
                    <strong>Example:</strong> Sally wants to pay Eta for picking up her kids. They don't know each other directly, but they're connected through trusted friends.
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#555', mb: 2, lineHeight: 1.8 }}>
                    The payment flows: Sally → John → Robert → Eta. Each person only exchanges promises with someone they've personally endorsed.
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.8 }}>
                    <strong>Result:</strong> Eta receives meaningful promises from someone she trusts, not a stranger. The whole community gets stronger.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Villages Hours Section */}
      <Box>
        <SectionTitle variant="h3">Villages Hours</SectionTitle>
        <Typography variant="body1" sx={{ textAlign: 'center', color: '#666', mb: 5, maxWidth: '600px', mx: 'auto' }}>
          Our currency is backed by something real: a sustainable hour's wage in your community
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <FeatureBox>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e8f4f8 0%, #d0eaf2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <Typography variant="h3" sx={{ color: '#1d90b5' }}>⏱</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
                Stable Value
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.7 }}>
                A sustainable hour's wage is different in every community, but it always remains a stable measure of value. From this base, members negotiate fair prices for their products and services.
              </Typography>
            </FeatureBox>
          </Grid>
          <Grid item xs={12} md={6}>
            <FeatureBox>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e8f4f8 0%, #d0eaf2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <Typography variant="h3" sx={{ color: '#1d90b5' }}>🌍</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
                Universal System
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.7 }}>
                This is an effective complementary currency system that can be used anywhere in the world. What is a sustainable wage in your community? Start exchanging value today.
              </Typography>
            </FeatureBox>
          </Grid>
        </Grid>
      </Box>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', mt: 8 }}>
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
            Ready to Join Your Village?
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: '500px', mx: 'auto' }}>
            Start building trust, sharing skills, and creating value with your community today.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Index;
