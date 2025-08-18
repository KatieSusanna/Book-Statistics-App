'use client';
import { useState, useEffect } from "react";
import { patrickHand } from "@/app/ui/fonts";
import { fredericka } from "@/app/ui/fonts";
import {Search } from "lucide-react";
import BookCards from "@/app/ui/components/bookcards";
import { bookAttributes } from "@/app/ui/components/bookcards";
import BookDialog from "@/app/ui/components/bookInfoPage"

export default function BookTracker() {

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<bookAttributes | null>(null);

  

  const closeDialog = () => {
    setSelectedBook(null);
    setIsDialogOpen(false);
  };

    const [isLoading, setIsLoading] = useState(false)

    const [searchTitle, setSearchTitle] = useState("")
    const [activeSearch, setActiveSearch] = useState(false)
    
    const [bookSearchResults, setBookSearchResults] = useState<bookAttributes[]>([])
     useEffect(() => {
      if (searchTitle === "") {
      setBookSearchResults([])
    }
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
    alert("Oops... Our bad! Looks like the api failed, please try again!")
    
    return [];
  } finally {
    setIsLoading(false)
    
  }
  
}

function noResultsMessage(value: string) {
  if (value === "") {
    setActiveSearch(false)
  } else {
    setActiveSearch(true)
  }

}

function cleanData(books: any[]): bookAttributes[] {
 let uniqueBooks: any[] = []

books.forEach((book) => { 
  if (!uniqueBooks.some(b => b.id === book.id)) { 
    uniqueBooks.push(book);  
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

let seenKeys: string[] = [];
let filteredBooks: typeof uniqueBooks = [];

uniqueBooks.forEach(book => {
  const title = book.volumeInfo?.title?.toLowerCase() || "";
  const author = book.volumeInfo?.authors?.join(", ").toLowerCase() || "";
  const key = `${title}::${author}`;

  if (!seenKeys.includes(key)) {
    seenKeys.push(key);        
    filteredBooks.push(book);  
  }
});
uniqueBooks = filteredBooks

uniqueBooks.sort((a, b) => b.priority - a.priority);
uniqueBooks = uniqueBooks.filter(book => !!book.volumeInfo?.imageLinks?.thumbnail)
uniqueBooks = uniqueBooks.filter(book => !(book.volumeInfo?.title?.toLowerCase()).includes("set"))
uniqueBooks = uniqueBooks.filter(book => !(book.volumeInfo?.title?.toLowerCase()).includes("bundle"))
uniqueBooks = uniqueBooks.filter(book => !(book.volumeInfo?.title?.toLowerCase()).includes("summary"))
uniqueBooks = uniqueBooks.filter(book => book.volumeInfo?.categories?.some((cat: string) => cat.toLowerCase().includes("fiction")));
//some means that as long as fiction exists in categories it will pass
console.log(uniqueBooks)

//add same priority for author ✅
//eliminate repeated titles + author combinations ✅
//get rid of collections and box sets ✅
//get rid of ones that have no cover ✅
//eliminate certain categories - add a filter ✅
//if there are no results add in an error message ✅
//add in a user error message for api failure ✅
//add in a loading screen ✅
//add a message at the bottom of the screen for end of results ✅
//when input bar empty - clear search results ✅
//make it so no results error is only displayed when there is an active search ✅



  
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
                
                noResultsMessage(e.target.value);
                setSearchTitle(e.target.value);
                // makeSearchQuery(e.target.value);
                }}
 
            placeholder="Book Title"
            className={`${patrickHand.className} block w-[400px] p-4 text-gray-900 border border-gray-300 rounded-xl bg-gray-50 text-base focus:ring-blue-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                />
        <button   
            className ={`bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-2 rounded-full aspect-square`}>
            
            <Search className="w-5 h-5" /> 
        </button>
        </div>
        <div className={`flex items-center justify-center`}> {isLoading && <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-current"> </div>} </div>
        <div className={"container m-auto grid grid-cols-3 gap-5"}>
        {bookSearchResults.length > 0 && ( 
        bookSearchResults.map((book) => {
            return (<BookCards
                key={book.id}
                title={book.title}
                author={book.author}
                pages={book.pages}
                coverUrl={book.coverUrl}
                onClick={() => {
                  setSelectedBook(book);
                  setIsDialogOpen(true);
      }}
               >
        </BookCards> )}
        ))} 
        
          
         
        </div>
        {selectedBook && (
        <BookDialog
          isOpen={isDialogOpen}
          book={selectedBook}
          onClose={closeDialog}
        />
      )}
          

      
        <div className={`flex items-center justify-center`}> {bookSearchResults.length === 0 && activeSearch && <h1 className={`${fredericka.className}`}> hmmm... it doesn't seem like we have a match. Try adding an author or changing your search 🔍 </h1>}</div>
        
      <div className={`flex items-center justify-center`}> {bookSearchResults.length > 0 && <h1 className={`${fredericka.className} `}>Looks like we’re out of books here… can't find what you need? Try adding an author or changing your search 🔍 </h1>}</div>
        <div>
      {/* this is conditional rendering */}
            
        </div>

    </div>
        
    )
}