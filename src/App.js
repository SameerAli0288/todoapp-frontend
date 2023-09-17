import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // Import your CSS file

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [editMode, setEditMode] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await axios.get("http://localhost:4000/api/todos");
        setTodos(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTodos();
  }, []);

  const handleCreateTodo = async () => {
    try {
      if (editMode) {
        await axios.put(
          `http://localhost:4000/api/todos/${editingTodo.id}`,
          newTodo
        );
        const updatedTodos = todos.map((todo) =>
          todo.id === editingTodo.id ? { ...todo, ...newTodo } : todo
        );
        setTodos(updatedTodos);
        setEditMode(false);
        setEditingTodo(null);
      } else {
        const response = await axios.post(
          "http://localhost:4000/api/todos",
          newTodo
        );
        setTodos([...todos, response.data]);
      }
      setNewTodo({ title: "", description: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditTodo = (todo) => {
    setEditMode(true);
    setEditingTodo(todo);
    setNewTodo({
      title: todo.title,
      description: todo.description,
    });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditingTodo(null);
    setNewTodo({ title: "", description: "" });
  };

  const handleUpdateTodo = async (id, completed) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/todos/${id}`,
        {
          completed: !completed,
        }
      );
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, completed: response.data.completed } : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/todos/${id}`);
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <div className="todo-form">
        <input
          type="text"
          placeholder="Title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTodo.description}
          onChange={(e) =>
            setNewTodo({ ...newTodo, description: e.target.value })
          }
        />
        <button
          style={{
            marginRight: "5px",
          }}
          onClick={handleCreateTodo}
        >
          {editMode ? "Update Todo" : "Add Todo"}
        </button>
        {editMode && <button onClick={handleCancelEdit}>Cancel</button>}
      </div>
      <div className="todo-list">
        {todos.map((todo) => (
          <div className="todo" key={todo.id}>
            <div>
              <h3>{todo.title}</h3>
              <p>{todo.description}</p>
            </div>
            <div>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleUpdateTodo(todo.id, todo.completed)}
              />
              {/* {editMode && editingTodo === todo ? (
                <button onClick={handleCreateTodo}>Update</button>
              ) : (
                <button
                  style={{
                    backgroundColor: todo.completed ? "gray" : "skyblue",
                  }}
                  onClick={() => handleUpdateTodo(todo.id, todo.completed)}
                >
                  {todo.completed ? "Completed" : "Complete"}
                </button>
              )} */}
              <button
                style={{
                  backgroundColor: "skyblue",
                  marginRight: "5px",
                }}
                onClick={() => handleEditTodo(todo)}
              >
                Edit
              </button>
              <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
