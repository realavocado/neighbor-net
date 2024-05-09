import ThreadCard from "@/components/ThreadCard";
import { ThreadItem, ReplyItem } from "@/types/FeedItem";
import { Container, Spacer, Text } from "@nextui-org/react";
import axios from "axios";
import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
// import { useAuthState } from "react-firebase-hooks/auth";
import { baseApiUrl, getCsrfToken } from "@/api/Utils";
import { set } from "@nandorojo/swr-firestore";
import { useRouter } from "next/router";

const DynamicComponentWithNoSSR = dynamic(
  () => import("@/components/EventModal"),
  { ssr: false }
);

export default function Feed() {
  const [user, setUser] = React.useState(false);

  function add(data: ThreadItem | ThreadItem[]) {
    return null;
  }

  const [threadList, setThreadList] = React.useState<ThreadItem[]>([]); // FeedItem[]
  const router = useRouter();
  const { tid } = router.query;
  const tidNumber = Number(tid);
  const cardRefs = useRef<Map<number, HTMLElement>>(new Map());

  const [isThreadInitialized, setThreadInitialized] = React.useState(false);
  const [isAllCardsRegistered, setAllCardsRegistered] = React.useState(false);
  const [registeredCount, setRegisteredCount] = React.useState(0);
  const totalThreadCards = threadList.length;

  // Store `ThreadCard` reference into `Map`
  const registerCardRef = (id: number, element: HTMLElement) => {
    if (element  && !cardRefs.current.has(id)) {
      console.log(`Registering ThreadCard ID: ${id}`);
      cardRefs.current.set(id, element);
      setRegisteredCount((count) => count + 1);
    } 
    // else {
    //   console.log(`Unable to register ThreadCard ID: ${id}`);
    // }
  };

  React.useEffect(() => {
    IsUserExist();
    getVisableMessages();
  }, []);

  // Track when all thread cards have been registered
  React.useEffect(() => {
    if (isThreadInitialized){
      if (registeredCount === totalThreadCards) {
        setAllCardsRegistered(true);
      }
    }
  }, [isThreadInitialized, registeredCount, totalThreadCards]);

  // Scroll to the specified `ThreadCard` only after all have been registered
  React.useEffect(() => {
    if (isAllCardsRegistered) {
      console.log(`Navigating to Thread ID: ${tidNumber}`);
      console.log(`Available Thread IDs:`, Array.from(cardRefs.current.keys()));
      if (tidNumber && cardRefs.current.has(tidNumber)) {
        const card = cardRefs.current.get(tidNumber);
        if (card) {
          console.log(`Scroll target position:`, card.getBoundingClientRect());
          card.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }
    }
  }, [isAllCardsRegistered, tidNumber]);

  // check if user is logged in
  function IsUserExist() {
    axios.get(baseApiUrl + "/users/is_logged_in", {
      headers: {
        "x-csrftoken": getCsrfToken(),
      },
      withCredentials: true,
    }).then((response) => {
      console.log(response.data);
      setUser(response.data.is_logged_in);
    }).catch((error) => {
      console.log(error);
    });
  }

  // get visible message data
  function getVisableMessages() {
    axios
      .get(baseApiUrl + "/message/get_message/", {
        headers: {
          "x-csrftoken": getCsrfToken(),
        },
        withCredentials: true,
      })
      .then((response) => {
        // console.log(response.data);
        const tdList: ThreadItem[] = [];
        for (let i = 0; i < response.data.message.length; i++) {
          // get reply messages
          let reply: ReplyItem[] = [];
          const replylist = JSON.parse(
            response.data.message[i].related_messages
          );

          for (let j = 0; j < replylist.length; j++) {
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
            isWrite: response.data.message[i].isWrite,
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
        // console.log(tdList);
        setThreadList(tdList);
        setThreadInitialized(true);
      })
      .catch((error) => {
        setThreadList([]);
        console.log(error);
      });
  }

  // Popup
  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };

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
            <Text h1>Your Messages</Text>

            {user ? (
              <DynamicComponentWithNoSSR
                open={visible}
                add={add}
                close={closeHandler}
                update={getVisableMessages}
              />
            ) : (
              <Text h3 color="primary">
                Log in to Post
              </Text>
            )}
            <Spacer y={1} />
            {threadList ? (
              threadList.map((item) => {
                return <ThreadCard key={item.id} id={item.id} item={item} getMess={getVisableMessages} ref={(el) => el && registerCardRef(item.id, el)} />;
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
