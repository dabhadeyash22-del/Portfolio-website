import java.sql.*;
import java.util.Scanner;

public class LibraryDatabaseManager {
    // Database credentials (default MySQL parameters)
    private static final String URL = "jdbc:mysql://localhost:3306/library_db";
    private static final String USER = "root";
    private static final String PASSWORD = ""; // Commonly blank for default local root installations

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Connection conn = null;

        System.out.println("========== Library Database System Initialization ==========");
        try {
            // Load MySQL Driver
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("Status: Connected to MySQL database successfully.");
            
            // Create necessary schema tables
            initializeDatabaseSchema(conn);

        } catch (ClassNotFoundException e) {
            System.out.println("Warning: MySQL JDBC Driver not found. Please add the mysql-connector-java jar to your classpath.");
            System.out.println("Running in simulation mode (offline)...");
        } catch (SQLException e) {
            System.out.println("Warning: Could not connect to local MySQL database server at localhost:3306.");
            System.out.println("Reason: " + e.getMessage());
            System.out.println("\n[Note] Ensure your MySQL service (e.g. XAMPP, WampServer, or local MySQL instance) is running");
            System.out.println("and database 'library_db' exists. Running in Simulation Mode...\n");
        }

        int choice;
        do {
            System.out.println("\n========== Library Database Management ==========");
            System.out.println("1. Add Book");
            System.out.println("2. Display All Books");
            System.out.println("3. Search Book by ID");
            System.out.println("4. Issue Book (Checkout)");
            System.out.println("5. Return Book (Checkin)");
            System.out.println("6. Display Activity Log");
            System.out.println("7. Exit");
            System.out.print("\nEnter your choice (1-7): ");
            
            try {
                choice = Integer.parseInt(scanner.nextLine());
            } catch (NumberFormatException e) {
                choice = 0;
            }

            if (conn != null) {
                // MySQL Database Mode
                handleDatabaseOperations(conn, choice, scanner);
            } else {
                // Safe Mock Mode for System Testing without live MySQL daemon
                handleSimulationOperations(choice, scanner);
            }
        } while (choice != 7);

        // Close Connection safely
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        scanner.close();
        System.out.println("Thank you for using LibraryMS.");
    }

    // Initialize Schema Tables if they don't exist
    private static void initializeDatabaseSchema(Connection conn) throws SQLException {
        Statement stmt = conn.createStatement();
        
        // Books table
        stmt.execute("CREATE TABLE IF NOT EXISTS books (" +
                "id INT AUTO_INCREMENT PRIMARY KEY, " +
                "title VARCHAR(100) NOT NULL, " +
                "author VARCHAR(100) NOT NULL, " +
                "status VARCHAR(20) DEFAULT 'Available')");

        // Members table
        stmt.execute("CREATE TABLE IF NOT EXISTS members (" +
                "id INT AUTO_INCREMENT PRIMARY KEY, " +
                "name VARCHAR(100) NOT NULL)");

        // Activity log table
        stmt.execute("CREATE TABLE IF NOT EXISTS activity_log (" +
                "id INT AUTO_INCREMENT PRIMARY KEY, " +
                "member_name VARCHAR(100) NOT NULL, " +
                "book_title VARCHAR(100) NOT NULL, " +
                "status VARCHAR(20) NOT NULL, " +
                "log_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
        
        stmt.close();
    }

    // Live MySQL Operations
    private static void handleDatabaseOperations(Connection conn, int choice, Scanner scanner) {
        try {
            switch (choice) {
                case 1: // Add Book
                    System.out.print("Enter Book Title: ");
                    String title = scanner.nextLine();
                    System.out.print("Enter Author Name: ");
                    String author = scanner.nextLine();

                    String query = "INSERT INTO books (title, author, status) VALUES (?, ?, 'Available')";
                    PreparedStatement pstmt = conn.prepareStatement(query);
                    pstmt.setString(1, title);
                    pstmt.setString(2, author);
                    pstmt.executeUpdate();
                    System.out.println("\nBook successfully added to MySQL database!");
                    pstmt.close();
                    break;

                case 2: // Display Books
                    Statement stmt = conn.createStatement();
                    ResultSet rs = stmt.executeQuery("SELECT * FROM books");
                    System.out.println("\n--------------------------------------------------------------");
                    System.out.printf("%-5s %-30s %-20s %-10s\n", "ID", "Title", "Author", "Status");
                    System.out.println("--------------------------------------------------------------");
                    while (rs.next()) {
                        System.out.printf("%-5d %-30s %-20s %-10s\n",
                                rs.getInt("id"), rs.getString("title"), rs.getString("author"), rs.getString("status"));
                    }
                    System.out.println("--------------------------------------------------------------");
                    rs.close();
                    stmt.close();
                    break;

                case 3: // Search Book
                    System.out.print("Enter Book ID to search: ");
                    int id = Integer.parseInt(scanner.nextLine());
                    String sql = "SELECT * FROM books WHERE id = ?";
                    PreparedStatement ps = conn.prepareStatement(sql);
                    ps.setInt(1, id);
                    ResultSet rSet = ps.executeQuery();
                    if (rSet.next()) {
                        System.out.println("\nBook Found:");
                        System.out.println("Title: " + rSet.getString("title"));
                        System.out.println("Author: " + rSet.getString("author"));
                        System.out.println("Status: " + rSet.getString("status"));
                    } else {
                        System.out.println("\nError: Book ID " + id + " not found!");
                    }
                    rSet.close();
                    ps.close();
                    break;

                case 4: // Issue Book
                    System.out.print("Enter Book ID to issue: ");
                    int issueId = Integer.parseInt(scanner.nextLine());
                    System.out.print("Enter Member Name: ");
                    String memberName = scanner.nextLine();

                    // Check availability
                    String checkSql = "SELECT * FROM books WHERE id = ?";
                    PreparedStatement checkPs = conn.prepareStatement(checkSql);
                    checkPs.setInt(1, issueId);
                    ResultSet checkRs = checkPs.executeQuery();
                    
                    if (checkRs.next()) {
                        if (checkRs.getString("status").equalsIgnoreCase("Available")) {
                            String bookTitle = checkRs.getString("title");
                            
                            // Update book status
                            String updateSql = "UPDATE books SET status = 'Issued' WHERE id = ?";
                            PreparedStatement updatePs = conn.prepareStatement(updateSql);
                            updatePs.setInt(1, issueId);
                            updatePs.executeUpdate();
                            updatePs.close();

                            // Log transaction
                            String logSql = "INSERT INTO activity_log (member_name, book_title, status) VALUES (?, ?, 'Issued')";
                            PreparedStatement logPs = conn.prepareStatement(logSql);
                            logPs.setString(1, memberName);
                            logPs.setString(2, bookTitle);
                            logPs.executeUpdate();
                            logPs.close();

                            System.out.println("\nBook \"" + bookTitle + "\" issued successfully to " + memberName + "!");
                        } else {
                            System.out.println("\nError: Book is already checked out/issued!");
                        }
                    } else {
                        System.out.println("\nError: Book ID not found!");
                    }
                    checkRs.close();
                    checkPs.close();
                    break;

                case 5: // Return Book
                    System.out.print("Enter Book ID to return: ");
                    int returnId = Integer.parseInt(scanner.nextLine());
                    System.out.print("Enter Member Name: ");
                    String retMemName = scanner.nextLine();

                    String retCheckSql = "SELECT * FROM books WHERE id = ?";
                    PreparedStatement retCheckPs = conn.prepareStatement(retCheckSql);
                    retCheckPs.setInt(1, returnId);
                    ResultSet retCheckRs = retCheckPs.executeQuery();
                    
                    if (retCheckRs.next()) {
                        if (retCheckRs.getString("status").equalsIgnoreCase("Issued")) {
                            String bookTitle = retCheckRs.getString("title");
                            
                            // Update status
                            String returnSql = "UPDATE books SET status = 'Available' WHERE id = ?";
                            PreparedStatement returnPs = conn.prepareStatement(returnSql);
                            returnPs.setInt(1, returnId);
                            returnPs.executeUpdate();
                            returnPs.close();

                            // Log transaction
                            String logSql = "INSERT INTO activity_log (member_name, book_title, status) VALUES (?, ?, 'Returned')";
                            PreparedStatement logPs = conn.prepareStatement(logSql);
                            logPs.setString(1, retMemName);
                            logPs.setString(2, bookTitle);
                            logPs.executeUpdate();
                            logPs.close();

                            System.out.println("\nBook \"" + bookTitle + "\" returned successfully!");
                        } else {
                            System.out.println("\nError: Book is already available in the library!");
                        }
                    } else {
                        System.out.println("\nError: Book ID not found!");
                    }
                    retCheckRs.close();
                    retCheckPs.close();
                    break;

                case 6: // Display Log
                    Statement logStmt = conn.createStatement();
                    ResultSet logRs = logStmt.executeQuery("SELECT * FROM activity_log ORDER BY log_date DESC");
                    System.out.println("\n--------------------------------------------------------------");
                    System.out.printf("%-15s %-25s %-10s %-20s\n", "Member", "Book Title", "Status", "Date/Time");
                    System.out.println("--------------------------------------------------------------");
                    while (logRs.next()) {
                        System.out.printf("%-15s %-25s %-10s %-20s\n",
                                logRs.getString("member_name"), logRs.getString("book_title"),
                                logRs.getString("status"), logRs.getTimestamp("log_date"));
                    }
                    System.out.println("--------------------------------------------------------------");
                    logRs.close();
                    logStmt.close();
                    break;

                case 7:
                    break;

                default:
                    System.out.println("\nInvalid entry. Enter values between 1 and 7.");
            }
        } catch (Exception e) {
            System.out.println("MySQL Error: " + e.getMessage());
        }
    }

    // Fallback Simulated Operations if SQL Daemon is offline
    private static void handleSimulationOperations(int choice, Scanner scanner) {
        switch (choice) {
            case 1:
                System.out.print("Enter Book Title: ");
                String title = scanner.nextLine();
                System.out.print("Enter Author Name: ");
                String author = scanner.nextLine();
                System.out.println("\n[SIMULATION] Book \"" + title + "\" by " + author + " mock inserted successfully!");
                break;
            case 2:
                System.out.println("\n[SIMULATION] Displaying mock data records:");
                System.out.println("ID\tTitle\t\tAuthor\t\tStatus");
                System.out.println("1\tJava Programming\tJames Gosling\tAvailable");
                System.out.println("2\tPython Basics\tGuido van Rossum\tIssued");
                System.out.println("3\tDatabase System\tC.J. Date\t\tAvailable");
                break;
            case 3:
                System.out.print("Enter Book ID to search: ");
                int id = Integer.parseInt(scanner.nextLine());
                if (id == 1) {
                    System.out.println("\n[SIMULATION] Title: Java Programming, Author: James Gosling, Status: Available");
                } else {
                    System.out.println("\n[SIMULATION] Error: Book ID not found in simulation database.");
                }
                break;
            case 4:
                System.out.print("Enter Book ID to issue: ");
                scanner.nextLine();
                System.out.print("Enter Member Name: ");
                String mem = scanner.nextLine();
                System.out.println("\n[SIMULATION] Book successfully issued to " + mem + ".");
                break;
            case 5:
                System.out.print("Enter Book ID to return: ");
                scanner.nextLine();
                System.out.print("Enter Member Name: ");
                String ret = scanner.nextLine();
                System.out.println("\n[SIMULATION] Book returned successfully by " + ret + ".");
                break;
            case 6:
                System.out.println("\n[SIMULATION] Displaying recent transactions logs:");
                System.out.println("Member\tBook Title\tStatus\tDate/Time");
                System.out.println("Rahul\tJava Programming\tIssued\t2026-08-17 16:00:00");
                System.out.println("Sneha\tPython Basics\tReturned\t2026-08-17 15:30:00");
                break;
            case 7:
                break;
            default:
                System.out.println("\nInvalid entry. Enter values between 1 and 7.");
        }
    }
}
