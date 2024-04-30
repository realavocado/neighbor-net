import { Card, Button } from "@nextui-org/react";

interface RequestCardInterface {
    username: string;
    type: string;
    onRequestAccept: () => void;
    onRequestReject: () => void;
}

export default function RequestCard(props: RequestCardInterface) {
    return (
      <>
        <Card>
          <Card.Body>
          { props.type === "joinBlock" ? (
            <h3>{props.username} wants to join your Block</h3>)
            : ( props.type === "Friend" ? (
            <h3>{props.username} wants to add you as friend</h3>
            ): null)}
            <Button.Group>
              <Button onClick={props.onRequestAccept} color="default">Accept</Button>
              <Button onClick={props.onRequestReject} color="error">Reject</Button>
            </Button.Group>
          </Card.Body>
        </Card>
      </>
    );
  };