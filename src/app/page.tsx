'use client';

import Image from "next/image";
import { useState } from "react"; //react hook that adds a state variable to a component 
//a react hook is getting a function from the react library 
//the state variable describes the state of the component at a point in time 
import PostItNote from "./components/PostItNotes";



export default function Home() {
  const [books, setBooks] = useState([
    "Fourth Wing",
    "A Court of Thorns and Roses"
  ]);

  const [newBook, setNewBook] = useState(""); 

 var indexToRemove = 0

  

  //this is a books variable that has a starting state of the books that are in there and uses setBooks to update the list 

  function addBook () {
    
    const allBooks = [...books, newBook]

    
    setBooks(allBooks)
    setNewBook("")

  }

  function removeBook () {
    
    const updatedBooks = books.filter((_, index) => index !== indexToRemove -1  );

    setBooks(updatedBooks)
  }

  
  return (
  <div>
  <h1>This is my book app</h1>
  <h3> My Favourite books are: </h3>
 
<div>
<input id = "userBook" type ="text" value={newBook} onChange={(e) => setNewBook(e.target.value)} placeholder="type new book here" />
<button onClick={addBook}> 
  Add new book 
</button>
</div>

<button onClick={removeBook}>
  Remove latest book
</button>
<input type="number" onChange={(e) => indexToRemove = parseInt(e.target.value)} />
<div className = "grid grid-cols-4 grid-rows-4 relative">
 
  {books.map((book, index) => (
    <PostItNote key={index}>{book}</PostItNote>
  ))}

</div>
  </div>

);
  
}



