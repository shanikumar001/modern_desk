import { Bell, Check, Plus, X, ListTodo, Calendar, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { WidgetSize } from "../context/WidgetContext";

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
  isExpanded?: boolean;
}

function TodoItemRow({
  todo,
  index,
  onToggle,
  onDelete,
  onUpdate,
  isExpanded
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

  return (
    <div
      className={`todo-item group flex items-center gap-3 ${isExpanded ? 'px-6 py-4' : 'px-3 py-2.5'} rounded-2xl transition-all duration-300 border ${todo.completed ? "bg-white/5 border-transparent opacity-50" : "bg-white/[0.03] border-white/5 hover:border-accent-raw/30 hover:bg-white/[0.06]"}`}
    >
      <button
        type="button"
        onClick={() => onToggle(todo.id)}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${todo.completed ? 'bg-accent-raw border-accent-raw' : 'border-white/20 hover:border-accent-raw'}`}
      >
        {todo.completed && <Check size={12} strokeWidth={4} className="text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={inputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setEditText(todo.text);
                setEditing(false);
              }
            }}
            className="w-full bg-transparent border-none text-white focus:ring-0 p-0 text-sm font-medium"
          />
        ) : (
          <span
            className={`block truncate cursor-pointer select-none text-sm font-medium ${todo.completed ? 'line-through text-white/30' : 'text-white'}`}
            onDoubleClick={() => !todo.completed && setEditing(true)}
          >
            {todo.text}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setEditing(true)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white">
          <Bell size={14} />
        </button>
        <button onClick={() => onDelete(todo.id)} className="p-1.5 hover:bg-rose-500/10 rounded-lg text-white/40 hover:text-rose-400">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export function TodoWidget({ size = 'small', isExpanded = false }: { size?: WidgetSize, isExpanded?: boolean }) {
  const [todos, setTodos] = useLocalStorage<TodoItem[]>("dashboard_todos", [
    { id: "1", text: "Design Advanced Widget System", completed: true, createdAt: Date.now() - 3600000 },
    { id: "2", text: "Implement Resizable Containers", completed: true, createdAt: Date.now() - 1800000 },
    { id: "3", text: "Add Glassmorphism Aesthetics", completed: false, createdAt: Date.now() - 900000 },
  ]);
  const [inputText, setInputText] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");

  const remaining = todos.filter((t) => !t.completed).length;

  const addTodo = () => {
    const text = inputText.trim();
    if (!text) return;
    const newTodo: TodoItem = {
      id: `todo_${Date.now()}`,
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
    setInputText("");
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "done") return t.completed;
    return true;
  });

  // ── Render: Compact View (Small) ──
  if (size === 'small' && !isExpanded) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-2 animate-in fade-in zoom-in-95 duration-500 overflow-hidden relative">
        {/* Animated Glow Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-raw/10 to-transparent opacity-50" />
        
        <div className="relative">
          {/* Task Icon with Glow */}
          <div className="absolute inset-0 bg-accent-raw/20 blur-xl opacity-30 animate-pulse" />
          {/* <ListTodo size={48} className="text-accent-raw relative z-10" /> */}
          
          {/* Badge for remaining tasks */}
          {/* {remaining > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-raw text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-[0_0_10px_var(--accent-glow)] z-20">
              {remaining > 9 ? '9+' : remaining}
            </div>
          )} */}
        </div>
        
        {/* Progress Ring */}
       <div className="mt-3 relative flex items-center justify-center">
  <svg width="80" height="80" className="-rotate-90">
    
    {/* Gradient Definition */}
    <defs>
      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--accent-raw)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.9)" />
      </linearGradient>
    </defs>

    {/* Background Circle */}
    <circle
      cx="40"
      cy="40"
      r="30"
      fill="none"
      stroke="rgba(255,255,255,0.08)"
      strokeWidth="6"
    />

    {/* Animated Glow Ring */}
    <circle
      cx="40"
      cy="40"
      r="30"
      fill="none"
      stroke="url(#progressGradient)"
      strokeWidth="6"
      strokeLinecap="round"
      strokeDasharray={`${
        (1 - remaining / Math.max(todos.length, 1)) * 188
      } 188`}
      className="transition-all duration-700 ease-out"
      style={{
        filter: "drop-shadow(0 0 10px var(--accent-glow))",
      }}
    />

  </svg>

  {/* Center Content */}
  <div className="absolute flex flex-col items-center justify-center">
    <span className="text-sm font-bold text-white">
      {Math.round((1 - remaining / Math.max(todos.length, 1)) * 100)}%
    </span>
    <span className="text-[10px] text-white/50">Done</span>
  </div>
</div>
        
        {/* Status Text */}
        <div className="mt-1 text-[8px] uppercase tracking-widest text-white/40 font-bold">
          {remaining === 0 ? 'All Done!' : `${remaining} Left`}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full animate-fade-in ${isExpanded ? 'p-12 items-center justify-center max-w-5xl mx-auto w-full' : 'p-5'}`}>
      <div className={`w-full flex items-center justify-between mb-6 ${isExpanded ? 'max-w-2xl' : ''}`}>
        <div className="flex flex-col">
          <h2 className={`${isExpanded ? 'text-4xl' : 'text-lg'} font-bold text-white tracking-tight`}>Daily Tasks</h2>
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-black mt-1">
            {remaining > 0 ? `${remaining} active items` : 'All caught up!'}
          </p>
        </div>
        {isExpanded && (
          <div className="flex bg-white/5 p-1 rounded-xl gap-1 border border-white/5">
            {(["all", "active", "done"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-accent-raw text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={`w-full flex flex-col flex-1 min-h-0 ${isExpanded ? 'max-w-2xl' : ''}`}>
        {/* Input */}
        <div className="relative group mb-6">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="Add something new..."
            className="w-full glass-input pl-12 pr-4 py-4 text-sm bg-white/5 border-white/10 group-focus-within:border-accent-raw transition-all"
          />
          <Plus size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent-raw transition-colors" />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {filteredTodos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 opacity-20 italic text-sm">
              <Calendar size={32} className="mb-2" />
              <p>No tasks found in this view.</p>
            </div>
          ) : (
            filteredTodos.map((todo, idx) => (
              <TodoItemRow
                key={todo.id}
                todo={todo}
                index={idx}
                onToggle={(id) => setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))}
                onDelete={(id) => setTodos(prev => prev.filter(t => t.id !== id))}
                onUpdate={(id, text) => setTodos(prev => prev.map(t => t.id === id ? { ...t, text } : t))}
                isExpanded={isExpanded}
              />
            ))
          )}
        </div>

        {isExpanded && (
          <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between text-white/30 text-[10px] uppercase font-bold tracking-[0.2em]">
            <span>Syncing with Cloud Storage</span>
            <button
              onClick={() => setTodos(prev => prev.filter(t => !t.completed))}
              className="text-rose-400/60 hover:text-rose-400 transition-colors"
            >
              Clear all completed
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
