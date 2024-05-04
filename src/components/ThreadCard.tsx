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

interface ThreadCardInterface {
  id: string;
  item: ThreadItem;
}

export default function ThreadCard(props: ThreadCardInterface) {
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
    // db.doc(`feed/${props.id}`).delete();
  }

  // console.log(props.item.replyMessages);

  return (
    <>
      <Card>
        <Card.Header>
          <Row justify={"space-between"} align="center">
            <UserProfile
              fullName={props.item.authorName}
              avatarUrl={props.item.imageUrl}
            />
            <div style={{ display: "flex", flexDirection: "row" }}>
              {props.item.subject ? (
                <Button flat auto rounded color="warning">
                  <Text
                    css={{ color: "inherit" }}
                    size={12}
                    weight="bold"
                    transform="uppercase"
                  >
                    {props.item.subject}
                  </Text>
                </Button>
              ) : (
                <div></div>
              )}

              {props.item.isWrite ? (
                <Dropdown>
                  <Dropdown.Button light>
                    <BsFillPencilFill />
                  </Dropdown.Button>
                  <Dropdown.Menu
                    aria-label="Static Actions"
                    onAction={(actionKey) => {
                      if (actionKey.toString() == "add") {
                        addPost();
                      }
                    }}
                  >
                    <Dropdown.Item key="add">Add Post</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <div></div>
              )}
            </div>
          </Row>
        </Card.Header>
        <Card.Divider />
        <Card.Body css={{ py: "$10" }}>
          <Container>
            <Text h3 b>
              {props.item.title}
            </Text>
            {props.item.eventTime != null ? (
              <Row align="center">
                <MdCalendarToday />
                <Spacer x={0.35} />
                <Text>{convertDate(props.item.eventTime)}</Text>
              </Row>
            ) : (
              <></>
            )}
            <Container gap={0}>
              <Text>{props.item.text}</Text>
            </Container>
            <MapInFeed
              latitude={props.item.latitude ?? 0}
              longitude={props.item.longitude ?? 0}
            />
          </Container>
          {/* <Container> */}

          {/* </Container> */}
        </Card.Body>
        <Card.Divider />
        {props.item.replyMessages?.length ? (
          <Collapse.Group accordion={false}>
            <Collapse title="Comments">
              {props.item.replyMessages.map((reply) => (
                <RepliesCard id={reply.mid} item={reply} />
              ))}
            </Collapse>
          </Collapse.Group>
        ) : null}
        <Card.Footer>
          <Row align="center" justify="space-between">
            <Row>
              <Spacer x={0.5} />
              <Text css={{ opacity: "0.33" }} size={"$sm"} color="">
                {convertDate(props.item.eventTime)}
              </Text>
            </Row>
            {props.item.visibility ? (
              <Button flat auto rounded color="secondary">
                <Text
                  css={{ color: "inherit" }}
                  size={12}
                  weight="bold"
                  transform="uppercase"
                >
                  {props.item.visibility}
                </Text>
              </Button>
            ) : null}
          </Row>
        </Card.Footer>
      </Card>
      <Spacer y={1} />
    </>
  );
}
