import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import {Typography, Link, Box} from "@mui/material";
import FormattedTypo from "../components/FormattedTypo";

const Index = () => {
  return (
    <MainCard title={<Typography variant={"h3"}>PRIVACY</Typography>} >
      <FormattedTypo textAlign={"start"}>Since Villages is meant for discovering people in your area, most information you give is <strong>not private</strong>. This includes:</FormattedTypo>
      <Box sx={{paddingLeft: 3}}>
        <FormattedTypo textAlign={"start"} paddingBottom={0.5}>Your profile information</FormattedTypo>
        <FormattedTypo textAlign={"start"} paddingBottom={0.5}>Your posts</FormattedTypo>
        <FormattedTypo textAlign={"start"} paddingBottom={0.5}>Endorsements given and received (these are only available to registered users)</FormattedTypo>
        <FormattedTypo textAlign={"start"}>Your overall acknowledgement balance</FormattedTypo>
      </Box>
      <FormattedTypo textAlign={"start"}>Things that are completely or relatively private:</FormattedTypo>
      <Box sx={{paddingLeft: 3}}>
        <FormattedTypo textAlign={"start"} paddingBottom={0.5}>Your email address</FormattedTypo>
        <FormattedTypo textAlign={"start"} paddingBottom={0.5}>The contents of any messages sent to other users</FormattedTypo>
        <FormattedTypo textAlign={"start"} paddingBottom={0.5}>Individual acknowledgement balances with other users</FormattedTypo>
        <FormattedTypo textAlign={"start"} paddingBottom={0.5}>Details of acknowledgements given and received</FormattedTypo>
      </Box>
      <Box sx={{paddingLeft: 6}}>
        <FormattedTypo textAlign={"start"} paddingBottom={0.5}>When you send an acknowledgement through the network, the details are shared with users who are on the path travelled by the acknowledgement from sender to recipient.</FormattedTypo>
        <FormattedTypo textAlign={"start"}>Acknowledgement details may be available to more users in the future due to upcoming features.</FormattedTypo>
      </Box>
      <FormattedTypo textAlign={"start"}>Please do not use Villages thinking that other users will not be able to see details of your activities. Once Villages has grown to a certain number of users, we may add the option to keep more of your details private. However, to start with, we're building a service for people who want to put themselves out there and connect with others in their community.</FormattedTypo>
      <FormattedTypo textAlign={"start"}>If you want to try a Rumplepay (formerly Ripple) system with more privacy, please check out <Link href={"https://rumplepay.com/"}>Rumplepay</Link>. You may find it difficult to meet anybody there though :)</FormattedTypo>
      <FormattedTypo textAlign={"start"} paddingBottom={1}>Anonymous Visitors</FormattedTypo>
      <FormattedTypo textAlign={"start"}>Anonymous visitors to the site, who are not registered or logged in, can see your profile and your posts, but not your endorsements or acknowledgements.</FormattedTypo>
      <FormattedTypo textAlign={"start"} paddingBottom={1}>Search Engines</FormattedTypo>
      <FormattedTypo textAlign={"start"}>Villages requests that search engines not index any of your personal data, such as your profile or your posts, so it won't show up on Google or any other respectable search engine, even if anonymous visitors to the site can view it.</FormattedTypo>
      <FormattedTypo textAlign={"start"} paddingBottom={1}>Real Names & Handles</FormattedTypo>
      <FormattedTypo textAlign={"start"}>Villages does not require you to use your real name or reveal your real-world identity in any way, so feel free to use any handle that your friends can recognize.</FormattedTypo>
      <FormattedTypo textAlign={"start"} paddingBottom={1}>Tracking</FormattedTypo>
      <FormattedTypo textAlign={"start"}>Villages will not do creepy things like track your every click or sell your data to third parties. That isn't who we are.</FormattedTypo>
      <hr style={{marginTop: '1rem', marginBottom: '1rem', border: 0, borderTop: '1px solid rgba(0, 0, 0, 0.1)'}} />
      <FormattedTypo textAlign={"start"}>If you have any concerns about privacy, please <Link href={"https://villages.io/about/contact/"}>send us feedback</Link>.</FormattedTypo>
    </MainCard>
  );
};

export default Index;
