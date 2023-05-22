import React from "react";
import { Helmet } from "react-helmet-async";
import LoginComponent from "../../components/LoginComponent";

const Login: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>Login - blog</title>
            </Helmet>
            <LoginComponent />
        </>
    );
};

export default Login;
