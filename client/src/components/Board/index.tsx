import { Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate } from "react-router-dom";
import ProjectState from "../../types/projectTypes";
import User from "../../types/userTypes";
import axiosInstance from "../../utils/axiosInstance";
import { useAppSelector } from "../../utils/hooks";
import { initialiseAuthUser } from "../../utils/reducers/authReducer";
import { initialiseLanes } from "../../utils/reducers/laneReducer";
import { initialiseTasks } from "../../utils/reducers/taskReducer";
import { initialiseUsers } from "../../utils/reducers/userReducer";
import store, { AppDispatch } from "../../utils/store";
import Card from "../Card";
import Header from "../Header";
import Lane from "../Lane";
import classes from "./kanbanBoard.styles";

const KanbanBoard = () => {
  const { users, auth, tasks } = useAppSelector((state: ProjectState) => state);

  const [currUser, setCurrUser] = useState<number | null>(null);
  const lanes = useAppSelector((state: ProjectState) => state.lanes);
  const navigate = useNavigate();

  const getTasks = () => {
    return async function getData(dispatch: AppDispatch) {
      const tasks = await axiosInstance.get("/task");
      dispatch(initialiseTasks(tasks.data));
    };
  };
  const fetchImage = async (avatarSrc: string) => {
    const data = await axiosInstance.get(
      `http://localhost:8080/api/v1/${avatarSrc}`,
      { responseType: "blob" }
    );
    return URL.createObjectURL(data.data);
  };
  const getUsers = () => {
    return async function getData(dispatch: AppDispatch) {
      const users = await axiosInstance.get("/getUsers");
      const parsedUsers = users.data.map(async (user: User) => {
        let fetchedAvatar = user?.avatarSrc;
        if (user?.avatarSrc !== null) {
          fetchedAvatar = await fetchImage(user?.avatarSrc);
        }
        return { ...user, avatarSrc: fetchedAvatar };
      });
      // console.log(Promise.all(parsedUsers));
      Promise.all(parsedUsers).then((data) => {
        console.log(data);
        dispatch(initialiseUsers(data));
      });
      // dispatch(initialiseUsers(users.data));
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
      if (user.data?.avatarSrc) {
        const data = await fetchImage(user.data?.avatarSrc);
        user.data.avatarSrc = data;
      }
      console.log(user.data);
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
  }, [auth?.token, navigate]);
  const deleteChannel = async (id: number) => {
    await axiosInstance.delete(`/lane/${id}`);
    getLanes();
  };

  return (
    <main>
      <div style={classes.header}>
        <Header currUser={currUser} setCurrUser={setCurrUser} />
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
                      <Card
                        key={item.id}
                        task={item}
                        avatarSrc={
                          users.find((user) => user.id === item.assignedTo.id)
                            ?.avatarSrc
                        }
                      />
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
