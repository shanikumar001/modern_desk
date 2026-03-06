import { Bell, Check, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  reminder?: string;
}

interface TodoItemRowProps {
  todo: TodoItem;
  index: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

function TodoItemRow({
  todo,
  index,
  onToggle,
  onDelete,
  onUpdate,
}: TodoItemRowProps) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleSave = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== todo.text) {
      onUpdate(todo.id, trimmed);
    } else {
      setEditText(todo.text);
    }
    setEditing(false);
  };

  const ocidIdx = Math.min(index + 1, 5);

  return (
    <div
      className={`todo-item todo-item-enter flex items-center gap-3 px-3 py-2.5 rounded-xl group ${todo.completed ? "todo-checked" : ""}`}
      style={{
        background: todo.completed
          ? "var(--accent-soft)"
          : "rgba(255,255,255,0.04)",
        border: "1px solid var(--glass-border)",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* Checkbox */}
      <button
        type="button"
        data-ocid={`todo.checkbox.${ocidIdx}`}
        onClick={() => onToggle(todo.id)}
        className="todo-checkbox-wrapper"
        style={{ flexShrink: 0 }}
        aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
        aria-pressed={todo.completed}
      >
        {todo.completed && (
          <Check size={12} strokeWidth={3} style={{ color: "white" }} />
        )}
      </button>

      {/* Text / Edit */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={inputRef}
            data-ocid="todo.input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setEditText(todo.text);
                setEditing(false);
              }
            }}
            className="glass-input w-full px-2 py-1 text-sm"
            style={{ fontFamily: "Sora, sans-serif", fontSize: "0.85rem" }}
          />
        ) : (
          <span
            className="todo-text block truncate cursor-pointer select-none"
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: "0.85rem",
              color: "var(--text-primary)",
              transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
            }}
            onDoubleClick={() => !todo.completed && setEditing(true)}
            title="Double-click to edit"
          >
            {todo.text}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {editing ? (
          <button
            type="button"
            data-ocid={`todo.save_button.${ocidIdx}`}
            onClick={handleSave}
            className="glass-btn p-1.5"
            title="Save"
            aria-label="Save edit"
          >
            <Check size={12} style={{ color: "var(--accent-raw)" }} />
          </button>
        ) : (
          !todo.completed && (
            <button
              type="button"
              data-ocid={`todo.edit_button.${ocidIdx}`}
              onClick={() => setEditing(true)}
              className="glass-btn p-1.5 opacity-0 group-hover:opacity-100"
              title="Edit"
              aria-label="Edit task"
              style={{ transition: "opacity 0.2s ease" }}
            >
              <Bell size={11} style={{ color: "var(--text-muted)" }} />
            </button>
          )
        )}
        <button
          type="button"
          data-ocid={`todo.delete_button.${ocidIdx}`}
          onClick={() => onDelete(todo.id)}
          className="glass-btn p-1.5 opacity-0 group-hover:opacity-100"
          title="Delete"
          aria-label="Delete task"
          style={{ transition: "opacity 0.2s ease" }}
        >
          <X size={12} style={{ color: "oklch(65% 0.22 10)" }} />
        </button>
      </div>
    </div>
  );
}

export function TodoWidget() {
  const [todos, setTodos] = useLocalStorage<TodoItem[]>("dashboard_todos", [
    {
      id: "1",
      text: "Design the new dashboard layout",
      completed: true,
      createdAt: Date.now() - 3600000,
    },
    {
      id: "2",
      text: "Review glassmorphism components",
      completed: false,
      createdAt: Date.now() - 1800000,
    },
    {
      id: "3",
      text: "Add weather animations",
      completed: false,
      createdAt: Date.now() - 900000,
    },
    {
      id: "4",
      text: "Test on mobile devices",
      completed: false,
      createdAt: Date.now() - 300000,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const [notifGranted, setNotifGranted] = useLocalStorage<boolean>(
    "notif_granted",
    false,
  );

  const remaining = todos.filter((t) => !t.completed).length;

  const requestNotifPermission = async () => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
      setNotifGranted(true);
      return;
    }
    if (Notification.permission !== "denied") {
      const perm = await Notification.requestPermission();
      if (perm === "granted") setNotifGranted(true);
    }
  };

  const addTodo = () => {
    const text = inputText.trim();
    if (!text) return;
    const newTodo: TodoItem = {
      id: `todo_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
    setInputText("");
    inputRef.current?.focus();

    if (!notifGranted) requestNotifPermission();
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTodo = (id: string, text: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "done") return t.completed;
    return true;
  });

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  return (
    <div className="flex flex-col gap-3 animate-fade-in pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="widget-title" style={{ color: "var(--text-muted)" }}>
          To-Do List
        </div>
        <div className="flex items-center gap-2">
          <span
            style={{
              fontFamily: "Cabinet Grotesk, sans-serif",
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "var(--text-muted)",
            }}
          >
            {remaining > 0 ? `${remaining} remaining` : "All done! 🎉"}
          </span>
          {notifGranted && (
            <div className="notif-dot" title="Notifications enabled" />
          )}
        </div>
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          data-ocid="todo.input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="Add a new task…"
          className="glass-input flex-1 px-4 py-2.5 text-sm"
          style={{ fontFamily: "Sora, sans-serif", fontSize: "0.85rem" }}
        />
        <button
          type="button"
          data-ocid="todo.add_button"
          onClick={addTodo}
          className="glass-btn px-4 py-2.5 flex items-center gap-1.5 font-semibold text-sm"
          style={{
            background: "var(--accent-soft)",
            borderColor: "var(--accent-raw)",
            boxShadow: "0 0 12px var(--accent-glow)",
            color: "var(--text-primary)",
            fontFamily: "Cabinet Grotesk, sans-serif",
          }}
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {/* Filter Tabs */}
      <div
        className="flex gap-1"
        style={{
          borderBottom: "1px solid var(--glass-border)",
          paddingBottom: 8,
        }}
      >
        {(["all", "active", "done"] as const).map((f) => (
          <button
            key={f}
            type="button"
            data-ocid="todo.filter.tab"
            onClick={() => setFilter(f)}
            className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
            style={{
              fontFamily: "Cabinet Grotesk, sans-serif",
              letterSpacing: "0.06em",
              textTransform: "capitalize",
              background:
                filter === f ? "var(--accent-soft)" : "transparent",
              color:
                filter === f
                  ? "var(--text-primary)"
                  : "var(--text-muted)",
              border:
                filter === f
                  ? "1px solid var(--accent-raw)"
                  : "1px solid transparent",
              boxShadow:
                filter === f ? "0 0 8px var(--accent-glow)" : "none",
              transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {f}
          </button>
        ))}
        {todos.some((t) => t.completed) && (
          <button
            type="button"
            onClick={clearCompleted}
            className="ml-auto px-3 py-1 rounded-lg text-xs transition-all"
            style={{
              fontFamily: "Cabinet Grotesk, sans-serif",
              color: "oklch(65% 0.22 10)",
              border: "1px solid transparent",
              opacity: 0.75,
            }}
          >
            Clear done
          </button>
        )}
      </div>

      {/* Todo list */}
      <div
        className="flex flex-col gap-2 overflow-y-auto flex-1"
        style={{ maxHeight: 260 }}
      >
        {filteredTodos.length === 0 ? (
          <div
            data-ocid="todo.empty_state"
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              padding: "24px 0",
              fontFamily: "Cabinet Grotesk, sans-serif",
              fontSize: "0.85rem",
            }}
          >
            {filter === "done"
              ? "No completed tasks yet."
              : "No tasks yet — add one above!"}
          </div>
        ) : (
          filteredTodos.map((todo, idx) => (
            <TodoItemRow
              key={todo.id}
              todo={todo}
              index={idx}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
          ))
        )}
      </div>
    </div>
  );
}
