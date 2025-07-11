'use client';
import { useState } from "react";

export default function PostItNote({ children }) {
    const [randomRotation] = useState(() => Math.floor(Math.random() * 31) - 15)
    const colours = ["bg-yellow-200", "bg-green-200", "bg-pink-200", "bg-blue-200"];
    const [index] = useState(() => Math.floor(Math.random() * colours.length))

  return (
    <div 
    style={{ transform: `rotate(${randomRotation}deg)` }} 
    className={`w-40 h-40 p-4 ${colours[index]} rounded-md shadow-lg text-center font-semibold`}>
      {children}
    </div>
  );
}