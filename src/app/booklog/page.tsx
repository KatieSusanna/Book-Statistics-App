'use client';
import { useState } from "react";
import { patrickHand } from "@/app/ui/fonts";
import { fredericka } from "@/app/ui/fonts";
import { Plus } from "lucide-react";
import BookCards from "@/app/ui/components/bookcards";


type Book = {
    id: string; 
    title: string; 
    author: string;
    pages: string; 
    coverId: string; 
    coverUrl: string 
}

export default function booktracker() {

    const [searchTitle, setSearchTitle] = useState("")
    const [bookSearchResults, setBookSearchResults] = useState<Book[]>([])

async function makeSearchQuery() {

    let queryTitle = "" 
    let queryAuthor = ""

  if (searchTitle.toLocaleLowerCase().includes(" by ")) {

     const [title, author] = searchTitle.split(" by ");
     queryTitle = encodeURIComponent(title.trim());
     queryAuthor = encodeURIComponent(author.trim()); 
  }
  else {
    queryTitle = encodeURIComponent(searchTitle.trim());
    queryAuthor = `""`
  }

  
  const apiURL = `https://openlibrary.org/search.json?title=${queryTitle}&author=${queryAuthor}&fields=key,title,author_name,cover_i,number_of_pages_median`;
  console.log("API URL:", apiURL);

  try {
    const response = await fetch(apiURL);
    const searchResult = await response.json(); 
    const books = cleanData(searchResult.docs);    
    getCoverUrl(books)            
    console.log(books)

    //at some point make these variables in state ✅
    //it would be a case of declaring the state variable then using the set function and seting it to books ✅

    setBookSearchResults(books)

    return books;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

function cleanData(books: any[]) {
    return books.map((book) => {
        const cleanedBook: Book = {
            id: String(book.key),
            title: String(book.title),
            author: String(book.author_name?.join(", ")) ?? "Unknown",
            pages: String(book.number_of_pages_median) ?? "Unknown",
            coverId: String(book.cover_i) ?? "Unknown",
            coverUrl: ""
        };
        return cleanedBook;
    });
}

function getCoverUrl(books: any[]) {
    return books.map((book) => {
        const coverID = book.coverId
        const coverQuery = `https://covers.openlibrary.org/b/id/${coverID}-M.jpg`
        book.coverUrl = coverQuery
    })
}

//for clear covers (without stupid stickers) i might be able to pull the edition and make it use the first edition cover
//might also need to pull the format as i have already seen an audiobook cover
//need to also make searches link to author name - i can start by telling the user to separate them by "by" ✅
//this is needed for books with same titles

    return (
        <div>
        <h1 className={`${fredericka.className}`}> this is a page for book search </h1>

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
        
        <div className={"container m-auto grid grid-cols-3 gap-5"}>
        {bookSearchResults.length > 0 && ( 
        bookSearchResults.map((book, index) => {
            return (<BookCards
                key={index}
                title={bookSearchResults[index].title}
                author={bookSearchResults[index].author}
                bookCoverUrl={bookSearchResults[index].coverUrl}>
        </BookCards> )}
        ))}
        </div>


        
        {/* {bookSearchResults.length > 0 && (
        <img src={bookSearchResults[0].coverUrl} alt="Book cover" />
)} */}



        <div>
            
        </div>


    </div>
        
    )
}