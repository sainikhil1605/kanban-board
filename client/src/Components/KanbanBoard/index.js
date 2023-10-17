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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import ModalStyles from "../CardModal/CardModal.styles";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../utils/reducers/authReducer";
import { addTask, initialiseTasks } from "../../utils/reducers/taskReducer";
import store from "../../utils/store";
import { initialiseUsers } from "../../utils/reducers/userReducer";
import { initialiseLanes } from "../../utils/reducers/laneReducer";

const KanbanBoard = () => {
  const tasks = useSelector((state) => state.tasks);
  console.log(tasks);
  const [open, setOpen] = useState(false);
  const [addLaneOpen, setAddLaneOpen] = useState(false);
  const [currUser, setCurrUser] = useState(null);
  const users = useSelector((state) => state.users);
  const lanes = useSelector((state) => state.lanes);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currItem, setItem] = useState({
    title: "",
    description: "",
    status: "",
  });
  const handleSubmit = () => {
    return async function addNewTask(dispatch, getState) {
      const data = await axiosInstance.post("/task", currItem);
      dispatch(addTask(data.data));
      setOpen(false);
    };
  };

  const filterUser = (id) => {
    if (currUser === Number(id)) {
      setCurrUser(null);
      return;
    }
    setCurrUser(Number(id));
  };
  const getTasks = () => {
    return async function getData(dispatch, getState) {
      const tasks = await axiosInstance.get("/task");
      dispatch(initialiseTasks(tasks.data));
    };
  };

  const getUsers = () => {
    return async function getData(dispatch, getState) {
      const users = await axiosInstance.get("/getUsers");
      dispatch(initialiseUsers(users.data));
    };
  };
  const getLanes = () => {
    return async function getData(dispatch, getState) {
      const lanes = await axiosInstance.get("/lane");
      dispatch(initialiseLanes(lanes.data));
    };
  };
  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
    }
    store.dispatch(getTasks());
    store.dispatch(getUsers());
    store.dispatch(getLanes());
  }, []);
  const deleteChannel = async (id) => {
    const data = await axiosInstance.delete(`/lane/${id}`);
    getLanes();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  const handleTaskAdd = () => {
    return async function addNewTask(dispatch, getState) {
      const data = await axiosInstance.post("/lane", currItem);
      dispatch(initialiseTasks(data.data));
      setAddLaneOpen(false);
    };
  };
  return (
    <main>
      <div style={classes.header}>
        {addLaneOpen && (
          <Dialog open={addLaneOpen} fullWidth maxWidth="xs">
            <DialogTitle>
              <div>Add New Lane</div>
            </DialogTitle>
            <DialogContent dividers>
              <div style={ModalStyles.dialogField}>
                <TextField
                  fullWidth
                  label="Lane Title"
                  value={currItem.title}
                  onChange={(e) =>
                    setItem({ ...currItem, title: e.target.value })
                  }
                  variant="outlined"
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setItem({ title: "" });
                  setAddLaneOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={() => store.dispatch(handleTaskAdd())}>
                Add
              </Button>
            </DialogActions>
          </Dialog>
        )}
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
            // setTaskStatus={setTaskStatus}
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
          <Button
            color="error"
            variant="contained"
            onClick={() => handleLogout()}
          >
            Logout
          </Button>
        </div>
      </div>

      <DndProvider backend={HTML5Backend}>
        <section style={classes.board}>
          {lanes.map((channel) => (
            <KanbanColumn
              key={channel?.id}
              status={channel?.value}
              // changeTaskStatus={changeTaskStatus}
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
