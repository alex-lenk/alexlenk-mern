import RegisterComponent from "../../components/RegisterComponent";
import React from "react";
import { Helmet } from "react-helmet-async";
const Register = () => {
    return (
        <>
            <Helmet>
                <title>Register - blog</title>
            </Helmet>
            <RegisterComponent />
        </>
    );
};

export default Register;
