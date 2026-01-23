import React from 'react';

// material-ui
// import { useTheme } from '@mui/material/styles';
import { Autocomplete, Grid, TextField, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// import NewUsers from './NewUsers';
import MostActiveUsers from './MostActiveUsers';
// import VillageHours from './VillageHours';
// import CreditLines from './CreditLines';
import AnalyticsCards from './AnalyticsCards';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { useState } from 'react';
import { Box } from '@mui/system';
// import FormControlSelect from 'ui-component/extended/Form/FormControlSelect';
// import { radius } from 'constant';
import PlacesAutocomplete, { geocodeByPlaceId } from 'react-places-autocomplete';
import MostConnectedUsers from './MostConnectedUser';
// import RecentPayments from './RecentPayments';

const Index = () => {
    const [period, setPeriod] = useState([null, null])
    const [dateRange, setDateRange] = useState([null, null])
    const [location, setLocation] = useState({ description: '', placeId: '' });
    const [selectedOptions, setSelectedOptions] = useState({ description: "", placeId: "" })
    // const [filterData, setFilterData] = useState({ radius: "" })
    return (
        <MainCard
            title={
                <Grid container justifyContent="space-between" alignItems="center" spacing={gridSpacing}>
                    <Grid item xs={12} md={3} lg={6}>
                        <Typography variant="h3">User Analytics</Typography>
                    </Grid>
                    <Grid item xs={12} md={9} lg={6}>
                        <Grid container spacing={3}>
                            {/* <Grid item xs={12} sm={6} lg={3} ></Grid> */}
                            <Grid item xs={12} sm={6} >
                                <PlacesAutocomplete
                                    value={location.description || ''}
                                    onChange={(address) => {
                                        setLocation({ description: address, placeId: '' })
                                    }}
                                >
                                    {({ getInputProps, suggestions }) => {
                                        return (
                                            <Autocomplete
                                                id="location"
                                                value={location}
                                                sx={{ width: '100%' }}
                                                options={suggestions.map((suggestion) => ({
                                                    description: suggestion.description,
                                                    placeId: suggestion.placeId
                                                }))}
                                                autoHighlight
                                                onInputChange={(event, newInputValue) => {
                                                    if (!!!newInputValue?.length) {
                                                        setSelectedOptions({ description: "", placeId: "" })
                                                        setLocation({ description: '', placeId: '' })
                                                    }
                                                }}
                                                getOptionLabel={(option) => option.description || ''}
                                                renderOption={(props, option) => (
                                                    <Box
                                                        component="li"
                                                        {...props}
                                                        onClick={async () => {
                                                            setLocation(option);
                                                            // geocodeByPlaceId(option.placeId).then(res => {
                                                            //     getLatLng(res[0]).then((res2 => {
                                                            //         setSelectedOptions(res2)
                                                            //     })).catch((e) => { console.log(e) })
                                                            // }).catch(() => { })
                                                            try {
                                                                const res = await geocodeByPlaceId(option.placeId)
                                                                // const res2 = await getLatLng(res[0].geometry.viewport)
                                                                setSelectedOptions(res[0].geometry.viewport)
                                                            } catch (error) {

                                                            } finally {
                                                                document.activeElement.blur()
                                                            }
                                                        }}
                                                    >
                                                        {option.description}
                                                    </Box>
                                                )}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        {...getInputProps({
                                                            placeholder: 'Search Places ...',
                                                            className: 'location-search-input'
                                                        })}
                                                        label='Location'
                                                    />
                                                )}
                                            />
                                        );
                                    }}
                                </PlacesAutocomplete>
                            </Grid>
                            {/* <Grid item xs={12} sm={6} md={3}>
                        <FormControlSelect
                            currencies={radius}
                            currency={filterData.radius}
                            onChange={(e) => {
                                setFilterData({ ...filterData, radius: e.target.value });
                            }}
                            captionLabel="Search area"
                        />
                    </Grid> */}
                            <Grid item xs={12} sm={6} >
                                <LocalizationProvider dateAdapter={AdapterDayjs} localeText={{ start: 'From', end: 'To' }}>
                                    <DateRangePicker
                                        value={dateRange}
                                        onClose={() => {
                                            setPeriod(dateRange)
                                        }}
                                        onChange={(newValue) => {
                                            setDateRange(newValue);
                                        }}
                                        renderInput={(startProps, endProps) => (
                                            <React.Fragment>
                                                <TextField {...startProps} sx={{ width: "100%" }} autoComplete='off' />
                                                <Box sx={{ mx: 2 }}> to </Box>
                                                <TextField {...endProps} sx={{ width: "100%" }} autoComplete='off' />
                                            </React.Fragment>
                                        )}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            }
        >
            <AnalyticsCards period={period} location={selectedOptions}></AnalyticsCards>
            {/* <NewUsers period={period}></NewUsers> */}
            {/* <VillageHours></VillageHours> */}
            {/* <CreditLines></CreditLines> */}
            <Grid container spacing={2} alignItems={'initial'}>
                {/* <NewUsers></NewUsers> */}
                <MostActiveUsers period={period} location={selectedOptions}></MostActiveUsers>
                <MostConnectedUsers period={period} location={selectedOptions}></MostConnectedUsers>
                {/* <RecentPayments period={period} location={selectedOptions}></RecentPayments> */}
            </Grid>
        </MainCard>
    );
};

export default Index;
