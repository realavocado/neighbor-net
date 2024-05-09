import { Container, Spacer, Text, Input, Button, Row, Col, Card, Grid, Loading, Avatar } from "@nextui-org/react";
import axios from "axios";
import Head from "next/head";
import React, { useState, useContext, useEffect } from "react";
import { FaMapSigns } from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";

import { baseURL, getCsrfToken } from "@/api/Request";
import AuthContext from "@/context/AuthContext";


type Message = {
    mid: number;
    tid: number;
    author_id: number;
    username: string;
    image_url: string; // user avatar
    title: string;
    text: string;
    timestamp: string;
    latitude: number;
    longitude: number;
};

const SEARCH_TERM_KEY = "searchTerm";
const MESSAGES_KEY = "messages";

const DynamicComponentWithNoSSR = dynamic(
    () => import("@/components/EventModal"),
    { ssr: false }
);

const DynamicMap = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Search() {
    const [searchTerm, setSearchTerm] = useState("");
    //const [searchTerm, setSearchTerm] = useState<string>(() => localStorage.getItem(SEARCH_TERM_KEY) || "");
    const [messages, setMessages] = useState<Message[]>([]);
    //const [messages, setMessages] = useState<Message[]>(() => {
    //     const storedMessages = localStorage.getItem(MESSAGES_KEY);
    //     return storedMessages ? JSON.parse(storedMessages) : [];
    // });
    const [isLoading, setIsLoading] = useState(false);

    // user auth context
    const auth = useContext(AuthContext);

    useEffect(() => {
        // Check if user has logged out and clean local storage
        if (!auth || !auth.user) {
            localStorage.removeItem(SEARCH_TERM_KEY);
            localStorage.removeItem(MESSAGES_KEY);
            setSearchTerm("");
            setMessages([]);
        }
    }, [auth]);

    useEffect(() => {
        // Check if localStorage is available on the client side
        const storedSearchTerm = localStorage.getItem(SEARCH_TERM_KEY);
        const storedMessages = localStorage.getItem(MESSAGES_KEY);
    
        if (storedSearchTerm) {
            setSearchTerm(storedSearchTerm);
        }
    
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        }
    }, []);

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
            localStorage.setItem(MESSAGES_KEY, JSON.stringify(response.data));
            localStorage.setItem(SEARCH_TERM_KEY, searchTerm);
            setIsLoading(false);
        }).catch(error => {
            console.error("Check login error:", error);
        });
    }

    function highlightText(text: string, keyword: string): string {
        if (!text) {
            return "";
        }
        // Create a regular expression to match all case-insensitive keywords
        const regex = new RegExp(`(${keyword})`, "gi");
        // Wrap matching keywords in <mark> tags
        return text.replace(regex, "<mark>$1</mark>");
    }

    const isSearchDisabled = !auth || !auth.user || searchTerm.trim() === "" || isLoading;

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

                            {auth && auth.user ? (
                                messages.length === 0 ? (
                                    <Text>No messages found.</Text>
                                ) : (
                                    messages.map((message) => (
                                        <Grid xs={12} sm={6} key={message.mid}>
                                            <Card>
                                                <Card.Header css={{ justifyContent: "space-between" }}>
                                                    <Row align="center">
                                                        <Text h4 dangerouslySetInnerHTML={{ __html: highlightText(message.title, searchTerm) }} />
                                                        {/* <Text h4 css={{ marginRight: "auto" }}>{message.title}</Text> */}
                                                    </Row>
                                                    <Row align="center" justify="flex-end">
                                                        <Avatar
                                                            src={message.image_url}
                                                            size="md"
                                                            alt={`Avatar of ${message.username}`}
                                                            bordered
                                                        />
                                                        <Text css={{ marginLeft: "10px" }}>{message.username}</Text>
                                                    </Row>
                                                </Card.Header>
                                                <Card.Body>
                                                    <Text dangerouslySetInnerHTML={{ __html: highlightText(message.text, searchTerm) }} />
                                                    {/* <Text>{message.text}</Text> */}
                                                    <Text size={12} color="gray">{message.timestamp}</Text>
                                                    {message.latitude !== null && message.longitude !== null ? (
                                                        <DynamicMap latitude={message.latitude} longitude={message.longitude} />
                                                    ) : (
                                                        <Row justify="center" align="center" css={{ height: "150px", width: "100%" }}>
                                                            <FaMapSigns size={48} color="gray" />
                                                            <Text size={14} color="gray" css={{ marginLeft: "10px" }}>
                                                                No location available
                                                            </Text>
                                                        </Row>
                                                    )}
                                                </Card.Body>
                                            </Card>
                                        </Grid>
                                    ))
                                )) : (
                                <Text>Please log in to search</Text>
                            )}
                        </Grid.Container>
                    </Container>
                </div>
            </main>
        </>
    );
}
