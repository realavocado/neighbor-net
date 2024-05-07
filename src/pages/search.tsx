import { Container, Spacer, Text, Input, Button, Row, Col, Card, Grid, Loading } from "@nextui-org/react";
import axios from "axios";
import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useState, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import { baseURL, getCsrfToken } from "@/api/Request";

type Message = {
    mid: number;
    author_id: number;
    title: string;
    text: string;
    timestamp: string;
};

const DynamicComponentWithNoSSR = dynamic(
    () => import("@/components/EventModal"),
    { ssr: false }
);

export default function Search() {
    const [searchTerm, setSearchTerm] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    function handleInputChange(event: React.ChangeEvent<any>) {
        setSearchTerm(event.target.value);
    }

    function handleSearch() {
        setIsLoading(true);
        axios.get(baseURL + 'message/get_message_with_keywords/', {
            params: {
                keyword: searchTerm
            },
            withCredentials: true
        }).then(response => {
            setMessages(response.data);
            setIsLoading(false);
        }).catch(error => {
            console.error("Check login error:", error);
        });
    }

    const isSearchDisabled = searchTerm.trim() === "" || isLoading;

    return (
        <>
            <Head>
                <title>Your Feed | NeighborNet</title>
                <meta name="description" content="" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <div>
                    <Container sm>
                        <Spacer y={1} />

                        <Row justify="center" align="center">
                            <Col span={6}>
                                <Input
                                    clearable
                                    bordered
                                    fullWidth
                                    placeholder="Search Keywords..."
                                    value={searchTerm}
                                    onChange={handleInputChange}
                                />
                            </Col>
                            <Button auto onClick={handleSearch} disabled={isSearchDisabled || isLoading} css={{ marginLeft: "10px" }}>
                                {isLoading ? <Loading type="default" color="currentColor" size="sm" /> : "Search"}
                            </Button>
                        </Row>

                        <Spacer y={1} />

                        <Grid.Container gap={2}>
                            {messages.length === 0 ? (
                                <Text>No messages found.</Text>
                            ) : (
                                messages.map((message) => (
                                    <Grid xs={12} sm={6} key={message.mid}>
                                        <Card>
                                            <Card.Header>
                                                <Text h4>{message.title}</Text>
                                            </Card.Header>
                                            <Card.Body>
                                                <Text>{message.text}</Text>
                                                <Text size={12} color="gray">{message.timestamp}</Text>
                                            </Card.Body>
                                        </Card>
                                    </Grid>
                                ))
                            )}
                        </Grid.Container>
                    </Container>
                </div>
            </main>
        </>
    );
}
