import { auth } from "@/pages/_app";
import { ThreadItem }from "@/types/FeedItem";
import User from "@/types/User";
import { useDocument } from "@nandorojo/swr-firestore";
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
import { useCallback, useEffect, useState } from "react";
import { AddressAutofill, config } from "@mapbox/search-js-react";

interface EventModalProps {
  open: boolean;
  add: (data: ThreadItem | ThreadItem[]) => Promise<void> | null;
  close: () => void;
}

export default function EventModal(props: EventModalProps) {
  function handleSubmit() {
    setDisableSubmit(true);
    setTimeout(function () {
      uploadDocument();
    }, 250);
  }
  const {
    data: userData,
    update: updateUserData,
    error: userDataError,
  } = useDocument<User>(`users/${auth.currentUser?.uid}`);

  function uploadDocument() {
    // props
    //   .add({
    //     creationDate: Date.now(),
    //     title: titleValue,
    //     description: descriptionValue,
    //     authorId: auth.currentUser!.uid,
    //     author: {
    //       fullName: userData!.fullName,
    //       avatarUrl: userData?.avatarUrl,
    //     },
    //     address:
    //       locationValue != ""
    //         ? {
    //             latitude: latitude,
    //             longitude: longitude,
    //             streetAddress: locationValue,
    //             city: city,
    //             country: country,
    //           }
    //         : undefined,
    //     eventType: isIncident ? "incident" : "regular",
    //   })
    //   ?.then(() => {
    //     props.close();
    //     resetFields()
    //     setTimeout(function () {
    //       setDisableSubmit(false);
    //     }, 750);
    //   });
  }

  const [isIncident, setIsIncident] = useState(true);

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

  useEffect(() => {
    config.accessToken = token;
  }, []);

  const handleRetrieve = useCallback(
    (res: any) => {
      console.log(res.features[0].properties);
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
    { value: "Lost Pet", label: "Lost Pet" },
    { value: "Event", label: "Event" },
    { value: "Other", label: "Other" },
  ];

  const recepients = [
    { label: "All Block", value: "Block" },
    { label: "All Neigborhood", value: "Hood" },
    { label: "All Friends", value: "Friends" },
    { label: "All Neighbors", value: "Neighbors" },
    { label: "A Friend", value: "Friend" },
    { label: "A Neighbor", value: "Neighbor" },
  ];

  const friends_t = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Doe" },
    { id: "3", name: "Sam Smith" },
  ];

  const neighbors_t = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Doe" },
    { id: "3", name: "Sam Smith" },
  ];

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

  return (
    <Collapse.Group bordered>
      <Collapse title={"New Thread"}>
        <Container>
          {/* <Select 
            label="Select an animal" 
            className="max-w-xs" 
          >
            {subjects.map((subject) => (
              <SelectItem key={subject.value} value={subject.value}>
                {subject.label}
              </SelectItem>
            ))}
          </Select> */}
          <Radio.Group orientation="horizontal" label="subjects" 
          color="primary" 
          value={recipientType}
          onChange = {setRecipientType}>
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


          {recipientType === 'Friend'? (
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
                {friends_t.map((friend) => (
                  <Dropdown.Item key={friend.name}>
                    {friend.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            </>
          ): recipientType === 'Neighbor'?(
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
                {neighbors_t.map((neighbor) => (
                  <Dropdown.Item key={neighbor.name}>
                    {neighbor.name}
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
              titleValue.length < 4 ||
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
