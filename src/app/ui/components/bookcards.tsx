'use client';
import { caveat } from "@/app/ui/fonts";

type bookAttributes = {
  title: string;
  author: string;
  bookCoverUrl: string;
};


export default function BookCards ({title, author, bookCoverUrl}: bookAttributes) {
    
         return (
       <div className = {`w-[500px] h-[300px] p-4 bg-slate-100 rounded-md shadow-lg text-center font-semibold ${caveat.className}`}>
        <h1>{title}</h1>
        <h2>{author}</h2>
        <img src={`${bookCoverUrl}`} />

       </div>
    )


   
}