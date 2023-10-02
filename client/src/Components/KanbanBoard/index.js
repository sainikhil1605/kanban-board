import React, { useState, useCallback, useRef, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import classes from "./kanban.styles";
import KanbanItem from "../KanbanItem";
import KanbanColumn from "../KanbanColumn";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  AvatarGroup,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import itemStyles from "../KanbanItem/KanbanItem.styles";
import axiosInstance from "../../utils/axiosInstance";
import CardModal from "../CardModal";
import { deepOrange } from "@mui/material/colors";
import { channels } from "../../utils/channels";

const KanbanBoard = () => {
  const [tasks, setTaskStatus] = useState([]);
  const [open, setOpen] = useState(false);
  const [addLaneOpen, setAddLaneOpen] = useState(false);
  const [currUser, setCurrUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [lanes, setLanes] = useState([]);

  const changeTaskStatus = useCallback(
    async (id, status) => {
      let task = tasks?.find((task) => task.id === id);
      const taskIndex = tasks.indexOf(task);
      const data = await axiosInstance.patch(`/task/${id}`, { status });
      task = { ...task, status };
      const newTasks = [...tasks];
      newTasks[taskIndex] = task;
      setTaskStatus(newTasks);
    },
    [tasks]
  );
  const [currItem, setItem] = useState({
    title: "",
    description: "",
    status: "",
  });
  const handleSubmit = async () => {
    const data = await axiosInstance.post("/task", currItem);
    setTaskStatus((prev) => [...prev, data.data]);
    setOpen(false);
  };

  const filterUser = (id) => {
    if (currUser === Number(id)) {
      setCurrUser(null);
      return;
    }
    setCurrUser(Number(id));
  };
  const getTasks = async () => {
    const tasks = await axiosInstance.get("/task");
    setTaskStatus(tasks.data);
  };
  const getUsers = async () => {
    const userData = await axiosInstance.get("/getUsers");

    setUsers(userData.data);
  };
  const getLanes = async () => {
    const lanes = await axiosInstance.get("/lane");
    setLanes(lanes.data);
  };
  useEffect(() => {
    getTasks();
    getUsers();
    getLanes();
  }, []);
  const deleteChannel = async (id) => {
    const data = await axiosInstance.delete(`/lane/${id}`);
    getLanes();
  };
  return (
    <main>
      <div style={classes.header}>
        <div className="heading" style={{ flex: "1" }}>
          <div
            style={{
              display: "flex",
              maxWidth: "250px",
              alignItems: "flex-end",
            }}
          >
            <TextField
              fullWidth
              placeholder="search"
              variant="outlined"
              style={itemStyles.searchField}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <AvatarGroup max={4} style={{ justifyContent: "flex-end" }}>
              {users.map((user) => (
                <Avatar
                  key={user.id}
                  alt={user.name}
                  id={user.id}
                  style={
                    user.id === currUser ? { border: "2px solid blue" } : {}
                  }
                  imgProps={{
                    id: user.id,
                    style: { cursor: "pointer" },
                  }}
                  src={user.avatarSrc || "https://"}
                  sx={{ bgcolor: deepOrange[500] }}
                  onClick={(e) => filterUser(e.target.id)}
                />
              ))}
            </AvatarGroup>
          </div>
        </div>
        <div>
          <CardModal
            open={open}
            setTaskStatus={setTaskStatus}
            users={users}
            handleSubmit={handleSubmit}
            setItem={setItem}
            currItem={currItem}
            isNewTask={true}
            lanes={lanes}
          />
          <Button
            onClick={() => setOpen(true)}
            variant="outlined"
            style={{
              backgroundColor: "#1976d2",
              color: "#fff",
              margin: "10px",
            }}
          >
            Add Task
          </Button>
          <Button
            onClick={() => setAddLaneOpen(true)}
            variant="outlined"
            style={{
              backgroundColor: "#1976d2",
              color: "#fff",
              margin: "10px",
            }}
          >
            Add Lane
          </Button>
        </div>
      </div>

      <DndProvider backend={HTML5Backend}>
        <section style={classes.board}>
          {lanes.map((channel) => (
            <KanbanColumn
              key={channel?.id}
              status={channel?.value}
              changeTaskStatus={changeTaskStatus}
            >
              <div style={classes.column}>
                <div style={{ display: "flex" }}>
                  <Typography
                    style={classes.columnHead}
                    variant="h2"
                    component="h2"
                  >
                    {channel?.title}
                  </Typography>
                </div>
                <div>
                  {tasks.findIndex((task) => task.status === channel?.value) !==
                  -1 ? undefined : (
                    <Button
                      id={channel.id}
                      onClick={(e) => deleteChannel(e.target.id)}
                    >
                      Delete Lane
                    </Button>
                  )}
                </div>

                <div style={{ margin: "5px" }}>
                  {tasks
                    ?.filter(
                      (item) =>
                        item.status === channel?.value &&
                        (currUser === null ||
                          currUser === Number(item.assignedTo.id))
                    )
                    .map((item) => (
                      <KanbanItem
                        key={item.id}
                        id={item.id}
                        item={item}
                        setTaskStatus={setTaskStatus}
                        tasks={tasks}
                        users={users}
                      />
                    ))}
                </div>
              </div>
            </KanbanColumn>
          ))}
        </section>
      </DndProvider>
    </main>
  );
};

export default KanbanBoard;
