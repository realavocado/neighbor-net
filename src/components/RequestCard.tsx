import { Card, Button, Row } from "@nextui-org/react";

interface RequestCardInterface {
  id: string;
  username: string;
  type: string;
  onRequestAccept: (id: string) => void;
  onRequestReject: (id: string) => void;
}

export default function RequestCard(props: RequestCardInterface) {
  const handleAccept = () => {
    props.onRequestAccept(props.id);
  };
  const handleReject = () => {
    props.onRequestReject(props.id);
  };
  return (
    <>
      <Card>
        <Card.Body>
          {props.type === "joinBlock" ? (
            <h3>{props.username} wants to join your Block</h3>
          ) : props.type === "Friend" ? (
            <h3>{props.username} wants to add you as friend</h3>
          ) : null}
          <Row>
            <Button onPress={handleAccept} color="default">
              Accept
            </Button>
            <Button onPress={handleReject} color="error">
              Reject
            </Button>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
