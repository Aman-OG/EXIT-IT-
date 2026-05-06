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
    }
];

async function seedMockExam() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        let quizRes = await client.query('SELECT id FROM quizzes WHERE title = $1', ['exit_exam5']);
        let quizId;

        if (quizRes.rows.length === 0) {
            console.log('Inserting exam 5 quiz...');
            const courseRes = await client.query('SELECT id FROM courses LIMIT 1');
            const courseId = courseRes.rows.length ? courseRes.rows[0].id : null;

            const insertQuiz = await client.query(
                'INSERT INTO quizzes (title, is_official, course_id) VALUES ($1, $2, $3) RETURNING id',
                ['exit_exam5', true, courseId]
            );
            quizId = insertQuiz.rows[0].id;
        } else {
            quizId = quizRes.rows[0].id;
            console.log('exam 5 quiz already exists');
        }

        console.log(`Using Quiz ID: ${quizId}`);

        await client.query('DELETE FROM questions WHERE quiz_id = $1', [quizId]);

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
        console.log(`Successfully seeded ${mockQuestions.length} questions from exam 5!`);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error seeding mock exam:', err);
    } finally {
        client.release();
        pool.end();
    }
}

seedMockExam();