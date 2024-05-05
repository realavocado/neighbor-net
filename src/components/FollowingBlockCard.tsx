import { Table, Row, Col, Tooltip, User, Text } from "@nextui-org/react";
import { IconButton } from "@/styles/IconButton";
import { EyeIcon } from "@/styles/EyeIcon";
import { EditIcon } from "@/styles/EditIcon";
import { DeleteIcon } from "@/styles/DeleteIcon";
import UserProfile from "./UserProfile";

interface BlockInterface {
  followings: Block[];
}

interface Block {
  id: string;
  name: string;
  fullName?: string;
  avatar?: string;
}

export default function FollowingBlockCard(props: BlockInterface) {
  const columns = [
    { name: "NAME", uid: "name" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = (block: Block, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return (
          <Text>{block.name}</Text>
        );
      case "actions":
        return (
          <Row justify="center" align="center">
            <Col css={{ d: "flex" }}>
              <Tooltip content="Details">
                <IconButton onClick={() => console.log("View block", block?.id)}>
                  <EyeIcon size={20} fill="#979797" />
                </IconButton>
              </Tooltip>
            </Col>
          </Row>
        );
      default:
        return null;
    }
  };

  return (
    <Table
      aria-label="Example table with custom cells"
      css={{
        height: "auto",
        minWidth: "100%",
      }}
      selectionMode="none"
    >
      <Table.Header columns={columns}>
        {(column) => (
          <Table.Column
            key={column.uid}
            hideHeader={column.uid === "actions"}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </Table.Column>
        )}
      </Table.Header>
      <Table.Body items={props.followings}>
        {(item: Block) => (
          <Table.Row>
            {(columnKey) => (
              <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
            )}
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
}
