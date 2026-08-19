// ==========================
// Library Management System
// js/script.js
// ==========================

// ---------- Local Storage Setup ----------

if (!localStorage.getItem("books")) {
    const books = [
        { id: 1, title: "Java Programming", author: "James Gosling", status: "Available" },
        { id: 2, title: "Python Basics", author: "Guido van Rossum", status: "Issued" },
        { id: 3, title: "Database System", author: "C.J. Date", status: "Available" }
    ];
    localStorage.setItem("books", JSON.stringify(books));
}

if (!localStorage.getItem("members")) {
    const members = [
        { id: 1, name: "Rahul" },
        { id: 2, name: "Sneha" },
        { id: 3, name: "Aman" }
    ];
    localStorage.setItem("members", JSON.stringify(members));
}

if (!localStorage.getItem("activity")) {
    const activity = [
        { member: "Rahul", book: "Java Programming", status: "Issued", date: "12 July" },
        { member: "Sneha", book: "Python Basics", status: "Returned", date: "11 July" },
        { member: "Aman", book: "Database System", status: "Issued", date: "10 July" }
    ];
    localStorage.setItem("activity", JSON.stringify(activity));
}

// Global flag to track backend database connection status
let isBackendOnline = false;

// ---------- Dashboard Loader ----------

async function loadDashboard() {
    try {
        // Try fetching records from the Python Flask database API
        const res = await fetch("/api/dashboard");
        if (res.ok) {
            const data = await res.json();
            isBackendOnline = true;
            renderStats(data.books, data.members, data.activity);
            return;
        }
    } catch (err) {
        // Offline / static preview mode: Fall back to local storage
        isBackendOnline = false;
    }

    // Local Storage fallback
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const members = JSON.parse(localStorage.getItem("members")) || [];
    const activity = JSON.parse(localStorage.getItem("activity")) || [];
    renderStats(books, members, activity);
}

function renderStats(books, members, activity) {
    const totalBooks = books.length;
    const availableBooks = books.filter(b => b.status === "Available").length;
    const issuedBooks = books.filter(b => b.status === "Issued").length;

    document.getElementById("books").innerText = totalBooks;
    document.getElementById("members").innerText = members.length;
    document.getElementById("issued").innerText = issuedBooks;
    document.getElementById("available").innerText = availableBooks;

    // Render activity table
    const tbody = document.getElementById("activityTable");
    tbody.innerHTML = "";

    activity.forEach(act => {
        const row = document.createElement("tr");
        const statusClass = act.status.toLowerCase() === "issued" ? "green" : "blue";
        row.innerHTML = `
            <td>${act.member}</td>
            <td>${act.book}</td>
            <td class="${statusClass}">${act.status}</td>
            <td>${act.date}</td>
        `;
        tbody.appendChild(row);
    });
}

// ---------- Quick Action Triggers ----------

const buttons = document.querySelectorAll(".buttons button");

// Add Book
buttons[0].addEventListener("click", async () => {
    const title = prompt("Enter Book Title:");
    if (!title) return;
    const author = prompt("Enter Author Name:");
    if (!author) return;

    if (isBackendOnline) {
        try {
            const res = await fetch("/api/books", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, author })
            });
            const data = await res.json();
            if (data.success) {
                alert(`Book "${title}" added to SQLite/MySQL database with ID: ${data.id}!`);
                loadDashboard();
                return;
            }
        } catch (err) {
            alert("Backend error. Falling back to offline mode.");
        }
    }

    // Local fallback
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const nextId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
    books.push({ id: nextId, title, author, status: "Available" });
    localStorage.setItem("books", JSON.stringify(books));
    alert(`Book "${title}" added to local storage catalog with ID: ${nextId}!`);
    loadDashboard();
});

// Add Member
buttons[1].addEventListener("click", async () => {
    const name = prompt("Enter Member Name:");
    if (!name) return;

    if (isBackendOnline) {
        try {
            const res = await fetch("/api/members", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name })
            });
            const data = await res.json();
            if (data.success) {
                alert(`Member "${name}" registered in database with ID: ${data.id}!`);
                loadDashboard();
                return;
            }
        } catch (err) {
            alert("Backend error. Falling back to offline mode.");
        }
    }

    // Local fallback
    const members = JSON.parse(localStorage.getItem("members")) || [];
    const nextId = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1;
    members.push({ id: nextId, name });
    localStorage.setItem("members", JSON.stringify(members));
    alert(`Member "${name}" registered locally with ID: ${nextId}!`);
    loadDashboard();
});

// Issue Book
buttons[2].addEventListener("click", async () => {
    const bookId = parseInt(prompt("Enter Book ID to issue:"));
    if (isNaN(bookId)) return;
    const memberName = prompt("Enter Member Name:");
    if (!memberName) return;
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    if (isBackendOnline) {
        try {
            const res = await fetch("/api/issue", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookId, memberName, date: today })
            });
            const data = await res.json();
            if (data.success) {
                alert("Book successfully issued in database!");
                loadDashboard();
                return;
            } else {
                alert(data.error);
                return;
            }
        } catch (err) {
            alert("Backend communication error.");
        }
    }

    // Local fallback
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
        alert("Error: Book ID not found in library catalog!");
        return;
    }
    if (books[bookIndex].status === "Issued") {
        alert("Error: Book is already issued!");
        return;
    }

    books[bookIndex].status = "Issued";
    localStorage.setItem("books", JSON.stringify(books));

    const activity = JSON.parse(localStorage.getItem("activity")) || [];
    activity.unshift({ member: memberName, book: books[bookIndex].title, status: "Issued", date: today });
    localStorage.setItem("activity", JSON.stringify(activity));

    alert(`Book "${books[bookIndex].title}" successfully issued to ${memberName}!`);
    loadDashboard();
});

// Return Book
buttons[3].addEventListener("click", async () => {
    const bookId = parseInt(prompt("Enter Book ID to return:"));
    if (isNaN(bookId)) return;
    const memberName = prompt("Enter Member Name checking book in:");
    if (!memberName) return;
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    if (isBackendOnline) {
        try {
            const res = await fetch("/api/return", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookId, memberName, date: today })
            });
            const data = await res.json();
            if (data.success) {
                alert("Book successfully returned and logged in database!");
                loadDashboard();
                return;
            } else {
                alert(data.error);
                return;
            }
        } catch (err) {
            alert("Backend communication error.");
        }
    }

    // Local fallback
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
        alert("Error: Book ID not found in catalog!");
        return;
    }
    if (books[bookIndex].status === "Available") {
        alert("Error: Book is already in library (not checked out)!");
        return;
    }

    books[bookIndex].status = "Available";
    localStorage.setItem("books", JSON.stringify(books));

    const activity = JSON.parse(localStorage.getItem("activity")) || [];
    activity.unshift({ member: memberName, book: books[bookIndex].title, status: "Returned", date: today });
    localStorage.setItem("activity", JSON.stringify(activity));

    alert(`Book "${books[bookIndex].title}" successfully checked in!`);
    loadDashboard();
});

// ---------- Search Filter ----------

const search = document.querySelector("input[placeholder='Search Books...']");
if (search) {
    search.addEventListener("keyup", function() {
        const value = search.value.toLowerCase();
        const rows = document.querySelectorAll("#activityTable tr");

        rows.forEach(row => {
            const text = row.innerText.toLowerCase();
            row.style.display = text.includes(value) ? "" : "none";
        });
    });
}

// ---------- Dark/Light Toggle ----------

const darkBtn = document.getElementById("darkBtn");
if (darkBtn) {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
        darkBtn.innerHTML = "☀️";
    }

    darkBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        if (document.body.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
            darkBtn.innerHTML = "☀️";
        } else {
            localStorage.setItem("theme", "light");
            darkBtn.innerHTML = "🌙";
        }
    });
}

// Load default settings
loadDashboard();