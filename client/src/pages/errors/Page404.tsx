import { PATH_APP } from "@/routes/paths";
import { Center, Container } from "@mantine/core";
import React from "react";
import { Link } from "react-router-dom";
const Page404: React.FC = () => {

    return (
        <Container>
            <Center>
                404 not found
                <Link to={PATH_APP.general.landing}>Go Back</Link>
            </Center>
        </Container>
    )
}

export default Page404;