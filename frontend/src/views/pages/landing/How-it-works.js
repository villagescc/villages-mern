// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Container, Grid, Typography, Box, Card, CardContent, Chip } from '@mui/material';

// project imports
import FadeInWhenVisible from './Animation';

// assets
import stepEndorse from 'assets/images/pages/step-endorse.png';
import stepInteract from 'assets/images/pages/step-interact.png';
import stepPay from 'assets/images/pages/step-pay.png';

// Styled components
const SectionWrapper = styled('div')(({ theme }) => ({
  padding: '80px 0',
  background: '#fff',
}));

const StepCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '20px',
  border: 'none',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  overflow: 'visible',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 48px rgba(22, 149, 200, 0.15)',
  },
}));

const StepNumber = styled(Box)(({ theme }) => ({
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #1695c8 0%, #1d90b5 100%)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  boxShadow: '0 8px 24px rgba(22, 149, 200, 0.3)',
}));

const StepImage = styled('img')({
  width: '100%',
  height: '200px',
  objectFit: 'contain',
  borderRadius: '12px',
  marginBottom: '20px',
  backgroundColor: '#fafbfc',
  padding: '16px',
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  textAlign: 'center',
}));

// =============================|| LANDING - HOW IT WORKS ||============================= //

const HowItWorks = () => {
  const theme = useTheme();

  const steps = [
    {
      number: 1,
      title: 'Endorse',
      subtitle: 'Build your trust network',
      image: stepEndorse,
      description: 'Vouch for people you trust. Set an hours credit limit that determines how much value they can transact through your network.',
      highlights: ['Vouch for trusted connections', 'Set credit limits', 'Write recommendations'],
    },
    {
      number: 2,
      title: 'Interact',
      subtitle: 'Connect with your community',
      image: stepInteract,
      description: 'Browse the feed to discover services and skills. Post what you need or what you can offer. Find trusted providers.',
      highlights: ['Find trusted providers', 'Post offers & requests', 'See reputation scores'],
    },
    {
      number: 3,
      title: 'Pay',
      subtitle: 'Exchange value naturally',
      image: stepPay,
      description: 'Acknowledge help with Villages hours. Payments flow through your trust network, creating a cycle of community reciprocity.',
      highlights: ['Pay in community hours', 'Automatic trust routing', 'No money needed'],
    },
  ];

  return (
    <SectionWrapper id="how-it-works">
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <FadeInWhenVisible>
            <Typography
              variant="overline"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                letterSpacing: 2,
                mb: 1,
                display: 'block',
              }}
            >
              SIMPLE & POWERFUL
            </Typography>
            <SectionTitle
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                color: '#1a1a2e',
              }}
            >
              How Villages Works
            </SectionTitle>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                maxWidth: '600px',
                mx: 'auto',
                fontSize: '1.1rem',
                lineHeight: 1.7,
              }}
            >
              Three simple steps to start exchanging value with people you trust, 
              without needing traditional money
            </Typography>
          </FadeInWhenVisible>
        </Box>

        <Grid container spacing={4}>
          {steps.map((step, index) => (
            <Grid item xs={12} md={4} key={step.number}>
              <FadeInWhenVisible>
                <StepCard>
                  <CardContent sx={{ p: 4 }}>
                    <StepNumber>{step.number}</StepNumber>
                    <StepImage src={step.image} alt={step.title} />
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        mb: 0.5,
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: '#888',
                        mb: 2,
                        fontWeight: 500,
                      }}
                    >
                      {step.subtitle}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#555',
                        mb: 2.5,
                        lineHeight: 1.7,
                      }}
                    >
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
                            color: theme.palette.primary.main,
                            fontWeight: 500,
                            fontSize: '0.75rem',
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </StepCard>
              </FadeInWhenVisible>
            </Grid>
          ))}
        </Grid>
      </Container>
    </SectionWrapper>
  );
};

export default HowItWorks;
