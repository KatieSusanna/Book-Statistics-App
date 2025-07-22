'use client';
import { useState } from "react";
import { patrickHand } from "@/app/ui/fonts";
import { fredericka } from "@/app/ui/fonts";
import { Plus } from "lucide-react";

export default function booktracker() {

    const [searchTitle, setSearchTitle] = useState("")

async function makeSearchQuery() {
  const query = encodeURIComponent(searchTitle.trim());
  const apiURL = `https://openlibrary.org/search.json?q=${query}&fields=key,title,author_name,cover_i,number_of_pages_median`;
  console.log("API URL:", apiURL);

  try {
    const response = await fetch(apiURL);
    const searchResult = await response.json(); 
    const books = cleanData(searchResult.docs);    
    getCoverURLs(books)

    console.log(books)



    return books;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

function cleanData(books: any[]) {
    return books.map((book) => {
        const cleanedBook = {
            id: book.key,
            title: book.title,
            author: book.author_name?.join(", ") ?? "Unknown",
            pages: book.number_of_pages_median ?? "Unknown",
            coverId: book.cover_i ?? null,
            coverUrl: null 
        };
        return cleanedBook;
    });
}

function getCoverURLs(books: any[]) {
    return books.map((book) => {
        const coverID = books[0].coverId
        const coverQuery = `https://covers.openlibrary.org/b/ID/${coverID}-L.jpg`
        book.coverURL = coverQuery

        
    })
}

        

    

    return (
        <div>
        <h1 className={`${fredericka.className}`}> this is a page for book tracking </h1>

        {/* //logic for api 

        //get the booktitle as an input from the user ✅
        //attatch the booktitle to api call - https://openlibrary.org/search.json?q=<book title> ✅
        //organise information retrieved by api in a book object
        // build the cover api url  */}

        <input 
            id = "userBook" 
            type ="text" 
            value={searchTitle} 
            onChange={(e) => setSearchTitle(e.target.value)} 
            placeholder="Book Title"
            className={`${patrickHand.className} block w-[400px] p-4 text-gray-900 border border-gray-300 rounded-xl bg-gray-50 text-base focus:ring-blue-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                />
        <button   
            className ={`bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-2 rounded-full aspect-square`}
            onClick={makeSearchQuery}> 
            <Plus className="w-5 h-5" /> 
        </button>
    </div>
        
    )
}