import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import useAuth from 'hooks/useAuth';
import { openSnackbar } from 'store/slices/snackbar';
import { dispatch } from 'store';

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for controller
 * @param {PropTypes.node} children children element/node
 */
const AdminGuard = ({ children }) => {
    const { isLoggedIn, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.isSuperuser) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Permission denied!',
                    variant: 'alert',
                    alert: {
                        color: 'error',
                        severity: 'error'
                    },
                    close: false
                })
            );
            navigate('/home', { replace: true });
        }
    }, [isLoggedIn, navigate]);

    return children;
};

AdminGuard.propTypes = {
    children: PropTypes.node
};

export default AdminGuard;
