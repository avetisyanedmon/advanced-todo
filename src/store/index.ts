import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./slices/tasksSlice";
import type { Task } from "../types";
import { loadFromLocalStorage } from "../utils/loadFromLocalStorage";
import { saveToLocalStorage } from "../utils/saveToLocalStorage";

const preloadedTasks = loadFromLocalStorage<Task[]>("tasks") || [];

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
  preloadedState: {
    tasks: { tasks: preloadedTasks },
  },
});

store.subscribe(() => {
  const state = store.getState();
  saveToLocalStorage("tasks", state.tasks.tasks);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
