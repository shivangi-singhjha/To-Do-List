import React, { useState, useEffect } from "react";
import "./ToDoList.css";

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("default");
  const [isEditing, setIsEditing] = useState(null);
  const [editInput, setEditInput] = useState("");

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (input.trim()) {
      setTasks([...tasks, { text: input, completed: false }]);
      setInput("");
    }
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleCompletion = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  const startEditing = (index) => {
    setIsEditing(index);
    setEditInput(tasks[index].text);
  };

  const cancelEditing = () => {
    setIsEditing(null);
    setEditInput("");
  };

  const saveTask = (index) => {
    if (editInput.trim()) {
      const newTasks = tasks.map((task, i) =>
        i === index ? { ...task, text: editInput } : task
      );
      setTasks(newTasks);
      setIsEditing(null);
      setEditInput("");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sort === "alphabetical") return a.text.localeCompare(b.text);
    if (sort === "completed") return a.completed - b.completed;
    return 0;
  });

  return (
    <div className="todo-list">
      <h1>To-Do List</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a task"
      />
      <button onClick={addTask}>Add</button>
      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setSort("alphabetical")}>
          Sort Alphabetical
        </button>
        <button onClick={() => setSort("completed")}>Sort by Completed</button>
      </div>
      <ul>
        {sortedTasks.map((task, index) => (
          <li key={index} className={task.completed ? "completed" : ""}>
            {isEditing === index ? (
              <div>
                <input
                  type="text"
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                />
                <button onClick={() => saveTask(index)}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </div>
            ) : (
              <div>
                <span onClick={() => toggleCompletion(index)}>{task.text}</span>
                <button onClick={() => startEditing(index)}>Edit</button>
                <button onClick={() => removeTask(index)}>Remove</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
