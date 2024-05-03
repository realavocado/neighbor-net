import FeedCard from "@/components/FeedCard";
import { auth } from "@/pages/_app";
import FeedItem from "@/types/FeedItem";
import { useCollection } from "@nandorojo/swr-firestore";
import { Container, Spacer, Text } from "@nextui-org/react";
import axios from "axios";
import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { baseApiUrl, getCsrfToken } from "@/api/Utils";

const DynamicComponentWithNoSSR = dynamic(
  () => import("@/components/EventModal"),
  { ssr: false }
);

export default function Feed() {
  const [user] = useAuthState(auth);
  const {
    data: feedList,
    add,
    error: feedListError,
    isValidating,
    mutate,
  } = useCollection<FeedItem>("feed", {
    orderBy: ["creationDate", "desc"],
    listen: true,
  });
  console.log('add', add);
  // const [feedList, setFeedList] = React.useState<FeedItem[]>([]); // FeedItem[]

  // get visible message data
  // function getVisableMessages() {
  //   axios.get(baseApiUrl + "/message/get_message/",
  //     {
  //       headers: {
  //         'x-csrftoken': getCsrfToken(),
  //       },
  //       withCredentials: true
  //     }
  //   )
  //       .then((response) => {
  //         console.log(response.data);
  //         const fdList: FeedItem[] = [];
  //         for (let i = 0; i < response.data.message.length; i++) {
  //           const fd: FeedItem = { 
  //             eventType: response.data.message[i].eventType,
  //             creationDate: response.data.message[i].creationDate,
  //             title: response.data.message[i].title,
  //             description: response.data.message[i].description,
  //             authorId: response.data.message[i].authorId,
  //             replyMessages:[],
  //           };
  //           fdList.push(fd);
  //         }
  //         setFeedList(fdList);
  //       }
  //     )
  // }

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

  // React.useEffect(() => {
  //   getVisableMessages();
  // }, []);

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
            {feedList ? (
              feedList.map((item) => {
                return (
                  <FeedCard
                    key={item.id}
                    id={item.id}
                    item={{
                      creationDate: item.creationDate,
                      title: item.title,
                      description: item.description,
                      authorId: item.authorId,
                      author: item.author,
                      eventType: item.eventType,
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
