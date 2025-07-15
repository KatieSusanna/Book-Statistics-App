'use client';

import Image from "next/image";
import { useState, useEffect } from "react"; //react hook that adds a state variable to a component 
//a react hook is getting a function from the react library 
//the state variable describes the state of the component at a point in time 
import PostItNote from "./components/PostItNotes";

export default function Home() {
  const [newBook, setNewBook] = useState(""); 
  const [books, setBooks] = useState([
    "Fourth Wing",
    "A Court of Thorns and Roses"
  ]);

  let orderedGrid: { row: number; column: number }[] = [];

  for (let row = 1; row < 5; row++ ) {
    for (let column = 1; column < 5; column++) {
      let grid = {row: row, column: column};
      orderedGrid.push({ row, column });
    }
  }

  const [isLoading, setIsLoading] = useState(true);
  
  const [shuffledGrid, setShuffledGrid] = useState<{ row: number; column: number }[]>([]);
  const [postItStyles, setPostItStyles] = useState<{ randomRotation: number, randomColour: string, position: { row: number, column: number } }[]>([]);
  const colours = ["bg-yellow-200", "bg-green-200", "bg-pink-200", "bg-blue-200"];

  useEffect(() => {
    
    setShuffledGrid([...orderedGrid].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    
    if (shuffledGrid.length > 0) {
      const initialPostItStyles = books.map((_, i) => ({
        randomRotation: Math.floor(Math.random() * 31) - 15,
        randomColour: colours[Math.floor(Math.random() * colours.length)],
        position: shuffledGrid[i]
      }));
      setPostItStyles(initialPostItStyles);
      setIsLoading(false)
      console.log(isLoading)
    }
  }, [shuffledGrid]);  //Dependancy
 
  function addBook () {
    const allBooks = [...books, newBook]
    setBooks(allBooks)
    setNewBook("")
    // console.log(allBooks)

    const randomRotation = Math.floor(Math.random() * 31) - 15;
    const randomColour = colours[Math.floor(Math.random() * colours.length)];
    // const position = shuffledGrid[allBooks.length - 1]


   const position = shuffledGrid.find(gridPos => 
  !postItStyles.some(style => 
    style.position.row === gridPos.row && 
    style.position.column === gridPos.column
    )
  );
  if (!position) {
  console.log("No free grid positions left!");
  return; 
  }
// find looks for an item in the list that meets the condition
// and returns the actual item (or undefined if none found)

// some checks if any item in the array meets the condition
// and returns true or false

// here it temporarily assigns each value in shuffledGrid to gridPos
// then the condition checks if there is NOT a Post-it in postItStyles
// with the same row and column as gridPos
//
// it needs to be negated (!) because:
// - .some() returns true if it finds a match (position taken)
// - we want a free position, so we flip it (!true → false, !false → true)
//
// .find() stops at the first gridPos where the condition is true (position free)
// and assigns it to position
//
// if .find() doesn’t find any free position, it assigns undefined to position
// that’s why we need the if-statement to check for this and log a message

    const allPostItStyles = [...postItStyles, { randomRotation, randomColour, position }]
    setPostItStyles(allPostItStyles)
    // console.log(allPostItStyles)
  }

  function removeBook (index: number) {
    let allBooks = books
    allBooks = allBooks.filter((_, i) => i !== index)
    setBooks(allBooks)
    console.log(allBooks)


    let allPostItStyles = postItStyles
    allPostItStyles = allPostItStyles.filter((_, i) => i !== index)
    setPostItStyles(allPostItStyles)
    console.log(allPostItStyles)

  }

    if (isLoading)  return <div>Loading...</div>;

  
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
  row={postItStyles[index].position.row} 
  column={postItStyles[index].position.column}
   onDelete={() => removeBook(index)} >
  {book}</PostItNote>
  })}

</div>
  </div>

);
  
}

