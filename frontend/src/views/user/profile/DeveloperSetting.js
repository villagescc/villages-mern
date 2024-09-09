import React, { useEffect, useState } from 'react'
import { Button, FormControl, Grid, InputLabel, Stack, TextField } from '@mui/material'
import { gridSpacing } from 'store/constant'
import SubCard from 'ui-component/cards/SubCard'
import AnimateButton from 'ui-component/extended/AnimateButton'
import CreatableSelect from 'react-select/creatable';
import { getDeveloperSettings, saveDeveloperSettings } from 'store/slices/user'
import { useDispatch } from 'react-redux'
import useAuth from 'hooks/useAuth'
import { useSelector } from 'react-redux'
const DeveloperSetting = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const { developerSettings: settings, error } = useSelector((state) => state.user);

    const [profileSettingsData, setProfileSettingsData] = useState({
        applicationName: "",
        clientSecret: "",
        secretKey: "",
        whitelistedEndpoint: []
    });

    const [errors, setErrors] = useState({});


    useEffect(() => {
        dispatch(getDeveloperSettings());
    }, [user]);


    useEffect(() => {
        setProfileSettingsData({
            ...profileSettingsData,
            applicationName: settings?.applicationName,
            clientSecret: settings?.clientSecret,
            secretKey: settings?.secretKey,
            whitelistedEndpoint: settings?.whitelistedEndpoint
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
        if (profileSettingsData?.whitelistedEndpoint?.length === 0) {
            validationErrors.whitelistedEndpoint = 'At least one whitelisted endpoint is required';
        }

        // Set errors if there are any validation errors
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; // Stop execution if there are errors
        }

        // Clear errors and proceed with the actual logic
        setErrors({});
        // Implement the functionality to save data or call an API
        const convertedDeveloperSettings = {
            ...profileSettingsData,
            whitelistedEndpoint: profileSettingsData?.whitelistedEndpoint.map((endpoint) => ({
                endpoint: endpoint.label,
            })),
        };
        saveDeveloperSettings(convertedDeveloperSettings);
    };

    const generateRandomKey = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const handleCreatableChange = (newValue) => {
        setProfileSettingsData((prevState) => ({
            ...prevState,
            whitelistedEndpoint: newValue || [], // Store the selected or created options
        }));
    };


    const handleGenerateKeys = () => {
        const newClientSecret = generateRandomKey(16); // Generate a 16-character random key
        const newSecretKey = generateRandomKey(32); // Generate a 32-character random key

        setProfileSettingsData((prevState) => ({
            ...prevState,
            clientSecret: newClientSecret,
            secretKey: newSecretKey,
        }));

    };
    return (
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
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="clientSecret"
                                        fullWidth
                                        label="Client Secret Key"
                                        value={profileSettingsData?.clientSecret}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={handleInputChange}
                                        error={Boolean(errors?.clientSecret)}
                                        helperText={errors?.clientSecret}
                                        disabled={true}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="secretKey"
                                        fullWidth
                                        label="Secret Key"
                                        value={profileSettingsData?.secretKey}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={handleInputChange}
                                        error={Boolean(errors?.secretKey)}
                                        helperText={errors?.secretKey}
                                        disabled={true}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined" sx={{ position: "relative" }}>
                                        <InputLabel
                                            shrink
                                            sx={{
                                                backgroundColor: 'white',
                                                px: 1,
                                                position: 'absolute',
                                                left: '-4px',
                                                top: '3px',
                                                zIndex: 1,
                                                color: errors?.whitelistedEndpoint ? '#f44336' : '#9e9e9e',
                                            }}
                                        >
                                            Whitelisted Endpoints
                                        </InputLabel>
                                        <CreatableSelect
                                            isMulti
                                            options={profileSettingsData.whitelistedEndpoint}
                                            onChange={handleCreatableChange}
                                            value={profileSettingsData.whitelistedEndpoint}
                                            placeholder="Please Add whitelisted endpoints..."
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    borderColor: errors?.whitelistedEndpoint ? "#f44336" : '#bdbdbd',
                                                    '&:hover': { borderColor: '#000' },
                                                    minHeight: '56px',
                                                    boxShadow: 'none',
                                                    borderRadius: '8px',
                                                    minHeight: "51px",
                                                    backgroundColor: "#fafafa"
                                                }),
                                            }}
                                        />
                                        {errors?.whitelistedEndpoint && (
                                            <p style={{ color: '#f44336', fontSize: '0.75rem', marginTop: '3px', marginLeft: "14px", marginRight: "14px", lineHeight: "1.66", fontWeight: 400 }}>
                                                {errors.whitelistedEndpoint}
                                            </p>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack direction="row" spacing={2}>
                                        <AnimateButton>
                                            <Button variant="contained" onClick={handleSave}>
                                                Save
                                            </Button>
                                        </AnimateButton>
                                        <AnimateButton>
                                            <Button variant="contained" onClick={handleGenerateKeys}
                                                disabled={profileSettingsData?.clientSecret && profileSettingsData?.secretKey}
                                            >
                                                Generate Keys
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
    )
}

export default DeveloperSetting;
