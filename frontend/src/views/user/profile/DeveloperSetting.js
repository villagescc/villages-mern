import React, { useEffect, useState } from 'react'
import { Alert, Button, FormControl, Grid, IconButton, InputAdornment, Snackbar, Stack, TextField, Typography } from '@mui/material'
import { gridSpacing } from 'store/constant'
import { v4 as UIDV4 } from 'uuid';
import useAuth from 'hooks/useAuth'
import SubCard from 'ui-component/cards/SubCard'
import AnimateButton from 'ui-component/extended/AnimateButton'
import { getDeveloperSettings, saveDeveloperSettings } from 'store/slices/user'
import { useDispatch, useSelector } from 'react-redux'
import { AddOutlined, ContentCopyOutlined, DeleteOutlined } from '@mui/icons-material'
const DeveloperSetting = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const { developerSettings: settings, error } = useSelector((state) => state.user);

    const [profileSettingsData, setProfileSettingsData] = useState({
        applicationName: "",
        clientSecret: "",
        secretKey: "",
        whitelistedEndpoint: [""],
        redirectUrl: ""
    });

    const [errors, setErrors] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        dispatch(getDeveloperSettings());
    }, [user]);

    useEffect(() => {
        setProfileSettingsData({
            ...profileSettingsData,
            applicationName: settings?.applicationName,
            clientSecret: settings?.clientSecret,
            secretKey: settings?.secretKey,
            whitelistedEndpoint: settings?.whitelistedEndpoint?.length > 0 ? settings?.whitelistedEndpoint : [''],
            redirectUrl: settings?.redirectUrl
        })
    }, [settings]);

    useEffect(() => {
        setErrors(error)
    }, [error])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileSettingsData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '', // Clear the error message when the user starts typing
        }));
    };

    const handleSave = () => {
        // Initialize an empty errors object
        let validationErrors = {};
        const httpsRegex = /^https:\/\//;
        // Check for empty fields
        if (!profileSettingsData?.applicationName?.trim()) {
            validationErrors.applicationName = 'Application Name is required';
        }
        if (!profileSettingsData?.clientSecret?.trim()) {
            validationErrors.clientSecret = 'Client Secret Key is required';
        }
        if (!profileSettingsData?.secretKey?.trim()) {
            validationErrors.secretKey = 'Secret Key is required';
        }
        if (!profileSettingsData?.redirectUrl?.trim()) {
            validationErrors.redirectUrl = 'Redirect URL is required';
        } else if (!httpsRegex.test(profileSettingsData.redirectUrl)) {
            validationErrors.redirectUrl = 'Redirect URL must start with "https"';
        }

        if (profileSettingsData?.whitelistedEndpoint?.length == 1 && profileSettingsData?.whitelistedEndpoint[0] == '') {
            validationErrors.whitelistedEndpoint = 'At least one whitelisted endpoint is required';
        } else {
            // Validate each whitelisted endpoint to start with "https"
            profileSettingsData.whitelistedEndpoint.forEach((endpoint, index) => {
                if (!httpsRegex.test(endpoint)) {
                    validationErrors[`whitelistedEndpoint.${index}`] = `Endpoint ${index + 1} must start with "https"`;
                }
            });
        }


        // Set errors if there are any validation errors
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; // Stop execution if there are errors
        }
        // Clear errors and proceed with the actual logic
        setErrors({});
        // Implement the functionality to save data or call an API
        dispatch(saveDeveloperSettings(profileSettingsData))
    };

    // Function to generate a 16-character key using uuidv4
    const generate16CharacterKey = () => {
        const uuid = UIDV4().replace(/-/g, ''); // Remove hyphens
        return uuid.slice(0, 16); // Get the first 16 characters
    };

    // Function to generate a 32-character key using uuidv4
    const generate32CharacterKey = () => {
        const uuid1 = UIDV4().replace(/-/g, ''); // Remove hyphens from the first UUID
        const uuid2 = UIDV4().replace(/-/g, ''); // Remove hyphens from the second UUID
        return (uuid1 + uuid2).slice(0, 32); // Concatenate and slice to get 32 characters
    };

    const handleGenerateKeys = () => {
        const newClientSecret = generate16CharacterKey(); // Generate a 16-character random key
        const newSecretKey = generate32CharacterKey(); // Generate a 32-character random key
        setProfileSettingsData((prevState) => ({
            ...prevState,
            clientSecret: newClientSecret,
            secretKey: newSecretKey,
        }));
    };

    const handleCopy = (keyType) => {
        let keyToCopy = '';

        if (keyType === 'clientSecret') {
            keyToCopy = profileSettingsData?.clientSecret || '';
        } else if (keyType === 'secretKey') {
            keyToCopy = profileSettingsData?.secretKey || '';
        }

        navigator.clipboard.writeText(keyToCopy)
            .then(() => {
                handleOpenSnackbar(); // Open Snackbar on success
            })
            .catch(err => {
                console.error('Failed to copy key:', err);
            });
    };

    const handleAddField = () => {
        // const httpsRegex = /^https:\/\//;
        // let validationErrors = {}
        // let last = profileSettingsData.whitelistedEndpoint[profileSettingsData.whitelistedEndpoint.length - 1];

        // // Validate each whitelisted endpoint to start with "https"
        // if (profileSettingsData.whitelistedEndpoint.length > 0) {
        //     const last = profileSettingsData.whitelistedEndpoint[profileSettingsData.whitelistedEndpoint.length - 1];
        //     if (!httpsRegex.test(last)) {
        //         validationErrors[`whitelistedEndpoint.${profileSettingsData.whitelistedEndpoint.length - 1}`] = `Endpoint ${profileSettingsData.whitelistedEndpoint.length - 1} must start with "https"`;
        //     }
        // }

        // if (Object.keys(validationErrors).length > 0) {
        //     setErrors(validationErrors);
        //     return; // Stop execution if there are errors
        // }
        setProfileSettingsData({ ...profileSettingsData, whitelistedEndpoint: [...profileSettingsData.whitelistedEndpoint, ''] })
    }


    const handleWhitelistInputChange = (index, value) => {
        const updatedEndpoints = [...profileSettingsData.whitelistedEndpoint];
        updatedEndpoints[index] = value; // Update the field value at the specified index
        setProfileSettingsData({ ...profileSettingsData, whitelistedEndpoint: updatedEndpoints });
    };

    const handleRemoveField = (index) => {
        const updatedEndpoints = [...profileSettingsData.whitelistedEndpoint];
        updatedEndpoints.splice(index, 1); // Remove the field at the specified index
        setProfileSettingsData({ ...profileSettingsData, whitelistedEndpoint: updatedEndpoints });
    };

    const handleOpenSnackbar = () => {
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <>
            <Grid container spacing={gridSpacing}>
                <Grid item sm={12} md={12}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <SubCard title="Developer Settings">
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="applicationName"
                                            fullWidth
                                            label="Application Name"
                                            value={profileSettingsData?.applicationName}
                                            InputLabelProps={{ shrink: true }}
                                            onChange={handleInputChange}
                                            error={Boolean(errors?.applicationName)}
                                            helperText={errors?.applicationName}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={5}>
                                        <TextField
                                            id="outlined-basic9"
                                            fullWidth
                                            name="clientSecret"
                                            type='text'
                                            label="Client Secret Key"
                                            value={profileSettingsData?.clientSecret}
                                            error={Boolean(errors?.clientSecret)}
                                            helperText={errors?.clientSecret}
                                            onChange={handleInputChange}
                                            InputLabelProps={{ shrink: true }}
                                            disabled={true}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="copy secret key"
                                                            onClick={() => handleCopy('clientSecret')}
                                                        >
                                                            <ContentCopyOutlined />
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />

                                    </Grid>
                                    <Grid item xs={12} md={5}>
                                        <TextField
                                            id="outlined-basic9"
                                            fullWidth
                                            name="secretKey"
                                            type='text'
                                            label="Secret Key"
                                            value={profileSettingsData?.secretKey}
                                            error={Boolean(errors?.secretKey)}
                                            InputLabelProps={{ shrink: true }}
                                            helperText={errors?.secretKey}
                                            onChange={handleInputChange}
                                            disabled={true}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="copy secret key"
                                                            onClick={() => handleCopy('secretKey')}
                                                        >
                                                            <ContentCopyOutlined />
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={2} sx={{ alignItems: "center", display: "flex" }}>
                                        <AnimateButton>
                                            <Button variant="outlined" onClick={handleGenerateKeys}
                                                disabled={profileSettingsData?.clientSecret && profileSettingsData?.secretKey}
                                            >
                                                Generate Keys
                                            </Button>
                                        </AnimateButton>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="h5" >Authorized Redirect URL</Typography>
                                        <Typography variant="caption">Please Add the Url where you want to Redirect After Successful Authentication. </Typography>
                                        <TextField
                                            name="redirectUrl"
                                            fullWidth
                                            label="Redirect Url"
                                            value={profileSettingsData?.redirectUrl}
                                            InputLabelProps={{ shrink: true }}
                                            onChange={handleInputChange}
                                            error={Boolean(errors?.redirectUrl)}
                                            helperText={errors?.redirectUrl}
                                            sx={{ mt: 2 }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="h5">Whitelisted endpoint</Typography>
                                        <Typography variant="caption">For use with request from browser</Typography>
                                        <FormControl fullWidth variant="outlined">
                                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                                {profileSettingsData?.whitelistedEndpoint?.map((endpoint, index) => (
                                                    <Grid item xs={12} md={10} key={index}>
                                                        <FormControl fullWidth variant="outlined" sx={{ position: 'relative' }}>
                                                            <TextField
                                                                fullWidth
                                                                InputLabelProps={{ shrink: true }}
                                                                label={` URL ${index + 1}`}
                                                                variant="outlined"
                                                                value={endpoint}
                                                                disabled={index < profileSettingsData?.whitelistedEndpoint.length - 1}
                                                                error={!!errors?.whitelistedEndpoint}
                                                                onChange={(e) => handleWhitelistInputChange(index, e.target.value)}
                                                                InputProps={{
                                                                    endAdornment: (
                                                                        <InputAdornment position="end">
                                                                            <IconButton color='error' aria-label="delete endpoint" onClick={() => handleRemoveField(index)}>
                                                                                <DeleteOutlined />
                                                                            </IconButton>
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                ))}
                                                <Grid item xs={12} md={2} sx={{ alignItems: "center", display: "flex" }}>
                                                    <AnimateButton>
                                                        <Button variant="outlined" onClick={handleAddField} startIcon={<AddOutlined />} disabled={profileSettingsData?.whitelistedEndpoint[0] == ''}>
                                                            Add URL
                                                        </Button>
                                                    </AnimateButton>
                                                </Grid>
                                                {errors?.whitelistedEndpoint && (
                                                    <p style={{ color: '#f44336', fontSize: '0.75rem', marginTop: '3px', marginLeft: "14px", marginRight: "14px", lineHeight: "1.66", fontWeight: 400 }}>
                                                        {errors.whitelistedEndpoint}
                                                    </p>
                                                )}
                                            </Grid>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack direction="row" spacing={2}>
                                            <AnimateButton>
                                                <Button variant="contained" onClick={handleSave}>
                                                    Save
                                                </Button>
                                            </AnimateButton>


                                        </Stack>
                                    </Grid>
                                </Grid>
                            </SubCard>
                        </Grid>
                    </Grid>
                </Grid >
            </Grid >
            {/* Snackbar Component */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Key copied to clipboard successfully!
                </Alert>
            </Snackbar>
        </>
    )
}

export default DeveloperSetting;
