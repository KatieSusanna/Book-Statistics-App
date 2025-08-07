'use client';
import { caveat } from "@/app/ui/fonts";

type bookAttributes = {

  title: string;
  author: string;
  bookCoverUrl: string;
};


export default function BookCards ({title, author, bookCoverUrl}: bookAttributes) {
    
         return (
       <div className = {`w-[400px] h-[200px] p-4 bg-slate-100 rounded-md shadow-lg text-center font-semibold ${caveat.className}`}>
        <img alt="book cover" width="64" height="104.2" src={`${bookCoverUrl}`} />
        <h1>{title}</h1>
        <h2>{author}</h2>
        

       </div>
    )


   
}