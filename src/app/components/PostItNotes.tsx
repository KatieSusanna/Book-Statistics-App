'use client';


type PostItNoteProps = {
  children: React.ReactNode;
  randomRotation: number;
  colour: string;
  row: number;
  column: number;
  onDelete: () => void
};

export default function PostItNote({
  children,
  randomRotation,
  colour,
  row,
  column,
  onDelete
}: PostItNoteProps) {
  return (
    <div 
    onClick={onDelete}
    style={{
    transform: `rotate(${randomRotation}deg)`,
    gridColumnStart: column,
    gridRowStart: row
    
    }}

    className={`w-40 h-40 p-4 ${colour} rounded-md shadow-lg text-center font-semibold`}>
      {children}
    </div>
  );
}