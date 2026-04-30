/**
 * Database Seeder
 * ===============
 * Inserts sample books into MongoDB on first run.
 * Skips seeding if the collection already has documents,
 * so restarts never create duplicates.
 */

import Book from "../models/book.model.js";

const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-0-7432-7356-5",
    publishedYear: 1925,
    genre: "Fiction",
    pages: 180,
    price: 299,
    inStock: true,
    description: "A story of wealth, obsession, and the American Dream in the Jazz Age.",
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    isbn: "978-0-553-38016-3",
    publishedYear: 1988,
    genre: "Science",
    pages: 212,
    price: 499,
    inStock: true,
    description: "Hawking explores cosmology, black holes, and the nature of time for general readers.",
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    isbn: "978-0-06-231609-7",
    publishedYear: 2011,
    genre: "History",
    pages: 443,
    price: 599,
    inStock: true,
    description: "A sweeping narrative of humanity's creation and evolution over 70,000 years.",
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    isbn: "978-0-618-00221-3",
    publishedYear: 1937,
    genre: "Fantasy",
    pages: 310,
    price: 399,
    inStock: true,
    description: "Bilbo Baggins embarks on an unexpected journey with a company of dwarves.",
  },
  {
    title: "Gone Girl",
    author: "Gillian Flynn",
    isbn: "978-0-307-58836-4",
    publishedYear: 2012,
    genre: "Mystery",
    pages: 422,
    price: 449,
    inStock: false,
    description: "On their fifth wedding anniversary, Nick Dunne's wife Amy mysteriously disappears.",
  },
  {
    title: "Steve Jobs",
    author: "Walter Isaacson",
    isbn: "978-1-4516-4853-9",
    publishedYear: 2011,
    genre: "Biography",
    pages: 656,
    price: 699,
    inStock: true,
    description: "The exclusive biography of Apple co-founder Steve Jobs, based on 40+ interviews.",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "978-0-7352-1129-2",
    publishedYear: 2018,
    genre: "Non-Fiction",
    pages: 320,
    price: 549,
    inStock: true,
    description: "A proven framework for building good habits and breaking bad ones.",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "978-0-14-143951-8",
    publishedYear: 1813,
    genre: "Romance",
    pages: 432,
    price: 249,
    inStock: true,
    description: "Elizabeth Bennet navigates issues of manners, marriage, and morality in Regency England.",
  },
];

const seedBooks = async () => {
  try {
    const count = await Book.countDocuments();
    if (count > 0) {
      console.log(`Seeder: ${count} books already in DB — skipping seed.`);
      return;
    }
    await Book.insertMany(sampleBooks);
    console.log(`Seeder: Inserted ${sampleBooks.length} sample books.`);
  } catch (err) {
    console.error("Seeder error:", err.message);
  }
};

export default seedBooks;
