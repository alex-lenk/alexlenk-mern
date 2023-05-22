import ContactComponent from "../../components/ContactComponent/ContactComponent";
import React from "react";
import { Helmet } from "react-helmet-async";

const Contact = () => {
    return (
        <>
            <Helmet>
                <title>{`Contact - blog`}</title>
            </Helmet>
            <ContactComponent />
        </>
    );
};

export default Contact;
