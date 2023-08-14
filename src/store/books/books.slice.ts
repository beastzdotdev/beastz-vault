import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { v4 as uuid } from 'uuid';
import { Book } from '../store.type';

// Define a type for the slice state
interface BookState {
  books: Book[];
}

// Define the initial state using that type
const initialState: BookState = {
  books: [],
};

export const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<Book>) => {
      state.books.push(action.payload);
      localStorage.setItem('books', JSON.stringify(state.books));
    },
    set: (state, action: PayloadAction<Book[]>) => {
      state.books = action.payload;
    },
    delete: (state, action: PayloadAction<number>) => {
      state.books.splice(action.payload, 1);
      localStorage.setItem('books', JSON.stringify(state.books));
    },
  },
});

export const bookBuilder = (params: Omit<Book, 'id'>): Book => {
  return {
    id: uuid(),
    name: params.name,
    price: params.price,
  };
};

export const bookActions = bookSlice.actions;
export const booksSelect = (state: RootState) => state.books.books;
export const booksReducer = bookSlice.reducer;
