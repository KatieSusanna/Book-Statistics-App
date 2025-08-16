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
    apiURL = `https://www.googleapis.com/books/v1/volumes?q=intitle:${queryTitle}&maxResults=40`;
    authorSearchURL = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${queryAuthor}&maxResults=40`;


     console.log(authorSearchURL)
  }
  else {
    const search = (encodeURIComponent(searchTitle.trim()));
   
    apiURL = `https://www.googleapis.com/books/v1/volumes?q=${search}&maxResults=40`
  }





  

  console.log("API URL:", apiURL);

  setIsLoading(true)
  try {
    
    const response = await fetch(apiURL);
    
    const searchResult = await response.json(); 
    let books = searchResult.items ?? []; 
    // getCoverUrl(books)            
    

    if (authorSearchURL != "") {
      const authorResponse = await fetch(authorSearchURL)
      const authorResult = await authorResponse.json();
      books.push(...(authorResult.items ?? []));

      console.log(books)

    }

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



let search = ""
let searchAuthor = ""
if (searchTitle.toLocaleLowerCase().includes(" by ")) {
  const [title, author] = searchTitle.split(" by ");
  search = (title.trim());
  searchAuthor = (author.trim());
} else {
  search = searchTitle.trim();
}

console.log(search)

uniqueBooks.forEach(book => {
 const title = book.volumeInfo?.title?.toLowerCase() || "";
  
  if (title === search) {
    book.priority = 3;
  } else if (title.startsWith(search)) {
    book.priority = 2;
  } else if (title.includes(search)) {
    book.priority = 1;
  } else {
    book.priority = 0;
  }
  
});

if (searchAuthor != "") {
  uniqueBooks.forEach(book => {
    const author = book.volumeInfo.authors?.join(", ").toLowerCase() || "";

    console.log(author)
    console.log(searchAuthor)
    

    if (author === searchAuthor) {
      book.priority += 3
    } else if (author.startsWith(searchAuthor)) {
      book.priority +=2
    }
    console.log(book.priority)


})
}

uniqueBooks.sort((a, b) => b.priority - a.priority);
uniqueBooks = uniqueBooks.filter(book => !!book.volumeInfo?.imageLinks?.thumbnail)
uniqueBooks = uniqueBooks.filter(book => !(book.volumeInfo?.title?.toLowerCase()).includes("set"))
uniqueBooks = uniqueBooks.filter(book => !(book.volumeInfo?.title?.toLowerCase()).includes("bundle"))
uniqueBooks = uniqueBooks.filter(book => !(book.volumeInfo?.title?.toLowerCase()).includes("summary"))
uniqueBooks = uniqueBooks.filter(book => book.volumeInfo?.categories?.some((cat: string) => cat.toLowerCase().includes("fiction")));
//some means that as long as fiction exists in categories it will pass
console.log(uniqueBooks)

//add same priority for author ✅
//eliminate repeated titles + author combinations 
//get rid of collections and box sets ✅
//get rid of ones that have no cover ✅
//eliminate certain categories - add a filter ✅
//if there are no results add in an error message 
//add in a user error message for api failure 
//add in a loading screen



  
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