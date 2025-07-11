'use client';
import { useState, useEffect } from "react";

export default function PostItNote({ children }) {
  
  const colours = ["bg-yellow-200", "bg-green-200", "bg-pink-200", "bg-blue-200"];
  const [randomRotation, setRandomRotation] = useState(0);
  const [index, setIndex] = useState(0);
  const [row, setRow] = useState(1);
  const [column, setColumn] = useState(1);

  useEffect(() => {
    setRandomRotation(Math.floor(Math.random() * 31) - 15);
    setIndex(Math.floor(Math.random() * colours.length));
    setRow(Math.floor(Math.random() * 4) + 1);
    setColumn(Math.floor(Math.random() * 4) + 1);
  }, []);

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