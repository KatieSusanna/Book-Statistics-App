'use client';
import { useState, useEffect } from "react";
import { patrickHand } from "@/app/ui/fonts";
import { fredericka } from "@/app/ui/fonts";
import { Book, Search } from "lucide-react";
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

    const [isLoading, setIsLoading] = useState(false)

    const [searchTitle, setSearchTitle] = useState("")
    const [bookSearchResults, setBookSearchResults] = useState<Book[]>([])
     useEffect(() => {
  if (!searchTitle.trim()) return; 

  const timeoutId = setTimeout(() => {
    makeSearchQuery(searchTitle);
  }, 500);

  return () => clearTimeout(timeoutId); 
}, [searchTitle]);

async function makeSearchQuery(title: string) {
 
    let queryTitle = "" 
    let queryAuthor = ""
    let apiURL = ""
    let authorSearchURL = ""
    

  if (title.toLocaleLowerCase().includes(" by ")) {

     const [title, author] = searchTitle.split(" by ");
     queryTitle = encodeURIComponent(title.trim());
     queryAuthor = encodeURIComponent(author.trim()); 
     apiURL = `https://www.googleapis.com/books/v1/volumes?q=intitle:${queryTitle}&maxResults=40`
     authorSearchURL = `https://www.googleapis.com/books/v1/volumes?q=intitle:${queryAuthor}&maxResults=40`
  }
  else {
    setSearchTitle(encodeURIComponent(searchTitle.trim()));
   
    apiURL = `https://www.googleapis.com/books/v1/volumes?q=${searchTitle}&maxResults=40`
  }


  //step 1 - create an if block to use each of the different apiURL types depending if there is a by in the author 
  //step 2 - order by most recent editions 
  //step 3 - get rid of collections and box sets 

  //how can i filter out crappy results?
  ``

  console.log("API URL:", apiURL);

  setIsLoading(true)
  try {
    
    const response = await fetch(apiURL);
    
    const searchResult = await response.json(); 
    let books = searchResult.items ?? []; 
    // getCoverUrl(books)            
    console.log(books)

    if (authorSearchURL != "") {
      const authorResponse = await fetch(authorSearchURL)
      const authorResult = await authorResponse.json();
      books.push(authorResult.items ?? []);

    }
//step 2: then call clean data
//step 3: then edit clean data to sort most relevant on top and get rid of repeats 

    books = cleanData(books)

    setBookSearchResults(books)
  

    return books;
  } catch (error) {
    console.error("Error fetching data:", error);
    
    return [];
  } finally {
    setIsLoading(false)
  }
  
}

function cleanData(books: any[]): Book[] {
 let uniqueBooks: any[] = []

books.forEach((book) => { //iterates through the books list 
  if (!uniqueBooks.some(b => b.id === book.id)) { //checks if there is any book in unique books that has the same id
    uniqueBooks.push(book); //adds if it doesnt already exist 
  }
});


  
  return uniqueBooks.map((book) => {
    const info = book.volumeInfo || {};
    return {
      id: String(book.id),
      title: info.title || "Untitled",
      author: info.authors?.join(", ") || "Unknown",
      pages: info.pageCount?.toString() || "Unknown",
      coverId: "",
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


// if (isLoading)  return <div>Loading...</div>;

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