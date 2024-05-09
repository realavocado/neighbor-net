import { auth } from "./_app";
import {
  Button,
  Container,
  Input,
  Loading,
  Row,
  Spacer,
  Text,
  useInput,
} from "@nextui-org/react";
import Head from "next/head";
import React, { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { MdEmail, MdLock, MdPerson } from "react-icons/md";
import { useRouter } from "next/router";
import { set } from '@nandorojo/swr-firestore';
import { Modal } from '@nextui-org/react';
import { fetchAndStoreCsrfToken, getCsrfToken, baseURL } from "@/api/Request";
import axios from 'axios';

export default function Feed() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const router = useRouter();

  const {
    value: nameValue,
    reset: resetNameField,
    bindings: nameBindings,
  } = useInput("");

  const {
    value: firstNameValue,
    reset: resetFirstNameField,
    bindings: firstNameBindings,
  } = useInput("");

  const {
    value: lastNameValue,
    reset: resetLastNameField,
    bindings: lastNameBindings,
  } = useInput("");

  const {
    value: emailValue,
    reset: resetEmailField,
    bindings: emailBindings,
  } = useInput("");

  const {
    value: passwordValue,
    reset: resetPasswordField,
    bindings: passwordBindings,
  } = useInput("");

  const {
    value: passwordConfirmValue,
    reset: resetPasswordConfirmField,
    bindings: passwordConfirmBindings,
  } = useInput("");
  
  const validateEmail = (value: string) => {
    return value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
  };

  const emailHelper = React.useMemo(() => {
    if (!emailValue)
      return {
        text: "",
        color: "",
      };
    const isValid = validateEmail(emailValue);
    return {
      text: isValid ? "" : "Enter a valid email",
      color: isValid ? "success" : "error",
    };
  }, [emailValue]);

  const nameHelper = React.useMemo(() => {
    return {
      text:
        nameValue.length >= 3 || nameValue.length == 0
          ? ""
          : "Must be at least 3 characters",
    };
  }, [nameValue]);

  const firstNameHelper = React.useMemo(() => {
    return {
      text:
        firstNameValue.length >= 3 || firstNameValue.length == 0
          ? ""
          : "Must be at least 3 characters",
    };
  }, [firstNameValue]);

  const lastNameHelper = React.useMemo(() => {
    return {
      text:
        lastNameValue.length >= 3 || lastNameValue.length == 0
          ? ""
          : "Must be at least 3 characters",
    };
  }, [lastNameValue]);

  const passwordHelper = React.useMemo(() => {
    return {
      text:
        passwordValue.length >= 6 || passwordValue.length == 0
          ? ""
          : "Must be at least 6 characters",
    };
  }, [passwordValue]);

  const passwordConfirmHelper = React.useMemo(() => {
    return {
      text:
        passwordConfirmValue.length >= 6 || passwordConfirmValue.length == 0
          ? ""
          : "Must be at least 6 characters",
    };
  }, [passwordConfirmValue]);


  function performRegister(csrftoken: any) {
    const formData = new FormData();
    formData.append('username', nameValue);
    formData.append('first_name', firstNameValue);
    formData.append('last_name', lastNameValue);
    formData.append('email', emailValue);
    formData.append('password1', passwordValue);
    formData.append('password2', passwordConfirmValue);
    formData.append('image_url', 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png');

    fetch(baseURL + 'users/register/', {
      method: 'POST',
      headers: {
        //'Content-Type': 'application/json',
        'x-csrftoken': csrftoken || ''
      },
      credentials: 'include',
      body: formData
    })
    .then(response => {
      setLoading(false);
      if (response.ok) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          router.push('/');
        }, 3000);
      } else {
        return response.json().then(data => {
          // response body: {"errors" : xxxxx}
          const errorMessage = data.errors || "Failed to register";
          throw new Error(errorMessage);
        });
      }
    })
    .catch(error => {
      setLoading(false);
      console.error('Register failed:', error);
      alert('Register failed:\n' + error.message);
    });
  }

  const registerHandler = () => {
    setLoading(true);

    let csrftoken = getCsrfToken();

    if (!csrftoken) {
      fetchAndStoreCsrfToken()
      .then(() => {
        csrftoken = getCsrfToken() || '';
        console.log('token set');
        performRegister(csrftoken);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    } else {
      performRegister(csrftoken);
    }
  };


  function uploadUserData(uid: string) {
    set(`users/${auth.currentUser?.uid}`, {
      fullName: nameValue,
      avatarUrl: "https://evascursos.com.br/wp-content/uploads/2020/03/avatar-large-square.jpg"
    })
    Cleanup()
  }

  function Cleanup() {
    resetNameField()
    resetEmailField()
    resetPasswordField()
    setLoading(false)

    router.push('/feed')

  }

  const [loading, setLoading] = useState(false);

  function inputsValid(): boolean {
    if (loading) {
      return false;
    } else if ((emailHelper.color == "success" && passwordValue.length >= 6 && nameValue.length >= 3)) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <>
      <Head>
        <title>Setup | NeighborNet</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <Container xs>
            <Spacer y={2} />
            <Row justify="center">
              <Text h1>Create Account</Text>
            </Row>
            <Spacer y={1} />
            <Input
              {...nameBindings}
              clearable
              bordered
              fullWidth
              shadow={false}
              onClearClick={resetNameField}
              color={"primary"}
              helperColor={"error"}
              helperText={nameHelper.text}
              type="email"
              labelPlaceholder="User Name"
              contentLeft={<MdPerson />}
              aria-label="Name Field"
            />
            <Spacer y={2.25} />
            <Input
              {...firstNameBindings}
              clearable
              bordered
              fullWidth
              shadow={false}
              onClearClick={resetFirstNameField}
              color={"primary"}
              helperColor={"error"}
              helperText={firstNameHelper.text}
              type="email"
              labelPlaceholder="First Name"
              contentLeft={<MdPerson />}
              aria-label="Name Field"
            />
            <Spacer y={2.25} />
            <Input
              {...lastNameBindings}
              clearable
              bordered
              fullWidth
              shadow={false}
              onClearClick={resetLastNameField}
              color={"primary"}
              helperColor={"error"}
              helperText={lastNameHelper.text}
              type="email"
              labelPlaceholder="Last Name"
              contentLeft={<MdPerson />}
              aria-label="Name Field"
            />
            <Spacer y={2.25} />
            <Input
              {...emailBindings}
              clearable
              bordered
              fullWidth
              shadow={false}
              onClearClick={resetEmailField}
              color={"primary"}
              helperColor={"error"}
              helperText={emailHelper.text}
              type="email"
              labelPlaceholder="Email"
              contentLeft={<MdEmail />}
              aria-label="Email Field"
            />
            <Spacer y={2.25} />
            <Input.Password
              {...passwordBindings}
              clearable
              bordered
              fullWidth
              shadow={false}
              onClearClick={resetPasswordField}
              aria-label="Password Field"
              color="primary"
              labelPlaceholder="Password"
              helperText={passwordHelper.text}
              helperColor="error"
              visibleIcon={<HiEye fill="currentColor" />}
              hiddenIcon={<HiEyeOff fill="currentColor" />}
              contentLeft={<MdLock />}
            />
            <Spacer y={2.25} />
            <Input.Password
              {...passwordConfirmBindings}
              clearable
              bordered
              fullWidth
              shadow={false}
              onClearClick={resetPasswordConfirmField}
              aria-label="Password Field"
              color="primary"
              labelPlaceholder="Confirm Password"
              helperText={passwordConfirmHelper.text}
              helperColor="error"
              visibleIcon={<HiEye fill="currentColor" />}
              hiddenIcon={<HiEyeOff fill="currentColor" />}
              contentLeft={<MdLock />}
            />
            <Spacer y={2.25} />
            <Row justify="center">
              <Button shadow disabled={!inputsValid()} onPress={registerHandler}>
                {loading ? (
                  <Loading type="default" color="currentColor" size="sm" />
                ) : (
                  <>Sign Up</>
                )}
              </Button>
            </Row>
          </Container>
        </div>
      </main>
      <Modal open={showSuccessMessage} onClose={() => setShowSuccessMessage(false)}>
        <Modal.Body>
          <Text>Registration Successful!</Text>
        </Modal.Body>
      </Modal>
    </>
  );
}
