'use client';
import { caveat } from "@/app/ui/fonts";

type bookAttributes = {

  title: string;
  author: string;
  bookCoverUrl: string;
};


export default function BookCards ({title, author, bookCoverUrl}: bookAttributes) {
    
         return (
       <div className = {`w-[400px] p-4 bg-slate-100 rounded-md shadow-lg text-center text-lg font-semibold ${caveat.className} flex flex-col items-center mx-auto`}>
        <img className={`w-[150px] h-[220px] object-cover`} alt="book cover" src={`${bookCoverUrl}`} />
        <h1>{title}</h1>
        <h2>{author}</h2>
        

       </div>
    )


   
}