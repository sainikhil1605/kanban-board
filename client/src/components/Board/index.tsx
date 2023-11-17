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
import { deepOrange } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate } from "react-router-dom";
import ProjectState from "../../types/projectTypes";
import axiosInstance from "../../utils/axiosInstance";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { initialiseAuthUser, logout } from "../../utils/reducers/authReducer";
import { initialiseLanes } from "../../utils/reducers/laneReducer";
import { addTask, initialiseTasks } from "../../utils/reducers/taskReducer";
import { initialiseUsers } from "../../utils/reducers/userReducer";
import store, { AppDispatch } from "../../utils/store";
import Card from "../Card";
import itemStyles from "../Card/kanbanCard.styles";
import Lane from "../Lane";
import Modal from "../Modal";
import ModalStyles from "../Modal/modal.styles";
import classes from "./kanbanBoard.styles";

const KanbanBoard = () => {
  const tasks = useAppSelector((state: ProjectState) => state.tasks);
  const auth = useAppSelector((state: ProjectState) => state.auth);
  const [open, setOpen] = useState(false);
  const [addLaneOpen, setAddLaneOpen] = useState(false);
  const [currUser, setCurrUser] = useState<number | null>(null);
  const users = useAppSelector((state: ProjectState) => state.users);
  const lanes = useAppSelector((state: ProjectState) => state.lanes);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [currItem, setItem] = useState({
    title: "",
    description: "",
    value: "",
  });
  const handleSubmit = () => {
    return async function addNewTask(dispatch: AppDispatch) {
      const data = await axiosInstance.post("/task", currItem);
      dispatch(addTask(data.data));
      setOpen(false);
    };
  };

  const filterUser = (id: number) => {
    if (currUser === Number(id)) {
      setCurrUser(null);
      return;
    }
    setCurrUser(Number(id));
  };
  const getTasks = () => {
    return async function getData(dispatch: AppDispatch) {
      const tasks = await axiosInstance.get("/task");
      dispatch(initialiseTasks(tasks.data));
    };
  };

  const getUsers = () => {
    return async function getData(dispatch: AppDispatch) {
      const users = await axiosInstance.get("/getUsers");
      dispatch(initialiseUsers(users.data));
    };
  };
  const getLanes = () => {
    return async function getData(dispatch: AppDispatch) {
      const lanes = await axiosInstance.get("/lane");
      dispatch(initialiseLanes(lanes.data));
    };
  };
  const getUserDetails = () => {
    return async function getData(dispatch: AppDispatch) {
      const user = await axiosInstance.get(`/getUser/${auth?.id}`);
      dispatch(initialiseAuthUser(user.data));
    };
  };
  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
    }
    if (auth?.token) {
      store.dispatch(getUserDetails());
      store.dispatch(getTasks());
      store.dispatch(getUsers());
      store.dispatch(getLanes());
    }
  }, []);
  const deleteChannel = async (id: number) => {
    await axiosInstance.delete(`/lane/${id}`);
    getLanes();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  const handleTaskAdd = () => {
    return async function addNewTask(dispatch: AppDispatch) {
      currItem.value = currItem.title.toLowerCase().replace(/\s/g, "");
      const data = await axiosInstance.post("/lane", currItem);
      setItem({
        title: "",
        description: "",
        value: "",
      });
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
                  setItem({
                    title: "",
                    description: "",
                    value: "",
                  });
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
                  style={
                    user.id === currUser ? { border: "2px solid blue" } : {}
                  }
                  imgProps={{
                    style: { cursor: "pointer" },
                  }}
                  src={user.avatarSrc || "https://"}
                  sx={{ bgcolor: deepOrange[500] }}
                  onClick={() => filterUser(user.id)}
                  component="div"
                />
              ))}
            </AvatarGroup>
          </div>
        </div>
        <div>
          <Modal
            open={open}
            handleSubmit={handleSubmit}
            setItem={setItem}
            currItem={currItem}
            isNewTask={true}
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
          <Button>
            {/* <Avatar
              key={user.id}
              alt={user.name}
              style={user.id === currUser ? { border: "2px solid blue" } : {}}
              imgProps={{
                style: { cursor: "pointer" },
              }}
              src={user.avatarSrc || "https://"}
              sx={{ bgcolor: deepOrange[500] }}
              onClick={() => filterUser(user.id)}
              component="div"
            /> */}
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
            <Lane key={channel?.id} status={channel?.value}>
              <div style={classes.column}>
                <div style={{ display: "flex" }}>
                  <Typography
                    style={classes.columnHead}
                    textAlign="center"
                    variant="h2"
                    component="h2"
                  >
                    {channel?.title}
                  </Typography>
                </div>
                <div>
                  {tasks.findIndex((task) => task.status === channel?.value) !==
                  -1 ? undefined : (
                    <Button onClick={() => deleteChannel(channel.id)}>
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
                      <Card key={item.id} task={item} />
                    ))}
                </div>
              </div>
            </Lane>
          ))}
        </section>
      </DndProvider>
    </main>
  );
};

export default KanbanBoard;
