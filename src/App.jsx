import React, { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import { faker } from "@faker-js/faker";


export default function App() {

  // All states
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(50);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [sortBy, setSortBy] = useState({ col: null, dir: null });
  const [editedMap, setEditedMap] = useState(new Map());
  const [notFound, setNotFound] = useState(false);

  // columns
  const columns = ["Title", "Author", "Genre", "PublishedYear", "ISBN"];

  // CSV Upload
  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      complete: (results) => {
        const rows = results.data.map((r, i) => ({
          id: i,
          Title: r.Title ?? "",
          Author: r.Author ?? "",
          Genre: r.Genre ?? "",
          PublishedYear: r.PublishedYear ?? "",
          ISBN: r.ISBN ?? "",
        }));
        setOriginalData(rows);
        setData(rows);
        setEditedMap(new Map());
        setPage(1);
        setLoading(false);
      },
      error: (err) => {
        console.error("CSV parse error", err);
        setLoading(false);
      },
    });
  }

  // Generate fake data using faker.js
  function generateBooks(count = 10000) {
    setLoading(true);
    setTimeout(() => {
      const rows = [];
      for (let i = 0; i < count; i++) {

        const title = faker.lorem.words({ min: 2, max: 5 });
        const author = faker.person.fullName();
        const genre = faker.helpers.arrayElement([
          "Fiction",
          "Nonfiction",
          "Science Fiction",
          "Fantasy",
          "Mystery",
          "Romance",
          "Horror",
          "Biography",
          "History",
          "Self-Help",
        ]);
        const year = faker.date.between({ from: "1950-01-01", to: "2025-12-31" }).getFullYear();
        const isbn = faker.string.numeric(13);
        rows.push({ id: i, Title: title, Author: author, Genre: genre, PublishedYear: String(year), ISBN: isbn });
      }
      setOriginalData(rows);
      setData(rows);
      setEditedMap(new Map());
      setPage(1);
      setLoading(false);
    }, 50);
  }

  // Filtering and sorting 
  const filteredSortedData = useMemo(() => {
    let d = data;
    if (notFound) setNotFound(false)
    if (query) {
      const q = query.toLowerCase();
      d = d.filter(
        (r) =>
          r.Title.toLowerCase().includes(q) ||
          r.Author.toLowerCase().includes(q) ||
          r.Genre.toLowerCase().includes(q) ||
          r.ISBN.toLowerCase().includes(q) ||
          String(r.PublishedYear).toLowerCase().includes(q)
      );
    }
    if (genreFilter) {
      d = d.filter((r) => r.Genre === genreFilter);
    }
    if (sortBy.col) {
      const col = sortBy.col;
      const dir = sortBy.dir === "asc" ? 1 : -1;
      d = [...d].sort((a, b) => {
        const va = a[col] ?? "";
        const vb = b[col] ?? "";
        if (col === "PublishedYear" || col === "ISBN") {
          return (Number(va) - Number(vb)) * dir;
        }
        return String(va).localeCompare(String(vb)) * dir;
      });
    }
    if (d.length === 0) setNotFound(true)
    return d;
  }, [data, query, genreFilter, sortBy]);

  // Pagination
  const pageCount = Math.max(1, Math.ceil(filteredSortedData.length / pageSize));
  useEffect(() => {
    if (page > pageCount) setPage(1);
  }, [pageCount]);

  const currentPageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredSortedData.slice(start, start + pageSize);
  }, [filteredSortedData, page, pageSize]);

  // Inline edit
  function handleCellEdit(rowId, col, value) {

    const newData = data.map((r) =>
      r.id === rowId ? { ...r, [col]: value } : r
    );
    setData(newData);

    const originalRow = originalData.find((r) => r.id === rowId);
    const changed = {};
    columns.forEach((c) => {
      if (newData.find((r) => r.id === rowId)[c] !== (originalRow?.[c] ?? ""))
        changed[c] = true;
    });

    const m = new Map(editedMap);
    if (Object.keys(changed).length > 0) m.set(rowId, changed);
    else m.delete(rowId);
    setEditedMap(m);
  }

  // Reset edits
  function resetAllEdits() {
    setData(originalData.map((r) => ({ ...r })));
    setEditedMap(new Map());
  }

  // Download edited CSV
  function downloadCSV() {
    const csv = Papa.unparse(data, { columns });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "books-edited.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // Unique genres for filter
  const genres = useMemo(() => {
    const s = new Set();
    for (const r of originalData) if (r.Genre) s.add(r.Genre);
    return [...s].sort();
  }, [originalData]);

  // Toggle sort
  function toggleSort(col) {
    setSortBy((prev) => {
      if (prev.col !== col) return { col, dir: "asc" };
      if (prev.dir === "asc") return { col, dir: "desc" };
      return { col: null, dir: null };
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold">Book CSV Editor</h1>
          <div className="flex gap-2 items-center">
            <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-white border-b border-gray-400 rounded shadow-sm ">
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden bg-white" />
              <span>Upload CSV</span>
            </label>
            <button
              className="px-3 py-2 bg-white border-b border-gray-400 rounded shadow-sm"
              onClick={() => generateBooks(10000)}
            >
              Generate 10k books
            </button>
            <button className="px-3 py-2 bg-white border-b border-gray-400 rounded shadow-sm" onClick={downloadCSV}>
              Download CSV
            </button>
            <button className="px-3 py-2 bg-white border-b border-gray-400 rounded shadow-sm" onClick={resetAllEdits}>
              Reset All Edits
            </button>
          </div>
        </header>

        <section className="bg-white rounded shadow p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, author, ISBN..."
                className="border-b border-gray-400 rounded px-3 py-2 w-64 bg-white"
              />
              <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)} className="border-b border-gray-400 rounded px-2 py-2 bg-white">
                <option value="">All genres</option>
                {genres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="sm:ml-auto pt-2 sm:pt-0 flex items-center gap-2">
              <label className="text-sm">Rows per page</label>
              <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="border-b border-gray-400 rounded px-2 py-1 bg-white">
                {[10, 25, 50, 100, 250].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 text-sm text-gray-600 flex items-center gap-4">
            <div>Rows: <strong>{filteredSortedData.length}</strong></div>
            <div>Page: <strong>{page}/{pageCount}</strong></div>
            <div>Edited rows: <strong>{editedMap.size}</strong></div>
            {loading && <div className="ml-auto">Loading...</div>}
          </div>
        </section>

        <main className="bg-white rounded shadow overflow-auto border-b border-gray-400">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 sticky top-0 border-b border-gray-400">
              <tr>
                <th className="px-3 py-2 text-left">#</th>
                {columns.map((col) => (
                  <th key={col} className="px-3 py-2 text-left">
                    <button onClick={() => toggleSort(col)} className="flex items-center gap-2">
                      <span>{col}</span>
                      {sortBy.col === col && <span>{sortBy.dir === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentPageRows.map((row, i) => {

                const isEdited = editedMap.has(row.id);
                return (
                  <tr key={row.id} className={`${isEdited ? 'bg-yellow-100' : ''} border-b border-gray-200 shadow-lg `}>
                    <td className="px-3 py-2 align-top text-sm">{(page - 1) * pageSize + i + 1}</td>
                    {columns.map((col) => (
                      <td key={col} className="px-3 py-2 align-top">
                        <EditableCell
                          value={row[col]}
                          onChange={(val) => {
                            handleCellEdit(row.id, col, val);
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </main>
        {notFound && <p className="text-center font-bold p-4">No data available</p>}
        <footer className="mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border-b border-gray-400 rounded" onClick={() => setPage(1)} disabled={page === 1}>First</button>
            <button className="px-3 py-1 border-b border-gray-400  rounded" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
            <button className="px-3 py-1 border-b border-gray-400  rounded" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount}>Next</button>
            <button className="px-3 py-1 border-b border-gray-400  rounded" onClick={() => setPage(pageCount)} disabled={page === pageCount}>Last</button>
          </div>

          <div className="flex items-center gap-2">
            <span>Go to page</span>
            <input type="number" min={1} max={pageCount} value={page} onChange={(e) => setPage(Number(e.target.value)) || 1} className="w-20 border-b border-gray-400 rounded px-2 py-1 bg-white" />
          </div>
        </footer>
      </div>
    </div>
  );
}

// Editable cell component
function EditableCell({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value ?? "");

  useEffect(() => {
    setVal(value ?? "");
  }, [value]);

  return (
    <div className="min-w-[120px]">
      {editing ? (
        <input
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => { setEditing(false); onChange(val); }}
          onKeyDown={(e) => { if (e.key === 'Enter') { setEditing(false); onChange(val); } }}
          className="w-full border rounded px-2 py-1 bg-white"
        />
      ) : (
        <div onDoubleClick={() => setEditing(true)} className="text-sm truncate">
          {val}
        </div>
      )}
    </div>
  );
}
