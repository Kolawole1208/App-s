<?php
// submit.php

// Database file path
$db_file = 'form_data.db';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $fullname = trim($_POST['fullname']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $age = !empty($_POST['age']) ? (int)$_POST['age'] : null;
    $country = trim($_POST['country']);
    
    // Validate required fields
    if (empty($fullname) || empty($email) || empty($password)) {
        header("Location: index.html?message=Please fill in all required fields&status=error");
        exit;
    }
    
    try {
        // Connect to SQLite database
        $db = new SQLite3($db_file);
        
        // Hash the password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        // Prepare SQL statement
        $stmt = $db->prepare('INSERT INTO users (fullname, email, password, age, country) 
                             VALUES (:fullname, :email, :password, :age, :country)');
        
        // Bind parameters
        $stmt->bindValue(':fullname', $fullname, SQLITE3_TEXT);
        $stmt->bindValue(':email', $email, SQLITE3_TEXT);
        $stmt->bindValue(':password', $hashedPassword, SQLITE3_TEXT);
        $stmt->bindValue(':age', $age, SQLITE3_INTEGER);
        $stmt->bindValue(':country', $country, SQLITE3_TEXT);
        
        // Execute the statement
        if ($stmt->execute()) {
            header("Location: index.html?message=User registered successfully!&status=success");
        } else {
            header("Location: index.html?message=Error registering user&status=error");
        }
        
        // Close the database connection
        $db->close();
        
    } catch (Exception $e) {
        header("Location: index.html?message=Database error: " . urlencode($e->getMessage()) . "&status=error");
    }
} else {
    // Redirect if accessed directly
    header("Location: index.html");
    exit;
}
?>