import { ThreadItem }from "@/types/FeedItem";
import {
  Button,
  Col,
  Input,
  Loading,
  Row,
  Spacer,
  Radio,
  Text,
  Textarea,
  useInput,
  Checkbox,
  Collapse,
  Container,
  Dropdown
} from "@nextui-org/react";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import { AddressAutofill, config } from "@mapbox/search-js-react";
import axios from "axios";
import { baseApiUrl, getCsrfToken } from "@/api/Utils";

interface Friend {
  id: string;
  username: string;
  fullName?: string;
  avatar?: string;
}

interface Neighbor {
  id: string;
  username: string;
  fullName?: string;
  avatar?: string;
}

interface EventModalProps {
  open: boolean;
  add: (data: ThreadItem | ThreadItem[]) => Promise<void> | null;
  close: () => void;
  update: () => void;
}

export default function EventModal(props: EventModalProps) {

  const [disableSubmit, setDisableSubmit] = useState(false);

  const {
    value: titleValue,
    setValue: setTitleValue,
    reset: resetTitle,
    bindings: titleBindings,
  } = useInput("");

  const {
    value: descriptionValue,
    setValue: setDescriptionValue,
    reset: resetDescription,
    bindings: descriptionBindings,
  } = useInput("");

  const {
    value: dateValue,
    setValue: setDateValue,
    reset: resetDate,
    bindings: dateBindings,
  } = useInput("");

  const {
    value: timeValue,
    setValue: setTimeValue,
    reset: resetTime,
    bindings: timeBindings,
  } = useInput("");

  const {
    value: locationValue,
    setValue: setLocationValue,
    reset: resetLocation,
    bindings: locationBindings,
  } = useInput("");

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  //Mapbox
  const token =
    "pk.eyJ1IjoibGVvc20wNyIsImEiOiJjbGVicjdueHgxMmoxM25xZ2JqZWVkbTFjIn0.nv1GEej-EtMR1ouVUYVM_w";

  const handleRetrieve = useCallback(
    (res: any) => {
      // console.log(res.features[0].properties);
      setLocationValue(res.features[0].properties.feature_name);
      setLatitude(res.features[0].geometry.coordinates[1]);
      setLongitude(res.features[0].geometry.coordinates[0]);
      setCity(res.features[0].properties.address_level2);
      setCountry(res.features[0].properties.country);
    },
    [setLocationValue]
  );

  const resetFields = () => {
    resetTitle()
    resetDescription()
    resetLocation()
    setLatitude(0)
    setLongitude(0)
    setCity("")
    setCountry("")
    resetTime()
    resetDate()
  }

  const subjects = [
    { value: "Incident", label: "Incident" },
    { value: "Regular", label: "Regular" },
    { value: "Event", label: "Event" },
    { value: "Other", label: "Other" },
  ];

  const recepients = [
    { label: "All Block", value: "block" },
    { label: "All Neigborhood", value: "neighborhood" },
    { label: "All Friends", value: "friends" },
    { label: "A Friend", value: "friend" },
    { label: "A Neighbor", value: "neighbor" },
  ];

  const [friends, setFriends] = useState<Friend[]>([]);
  const [neighbors, setNeighbors] = useState<Neighbor[]>([]);


  function getFriends() {
    axios
      .get(baseApiUrl + "/userrela/friends", {
        headers: {
          "x-csrftoken": getCsrfToken(),
        },
        withCredentials: true,
      })
      .then((response) => {
        const friends: Friend[] = [];
        for (let i = 0; i < response.data.friends.length; i++) {
          const friend: Friend = {
            id: response.data.friends[i].id,
            username: response.data.friends[i].username,
            fullName: response.data.friends[i].full_name,
            avatar: response.data.friends[i].image_url,
          };
          friends.push(friend);
        }
        setFriends(friends);
      });
  }

  function getNeighbors() {
    axios
      .get(baseApiUrl + "/userrela/neighbors", {
        headers: {
          "x-csrftoken": getCsrfToken(),
        },
        withCredentials: true,
      })
      .then((response) => {
        const neighbors: Neighbor[] = [];
        for (let i = 0; i < response.data.neighbors.length; i++) {
          const neighbor: Neighbor = {
            id: response.data.neighbors[i].id,
            username: response.data.neighbors[i].username,
            fullName: response.data.neighbors[i].full_name,
            avatar: response.data.neighbors[i].image_url,
          };
          neighbors.push(neighbor);
        }
        setNeighbors(neighbors);
      });
  }


  useEffect(() => {
    config.accessToken = token;
    getFriends();
    getNeighbors();
  }, []);

  const [selectedSubject, setSelectedSubject] = useState(subjects[0].value);
  const [recipientType, setRecipientType] = useState(recepients[0].value);
  const [selectedFriend, setSelectedFriend] = useState('');
  const [selectedNeighbor, setSelectedNeighbor] = useState('');
  

  const handleFriendChange = (event: any) => {
    setSelectedFriend(event.currentKey);
    setSelectedNeighbor(''); // Reset neighbor selection
  };

  const handleNeighborChange = (event: any) => {
    setSelectedNeighbor(event.currentKey);
    setSelectedFriend(''); // Reset friend selection
  };

  const handleSubmit = () => {
    axios.post(
      baseApiUrl + "/message/post_thread/",
      {
        subject: selectedSubject,
        visibility: recipientType,
        reciever: selectedFriend || selectedNeighbor,
        
        title: titleValue,
        text: descriptionValue,
        latitude: latitude,
        longitude: longitude,
        date: dateValue,
        time: timeValue,
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
      alert('Thread posted successfully');
      return;
    }).catch((error) => {
      console.log(error);
      alert('Error posting thread');
    });

    // console.log('selectedSubject',selectedSubject)
    // console.log('recipientType',recipientType)
    // console.log('selectedFriend',selectedFriend)
    // console.log('selectedNeighbor',selectedNeighbor)
    // console.log('titleValue',titleValue)
    // console.log('descriptionValue',descriptionValue)
    // console.log('locationValue',locationValue)
    // console.log('latitude',latitude)
    // console.log('longitude',longitude)
    // console.log('dateValue',dateValue)
    // console.log('timeValue',timeValue)
  }


  return (
    <Collapse.Group bordered>
      <Collapse title={"New Thread"}>
        <Container>
          <Radio.Group orientation="horizontal" label="subjects" 
          color="primary" 
          value={selectedSubject}
          onChange = {setSelectedSubject}>
            {subjects.map((subject) => (
              <Radio value={subject.value} color="primary" size="sm">
                {subject.label}
              </Radio>
            ))}
          </Radio.Group>
          
          <Radio.Group orientation="horizontal" label="recepients" 
            color="primary" 
            value={recipientType}
            onChange = {setRecipientType}>
            {recepients.map((recepient) => (
              <Radio key={recepient.value} value={recepient.value} 
              color="primary" size="sm">
                {recepient.label}
              </Radio>
            ))}
          </Radio.Group>


          {recipientType === 'friend'? (
            <>
              <Dropdown>
              <Dropdown.Button flat color="primary" css={{ tt: "capitalize" }}>
                {selectedFriend ? selectedFriend : "Select Friend"}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Friend"
                color="primary"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedFriend}
                onSelectionChange={handleFriendChange}
              >
                {friends.map((friend) => (
                  <Dropdown.Item key={friend.username}>
                    {friend.username}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            </>
          ): recipientType === 'neighbor'?(
            <Dropdown>
              <Dropdown.Button flat color="primary" css={{ tt: "capitalize" }}>
                {selectedNeighbor ? selectedNeighbor : "Select Neighbor"}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Neighbor"
                color="primary"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedNeighbor}
                onSelectionChange={handleNeighborChange}
              >
                {neighbors.map((neighbor) => (
                  <Dropdown.Item key={neighbor.username}>
                    {neighbor.username}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          ): null}
      
          <Input
            {...titleBindings}
            bordered
            color="primary"
            fullWidth
            label="Title (Required)"
          />
          <Textarea
            {...descriptionBindings}
            bordered
            color="primary"
            fullWidth
            label="Description (Required)"
          />
          <AddressAutofill accessToken={token} onRetrieve={handleRetrieve}>
            <Input
              {...locationBindings}
              bordered
              color="primary"
              fullWidth
              label="Location (Required)"
              name="address"
              placeholder="Address"
              type="text"
              autoComplete="address-line1"
            />
          </AddressAutofill>
          <Row>
            <Input
              {...dateBindings}
              bordered
              fullWidth
              color="primary"
              label="Date (Optional)"
              type="date"
            />
            <Spacer x={1} />
            <Input
              {...timeBindings}
              bordered
              fullWidth
              color="primary"
              label="Time (Optional)"
              type="time"
            />
          </Row>

          <Spacer y={1} />
          <Button
            disabled={
              titleValue.length < 3 ||
              descriptionValue.length < 4 ||
              locationValue.length < 3 ||
              disableSubmit
            }
            onPress={handleSubmit}
          >
            {disableSubmit ? (
              <Loading type="default" color="currentColor" size="sm" />
            ) : (
              <>Submit</>
            )}
          </Button>
        </Container>
      </Collapse>
    </Collapse.Group>
  );
}
