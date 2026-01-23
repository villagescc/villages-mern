import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import {Typography, Link, Box} from "@mui/material";
import FormattedTypo from "../components/FormattedTypo";

const Index = () => {
  return (
    <MainCard title={<Typography variant={"h3"}>MOTIVATION</Typography>}>
      <FormattedTypo textAlign={"start"}>The goal of Villages is to help people do what they love, rather than what they fear they must.</FormattedTypo>
      <FormattedTypo textAlign={"start"}>Many of us struggle with the contradiction between what we want to do, and and what we need to do to earn money to live. Rather than change our hours credit limit to suit what money asks of us, we want to change money to suit what is in our hours credit limit.</FormattedTypo>
      <FormattedTypo textAlign={"start"}>We want to create a system of interconnected, overlapping economic villages, where personal relationships take precedence over numbers, and each person is supported in following their passion.</FormattedTypo>
      <FormattedTypo textAlign={"start"} paddingBottom={1}>The Problem With Money</FormattedTypo>
      <FormattedTypo textAlign={"start"}>When we use regular money, we are participating in a system of tokens whose supply is centrally managed for the purposes of:</FormattedTypo>
      <Box sx={{paddingLeft: 3}}>
        <FormattedTypo textAlign={"start"} paddingBottom={0.5}>Price stability</FormattedTypo>
        <FormattedTypo textAlign={"start"} paddingBottom={0.5}>Low unemployment</FormattedTypo>
        <FormattedTypo textAlign={"start"} paddingBottom={0.5}>Foreign trade</FormattedTypo>
        <FormattedTypo textAlign={"start"}>Steady growth in transaction volume (GDP)</FormattedTypo>
      </Box>
      <FormattedTypo textAlign={"start"}>In other words, those who issue the money work to ensure that it finds its way into hands that are going to accomplish these goals. Notably absent are goals that actually matter to most of us, such as:</FormattedTypo>
      <Box sx={{paddingLeft: 3}}>
        <FormattedTypo textAlign={"start"} paddingBottom={0.5}>Happiness</FormattedTypo>
        <FormattedTypo textAlign={"start"} paddingBottom={0.5}>Love</FormattedTypo>
        <FormattedTypo textAlign={"start"} paddingBottom={0.5}>Peace</FormattedTypo>
        <FormattedTypo textAlign={"start"} paddingBottom={0.5}>Building relationships</FormattedTypo>
        <FormattedTypo textAlign={"start"} paddingBottom={0.5}>Strong local communities</FormattedTypo>
        <FormattedTypo textAlign={"start"} paddingBottom={0.5}>Health</FormattedTypo>
        <FormattedTypo textAlign={"start"} paddingBottom={0.5}>Maintaining a clean environment</FormattedTypo>
        <FormattedTypo textAlign={"start"}>Steady growth in transaction volume (GDP)</FormattedTypo>
      </Box>
      <FormattedTypo textAlign={"start"}>Of course, these goals are subjective, messy, often political, and not fitting aims for a central bank committee to be pursuing on our behalf. But why must we settle for a system of money whose values are not our own just so it can be managed appropriately by a central committee?</FormattedTypo>
      <FormattedTypo textAlign={"start"}>Before banks, countries, and central committees, in villages where everyone knew everyone else, people didn't need money – they just offered what was needed, and kept track in their heads, in <Link href={"http://bit.ly/qUOdnN"}>a system of gifts and obligations.</Link> Because they could keep track amongst themselves, they never had to worry about the abstract values of their economic system trumping their values as human beings. They were their own economic system, and their values were its values.</FormattedTypo>
      <FormattedTypo textAlign={"start"}>Once economies became larger, and trade grew to involve more and more strangers, more abstract systems of keeping score developed. Many of us became materially richer, but we lost some of our autonomy, and much of our connection to the people around us. We need systems that not only allow us to cooperate in creating material abundance, but support our individual dreams and collective ties as well.</FormattedTypo>
      <FormattedTypo textAlign={"start"} paddingBottom={1}>Money For People</FormattedTypo>
      <FormattedTypo textAlign={"start"}>We are all connected. Any two people on the planet are bound to be linked by a web of personal relationships. Instead of using money to cooperate with each other, two strangers can give to each other like friends, and have the resulting obligations borne by the web of personal relationships connecting them. All we really need is a system for finding these connections.
      </FormattedTypo>
      <FormattedTypo textAlign={"start"}>That system is called RumplePay (formerly RipplePay, the technology that powers the Villages marketplace.</FormattedTypo>

    </MainCard>
  );
};

export default Index;
