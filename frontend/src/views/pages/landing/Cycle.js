import { useTheme, styled } from '@mui/material/styles';

// material-ui
import { Container, Grid, Typography, Box, Paper } from '@mui/material';

// project imports
import FadeInWhenVisible from './Animation';

// assets
import cycle from 'assets/images/pages/cycle-of-credit.png';

// Styled components
const SectionWrapper = styled('div')(({ theme }) => ({
  padding: '80px 0',
  background: 'linear-gradient(180deg, #f8fbfc 0%, #fff 100%)',
}));

const ContentCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: '24px',
  background: '#fff',
  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.06)',
  border: '1px solid #e8ecef',
}));

const CycleImage = styled('img')({
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '16px',
});

// ==============================|| LANDING - CYCLE SECTION ||============================== //

const Cycle = () => {
  const theme = useTheme();

  return (
    <SectionWrapper>
      <Container maxWidth="lg">
        <ContentCard>
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={6}>
              <FadeInWhenVisible>
                <CycleImage src={cycle} alt="Cycle of credit illustration" />
              </FadeInWhenVisible>
            </Grid>
            <Grid item xs={12} md={6}>
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
                  THE TRUST NETWORK
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: '#1a1a2e',
                    mb: 3,
                    fontSize: { xs: '1.75rem', md: '2rem' },
                  }}
                >
                  Full Cycle of Credit
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#555',
                    mb: 3,
                    lineHeight: 1.8,
                    fontSize: '1.05rem',
                  }}
                >
                  Money is an agreement within a community to encourage collaboration 
                  by keeping track of checks and balances. Villages creates a natural 
                  cycle where value flows through trusted connections.
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body1"
                    sx={{ color: '#555', lineHeight: 1.8, mb: 2 }}
                  >
                    <strong>Example:</strong> Sally wants to pay Eta for picking up her kids. 
                    They don't know each other directly, but they're connected through trusted friends.
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: '#555', lineHeight: 1.8, mb: 2 }}
                  >
                    The payment flows: Sally → John → Robert → Eta. Each person only 
                    exchanges promises with someone they've personally endorsed.
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: theme.palette.primary.main, fontWeight: 600, lineHeight: 1.8 }}
                  >
                    Result: Eta receives meaningful value from someone she trusts. 
                    The whole community gets stronger.
                  </Typography>
                </Box>
              </FadeInWhenVisible>
            </Grid>
          </Grid>
        </ContentCard>
      </Container>
    </SectionWrapper>
  );
};

export default Cycle;
