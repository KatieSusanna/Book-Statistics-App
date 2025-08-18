'use client';
import { useState } from "react";
import { caveat } from "@/app/ui/fonts";


export type bookAttributes = {
    id?: string; 
    title: string; 
    author: string;
    pages: string; 
    coverUrl: string;
    onClick?: () => void; }




export default function BookCards ({title, author, coverUrl, onClick}: bookAttributes) {
      const [isHovered, setIsHovered] = useState(false);
      
         return (
       <div 
       
       onClick={onClick}
       onMouseEnter={() => setIsHovered(true)}
       onMouseLeave={() => setIsHovered(false)} 
       style={
        {transition: "transform 1s ease",}
       }
       className = {`w-[400px] p-4 bg-slate-100 rounded-md text-center text-lg font-semibold ${caveat.className} flex flex-col items-center mx-auto ${isHovered ? "shadow-2xl" : "shadow-lg"}`}>
        <img className={`object-cover`} alt="book cover" src={`${coverUrl}`} />
        <h1>{title}</h1>
        <h2>{author}</h2>
        

       </div>
    )


   
}