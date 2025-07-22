import { Inter } from 'next/font/google';
import { Patrick_Hand } from "next/font/google";
import { Caveat } from 'next/font/google'
import { Fredericka_the_Great } from 'next/font/google';

 
export const inter = Inter({ subsets: ['latin'] });

export const patrickHand = Patrick_Hand({
  subsets: ['latin'],
  weight: '400',
});


export const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400'],
})

export const frederickaTheGreat = Fredericka_the_Great({
  subsets: ['latin'],
  weight: ['400']
})