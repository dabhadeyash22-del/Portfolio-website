from flask import Flask, jsonify, request, send_from_directory
import sqlite3
import os

app = Flask(__name__, static_folder='.', static_url_path='')
DATABASE = 'library.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    # Create books table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            status TEXT DEFAULT 'Available'
        )
    ''')
    # Create members table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS members (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            name TEXT NOT NULL
        )
    ''')
    # Create activity table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS activity (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            member TEXT NOT NULL,
            book TEXT NOT NULL,
            status TEXT NOT NULL,
            date TEXT NOT NULL
        )
    ''')
    
    # Insert default data if tables are empty
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM books")
    if cursor.fetchone()[0] == 0:
        conn.execute("INSERT INTO books (title, author, status) VALUES ('Java Programming', 'James Gosling', 'Available')")
        conn.execute("INSERT INTO books (title, author, status) VALUES ('Python Basics', 'Guido van Rossum', 'Issued')")
        conn.execute("INSERT INTO books (title, author, status) VALUES ('Database System', 'C.J. Date', 'Available')")
    
    cursor.execute("SELECT COUNT(*) FROM members")
    if cursor.fetchone()[0] == 0:
        conn.execute("INSERT INTO members (name) VALUES ('Rahul')")
        conn.execute("INSERT INTO members (name) VALUES ('Sneha')")
        conn.execute("INSERT INTO members (name) VALUES ('Aman')")

    cursor.execute("SELECT COUNT(*) FROM activity")
    if cursor.fetchone()[0] == 0:
        conn.execute("INSERT INTO activity (member, book, status, date) VALUES ('Rahul', 'Java Programming', 'Issued', '12 July')")
        conn.execute("INSERT INTO activity (member, book, status, date) VALUES ('Sneha', 'Python Basics', 'Returned', '11 July')")
        conn.execute("INSERT INTO activity (member, book, status, date) VALUES ('Aman', 'Database System', 'Issued', '10 July')")

    conn.commit()
    conn.close()

# Serves static index.html frontend
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# API Endpoints
@app.route('/api/dashboard', methods=['GET'])
def get_dashboard():
    conn = get_db_connection()
    books = conn.execute('SELECT * FROM books').fetchall()
    members = conn.execute('SELECT * FROM members').fetchall()
    activities = conn.execute('SELECT * FROM activity ORDER BY id DESC').fetchall()
    conn.close()
    
    books_list = [dict(b) for b in books]
    members_list = [dict(m) for m in members]
    activity_list = [dict(a) for a in activities]
    
    return jsonify({
        "books": books_list,
        "members": members_list,
        "activity": activity_list
    })

@app.route('/api/books', methods=['POST'])
def add_book():
    data = request.json
    title = data.get('title')
    author = data.get('author')
    if not title or not author:
        return jsonify({"error": "Missing title or author"}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO books (title, author, status) VALUES (?, ?, "Available")', (title, author))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return jsonify({"success": True, "id": new_id})

@app.route('/api/members', methods=['POST'])
def add_member():
    data = request.json
    name = data.get('name')
    if not name:
        return jsonify({"error": "Missing name"}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO members (name) VALUES (?)', (name,))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return jsonify({"success": True, "id": new_id})

@app.route('/api/issue', methods=['POST'])
def issue_book():
    data = request.json
    book_id = data.get('bookId')
    member_name = data.get('memberName')
    date_str = data.get('date')
    if not book_id or not member_name or not date_str:
        return jsonify({"error": "Missing details"}), 400
        
    conn = get_db_connection()
    book = conn.execute('SELECT * FROM books WHERE id = ?', (book_id,)).fetchone()
    if not book:
        conn.close()
        return jsonify({"error": "Book not found"}), 404
        
    if book['status'] == 'Issued':
        conn.close()
        return jsonify({"error": "Book is already checked out"}), 400
        
    # Process check out
    conn.execute('UPDATE books SET status = "Issued" WHERE id = ?', (book_id,))
    conn.execute('INSERT INTO activity (member, book, status, date) VALUES (?, ?, "Issued", ?)', 
                 (member_name, book['title'], date_str))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

@app.route('/api/return', methods=['POST'])
def return_book():
    data = request.json
    book_id = data.get('bookId')
    member_name = data.get('memberName')
    date_str = data.get('date')
    if not book_id or not member_name or not date_str:
        return jsonify({"error": "Missing details"}), 400
        
    conn = get_db_connection()
    book = conn.execute('SELECT * FROM books WHERE id = ?', (book_id,)).fetchone()
    if not book:
        conn.close()
        return jsonify({"error": "Book not found"}), 404
        
    if book['status'] == 'Available':
        conn.close()
        return jsonify({"error": "Book is already returned"}), 400
        
    # Process return
    conn.execute('UPDATE books SET status = "Available" WHERE id = ?', (book_id,))
    conn.execute('INSERT INTO activity (member, book, status, date) VALUES (?, ?, "Returned", ?)', 
                 (member_name, book['title'], date_str))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

if __name__ == '__main__':
    # Fix AUTOINCREMENT syntax for SQLite (using INTEGER PRIMARY KEY implicitly does autoincrement in SQLite)
    # Ensure database file exists
    if not os.path.exists(DATABASE):
        # Create connection to force creation and setup tables
        conn = sqlite3.connect(DATABASE)
        conn.execute('CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, author TEXT, status TEXT DEFAULT "Available")')
        conn.execute('CREATE TABLE IF NOT EXISTS members (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)')
        conn.execute('CREATE TABLE IF NOT EXISTS activity (id INTEGER PRIMARY KEY AUTOINCREMENT, member TEXT, book TEXT, status TEXT, date TEXT)')
        conn.commit()
        conn.close()
        
    init_db()
    # Runs on port 5003 to prevent port conflict
    app.run(debug=True, port=5003)
