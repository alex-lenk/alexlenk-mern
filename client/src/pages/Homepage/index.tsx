import React from "react";
import HomepageBlog from "../../components/HomepageBlog";
import {Helmet} from "react-helmet-async";

const Homepage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Home - blog</title>
      </Helmet>
      <HomepageBlog/>
    </>
  );
};

export default Homepage;
