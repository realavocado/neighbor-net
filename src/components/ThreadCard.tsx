import {
  Card,
  Text,
  Button,
  Row,
  Container,
  Spacer,
  Col,
  Dropdown,
  Image,
  Grid,
  Collapse,
} from "@nextui-org/react";
import {
  MdLocationOn,
  MdCalendarToday,
  MdThumbUp,
  MdThumbDown,
} from "react-icons/md";
import { BsFillPencilFill } from "react-icons/bs";
import UserProfile from "./UserProfile";
import { ThreadItem } from "@/types/FeedItem";
import { auth } from "@/pages/_app";
import MapInFeed from "./MapInFeed";
import RepliesCard from "./RepliesCard";
import MessageModal from "./MessageModal";
import React from "react";

interface ThreadCardInterface {
  id: number;
  item: ThreadItem;
  getMess: () => void;
}

const ThreadCard = React.forwardRef<HTMLDivElement, ThreadCardInterface>(
  (props, ref) => {
    const { id, item, getMess } = props;

    const [messVisible, setMessVisible] = React.useState(false);

    function convertDate(input: string | undefined): string {
      const date = new Date(input ?? 0);
      return `${date.toLocaleDateString("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })} • ${date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`;
    }

    function addPost() {
      setMessVisible(true);
    }

    return (
      <>
        <Card ref={ref}>
          <Card.Header>
            <Row justify={"space-between"} align="center">
              <UserProfile fullName={item.authorName} avatarUrl={item.imageUrl} />
              <div style={{ display: "flex", flexDirection: "row" }}>
                {item.subject ? (
                  <Button flat auto rounded color="warning">
                    <Text
                      css={{ color: "inherit" }}
                      size={12}
                      weight="bold"
                      transform="uppercase"
                    >
                      {item.subject}
                    </Text>
                  </Button>
                ) : null}

                {item.isWrite ? (
                  <Dropdown>
                    <Dropdown.Button light>
                      <BsFillPencilFill />
                    </Dropdown.Button>
                    <Dropdown.Menu
                      aria-label="Static Actions"
                      onAction={(actionKey) => {
                        if (actionKey.toString() === "add") {
                          addPost();
                        }
                      }}
                    >
                      <Dropdown.Item key="add">Add Post</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : null}
              </div>
            </Row>
          </Card.Header>
          <Card.Divider />
          <Card.Body css={{ py: "$10" }}>
            <Container>
              <Text h3 b>
                {item.title}
              </Text>
              {item.eventTime != null ? (
                <Row align="center">
                  <Text>{convertDate(item.eventTime)}</Text>
                </Row>
              ) : null}
              <Container gap={0}>
                <Text>{item.text}</Text>
              </Container>
              <MapInFeed latitude={item.latitude ?? 0} longitude={item.longitude ?? 0} />
            </Container>
          </Card.Body>
          <Card.Divider />
          {item.replyMessages?.length ? (
            <RepliesCard id={item.mid} item={item.replyMessages[0]} />
          ) : null}
          <Card.Footer>
            <Row align="center" justify="space-between">
              <Text>{convertDate(item.eventTime)}</Text>
            </Row>
          </Card.Footer>
        </Card>
        <MessageModal
          visible={messVisible}
          setVisible={setMessVisible}
          tid={id}
          reply_mid={item.mid}
          update={getMess}
        />
        <Spacer y={1} />
      </>
    );
  }
);


ThreadCard.displayName = "ThreadCard";

export default ThreadCard;