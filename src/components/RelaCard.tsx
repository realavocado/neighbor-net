import { Table, Row, Col, Tooltip, User, Text } from "@nextui-org/react";
import { IconButton } from "@/styles/IconButton";
import { EyeIcon } from "@/styles/EyeIcon";
import { EditIcon } from "@/styles/EditIcon";
import { DeleteIcon } from "@/styles/DeleteIcon";
import UserProfile from "./UserProfile";

interface RelaTypeInterface {
  rela: RelaType[];
}

interface RelaType {
  id: string;
  username: string;
  avatar?: string;
}

export default function RelaCard(props: RelaTypeInterface) {
  const columns = [
    { name: "NAME", uid: "username" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = (user: RelaType, columnKey: React.Key) => {
    switch (columnKey) {
      case "username":
        return <UserProfile fullName={user.username} avatarUrl={user.avatar} />;
      case "actions":
        return (
          <Row justify="center" align="center">
            <Col css={{ d: "flex" }}>
              <Tooltip content="Details">
                <IconButton onClick={() => console.log("View user", user?.id)}>
                  <EyeIcon size={20} fill="#979797" />
                </IconButton>
              </Tooltip>
            </Col>
            <Col css={{ d: "flex" }}>
              <Tooltip content="Edit user">
                <IconButton onClick={() => console.log("Edit user", user?.id)}>
                  <EditIcon size={20} fill="#979797" />
                </IconButton>
              </Tooltip>
            </Col>
            <Col css={{ d: "flex" }}>
              <Tooltip
                content="Delete user"
                color="error"
                onClick={() => console.log("Delete user", user?.id)}
              >
                <IconButton>
                  <DeleteIcon size={20} fill="#FF0080" />
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
      <Table.Body items={props.rela}>
        {(item: RelaType) => (
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
