import { DarkBackground } from "../../containers/DarkBackground";
import { MainText } from "../../globalStyles";
import React from "react";
import { lightRed } from "../../utils/colors";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
    return (
        <>
            <Helmet>
                <title>Not found</title>
            </Helmet>
            <DarkBackground>
                <MainText color={lightRed}>This page does not exist. Error 404.</MainText>
            </DarkBackground>
        </>
    );
};

export default NotFound;
