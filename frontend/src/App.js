// routing
import Routes from 'routes';

// project imports
import Locales from 'ui-component/Locales';
import NavigationScroll from 'layout/NavigationScroll';
import RTLLayout from 'ui-component/RTLLayout';
import Snackbar from 'ui-component/extended/Snackbar';
import DragDialog from "ui-component/extended/Dialog";
import ThemeCustomization from 'themes';

// auth provider
// import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
import { Helmet } from 'react-helmet';
// import { Auth0Provider as AuthProvider } from 'contexts/Auth0Context';

// ==============================|| APP ||============================== //

const App = () => (
    <ThemeCustomization>
        <RTLLayout>
            <Locales>
                <NavigationScroll>
                    <AuthProvider>
                        <>
                            <Helmet>
                                <title>Villages.io | Trust-Based Community Currency</title>
                                <meta name="description" content="Join a trust-based community where your time and skills create real value. Exchange services with neighbors using Villages Hours - no money needed." />
                                <meta name="keywords" content="community currency, local exchange, trust network, time banking, alternative currency, mutual credit, local economy, skill sharing, Villages Hours" />
                                <meta property="og:title" content="Villages.io | Everyone Has Value to Share" />
                                <meta property="og:description" content="A trust-based community currency where your time and skills create real value. Exchange services with neighbors without needing money." />
                                <meta property="og:image" content="https://villages.io/og-image.png" />
                                <meta property="og:type" content="website" />
                                <meta name="twitter:card" content="summary_large_image" />
                                <meta name="twitter:title" content="Villages.io | Everyone Has Value to Share" />
                                <meta name="twitter:description" content="A trust-based community currency where your time and skills create real value." />
                                <meta name="twitter:image" content="https://villages.io/og-image.png" />
                            </Helmet>
                            <Routes />
                            <Snackbar />
                            <DragDialog />
                        </>
                    </AuthProvider>
                </NavigationScroll>
            </Locales>
        </RTLLayout>
    </ThemeCustomization>
);

export default App;
