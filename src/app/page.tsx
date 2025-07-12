'use client';

import Image from "next/image";
import { useState } from "react"; //react hook that adds a state variable to a component 
//a react hook is getting a function from the react library 
//the state variable describes the state of the component at a point in time 
import PostItNote from "./components/PostItNotes";



export default function Home() {
  const [newBook, setNewBook] = useState(""); 
  const [books, setBooks] = useState([
    "Fourth Wing",
    "A Court of Thorns and Roses"
  ]);

  const [postItStyles, setPostItStyles] = useState<{randomRotation:number, randomColour: string, row:number, column:number}[]>([
  { randomRotation: -10, randomColour: "bg-yellow-200", row: 1, column: 2 },
  { randomRotation: 8, randomColour: "bg-pink-200", row: 3, column: 4 }
]);
  const colours = ["bg-yellow-200", "bg-green-200", "bg-pink-200", "bg-blue-200"];
 
  

 
  function addBook () {
    const allBooks = [...books, newBook]
    setBooks(allBooks)
    setNewBook("")

    const randomRotation = Math.floor(Math.random() * 31) - 15;
    const randomColour = colours[Math.floor(Math.random() * colours.length)];
    const row = Math.floor(Math.random() * 4) + 1;
    const column = Math.floor(Math.random() * 4) + 1;

    const allPostItStyles = [...postItStyles, { randomRotation, randomColour, row, column }]
    setPostItStyles(allPostItStyles)
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

<div className = "grid grid-cols-4 grid-rows-4 relative">
 
  {books.map((book, index) => {
  
  return <PostItNote 
  key={index} 
  randomRotation={postItStyles[index].randomRotation} 
  colour={postItStyles[index].randomColour} 
  row={postItStyles[index].row} 
  column={postItStyles[index].column}>
  {book}</PostItNote>
  })}

</div>
  </div>

);
  
}