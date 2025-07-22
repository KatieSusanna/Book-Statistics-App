'use client';
import {useState} from "react"
import { caveat } from "@/app/ui/fonts";



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
    //here you cannot use classes that do not belong to css - they need to be in property:value pairs 
    }}
    
    className={`w-40 h-40 p-4 ${colour} rounded-md shadow-lg text-center font-semibold ${caveat.className} ${isHovered ? "shadow-2xl" : "shadow-lg"}`}
//classname looks up all the classes needed to create the style
//shadow-lg is a class name not an actual value so it cannot go in styles
//patrichand is a class created by nextJs
>
      {children}
    </div>
  );
}