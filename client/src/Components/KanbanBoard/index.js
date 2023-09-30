import React, { useState, useCallback, useRef, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import classes from "./kanban.styles";
import KanbanItem from "../KanbanItem";
import KanbanColumn from "../KanbanColumn";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
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
import {
  channels,
  dropdownOptions,
  labelsMap,
  tasksList,
} from "../../utils/channels";
import itemStyles from "../KanbanItem/KanbanItem.styles";
import axiosInstance from "../../utils/axiosInstance";
import CardModal from "../CardModal";
import { deepOrange } from "@mui/material/colors";

// const AddTaskDialog = ({ open, setTaskStatus, setOpen, users }) => {
//   return (
//     <Dialog open={open} fullWidth maxWidth="xs">
//       <DialogTitle>
//         <div>Add New Task</div>
//       </DialogTitle>
//       <DialogContent dividers>
//         <div style={itemStyles.dialogField}>
//           <TextField
//             fullWidth
//             label="Task Title"
//             value={currItem.title}
//             onChange={(e) => setItem({ ...currItem, title: e.target.value })}
//             variant="outlined"
//           />
//         </div>
//         <div style={itemStyles.dialogField}>
//           <TextField
//             fullWidth
//             label="Description"
//             value={currItem.description}
//             onChange={(e) =>
//               setItem({ ...currItem, description: e.target.value })
//             }
//             variant="outlined"
//           />
//         </div>
//         <div style={itemStyles.dialogField}>
//           <Autocomplete
//             disablePortal
//             id="combo-box-demo"
//             options={dropdownOptions}
//             sx={{ width: 300 }}
//             value={currItem.status}
//             // getOptionLabel={(option) => option.label}
//             onChange={(e, newValue) =>
//               setItem({ ...currItem, status: newValue.value })
//             }
//             renderInput={(params) => <TextField {...params} label="Status" />}
//           />
//         </div>
//         <div style={itemStyles.dialogField}>
//           <Autocomplete
//             disablePortal
//             id="combo-box-demo"
//             options={users}
//             sx={{ width: 300 }}
//             getOptionLabel={(option) => option.name}
//             value={currItem.assignedTo}
//             onChange={(e, newValue) => {
//               setItem({ ...currItem, assignedTo: newValue });
//               console.log(newValue);
//             }}
//             renderInput={(params) => <TextField {...params} label="Assigned" />}
//           />
//         </div>
//       </DialogContent>
//       <DialogActions>
//         <div>
//           <Button onClick={() => handleSubmit()}>Save Changes</Button>
//         </div>
//       </DialogActions>
//     </Dialog>
//   );
// };
const KanbanBoard = () => {
  const [tasks, setTaskStatus] = useState(tasksList);
  const [open, setOpen] = useState(false);
  const [isUserFilter, setUserFilter] = useState(false);
  const [currUser, setCurrUser] = useState(null);
  const [users, setUsers] = useState([]);

  const changeTaskStatus = useCallback(
    async (id, status) => {
      let task = tasks?.find((task) => task.id === id);
      const taskIndex = tasks.indexOf(task);
      const data = await axiosInstance.patch(`/task/${id}`, { status });
      task = { ...task, status };
      const newTasks = [...tasks];
      newTasks[taskIndex] = task;
      setTaskStatus(newTasks);

      //   let newTasks = update(tasks, {
      //     [taskIndex]: { $set: task },
      //   });
      //   setTaskStatus(newTasks);
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
    if (isUserFilter && currUser === Number(id)) {
      setUserFilter(false);
      setCurrUser(null);
      setTaskStatus(tasksList);
      return;
    }
    const filteredTasks = tasksList?.filter((item) => {
      return item.assignedTo.id === Number(id);
    });
    setCurrUser(Number(id));
    setTaskStatus(filteredTasks);
    setUserFilter(true);
  };
  const getTasks = async () => {
    const tasks = await axiosInstance.get("/task");
    setTaskStatus(tasks.data);
  };
  const getUsers = async () => {
    const userData = await axiosInstance.get("/getUsers");

    setUsers(userData.data);
  };
  useEffect(() => {
    getTasks();
    getUsers();
  }, []);

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
        </div>
      </div>

      <DndProvider backend={HTML5Backend}>
        <section style={classes.board}>
          {channels.map((channel) => (
            <KanbanColumn
              key={channel}
              status={channel}
              changeTaskStatus={changeTaskStatus}
            >
              <div style={classes.column}>
                <div style={{ display: "flex" }}>
                  <Typography
                    style={classes.columnHead}
                    variant="h2"
                    component="h2"
                  >
                    {labelsMap[channel]}
                  </Typography>
                </div>

                <div style={{ margin: "5px" }}>
                  {tasks
                    ?.filter((item) => item.status === channel)
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
