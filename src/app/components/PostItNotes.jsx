'use client';
import { useState } from "react";

export default function PostItNote({ children }) {
    const [randomRotation] = useState(() => Math.floor(Math.random() * 31) - 15)
    const colours = ["bg-yellow-200", "bg-green-200", "bg-pink-200", "bg-blue-200"];
    const [index] = useState(() => Math.floor(Math.random() * colours.length))
    const [row] = useState(() => Math.floor(Math.random() * 4) + 1)
    const [column] = useState(() => Math.floor(Math.random() * 4) + 1)

    console.log(row, column)

  return (
    <div 
    style={{
    transform: `rotate(${randomRotation}deg)`,
    gridColumnStart: column,
    gridRowStart: row
    }}

    className={`w-40 h-40 p-4 ${colours[index]} rounded-md shadow-lg text-center font-semibold`}>
      {children}
    </div>
  );
}