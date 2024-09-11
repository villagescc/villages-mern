import React, { useEffect, useState } from 'react';
import { Alert, Button, FormControl, Grid, IconButton, InputAdornment, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { gridSpacing } from 'store/constant';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import useAuth from 'hooks/useAuth';
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { getDeveloperSettings, saveDeveloperSettings } from 'store/slices/user';
import { useDispatch, useSelector } from 'react-redux';
import { AddOutlined, ContentCopyOutlined, DeleteOutlined } from '@mui/icons-material';
import { copyToClipboard, generate16CharacterKey, generate32CharacterKey } from 'utils/helper/helper';

const fqdnRegex =
    /^(?!https?:\/\/)(?!localhost)(?!\d+\.\d+\.\d+\.\d+)(?!www\.)(?!\[(?:[A-Fa-f0-9:]+)\])([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(:\d{1,5})?$/;

// Define the Yup validation schema
const validationSchema = Yup.object().shape({
    applicationName: Yup.string().required('Application name must not be empty'),
    clientSecret: Yup.string().required('Client Secret Key must not be empty'),
    secretKey: Yup.string().required('Secret Key must not be empty'),
    redirectUrl: Yup.string()
        .test(
            'no-scheme',
            'Invalid domain: must not specify the scheme. (http:// or https://)',
            (value) => value && !/^https?:\/\//i.test(value) // Ensure it does not start with http:// or https://
        )
        .matches(fqdnRegex, 'Invalid domain: must be a top private domain')
        .required('Domain cannot be empty.'),
    whitelistedEndpoint: Yup.array()
        .of(
            Yup.string()
                .test(
                    'no-scheme',
                    'Invalid domain: must not specify the scheme. (http:// or https://)',
                    (value) => value && !/^https?:\/\//i.test(value) // Ensure it does not start with http:// or https://
                )
                .matches(fqdnRegex, 'Invalid domain: must be a top private domain')
                .required('Domain cannot be empty.')
        )
        .min(1, 'At least one valid domain is required.')
});

const DeveloperSetting = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const { developerSettings: settings, error } = useSelector((state) => state.user);

    const ClientSecret = 'clientSecret';
    const SecretKey = 'secretKey';

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
        trigger,
        setError
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            applicationName: '',
            clientSecret: '',
            secretKey: '',
            whitelistedEndpoint: [''],
            redirectUrl: ''
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'whitelistedEndpoint'
    });

    useEffect(() => {
        dispatch(getDeveloperSettings());
    }, [user]);

    useEffect(() => {
        if (settings) {
            setValue('applicationName', settings?.applicationName || '');
            setValue('clientSecret', settings?.clientSecret || '');
            setValue('secretKey', settings?.secretKey || '');
            setValue('whitelistedEndpoint', settings?.whitelistedEndpoint?.length > 0 ? settings?.whitelistedEndpoint : ['']);
            setValue('redirectUrl', settings?.redirectUrl || '');
        }
    }, [settings, setValue]);

    useEffect(() => {
        if (error) {
            Object.entries(error).forEach(([key, value]) => setError(key, { type: 'manual', message: value }));
        }
    }, [error]);

    const handleGenerateKeys = () => {
        setValue('clientSecret', generate16CharacterKey());
        setValue('secretKey', generate32CharacterKey());
    };

    const handleCopy = (keyType) => {
        if (keyType === ClientSecret) {
            copyToClipboard(getValues('clientSecret'));
        } else if (keyType === SecretKey) {
            copyToClipboard(getValues('secretKey'));
        }
        handleOpenSnackbar();
    };

    const handleOpenSnackbar = () => {
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const onSubmit = (data) => {
        console.log('data :>> ', data);
        dispatch(saveDeveloperSettings(data));
    };

    // Enhanced handleAddField function
    const handleAddField = async () => {
        const isValid = await trigger('whitelistedEndpoint'); // Trigger validation for whitelistedEndpoint array

        if (isValid) {
            append(''); // Only add new field if validation passes
        }
    };

    const handleRemoveField = (index) => {
        remove(index);
        // If all fields are removed, ensure a default field is present
        if (fields.length === 1) {
            append(''); // Re-add an empty field to keep at least one present
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={gridSpacing}>
                    <Grid item sm={12} md={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <SubCard title="Developer Settings">
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Controller
                                                name="applicationName"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Application Name"
                                                        InputLabelProps={{ shrink: true }}
                                                        error={Boolean(errors.applicationName)}
                                                        helperText={errors.applicationName?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={5} md={6}>
                                            <Controller
                                                name="clientSecret"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Client Secret Key"
                                                        InputLabelProps={{ shrink: true }}
                                                        error={Boolean(errors.clientSecret)}
                                                        helperText={errors.clientSecret?.message}
                                                        disabled
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        aria-label="copy secret key"
                                                                        onClick={() => handleCopy('clientSecret')}
                                                                        disabled={!getValues('clientSecret')}
                                                                    >
                                                                        <ContentCopyOutlined />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={5} md={6}>
                                            <Controller
                                                name="secretKey"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Secret Key"
                                                        InputLabelProps={{ shrink: true }}
                                                        error={Boolean(errors.secretKey)}
                                                        helperText={errors.secretKey?.message}
                                                        disabled
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        aria-label="copy secret key"
                                                                        onClick={() => handleCopy('secretKey')}
                                                                        disabled={!getValues('secretKey')}
                                                                    >
                                                                        <ContentCopyOutlined />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={2} md={12} sx={{ marginTop: '8px' }}>
                                            <AnimateButton>
                                                <Button
                                                    variant="outlined"
                                                    onClick={handleGenerateKeys}
                                                    disabled={getValues('clientSecret') && getValues('secretKey')}
                                                >
                                                    Generate Keys
                                                </Button>
                                            </AnimateButton>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="h5">Authorized Redirect URL</Typography>
                                            <Typography variant="caption">
                                                Destination URL where Villages will send access token after the user completes successful
                                                authentication.
                                            </Typography>
                                            <Controller
                                                name="redirectUrl"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Redirect Url"
                                                        placeholder="https://example.com"
                                                        InputLabelProps={{ shrink: true }}
                                                        error={Boolean(errors.redirectUrl)}
                                                        helperText={errors.redirectUrl?.message}
                                                        sx={{ mt: 2 }}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="h5">Whitelisted endpoint</Typography>
                                            <Typography variant="caption">
                                                Add URls to be whitelisted for authentication to achevied imporvement security.
                                            </Typography>
                                            <FormControl fullWidth variant="outlined">
                                                <Grid container spacing={2} sx={{ marginTop: '4px' }}>
                                                    {fields.map((field, index) => (
                                                        <Grid item lg={10} md={12} xs={12} key={field.id}>
                                                            <Controller
                                                                name={`whitelistedEndpoint.${index}`}
                                                                control={control}
                                                                render={({ field: innerField }) => (
                                                                    <TextField
                                                                        {...innerField}
                                                                        fullWidth
                                                                        label={`URL ${index + 1}`}
                                                                        variant="outlined"
                                                                        placeholder="example.com"
                                                                        InputLabelProps={{ shrink: true }}
                                                                        error={Boolean(errors?.whitelistedEndpoint?.[index])}
                                                                        helperText={errors?.whitelistedEndpoint?.[index]?.message}
                                                                        InputProps={{
                                                                            endAdornment: (
                                                                                <InputAdornment position="end">
                                                                                    <IconButton
                                                                                        color="error"
                                                                                        aria-label="delete endpoint"
                                                                                        onClick={() => handleRemoveField(index)}
                                                                                    >
                                                                                        <DeleteOutlined />
                                                                                    </IconButton>
                                                                                </InputAdornment>
                                                                            )
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                    ))}
                                                    <Grid
                                                        item
                                                        lg={2}
                                                        md={12}
                                                        style={{
                                                            paddingTop: fields.length === 0 ? '4px' : '22px'
                                                        }}
                                                    >
                                                        <AnimateButton>
                                                            <Button
                                                                variant="outlined"
                                                                onClick={() => handleAddField()}
                                                                startIcon={<AddOutlined />}
                                                            >
                                                                Add URL
                                                            </Button>
                                                        </AnimateButton>
                                                    </Grid>
                                                </Grid>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Stack direction="row" spacing={2}>
                                                <AnimateButton>
                                                    <Button type="submit" variant="contained">
                                                        Save
                                                    </Button>
                                                </AnimateButton>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </SubCard>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
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
    );
};

export default DeveloperSetting;
