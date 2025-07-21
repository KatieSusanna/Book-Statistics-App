'use client';

import Image from "next/image";
import { useState, useEffect } from "react"; 
// useState: react hook to create a state variable and setter function
// useEffect: react hook to run side effects (like shuffling) after render
import PostItNote from "./components/PostItNotes";

export default function Home() {
  const [newBook, setNewBook] = useState(""); 
  const [books, setBooks] = useState([
   {id: crypto.randomUUID(), title: "Fourth Wing"},
    {id: crypto.randomUUID(), title: "A Court of Thorns and Roses"} 
  ]);
  //These IDs are needed because of a DOM node issue that occured when adding state to the postit notes
  //When a post it note was deleted its DOM node wasn't deleted with it this didn't cause an issue until state was added
  //A DOM node stores the state information about a component so when post it note was purely functional it was empty
  //when state was added it stored information 
  //because the DOM node wasn't deleted and identification was done on index 
  //if you had post it 1, 2 and 3 and deleted 2, 3 would then use 2's DOM node
  //this meant that when all the post it notes were re-rendered when a post it was deleted 
  //post it 3 would show post it 2's rotation for a second whilst the transformation takes place
  //because react sees all the information there so can render and rendering is faster than the transformation
  //with the id's it is able to see that that DOM node is not for that book and it will be deleted.

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
  //this only runs once after the first render as there are no dependancies 

  useEffect(() => {
    
    if (shuffledGrid.length > 0) {
     setStyles()
    }
  }, [shuffledGrid]);  //Dependancy - this will refire every time shuffledgrid is updated
 
  function addBook () {
    const allBooks = [
  ...books,
  { id: crypto.randomUUID(), title: newBook }
];
    setBooks(allBooks)
    setNewBook("")

    const randomRotation = Math.floor(Math.random() * 31) - 15;
    const randomColour = colours[Math.floor(Math.random() * colours.length)];


   const position = shuffledGrid.find(gridPos => 
  !postItStyles.some(style => 
    style.position.row === gridPos.row && 
    style.position.column === gridPos.column
    )
  );
  if (!position) {
  console.log("No free grid positions left!");
  return; 

  //ensures that no books are added if there is no space 
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
  }

  function removeBook (index: number) {
    let allBooks = books
    allBooks = allBooks.filter((_, i) => i !== index)
    setBooks(allBooks)
    


    let allPostItStyles = postItStyles
    allPostItStyles = allPostItStyles.filter((_, i) => i !== index)
    setPostItStyles(allPostItStyles)
    

  }

  function removeAllBooks () {
    setBooks([])
    setPostItStyles([])
  }

  function reShuffleGrid () {

    const newGrid = ([...shuffledGrid].sort(() => Math.random() - 0.5));
    setShuffledGrid(newGrid)
    return(newGrid)
  }

  function setStyles (grid = shuffledGrid) { 
     const initialPostItStyles = books.map((_, i) => ({
        randomRotation: Math.floor(Math.random() * 31) - 15,
        randomColour: colours[Math.floor(Math.random() * colours.length)],
        position: grid[i]
      }));
      setPostItStyles(initialPostItStyles);
      setIsLoading(false) 
  }

  //this uses explicit passing to ensure that the most up to date version of shuffledgrid is used
  //the first time this is called shuffledgrid may not have updated so it will be using the old version 
  //grid = shuffledgrid means that if nothing is passed to the function shuffledgrid will be used

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
<br></br>
<button onClick={() => { 
  const newGrid = reShuffleGrid();
  setStyles(newGrid);}}>
  Shuffle Post it notes</button>
</div>
<div>
  <button onClick={removeAllBooks}> 
    Clear all
  </button>
</div>

<div className = "grid grid-cols-4 grid-rows-4 relative">

  {books.map((book, index) => {
  
  return <PostItNote 
  key={book.id} 
  randomRotation={postItStyles[index].randomRotation} 
  colour={postItStyles[index].randomColour} 
  row={postItStyles[index].position.row} 
  column={postItStyles[index].position.column}
   onDelete={() => removeBook(index)} >
  {book.title}</PostItNote>
  })}

</div>
  </div>

);
  
}





