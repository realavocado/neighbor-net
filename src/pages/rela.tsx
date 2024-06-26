import React from "react";
import Head from "next/head";
import { Button, Container, Navbar, Text, Spacer } from "@nextui-org/react";
import axios from "axios";
import { baseApiUrl, getCsrfToken } from "@/api/Utils";
import RelaCard from "@/components/RelaCard";
import AddRelaCard from "@/components/AddRelaCard";

interface Friend {
  id: string;
  username: string;
  fullName?: string;
  avatar?: string;
}

interface Neighbor {
  id: string;
  username: string;
  fullName?: string;
  avatar?: string;
}

export default function Rela() {
  const [friends, setFriends] = React.useState<Friend[]>([]);
  const [neighbors, setNeighbors] = React.useState<Neighbor[]>([]);

  function getFriends() {
    axios
      .get(baseApiUrl + "/userrela/friends", {
        headers: {
          "x-csrftoken": getCsrfToken(),
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        const friends: Friend[] = [];
        for (let i = 0; i < response.data.friends.length; i++) {
          const friend: Friend = {
            id: response.data.friends[i].id,
            username: response.data.friends[i].username,
            fullName: response.data.friends[i].full_name,
            avatar: response.data.friends[i].image_url,
          };
          friends.push(friend);
        }
        setFriends(friends);
      }).catch((error) => {
        console.log(error);
      });
  }

  function getNeighbors() {
    axios
      .get(baseApiUrl + "/userrela/neighbors", {
        headers: {
          "x-csrftoken": getCsrfToken(),
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        const neighbors: Neighbor[] = [];
        for (let i = 0; i < response.data.neighbors.length; i++) {
          const neighbor: Neighbor = {
            id: response.data.neighbors[i].id,
            username: response.data.neighbors[i].username,
            fullName: response.data.neighbors[i].full_name,
            avatar: response.data.neighbors[i].image_url,
          };
          neighbors.push(neighbor);
        }
        setNeighbors(neighbors);
      }).catch((error) => {
        console.log(error);
      });
  }


  React.useEffect(() => {
    getFriends();
    getNeighbors();
  }, []);

  function addNeighbor(username: string) {
    axios
      .post(
        baseApiUrl + "/userrela/follow_neighbor/",
        {
          username: username,
        },
        {
          headers: {
            "x-csrftoken": getCsrfToken(),
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        if (response.data.status === "success") {
          getNeighbors();
          alert("Follow neighbor success");
          return;
        }
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.error);
        // alert('Error posting thread');
      });
  }

  function addFriend(username: string) {
    axios
      .post(
        baseApiUrl + "/userrela/add_friend/",
        {
          username: username,
        },
        {
          headers: {
            "x-csrftoken": getCsrfToken(),
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        if (response.data.status === "success") {
          alert("Friend request sent");
        }
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.error);
        // alert('Error posting thread');
      });
  }

  return (
    <>
      <Head>
        <title>Map | NeighborNet</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Spacer y={1} />
        <Container sm>
          <Text h2>Your Friends</Text>
          <RelaCard rela={friends} />
          <Spacer y={1} />
          <Text h3>Add Friend</Text>
          <AddRelaCard add={addFriend}/>
        </Container>
        <Spacer y={1} />
        <Container sm>
          <Text h2>Your Follow Neighbors</Text>
          <RelaCard rela={neighbors} />
          <Spacer y={1} />
          <Text h3>Follow Neighbor</Text>
          <AddRelaCard add={addNeighbor}/>
          <Spacer y={10} />
        </Container>
      </main>
    </>
  );
}
