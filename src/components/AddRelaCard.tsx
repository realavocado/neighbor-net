import {
  Button,
  Input,
  Row,
  Spacer,
  useInput,
  Container,
} from "@nextui-org/react";


interface ModalProps {
  add: (username: string) => void;
}

export default function AddRelaCard(props: ModalProps) {
  const {
    value: usernameValue,
    setValue: setUsername,
    reset: resetUsername,
    bindings: usernameBindings,
  } = useInput("");


  const handleSubmit = () => {
    props.add(usernameValue);
  };

  return (
    <Container>
      <Row>
        <Input
          {...usernameBindings}
          bordered
          color="primary"
          fullWidth
          label="Username (Required)"
        />
        <Spacer y={1} />
        <Button 
        disabled={ usernameValue.length < 2 }
        onPress={handleSubmit}>
          <>Add</>
        </Button>
      </Row>
    </Container>
  );
}
