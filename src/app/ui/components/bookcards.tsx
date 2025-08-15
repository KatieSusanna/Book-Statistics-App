'use client';
import { useState } from "react";
import { caveat } from "@/app/ui/fonts";

type bookAttributes = {

  title: string;
  author: string;
  bookCoverUrl: string;
};


export default function BookCards ({title, author, bookCoverUrl}: bookAttributes) {
      const [isHovered, setIsHovered] = useState(false);
         return (
       <div 
       onMouseEnter={() => setIsHovered(true)}
       onMouseLeave={() => setIsHovered(false)} 
       style={
        {transition: "transform 1s ease",}
       }
       className = {`w-[400px] p-4 bg-slate-100 rounded-md text-center text-lg font-semibold ${caveat.className} flex flex-col items-center mx-auto ${isHovered ? "shadow-2xl" : "shadow-lg"}`}>
        <img className={`object-cover`} alt="book cover" src={`${bookCoverUrl}`} />
        <h1>{title}</h1>
        <h2>{author}</h2>
        

       </div>
    )


   
}