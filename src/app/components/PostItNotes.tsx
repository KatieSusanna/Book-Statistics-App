'use client';
import {useState} from "react"


type PostItNoteProps = {
  children: React.ReactNode;
  randomRotation: number;
  colour: string;
  row: number;
  column: number;
  onDelete: () => void
};

export default function PostItNote({
  children,
  randomRotation,
  colour,
  row,
  column,
  onDelete
}: PostItNoteProps) {
  const [isHovered, setIsHovered] = useState(false);
  const scale = isHovered ? 1.05 : 1; //if isHovered = true then scale = 1.05 if not scale = 1
  //this is needed because if this is done in the tailwind styling it gets overwritten by the CSS Styline
  return (
    <div 
    onClick={onDelete}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)} 
    style={{
    gridColumnStart: column,
    gridRowStart: row,
    transform: `rotate(${randomRotation}deg) scale(${scale})`,
    transition: "transform 0.2s ease",
    }}
    
    className={`w-40 h-40 p-4 ${colour} rounded-md shadow-lg text-center font-semibold`}

>
      {children}
    </div>
  );
}