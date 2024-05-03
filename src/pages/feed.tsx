import ThreadCard from "@/components/ThreadCard";
import { auth } from "@/pages/_app";
import { ThreadItem, ReplyItem } from "@/types/FeedItem";
import { useCollection } from "@nandorojo/swr-firestore";
import { Container, Spacer, Text } from "@nextui-org/react";
import axios from "axios";
import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useState } from "react";
// import { useAuthState } from "react-firebase-hooks/auth";
import { baseApiUrl, getCsrfToken, IsUserExist } from "@/api/Utils";

const DynamicComponentWithNoSSR = dynamic(
  () => import("@/components/EventModal"),
  { ssr: false }
);

export default function Feed() {
  // const [user] = useAuthState(auth);
  const [user] = React.useState(IsUserExist());

  function add(data: ThreadItem | ThreadItem[]) {
    return null;
  }
  
  const [threadList, setThreadList] = React.useState<ThreadItem[]>([]); // FeedItem[]

  // get visible message data
  function getVisableMessages() {
    axios.get(baseApiUrl + "/message/get_message/",
      {
        headers: {
          'x-csrftoken': getCsrfToken(),
        },
        withCredentials: true
      }
    )
        .then((response) => {
          console.log(response.data);
          const tdList: ThreadItem[] = [];
          for (let i = 0; i < response.data.message.length; i++) {
            const td: ThreadItem = { 
              id: response.data.message[i].tid,
              topic: response.data.message[i].topic,
              subject: response.data.message[i].subject,
              visibility: response.data.message[i].visibility,
              mid: response.data.message[i].mid,
              title: response.data.message[i].title,
              text: response.data.message[i].text,
              authorId: response.data.message[i].authorId,
              authorName: response.data.message[i].author,
              eventTime: response.data.message[i].timestamp,
              latitude: response.data.message[i].latitude,
              longitude: response.data.message[i].longitude,
              replyMessages:[],
            };
            tdList.push(td);
          }
          setThreadList(tdList);
        }
      )
  }

  // Popup
  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);
  
  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };

  // function test() {
  //   console.log("OnSuccess Triggered");
  //   console.log(`Loading State ${isValidating}`);
  // }

  React.useEffect(() => {
    getVisableMessages();
  }, []);

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
            <Text h1>Neighborhood Feed</Text>

            {user ? (
              <DynamicComponentWithNoSSR
                open={visible}
                add={add}
                close={closeHandler}
              />
            ) : (
              <Text h3 color="primary">
                Log in to Post
              </Text>
            )}
            <Spacer y={1} />
            {threadList ? (
              threadList.map((item) => {
                return (
                  <ThreadCard
                    key={item.id}
                    id={item.id}
                    item = {{
                      id: item.id,
                      topic: item.topic,
                      visibility: item.visibility,
                      eventTime: item.eventTime,
                      title: item.title,
                      text: item.text,
                      authorId: item.authorId,
                      authorName: item.authorName,
                      subject: item.subject,
                      imageUrl: item.imageUrl,
                      replyMessages: item.replyMessages,
                    }}
                  />
                );
              })
            ) : (
              <Text>test</Text>
            )}
          </Container>
        </div>
      </main>
    </>
  );
}
