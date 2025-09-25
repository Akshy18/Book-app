# Book CSV Editor

A **React + Vite** application for uploading, editing, filtering, sorting, and downloading CSV files containing book data. It also supports generating large datasets of fake book records for testing.

Live demo: [🔗 View on Netlify](https://book-editor.netlify.app/)

---

## Features

- Upload CSV files and parse them using [PapaParse](https://www.papaparse.com/)
- Generate large datasets of fake books using [faker.js](https://github.com/faker-js/faker)
- Search and filter by genre
- Sort data by column
- Inline editing of table cells
- Pagination with adjustable rows per page
- Reset edits and download edited CSV
- Tracks edited rows for easy identification

---

## How to Use

1. **Upload CSV**  
   Click the **“Upload CSV”** button and select a CSV file containing book data.  
   The table will populate with your CSV rows.

2. **Generate Fake Data**  
   Click **“Generate 10k books”** to create a dataset of 10,000 fake book records instantly.

3. **Search**  
   Use the search bar to search by Title, Author, Genre, Published Year, or ISBN.

4. **Filter by Genre**  
   Use the genre dropdown to filter books by category.

5. **Sort Columns**  
   Click on a table column header to sort by that column.  
   - First click → ascending  
   - Second click → descending  
   - Third click → remove sorting

6. **Edit Cells**  
   Double-click on any table cell to edit its value.  
   Press **Enter** or click outside the cell to save changes.

7. **Track Edits**  
   Edited rows are highlighted so you can easily see changes.

8. **Reset All Edits**  
   Click **“Reset All Edits”** to revert all changes to the original dataset.

9. **Download Edited CSV**  
   Click **“Download CSV”** to export your current table data to a CSV file.

10. **Pagination**  
    Use the pagination buttons at the bottom to navigate through the data.  
    You can adjust rows per page with the dropdown.

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Libraries:** PapaParse, faker.js
- **Deployment:** Netlify

---

## Installation

   ```bash
    git clone https://github.com/Akshy18/Book-app.git
    cd Book-app
    npm install
    npm run dev
