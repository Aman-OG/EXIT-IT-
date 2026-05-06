require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'exitit_user',
    password: process.env.DB_PASSWORD || 'password123',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'exitit_db',
});

const mockQuestions = [
    // FILE 1: IT_Model_Exam.docx (Questions 1-110)
    {
        text: "One of the following statements is false", type: "multiple_choice", options: [
            { text: "Method overloading is resolved at compile time", correct: false },
            { text: "Method overriding is resolved at run time", correct: false },
            { text: "Overridden methods coexist in the same class", correct: true },
            { text: "Overloaded methods have the same name but different signature", correct: false }
        ]
    },
    {
        text: "Among the following, which one is not a feature of Java?", type: "multiple_choice", options: [
            { text: "Robust", correct: false },
            { text: "Structured", correct: true },
            { text: "Distributed", correct: false },
            { text: "High Performance", correct: false }
        ]
    },
    {
        text: "Which one of the following statements is wrong about a web page?", type: "multiple_choice", options: [
            { text: "The content of a static web page can only change if the source code is changed.", correct: false },
            { text: "The content of a dynamic page may change in response to users' actions.", correct: false },
            { text: "An application that collects data from users through a form and stores it in a database requires the integration of client & server-side scripts", correct: false },
            { text: "Source code of a program written in a server-side scripting language is visible on a client application such as a browser", correct: true }
        ]
    },
    {
        text: "Suppose String S=null; then what type of exception will occur when we execute the statement System.out.println(S.charAt(0));", type: "multiple_choice", options: [
            { text: "ArithmeticException", correct: false },
            { text: "OutOfMemoryError", correct: false },
            { text: "NumberFormatException", correct: false },
            { text: "NullPointerException", correct: true }
        ]
    },
    {
        text: "Which one of the following scheduling algorithms is both preemptive and non-preemptive?", type: "multiple_choice", options: [
            { text: "Round Robin", correct: false },
            { text: "Priority", correct: true },
            { text: "FCFS", correct: false },
            { text: "SJF", correct: false }
        ]
    },
    {
        text: "Which mode of transmission the entire capacity of the channel can be utilized for each direction?", type: "multiple_choice", options: [
            { text: "Simplex", correct: false },
            { text: "Half duplex", correct: false },
            { text: "Full duplex", correct: true },
            { text: "all except A", correct: false }
        ]
    },
    {
        text: "The activity of choosing an efficient execution strategy for processing a query is called ___________?", type: "multiple_choice", options: [
            { text: "Query execution", correct: false },
            { text: "Query plan evaluation", correct: false },
            { text: "Query optimization", correct: true },
            { text: "Query parsing", correct: false }
        ]
    },
    {
        text: "Which types of switching each node receives the entire message, stores it, and then transmits it to the next node?", type: "multiple_choice", options: [
            { text: "Circuit Switching", correct: false },
            { text: "Packet Switching", correct: false },
            { text: "Message Switching", correct: true },
            { text: "all", correct: false }
        ]
    },
    {
        text: "What happens if several catch blocks match the type of the thrown exception?", type: "multiple_choice", options: [
            { text: "All the catch blocks for that try statement are executed in order.", correct: false },
            { text: "The first catch block is executed and the others are skipped.", correct: true },
            { text: "All the catch blocks for that try statement are skipped.", correct: false },
            { text: "The program will terminate without executing any of the catch blocks.", correct: false }
        ]
    },
    {
        text: "The DBMS acts as an interface between what two components of an enterprise-class database system?", type: "multiple_choice", options: [
            { text: "Database application and the database", correct: true },
            { text: "Data and the database", correct: false },
            { text: "The user and the database application", correct: false },
            { text: "Database application and SQL", correct: false }
        ]
    },
    {
        text: "One of the following is false statement about uses of servlet", type: "multiple_choice", options: [
            { text: "Processing and storing data submitted by HTML form.", correct: false },
            { text: "Providing dynamic content.", correct: false },
            { text: "Used to handle multiple requests concurrently", correct: false },
            { text: "Processing and returning data to user in HTML form only.", correct: true }
        ]
    },
    {
        text: "What will be the output of the following program? (Assuming program computes 3^2=9)", type: "multiple_choice", options: [
            { text: "9", correct: true },
            { text: "81", correct: false },
            { text: "27", correct: false },
            { text: "3", correct: false }
        ]
    },
    {
        text: "Which one of the HTML5 attributes makes a text box inactive to edit?", type: "multiple_choice", options: [
            { text: "required", correct: false },
            { text: "pattern", correct: false },
            { text: "read-only", correct: true },
            { text: "disable", correct: false }
        ]
    },
    {
        text: "A variable declared _______ has a GLOBAL SCOPE?", type: "multiple_choice", options: [
            { text: "outside program", correct: false },
            { text: "inside function", correct: false },
            { text: "outside function", correct: true },
            { text: "None Of the Above", correct: false }
        ]
    },
    {
        text: "Which Java statement always executes its body at least once, even though the condition is not true?", type: "multiple_choice", options: [
            { text: "for", correct: false },
            { text: "do-while", correct: true },
            { text: "while", correct: false },
            { text: "continue", correct: false }
        ]
    },
    {
        text: "Software and hardware that uses hypertext Transfer Protocol to respond to client requests is ---?", type: "multiple_choice", options: [
            { text: "file server", correct: false },
            { text: "mail server", correct: false },
            { text: "web server", correct: true },
            { text: "A and C", correct: false }
        ]
    },
    {
        text: "One of the following is not true about inheritance?", type: "multiple_choice", options: [
            { text: "Inheritance is used for code reusing", correct: false },
            { text: "In inheritance the sub class can introduce its own specific variables", correct: false },
            { text: "A super class can access its own sub classes unique data members", correct: true },
            { text: "Java uses the word extends to implement inheritance", correct: false }
        ]
    },
    {
        text: "Features of Java used to handle more than one job at a time.", type: "multiple_choice", options: [
            { text: "Distributed", correct: false },
            { text: "Platform-Independent", correct: false },
            { text: "Portable", correct: false },
            { text: "Multi-threaded", correct: true }
        ]
    },
    {
        text: "Which one of the following is not necessary condition for deadlock to occurred?", type: "multiple_choice", options: [
            { text: "Hold and Wait", correct: false },
            { text: "Mutual inclusion", correct: true },
            { text: "No- preemption", correct: false },
            { text: "Circular wait", correct: false }
        ]
    },
    {
        text: "Which TCP/IP layer allows an IP packet to make a physical link to transmission media?", type: "multiple_choice", options: [
            { text: "Application layer", correct: false },
            { text: "Internet layer", correct: false },
            { text: "network access layer", correct: true },
            { text: "transport layer", correct: false }
        ]
    },
    {
        text: "A process stack does not contain ___________", type: "multiple_choice", options: [
            { text: "Function parameters", correct: false },
            { text: "Local variables", correct: false },
            { text: "Return addresses", correct: false },
            { text: "PID of the child process", correct: true }
        ]
    },
    {
        text: "One of the following is not the reason for the need of query optimization?", type: "multiple_choice", options: [
            { text: "To utilized storage space efficiently", correct: false },
            { text: "To increase system performance", correct: false },
            { text: "To maximize throughput", correct: false },
            { text: "To increase response time", correct: true }
        ]
    },
    {
        text: "Which of the following is not common member to both abstract classes and interfaces?", type: "multiple_choice", options: [
            { text: "static variables", correct: false },
            { text: "final variables", correct: false },
            { text: "private members", correct: true },
            { text: "abstract methods", correct: false }
        ]
    },
    {
        text: "Given a class named Student, which of the following is a valid constructor declaration for this class?", type: "multiple_choice", options: [
            { text: "Constructor Student ( ) { }", correct: false },
            { text: "public Student ( ) { }", correct: true },
            { text: "Student Student ( ) { }", correct: false },
            { text: "Void Student ( ) { }", correct: false }
        ]
    },
    {
        text: "Which one of the following statements is True about operating systems as an I/O manager?", type: "multiple_choice", options: [
            { text: "Control all the computer I/O devices.", correct: false },
            { text: "Issue commands to I/O devices, catching interrupts and handling errors", correct: false },
            { text: "Provide an interface between the device and the rest of the system.", correct: false },
            { text: "All", correct: true }
        ]
    },
    {
        text: "Identify the correct statement based on the code snippet given below. $fop=fopen('xyz.txt','a+'); fwrite($fop,'hello'); fclose($fop);", type: "multiple_choice", options: [
            { text: "xyz.txt file is opened for reading only", correct: false },
            { text: "the text hello will be appended to the existing content in xyz.txt file", correct: true },
            { text: "the text hello won't be written to xyz.txt file, if the file does not exist", correct: false },
            { text: "xyz.txt file is opened for write-only access", correct: false }
        ]
    },
    {
        text: "To ensure integrity of the data, a database system should ensure transactions to possess certain properties. The property which makes sure that the partial effects of incomplete transactions should not visible to the other transactions is called___________?", type: "multiple_choice", options: [
            { text: "Atomicity", correct: false },
            { text: "Isolation", correct: true },
            { text: "Consistency", correct: false },
            { text: "Durability", correct: false }
        ]
    },
    {
        text: "Which one of the following is the result of the following PHP code? Given Code: echo strlen('IP II Model-Exam !');", type: "multiple_choice", options: [
            { text: "20", correct: false },
            { text: "18", correct: true },
            { text: "16", correct: false },
            { text: "15", correct: false }
        ]
    },
    {
        text: "Which layer allows an IP packet to make a physical link to the media?", type: "multiple_choice", options: [
            { text: "Internet layer", correct: false },
            { text: "Network access layer", correct: true },
            { text: "Transport layer", correct: false },
            { text: "Application layer", correct: false }
        ]
    },
    {
        text: "Which Java keyword cannot appear on instance variable declaration?", type: "multiple_choice", options: [
            { text: "private", correct: false },
            { text: "static", correct: false },
            { text: "public", correct: false },
            { text: "string", correct: true }
        ]
    },
    {
        text: "Assume Mr. Daniel is running different applications at the same time like browsing the internet while preparing his assignment, so which type of operating system he used.", type: "multiple_choice", options: [
            { text: "ROTS", correct: false },
            { text: "Multi-tasking", correct: true },
            { text: "Multi-user", correct: false },
            { text: "DOS", correct: false }
        ]
    },
    {
        text: "Based on the code snippet given below, which one of the following statements allow you to assign an email submitted from the form to a variable called email? UserEmail", type: "multiple_choice", options: [
            { text: "$email= $_GET['email'];", correct: false },
            { text: "$email= $_POST['email'];", correct: false },
            { text: "echo $_REQUEST['email'];", correct: false },
            { text: "$email= $_REQUEST['UserEmail'];", correct: true }
        ]
    },
    {
        text: "One of the following is not consider in cost estimation during query optimization?", type: "multiple_choice", options: [
            { text: "Input/Output cost", correct: false },
            { text: "Communication cost", correct: false },
            { text: "CPU processing cost", correct: false },
            { text: "Device cost", correct: true }
        ]
    },
    {
        text: "Among the following lists one doesn't describe a field in a relation?", type: "multiple_choice", options: [
            { text: "Record", correct: true },
            { text: "Attributes", correct: false },
            { text: "Column", correct: false },
            { text: "All of them", correct: false }
        ]
    },
    {
        text: "Choose the lists of the keywords in order that they would be used to handle exceptions in Java.", type: "multiple_choice", options: [
            { text: "catch, try, finally", correct: false },
            { text: "try, catch, finally", correct: true },
            { text: "finally, catch, try", correct: false },
            { text: "try, finally, catch", correct: false }
        ]
    },
    {
        text: "If a process runs, out of the extra space allocated to it, then which action is not taken by the system?", type: "multiple_choice", options: [
            { text: "It will have to be moved a process to a partition having a small space.", correct: true },
            { text: "Swapped out of memory until a large enough hole can be created", correct: false },
            { text: "Kill the process.", correct: false },
            { text: "All", correct: false }
        ]
    },
    {
        text: "Which of the following primitive data types is not Integer type?", type: "multiple_choice", options: [
            { text: "byte", correct: false },
            { text: "double", correct: true },
            { text: "int", correct: false },
            { text: "short", correct: false }
        ]
    },
    {
        text: "Which one of the following is wrong about structural and object-oriented programming paradigms?", type: "multiple_choice", options: [
            { text: "Structural Programming can solve moderate problems", correct: false },
            { text: "Object-Oriented Programming provides data hiding", correct: false },
            { text: "Structural Programming does not provide data hiding", correct: false },
            { text: "Structural Programming support code reusability", correct: true }
        ]
    },
    {
        text: "What is the use of isset() function in PHP?", type: "multiple_choice", options: [
            { text: "The isset() function is used to check whether a variable is set or not", correct: true },
            { text: "The isset() function is used to check whether a variable is free or not", correct: false },
            { text: "The isset() function is used to check whether a variable is a string or not", correct: false },
            { text: "The isset() function is used to set a new value to a variable", correct: false }
        ]
    },
    {
        text: "One of the following is not true statement.", type: "multiple_choice", options: [
            { text: "Class is an entity that contains both data and methods.", correct: false },
            { text: "new operator used to create object from a given class", correct: false },
            { text: "In java new operator used to declare variable that used to store single value", correct: true },
            { text: "Classes are model of a given problem domain.", correct: false }
        ]
    },
    {
        text: "Which one of the following is the output of the given program? (PHP loop with continue)", type: "multiple_choice", options: [
            { text: "0134", correct: false },
            { text: "Nov", correct: false },
            { text: "2", correct: true },
            { text: "SeptOctDecJan", correct: false }
        ]
    },
    {
        text: "Which one of the following statements is the correct way of defining a CSS style using a class selector?", type: "multiple_choice", options: [
            { text: "p,h1,h2,li { text-align: center; color: red; }", correct: false },
            { text: "p { background: yellow; color: red; }", correct: false },
            { text: "#par{ background: yellow; color: red; }", correct: false },
            { text: ".par { background: yellow; color: red; }", correct: true }
        ]
    },
    {
        text: "Which one of the following PHP functions is used to redirect a user to a specific page?", type: "multiple_choice", options: [
            { text: "Send_redirect()", correct: false },
            { text: "header_location()", correct: false },
            { text: "header()", correct: true },
            { text: "redirect()", correct: false }
        ]
    },
    {
        text: "Which one is the right name given for unique identification of each entity?", type: "multiple_choice", options: [
            { text: "Composite Key", correct: false },
            { text: "Primary Key", correct: true },
            { text: "Foreign key", correct: false },
            { text: "Candidate Key", correct: false }
        ]
    },
    {
        text: "Which coding transition is at the middle of the bit and changes phase when a different bit is encountered?", type: "multiple_choice", options: [
            { text: "Differential Manchester", correct: true },
            { text: "Manchester", correct: false },
            { text: "Delta modulation", correct: false },
            { text: "Pulse code modulation", correct: false }
        ]
    },
    {
        text: "Which of the following is not primitive data type in Java?", type: "multiple_choice", options: [
            { text: "String", correct: true },
            { text: "long", correct: false },
            { text: "Boolean", correct: false },
            { text: "int", correct: false }
        ]
    },
    {
        text: "The velocity of propagation of a signal through a guided medium varies with frequency. This type transmission impairment is called?", type: "multiple_choice", options: [
            { text: "Noise", correct: false },
            { text: "Attenuation distortion", correct: false },
            { text: "Delay distortion", correct: false },
            { text: "B and C", correct: true }
        ]
    },
    {
        text: "Among the following one describes the functional dependency between non-key attributes of a relation?", type: "multiple_choice", options: [
            { text: "Functional data dependency", correct: false },
            { text: "Partial functional data dependency", correct: false },
            { text: "Full functional data dependency", correct: false },
            { text: "Transitive functional data dependency", correct: true }
        ]
    },
    {
        text: "___________is methods assume conflict is rare and only checks for conflicts at commit/terminate time?", type: "multiple_choice", options: [
            { text: "Shared Locking", correct: false },
            { text: "Optimistic", correct: true },
            { text: "Time stamping", correct: false },
            { text: "Executive locking", correct: false }
        ]
    },
    {
        text: "___________is a rule of no component of the primary key may contain a NULL value.", type: "multiple_choice", options: [
            { text: "Entity integrity", correct: true },
            { text: "Referential integrity", correct: false },
            { text: "Domain Integrity", correct: false },
            { text: "Cardinal integrity", correct: false }
        ]
    },
    {
        text: "Which one of the following is used to display an output in PHP?", type: "multiple_choice", options: [
            { text: "document.write()", correct: false },
            { text: "out.print()", correct: false },
            { text: "print()", correct: true },
            { text: "write()", correct: false }
        ]
    },
    {
        text: "Among the following one is the process of analyzing the given relation schemas based on their functional dependencies and primary keys.", type: "multiple_choice", options: [
            { text: "Decomposition", correct: false },
            { text: "Normalization", correct: true },
            { text: "Partitioning", correct: false },
            { text: "Distributing", correct: false }
        ]
    },
    {
        text: "_____________are rules that should be obeyed or followed while manipulating the data?", type: "multiple_choice", options: [
            { text: "E-R diagram", correct: false },
            { text: "Entity", correct: false },
            { text: "Relationship", correct: false },
            { text: "constraints", correct: true }
        ]
    },
    {
        text: "A program written in ___________ language does not require a server to run.", type: "multiple_choice", options: [
            { text: "PHP", correct: false },
            { text: "Servlet", correct: false },
            { text: "JSP", correct: false },
            { text: "HTML", correct: true }
        ]
    },
    {
        text: "One of the following statements is false", type: "multiple_choice", options: [
            { text: "An exception is a compile time error", correct: true },
            { text: "In java there are predefined classes that used to handle exceptions", correct: false },
            { text: "In exception handling technique an exception object contains expected error information", correct: false },
            { text: "Exception handling mechanism decreases your program performance", correct: false }
        ]
    },
    {
        text: "Which one is false about abstract class and interface in Java?", type: "multiple_choice", options: [
            { text: "An interface cannot have instance variables.", correct: false },
            { text: "In Java, an Interface cannot be final", correct: false },
            { text: "There can be non-abstract methods within abstract class.", correct: false },
            { text: "We can define private modifier for variables in interfaces.", correct: true }
        ]
    },
    {
        text: "Which of the following OOP concept binds the code and data together and keeps them secure from the outside world?", type: "multiple_choice", options: [
            { text: "Polymorphism", correct: false },
            { text: "Inheritance", correct: false },
            { text: "Abstraction", correct: false },
            { text: "Encapsulation", correct: true }
        ]
    },
    {
        text: "From the following list of Java variables; which one is invalid?", type: "multiple_choice", options: [
            { text: "EMP_Salary", correct: false },
            { text: "Age27", correct: false },
            { text: "My-Name", correct: true },
            { text: "_1200IDN", correct: false }
        ]
    },
    {
        text: "Which one of the following PHP functions is used to execute SQL queries?", type: "multiple_choice", options: [
            { text: "mysqli_select_db()", correct: false },
            { text: "mysqli_fetch_assoc()", correct: false },
            { text: "mysqli_execute_query()", correct: false },
            { text: "mysqli_query()", correct: true }
        ]
    },
    {
        text: "Which method execute first when you run Servlet code?", type: "multiple_choice", options: [
            { text: "Service ( )", correct: false },
            { text: "destroy ( )", correct: false },
            { text: "init( )", correct: true },
            { text: "start( )", correct: false }
        ]
    },
    {
        text: "A class declaration that begins with the keyword ______________ must be stored in a file that has exactly the same name as that class and ends with the .java file-name extension.", type: "multiple_choice", options: [
            { text: "private", correct: false },
            { text: "final", correct: false },
            { text: "public", correct: true },
            { text: "abstract", correct: false }
        ]
    },
    {
        text: "Which layer allows an IP packet to make a physical link to the media?", type: "multiple_choice", options: [
            { text: "Internet layer", correct: false },
            { text: "Network access layer", correct: true },
            { text: "Transport layer", correct: false },
            { text: "Application layer", correct: false }
        ]
    },
    {
        text: "Based on the html code given below identify the correct statement. Given Code: <p style='color:red;'>Hello Everyone</p>", type: "multiple_choice", options: [
            { text: "</p> is an end tag and has no problem if we forget it", correct: false },
            { text: "'Hello Everyone' is an element that will be displayed on the browser in red color", correct: true },
            { text: "'style' is a CSS property", correct: false },
            { text: "style='color:red;'> is an internal CSS", correct: false }
        ]
    },
    {
        text: "Which one of the following is correct statement?", type: "multiple_choice", options: [
            { text: "Both unipolar encoding and polar encoding techniques are NRZ.", correct: false },
            { text: "Both NRZ-L and NRZ-I changes voltage level when different bit is encountered", correct: false },
            { text: "NRZ-I changes voltage level at when a different bit is encountered", correct: true },
            { text: "NRZ-L changes voltage when a 1 is encountered.", correct: false }
        ]
    },
    {
        text: "Which one of the following statements is False about segmentation and paging?", type: "multiple_choice", options: [
            { text: "In segmentation segments size is unequal and dynamic.", correct: false },
            { text: "In paging the virtual address space is divided into equal-sized block called pages frame.", correct: true },
            { text: "Pages and page frames should have the same size.", correct: false },
            { text: "To map each page into frames we need a special data structure called page table", correct: false }
        ]
    },
    {
        text: "______________is a technique/process of keeping and maintaining a log file of all transaction changes made to database to enable effective recovery in event of failure?", type: "multiple_choice", options: [
            { text: "Journaling", correct: true },
            { text: "View", correct: false },
            { text: "Backup", correct: false },
            { text: "Encryption", correct: false }
        ]
    },
    {
        text: "Timestamp ordering protocol is said to be free from deadlock because of _________ reason?", type: "multiple_choice", options: [
            { text: "It is cascading free", correct: false },
            { text: "No transaction is made to wait", correct: true },
            { text: "It guarantees serializability", correct: false },
            { text: "None of them", correct: false }
        ]
    },
    {
        text: "One of the following is false about Java database connectivity (JDBC)", type: "multiple_choice", options: [
            { text: "It allows you to create Java application that can access data from different types of database systems.", correct: false },
            { text: "It used to connect Java standalone applications with back-end database servers.", correct: false },
            { text: "It uses different predefined java classes and methods to handle various data access functions.", correct: false },
            { text: "Different database systems can use the same JDBC driver, which used to establish the connection interface.", correct: true }
        ]
    },
    {
        text: "Which keyword is used to prevent content of a variable from being modified?", type: "multiple_choice", options: [
            { text: "final", correct: true },
            { text: "last", correct: false },
            { text: "constant", correct: false },
            { text: "static", correct: false }
        ]
    },
    {
        text: "Which one of the following statements is True about operating systems?", type: "multiple_choice", options: [
            { text: "It provides a platform on which application software can be installed on the bottom.", correct: false },
            { text: "It controls the overall functionality of the computer system.", correct: true },
            { text: "It primarily focuses on managing the hardware resource rather than software resources.", correct: false },
            { text: "We can use a computer, even if a computer has no installed operating system.", correct: false }
        ]
    },
    {
        text: "Transaction-processing systems usually allow multiple transactions to run concurrently. Which of the following best suits as the advantage(s) of allowing concurrent execution of transactions?", type: "multiple_choice", options: [
            { text: "Improved transaction throughput", correct: true },
            { text: "Serializability", correct: false },
            { text: "Reduced execution complexity", correct: false },
            { text: "Reduced waiting time", correct: false }
        ]
    },
    {
        text: "Which one of the following subnet masks represents class A before and after subnetting?", type: "multiple_choice", options: [
            { text: "255.0.0.0", correct: false },
            { text: "255.255.0.0", correct: false },
            { text: "255.255.255.0", correct: false },
            { text: "all", correct: true }
        ]
    },
    {
        text: "Which mode of transmission the entire capacity of the channel can be utilized for each direction?", type: "multiple_choice", options: [
            { text: "Simplex", correct: false },
            { text: "Half duplex", correct: false },
            { text: "Full duplex", correct: true },
            { text: "all except A", correct: false }
        ]
    },
    {
        text: "If a transaction is allowed to read a data item that was produced by an uncommitted transaction, what do we call this read?", type: "multiple_choice", options: [
            { text: "Repeatable read", correct: false },
            { text: "Dirty read", correct: true },
            { text: "Phantom read", correct: false },
            { text: "Conflict read", correct: false }
        ]
    },
    {
        text: "_________is s a problem which occurs when two transactions access the same data items concurrently and their operations interleaved.", type: "multiple_choice", options: [
            { text: "Loss Update", correct: false },
            { text: "Incorrect summery", correct: false },
            { text: "Temporary read", correct: false },
            { text: "Unrepeatable read", correct: true }
        ]
    },
    {
        text: "Which one of the following syntaxes is the correct way of defining a function in PHP?", type: "multiple_choice", options: [
            { text: "functionName(parameters) {function body}", correct: false },
            { text: "function {function body}", correct: false },
            { text: "function functionName(parameters) {function body}", correct: true },
            { text: "data type functionName(parameters) {function body}", correct: false }
        ]
    },
    {
        text: "Which of the following is not a java.util.Scanner method?", type: "multiple_choice", options: [
            { text: "nextInt()", correct: false },
            { text: "next()", correct: false },
            { text: "nextLine()", correct: false },
            { text: "nextString()", correct: true }
        ]
    },
    {
        text: "Which of the following is the default file extension of PHP?", type: "multiple_choice", options: [
            { text: ".php", correct: true },
            { text: ".hphp", correct: false },
            { text: ".xml", correct: false },
            { text: ".html", correct: false }
        ]
    },
    {
        text: "Identify false statement among the given.", type: "multiple_choice", options: [
            { text: "Several classes can be declared as sub classes of the same super class", correct: false },
            { text: "Several classes can share the same variable.", correct: false },
            { text: "When we create an object of a sub class, constructor of a subclass executed first and then constructors of super class", correct: true },
            { text: "In inheritance we can have more than one sub class", correct: false }
        ]
    },
    {
        text: "For recovery purposes, the transaction processing system not needs to keep _______________?", type: "multiple_choice", options: [
            { text: "The beginning of transaction", correct: false },
            { text: "The operation not performed", correct: true },
            { text: "The ending of the transaction", correct: false },
            { text: "Transaction status(committed/aborted)", correct: false }
        ]
    },
    {
        text: "Which of the following is true about Java static methods and instance methods?", type: "multiple_choice", options: [
            { text: "Instance methods belong to the class rather than the object of a class.", correct: false },
            { text: "Instance methods can be invoked without the need for creating an instance of a class.", correct: false },
            { text: "A static method can access static data member and can change the value of it.", correct: true },
            { text: "Static methods require an object of its class to be created before it can be called.", correct: false }
        ]
    },
    {
        text: "Which one of the following wireless transmission systems the sending and receiving antennas need not be aligned?", type: "multiple_choice", options: [
            { text: "Microwave", correct: false },
            { text: "Radio waves", correct: true },
            { text: "Infrared waves", correct: false },
            { text: "Bluetooth", correct: false }
        ]
    },
    {
        text: "Which one of the following statements is wrong about a session?", type: "multiple_choice", options: [
            { text: "It is used to make data accessible across all pages of a website", correct: false },
            { text: "echo $_SESSION['email']; is used to display the value of a session variable called email.", correct: false },
            { text: "session_start() function is used to start a session and must be there at the beginning of an index.php page of the website", correct: false },
            { text: "session_unset() function destroys all session variables", correct: true }
        ]
    },
    {
        text: "What will happen when we run the following segment of Java code? public static void main(String args[]){ int i; int []a={3,4,0,5}; for( i=3;i>=0;i--){ System.out.print(30/a[i]); System.out.print(a[i]); }", type: "multiple_choice", options: [
            { text: "Array elements 3 4 0 5 will be printed", correct: false },
            { text: "10 7 0 6 will be printed", correct: false },
            { text: "Compile Error will occur", correct: false },
            { text: "10 7 0 6 3 4 0 5 will be printed", correct: true }
        ]
    },
    {
        text: "____________means the transaction happens indivisibly; a transaction either happens completely or not at all.", type: "multiple_choice", options: [
            { text: "Isolated", correct: false },
            { text: "Atomicity", correct: true },
            { text: "Consistency", correct: false },
            { text: "Durability", correct: false }
        ]
    },
    {
        text: "Which one of the following is used for only local communication in private network?", type: "multiple_choice", options: [
            { text: "172.16.6.2", correct: false },
            { text: "10.123.16.145", correct: false },
            { text: "192.168.14.23", correct: false },
            { text: "All", correct: true }
        ]
    },
    {
        text: "Which one of the following is not an access modifier in Java?", type: "multiple_choice", options: [
            { text: "void", correct: true },
            { text: "protected", correct: false },
            { text: "public", correct: false },
            { text: "private", correct: false }
        ]
    },
    {
        text: "One of the following is not the end result of abstraction in OOP?", type: "multiple_choice", options: [
            { text: "Possible attributes", correct: false },
            { text: "Possible methods", correct: false },
            { text: "Possible class", correct: true },
            { text: "Well Organized codes", correct: false }
        ]
    },
    {
        text: "Which of the following keyword is used to refer the member of base classes from a subclass?", type: "multiple_choice", options: [
            { text: "base", correct: false },
            { text: "super", correct: true },
            { text: "this", correct: false },
            { text: "upper", correct: false }
        ]
    },
    {
        text: "______________ keyword is used to exit from Java loop statements.", type: "multiple_choice", options: [
            { text: "continue", correct: false },
            { text: "quit", correct: false },
            { text: "break", correct: true },
            { text: "exit", correct: false }
        ]
    },
    {
        text: "Concept of OOP that provides code reusability is _________", type: "multiple_choice", options: [
            { text: "Polymorphism", correct: false },
            { text: "Inheritance", correct: true },
            { text: "Encapsulation", correct: false },
            { text: "Abstraction", correct: false }
        ]
    },
    {
        text: "One of the following is true about relational database data model?", type: "multiple_choice", options: [
            { text: "Navigational nature of processing.", correct: false },
            { text: "Visualized as a linear arrangement of records", correct: false },
            { text: "Little scope for query optimization", correct: false },
            { text: "High scope of query optimization", correct: true }
        ]
    },
    {
        text: "One of the following is true statement about constructors?", type: "multiple_choice", options: [
            { text: "Constructors are methods of a given class which used to create objects", correct: true },
            { text: "Constructors are special attributes", correct: false },
            { text: "Constructors have the same name as class name and can return values", correct: false },
            { text: "A class can't have more than one constructor", correct: false }
        ]
    },
    {
        text: "Which one of the following is the correct way of creating a PHP variable?", type: "multiple_choice", options: [
            { text: "int stud_age=20;", correct: false },
            { text: "$stud-age=20;", correct: false },
            { text: "stud_age=20;", correct: false },
            { text: "$_age=20;", correct: true }
        ]
    },
    {
        text: "Choose the correct statement about Java variables.", type: "multiple_choice", options: [
            { text: "Variable names can start with a digit.", correct: false },
            { text: "Some Java keywords can be used as naming a variable", correct: false },
            { text: "Variable names can contain digits 0-9.", correct: true },
            { text: "All variables cannot be changing its value during execution", correct: false }
        ]
    },
    {
        text: "Which connectivity device packets send to all connected device at the same time?", type: "multiple_choice", options: [
            { text: "Switch", correct: false },
            { text: "router", correct: false },
            { text: "Hub", correct: true },
            { text: "Bridges", correct: false }
        ]
    },
    {
        text: "Which one of the following statements is the right way of creating a cookie called product that can only stay for 2 weeks?", type: "multiple_choice", options: [
            { text: "createcookie('product','smart phone',time()+(60*60*14),'/','localhost',0);", correct: false },
            { text: "setcookie('product','smart phone',time()+(60*60*2*24),'/','localhost',0);", correct: false },
            { text: "setcookie('product','smart phone',time()+(60*60*24*14),'/','localhost',0);", correct: true },
            { text: "setcookie('product','smart phone',time()+(60*60*24),'/','localhost',0);", correct: false }
        ]
    },
    {
        text: "Based on the above question #13, what is the broadcasting address for subnet #2?", type: "multiple_choice", options: [
            { text: "178.191.0.255", correct: false },
            { text: "178.191.255.255", correct: false },
            { text: "178.191.12.255", correct: false },
            { text: "178.191.1.255", correct: true }
        ]
    },
    {
        text: "Unshielded twisted pair cable that is used for 16 Mbps Token Ring is --------------------", type: "multiple_choice", options: [
            { text: "Category 5", correct: false },
            { text: "Category 6", correct: false },
            { text: "Category 4", correct: true },
            { text: "Category 3", correct: false }
        ]
    },
    {
        text: "Which one of the following statements is True about process state transition?", type: "multiple_choice", options: [
            { text: "If the given quantum time expired a running process can be interrupted and goes to the ready queue.", correct: false },
            { text: "When a process is created it goes to a ready state immediately.", correct: false },
            { text: "When a process successfully finished its task, it goes to a terminated state", correct: false },
            { text: "all", correct: true }
        ]
    },
    {
        text: "One of the following is/are the recovery technique from catastrophic failures?", type: "multiple_choice", options: [
            { text: "Undo", correct: false },
            { text: "Backup", correct: true },
            { text: "Redo", correct: false },
            { text: "Encryption", correct: false }
        ]
    },
    {
        text: "The built-in base class in Java, which is used to handle all exceptions is:", type: "multiple_choice", options: [
            { text: "Exception", correct: true },
            { text: "Runtime Exception", correct: false },
            { text: "Checked Exceptions", correct: false },
            { text: "Unchecked Exception", correct: false }
        ]
    },
    {
        text: "In a schedule S with two transactions T1 and T2, T1 reads the data item which was produced by T2 and T1 commits before T2 commits. In this case, the schedule S is said to be a ___________ schedule?", type: "multiple_choice", options: [
            { text: "Recoverable", correct: false },
            { text: "Conflict serializable", correct: false },
            { text: "Non-recoverable", correct: true },
            { text: "Serial", correct: false }
        ]
    },
    {
        text: "An entity that cannot stand by itself or that cannot have a record unless there is another entity to be related with it is for its existence is called?", type: "multiple_choice", options: [
            { text: "strong Entity", correct: false },
            { text: "Weak entity", correct: true },
            { text: "dependent entity", correct: false },
            { text: "Independent", correct: false }
        ]
    },
    {
        text: "Which wireless security method generates new keys each time when a client establishes connection to the router?", type: "multiple_choice", options: [
            { text: "Wi-Fi Protected Access", correct: false },
            { text: "Extensible Authentication Protocol", correct: true },
            { text: "Wired Equivalency Protocol", correct: false },
            { text: "Traffic Filtering", correct: false }
        ]
    },
    {
        text: "In which condition the finally block will not be executed?", type: "multiple_choice", options: [
            { text: "When Exception occurs and not handled", correct: false },
            { text: "When System.Exit() is called", correct: true },
            { text: "When Exception does not occur", correct: false },
            { text: "When Exception occurs and handled", correct: false }
        ]
    },
    {
        text: "If we want to develop a program to display the names of 7 days in a week, what type of Java statement can be appropriate to solve the problem?", type: "multiple_choice", options: [
            { text: "if...else if", correct: false },
            { text: "for loop", correct: true },
            { text: "nested if", correct: false },
            { text: "if...else", correct: false }
        ]
    },
    {
        text: "_______________ is a program that executes compiled Java bytecode on a specific platform.", type: "multiple_choice", options: [
            { text: "NetBeans", correct: false },
            { text: "JVM", correct: true },
            { text: "JDK", correct: false },
            { text: "JRE", correct: false }
        ]
    },
    {
        text: "Which one of the following database models under record database model category?", type: "multiple_choice", options: [
            { text: "Hierarchical Database Model", correct: false },
            { text: "Network Database Model", correct: false },
            { text: "Relational Database Model", correct: false },
            { text: "all of them", correct: true }
        ]
    },
    {
        text: "Which of the following is correct way of inheriting interface A by class B?", type: "multiple_choice", options: [
            { text: "interface A implements B {}", correct: false },
            { text: "class B implements A {}", correct: true },
            { text: "class B extends A {}", correct: false },
            { text: "interface B extends A {}", correct: false }
        ]
    },

    // FILE 2: 1exit.docx (Questions 1-100)
    {
        text: "_____________ determines the extent to which individual nodes or DBs in a connected DDB can operate independently.", type: "multiple_choice", options: [
            { text: "Transparency", correct: false },
            { text: "tolerance", correct: false },
            { text: "autonomy", correct: true },
            { text: "scalability", correct: false }
        ]
    },
    {
        text: "In relational databases, _____________ values indicate unknown, missing, or nonapplicable data.", type: "multiple_choice", options: [
            { text: "primary key", correct: false },
            { text: "Foreign key", correct: false },
            { text: "Default", correct: false },
            { text: "Null", correct: true }
        ]
    },
    {
        text: "What is the term used to describe the process of assigning each fragment or copy of a fragment to a particular site in a distributed system?", type: "multiple_choice", options: [
            { text: "Data normalization", correct: false },
            { text: "Data distribution (or data allocation)", correct: true },
            { text: "Replication schema", correct: false },
            { text: "Partial replication", correct: false }
        ]
    },
    {
        text: "In which type of distributed concurrency control based on a distinguished copy of a Data Item does all distinguished copies kept at the same site.", type: "multiple_choice", options: [
            { text: "Particular copy of each data item designated as distinguished copy", correct: false },
            { text: "Primary site technique", correct: true },
            { text: "Primary site with backup site", correct: false },
            { text: "Primary copy method", correct: false }
        ]
    },
    {
        text: "_____________used to interpret the meaning of the data elements corresponding to that attribute.", type: "multiple_choice", options: [
            { text: "Relation", correct: false },
            { text: "Domain", correct: true },
            { text: "Tuple", correct: false },
            { text: "Schema", correct: false }
        ]
    },
    {
        text: "Not explicit schema-based constraints that can be expressed in the relational model", type: "multiple_choice", options: [
            { text: "Key constraints", correct: false },
            { text: "Entity integrity constraints", correct: false },
            { text: "Referential integrity constraints", correct: false },
            { text: "Application base constraint", correct: true }
        ]
    },
    {
        text: "Occurs when two transactions that access the same database items have operations interleaved", type: "multiple_choice", options: [
            { text: "The lost update problem.", correct: true },
            { text: "The temporary update problem.", correct: false },
            { text: "The incorrect summary problem.", correct: false },
            { text: "The unrepeatable read problem", correct: false }
        ]
    },
    {
        text: "_______________ is a mechanism where all the previous logs are removed from the system and stored permanently in a storage disk.", type: "multiple_choice", options: [
            { text: "Abort", correct: false },
            { text: "Commit", correct: false },
            { text: "Checkpoint", correct: true },
            { text: "Rollback", correct: false }
        ]
    },
    {
        text: "_________________ determines the requirements of end-users and develop specifications for those requirements.", type: "multiple_choice", options: [
            { text: "database administrators", correct: false },
            { text: "application programmers", correct: false },
            { text: "system analyst", correct: true },
            { text: "auditors", correct: false }
        ]
    },
    {
        text: "The SQL ALTER statement can be used to", type: "multiple_choice", options: [
            { text: "Change the table structure", correct: false },
            { text: "Change the table data", correct: true },
            { text: "Add rows to the table", correct: false },
            { text: "Delete rows from the table", correct: false }
        ]
    },
    {
        text: "Security is a typical DBMS function aims to protect databases from _________", type: "multiple_choice", options: [
            { text: "Data Visualization", correct: false },
            { text: "Unauthorized access", correct: true },
            { text: "Data loss", correct: false },
            { text: "A and B", correct: false }
        ]
    },
    {
        text: "In which type of isolation level does Transactions must acquire long duration read locks on the individual data items that they read.", type: "multiple_choice", options: [
            { text: "Serializability", correct: false },
            { text: "Read committed", correct: false },
            { text: "Read uncommitted", correct: false },
            { text: "Repeatable read", correct: true }
        ]
    },
    {
        text: "Which of the following best describes a class in object-oriented programming?", type: "multiple_choice", options: [
            { text: "A specific instance of an object with its own data and behavior.", correct: false },
            { text: "A blueprint that defines the properties and methods of similar objects.", correct: true },
            { text: "A function that performs a specific task on an object.", correct: false },
            { text: "A collection of variables that store data used by the program.", correct: false }
        ]
    },
    {
        text: "What is the principle in object-oriented programming that allows us to hide the internal implementation details of a class and only expose its functionalities through methods?", type: "multiple_choice", options: [
            { text: "Inheritance", correct: false },
            { text: "Polymorphism", correct: false },
            { text: "Encapsulation", correct: true },
            { text: "Abstraction", correct: false }
        ]
    },
    {
        text: "During a system analysis project, the team decides to create multiple models, each focusing on a specific aspect of the system. Which of the following benefits does this approach offer?", type: "multiple_choice", options: [
            { text: "It simplifies the modeling process by focusing on a single technique.", correct: false },
            { text: "It provides a more comprehensive view of the system by using different perspectives.", correct: true },
            { text: "It reduces the time required to develop the system model.", correct: false },
            { text: "It introduces unnecessary complexity and confusion for stakeholders.", correct: false }
        ]
    },
    {
        text: "An analyst is developing a model to document the different states a 'Product Order' can go through (e.g., Submitted, Processing, and Shipped). Which modeling technique is most appropriate for this scenario?", type: "multiple_choice", options: [
            { text: "Class diagram", correct: false },
            { text: "Use case diagram", correct: false },
            { text: "State diagram", correct: true },
            { text: "Sequence diagram", correct: false }
        ]
    },
    {
        text: "When analyzing user requirements for an online shopping system, you identify the need for users to be able to add items to their shopping cart and then proceed to checkout. Which UML relationship best represents the interaction between the 'Add to Cart' and 'Checkout' use cases in a use case diagram?", type: "multiple_choice", options: [
            { text: "Generalization", correct: false },
            { text: "Include", correct: false },
            { text: "Extend", correct: true },
            { text: "Association", correct: false }
        ]
    },
    {
        text: "UML (Unified Modeling Language) offers various diagrams to represent user requirements in object-oriented systems. Which of the following UML diagrams is MOST suitable for capturing the high-level interactions between users and the system?", type: "multiple_choice", options: [
            { text: "Class Diagram", correct: false },
            { text: "Sequence Diagram", correct: false },
            { text: "Activity Diagram", correct: false },
            { text: "Use Case Diagram", correct: true }
        ]
    },
    {
        text: "You're designing a state diagram for the 'Book' class in the library management system. The book can be in different states like 'Available,' 'Borrowed,' and 'Under Repair.' Which UML element would represent the transition between the 'Available' and 'Borrowed' states when a member successfully borrows the book?", type: "multiple_choice", options: [
            { text: "State", correct: false },
            { text: "Event", correct: true },
            { text: "Guard condition", correct: false },
            { text: "Action", correct: false }
        ]
    },
    {
        text: "In your class diagram for the library management system, you have a class named 'Book' with attributes like title, author, and genre. You also have a class named 'Member' with attributes like name and contact information. What type of UML relationship would you use to show that a Book can be borrowed by a member?", type: "multiple_choice", options: [
            { text: "Generalization", correct: false },
            { text: "Association", correct: true },
            { text: "Aggregation", correct: false },
            { text: "Composition", correct: false }
        ]
    },
    {
        text: "Consider a class hierarchy with interfaces and abstract classes. Which of the following statements is CORRECT about implementing polymorphism in this scenario?", type: "multiple_choice", options: [
            { text: "All concrete subclasses must override methods declared in abstract classes.", correct: false },
            { text: "Interfaces can only define abstract methods, while abstract classes can have concrete implementations.", correct: true },
            { text: "Polymorphism is achieved solely through method overloading within the same class.", correct: false },
            { text: "Interfaces promote tight coupling, allowing unrelated classes to share functionality.", correct: false }
        ]
    },
    {
        text: "When method overloading is determined?", type: "multiple_choice", options: [
            { text: "At run time", correct: false },
            { text: "At compile time", correct: true },
            { text: "At coding time", correct: false },
            { text: "At execution time", correct: false }
        ]
    },
    {
        text: "One of the following is major emphasis of Structural programming paradigm.", type: "multiple_choice", options: [
            { text: "Data structures and their manipulation.", correct: false },
            { text: "Encapsulating data and behavior within objects.", correct: false },
            { text: "Procedures and functions as the building blocks of programs.", correct: true },
            { text: "Inheritance and polymorphism for code reuse.", correct: false }
        ]
    },
    {
        text: "Which of the following statements about data structures is true regarding object-oriented programming but not structured programming?", type: "multiple_choice", options: [
            { text: "Data structures are statically allocated", correct: false },
            { text: "Data structures cannot contain objects as elements", correct: false },
            { text: "Data structures can be changed after declaration", correct: true },
            { text: "Data structures cannot be used to represent a database schema", correct: false }
        ]
    },
    {
        text: "When designing complex software systems with multiple interacting objects, what design principle is crucial for maintainability and scalability?", type: "multiple_choice", options: [
            { text: "Loose coupling, where objects interact through well-defined interfaces", correct: true },
            { text: "Code duplication to avoid unnecessary complexity.", correct: false },
            { text: "Tight coupling between objects, creating dependencies.", correct: false },
            { text: "Global variables for easy access to data across different parts of the system.", correct: false }
        ]
    },
    {
        text: "Which feature of OOP is indicated by the following code? Class Student{ int marks; } class Topper extends Student{ private int age; public topper(int age){ this.age=age; }}", type: "multiple_choice", options: [
            { text: "Encapsulation and Inheritance", correct: false },
            { text: "Inheritance and polymorphism", correct: false },
            { text: "Polymorphism", correct: false },
            { text: "Inheritance", correct: true }
        ]
    },
    {
        text: "Consider the following snippet of code, which of the following statement is correct? (Removing Stmt-1 will make the program compilable and it will print 'Base: Hello Derived')", type: "multiple_choice", options: [
            { text: "Removing Stmt-1 will make the program compilable and it will print 'Base: Hello Derived'", correct: true },
            { text: "Removing both Stmt-1 and Stmt-2 will make the program compilable and it will print 'Base: Hello Derived'", correct: false },
            { text: "Removing Stmt-2 will make the program compilable and it will print 'Hello Derived'", correct: false },
            { text: "Removing Stmt-1 will make the program compilable and it will print 'Base Derived'", correct: false }
        ]
    },
    {
        text: "Which of the following statement is INCORRECT about the Final keyword in Java?", type: "multiple_choice", options: [
            { text: "A value of Final variable cannot be changed.", correct: false },
            { text: "A Final method cannot be overridden", correct: false },
            { text: "A Final method cannot be inherited", correct: true },
            { text: "A Final class cannot be extended", correct: false }
        ]
    },
    {
        text: "Consider a program that allows users to write data to different types of files (text, CSV). You plan to use polymorphism to achieve this. Which approach best utilizes polymorphism and I/O functionality?", type: "multiple_choice", options: [
            { text: "Create a base class FileWriter with a writeData(String data) method. Subclasses like TextFileWriter and CSVFileWriter will inherit and implement specific file writing logic for their formats.", correct: false },
            { text: "Use a single FileWriter class with overloaded methods writeData(String data) for text and CSV formats.", correct: false },
            { text: "Write separate functions for writing text and CSV data.", correct: false },
            { text: "Define an interface Writable with a method writeData(String data). Implement separate classes for TextFile and CSVFile, each implementing Writable and having their own file writing logic.", correct: true }
        ]
    },
    {
        text: "Assume a class implements two interfaces, both with a method named draw(), which of the following statement is true?", type: "multiple_choice", options: [
            { text: "The class must have two separate methods named draw().", correct: false },
            { text: "The compiler throws an error due to method name conflict.", correct: false },
            { text: "The class can choose to implement only one draw() method.", correct: true },
            { text: "The class needs to explicitly specify which interface's draw() to implement.", correct: false }
        ]
    },
    {
        text: "Which of this class is used to generate an array which can increase and decrease size automatically?", type: "multiple_choice", options: [
            { text: "ArrayList()", correct: true },
            { text: "DynamicList()", correct: false },
            { text: "LinkedList()", correct: false },
            { text: "Set()", correct: false }
        ]
    },
    {
        text: "What is the use of the finalize() method in Java?", type: "multiple_choice", options: [
            { text: "It is used to define the object's behavior when explicitly garbage collected.", correct: false },
            { text: "It is called by the garbage collector before an object is reclaimed.", correct: true },
            { text: "It allows for manual memory management.", correct: false },
            { text: "It is called by the constructor of the class.", correct: false }
        ]
    },
    {
        text: "What will happen if two thread of the same priority are called to be processed simultaneously?", type: "multiple_choice", options: [
            { text: "Anyone will be executed first lexographically", correct: false },
            { text: "Both of them will be executed simultaneously", correct: false },
            { text: "None of them will be executed", correct: false },
            { text: "It is dependent on the operating system", correct: true }
        ]
    },
    {
        text: "What is the output of the following program? (Arrays.fill with 8)", type: "multiple_choice", options: [
            { text: "58881", correct: true },
            { text: "12885", correct: false },
            { text: "12845", correct: false },
            { text: "54881", correct: false }
        ]
    },
    {
        text: "What will be the output of the following Java program? (exception handling with args.length)", type: "multiple_choice", options: [
            { text: "A", correct: false },
            { text: "Compilation Error", correct: false },
            { text: "AB", correct: true },
            { text: "Runtime Error", correct: false }
        ]
    },
    {
        text: "What will be the output of the following? (multithreaded program)", type: "multiple_choice", options: [
            { text: "Prints 012", correct: true },
            { text: "Prints 012 and then lead to a Runtime Error", correct: false },
            { text: "Compilation Error", correct: false },
            { text: "Nothing will be displayed", correct: false }
        ]
    },
    {
        text: "Which of the following languages is primarily used for client-side scripting in web development?", type: "multiple_choice", options: [
            { text: "Python", correct: false },
            { text: "Java", correct: false },
            { text: "JavaScript", correct: true },
            { text: "C++", correct: false }
        ]
    },
    {
        text: "What is the primary purpose of HyperText Markup Language (HTML) in web development?", type: "multiple_choice", options: [
            { text: "To add interactivity to web pages", correct: false },
            { text: "To define the structure and content of web pages", correct: true },
            { text: "To handle communication between server and client", correct: false },
            { text: "To create animations and graphics", correct: false }
        ]
    },
    {
        text: "When encountering a JavaScript error message, the first step in debugging should be:", type: "multiple_choice", options: [
            { text: "Ignoring the error and hoping it goes away", correct: false },
            { text: "Reading the error message carefully and identifying the line causing the issue", correct: true },
            { text: "Re-writing the entire code from scratch", correct: false },
            { text: "Searching online for generic solutions without understanding the context", correct: false }
        ]
    },
    {
        text: "Security is a major concern when handling user data on an e-commerce website. Which of the following is NOT a recommended practice?", type: "multiple_choice", options: [
            { text: "Validating user input on the client-side to prevent malicious code injection", correct: true },
            { text: "Encrypting sensitive data like credit card and session information on the server-side", correct: false },
            { text: "Using secure protocols like HTTPS for communication", correct: false }
        ]
    },
    {
        text: "You're building a web application that allows users to register. On the server-side (using a language like PHP), how would you ensure a username is unique before storing it in the database?", type: "multiple_choice", options: [
            { text: "Use JavaScript to check for uniqueness before submitting the form", correct: false },
            { text: "Write server-side code to query the database for existing usernames before storing the new one.", correct: true },
            { text: "rely on the database to handle duplicate entries automatically.", correct: false },
            { text: "There's no way to guarantee uniqueness in a web application.", correct: false }
        ]
    },
    {
        text: "A user submits a form on your website. Which combination of technologies best represents how the form data would be processed for server-side validation and storage?", type: "multiple_choice", options: [
            { text: "Client-side validation with JavaScript and server-side processing using HTML forms.", correct: true },
            { text: "Only client-side validation with JavaScript for a more responsive experience.", correct: false },
            { text: "Only server-side validation to avoid user manipulation of data.", correct: false },
            { text: "Client-side validation with JavaScript, but storing data directly in the browser for security reasons.", correct: false }
        ]
    },
    {
        text: "A user clicks a button on your webpage. How can you use client-side scripting (JavaScript) to enhance the user experience without requiring a full page reload?", type: "multiple_choice", options: [
            { text: "The button should submit a form to the server for processing.", correct: false },
            { text: "Use JavaScript to handle the button click event and perform actions like displaying animations or updating content dynamically on the page.", correct: false },
            { text: "Re-render the entire page using JavaScript to simulate interactivity.", correct: true },
            { text: "Client-side scripting cannot handle button clicks without server interaction.", correct: false }
        ]
    },
    {
        text: "You're designing a website for a local museum with a vast collection of artifacts. Users should be able to search for specific artifacts based on criteria like category, date, or artist. Which approach would be most effective in managing this content for efficient searching and display?", type: "multiple_choice", options: [
            { text: "Create individual web pages for each artifact, making searching cumbersome.", correct: false },
            { text: "Store all artifact information in a single, long webpage, leading to poor user experience.", correct: false },
            { text: "Develop a database to store artifact information and use server-side scripting to dynamically generate search results and detailed pages for each artifact.", correct: true },
            { text: "Rely solely on client-side search functionality within the browser for efficiency.", correct: false }
        ]
    },
    {
        text: "A client wants a website showcasing their photography portfolio. They have hundreds of high-resolution images. How would you optimize the website's content management and user experience for these images?", type: "multiple_choice", options: [
            { text: "Display all images in full resolution on a single page, potentially causing slow loading times.", correct: false },
            { text: "Use a single, large image file containing all photos.", correct: false },
            { text: "Implement a database to manage image information and utilize thumbnails for browsing with options to view full-size versions on demand.", correct: true },
            { text: "Upload all images directly into HTML code.", correct: false }
        ]
    },
    {
        text: "You're tasked with creating a website for a news organization with daily content updates. How would you ensure efficient content management and user experience for readers?", type: "multiple_choice", options: [
            { text: "Create static HTML pages for each news article, requiring manual updates for new content.", correct: false },
            { text: "Develop a content management system (CMS) allowing for easy content creation, editing, and organization for a dynamic website.", correct: true },
            { text: "Rely on users to submit news articles directly through HTML forms, leading to potential quality and security issues.", correct: false },
            { text: "Use a single, long webpage with all news articles listed chronologically, making navigation challenging for older content.", correct: false }
        ]
    },
    {
        text: "When designing a client-server system with multiple clients accessing the server concurrently, what concurrency control mechanism would be most effective in preventing data inconsistencies?", type: "multiple_choice", options: [
            { text: "No concurrency controls", correct: false },
            { text: "Semaphores: Signaling mechanism for controlling access to shared resources, a viable option.", correct: true },
            { text: "Cookies: Used for client-side state management.", correct: false },
            { text: "Hyperlinks: Used for linking web pages", correct: false }
        ]
    },
    {
        text: "During the evaluation phase of a client-server system, you identify performance bottlenecks. Which approach is the MOST effective for analyzing and improving concurrency issues?", type: "multiple_choice", options: [
            { text: "Increase server hardware resources without understanding the root cause of the problem.", correct: false },
            { text: "Use profiling tools to identify sections of code causing concurrency bottlenecks and optimize them.", correct: true },
            { text: "Limit the number of concurrent clients accessing the server, potentially impacting user experience.", correct: false },
            { text: "Rewrite the entire system from scratch without a clear understanding of the existing issues.", correct: false }
        ]
    },
    {
        text: "When designing the communication protocol for a client-server system, which element is MOST crucial for ensuring data integrity and security?", type: "multiple_choice", options: [
            { text: "Using clear and concise language in the protocol specifications.", correct: false },
            { text: "Defining the format and structure of data messages.", correct: false },
            { text: "Implementing data encryption and authentication mechanisms to protect sensitive information.", correct: true },
            { text: "Specifying error codes for various communication failures.", correct: false }
        ]
    },
    {
        text: "One of the following is the main process of quality management to identifying which quality standards are relevant to the project and how to satisfy them; a metric is a standard of measurement.", type: "multiple_choice", options: [
            { text: "Planning quality", correct: true },
            { text: "Quality assurance", correct: false },
            { text: "Perform quality control", correct: false },
            { text: "Statistical analysis", correct: false }
        ]
    },
    {
        text: "As a project manager, Dawit is so happy that all expected project the deliverables have been accomplished of his project team. What is the next step for his project to proceed in order to verify the project scope by his project client?", type: "multiple_choice", options: [
            { text: "Ask his client to pay for the completed project deliverables.", correct: false },
            { text: "Award all of his project team members for such a great accomplishment.", correct: false },
            { text: "Offer a party for his project team and client to celebrate the success of the project.", correct: false },
            { text: "Ask his client to conduct an inspection on all of the completed project deliverables.", correct: true }
        ]
    },
    {
        text: "As a project manager, you would identify new risks in which of the following main processes of risk management?", type: "multiple_choice", options: [
            { text: "Risks Response", correct: false },
            { text: "Risk Identification", correct: false },
            { text: "Qualitative Risk Analysis", correct: false },
            { text: "Risks Monitor and control", correct: true }
        ]
    },
    {
        text: "What is the purpose of a project charter in software development?", type: "multiple_choice", options: [
            { text: "To document the resources and budget for a project", correct: false },
            { text: "To define the scope, objectives, and stakeholders of a project", correct: true },
            { text: "To identify and mitigate risks associated with a project", correct: false },
            { text: "To schedule the tasks required for a project", correct: false }
        ]
    },
    {
        text: "While assessing your project processes for quality tools, you have identified some uncontrolled random or non-random process variations. Which of the following would be the appropriate chart you may use for this purpose?", type: "multiple_choice", options: [
            { text: "Pareto diagram", correct: false },
            { text: "PERT chart", correct: false },
            { text: "Control chart", correct: true },
            { text: "HR personnel chart", correct: false }
        ]
    },
    {
        text: "A company has a network address of 192.168.1.64 with a subnet mask of 255.255.255.192. The company wants to create two subnetworks that would contain 10 hosts and 18 hosts respectively. Which two networks would achieve that?", type: "multiple_choice", options: [
            { text: "192.168.1.16/28 and 192.168.1.64/27", correct: true },
            { text: "192.168.1.64/27 and 192.168.1.128/27", correct: false },
            { text: "192.168.1.64/27 and 192.168.1.96/28", correct: false },
            { text: "192.168.1.96/28 and 192.168.1.192/28", correct: false }
        ]
    },
    {
        text: "Which layer in the TCP/IP model is used for formatting, compressing, and encrypting data?", type: "multiple_choice", options: [
            { text: "Internetwork", correct: false },
            { text: "Session", correct: false },
            { text: "Application", correct: true },
            { text: "Presentation", correct: false }
        ]
    },
    {
        text: "When is UDP (user datagram protocol) preferred over TCP (Transmission Control Protocol)?", type: "multiple_choice", options: [
            { text: "When a client sends a segment to a server", correct: false },
            { text: "When all the data must be fully received before any part of it is considered useful", correct: false },
            { text: "When an application can tolerate some loss of data during transmission", correct: true },
            { text: "When segments must arrive in a very specific sequence to be processed successfully", correct: false }
        ]
    },
    {
        text: "Which two flags in the TCP header are used in a TCP three-way handshake to establish connectivity between two network devices?", type: "multiple_choice", options: [
            { text: "ACK and SYN", correct: true },
            { text: "PSH and RST", correct: false },
            { text: "ACK and FIN", correct: false },
            { text: "SYN and URG", correct: false }
        ]
    },
    {
        text: "A web client is sending a request for a webpage to a web server. From the perspective of the client, what is the correct order of the protocol stack that is used to prepare the request for transmission?", type: "multiple_choice", options: [
            { text: "HTTP, IP, TCP, Ethernet", correct: false },
            { text: "HTTP, TCP, IP, Ethernet", correct: true },
            { text: "Ethernet, TCP, IP, HTTP", correct: false },
            { text: "Ethernet, IP, TCP, HTTP", correct: false }
        ]
    },
    {
        text: "What command can be used on a windows PC to see the IP configuration of that computer?", type: "multiple_choice", options: [
            { text: "ping", correct: true },
            { text: "ipconfig", correct: false },
            { text: "show interfaces", correct: false },
            { text: "show ip interface brief", correct: false }
        ]
    },
    {
        text: "Which of the following guided transmission media is best suited for high-speed, long-distance communication?", type: "multiple_choice", options: [
            { text: "Coaxial Cable", correct: false },
            { text: "Twisted Pair Cable", correct: false },
            { text: "Satellite", correct: false },
            { text: "Fiber Optic", correct: true }
        ]
    },
    {
        text: "What method can be used by two computers to ensure that packets are not dropped because too much data is being sent too quickly?", type: "multiple_choice", options: [
            { text: "Encapsulation", correct: true },
            { text: "Flow control", correct: false },
            { text: "Access method", correct: false },
            { text: "Response timeout", correct: false }
        ]
    },
    {
        text: "What benefit does DHCP provides for a given network?", type: "multiple_choice", options: [
            { text: "Hosts always have the same IP address and are therefore always reachable.", correct: false },
            { text: "DHCP allows users to refer to locations by a name rather than an IP address.", correct: false },
            { text: "Hosts can connect to the network and get an IP address without manual configuration.", correct: true },
            { text: "Duplicate addresses cannot occur on a network that issues dynamic addresses using DHCP and has static assignments.", correct: false }
        ]
    },
    {
        text: "Refer to the exhibit. A network administrator is configuring the MOTD on Multi-switch SW2. What is the purpose of this command?", type: "multiple_choice", options: [
            { text: "To display a message when a user accesses the switch", correct: true },
            { text: "To configure switch SW2 so that only the users in the admin group can telnet into SW2", correct: false },
            { text: "To force users of the admin group to enter a password for authentication", correct: false },
            { text: "To configure switch SW2 so that the message will display when a user enters the enable command", correct: false }
        ]
    },
    {
        text: "Which device performs the function of determining the path that messages should take through internetworks?", type: "multiple_choice", options: [
            { text: "A router", correct: true },
            { text: "A firewall", correct: false },
            { text: "A web server", correct: false },
            { text: "A DSL modems", correct: false }
        ]
    },
    {
        text: "Why router-on-stick method is recommended inter-VLAN communication in the contemporary network?", type: "multiple_choice", options: [
            { text: "Because a single router interface is assigned for a single VLAN as a default gateway.", correct: false },
            { text: "Because a single router interface is assigned for a multiple VLAN by using IEEE 802.1q.", correct: true },
            { text: "Because multiple router interface is assigned for a single VLAN as a backup path.", correct: false },
            { text: "Because multiple router interface is assigned for a single VLAN by using encapsulation dot1q.", correct: false }
        ]
    },
    {
        text: "Which of the following is considered as a common network monitoring tool?", type: "multiple_choice", options: [
            { text: "Ping and traceroute", correct: false },
            { text: "SNMP and NetFlow", correct: false },
            { text: "Wireshark and tcpdump", correct: false },
            { text: "All", correct: true }
        ]
    },
    {
        text: "A network administrator configured syslog with a level 2 trap. Which of the following types of logs would be generated?", type: "multiple_choice", options: [
            { text: "Alerts, and Critical", correct: false },
            { text: "Alerts, Errors and, Emergency", correct: false },
            { text: "Critical, Alert, and Emergency", correct: true },
            { text: "Critical, Error, and Emergency", correct: false }
        ]
    },
    {
        text: "Which of the following network device used for managing a network security?", type: "multiple_choice", options: [
            { text: "Firewall", correct: true },
            { text: "Router", correct: false },
            { text: "Switch", correct: false },
            { text: "Transparent Bridge", correct: false }
        ]
    },
    {
        text: "Which command will back up the configuration that is stored in NVRAM to a TFTP server?", type: "multiple_choice", options: [
            { text: "copy running-config tftp", correct: false },
            { text: "copy tftp running-config", correct: false },
            { text: "copy startup-config tftp", correct: true },
            { text: "copy tftp startup-config", correct: false }
        ]
    },
    {
        text: "Which of the following access methods is commonly used to manage network devices when there is no direct network connectivity?", type: "multiple_choice", options: [
            { text: "Telnet", correct: false },
            { text: "SSH", correct: false },
            { text: "VPN", correct: false },
            { text: "Console", correct: true }
        ]
    },
    {
        text: "What is the purpose of Spanning Tree Protocol (STP) in a network?", type: "multiple_choice", options: [
            { text: "To prevent network loops and ensure network redundancy", correct: true },
            { text: "To route network traffic to intended destinations", correct: false },
            { text: "To encrypt network traffic for security purposes", correct: false },
            { text: "To increase network speed", correct: false }
        ]
    },
    {
        text: "Which of the following switch port modes is used to connect end devices, such as computers or printers, to a switch?", type: "multiple_choice", options: [
            { text: "Trunk mode", correct: false },
            { text: "Access mode", correct: true },
            { text: "Native mode", correct: false },
            { text: "VLAN mode", correct: false }
        ]
    },
    {
        text: "Which of the following is not part of an android main component?", type: "multiple_choice", options: [
            { text: "Activity", correct: false },
            { text: "Service", correct: false },
            { text: "Content provider", correct: false },
            { text: "Layout", correct: true }
        ]
    },
    {
        text: "Which android activity life cycle method is responsible to bring an activity to the foreground and enables user to interact with it?", type: "multiple_choice", options: [
            { text: "onCreate()", correct: false },
            { text: "onResume()", correct: true },
            { text: "onDestroy()", correct: false },
            { text: "onPause()", correct: false }
        ]
    },
    {
        text: "Which of the following code displays 'hello mock' when button bt is clicked?", type: "multiple_choice", options: [
            { text: "bt.setOnClickListener(new View.OnClickListener() { Toast.maketext(contex,'Hello mock',Toast.LENGTH_LONG).show(); @Override public void onClick(View view) {} });", correct: false },
            { text: "bt.setOnClickListener(new View.OnClickListener() { @Override public void onClick(View view) { Toast.maketext('Hello mock',contex, Toast.LENGTH_LONG).show(); } });", correct: false },
            { text: "bt.setOnClickListener(new View.OnClickListener() { @Override public void onClick(View view) { Toast.maketext(contex, 'Hello mock', Toast.LENGTH_LONG).show(); } });", correct: true },
            { text: "None", correct: false }
        ]
    },
    {
        text: "Which of the following android library is used for drawing?", type: "multiple_choice", options: [
            { text: "Media player", correct: false },
            { text: "Canvas", correct: true },
            { text: "Drawer", correct: false },
            { text: "None", correct: false }
        ]
    },
    {
        text: "Which of the following android library is used to store color information of drawing?", type: "multiple_choice", options: [
            { text: "Canvas", correct: false },
            { text: "Paint", correct: true },
            { text: "MediaEncoder", correct: false },
            { text: "None", correct: false }
        ]
    },
    {
        text: "Which one of the following android libraries is used to play audio and video?", type: "multiple_choice", options: [
            { text: "Media encoder", correct: false },
            { text: "MediaPlayer", correct: true },
            { text: "Audioplayer", correct: false },
            { text: "VideoPlayer", correct: false }
        ]
    },
    {
        text: "Which one of the following is not true about android studio architecture?", type: "multiple_choice", options: [
            { text: "Drawable folder is found in res folder", correct: false },
            { text: "Color is stored in values folder", correct: false },
            { text: "Java file is placed in res folder", correct: true },
            { text: "Java file and resource is placed in main folder", correct: false }
        ]
    },
    {
        text: "Which one of the following widgets is suitable to display data from an adapter or an array?", type: "multiple_choice", options: [
            { text: "Textview", correct: false },
            { text: "Imageview", correct: false },
            { text: "Listview", correct: true },
            { text: "Edittext", correct: false }
        ]
    },
    {
        text: "Which of the following is a method for managing network devices that involves grouping them based on their function or location?", type: "multiple_choice", options: [
            { text: "NAT", correct: false },
            { text: "VPN", correct: false },
            { text: "DMZ", correct: false },
            { text: "VLAN", correct: true }
        ]
    },
    {
        text: "Which of the following is a method for granting a user administrative privilege in Windows?", type: "multiple_choice", options: [
            { text: "Adding them to the Administrators group", correct: true },
            { text: "Changing their password", correct: false },
            { text: "Enabling Remote Desktop", correct: false },
            { text: "None of the above", correct: false }
        ]
    },
    {
        text: "Which of the following is a method for managing group membership in Linux?", type: "multiple_choice", options: [
            { text: "Using the groupmod command", correct: false },
            { text: "Using the usermod command", correct: true },
            { text: "Using the passwd command", correct: false },
            { text: "Using the chown command", correct: false }
        ]
    },
    {
        text: "Which of the following is a method for restoring a system image backup in Windows?", type: "multiple_choice", options: [
            { text: "Using the System Configuration tool", correct: false },
            { text: "Using the System Restore feature", correct: false },
            { text: "Using the Command Prompt", correct: false },
            { text: "Using the Backup and Restore tool", correct: true }
        ]
    },
    {
        text: "Which of the following is a tool used for remotely administering a Windows computer?", type: "multiple_choice", options: [
            { text: "Remote Desktop Connection", correct: true },
            { text: "Terminal", correct: false },
            { text: "SSH", correct: false },
            { text: "Telnet", correct: false }
        ]
    },
    {
        text: "If you make Flaw in your system design, implementation or deployment that could be exploit the given information security police is known as _________?", type: "multiple_choice", options: [
            { text: "Security policy", correct: false },
            { text: "Threat", correct: false },
            { text: "Attack", correct: false },
            { text: "Vulnerability", correct: true }
        ]
    },
    {
        text: "Which of the following threat/attack may be made the network is unavailable for a user?", type: "multiple_choice", options: [
            { text: "Reconnaissance", correct: false },
            { text: "Denial of Service", correct: true },
            { text: "Man-in-the-middle", correct: false },
            { text: "Direct-access", correct: false }
        ]
    },
    {
        text: "If certain organization /company stated as every 'employee must change/update his or her password within every 6 days'. This statement is an example of?", type: "multiple_choice", options: [
            { text: "Security requirement", correct: false },
            { text: "Security control", correct: false },
            { text: "Security policy", correct: true },
            { text: "Security objective", correct: false }
        ]
    },
    {
        text: "Which of the following bus slot provides the highest video performance?", type: "multiple_choice", options: [
            { text: "PCI", correct: false },
            { text: "SCSI", correct: false },
            { text: "AGP", correct: true },
            { text: "PCI-e", correct: false }
        ]
    },
    {
        text: "Your client wants to buy laptops that can be expanded with additional ports not found in the base unit. The types of laptops your client is considering are designed to use which of the following?", type: "multiple_choice", options: [
            { text: "Port replicator", correct: false },
            { text: "USB hub", correct: false },
            { text: "Mobile PCI Express Module", correct: false },
            { text: "Docking station", correct: true }
        ]
    },
    {
        text: "What is a recommended method of preventing overheating in a computer system?", type: "multiple_choice", options: [
            { text: "Regularly defragmenting the hard drive", correct: false },
            { text: "Ensuring proper ventilation and cleaning dust off the system fans", correct: true },
            { text: "Installing a high-quality antivirus program", correct: false },
            { text: "Upgrading the RAM", correct: false }
        ]
    },
    {
        text: "Which component of a computer is responsible for sending visual output to a monitor or other display device?", type: "multiple_choice", options: [
            { text: "Graphics Card", correct: true },
            { text: "CPU", correct: false },
            { text: "Motherboard", correct: false },
            { text: "Power Supply Unit", correct: false }
        ]
    },
    {
        text: "A fire extinguisher that is suitable for combustible metals.", type: "multiple_choice", options: [
            { text: "Class A", correct: false },
            { text: "Class B", correct: false },
            { text: "Class ABC", correct: false },
            { text: "Class D", correct: true }
        ]
    },
    {
        text: "Which password is used in the BIOS(CMOS) to prevent end users from accessing the BIOS content?", type: "multiple_choice", options: [
            { text: "System", correct: true },
            { text: "User", correct: false },
            { text: "Administrator", correct: false },
            { text: "Local", correct: false }
        ]
    },
    {
        text: "What is the proper code to put data into the dataset called CustomerDataset using the CustomerDataAdapter object?", type: "multiple_choice", options: [
            { text: "CustomerDataset.Fill(CustomerDataAdapter)", correct: false },
            { text: "CustomerDataAdapter.Fill(CustomerDataset)", correct: true },
            { text: "CustomerDataset.Load(CustomerDataAdapter)", correct: false },
            { text: "CustomerDataAdapter.Load(CustomerDataset)", correct: false }
        ]
    },
    {
        text: "What is the key difference between standard programming and event-driven programming?", type: "multiple_choice", options: [
            { text: "Standard programming only works with text-based interfaces", correct: false },
            { text: "Event-driven programming doesn't require user input", correct: false },
            { text: "Standard programming is faster than event-driven programming", correct: false },
            { text: "Event-driven programming relies on the actions of the user", correct: true }
        ]
    },
    {
        text: "You want to perform a case-insensitive string comparison in VB.NET. Which of the following options would you choose?", type: "multiple_choice", options: [
            { text: "Use the StrComp function with a comparison type of vbTextCompare", correct: false },
            { text: "Use the = operator with the ComparisonOption.IgnoreCase option", correct: false },
            { text: "Use the Compare method with a StringComparison type of OrdinalIgnoreCase", correct: true },
            { text: "You cannot perform case-insensitive string comparison in VB.NET", correct: false }
        ]
    },
    {
        text: "Which of the following is an example of an event-driven application in VB.NET?", type: "multiple_choice", options: [
            { text: "A calculator program that uses a console interface", correct: false },
            { text: "A web scraper that runs automatically on a schedule", correct: false },
            { text: "A video game that allows the player to move a character using arrow keys", correct: true },
            { text: "A batch processing script that runs in the background on a remote server.", correct: false }
        ]
    },
    {
        text: "Which type of VB.NET control would you use to display a table of data?", type: "multiple_choice", options: [
            { text: "DataGridView", correct: true },
            { text: "ListBox", correct: false },
            { text: "TreeView", correct: false },
            { text: "TextBox", correct: false }
        ]
    },

    // FILE 2: 2exit.docx (Questions 1-100)
    {
        text: "Which one of the following is not the correct mapping of the Dot Net Data Provider?", type: "multiple_choice", options: [
            { text: "Data Provider for SQL Server-> System.Data.MySqlClient", correct: true },
            { text: "Data Provider for Oracle->System.Data.OracleClient", correct: false },
            { text: "Data Provider for OLEDB->System.Data.OleDb", correct: false },
            { text: "Data Provider for ODBC->System.Data.Odbc", correct: false }
        ]
    },
    {
        text: "When we use the MySqlConnection object to retrieve, insert, update and delete data in database connectivity in ADO.NET?", type: "multiple_choice", options: [
            { text: "When we want to connect to the Oracle database.", correct: false },
            { text: "When we want to connect to the Sql server database", correct: false },
            { text: "When we want to connect to Microsoft Access database", correct: false },
            { text: "When we want to connect to the MySql server database", correct: true }
        ]
    },
    {
        text: "Which method is used, when you want to perform an Insert, Update or Delete operation and the return type is Object and we can cast it to any type the object?", type: "multiple_choice", options: [
            { text: "ExecuteScalar()", correct: false },
            { text: "ExecuteReader()", correct: false },
            { text: "ExecuteNonQuery()", correct: true },
            { text: "ExecuteQuery()", correct: false }
        ]
    },
    {
        text: "Which one of the following use when a method wants to return more than one value?", type: "multiple_choice", options: [
            { text: "Value parameter", correct: false },
            { text: "reference parameter", correct: false },
            { text: "Out parameter", correct: true },
            { text: "Array parameter", correct: false }
        ]
    },
    {
        text: "What is the output of the following C# program after expected (run)? (++a * ++a with a=10)", type: "multiple_choice", options: [
            { text: "121", correct: false },
            { text: "144", correct: false },
            { text: "132", correct: true },
            { text: "100", correct: false }
        ]
    },
    {
        text: "What is the output of the following C# program after expected (run)? (switch with a=10)", type: "multiple_choice", options: [
            { text: "10", correct: true },
            { text: "510", correct: false },
            { text: "5100", correct: false },
            { text: "100", correct: false }
        ]
    },
    {
        text: "How many times 'Hello' is printed? (for loop with i=5 condition)", type: "multiple_choice", options: [
            { text: "5", correct: false },
            { text: "4", correct: false },
            { text: "2", correct: false },
            { text: "1", correct: true }
        ]
    },
    {
        text: "Which pillars of OOP is nothing but hiding the internal detail of the methods?", type: "multiple_choice", options: [
            { text: "Encapsulation", correct: false },
            { text: "Abstraction", correct: true },
            { text: "Inheritance", correct: false },
            { text: "Polymorphism", correct: false }
        ]
    },
    {
        text: "Which type of inheritance does not supported by Java?", type: "multiple_choice", options: [
            { text: "Single inheritance", correct: false },
            { text: "Multiple inheritances", correct: true },
            { text: "Hierarchical inheritance", correct: false },
            { text: "Hybrid Inheritance", correct: false }
        ]
    },
    {
        text: "Which pillars of OOP is nothing but one task performs in different way?", type: "multiple_choice", options: [
            { text: "Polymorphism", correct: true },
            { text: "Inheritance", correct: false },
            { text: "Abstraction", correct: false },
            { text: "Encapsulation", correct: false }
        ]
    },
    {
        text: "When we have Student table which have firstName, surName, gender, studId and cgpa attributes on Haramaya database. And also, the table has 10 rows data that stored on Student tables. Since, we need to fetch data from our database Student table so, which one of the following java.sql class used to store the data that fetched from our database table?", type: "multiple_choice", options: [
            { text: "Statement", correct: false },
            { text: "StatemetSets", correct: false },
            { text: "Result", correct: false },
            { text: "ResultSet", correct: true }
        ]
    },
    {
        text: "JDBC drivers are an interface that enables you to open database connections and to interact with it by sending SQL or database commands then receiving results with Java. Therefore which JDBC driver is 100% pure Java driver that is also called a thin drive and it requests directly to the database using its native protocol?", type: "multiple_choice", options: [
            { text: "Type IV driver", correct: true },
            { text: "Type I driver", correct: false },
            { text: "Type III driver", correct: false },
            { text: "Type II driver", correct: false }
        ]
    },
    {
        text: "If you want to use your JDBC driver you must first register it with the DriverManager object. According to driver loading aspects, which one of the following is not correct about driver loading to connecting the respective data source?", type: "multiple_choice", options: [
            { text: "The Class.forName('sun.jdbc.odbc.JdbcOdbcDriver') driver loading is used to connecting to Microsoft Access database", correct: false },
            { text: "The Class.forName('com.cloudscape.core.JDBCDriver') driver loading is used to connecting to Cloudscape database", correct: false },
            { text: "The Class.forName('com.mysql.jdbc.Driver') driver loading is used to connecting to SQL server database", correct: true },
            { text: "The Class.forName('oracle.jdbc.driver.OracleDriver') driver loading is used to connecting to oracle database", correct: false }
        ]
    },
    {
        text: "The Java Database Connectivity (JDBC) API provides universal data access from the Java programming language. Which of the following class/interface is used to Precompiling SQL statements to avoid repeated compiling of the same SQL statement?", type: "multiple_choice", options: [
            { text: "ResultSet", correct: false },
            { text: "DriverManager", correct: false },
            { text: "Statement", correct: false },
            { text: "PrepareStatement", correct: true }
        ]
    },
    {
        text: "Which one of the following is primitive data type?", type: "multiple_choice", options: [
            { text: "Integer", correct: true },
            { text: "Array", correct: false },
            { text: "Class", correct: false },
            { text: "List", correct: false },
            { text: "None", correct: false }
        ]
    },
    {
        text: "Which one of the following correct sequences of execute and interpreted in java?", type: "multiple_choice", options: [
            { text: "Class loaded -> Default constructor -> static variables -> non static variables and methods", correct: false },
            { text: "Main method -> Class loaded -> Parameterized constructor", correct: false },
            { text: "Class loaded -> static variables and methods -> constructor -> non static variables and methods", correct: true },
            { text: "Class loaded -> Instance Variables -> constructor -> non static variables and methods", correct: false },
            { text: "A and C", correct: false },
            { text: "C and D", correct: false }
        ]
    },
    {
        text: "Which of the following compiler generates the stub and skeleton object from the remote Interface?", type: "multiple_choice", options: [
            { text: "javac", correct: false },
            { text: "javarmic", correct: false },
            { text: "rmi", correct: false },
            { text: "rmic", correct: true },
            { text: "None", correct: false }
        ]
    },
    {
        text: "Which one of the following is Not True about the functionality of Skeleton objects in Remote method Invocation System?", type: "multiple_choice", options: [
            { text: "Is an object act as getaway for the client side", correct: true },
            { text: "It read the parameter for the remote method and Unmarshals it", correct: false },
            { text: "It communicate directly with the stub objects", correct: false },
            { text: "All the incoming requests are routed through it.", correct: false },
            { text: "A and C", correct: false },
            { text: "A and D", correct: false }
        ]
    },
    {
        text: "In desktop application, which of the following is/are the basis to contain other user interface components like Label, Button, text Fields etc. in java Graphical User Interface (GUI) that is not contained another window.", type: "multiple_choice", options: [
            { text: "Panel", correct: true },
            { text: "Frame", correct: false },
            { text: "java.awt", correct: false },
            { text: "javax.wing", correct: false },
            { text: "all", correct: false }
        ]
    },
    {
        text: "When we need to display 'Hello GUI' text on the content of our Graphical User Interface, so which one of the following is correct?", type: "multiple_choice", options: [
            { text: "new Jframe('Hello GUI')", correct: false },
            { text: "JFrame frame = new JFrame('Hello GUI')", correct: false },
            { text: "frame.setText('Hello GUI')", correct: false },
            { text: "A and B", correct: true },
            { text: "All", correct: false }
        ]
    },
    {
        text: "Which of the following is server side gateway which writes and transmits the response to the client machine?", type: "multiple_choice", options: [
            { text: "remote Object", correct: false },
            { text: "stub", correct: false },
            { text: "skeleton", correct: true },
            { text: "rmic", correct: false },
            { text: "All", correct: false }
        ]
    },
    {
        text: "Which operating system is advantageous for corporate customers since it allows synchronization with Microsoft Exchange, Novell GroupWise email, Lotus Domino, and other business software?", type: "multiple_choice", options: [
            { text: "BlackBerry OS", correct: true },
            { text: "Symbian OS", correct: false },
            { text: "Harmony OS", correct: false },
            { text: "Bada OS", correct: false }
        ]
    },
    {
        text: "An automated build system, with which we can define a build configuration that applies to all modules in our application?", type: "multiple_choice", options: [
            { text: "OpenGl", correct: false },
            { text: "Android Runtime", correct: false },
            { text: "Gradle", correct: true },
            { text: "Manifests", correct: false }
        ]
    },
    {
        text: "Which of the following does not involve developing a mobile app strategy to determine how your organization might benefit from one during the mobile app development process?", type: "multiple_choice", options: [
            { text: "Determine the target audience for your app.", correct: false },
            { text: "Examine the competition.", correct: false },
            { text: "Establish the app's aims and objectives.", correct: false },
            { text: "Identifying the talents required for your app development initiative.", correct: true }
        ]
    },
    {
        text: "Android application has go through a different stages in their life cycle. In which state activity start interacting with the user that means user can see the functionality and designing part of an application on the single screen.", type: "multiple_choice", options: [
            { text: "onCreate()", correct: false },
            { text: "onResume()", correct: true },
            { text: "onStart()", correct: false },
            { text: "onPause()", correct: false }
        ]
    },
    {
        text: "Which of the following Android components has the primary goal of ensuring that the application remains active in the background so that the user can run many applications at the same time?", type: "multiple_choice", options: [
            { text: "Service", correct: true },
            { text: "Content providers", correct: false },
            { text: "Broadcast receiver", correct: false },
            { text: "Implicit Intent", correct: false }
        ]
    },
    {
        text: "Android provides several ways to store and share data. Which of the following can be a way of storing and retrieving key-value pairs of data that can be used to store user settings or application configuration data?", type: "multiple_choice", options: [
            { text: "SQLlite", correct: false },
            { text: "Preferences", correct: true },
            { text: "Internal Storage", correct: false },
            { text: "External Storage", correct: false }
        ]
    },
    {
        text: "The Android framework provides a number of listeners, each of which has a set of callback methods. Which of the following manages an event in which the user maintains the touch over a view for an extended period of time?", type: "multiple_choice", options: [
            { text: "onTouch()", correct: false },
            { text: "onFocusChange()", correct: false },
            { text: "onLongClick()", correct: true },
            { text: "onClick()", correct: false }
        ]
    },
    {
        text: "Which one of the following methods used for selecting project in certain organization?", type: "multiple_choice", options: [
            { text: "Considering the broad need of the organization", correct: false },
            { text: "By categorizing the project based opportunity, directive and problem.", correct: false },
            { text: "Weighing score method", correct: false },
            { text: "All.", correct: true }
        ]
    },
    {
        text: "Which one of the following is the advantage of following formal project management system in project management?", type: "multiple_choice", options: [
            { text: "Bad control of financial, physical, and human resources", correct: false },
            { text: "Improved customer relations", correct: true },
            { text: "Longer development times", correct: false },
            { text: "Higher costs", correct: false }
        ]
    },
    {
        text: "Which one of the following is true?", type: "multiple_choice", options: [
            { text: "scope, time, cost, and quality are facilitating knowledge area", correct: false },
            { text: "scope, time, cost, and quality are the key knowledge area", correct: true },
            { text: "project integration management is facilitating knowledge area", correct: false },
            { text: "All.", correct: false }
        ]
    },
    {
        text: "Configuration management in the project management that includes ___________", type: "multiple_choice", options: [
            { text: "Products and their descriptions", correct: false },
            { text: "Control changes, record and report changes and audit the products to verify conformance to requirements", correct: false },
            { text: "Record and report changes, and audit the products to verify conformance to requirements.", correct: false },
            { text: "All", correct: true }
        ]
    },
    {
        text: "Which one is false about the function of Earned Value Analysis", type: "multiple_choice", options: [
            { text: "Measure a project's progress", correct: false },
            { text: "Forecast its completion date and final cost", correct: false },
            { text: "Provide schedule and budget variances along the way", correct: false },
            { text: "Having actual project information periodically is not mandatory to use EVM", correct: true }
        ]
    },
    {
        text: "In project management project team should aware of modern quality management complements in project management. Which one can be characteristics of modern quality management?", type: "multiple_choice", options: [
            { text: "Requires customer satisfaction", correct: false },
            { text: "Prefers to inspection to prevention", correct: false },
            { text: "Unaware of management responsibility for quality", correct: true },
            { text: "None.", correct: false }
        ]
    },
    {
        text: "Among described below which one of the following quality management process related with evaluating overall project performance to ensure the project will satisfy the relevant quality standards?", type: "multiple_choice", options: [
            { text: "Quality planning", correct: false },
            { text: "Quality assurance", correct: true },
            { text: "Quality control", correct: false },
            { text: "All.", correct: false }
        ]
    },
    {
        text: "Which of the following is a hierarchical database that stores information about objects on a network and makes this information available to users and administrators?", type: "multiple_choice", options: [
            { text: "Windows Registry", correct: false },
            { text: "Windows Active Directory", correct: false },
            { text: "Domain Name System (DNS)", correct: false },
            { text: "Lightweight Directory Access Protocol (LDAP)", correct: true }
        ]
    },
    {
        text: "You are setting up a new network for a small business and need to configure routing between different subnets. You want to ensure that traffic flows smoothly and securely between the subnets. Which of the following protocols is commonly used for this purpose?", type: "multiple_choice", options: [
            { text: "Border Gateway Protocol (BGP)", correct: true },
            { text: "Transmission Control Protocol (TCP)", correct: false },
            { text: "User Datagram Protocol (UDP)", correct: false },
            { text: "Internet Protocol (IP)", correct: false }
        ]
    },
    {
        text: "Which of the following types of proxies or gateways is commonly used for filtering and controlling internet access in a network?", type: "multiple_choice", options: [
            { text: "Virtual Private Network (VPN)", correct: false },
            { text: "Reverse Proxy", correct: false },
            { text: "Content Filter Proxy", correct: true },
            { text: "Load Balancer", correct: false }
        ]
    },
    {
        text: "If you are a system administrator for a small business that has multiple remote sites and you want to be able to remotely manage the servers at these sites and perform routine maintenance tasks, which of the following tools will you use?", type: "multiple_choice", options: [
            { text: "Remote Desktop Connection", correct: false },
            { text: "Virtual Private Network (VPN)", correct: false },
            { text: "Telnet", correct: true },
            { text: "File Transfer Protocol (FTP)", correct: false }
        ]
    },
    {
        text: "You are responsible for managing a Linux mail server that is used by your organization. You want to configure the server to send and receive email securely. Which of the following protocols will you use to encrypt email transmissions?", type: "multiple_choice", options: [
            { text: "SMTP", correct: false },
            { text: "POP3", correct: false },
            { text: "IMAP", correct: false },
            { text: "TLS", correct: true }
        ]
    },
    {
        text: "Which of the following is NOT a security best practice for Linux systems?", type: "multiple_choice", options: [
            { text: "Regularly updating software and security patches", correct: false },
            { text: "Disabling unnecessary network services", correct: false },
            { text: "Running processes with root privileges", correct: true },
            { text: "Configuring a firewall", correct: false }
        ]
    },
    {
        text: "Which of the following file systems is commonly used for managing storage on a Linux system?", type: "multiple_choice", options: [
            { text: "FAT32", correct: false },
            { text: "NTFS", correct: false },
            { text: "Ext4", correct: true },
            { text: "HFS+", correct: false }
        ]
    },
    {
        text: "Which of the following is false about constraints?", type: "multiple_choice", options: [
            { text: "The DEFAULT constraint defines the initial value in a column: the value that will appear if you don't insert anything.", correct: false },
            { text: "Constraints are used to enforce data integrity in a relational database.", correct: false },
            { text: "Each column in the table has a specific data type, so it's possible to insert text into a column with INT type or a decimal number into a column with BOOLEAN type data.", correct: true },
            { text: "None of the above", correct: false }
        ]
    },
    {
        text: "Which of the following is false?", type: "multiple_choice", options: [
            { text: "Formally the relational algebra and relational calculus are equivalent to each other. For every expression in the algebra, there is an equivalent expression in the calculus", correct: false },
            { text: "In non-procedural query language user instructs the system to produce the desired result without telling the step-by-step process", correct: false },
            { text: "In procedural query language, user instructs the system to perform a series of operations to produce the desired results.", correct: false },
            { text: "In non-procedural language users tell what data to be retrieved from database and how to retrieve it.", correct: true }
        ]
    },
    {
        text: "To convert ER Diagram to Relational Tables in case of one-to-many cardinality.", type: "multiple_choice", options: [
            { text: "Create a new table (which is the associative entity) and post primary key or candidate key from each entity as attributes in the new table along with some additional attributes", correct: false },
            { text: "Post the primary key or candidate key from the 'one' side as a foreign key attribute to the 'many' side.", correct: true },
            { text: "All the attributes are merged into a single table. Which means one can post the primary key or candidate key of one of the relations to the other as a foreign key.", correct: false },
            { text: "None", correct: false }
        ]
    },
    {
        text: "If a transaction transfers 100 birr from account A to account B, which is located at another site. What type of transaction is this?", type: "multiple_choice", options: [
            { text: "Global transaction", correct: true },
            { text: "Parallel transaction", correct: false },
            { text: "Local transaction", correct: false },
            { text: "None", correct: false }
        ]
    },
    {
        text: "It is a loosely-coupled architecture optimized for applications that are inherently centralized and require high availability and performance", type: "multiple_choice", options: [
            { text: "Shared nothing", correct: false },
            { text: "Parallel DBMS", correct: false },
            { text: "Shared disk", correct: true },
            { text: "Multi-database system", correct: false }
        ]
    },
    {
        text: "Where several tuples can have the same apparent key value but have different attribute values for users at different classification levels.", type: "multiple_choice", options: [
            { text: "Filtering", correct: false },
            { text: "Poly-instantiation", correct: true },
            { text: "Fragmentation", correct: false },
            { text: "Concurrency control", correct: false }
        ]
    },
    {
        text: "Which of the following is the correct ways for handling recovery?", type: "multiple_choice", options: [
            { text: "Steal/No-Force (Redo/Undo)", correct: false },
            { text: "No-Steal/Force (Undo/No-redo)", correct: true },
            { text: "Force/Steal (No-undo/Redo)", correct: false },
            { text: "No-Steal/Force (No-undo/No-redo)", correct: false }
        ]
    },
    {
        text: "Which of the following true about relation fragmentation?", type: "multiple_choice", options: [
            { text: "A vertical fragment is produced by specifying a predicate that performs a restriction on the tuples in the relation.", correct: false },
            { text: "A horizontal fragment is defined using the Projection operation of the relational algebra", correct: false },
            { text: "In vertical fragmentation all schemas must contain a common candidate key (or superkey) to ensure lossless join property", correct: true },
            { text: "Horizontal fragmentation is a subset of a relation which is created by a subset of columns.", correct: false }
        ]
    },
    {
        text: "Two operations in a schedule are said to be conflict.", type: "multiple_choice", options: [
            { text: "If the operation belongs to different transaction", correct: false },
            { text: "If the operation accesses the same data item X", correct: false },
            { text: "If at least one of the operation is a write_Item(X)", correct: false },
            { text: "All", correct: true }
        ]
    },
    {
        text: "Which of the following is false about Mandatory Access Control(MAC)", type: "multiple_choice", options: [
            { text: "MAC implements zero-trust principles with its control mechanisms.", correct: false },
            { text: "It considered the strictest of all levels of access control systems.", correct: false },
            { text: "Manual configuration of security levels and clearances requires constant attention from administrators.", correct: false },
            { text: "Users can configure data access parameters without administrators", correct: true }
        ]
    },
    {
        text: "HTML tables allow web developers to arrange data into rows and columns. Then which one of the following is true about html table?", type: "multiple_choice", options: [
            { text: "In tables, header cells are centred by default and the data cells are right-aligned.", correct: false },
            { text: "In the case of character formatting the tag <TW> is used for typewriter-like text", correct: false },
            { text: "Unordered list starts with <UL> and ends with <UL>", correct: false },
            { text: "<SUPR> tag is used for superscripts text", correct: true }
        ]
    },
    {
        text: "Application programs and computing devices are having a communication with each other by exchanging a message using a communication standard called transmission control protocol. The followings are then true about transmission control protocol except", type: "multiple_choice", options: [
            { text: "TCP organizes data so that it can be transmitted between a server and a client.", correct: false },
            { text: "It guarantees the integrity of the data being transmitted over the network", correct: false },
            { text: "Compared to user datagram protocol, transmission control protocol establishes a low latency between applications", correct: true },
            { text: "TCP can be an expensive network tool as it includes absent or corrupted packets", correct: false }
        ]
    },
    {
        text: "In a web based technology, a security vulnerability allows an attacker to inject HTML code into web pages that are viewed by other users. In order to have Confidentiality, Integrity and Availability of information, the followings are the mechanisms to be considered except", type: "multiple_choice", options: [
            { text: "HTML encryption to ensure web content cannot be accessed by unauthorized users", correct: false },
            { text: "The use of digital certificates to validate a domain and ensure the content is coming form a trusted location", correct: false },
            { text: "Encryption of content as it travels from the server to the client and back again", correct: false },
            { text: "Using a cookies both at client and server to encrpt all further communication", correct: true }
        ]
    },
    {
        text: "In JavaScript, a primitive value or data type is data that is not an object and has no methods or properties. Which one of the following is true about primitive data type?", type: "multiple_choice", options: [
            { text: "Variable used in the code doesn't exist", correct: false },
            { text: "Variable is not assigned to any value", correct: false },
            { text: "Property does not exist.", correct: false },
            { text: "All", correct: true }
        ]
    },
    {
        text: "Which one of the following is wrong about session and cookies?", type: "multiple_choice", options: [
            { text: "Session is a small file that the server is embedding on the user's computer", correct: true },
            { text: "It is recommended to check if cookie is set or not before trying to access its values", correct: false },
            { text: "Session_distroy() function is the function used to destroy a session without using any arguments", correct: false },
            { text: "None of the above", correct: false }
        ]
    },
    {
        text: "Which one of the following fragment of HTML code is the correct method to display the formula of a^2=a*b^2+c^2?", type: "multiple_choice", options: [
            { text: "<p>a=a*b<sup>2</sup>+c<sup>2</sup></p>", correct: false },
            { text: "<p>a<sup>2</sup>=a*b<sup>2</sup>+c<sup>2</sup></p>", correct: true },
            { text: "<p>a<sub>2</sub>=a*b<sub>2</sub>+c<sub>2</sub></p>", correct: false },
            { text: "<p>a<sup>2</sup>=a*<sup>b2</sup>+<sup>c2</sup></p>", correct: false }
        ]
    },
    {
        text: "The data sent by POST method goes through HTTP header so security depends on HTTP protocol. By using Secure HTTP you can make sure that your information is secure. What is $_POST?", type: "multiple_choice", options: [
            { text: "An associative array", correct: false },
            { text: "A PHP variable", correct: false },
            { text: "A data structure containing all the form variables", correct: false },
            { text: "All of the above", correct: true }
        ]
    },
    {
        text: "The web server does not know who you are or what you do when you work with an application. But there is a way to store information to be used across multiple pages without storing on users computer. So, which of the following way holds information?", type: "multiple_choice", options: [
            { text: "Session", correct: true },
            { text: "cookies", correct: false },
            { text: "Request", correct: false },
            { text: "Post", correct: false },
            { text: "All", correct: false }
        ]
    },
    {
        text: "A web browser will automatically send the cookies set by a server back to the server for all http requests to the server. Why?", type: "multiple_choice", options: [
            { text: "Otherwise, the server could never see if it set a cookie on the browser", correct: false },
            { text: "Otherwise, the server would have to send a separate request when it needed to check a cookie value", correct: false },
            { text: "The browser initiates all contact with the server, the server cannot send a request to the browser", correct: true },
            { text: "All of the above are true", correct: false }
        ]
    },
    {
        text: "Which of the following is not a PHP function used to interface with MySQL?", type: "multiple_choice", options: [
            { text: "mysql_post", correct: true },
            { text: "mysql_select_db", correct: false },
            { text: "mysql_connect", correct: false },
            { text: "mysql_query", correct: false },
            { text: "mysql_fatch_data", correct: false }
        ]
    },
    {
        text: "What is an interpreted language which is used to manage the dynamic content of the website?", type: "multiple_choice", options: [
            { text: "Server Scripting language", correct: false },
            { text: "Java Scripting Language", correct: false },
            { text: "Hypertext Preprocessor", correct: false },
            { text: "A and c", correct: true },
            { text: "A and B", correct: false },
            { text: "All", correct: false }
        ]
    },
    {
        text: "Which of the following is a symbol in PHP scripting Language, which used to perform operations on variables or values?", type: "multiple_choice", options: [
            { text: "function", correct: false },
            { text: "variable", correct: false },
            { text: "Operation", correct: false },
            { text: "operators", correct: true },
            { text: "All", correct: false },
            { text: "None", correct: false }
        ]
    },
    {
        text: "Which of the following method used to open a file using PHP scripting language?", type: "multiple_choice", options: [
            { text: "openfile()", correct: false },
            { text: "fileOpen()", correct: false },
            { text: "openf()", correct: false },
            { text: "fopen()", correct: true },
            { text: "All", correct: false },
            { text: "None", correct: false }
        ]
    },
    {
        text: "A security manager needs to be able to regularity determine when operating system files change what kind of tool is needed for this risk?", type: "multiple_choice", options: [
            { text: "Event logging", correct: false },
            { text: "Intrusion detection tool", correct: false },
            { text: "File system integrity monitoring tool", correct: true },
            { text: "Log analysis tool", correct: false }
        ]
    },
    {
        text: "If Transport Layer Security is used to secure data (e.g. web pages) between a client and server, TLS uses:", type: "multiple_choice", options: [
            { text: "Public key algorithms for data confidentiality and MD5 or SHA1 for data integrity.", correct: false },
            { text: "Symmetric key algorithms for key exchange and message authentication codes for authentication", correct: false },
            { text: "Message authentication codes for data integrity and symmetric key algorithms for data confidentiality.", correct: true },
            { text: "Public key algorithms for key exchange and Diffie-Hellman for data integrity.", correct: false }
        ]
    },
    {
        text: "Using symmetric key encryption to successfully provide authentication relies upon:", type: "multiple_choice", options: [
            { text: "The sender encrypting with a private key", correct: false },
            { text: "The sender encrypting with a public key", correct: false },
            { text: "The sender sending an encrypted copy of the shared secret key", correct: false },
            { text: "The recipient being able to identify messages encrypted with the wrong key", correct: true }
        ]
    },
    {
        text: "What is the best statement for taking advantage of a weakness in the security of an IT system?", type: "multiple_choice", options: [
            { text: "Threat", correct: false },
            { text: "Attack", correct: false },
            { text: "Exploit", correct: true },
            { text: "Vulnerability", correct: false }
        ]
    },
    {
        text: "If your friend want to hack contacts of your phone or E-mails and attempts to acquire your password is classified as:", type: "multiple_choice", options: [
            { text: "Spamming", correct: false },
            { text: "Bugging", correct: false },
            { text: "Spoofing", correct: false },
            { text: "Phishing", correct: true }
        ]
    },
    {
        text: "A security manager is setting up resource permission in application. The security manager has discovered that he can establish object that contains accesses control model that most closely resembles is:", type: "multiple_choice", options: [
            { text: "Access matrix", correct: false },
            { text: "Mandatory access control (MAC)", correct: false },
            { text: "Discretionary access control (DAC)", correct: false },
            { text: "Role based access control (RBAC)", correct: true }
        ]
    },
    {
        text: "A security officer has declared that information system must be certified before it can be used. This is belongs for:", type: "multiple_choice", options: [
            { text: "The system must be evaluated according to established evaluation criteria", correct: true },
            { text: "A formal management decision is required before the system can be used", correct: false },
            { text: "Penetration tests must be performed against the system", correct: false },
            { text: "A code review must be performed against the system", correct: false }
        ]
    },
    {
        text: "Which memory is known by the name cache memory?", type: "multiple_choice", options: [
            { text: "Dynamic random access memory (DRAM)", correct: false },
            { text: "Static random Access memory (SRAM)", correct: true },
            { text: "Programmable read only memory (PROM)", correct: false },
            { text: "Electric erasable read only memory (EEROM)", correct: false }
        ]
    },
    {
        text: "An instrument that allows a laptop computer to be more like a desktop system.", type: "multiple_choice", options: [
            { text: "Printer", correct: false },
            { text: "Docking station", correct: true },
            { text: "Ultra power saver", correct: false },
            { text: "Router", correct: false }
        ]
    },
    {
        text: "One of the following is incorrect about performing computer components cleaning (preventive maintenance).", type: "multiple_choice", options: [
            { text: "Using denatured alcohol for cleaning rubber rollers, such as those found inside printers", correct: false },
            { text: "Using Urethane swabs to clean between the keys on a keyboard.", correct: false },
            { text: "Spraying or pour liquid on computer components.", correct: true },
            { text: "Power off and unplug the computer power before performing preventive maintenance.", correct: false }
        ]
    },
    {
        text: "_________________is a method of using hard disk space as if it were RAM.", type: "multiple_choice", options: [
            { text: "Random access memory", correct: false },
            { text: "Virtual memory", correct: true },
            { text: "Cache memory", correct: false },
            { text: "Read only memory", correct: false }
        ]
    },
    {
        text: "Which one of the following is not the function of power supply?", type: "multiple_choice", options: [
            { text: "Converting AC to DC", correct: false },
            { text: "Distributes lower voltage DC power to components throughout the computer,", correct: false },
            { text: "Provides cooling through the use of a fan located inside the power supply.", correct: false },
            { text: "Preventing electrostatic discharging by absorbing the static electricity", correct: true }
        ]
    },
    {
        text: "How could SCSI termination be performed?", type: "multiple_choice", options: [
            { text: "By installing a jumper", correct: false },
            { text: "By installing a terminator plug", correct: false },
            { text: "By using software", correct: false },
            { text: "All are the answers", correct: true }
        ]
    },
    {
        text: "A place every software and hardware configuration is stored in a database, such things stored as folder and file property settings, port configuration, application preferences, and user profiles is:", type: "multiple_choice", options: [
            { text: "Windows registry", correct: true },
            { text: "Windows help center", correct: false },
            { text: "My document", correct: false },
            { text: "Windows recovery folder", correct: false }
        ]
    },
    {
        text: "Which one of the following is a bad habit when performing computer hardware maintenance?", type: "multiple_choice", options: [
            { text: "Using Antistatic devices (antistatic mat and antistatic wrist strap).", correct: false },
            { text: "Using magnetized screw drivers while disassembling a HDD.", correct: true },
            { text: "Keeping paper and pen nearby for note taking and diagramming.", correct: false },
            { text: "When removing adapters, do not stack the adapters on top of one another", correct: false }
        ]
    },
    {
        text: "A __________________ is a software program that intercepts the printer's request to print, instead of going directly to the printer, it sends data to the hard drive, and then it controls the data from the hard drive going to the printer.", type: "multiple_choice", options: [
            { text: "A primary corona", correct: false },
            { text: "A fuser cleaning pad", correct: false },
            { text: "A Print spooler", correct: true },
            { text: "A print writer", correct: false }
        ]
    },
    {
        text: "If a computer beeps once then three times, then four times, then three more times during POST and the computer has a Phoenix BIOS, what is a possible suspect component?", type: "multiple_choice", options: [
            { text: "Keyboard", correct: false },
            { text: "BIOS", correct: false },
            { text: "Memory (RAM)", correct: true },
            { text: "Video", correct: false }
        ]
    },
    {
        text: "In the following pairs of OSI protocol layer/ sub-layer and its functionality the INCORRECT pair is:-", type: "multiple_choice", options: [
            { text: "Network layer and Routing", correct: false },
            { text: "Data Link Layer and Bit synchronization", correct: true },
            { text: "Transport layer and End-to-end process communication", correct: false },
            { text: "Medium Access Control sub-layer and Channel sharing", correct: false }
        ]
    },
    {
        text: "The transport layer protocols used for real time multimedia, file transfer, DNS and email respectively are", type: "multiple_choice", options: [
            { text: "TCP, UDP, UDP and TCP", correct: false },
            { text: "UDP, TCP, TCP and UDP", correct: false },
            { text: "UDP, TCP, UDP and TCP", correct: true },
            { text: "TCP, UDP, TCP and UDP", correct: false }
        ]
    },
    {
        text: "In one of the pairs of protocols given below, both the protocols can use multiple TCP connections between the same client and the server. Which one is that?", type: "multiple_choice", options: [
            { text: "HTTP, TELNET", correct: false },
            { text: "FTP, SMTP", correct: false },
            { text: "HTTP, FTP", correct: true },
            { text: "HTTP, SMTP", correct: false }
        ]
    },
    {
        text: "Given an IP address and subnet mask of 192.168.20.39 and 255.255.255.240 then what is the broadcast address of this given IP?", type: "multiple_choice", options: [
            { text: "192.168.20.63", correct: false },
            { text: "192.168.20.47", correct: true },
            { text: "192.168.20.41", correct: false },
            { text: "192.168.20.64", correct: false }
        ]
    },
    {
        text: "A service provider has given you the class C network range 209.50.1.0. Your company must break the network into as many subnets as possible as long as there are at least 7 clients per network. Which one of the following statement is true about this subnetting scenario?", type: "multiple_choice", options: [
            { text: "The network address of the second subnet is 209.50.1.8", correct: false },
            { text: "The broadcast address of the first subnet is 209.50.1.7", correct: false },
            { text: "The network address of the third subnet is 209.50.1.47", correct: false },
            { text: "The broadcast address of the second subnet is 209.50.1.31", correct: true }
        ]
    },
    {
        text: "Suppose computers A and B have IP addresses 10.105.1.113 and 10.105.1.91 respectively and they both use the same net mask N. Which of the values of N given below should not be used if A and B should belong to the same network?", type: "multiple_choice", options: [
            { text: "255.255.255.0", correct: false },
            { text: "255.255.255.128", correct: false },
            { text: "255.255.255.192", correct: false },
            { text: "255.255.255.224", correct: true }
        ]
    },
    {
        text: "Which OSI layer is responsible for encryption, compression and translation of packets sent from source to destination?", type: "multiple_choice", options: [
            { text: "Session layer", correct: false },
            { text: "Presentation layer", correct: true },
            { text: "Transport layer", correct: false },
            { text: "Datalink layer", correct: false }
        ]
    },
    {
        text: "When a packet travels from router to router to its destination, what address continually changes from hop to hop?", type: "multiple_choice", options: [
            { text: "Source and destination Layer 2 address", correct: true },
            { text: "Source Layer 3 address", correct: false },
            { text: "Destination Layer 3 address", correct: false },
            { text: "Destination port", correct: false }
        ]
    },
    {
        text: "Which statement best describes convergence on a network?", type: "multiple_choice", options: [
            { text: "The amount of time required for routers to share administrative configuration changes, such as password changes, from one end of a network to the other end", correct: false },
            { text: "The time required for the routers in the network to update their routing tables after a topology change has occurred", correct: true },
            { text: "The time required for the routers in one autonomous system to learn routes to destinations in another autonomous system", correct: false },
            { text: "The time required for routers running disparate routing protocols to update their routing tables", correct: false }
        ]
    },
    {
        text: "Consider the following three statements about link state and distance vector routing protocols, for a large network with 500 network nodes and 4000 links. Which one of the following is correct about S1, S2 and S3?", type: "multiple_choice", options: [
            { text: "S1, S2 and S3 are all true", correct: false },
            { text: "S1, S2 and S3 are all false", correct: false },
            { text: "S1 and S2 are true, but S3 is false", correct: false },
            { text: "S1 and S3 are true, but S2 is false.", correct: true }
        ]
    },
    {
        text: "Consider the following statements about the routing protocols. Routing Information Protocol (RIP) and Open Shortest Path First (OSPF) in an IPv4 network. Which of the statements above are CORRECT?", type: "multiple_choice", options: [
            { text: "I and IV only", correct: false },
            { text: "I, II and III only", correct: false },
            { text: "I, II and IV only", correct: true },
            { text: "II, III and IV only", correct: false }
        ]
    },
    {
        text: "With the following equipment list which of the following network scenario could be supported? Two IP subnets of 255.255.255.0, Seven 48 port switches, Two router interfaces", type: "multiple_choice", options: [
            { text: "600 workstations, with 300 workstations in two broadcast domains and each workstation in its own collision domain", correct: false },
            { text: "300 workstations, with 150 workstations in two broadcast domains and each workstation in its own collision domain", correct: true },
            { text: "300 workstations, with 150 workstations in two broadcast domains and all workstations in the same collision domain", correct: false },
            { text: "300 workstations, in a single broadcast domains and each workstation in its own collision domain", correct: false }
        ]
    },
    {
        text: "Which command will allow host 192.168.144.25 to have telnet access to network 172.16.0.0?", type: "multiple_choice", options: [
            { text: "Access-list 15 permit TCP 192.168.144.25 0.0.0.0 172.16.0.0 0.0.255.255 eq 23", correct: false },
            { text: "Access-list 150 permit UDP 192.168.144.25 0.0.0.0 172.16.0.0 0.0.255.255 eq 23", correct: false },
            { text: "Access-list 150 permit TCP 192.168.144.25 0.0.0.0 172.16.0.0 0.0.255.255 eq 21", correct: false },
            { text: "Access-list 150 permit TCP 192.168.144.25 0.0.0.0 172.16.0.0 0.0.255.255 eq 23", correct: true }
        ]
    },
    {
        text: "Which one of the following is TRUE about the interior gateway routing protocols-Routing information protocol (RIP) and Open Shortest Path First (OSPF)?", type: "multiple_choice", options: [
            { text: "RIP uses distance vector routing and OSPF uses link state routing", correct: true },
            { text: "OSPF uses distance vector routing and RIP uses link state routing", correct: false },
            { text: "Both RIP and OSPF use link state routing", correct: false },
            { text: "Both RIP and OSPF use distance vector routing", correct: false }
        ]
    },
    {
        text: "Which of the below routing method always ensures the shortest path even though routers crash during course of routing?", type: "multiple_choice", options: [
            { text: "Dijkstra Routing", correct: false },
            { text: "Flooding", correct: true },
            { text: "Distance Vector Routing", correct: false },
            { text: "Link State Routing", correct: false }
        ]
    },
    {
        text: "You are the network administrator for your company. You want to restrict all ping attempts from outside your company from reaching internal hosts. Your internal network is using the IP network of 200.15.24.0/24. Then which command should be executed on the corporate boundary router to accomplish the task?", type: "multiple_choice", options: [
            { text: "Router (config)#access-list 100 deny TCP any 200.15.24.0/24 eq echo", correct: false },
            { text: "Router (config)#access-list 1 deny ICMP any 200.15.24.0 0.0.0.255 eq ping", correct: false },
            { text: "Router (config)#access-list 100 deny TCP any 200.15.24.0 0.0.0.255 eq echo", correct: true },
            { text: "Router (config)#access-list 1 deny ICMP any 200.15.24.0 0.0.0.255 eq ping", correct: false }
        ]
    },

    // FILE 3: 3exit.docx (Questions 1-90)
    {
        text: "Which OSI reference model layer is responsible for translating data in a form that can be understood by the receiver?", type: "multiple_choice", options: [
            { text: "Transport layer", correct: false },
            { text: "Presentation layer", correct: true },
            { text: "Session layer", correct: false },
            { text: "Application layer", correct: false }
        ]
    },
    {
        text: "_______is an insertion operator which is used for overloading.", type: "multiple_choice", options: [
            { text: "Overloading &&", correct: false },
            { text: "Overloading ||", correct: false },
            { text: "Overloading <<", correct: true },
            { text: "Overloading +=", correct: false }
        ]
    },
    {
        text: "Which one of the following creates a connection-oriented connection that provides reliable end-to-end transfer and uses window mechanism for flow control?", type: "multiple_choice", options: [
            { text: "Internet Protocol", correct: false },
            { text: "Session Layer", correct: false },
            { text: "Transport layer", correct: false },
            { text: "Transmission Control Protocol", correct: true }
        ]
    },
    {
        text: "What command alters the group owner of a file?", type: "multiple_choice", options: [
            { text: "change", correct: false },
            { text: "cgrp", correct: false },
            { text: "chgrp", correct: true },
            { text: "group", correct: false }
        ]
    },
    {
        text: "Which of the following is the correct tag to place an image on the right side of the window with the text filling the area to the left of the image?", type: "multiple_choice", options: [
            { text: "<img = 'mountains.jpg' src aligh='right'>", correct: false },
            { text: "<img src='mountains.jpg' style='float:right'>", correct: true },
            { text: "<img src align='mountains.jpg' 'right'>", correct: false },
            { text: "<img align='mountains.jpg' src='float:right'>", correct: false }
        ]
    },
    {
        text: "In ER diagram Diamond/Ellipses represent.", type: "multiple_choice", options: [
            { text: "Relationship sets/Attributes", correct: true },
            { text: "Entity sets/Attributes", correct: false },
            { text: "Attributes/Relationships sets", correct: false },
            { text: "Relationship sets/Entity sets", correct: false }
        ]
    },
    {
        text: "Which one of the following directories contains the configuration files?", type: "multiple_choice", options: [
            { text: "/root/", correct: false },
            { text: "/bin/", correct: false },
            { text: "/etc/", correct: true },
            { text: "/dev/", correct: false }
        ]
    },
    {
        text: "Which of the following variable holds information about the web server and page", type: "multiple_choice", options: [
            { text: "$_POST[]", correct: false },
            { text: "$_REQUEST[]", correct: false },
            { text: "$_SESSION[]", correct: false },
            { text: "$_SERVER[]", correct: true }
        ]
    },
    {
        text: "Which of the following operators is utilized in Java to allocate memory to an array variable?", type: "multiple_choice", options: [
            { text: "new malloc", correct: false },
            { text: "new", correct: true },
            { text: "alloc", correct: false },
            { text: "malloc", correct: false }
        ]
    },
    {
        text: "Select the task involves when you write object-oriented programs.", type: "multiple_choice", options: [
            { text: "Creating classes, which are specific instances of objects", correct: false },
            { text: "Creating applications that manipulate or use objects", correct: true },
            { text: "Creating AI environment for users is a natural use for object orientation", correct: false },
            { text: "Creating objects, which are blueprints for classes", correct: false }
        ]
    },
    {
        text: "When a new computer user wants to use virtualization, which hardware components need to support virtual technology for this to work properly?", type: "multiple_choice", options: [
            { text: "RAM", correct: false },
            { text: "ROM", correct: false },
            { text: "Motherboard", correct: false },
            { text: "BIOS", correct: true }
        ]
    },
    {
        text: "Assume the relation Staff(eid: integer, ename: string, age: integer, salary: real) Write SQL statement that increases employee salary by 5%?", type: "multiple_choice", options: [
            { text: "MODIFY Staff SET salary = salary*.05", correct: false },
            { text: "ALTER Staff SET salary = 0.05", correct: false },
            { text: "CHANGE Staff SET salary = salary + 0.05", correct: false },
            { text: "UPDATE Staff SET salary = salary*1.05", correct: true }
        ]
    },
    {
        text: "The mathematical terms relation and tuple are referred to as?", type: "multiple_choice", options: [
            { text: "Table and Row", correct: true },
            { text: "Table and key", correct: false },
            { text: "Table and Column", correct: false },
            { text: "Table and Field", correct: false }
        ]
    },
    {
        text: "The super global array variables are accessible", type: "multiple_choice", options: [
            { text: "Anywhere", correct: true },
            { text: "Anywhere except in classes", correct: false },
            { text: "Only inside functions", correct: false },
            { text: "Only outside functions", correct: false }
        ]
    },
    {
        text: "Assume a concept denoted by X → Y, between two sets of attributes X and Y that are subsets of a relation R specifies a constraint on the possible tuples that can form a relation state r of R. Which normalization level describes this concept?", type: "multiple_choice", options: [
            { text: "3NF", correct: false },
            { text: "BCNF", correct: true },
            { text: "2NF", correct: false },
            { text: "1NF", correct: false }
        ]
    },
    {
        text: "describe when an activity will start interacting with the user.", type: "multiple_choice", options: [
            { text: "onStop", correct: false },
            { text: "onResume", correct: true },
            { text: "onCreate", correct: false },
            { text: "onDestroy", correct: false }
        ]
    },
    {
        text: "_______is a database schema that depicts key dependencies between the primary key and foreign key.", type: "multiple_choice", options: [
            { text: "Database Diagram", correct: true },
            { text: "Relation Schema", correct: false },
            { text: "Schema Diagram.", correct: false },
            { text: "ER Diagram", correct: false }
        ]
    },
    {
        text: "Which one of the following access methods used in a dedicated management channel?", type: "multiple_choice", options: [
            { text: "SSH", correct: false },
            { text: "In-band", correct: false },
            { text: "MAC", correct: false },
            { text: "Telnet", correct: true }
        ]
    },
    {
        text: "If a method contains a local variable with the same name as one of its class's fields, the local variable the field in that method's scope.", type: "multiple_choice", options: [
            { text: "import", correct: false },
            { text: "collector", correct: false },
            { text: "shadows", correct: true },
            { text: "class", correct: false }
        ]
    },
    {
        text: "The two dimensions that you should use when evaluating project risks are", type: "multiple_choice", options: [
            { text: "source and responsibility", correct: false },
            { text: "probability and impact", correct: true },
            { text: "cost and schedule", correct: false },
            { text: "negative and positive", correct: false }
        ]
    },
    {
        text: "The correct order of query optimization is __________", type: "multiple_choice", options: [
            { text: "Querying, Scanning, Validating, Parsing", correct: false },
            { text: "Querying, Scanning, Parsing, Validating", correct: false },
            { text: "Querying, Parsing, Validating, Scanning", correct: true },
            { text: "Querying, Validating, Scanning, Parsing", correct: false }
        ]
    },
    {
        text: "A system is in a state if there exists a set of transactions such that every transaction in the set is waiting for another transaction in the set.", type: "multiple_choice", options: [
            { text: "Deadlock", correct: true },
            { text: "Ready", correct: false },
            { text: "Waiting", correct: false },
            { text: "Idle", correct: false }
        ]
    },
    {
        text: "When you design a class diagram, which class hierarchies' relationship you are not going to apply?", type: "multiple_choice", options: [
            { text: "Application", correct: true },
            { text: "Aggregation", correct: false },
            { text: "Association", correct: false },
            { text: "Instantiation", correct: false }
        ]
    },
    {
        text: "What is the correct way to open the file 'time.txt' as readable?", type: "multiple_choice", options: [
            { text: "fopen('time.txt','r+');", correct: false },
            { text: "open('time.txt','read');", correct: false },
            { text: "fopen('time.txt','r');", correct: true },
            { text: "open('time.txt');", correct: false }
        ]
    },
    {
        text: "In object-oriented development, through which diagrams we are not analyze the dynamic semantics of a problem or its implementation?", type: "multiple_choice", options: [
            { text: "State transition diagrams", correct: false },
            { text: "Process diagrams", correct: true },
            { text: "Script diagram", correct: false },
            { text: "Interaction diagram", correct: false }
        ]
    },
    {
        text: "Assume: Dawit created some nested tags as displayed here: <p> <b><i> Peace! </i></b></p>. Did he perform valid nesting? (Why?)", type: "multiple_choice", options: [
            { text: "No, though the first part is right, the second part should be </p> </b></i>", correct: false },
            { text: "No, because paragraph tags need to be right before the actual text", correct: false },
            { text: "No, because italic tags must always come before bold tags", correct: false },
            { text: "Yes, because the tags are nested correctly", correct: true }
        ]
    },
    {
        text: "Suppose that the selector in a Select Case block is the string variable myVar. Which of the following Case clause is Invalid?", type: "multiple_choice", options: [
            { text: "Case myVar.Length", correct: true },
            { text: "Case '739'", correct: false },
            { text: "Case (myVar.Substring(0, 1)", correct: false },
            { text: "Case 'Adams'", correct: false }
        ]
    },
    {
        text: "Which factor that measures the quality of the management process?", type: "multiple_choice", options: [
            { text: "Results", correct: false },
            { text: "Project plan", correct: true },
            { text: "Budget management", correct: false },
            { text: "Project team", correct: false }
        ]
    },
    {
        text: "Which of the following is true regarding the command switchport mode dynamic auto?", type: "multiple_choice", options: [
            { text: "The interface will become a trunk if the neighboring port is configured the same.", correct: false },
            { text: "The interface will remain an access link if the neighboring port is configured as a trunk.", correct: false },
            { text: "The interface will become a trunk if requested on the neighboring port.", correct: true },
            { text: "The interface will remain an access link if the native VLAN is changed", correct: false }
        ]
    },
    {
        text: "is implemented by combining methods and attribute into a class.", type: "multiple_choice", options: [
            { text: "Polymorphism", correct: false },
            { text: "Encapsulation", correct: true },
            { text: "Abstraction", correct: false },
            { text: "Inheritance", correct: false }
        ]
    },
    {
        text: "function is used to return a copy of a string without leading spaces.", type: "multiple_choice", options: [
            { text: "trim", correct: false },
            { text: "btrim", correct: false },
            { text: "rtrim", correct: false },
            { text: "ltrim", correct: true }
        ]
    },
    {
        text: "Application-associated processing in the background is handled by", type: "multiple_choice", options: [
            { text: "Broadcast Receivers", correct: false },
            { text: "Service", correct: true },
            { text: "Content Provider", correct: false },
            { text: "Activities", correct: false }
        ]
    },
    {
        text: "When transaction Ti requests a data item currently held by Tj, Ti is allowed to wait only if it has a timestamp smaller than that of Tj (that is, Ti is older than Tj). Otherwise, Ti is rolled back (dies). This phenomenon is known as", type: "multiple_choice", options: [
            { text: "Wait", correct: false },
            { text: "Wait-wound", correct: false },
            { text: "Wound-wait", correct: false },
            { text: "Wait-die", correct: true }
        ]
    },
    {
        text: "Assume: Biruk wants to send a secure message M to Alem, and they want to assure its integrity and confidentiality. How do they make it possible if they use public crypto? (Consider public and Private key pair K+B, and K-B respectively for Biruk, K+A, and K-A respectively for Alem).", type: "multiple_choice", options: [
            { text: "K-A (K-B (M))", correct: false },
            { text: "K-B (K+A (M))", correct: false },
            { text: "K+B (K-A (M))", correct: true },
            { text: "K+B (K-B (M))", correct: false }
        ]
    },
    {
        text: "defined for a simple connectionless communication that provides no error recovery and no delivery guarantee.", type: "multiple_choice", options: [
            { text: "File transfer protocol", correct: false },
            { text: "User Datagram Protocol", correct: true },
            { text: "Internet Protocol", correct: false },
            { text: "Simple mail transfer protocol", correct: false }
        ]
    },
    {
        text: "Routing loops are not a problem for link-state protocols like distance-vector protocols. Why?", type: "multiple_choice", options: [
            { text: "Link-state protocols require routers to maintain their own topology database of the network", correct: true },
            { text: "Link-state protocols share the topology database between all routers", correct: false },
            { text: "Link-state protocols use multiple routes to the same destination", correct: false },
            { text: "Link-state protocols allow routers to maintain a link-state database of all routers", correct: false }
        ]
    },
    {
        text: "If you don't specify a return value, Android function will return,", type: "multiple_choice", options: [
            { text: "Void", correct: false },
            { text: "Unit", correct: true },
            { text: "True", correct: false },
            { text: "False", correct: false }
        ]
    },
    {
        text: "A Communication between applications and the Android Operating System is handled by", type: "multiple_choice", options: [
            { text: "Broadcast Receivers", correct: false },
            { text: "Content Provider", correct: false },
            { text: "Service", correct: false },
            { text: "Activities", correct: true }
        ]
    },
    {
        text: "In ER diagrammatic notation, has its name underlined inside the oval describes", type: "multiple_choice", options: [
            { text: "Complex attribute", correct: false },
            { text: "Derived attribute", correct: false },
            { text: "Multivalued Attribute", correct: false },
            { text: "Key attribute", correct: true }
        ]
    },
    {
        text: "To support the 802.1Q protocol, a trunk interface needs to be configured. What command will accomplish this?", type: "multiple_choice", options: [
            { text: "Switch(config-if)# switchport mode trunk 802.1q", correct: false },
            { text: "Switch(config-if)# switchport encapsulation trunk 802.1q", correct: false },
            { text: "Switch(config-if)# switchport 802.1q", correct: false },
            { text: "Switch(config-if)# switchport trunk encapsulation 802.1q", correct: true }
        ]
    },
    {
        text: "Which of the following assigns the value 3 to the 0th index of the temp array?", type: "multiple_choice", options: [
            { text: "temp[3]=0;", correct: false },
            { text: "temp[0]=3;", correct: true },
            { text: "temp(0)=3", correct: false },
            { text: "3=temp[0];", correct: false }
        ]
    },
    {
        text: "Which one of the following is true about Carrier Sense Multiple Access/Collision Detection (CSMA/CD) process on Ethernet LAN switch that configured with full-duplex?", type: "multiple_choice", options: [
            { text: "If two devices transmit at the same time, a collision will occur", correct: false },
            { text: "Data sent by both devices will not be corrupted and will need to be resent", correct: false },
            { text: "Collision never occur the two devices transmit at the same time", correct: true },
            { text: "Devices will not detect the collision on the network", correct: false }
        ]
    },
    {
        text: "Referencing the following HTML listing, how would you style only the first paragraph inside the footer element to have a smaller font size?", type: "multiple_choice", options: [
            { text: "footer:p:first-child { font-size: x-small; }", correct: false },
            { text: "footer p:first-child { font-size: x-small; }", correct: true },
            { text: "footer->p,first-child { font-size: x-small;}", correct: false },
            { text: "footer p.first-child { font-size: x-small; }", correct: false }
        ]
    },
    {
        text: "Which one of the following statements correctly describe the feature of object-Oriented programming?", type: "multiple_choice", options: [
            { text: "Objects are the characteristics that define an attribute; they are properties of the attribute.", correct: false },
            { text: "Inheritance allows you to treat all of an object's methods and data as a single entity", correct: false },
            { text: "A method is a self-contained block of program code that carries out some action, similar to a procedure in a procedural program.", correct: true },
            { text: "Encapsulation allows a class to be a subclass of a superclass and thereby inherit public and protected variables and methods of the superclass.", correct: false }
        ]
    },
    {
        text: "In Public key encryption, if A wants to send an encrypted message to B, which statement is true?", type: "multiple_choice", options: [
            { text: "A encrypts message using B's public key", correct: true },
            { text: "A encrypts message using public key", correct: false },
            { text: "A encrypts message using B's private key", correct: false },
            { text: "A encrypts message using his private key", correct: false }
        ]
    },
    {
        text: "_________is threats of a database, which can occur due to creation, insertion, updating, changing the status of data, and deletion.", type: "multiple_choice", options: [
            { text: "Loss of availability", correct: false },
            { text: "Loss of integrity", correct: true },
            { text: "Loss of accountability", correct: false },
            { text: "Loss of confidentiality", correct: false }
        ]
    },
    {
        text: "The ../notation in a relative path of hypertext reference matches", type: "multiple_choice", options: [
            { text: "Open the parent folder", correct: true },
            { text: "Search a folder", correct: false },
            { text: "Create a folder", correct: false },
            { text: "Go down a folder", correct: false }
        ]
    },
    {
        text: "Which of the following approaches is best for state decision support system software project management activities?", type: "multiple_choice", options: [
            { text: "Hybrid approach", correct: false },
            { text: "Activity-based approach", correct: false },
            { text: "Product-based approach", correct: true },
            { text: "Project execution", correct: false }
        ]
    },
    {
        text: "What will be the output of the following statement? txtBox.Text = FormatCurrency(1234.567)", type: "multiple_choice", options: [
            { text: "$1,234.57", correct: true },
            { text: "$1234.57", correct: false },
            { text: "1,234.57", correct: false },
            { text: "$1234.567", correct: false }
        ]
    },
    {
        text: "Which one of the following statement is not true when you analyzing a Java application that produces an output?", type: "multiple_choice", options: [
            { text: "In the method header, public static void main(String[] args), the contents between the parentheses, String[] args, represent the type of argument that can be passed to the main() method", correct: false },
            { text: "In the method header public static void main(String[] args), the word static is an access specifier", correct: false },
            { text: "In the method header public static void main(String[] args), the word void means that the main() method is an empty method", correct: true },
            { text: "In the method header public static void main(String[] args), the word public means that a method is accessible and usable, even though no objects of the class exist", correct: false }
        ]
    },
    {
        text: "Among the four frames of organization, coordination, and control are run?", type: "multiple_choice", options: [
            { text: "Political", correct: false },
            { text: "Human resources", correct: false },
            { text: "Symbolic", correct: false },
            { text: "Structure", correct: true }
        ]
    },
    {
        text: "What is the importance of ssh command?", type: "multiple_choice", options: [
            { text: "performed in a synchrous way", correct: false },
            { text: "to restricted set of commands", correct: false },
            { text: "to connect remote hosts via an authenticated and encrypted channel.", correct: true },
            { text: "performed in real-time", correct: false },
            { text: "to restrict actions available to users", correct: false }
        ]
    },
    {
        text: "The result of the following Java code will be", type: "multiple_choice", options: [
            { text: "Compilation Error", correct: false },
            { text: "05", correct: false },
            { text: "Runtime Error", correct: false },
            { text: "0", correct: true }
        ]
    },
    {
        text: "is the tag for the heading that is the largest and the most bold", type: "multiple_choice", options: [
            { text: "H3", correct: false },
            { text: "H2", correct: false },
            { text: "H1", correct: true },
            { text: "H4", correct: false }
        ]
    },
    {
        text: "_______is a program that executes compiled Java code on a specific platform.", type: "multiple_choice", options: [
            { text: "Eclipse Editor", correct: false },
            { text: "Java Programming Manual", correct: false },
            { text: "Java Compiler", correct: false },
            { text: "Java Virtual Machine", correct: true }
        ]
    },
    {
        text: "DES works by using", type: "multiple_choice", options: [
            { text: "exclusive ORing key bits with 64 bit blocks", correct: false },
            { text: "only permutations on blocks of 128 bits", correct: false },
            { text: "Permutation and substitution on 64 Bit blocks of plain text", correct: true },
            { text: "4 rounds of substitution on 64 bit blocks with 56 bit keys", correct: false }
        ]
    },
    {
        text: "What is the proper syntax when using a message dialog box?", type: "multiple_choice", options: [
            { text: "MessageBox.Show 'Hi There', 'Hi'", correct: false },
            { text: "MessageBox.Show Hi There, Hi", correct: false },
            { text: "MessageBox.Show(Hi there, Hi)", correct: false },
            { text: "MessageBox.Show('Hi there', 'Hi')", correct: true }
        ]
    },
    {
        text: "Identify the necessary tool for creating and testing your android apps on different virtual devices.", type: "multiple_choice", options: [
            { text: "Android SDK tools and platform tools", correct: false },
            { text: "Android SDK", correct: false },
            { text: "IntelliJ IDEA", correct: false },
            { text: "A system image for the Android emulator", correct: true }
        ]
    },
    {
        text: "_______is HTTP status code for client error such as page not found.", type: "multiple_choice", options: [
            { text: "3xx", correct: false },
            { text: "4xx", correct: true },
            { text: "1xx", correct: false },
            { text: "5xx", correct: false }
        ]
    },
    {
        text: "OSPF uses what multicast address for neighbor discovery?", type: "multiple_choice", options: [
            { text: "224.0.0.7", correct: false },
            { text: "224.0.0.5", correct: true },
            { text: "224.0.0.4", correct: false },
            { text: "224.0.0.6", correct: false }
        ]
    },
    {
        text: "Which of the following programming style employs Invariant relationships abstractions?", type: "multiple_choice", options: [
            { text: "Logic-oriented", correct: false },
            { text: "Procedure-oriented", correct: false },
            { text: "Object-oriented", correct: false },
            { text: "Constraint-oriented", correct: true }
        ]
    },
    {
        text: "TTP response line with a status code that starts with 2xx means", type: "multiple_choice", options: [
            { text: "request received, processing continues", correct: false },
            { text: "further action must be taken to complete the request", correct: false },
            { text: "success, action was successfully received, understood and accepted", correct: true },
            { text: "server error occurred", correct: false }
        ]
    },
    {
        text: "Which function is not relevant to protect your site from characters that can potentially do damage to your system", type: "multiple_choice", options: [
            { text: "addslashes())", correct: false },
            { text: "urlencode()", correct: false },
            { text: "mysql_real_escape_string()", correct: false },
            { text: "eval(", correct: true }
        ]
    },
    {
        text: "If you want to display an image without any text around it, you should nest it inside__________tag(s)?", type: "multiple_choice", options: [
            { text: "<p>", correct: true },
            { text: "<img:p>", correct: false },
            { text: "<img><p>", correct: false },
            { text: "<p:img>", correct: false }
        ]
    },
    {
        text: "In order to establish a neighborship, which is a need for EIGRP routers?", type: "multiple_choice", options: [
            { text: "Matching areas.", correct: false },
            { text: "Matching K metrics", correct: true },
            { text: "Matching bandwidth metrics", correct: false },
            { text: "Matching delay metrics", correct: false }
        ]
    },
    {
        text: "During system design, what mechanisms/analysis is used to regulate how objects collaborate relative to the system's architecture?", type: "multiple_choice", options: [
            { text: "Class diagrams", correct: false },
            { text: "Module diagrams", correct: false },
            { text: "Object diagrams.", correct: false },
            { text: "Process diagrams", correct: true }
        ]
    },
    {
        text: "During installing a new video card into a desktop computer, what type of expansion slot is preferred today for high-performance graphics adapters?", type: "multiple_choice", options: [
            { text: "AGP", correct: false },
            { text: "PCIe", correct: true },
            { text: "PCI", correct: false },
            { text: "SATA", correct: false }
        ]
    },
    {
        text: "What command is used to show the amount of space that a certain directory takes up on the disk?", type: "multiple_choice", options: [
            { text: "ds", correct: false },
            { text: "dd", correct: false },
            { text: "dds", correct: false },
            { text: "du", correct: true }
        ]
    },
    {
        text: "You install a new NIC for a user, and he asks 'what it does?'. Which of the following best characterizes the functions of this device?", type: "multiple_choice", options: [
            { text: "Storage", correct: false },
            { text: "Input/Output", correct: false },
            { text: "Multimedia", correct: false },
            { text: "Communications", correct: true }
        ]
    },
    {
        text: "What is the maximum data transfer rate of USB High Speed?", type: "multiple_choice", options: [
            { text: "5 Gbps", correct: false },
            { text: "12 Mbps", correct: false },
            { text: "10 Gbps.", correct: false },
            { text: "480 Mbps", correct: true }
        ]
    },
    {
        text: "Based on the following source code, which page will be displayed?", type: "multiple_choice", options: [
            { text: "Login page", correct: false },
            { text: "Index page", correct: false },
            { text: "Logout page", correct: false },
            { text: "Password change page", correct: true }
        ]
    },
    {
        text: "Assume: a computer lab where student demands the Administrator access to a Windows 11 system to install SQL Server; but that right should not be given to the student unless he/she is member of an employee. Which principle of cyber security is considered here?", type: "multiple_choice", options: [
            { text: "Fail-safe", correct: false },
            { text: "Separation of privileges", correct: false },
            { text: "Least privileges", correct: true },
            { text: "Open design", correct: false }
        ]
    },
    {
        text: "Identify the function that changes the output of intSalary InputBox('What is your salary') into numerical representation", type: "multiple_choice", options: [
            { text: "Int0", correct: false },
            { text: "Parse(", correct: false },
            { text: "Convert()", correct: false },
            { text: "Val0", correct: true }
        ]
    },
    {
        text: "You have just replaced a computer and now need to add a cooling mechanism. What should you use to attach the cooling system to the processor?", type: "multiple_choice", options: [
            { text: "Superglue", correct: false },
            { text: "Thermal paste", correct: true },
            { text: "Fan", correct: false },
            { text: "Heat sink", correct: false }
        ]
    },
    {
        text: "About the parts of a router, which of the following statements is true?", type: "multiple_choice", options: [
            { text: "The most recent and updated configuration files are located in the ROM", correct: false },
            { text: "A backup version of the IOS utilized during the boot process is kept in NVRAM", correct: false },
            { text: "ROM contains diagnostics that are run on the hardware modules", correct: true },
            { text: "A configuration file used during the boot process is permanently stored in RAM", correct: false }
        ]
    },
    {
        text: "One of the following cannot measure the quality of an abstraction?", type: "multiple_choice", options: [
            { text: "sufficiency", correct: false },
            { text: "primitiveness", correct: false },
            { text: "coupling", correct: true },
            { text: "ease of use", correct: false }
        ]
    },
    {
        text: "On a router, you have numerous routes set up. What command only displays static routes?", type: "multiple_choice", options: [
            { text: "Router#show ip static routes", correct: false },
            { text: "Router#show ip routes", correct: false },
            { text: "Router#show ip routes static", correct: true },
            { text: "Router#show static routes", correct: false }
        ]
    },
    {
        text: "One of the following is not the disadvantage of simple file processing?", type: "multiple_choice", options: [
            { text: "Program-Data independence", correct: true },
            { text: "Concurrent access anomalies", correct: false },
            { text: "Data Separation and isolation", correct: false },
            { text: "Data redundancy and inconsistency", correct: false }
        ]
    },
    {
        text: "Digital signatures are primarily designed to provide additional protection with electronic messages in order to ensure", type: "multiple_choice", options: [
            { text: "Sender verification", correct: true },
            { text: "Message modification", correct: false },
            { text: "Message read by unauthorized party", correct: false },
            { text: "Message deletion", correct: false }
        ]
    },
    {
        text: "The object cannot be", type: "multiple_choice", options: [
            { text: "passed by reference", correct: false },
            { text: "passed by value.", correct: false },
            { text: "passed by copy", correct: true },
            { text: "passed as function", correct: false }
        ]
    },
    {
        text: "What is the correct HTML code for referring an external JavaScript?", type: "multiple_choice", options: [
            { text: "<script href='myscript.js' type='text/javascript'></script>", correct: false },
            { text: "<script scr='myscript.js' type='text/javascript'></script>", correct: true },
            { text: "<script>mystyle.css </script>", correct: false },
            { text: "<style scr='myscript.js'/> </style>", correct: false }
        ]
    },
    {
        text: "Which tag used to add a background color for all <h1> elements?", type: "multiple_choice", options: [
            { text: "h1.all {background-color:#FFFFFF}", correct: false },
            { text: "all.h1 {background-color:#FFFFFF}", correct: false },
            { text: "h1 {background-color:#FFFFFF}", correct: true },
            { text: "All", correct: false }
        ]
    },
    {
        text: "When you develop a project management plan, which of the following ensures that the objectives of the project are achieved in the most appropriate way?", type: "multiple_choice", options: [
            { text: "Initiating", correct: false },
            { text: "Execution", correct: false },
            { text: "Planning", correct: true },
            { text: "Controlling", correct: false }
        ]
    },
    {
        text: "What programming language is used to create system calls in UNIX?", type: "multiple_choice", options: [
            { text: "C", correct: true },
            { text: "Assembly Language", correct: false },
            { text: "Fortran", correct: false },
            { text: "C++", correct: false }
        ]
    },
    {
        text: "Eavesdropping and packet sniffing are considered to be attacks of", type: "multiple_choice", options: [
            { text: "Confidentiality", correct: true },
            { text: "Integrity", correct: false },
            { text: "non-repudiation", correct: false },
            { text: "Authentication", correct: false }
        ]
    },
    {
        text: "In case of any shut down during transaction before commit, which of the following statement is done automatically?", type: "multiple_choice", options: [
            { text: "Commit", correct: false },
            { text: "Rollback", correct: true },
            { text: "Flashback", correct: false },
            { text: "View", correct: false }
        ]
    },
    {
        text: "is a valid name for a variable?", type: "multiple_choice", options: [
            { text: "T4.Tutorials", correct: false },
            { text: "T4 Tutorials", correct: false },
            { text: "4 Tutorials", correct: false },
            { text: "T4_Tutorials", correct: true }
        ]
    }
];

async function seedMockExam() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Check if official quiz exists
        let quizRes = await client.query('SELECT id FROM quizzes WHERE title = $1', ['exit_exam6']);
        let quizId;

        if (quizRes.rows.length === 0) {
            console.log('Inserting mock official quiz...');
            const courseRes = await client.query('SELECT id FROM courses LIMIT 1');
            const courseId = courseRes.rows.length ? courseRes.rows[0].id : null;

            const insertQuiz = await client.query(
                'INSERT INTO quizzes (title, is_official, course_id) VALUES ($1, $2, $3) RETURNING id',
                ['exit_exam6', true, courseId]
            );
            quizId = insertQuiz.rows[0].id;
        } else {
            quizId = quizRes.rows[0].id;
            console.log('Mock official quiz already exists');
        }

        console.log(`Using Quiz ID: ${quizId}`);

        // Clear old mock questions for this quiz to avoid duplicates
        await client.query('DELETE FROM questions WHERE quiz_id = $1', [quizId]);

        // Insert all questions and options
        for (const q of mockQuestions) {
            const qRes = await client.query(
                'INSERT INTO questions (quiz_id, question_text, question_type) VALUES ($1, $2, $3) RETURNING id',
                [quizId, q.text, q.type]
            );
            const questionId = qRes.rows[0].id;

            for (const opt of q.options) {
                await client.query(
                    'INSERT INTO options (question_id, option_text, is_correct) VALUES ($1, $2, $3)',
                    [questionId, opt.text, opt.correct]
                );
            }
        }

        await client.query('COMMIT');
        console.log(`Successfully seeded ${mockQuestions.length} mock exam questions!`);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error seeding mock exam:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

seedMockExam();
