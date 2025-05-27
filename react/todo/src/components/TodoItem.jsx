import React from "react";
import { CheckCircle, Circle, Trash2 } from "lucide-react";

function TodoItem({ todo, toggleTodo, deleteTodo }) {
    return (
        <li className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
            <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => toggleTodo(todo.id)}
            >
                {todo.completed ? (
                    <CheckCircle className="text-green-500" />
                ) : (
                    <Circle className="text-gray-400" />
                )}
                <span
                    className={`text-lg ${todo.completed ? "line-through text-gray-400" : "text-gray-800"
                        }`}
                >
                    {todo.text}
                </span>
            </div>
            <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </li>
    );
}

export default TodoItem;
