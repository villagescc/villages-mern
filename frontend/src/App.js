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
                                <title>Villages.io</title>
                                <meta name="description" content="Local Exchange Trading with A Network You Trust" />
                                <meta name="keywords" content="Web of Trust, villages, credit line, interledger, routing payment" />
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
