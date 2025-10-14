import { useState, useEffect } from 'react'
import './App.css' // Importaremos los estilos específicos más abajo

// Hook personalizado para usar localStorage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

function App() {
  // Estado principal de las tareas, sincronizado con localStorage
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  // Estado para el texto del nuevo input
  const [newTaskText, setNewTaskText] = useState('');

  // Manejador para añadir una nueva tarea
  const handleAddTask = (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página
    if (newTaskText.trim() === '') return; // No añadir tareas vacías

    const newTask = {
      id: Date.now(), // ID único basado en la fecha
      text: newTaskText,
      completed: false,
    };

    setTasks([newTask, ...tasks]); // Añade la nueva tarea al inicio de la lista
    setNewTaskText(''); // Limpia el input
  };

  // Manejador para marcar una tarea como completada/incompleta
  const handleToggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Manejador para eliminar una tarea
  const handleDeleteTask = (id) => {
    // Pide confirmación
    if (window.confirm('¿Seguro que quieres eliminar esta tarea?')) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Mis Tareas 📋</h1>
        <p>Simple, rápido y offline.</p>
      </header>

      {/* Formulario para añadir tareas */}
      <form className="add-task-form" onSubmit={handleAddTask}>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="¿Qué necesitas hacer?"
        />
        <button type="submit">Añadir</button>
      </form>

      {/* Lista de tareas */}
      <div className="task-list">
        {tasks.length === 0 ? (
          <p className="empty-state">¡No hay tareas pendientes! 🎉</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`task-item ${task.completed ? 'completed' : ''}`}
            >
              <div className="task-content" onClick={() => handleToggleTask(task.id)}>
                <span className="task-checkbox">
                  {task.completed ? '✅' : '⬜️'}
                </span>
                <span className="task-text">{task.text}</span>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDeleteTask(task.id)}
              >
                Borrar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App