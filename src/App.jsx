import { useState, useEffect } from 'react'
import './App.css'

// (El hook useLocalStorage no cambia, lo omito por brevedad pero debe estar aquí)
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
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [newTaskText, setNewTaskText] = useState('');
  
  // --- NUEVO: ESTADO PARA PERMISO DE NOTIFICACIONES ---
  const [notificationPermission, setNotificationPermission] = useState('default');

  // Al cargar la app, revisamos el permiso actual
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // --- NUEVO: FUNCIÓN PARA SOLICITAR PERMISO ---
  const handleRequestNotificationPermission = () => {
    if (!('Notification' in window)) {
      alert('Este navegador no soporta notificaciones de escritorio.');
      return;
    }
    
    Notification.requestPermission().then((permission) => {
      setNotificationPermission(permission);
    });
  };
  
  // --- NUEVO: FUNCIÓN PARA MOSTRAR UNA NOTIFICACIÓN ---
  const showNotification = (title, body) => {
    // Solo mostramos si el permiso fue concedido
    if (notificationPermission === 'granted') {
      // Usamos el Service Worker para mostrar la notificación (mejor práctica para PWA)
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          body: body,
          icon: '/icons/icon-192x192.png', // Opcional: un icono para la notificación
          badge: '/icons/icon-192x192.png', // Opcional: un icono para Android
          vibrate: [200, 100, 200], // Opcional: patrón de vibración
        });
      });
    }
  };

  // Manejador para añadir una nueva tarea (actualizado)
  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskText.trim() === '') return;

    const newTask = {
      id: Date.now(),
      text: newTaskText,
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setNewTaskText('');

    // --- NUEVO: MOSTRAR NOTIFICACIÓN AL AÑADIR TAREA ---
    showNotification('¡Tarea Agregada!', `"${newTask.text}" se añadió a tu lista.`);
  };

  const handleToggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('¿Seguro que quieres eliminar esta tarea?')) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Mis Tareas 📋</h1>
        <p>Simple, rápido y offline.</p>
        
        {/* --- NUEVO: BOTÓN PARA ACTIVAR NOTIFICACIONES --- */}
        {/* Solo se muestra si aún no se ha concedido el permiso */}
        {notificationPermission === 'default' && (
          <button 
            className="notification-button"
            onClick={handleRequestNotificationPermission}
          >
            Activar Notificaciones 🔔
          </button>
        )}
      </header>

      <form className="add-task-form" onSubmit={handleAddTask}>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="¿Qué necesitas hacer?"
        />
        <button type="submit">Añadir</button>
      </form>

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

export default App;