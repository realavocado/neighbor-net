import React from "react";
import {
  Button,
  Input,
  Loading,
  Row,
  Spacer,
  Modal,
  Text,
  useInput,
  Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { baseApiUrl, getCsrfToken } from "@/api/Utils";
import axios from "axios";
import { text } from "stream/consumers";

interface MessageModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  tid: number;
  reply_mid: number;
  update: () => void;
}

export default function MessageModal(props: MessageModalProps) {
  const closeHandler = () => {
    props.setVisible(false);
  };

  const {
    value: titleValue,
    reset: resetTitleField,
    bindings: titleBindings,
  } = useInput("");

  const {
    value: textValue,
    reset: resetTextField,
    bindings: textBindings,
  } = useInput("");

  const titleHelper = React.useMemo(() => {
    return {
      text:
        titleValue.length >= 3 || titleValue.length == 0
          ? ""
          : "Must be at least 3 characters",
    };
  }, [titleValue]);

  const textHelper = React.useMemo(() => {
    return {
      text:
        textValue.length >= 6 || textValue.length == 0
          ? ""
          : "Must be at least 6 characters",
    };
  }, [textValue]);

  const loginHandler = () => {
    axios
      .post(
        baseApiUrl + "/message/post_message/",
        {
          tid: props.tid,
          reply_to_mid: props.reply_mid,
          title: titleValue,
          text: textValue,
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
        props.update();
        closeHandler();
        alert("Message Posted")
        // setTestMessage(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [loading, setLoading] = useState(false);

  function inputsValid(): boolean {
    if (titleValue.length >= 3 && textValue.length >= 6) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <Modal
      closeButton
      blur
      aria-labelledby="modal-title"
      open={props.visible}
      onClose={closeHandler}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          Add a Message to Thread
        </Text>
      </Modal.Header>
      <Modal.Body autoMargin={false}>
        <Input
          {...titleBindings}
          clearable
          bordered
          shadow={false}
          onClearClick={resetTitleField}
          color={"primary"}
          helperColor={"error"}
          helperText={titleHelper.text}
          type="text"
          placeholder="Title"
          aria-label="Title Field"
        />
        <Spacer y={1.25} />
        <Textarea
          {...textBindings}
          bordered
          shadow={false}
          aria-label="Text Field"
          color="primary"
          placeholder="Text"
          helperText={textHelper.text}
          helperColor="error"
        />
        <Spacer y={0.25} />
        <Spacer y={1} />
        <Row justify={"center"}>
          <Button shadow disabled={!inputsValid()} onPress={loginHandler}>
            {loading ? (
              <Loading type="default" color="currentColor" size="sm" />
            ) : (
              <div>Post</div>
            )}
          </Button>
        </Row>
        <Spacer y={0.5} />
      </Modal.Body>
    </Modal>
  );
}
