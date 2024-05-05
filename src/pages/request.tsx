import RequestCard from "@/components/RequestCard";
import Head from "next/head";
import { Button, Container, Text, Spacer } from "@nextui-org/react";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import { baseApiUrl, getCsrfToken } from "@/api/Utils";
import React from "react";

interface FriendRequest {
  id: string;
  username: string;
  avatar?: string;
}

export default function Request() {

  const [friendRequests, setFriendRequests] = React.useState<FriendRequest[]>([]);
  const [joinBlockRequests, setJoinBlockRequests] = React.useState<FriendRequest[]>([]);

  function getFriendsRequest() {
    axios.get(baseApiUrl + "/userrela/get_friend_request"
    , {
      headers: {
        "x-csrftoken": getCsrfToken(),
      },
      withCredentials: true,
    }
    ).then((response) => {
      console.log(response.data);
      const frs: FriendRequest[] = [];
      for (let i = 0; i < response.data.requests.length; i++) {
        const fr: FriendRequest = {
          id: response.data.requests[i].id,
          username: response.data.requests[i].username,
          avatar: response.data.requests[i].image_url,
        };
        frs.push(fr);
      }
      setFriendRequests(frs);
    });
  }


  function handleFriendAccept(id: string) {
    console.log("Request Accepted");
    axios.post(baseApiUrl + "/userrela/accept_friend/", {
      id: id,
    }, {
      headers: {
        "x-csrftoken": getCsrfToken(),
      },
      withCredentials: true,
    }).then((response) => {
      console.log(response.data);
      if (response.data.status === "success") {
        getFriendsRequest();
        alert("Request Accepted");
        return
      }
    }).catch((error) => {
      console.log(error);
      alert(error.response.data.message);
    });
  }

  function handleFriendReject(id: string) {
    console.log("Request Rejected");
    axios.post(baseApiUrl + "/userrela/reject_friend/", {
      id: id,
    }, {
      headers: {
        "x-csrftoken": getCsrfToken(),
      },
      withCredentials: true,
    }).then((response) => {
      console.log(response.data);
      if (response.data.status === "success") {
        getFriendsRequest();
        alert("Request Rejected");
        return
      }
    }).catch((error) => {
      console.log(error);
      alert(error.response.data.message);
    });
  }

  React.useEffect(() => {
    getFriendsRequest();
  }, []);
  
  return (
    <>
      <Head>
        <title>Map | NeighborNet</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
      <Container sm>
          <Spacer y={1} />
          <Text h2>Add Friend Request</Text>
          {friendRequests.map((rq) => 
            (
              <>
                <RequestCard 
                  username={rq.username}
                  id = {rq.id}
                  type="Friend"
                  onRequestAccept={handleFriendAccept}
                  onRequestReject={handleFriendReject}/>
                <Spacer y={1} />
              </>
            )
          )}
        </Container>
        <Container sm>
          <Spacer y={1} />
          <Text h2>Join in block Request</Text>
        </Container>
      </main>
    </>
  );
}

