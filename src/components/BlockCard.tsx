import {
  Button,
  Text,
  Row,
  Spacer,
  useInput,
  Container,
  Dropdown,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseApiUrl, getCsrfToken } from "@/api/Utils";
import { useSSR } from '@nextui-org/react'
import FollowingBlockCard from "@/components/FollowingBlockCard";
import { get } from "http";

interface Block {
  id: string;
  name: string;
}

export default function BlockCard() {
  const { isBrowser } = useSSR()

  const [nowBlock, setNowBlock] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [joinBlock, setJoinBlock] = useState("");
  const [followBlock, setFollowBlock] = useState("");
  const [followingBlocks, setFollowingBlocks] = useState<Block[]>([]);

  function getBlocks() {
    axios
      .get(baseApiUrl + "/blockrela/blocks", {
        headers: {
          "x-csrftoken": getCsrfToken(),
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        const bkList: Block[] = [];
        for (let i = 0; i < response.data.blocks.length; i++) {
          const bk: Block = {
            id: response.data.blocks[i].id,
            name: response.data.blocks[i].name,
          };
          bkList.push(bk);
        }
        setBlocks(bkList);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getNowBlock() {
    axios
      .get(baseApiUrl + "/blockrela/now_block", {
        headers: {
          "x-csrftoken": getCsrfToken(),
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.status == true) {
          setNowBlock(response.data.block_name);
        } else {
          setNowBlock("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getFollowingBlocks() {
    axios
      .get(baseApiUrl + "/blockrela/all_follow_block", {
        headers: {
          "x-csrftoken": getCsrfToken(),
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        const bkList: Block[] = [];
        for (let i = 0; i < response.data.blocks.length; i++) {
          const bk: Block = {
            id: response.data.blocks[i].id,
            name: response.data.blocks[i].name,
          };
          bkList.push(bk);
        }
        setFollowingBlocks(bkList);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleJoinChange(event: any) {
    setJoinBlock(event.currentKey);
  }

  function handleFollowChange(event: any) {
    setFollowBlock(event.currentKey);
  }

  const handleJoinSubmit = () => {
    console.log(joinBlock);
    axios
      .post(
        baseApiUrl + "/blockrela/apply_block/",
        {
          block_name: joinBlock,
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
        alert(response.data.message);
        return;
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.message);
      });
  };

  const handleLeaveBlock = () => {
    axios
      .post(
        baseApiUrl + "/blockrela/leave_block/",{},
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
          getNowBlock();
          alert(response.data.message);
          return;
        }
        alert(response.data.message);
        return;
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.message);
      });
  };

  const handleFollowSubmit = () => {
    axios
      .post(
        baseApiUrl + "/blockrela/follow_block/",
        {
          block_name: followBlock,
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
          getFollowingBlocks();
        }
        alert(response.data.message);
        return;
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.message);
      });
  };

  useEffect(() => {
    getNowBlock();
    getBlocks();
    getFollowingBlocks();
  }, []);

  return  isBrowser ? (
      <Container>
      <>
        <Text h3>
          {" "}
          {nowBlock ? "Current Block: " + nowBlock : "Not join in a Block"}
        </Text>
        {!nowBlock ? (
          <>
            <Dropdown>
              <Dropdown.Button flat color="primary" css={{ tt: "capitalize" }}>
                {joinBlock ? joinBlock : "Select A Block to Join"}
              </Dropdown.Button>
              <Dropdown.Menu
                color="primary"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={joinBlock}
                onSelectionChange={handleJoinChange}
              >
                {blocks.map((block) => (
                  <Dropdown.Item key={block.name}>{block.name}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Spacer y={1} />
            <Button disabled={joinBlock == ""} onPress={handleJoinSubmit}>
              <>Submit</>
            </Button>
          </>
        ) : (
          <Button onPress={handleLeaveBlock}>Leave Block</Button>
        )}
      </>
      <Spacer y={3} />

      <>
        <Text h2>Your Follow Blocks</Text>
          <FollowingBlockCard followings={followingBlocks} />
          <Spacer y={1} />
        <Dropdown>
          <Dropdown.Button flat color="primary" css={{ tt: "capitalize" }}>
            {followBlock ? followBlock : "Select A Block to Follow"}
          </Dropdown.Button>
          <Dropdown.Menu
            color="secondary"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={followBlock}
            onSelectionChange={handleFollowChange}
          >
            {blocks.map((block) => (
              <Dropdown.Item key={block.name}>{block.name}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Spacer y={1} />
        <Button disabled={followBlock == ""} onPress={handleFollowSubmit}>
          <>Submit</>
        </Button>
      </>
    </Container>
  ): null;
}
