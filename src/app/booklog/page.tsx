'use client';
import { useState, useEffect } from "react";
import { patrickHand } from "@/app/ui/fonts";
import { fredericka } from "@/app/ui/fonts";
import { Search } from "lucide-react";
import BookCards from "@/app/ui/components/bookcards";


type Book = {
    id: string; 
    title: string; 
    author: string;
    pages: string; 
    coverId: string; 
    coverUrl: string 
}

export default function BookTracker() {

    const [searchTitle, setSearchTitle] = useState("")
    const [bookSearchResults, setBookSearchResults] = useState<Book[]>([])
     useEffect(() => {
  if (!searchTitle.trim()) return; 

  const timeoutId = setTimeout(() => {
    makeSearchQuery(searchTitle);
  }, 500);

  return () => clearTimeout(timeoutId); // cleanup old timer
}, [searchTitle]);

async function makeSearchQuery(title: string) {
 
    let queryTitle = "" 
    let queryAuthor = ""

  if (title.toLocaleLowerCase().includes(" by ")) {

     const [t, author] = title.split(" by ");
     queryTitle = encodeURIComponent(t.trim());
     queryAuthor = encodeURIComponent(author.trim()); 
  }
  else {
    queryTitle = encodeURIComponent(searchTitle.trim());
    queryAuthor = `""`
  }


  //step 1 - create an if block to use each of the different apiURL types depending if there is a by in the author 
  //step 2 - order by most recent editions 
  //step 3 - get rid of collections and box sets 

  //how can i filter out crappy results?
  

  
//   const apiURL = `https://openlibrary.org/search.json?title=${queryTitle}&author=${queryAuthor}&fields=key,title,author_name,cover_i,number_of_pages_median`;
// const apiURL = `https://openlibrary.org/search.json?q=${searchTitle}&fields=key,title,author_name,cover_i,number_of_pages_median`;
const apiURL = `https://www.googleapis.com/books/v1/volumes?q=${searchTitle}`
  console.log("API URL:", apiURL);

//   https://www.googleapis.com/books/v1/volumes? 

  try {
    const response = await fetch(apiURL);
    const searchResult = await response.json(); 
    const books = cleanData(searchResult.items ?? []); 
    // getCoverUrl(books)            
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

function cleanData(books: any[]): Book[] {
  return books.map((book) => {
    const info = book.volumeInfo || {};
    return {
      id: String(book.id),
      title: info.title || "Untitled",
      author: info.authors?.join(", ") || "Unknown",
      pages: info.pageCount?.toString() || "Unknown",
      coverId: "", // Google Books doesn't use numeric cover IDs
      coverUrl: info.imageLinks?.thumbnail || "",
    };
  });
} 

// function getCoverUrl(books: any[]) {
//     return books.map((book) => {
//         const coverID = book.coverId
//         const coverQuery = `https://covers.openlibrary.org/b/id/${coverID}-M.jpg`
//         book.coverUrl = coverQuery
//     })
// }

//for clear covers (without stupid stickers) i might be able to pull the edition and make it use the first edition cover
//might also need to pull the format as i have already seen an audiobook cover
//need to also make searches link to author name - i can start by telling the user to separate them by "by" ✅
//this is needed for books with same titles

    return (
        <div className= "space-y-5">
        <h1 className={`${fredericka.className}`}> this is a page for book search </h1>
        <div className={`flex items-center space-x-2 space-y-2`}>
        <input 
            id = "userBook" 
            type ="text" 
            value={searchTitle} 
            onChange={(e) => {
                setSearchTitle(e.target.value);
                // makeSearchQuery(e.target.value);
                }}
 
            placeholder="Book Title"
            className={`${patrickHand.className} block w-[400px] p-4 text-gray-900 border border-gray-300 rounded-xl bg-gray-50 text-base focus:ring-blue-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                />
        <button   
            className ={`bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-2 rounded-full aspect-square`}>
            {/* onClick={makeSearchQuery} */}
            <Search className="w-5 h-5" /> 
        </button>
        </div>
        
        <div className={"container m-auto grid grid-cols-3 gap-5"}>
        {bookSearchResults.length > 0 && ( 
        bookSearchResults.map((book) => {
            return (<BookCards
                key={book.id}
                title={book.title}
                author={book.author}
                bookCoverUrl={book.coverUrl}>
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