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
import { time } from "console";

const DynamicComponentWithNoSSR = dynamic(
  () => import("@/components/EventModal"),
  { ssr: false }
);

export default function Feed() {
  // const [user] = useAuthState(auth);
  const [user] = React.useState(true);

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
            // get reply messages
            let reply: ReplyItem[] = [];
            const replylist = JSON.parse(response.data.message[i].related_messages);
            console.log('rl',replylist);
            
            for(let j = 0; j < replylist.length; j++) {
              const rm: ReplyItem = {
                mid: replylist[j].mid,
                title: replylist[j].title,
                text: replylist[j].text,
                authorId: replylist[j].author_id,
                authorName: replylist[j].author,
                eventTime: replylist[j].timestamp,
                imageUrl: replylist[j].image_url,
                latitude: replylist[j].latitude,
                longitude: replylist[j].longitude,
                replyUsername: replylist[j].reply_to_username,
              };
              reply.push(rm);
            }

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
              imageUrl: response.data.message[i].image_url,
              eventTime: response.data.message[i].timestamp,
              latitude: response.data.message[i].latitude,
              longitude: response.data.message[i].longitude,
              replyMessages: reply,
            };
            tdList.push(td);
          }
          console.log(tdList);
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
                    item = {item}
                  />
                );
              })
            ) : (
              <></>
            )}
          </Container>
        </div>
      </main>
    </>
  );
}
