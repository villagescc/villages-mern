import { useEffect, useRef, useState } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Button,
    ClickAwayListener,
    Paper,
    Popper,
    Tab,
    Tabs,
    useMediaQuery
} from '@mui/material';

// project imports
import Transitions from 'ui-component/extended/Transitions';

// assets
// import { IconBell } from '@tabler/icons';
import { SERVER_URL } from "config";
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { useDispatch, useSelector } from 'store';
import QrReader from 'modern-react-qr-reader';
import { TabContext, TabPanel } from '@mui/lab';
import MainCard from 'ui-component/cards/MainCard';
import axios from 'axios';
import useAuth from 'hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import IosShareIcon from '@mui/icons-material/IosShare';


const ScanQRCode = () => {
    const anchorRef = useRef(null);
    const theme = useTheme();
    const { user } = useAuth();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const navigate = useNavigate()
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(false);
    const [hasCam, setHasCam] = useState(false)
    const [value, setValue] = useState(0);

    useEffect(() => {
        async function name() {
            let bool = false
            let md = navigator.mediaDevices;
            const res = await md.enumerateDevices()
            bool = res.some(devices => devices.kind === 'videoinput')
            // alert(JSON.stringify(res.map(d => d.kind)))
            // const permissions = await navigator.permissions.query({ name: "camera" })
            if (!md || !md.enumerateDevices) bool = true
            // md.enumerateDevices().then(devices => {
            //   bool = true
            // }).catch(() => {
            //   bool = false
            // })
            try {
                const res = await md.enumerateDevices()
                bool = res.some(devices => devices.kind === 'videoinput')
                // const devices = res.map(devices => devices.deviceId)
                // if (permissions.state === 'denied') {
                //     bool = false
                // }
                // alert(devices)
            } catch (error) {
                bool = false
            }
            setHasCam(bool)
            setValue(bool ? 0 : 1)
        }
        name()
    }, [])

    return (
        <>
            <Avatar
                variant="rounded"
                ref={anchorRef}
                sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: 'all .2s ease-in-out',
                    background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
                    color: theme.palette.mode === 'dark' ? theme.palette.warning.dark : theme.palette.secondary.dark,
                    '&[aria-controls="menu-list-grow"],&:hover': {
                        background: theme.palette.mode === 'dark' ? theme.palette.warning.dark : theme.palette.secondary.dark,
                        color: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.secondary.light
                    }
                }}
                aria-haspopup="true"
                aria-controls={open ? 'menu-list-grow' : undefined}
                onClick={() => {
                    setOpen((prevOpen) => !prevOpen);
                }}
                color="inherit"
            >
                <QrCodeScannerIcon stroke={1.5} size="20px" />
            </Avatar>
            <Popper
                placement={matchesXs ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                modifiers={[
                    {
                        name: 'offset',
                        options: {
                            offset: [matchesXs ? 5 : 0, 20]
                        }
                    }
                ]}
            >
                {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={(event) => {
                        if (anchorRef.current && anchorRef.current.contains(event.target)) {
                            return;
                        }
                        setOpen(false);
                    }}>
                        <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
                            <Paper>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <Tabs
                                        onChange={handleChange}
                                        value={value}
                                    >
                                        <Tab label="Scan QR code" disabled={!hasCam} />
                                        <Tab label="My QR code" />
                                    </Tabs>
                                    <TabContext value={value}>
                                        <TabPanel value={0} sx={{ width: "300px" }}>
                                            {(value === 0 && hasCam && open) && <QrReader
                                                delay={1500}
                                                onError={(error) => {
                                                    console.info(error);
                                                }}
                                                // constraints={{
                                                //     video: { facingMode: { ideal: "environment" } }
                                                // }}
                                                // facingMode={"environment"}
                                                // constraints={{ facingMode: 'environment', }}
                                                onScan={(result) => {
                                                    if (!!result) {
                                                        const url = new URL(result)
                                                        setOpen(false)
                                                        navigate(url.pathname)
                                                    }
                                                }}
                                                style={{ width: '100%', height: "100%" }}
                                            />}
                                        </TabPanel>
                                        <TabPanel value={1} sx={{ width: "300px", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                                            <img src={`https://quickchart.io/qr?text=${encodeURI(`${SERVER_URL}/${user.username}`)}&size=200&centerImageUrl=${`${user?.profile?.avatar ? `${SERVER_URL}/upload/avatar/${user?.profile?.avatar}` : `${SERVER_URL}/upload/avatar/default.png`}`}`} alt="scan qr code" />
                                            <Button onClick={async () => {
                                                try {
                                                    if (navigator.canShare({ url: `${SERVER_URL}/${user.username}` })) {
                                                        await navigator.share({ url: `${SERVER_URL}/${user.username}` })
                                                    }
                                                } catch (error) {
                                                    console.log(error);
                                                }
                                            }}>
                                                <IosShareIcon />
                                            </Button>
                                        </TabPanel>
                                    </TabContext>
                                </MainCard>
                            </Paper>
                        </Transitions>
                    </ClickAwayListener>
                )}
            </Popper>
        </>
    );
};

export default ScanQRCode;
