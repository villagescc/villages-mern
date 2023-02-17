// material-ui
import { styled } from '@mui/material/styles';

// project imports
import Header from './Header';
import HowItWorks from './How-it-works';
import Cycle from './Cycle';
import Hours from './Hours';
import Graph from './Graph';
import Subscribe from './Subscribe';
import Footer from './Footer';
import Customization from 'layout/Customization';
import AppBar from 'ui-component/extended/AppBar';

const HeaderWrapper = styled('div')(({ theme }) => ({
    paddingTop: 78,
    overflowX: 'hidden',
    overflowY: 'clip',
    [theme.breakpoints.down('md')]: {
        paddingTop: 42
    }
}));

const SecondWrapper = styled('div')(({ theme }) => ({
    paddingTop: 64,
    [theme.breakpoints.down('md')]: {
        paddingTop: 60
    }
}));

// =============================|| LANDING MAIN ||============================= //

const Landing = () => (
    <>
        <HeaderWrapper id="home">
            <AppBar />
            <Header />
        </HeaderWrapper>
        <SecondWrapper>
            <HowItWorks />
        </SecondWrapper>
        <SecondWrapper>
            <Cycle />
        </SecondWrapper>
        <SecondWrapper>
            <Hours />
        </SecondWrapper>
        <SecondWrapper>
            <Graph />
        </SecondWrapper>
        <SecondWrapper>
            <Subscribe />
        </SecondWrapper>
        <Footer />
        <Customization />
    </>
);

export default Landing;
