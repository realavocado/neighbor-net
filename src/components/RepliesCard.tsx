import { Row, Text, Spacer, Container } from "@nextui-org/react";
import { ReplyItem } from "@/types/FeedItem";
import UserProfile from "./UserProfile";

interface RepliesCardInterface {
  id: number;
  item: ReplyItem;
}

export default function RepliesCard(props: RepliesCardInterface) {
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

  return (
    <>
      <Row justify={"space-between"} align="center">
        <UserProfile
          fullName={props.item.authorName}
          avatarUrl={props.item.imageUrl}
        ></UserProfile>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Text h6>
            {"Reply to: "}
            {props.item.replyUsername}
          </Text>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {props.item.eventTime ? (
            <Text
              css={{ color: "inherit" }}
              size={12}
              weight="bold"
              transform="uppercase"
            >
              {convertDate(props.item.eventTime)}
            </Text>
          ) : (
            <div></div>
          )}
          <div></div>
        </div>
      </Row>
      <Container>
        <Text h5>{props.item.title}</Text>
        <Text h6>{props.item.text}</Text>
      </Container>
      <Spacer y={1} />
    </>
  );
}
