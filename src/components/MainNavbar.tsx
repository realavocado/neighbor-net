import MainLogo from "@/components/MainLogo";
import User from "@/types/User";
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Loading,
  Modal,
  Navbar,
  Row,
  Spacer,
  Text,
  Textarea,
  useInput,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useContext, useEffect } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { MdEmail, MdLock } from "react-icons/md";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { fetchAndStoreCsrfToken, getCsrfToken, baseURL } from "@/api/Request";
import { useSSR } from "@nextui-org/react";
import AuthContext from "@/context/AuthContext";
import axios from "axios";

export default function MainNavbar() {
  const { isBrowser } = useSSR()
  const router = useRouter();
  // For Popup
  const [profileVisible, setProfileVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const handler = () => setVisible(true);
  const closeHandler = () => {
    setVisible(false);
    setProfileVisible(false);
    console.log("closed");
  };

  const [images, setImages] = React.useState([]);
  const maxNumber = 1;

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList as never[]);
  };

  const auth = useContext(AuthContext);

  useEffect(() => {
    // Check if user has logged out and clean local storage
    if (auth && auth.user) {
      setAddress(auth.user.address);
      setUserName(auth.user.username);
      setBio(auth.user.bio);
    }
  }, [auth]);

  // For edit profile
  const [username, setUserName] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(false); //update button

  function signOut() {
    auth?.logout();
  }


  function updateProfile() {
    setIsLoading(true);
    axios.post(baseURL + 'users/update_user_info/', {
      "username": username,
      "address": address,
      "bio": bio,
    }, {
      withCredentials: true,
      headers: {
        "x-csrftoken": getCsrfToken(),
      },
    }).then(response => {
      setIsLoading(false);
      alert('Updated Successfully.');
      auth?.setUser(response.data.user);
    }).catch(error => {
      setIsLoading(false);
      const errorMessage = error.response ? error.response.data : error.message;
      alert(`Error: ${errorMessage}`);
    });
  }

  return isBrowser ? (
    <Navbar variant={"sticky"}>
      <Navbar.Brand>
        <Navbar.Toggle showIn={"xs"} aria-label="toggle navigation" />
        <Link href={"/"} passHref legacyBehavior>
          <Row align="center">
            <MainLogo size={48} />
            <Spacer x={0.33} />
            <Text b color="inherit" hideIn="xs">
              NeighborNet
            </Text>
          </Row>
        </Link>
      </Navbar.Brand>
      <Navbar.Content enableCursorHighlight hideIn="xs" variant="underline">
        <Link href={"/feed"} passHref legacyBehavior>
          <Navbar.Link isActive={router.pathname == "/feed"}>Feed</Navbar.Link>
        </Link>
        <Link href={"/map"} passHref legacyBehavior>
          <Navbar.Link isActive={router.pathname == "/map"}>Map</Navbar.Link>
        </Link>
        <Link href={"/rela"} passHref legacyBehavior>
          <Navbar.Link isActive={router.pathname == "/rela"}>Neighbor & Friend</Navbar.Link>
        </Link>
        <Link href={"/request"} passHref legacyBehavior>
          <Navbar.Link isActive={router.pathname == "/request"}>Request</Navbar.Link>
        </Link>
        <Link href={"/search"} passHref legacyBehavior>
          <Navbar.Link isActive={router.pathname == "/search"}>Search Message</Navbar.Link>
        </Link>
      </Navbar.Content>

      {/* sign in pop up window (visible after click login and before click on Sign in) */}
      <LoginModal visible={visible} setVisible={setVisible} />

      {/* edit profie modal (pop up window)*/}
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={profileVisible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Edit Profile
          </Text>
        </Modal.Header>
        <Modal.Body>
          {/* <Row justify="center">
            <ImageUploading
              multiple
              value={images}
              onChange={onChange}
              maxNumber={maxNumber}
            >
              {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
              }) => (
                // write your building UI
                <div className="upload__image-wrapper">
                  <button
                    style={isDragging ? { color: "red" } : undefined}
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    Update your avatar
                  </button>
                  {imageList.map((image, index) => (
                    <div key={index} className="image-item">
                      <img src={image.dataURL} alt="" width="100" />
                      <div className="image-item__btn-wrapper">
                        <button onClick={() => onImageUpdate(index)}>
                          Update
                        </button>
                        <button onClick={() => onImageRemove(index)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ImageUploading>
          </Row> */}

          <Input
            bordered
            fullWidth
            color="primary"
            size="lg"
            label="Username"
            //initialValue={auth?.user?.username}
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />

          <Textarea
            bordered
            fullWidth
            color="primary"
            size="lg"
            label="bio"
            //initialValue={auth?.user?.bio}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <Input
            bordered
            fullWidth
            color="primary"
            size="lg"
            label="address"
            //initialValue={auth?.user?.address}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <Button
            // disabled={
            //   titleValue.length < 4 ||
            //   descriptionValue.length < 4 ||
            //   locationValue.length < 3 ||
            //   disableSubmit
            // }
            onPress={updateProfile}
          >
            {isLoading ? <Loading type="default" color="currentColor" size="sm" /> : "Update"}
          </Button>


        </Modal.Body>
      </Modal>


      <Navbar.Content>
        <Dropdown placement="bottom-right">
          <Navbar.Item>
            <Row align="center">
              {/* if user is logged in */}
              {/* display username and avatar after login */}
              {auth?.user ? (
                <>
                  <Text b>{auth?.user.full_name}</Text>
                  <Spacer x={0.45} />
                  <Dropdown.Trigger>
                    <Avatar
                      size="md"
                      src={
                        "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
                      }
                    />
                  </Dropdown.Trigger>
                </>
              ) : (
                <>
                  {router.pathname != "/setup" ? (
                    <Link href={"/setup"}>Sign Up</Link>
                  ) : (
                    <Text></Text>
                  )}
                  <Spacer x={0.5} />
                  <Button auto onPress={handler}>
                    Login
                  </Button>
                </>
              )}
              <Spacer x={0.45} />
            </Row>
          </Navbar.Item>
          <Dropdown.Menu
            aria-label="User menu actions"
            color="primary"
            onAction={(actionKey) => {
              if (actionKey.toString() == "logout") {
                signOut();
              } else if (actionKey.toString() == "editProfile") {
                setProfileVisible(true);
              }
            }}
          >
            <Dropdown.Item key="profile" css={{ height: "$18" }}>
              <Text b color="inherit" css={{ d: "flex" }}>
                Signed in as:
              </Text>
              <Text b color="inherit" css={{ d: "flex" }}>
                {auth?.user?.email}
              </Text>
            </Dropdown.Item>
            <Dropdown.Item key="editProfile" withDivider>
              My Profile
            </Dropdown.Item>
            <Dropdown.Item key="system">My Posts</Dropdown.Item>
            <Dropdown.Item key="help_and_feedback" withDivider>
              Help & Feedback
            </Dropdown.Item>
            <Dropdown.Item key="logout" withDivider color="error">
              Log Out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar.Content>

      <Navbar.Collapse>
        <Navbar.CollapseItem key={"home"}>
          <Link color="inherit" href="/">
            Home
          </Link>
        </Navbar.CollapseItem>
        <Navbar.CollapseItem key={"feed"}>
          <Link color="inherit" href="/feed">
            Feed
          </Link>
        </Navbar.CollapseItem>
        <Navbar.CollapseItem key={"map"}>
          <Link color="inherit" href="/map">
            Map
          </Link>
        </Navbar.CollapseItem>
        <Navbar.CollapseItem key={"rela"}>
          <Link color="inherit" href="/rela">
            Neighbor & Friend
          </Link>
        </Navbar.CollapseItem>
        <Navbar.CollapseItem key={"request"}>
          <Link color="inherit" href="/request">
            Request
          </Link>
        </Navbar.CollapseItem>
      </Navbar.Collapse>
    </Navbar>
  ) : null;
}

interface LoginModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}


function LoginModal(props: LoginModalProps) {
  const closeHandler = () => {
    props.setVisible(false);
  };

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

  const passwordHelper = React.useMemo(() => {
    return {
      text:
        passwordValue.length >= 6 || passwordValue.length == 0
          ? ""
          : "Must be at least 6 characters",
    };
  }, [passwordValue]);

  const loginHandler = () => {
    setLoading(true);

    let csrftoken = getCsrfToken();
    console.log(csrftoken);

    if (!csrftoken) {
      console.log('fetch new token');
      fetchAndStoreCsrfToken()
        .then(() => {
          csrftoken = getCsrfToken() || '';
          console.log('new token: ' + csrftoken);
          console.log('token set');
          performLogin(csrftoken);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      performLogin(csrftoken);
    }
  };

  const [loading, setLoading] = useState(false);


  const userAuth = useContext(AuthContext);
  if (!userAuth) {
    return <p>Authentication context is not available.</p>;
  }
  const { setUser } = userAuth;

  function inputsValid(): boolean {
    if (emailHelper.color == "success" && passwordValue.length >= 6) {
      return true;
    } else {
      return false;
    }
  }

  function performLogin(csrftoken: any) {
    const formData = new FormData();
    formData.append('username', emailValue);
    formData.append('password', passwordValue);

    fetch(baseURL + 'users/login/', {
      method: 'POST',
      headers: {
        //'Content-Type': 'application/json',
        'x-csrftoken': csrftoken || ''
      },
      credentials: 'include',
      body: formData
    })
      .then(response => {
        if (response.ok) { // Checks if the response status is in the 200-299 range
          return response.json(); // Parse JSON from the response, returns a promise
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .then(data => { // Here 'data' is the parsed JSON object
        if (data.user) {
          setUser(data.user as User); // Assuming 'setUser' is a function to handle the user data
        }
        console.log('login request');
        setLoading(false);
        closeHandler();
      })
      .catch(error => {
        setLoading(false);
        console.error('Login failed:', error);
        alert('Login failed: ' + error.message);
      });
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
          Welcome to{" "}
          <Text b size={18}>
            NeighborNet
          </Text>
        </Text>
      </Modal.Header>
      <Modal.Body autoMargin={false}>
        <Input
          {...emailBindings}
          clearable
          bordered
          shadow={false}
          onClearClick={resetEmailField}
          color={"primary"}
          helperColor={"error"}
          helperText={emailHelper.text}
          type="email"
          placeholder="Email"
          contentLeft={<MdEmail />}
          aria-label="Email Field"
        />
        <Spacer y={1.25} />
        <Input.Password
          {...passwordBindings}
          clearable
          bordered
          shadow={false}
          onClearClick={resetPasswordField}
          aria-label="Password Field"
          color="primary"
          placeholder="Password"
          helperText={passwordHelper.text}
          helperColor="error"
          visibleIcon={<HiEyeOff fill="currentColor" />}
          hiddenIcon={<HiEye fill="currentColor" />}
          contentLeft={<MdLock />}
        />
        <Spacer y={0.25} />
        <Row justify="flex-end">
          <Text size={14}>Forgot password?</Text>
        </Row>
        <Spacer y={1} />
        <Row justify={"center"}>
          <Button shadow disabled={!inputsValid()} onPress={loginHandler}>
            {loading ? (
              <Loading type="default" color="currentColor" size="sm" />
            ) : (
              <div>Sign in</div>
            )}
          </Button>
        </Row>
        <Spacer y={0.5} />
      </Modal.Body>
    </Modal>
  );
}
