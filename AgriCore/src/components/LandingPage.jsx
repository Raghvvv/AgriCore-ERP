import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Box,
  Paper,
  Avatar,
  Card
} from '@mui/material';
import { styled, keyframes } from '@mui/system';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import BarChartIcon from '@mui/icons-material/BarChart';
import InventoryIcon from '@mui/icons-material/Inventory';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import InsightsIcon from '@mui/icons-material/Insights';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { useNavigate } from 'react-router-dom';

// --- Keyframe Animations ---

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// --- Styled Components ---

const HeroSection = styled(Box)(({ theme }) => ({
  color: theme.palette.common.white,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  background: `linear-gradient(45deg, #2E7D32, #1B5E20, #4CAF50)`,
  backgroundSize: '200% 200%',
  animation: `${gradientAnimation} 15s ease infinite`,
  padding: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
}));

const AnimatedBackground = () => (
  <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity: 0.1 }}>
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="smallGrid" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#smallGrid)" />
    </svg>
  </Box>
);

const Section = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  animation: `${fadeIn} 0.8s ease-out forwards`,
  position: 'relative'
}));

const FeaturePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#fff',
  '& .MuiSvgIcon-root': {
    transition: 'transform 0.3s ease-in-out',
  },
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: `0 20px 40px -10px ${theme.palette.primary.light}33`,
    '& .MuiSvgIcon-root': {
      transform: 'scale(1.2)',
    }
  },
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
}));

const TestimonialCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(3),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: theme.palette.background.paper,
}));

// --- Page Data ---

const features = [
  { icon: <InventoryIcon sx={{ fontSize: 50, color: 'primary.main' }} />, title: 'Smart Inventory', description: 'Effortlessly track supplies, manage stock levels, and get alerts for low inventory.' },
  { icon: <AgricultureIcon sx={{ fontSize: 50, color: 'primary.main' }} />, title: 'Crop Management', description: 'Monitor crop health, track growth stages, and optimize your planting and harvesting schedule.' },
  { icon: <BarChartIcon sx={{ fontSize: 50, color: 'primary.main' }} />, title: 'Financial Analytics', description: 'Gain insights into your farm\'s financial performance with intuitive charts and reports.' }
];

const howItWorks = [
    { icon: <ConnectWithoutContactIcon sx={{ fontSize: 40 }}/>, title: 'Connect Your Data', description: 'Easily import data from your existing tools and sensors.'},
    { icon: <InsightsIcon sx={{ fontSize: 40 }}/>, title: 'Gain Insights', description: 'Our AI analyzes your data to provide actionable recommendations.'},
    { icon: <RocketLaunchIcon sx={{ fontSize: 40 }}/>, title: 'Optimize Performance', description: 'Make data-driven decisions to boost yield and profitability.'}
];

const testimonials = [
    { quote: "AgriCore-ERP transformed our operations. Our efficiency is up 30%!", author: "John Smith", company: "Green Valley Farms"},
    { quote: "The best farm management platform on the market. Intuitive and powerful.", author: "Jane Doe", company: "Sunrise Agriculture"},
    { quote: "I can't imagine running my farm without it. A must-have for any modern farmer.", author: "Peter Jones", company: "Oakside Family Farm"},
]


const LandingPage = () => {
    const navigate = useNavigate();
    const handleLoginClick = () => navigate('/login');
    const handleSignup= ()=> navigate('/signup');

    return (
    <Box sx={{ flexGrow: 1, backgroundColor: 'grey.50' }}>
      <AppBar position="absolute" color="transparent" elevation={0} sx={{ zIndex: 2 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>AgriCore-ERP</Typography>
          <Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={handleLoginClick}>Login</Button>
        </Toolbar>
      </AppBar>

      <HeroSection>
        <AnimatedBackground />
        <Container sx={{ zIndex: 1 }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, letterSpacing: '0.05rem' }}>
            The Future of Farm Management
            </Typography>
            <Typography variant="h5" component="p" gutterBottom sx={{ mb: 4, maxWidth: '700px', margin: 'auto' }}>
            Integrate your crop management, inventory, and finances into one seamless, intelligent platform.
            </Typography>
            <Button variant="contained" size="large" onClick={handleSignup} sx={{ 
                mt: 4,
                backgroundColor: 'white',
                 
                color: 'primary.dark',
                '&:hover': { backgroundColor: 'grey.200' }
            }}>
            Get Started
            </Button>
        </Container>
      </HeroSection>

      <Section>
        <Container>
            <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ fontWeight: 600, mb: 8 }}>
            Everything Your Farm Needs
            </Typography>
            <Grid container spacing={4} justifyContent="center">
            {features.map((feature, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
                <FeaturePaper elevation={2}>
                    {feature.icon}
                    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>{feature.title}</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ flexGrow: 1 }}>{feature.description}</Typography>
                </FeaturePaper>
                </Grid>
            ))}
            </Grid>
        </Container>
      </Section>
      
      <Section sx={{ backgroundColor: 'white' }}>
          <Container>
            <Typography variant="h4" component="h2" align="center" sx={{ fontWeight: 600, mb: 10 }}>How It Works</Typography>
            <Grid container spacing={4} justifyContent="center">
                {howItWorks.map((step, index) => (
                    <Grid item key={index} xs={12} md={3} sx={{ textAlign: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80, margin: 'auto', mb: 2 }}>{step.icon}</Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{step.title}</Typography>
                        <Typography color="text.secondary">{step.description}</Typography>
                    </Grid>
                ))}
            </Grid>
          </Container>
      </Section>

      <Section>
          <Container>
            <Typography variant="h4" component="h2" align="center" sx={{ fontWeight: 600, mb: 8 }}>Trusted by Farmers Everywhere</Typography>
            <Grid container spacing={4} justifyContent="center">
                {testimonials.map((testimonial, index) => (
                    <Grid item key={index} xs={12} md={4} sx={{ display: 'flex' }}>
                        <TestimonialCard variant="outlined">
                            <FormatQuoteIcon sx={{ color: 'primary.light' }}/>
                            <Typography variant="body1" sx={{ fontStyle: 'italic', my: 2, flexGrow: 1 }}>"{testimonial.quote}"</Typography>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>- {testimonial.author}</Typography>
                                <Typography variant="body2" color="text.secondary">{testimonial.company}</Typography>
                            </Box>
                        </TestimonialCard>
                    </Grid>
                ))}
            </Grid>
          </Container>
      </Section>

      <Box component="footer" sx={{ backgroundColor: 'primary.dark', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h6" align="center" gutterBottom>AgriCore-ERP</Typography>
          <Typography variant="subtitle1" align="center" component="p">Your all-in-one solution for modern farm management.</Typography>
          <Typography variant="body2" color="inherit" align="center" sx={{ mt: 4 }}>
            {'© '}{new Date().getFullYear()}{' AgriCore-ERP. All rights reserved.'}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage;
