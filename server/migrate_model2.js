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
        text: "Depth first search always expands the node in the problem representation of a search tree.", type: "multiple_choice", options: [
            { text: "Minimum cost", correct: false },
            { text: "Shallower", correct: false },
            { text: "Child node", correct: false },
            { text: "Deepest", correct: true }
        ]
    },
    {
        text: "What kind of transmission medium is most appropriate to carry data in a computer network that is exposed to electrical interferences?", type: "multiple_choice", options: [
            { text: "Microwave", correct: false },
            { text: "Optical fiber", correct: false },
            { text: "Unshielded twisted pair", correct: false },
            { text: "Coaxial cable", correct: true }
        ]
    },
    {
        text: "Which of the following is a correct syntax to create an object of interface named Animal?", type: "multiple_choice", options: [
            { text: "Animal animal = new Animal();", correct: false },
            { text: "new Animal();", correct: false },
            { text: "It is not supported to create an object of Animal", correct: true },
            { text: "Interface Animal animal = new Animal();", correct: false }
        ]
    },
    {
        text: "Identify one which is preemption based algorithm when scheduling CPU:", type: "multiple_choice", options: [
            { text: "RR", correct: true },
            { text: "SJF", correct: false },
            { text: "Priority", correct: false },
            { text: "FCFS", correct: false }
        ]
    },
    {
        text: "What is the output of the following java program? class Flower { public Flower() { this(\"Rose\"); System.out.print(\"Flower.\"); } public Flower(String name) { System.out.print(\"I am \"+name); } } public class RoseTest extends Flower { public RoseTest() { super(); System.out.print(\"Hi there!\"); } public static void main(String[] args) { Flower flower = new RoseTest(); } }", type: "multiple_choice", options: [
            { text: "Hi there! Rose flower I am.", correct: false },
            { text: "I am Rose Flower. Hi there!", correct: true },
            { text: "I am Flower. Rose! Hi there!", correct: false },
            { text: "Hi there! I am Rose Flower.", correct: false }
        ]
    },
    {
        text: "Which of the following is true about MAC address?", type: "multiple_choice", options: [
            { text: "It is also known as logical address", correct: false },
            { text: "It is used for subnetting purpose", correct: false },
            { text: "It is represented by 128 bits", correct: false },
            { text: "It is commonly assigned by the manufacturer of the NIC", correct: true }
        ]
    },
    {
        text: "One of the following is true about lexical and syntax analyzers:", type: "multiple_choice", options: [
            { text: "Scanner is a co-routine of parser", correct: true },
            { text: "Lexical analyzer works on simple recursive constructs a language", correct: false },
            { text: "Syntax analyzer works on simple none recursive constructs a language", correct: false },
            { text: "Syntax analyzer is a co-routine of lexical analyzer", correct: false }
        ]
    },
    {
        text: "Which of the following is the least strong security encryption standard?", type: "multiple_choice", options: [
            { text: "WPA", correct: false },
            { text: "WEP", correct: true },
            { text: "WPA3", correct: false },
            { text: "WPA2", correct: false }
        ]
    },
    {
        text: "Which component of Active Directory provides a searchable catalog of objects across multiple domains in a forest?", type: "multiple_choice", options: [
            { text: "Domain", correct: false },
            { text: "Domain controller", correct: false },
            { text: "Global Catalog", correct: true },
            { text: "Sites", correct: false }
        ]
    },
    {
        text: "Consider a banking application that needs to store customer information such as name, address, and account balance. A Customer class that contains private fields for these attributes is created, as well as getter and setter methods to access and modify those fields. This allows us to keep the data private and enforce business logic within the class, while still allowing other parts of the program to interact with the object through well-defined interfaces. Which one of the following object-oriented concepts well fit with this application?", type: "multiple_choice", options: [
            { text: "Inheritance", correct: false },
            { text: "Encapsulation", correct: true },
            { text: "Polymorphism", correct: false },
            { text: "Abstraction", correct: false }
        ]
    },
    {
        text: "Type checking is one of the tasks performed by a compiler during:", type: "multiple_choice", options: [
            { text: "Semantic analysis", correct: true },
            { text: "Intermediate code generation", correct: false },
            { text: "Lexical analysis", correct: false },
            { text: "Syntax analysis", correct: false }
        ]
    },
    {
        text: "Precedence of regular expression in decreasing order is:", type: "multiple_choice", options: [
            { text: "*, +, .", correct: false },
            { text: "., *, +", correct: false },
            { text: "*, ., +", correct: false },
            { text: "+, ., *", correct: true }
        ]
    },
    {
        text: "The first step of machine learning is:", type: "multiple_choice", options: [
            { text: "Testing", correct: false },
            { text: "Modeling", correct: false },
            { text: "Data acquisition", correct: true },
            { text: "Data representation", correct: false }
        ]
    },
    {
        text: "Assume that production T -> A T*F, provided that T, *, and F are grammar symbols, is a final item of a given LR(0) item. How many grammar symbols will be popped from the parser stack?", type: "multiple_choice", options: [
            { text: "6 grammar symbols", correct: true },
            { text: "2 grammar symbols", correct: false },
            { text: "1 grammar symbols", correct: false },
            { text: "3 grammar symbols", correct: false }
        ]
    },
    {
        text: "All of the following are examples of integral data types EXCEPT:", type: "multiple_choice", options: [
            { text: "int", correct: false },
            { text: "short", correct: false },
            { text: "char", correct: false },
            { text: "double", correct: true }
        ]
    },
    {
        text: "A process stack does not contain one of the following, which one?", type: "multiple_choice", options: [
            { text: "PID of child process", correct: true },
            { text: "Local variables", correct: false },
            { text: "Return addresses", correct: false },
            { text: "Function parameters", correct: false }
        ]
    },
    {
        text: "A web based application model that used to add, modify and access objects hierarchically.", type: "multiple_choice", options: [
            { text: "RMI", correct: false },
            { text: "DOM", correct: true },
            { text: "MVC", correct: false },
            { text: "RPC", correct: false }
        ]
    },
    {
        text: "One of the operating system securities that identify each user of the system and associate the executing programs with those users. Which one?", type: "multiple_choice", options: [
            { text: "Separation", correct: false },
            { text: "Confidentiality", correct: false },
            { text: "Authentication", correct: true },
            { text: "Integrity", correct: false }
        ]
    },
    {
        text: "Which one of the following applications of network is used to assign IP address to hosts automatically?", type: "multiple_choice", options: [
            { text: "Mailing system", correct: false },
            { text: "DHCP", correct: true },
            { text: "File transfer protocol", correct: false },
            { text: "DNS", correct: false }
        ]
    },
    {
        text: "A Javascript popup box used to alert dialog displaying the text 'Welcome JS' is created by calling:", type: "multiple_choice", options: [
            { text: "alert.window(\"Welcome JS\");", correct: false },
            { text: "window(\"<alert>Welcome JS</alert>\");", correct: false },
            { text: "window(\"alert = \\\"Welcome JS\\\"\");", correct: false },
            { text: "window.alert(\"Welcome JS\");", correct: true }
        ]
    },
    {
        text: "The amortized time complexity of the dynamic array problem is?", type: "multiple_choice", options: [
            { text: "O(logn)", correct: false },
            { text: "O(nlogn)", correct: false },
            { text: "O(1)", correct: true },
            { text: "O(n)", correct: false }
        ]
    },
    {
        text: "Which of the following is not a cybercrime?", type: "multiple_choice", options: [
            { text: "Malware", correct: false },
            { text: "Denial of Service", correct: false },
            { text: "AES", correct: true },
            { text: "Man in the Middle", correct: false }
        ]
    },
    {
        text: "Which of the following is not essential component of a data communications system?", type: "multiple_choice", options: [
            { text: "Administrator", correct: true },
            { text: "Transmission media", correct: false },
            { text: "Sender", correct: false },
            { text: "Protocol", correct: false }
        ]
    },
    {
        text: "The relation book (title, price) contains the titles and prices of different books. Assuming that no two books have the same price, what does the following SQL query list? SELECT title FROM book as B WHERE (SELECT count(*) FROM book as T WHERE T.price > B.price) < 5", type: "multiple_choice", options: [
            { text: "Titles of the five most expensive books", correct: true },
            { text: "Title of the fifth most inexpensive book", correct: false },
            { text: "Titles of the four most expensive books", correct: false },
            { text: "Title of the fifth most expensive book", correct: false }
        ]
    },
    {
        text: "______ allow you to specify the style of your page elements (spacing, margins, etc.) separately from the structure of your document.", type: "multiple_choice", options: [
            { text: "Session", correct: false },
            { text: "Style declarations", correct: false },
            { text: "Text Editors", correct: false },
            { text: "Cascading Style Sheets", correct: true }
        ]
    },
    {
        text: "What are the advantages of arrays?", type: "multiple_choice", options: [
            { text: "Elements in an array cannot be sorted", correct: false },
            { text: "Index of first element of an array is 1", correct: false },
            { text: "Objects of mixed data types can be stored", correct: false },
            { text: "Easier to store elements of same data type", correct: true }
        ]
    },
    {
        text: "a+b* is equivalent to:", type: "multiple_choice", options: [
            { text: "b*a*", correct: true },
            { text: "(a*b*)*", correct: false },
            { text: "a*b+", correct: false },
            { text: "a*b*", correct: false }
        ]
    },
    {
        text: "Which of the following JavaScript cannot do?", type: "multiple_choice", options: [
            { text: "Handle to events, errors and exceptions", correct: false },
            { text: "to validate data", correct: false },
            { text: "to access database data and file system", correct: true },
            { text: "to manipulate HTML elements", correct: false }
        ]
    },
    {
        text: "The expression static_cast<int>(6.9) + static_cast<int>(7.9) evaluates to:", type: "multiple_choice", options: [
            { text: "14", correct: false },
            { text: "14.8", correct: false },
            { text: "15", correct: false },
            { text: "13", correct: true }
        ]
    },
    {
        text: "How can the index.php script access the email form element of the following HTML form? <form action='index.php' method='post'><input type='text' name='email'/></form>", type: "multiple_choice", options: [
            { text: "$_POST['text']", correct: false },
            { text: "$_GET['email']", correct: false },
            { text: "$_SESSION['text']", correct: false },
            { text: "$_POST['email']", correct: true }
        ]
    },
    {
        text: "Which of the following is a primary function of a domain controller in an Active Directory environment?", type: "multiple_choice", options: [
            { text: "User management", correct: false },
            { text: "File sharing", correct: false },
            { text: "Searching files", correct: false },
            { text: "Authentication", correct: true }
        ]
    },
    {
        text: "One is not correct about binary number system.", type: "multiple_choice", options: [
            { text: "The symbols used are 0 and 1", correct: false },
            { text: "It positional weighted number", correct: false },
            { text: "it also used as a machine language", correct: false },
            { text: "The base is 3", correct: true }
        ]
    },
    {
        text: "Which of the following act violates cyber security?", type: "multiple_choice", options: [
            { text: "Threat", correct: false },
            { text: "Exploit", correct: false },
            { text: "Attack", correct: true },
            { text: "Vulnerability", correct: false }
        ]
    },
    {
        text: "Amongst the ACID properties of a transaction, the 'Durability' property requires that the changes made to the database by a successful transaction persist:", type: "multiple_choice", options: [
            { text: "Always, even if there is a failure of any kind", correct: true },
            { text: "Except in case of a disk crash", correct: false },
            { text: "Except in case of an operating system crash", correct: false },
            { text: "Except in case of a power failure", correct: false }
        ]
    },
    {
        text: "Declares the host that's the most authoritative for the zone and, as such, is the best source of DNS information for the zone.", type: "multiple_choice", options: [
            { text: "DNS Start of Authority Record", correct: false },
            { text: "DNS A Record", correct: true },
            { text: "DNS NS Record", correct: false },
            { text: "DNS PTR Record", correct: false }
        ]
    },
    {
        text: "What is the best data type definition for Oracle when a field is alphanumeric and has a fixed length?", type: "multiple_choice", options: [
            { text: "LONG", correct: false },
            { text: "CHAR", correct: true },
            { text: "VARCHAR2", correct: false },
            { text: "NUMBER", correct: false }
        ]
    },
    {
        text: "Which of the following is not correct about PHP?", type: "multiple_choice", options: [
            { text: "Restrict users to access some pages of your website", correct: false },
            { text: "Encrypt and decrypt data using built-in algorithms", correct: false },
            { text: "Handle sessions of pages using setCookie() function", correct: true },
            { text: "Enable and disable cookies using setCookie() function", correct: false }
        ]
    },
    {
        text: "Which keyword is used for structure definition?", type: "multiple_choice", options: [
            { text: "None of them", correct: false },
            { text: "def_struct", correct: false },
            { text: "structure_def", correct: false },
            { text: "struct", correct: true }
        ]
    },
    {
        text: "An/A ______ is ideal when the style is applied to many pages.", type: "multiple_choice", options: [
            { text: "style sheet", correct: false },
            { text: "cascading style sheet", correct: false },
            { text: "internal style sheet", correct: false },
            { text: "external", correct: true }
        ]
    },
    {
        text: "The post-order traversal of a binary tree is O P Q R S T. Then possible pre-order traversal will be:", type: "multiple_choice", options: [
            { text: "T Q O P S R", correct: false },
            { text: "T Q O P S R", correct: true },
            { text: "T Q R S O P", correct: false },
            { text: "T O Q R P S", correct: false }
        ]
    },
    {
        text: "Regular expression are:", type: "multiple_choice", options: [
            { text: "Type 1 language", correct: false },
            { text: "Type 2 language", correct: false },
            { text: "Type 3 language", correct: true },
            { text: "Type 0 language", correct: false }
        ]
    },
    {
        text: "Which of the following is an infix expression?", type: "multiple_choice", options: [
            { text: "+ab", correct: false },
            { text: "abc+*", correct: false },
            { text: "(a + b)*(c + d)", correct: true },
            { text: "ab + c*", correct: false }
        ]
    },
    {
        text: "The data structure required to check whether an expression contains a balanced parenthesis is?", type: "multiple_choice", options: [
            { text: "Stack", correct: true },
            { text: "Array", correct: false },
            { text: "Queue", correct: false },
            { text: "Tree", correct: false }
        ]
    },
    {
        text: "What is the impact of not including a JOIN command when using multiple tables in a query?", type: "multiple_choice", options: [
            { text: "The query will not work - an error is generated", correct: false },
            { text: "All records in each table are associated with all records in the other tables", correct: true },
            { text: "The foreign keys in each table are linked to the primary keys in the other tables", correct: false },
            { text: "The primary keys in each table are joined together", correct: false }
        ]
    },
    {
        text: "Which of the following DDoS in mobile systems wait for the owner to trigger the cyber attack?", type: "multiple_choice", options: [
            { text: "Programs", correct: false },
            { text: "Virus", correct: false },
            { text: "Botnets", correct: true },
            { text: "Worms", correct: false }
        ]
    },
    {
        text: "Which one of the following is not true about stack-based shift-reduce parser?", type: "multiple_choice", options: [
            { text: "Initially the stack contains $ and starting none terminal of the grammar", correct: true },
            { text: "The parsing is successful if the stack is left with $ and the starting symbol of the grammar and the input buffer is left with $", correct: false },
            { text: "$ is used to mark the bottom of the stack and the right end of the input buffer", correct: false },
            { text: "The parser repeats shifting and reducing actions until the stack is empty or an error is happened", correct: false }
        ]
    },
    {
        text: "_____ limits who gains access to the database while _____ limits what a user can access within the database.", type: "multiple_choice", options: [
            { text: "Access authentication, view definition", correct: true },
            { text: "Data access, user monitoring", correct: false },
            { text: "Access authentication, user definition", correct: false },
            { text: "Access control, database security", correct: false }
        ]
    },
    {
        text: "Which of the following devices is layer 3(network Layer) device?", type: "multiple_choice", options: [
            { text: "Router", correct: true },
            { text: "Bridge", correct: false },
            { text: "Switch", correct: false },
            { text: "Hub", correct: false }
        ]
    },
    {
        text: "_____ is refers to the objective an artificial machine.", type: "multiple_choice", options: [
            { text: "Input", correct: false },
            { text: "Intermediate state", correct: false },
            { text: "Initial state", correct: false },
            { text: "Goal", correct: true }
        ]
    },
    {
        text: "Which one of the following is not the advantage of using randomized algorithms?", type: "multiple_choice", options: [
            { text: "Achieving worst case time-complexity.", correct: true },
            { text: "Efficiency in running time.", correct: false },
            { text: "Implementing problems requiring randomization.", correct: false },
            { text: "Simplicity of implementation.", correct: false }
        ]
    },
    {
        text: "The following java code snippet shows a class definition containing only parametrized constructor. public class Car { String type; String model; String color; public Car(String type, String model, String color) { this.type = type; this.model = model; this.color = color; } } Which of the following statement wrongly invokes the constructor?", type: "multiple_choice", options: [
            { text: "Car golf = new Car(\"Volkswagen\",\"Golf\",\"green\");", correct: false },
            { text: "new Car(\"Volkswagen\",\"Golf\",\"green\");", correct: false },
            { text: "Car focus = new Car(\"Ford\",\"Focus\",\"red\");", correct: false },
            { text: "Car auris = new Car(\"Toyota\",\"Auris\");", correct: true }
        ]
    },
    {
        text: "Which one of the following is different?", type: "multiple_choice", options: [
            { text: "DFS", correct: false },
            { text: "BFS", correct: false },
            { text: "Uninformed searching techniques", correct: false },
            { text: "Informed Searching", correct: true }
        ]
    },
    {
        text: "Which of these is not an objective for use-case modeling?", type: "multiple_choice", options: [
            { text: "To provide a basis for validation testing", correct: false },
            { text: "To define the functional and operational requirements", correct: false },
            { text: "To provide a description of end user and system interaction", correct: false },
            { text: "To define the hierarchy for the system", correct: true }
        ]
    },
    {
        text: "Which is the correct statement about operator overloading in C++?", type: "multiple_choice", options: [
            { text: "Only arithmetic operators can be overloaded", correct: false },
            { text: "Only non-arithmetic operators can be overloaded", correct: false },
            { text: "Precedence of operators are changed after overloading", correct: false },
            { text: "Associativity and precedence of operators does not change", correct: true }
        ]
    },
    {
        text: "Various new methods of dealing with applets that works by dividing the virtual address space up into equal-size regions, which is called.", type: "multiple_choice", options: [
            { text: "Trusted applet", correct: false },
            { text: "Untrusted applet", correct: false },
            { text: "Sandboxes", correct: true },
            { text: "Interpreter", correct: false }
        ]
    },
    {
        text: "One of the following is NOT the mechanism of the system threat that creates an environment to attack when operating system resources/user files are misused, which one?", type: "multiple_choice", options: [
            { text: "Trojan", correct: true },
            { text: "port scanning", correct: false },
            { text: "Worm", correct: false },
            { text: "denial of service", correct: false }
        ]
    },
    {
        text: "Suppose that you are given the following code snippet. Which one of the following statements is wrong about the given code snippet? abstract class Animal { public Animal(String name) { System.out.println(\"I am animal class Constructor\"); } abstract void sound(); final abstract void eat(); final void move() { } } public class Lion extends Animal { void sound() { } public static void main(String[] args) { } }", type: "multiple_choice", options: [
            { text: "It is possible to override the move() method in Lion class.", correct: true },
            { text: "The sound() method in the super class must be implemented in the subclass Lion", correct: false },
            { text: "The eat() method defined in Animal class is not supported", correct: false },
            { text: "It is must for the subclass to have at least one constructor.", correct: false }
        ]
    },
    {
        text: "Among the following set of problems listed below, identify the one which can be solved using divide and conquer strategy?", type: "multiple_choice", options: [
            { text: "Graph coloring problem", correct: false },
            { text: "Finding the maximum continuous sum in the array.", correct: true },
            { text: "N-queens problem.", correct: false },
            { text: "Minimum spanning tree problem.", correct: false }
        ]
    },
    {
        text: "Which of the following is true about FILE *fp?", type: "multiple_choice", options: [
            { text: "FILE is a keyword in C for representing files and fp is a variable of FILE type.", correct: false },
            { text: "FILE is a buffered stream", correct: false },
            { text: "FILE is a structure and fp is a pointer to the structure of FILE type", correct: true },
            { text: "FILE is a stream", correct: false }
        ]
    },
    {
        text: "What is an inline function?", type: "multiple_choice", options: [
            { text: "A function that is expanded at each call during execution", correct: true },
            { text: "A function that is not checked for semantic analysis", correct: false },
            { text: "A function that is called during compile time", correct: false },
            { text: "A function that is not checked for syntax errors", correct: false }
        ]
    },
    {
        text: "A linear collection of data elements where the linear node is given by means of pointer is called?", type: "multiple_choice", options: [
            { text: "Node list", correct: false },
            { text: "Primitive list", correct: false },
            { text: "Linked list", correct: true },
            { text: "Unordered list", correct: false }
        ]
    },
    {
        text: "Which of the following concept of FSA is used in the compiler?", type: "multiple_choice", options: [
            { text: "Code generation", correct: false },
            { text: "Parser", correct: false },
            { text: "Code optimization", correct: false },
            { text: "Lexical analysis", correct: true }
        ]
    },
    {
        text: "Which one of the following RAID level offers optimal performance and reliability?", type: "multiple_choice", options: [
            { text: "1", correct: false },
            { text: "0", correct: false },
            { text: "Any RAID level", correct: false },
            { text: "0+1", correct: true }
        ]
    },
    {
        text: "Which of the following IPv4 address belongs class B address?", type: "multiple_choice", options: [
            { text: "192.168.1.248", correct: false },
            { text: "224.1.120.29", correct: false },
            { text: "172.12.12.48", correct: true },
            { text: "121.12.12.8", correct: false }
        ]
    },
    {
        text: "Suppose you are an ORACLE DBA and you need to create a trigger on the EMPLOYEES table that monitors every row that is changed and places this information into the AUDIT_TABLE. What type of trigger do you create?", type: "multiple_choice", options: [
            { text: "FOR EACH ROW trigger on the AUDIT_TABLE table.", correct: false },
            { text: "Statement-level trigger on the EMPLOYEES table.", correct: false },
            { text: "FOR EACH ROW trigger on the EMPLOYEES table.", correct: true },
            { text: "Statement-level trigger on the AUDIT_TABLE table.", correct: false }
        ]
    },
    {
        text: "Sector 0 of the disk is called which is used to boot the computer.", type: "multiple_choice", options: [
            { text: "MBR", correct: true },
            { text: "Partition", correct: false },
            { text: "Bootblock", correct: false },
            { text: "Superblock", correct: false }
        ]
    },
    {
        text: "A register that manages the memory address of the instruction to be executed next.", type: "multiple_choice", options: [
            { text: "Address register", correct: false },
            { text: "Accumulator", correct: false },
            { text: "data register", correct: false },
            { text: "Program counter", correct: true }
        ]
    },
    {
        text: "Information transfer from one register to another is designated in symbolic form by means of a replacement operator is:", type: "multiple_choice", options: [
            { text: "Operation translation", correct: false },
            { text: "memory transfer", correct: false },
            { text: "Register transfer", correct: true },
            { text: "common bus system", correct: false }
        ]
    },
    {
        text: "The structure and behavior of various functional modules (HW and SW) of a digital computer as well as how these modules interact to meet the requirement of the user.", type: "multiple_choice", options: [
            { text: "computer specification", correct: false },
            { text: "computer application", correct: false },
            { text: "Computer architecture", correct: true },
            { text: "Computer organization", correct: false }
        ]
    },
    {
        text: "Which of the following is not a step in elimination of states procedure?", type: "multiple_choice", options: [
            { text: "Unify single transitions to multi transitions that contains union of input", correct: true },
            { text: "Unifying all the final states into one using e-transitions", correct: false },
            { text: "Get the resulting regular expression by direct calculation", correct: false },
            { text: "Remove states until there is only starting and accepting states", correct: false }
        ]
    },
    {
        text: "Which statement correctly differentiates functions and procedures?", type: "multiple_choice", options: [
            { text: "A function must return a value to the calling environment, whereas a procedure can return zero or more values to its calling environment.", correct: true },
            { text: "A function can be called only as part of a SQL statement, whereas a procedure can be called only as a PL/SQL statement.", correct: false },
            { text: "A function may return one or more values to the calling environment, whereas a procedure must return a single value to its calling environment.", correct: false },
            { text: "They only have syntax difference otherwise similar", correct: false }
        ]
    },
    {
        text: "If we have more than one accepting states or an accepting state with an outdegree, which of the following actions will be taken?", type: "multiple_choice", options: [
            { text: "removal of a state", correct: false },
            { text: "addition of new state", correct: false },
            { text: "more than one option is correct", correct: true },
            { text: "make the newly added state as final", correct: false }
        ]
    },
    {
        text: "You create some new tables and populate them with copies of your production data. You run reports on your new tables but your queries take a lot longer than on the original tables. What should you create to help speed up reads in the database?", type: "multiple_choice", options: [
            { text: "Primary key", correct: false },
            { text: "Index", correct: true },
            { text: "Stored procedure", correct: false },
            { text: "Default", correct: false }
        ]
    },
    {
        text: "Which types of system testing uses a procedure that demands resources in abnormal quantity, frequency or volume?", type: "multiple_choice", options: [
            { text: "Unit testing", correct: false },
            { text: "Performance testing", correct: false },
            { text: "Security testing", correct: false },
            { text: "Stress testing", correct: true },
            { text: "Recovery testing", correct: false }
        ]
    },
    {
        text: "A language is regular if and only if:", type: "multiple_choice", options: [
            { text: "accepted by LBA", correct: false },
            { text: "accepted by PDA", correct: false },
            { text: "accepted by DFA", correct: true },
            { text: "accepted by Turing machine", correct: false }
        ]
    },
    {
        text: "A Double-ended queue supports operations such as adding and removing items from both the sides of the queue. They support four operations like addFront(adding item to top of the queue), addRear(adding item to the bottom of the queue), removeFront(removing item from the top of the queue) and removeRear(removing item from the bottom of the queue). You are given only stacks to implement this data structure. You can implement only push and pop operations. What are the total number of stacks required for this operation? (you can reuse the stack)", type: "multiple_choice", options: [
            { text: "2", correct: true },
            { text: "4", correct: false },
            { text: "3", correct: false },
            { text: "1", correct: false }
        ]
    },
    {
        text: "The UML diagram that depicts the interaction between entities such as objects, classes, user interfaces etc participated in an execution of a certain use case is known as:", type: "multiple_choice", options: [
            { text: "Use case modeling", correct: true },
            { text: "Class diagram", correct: false },
            { text: "Sequence diagram", correct: false },
            { text: "State diagram", correct: false }
        ]
    },
    {
        text: "Which of the following is true about spanning trees?", type: "multiple_choice", options: [
            { text: "A spanning tree will have n-1 vertices, if the original graph has n-number of vertices.", correct: false },
            { text: "A spanning tree will have n+1 edge, if the original graph has n-number of vertices.", correct: false },
            { text: "A spanning tree will have n edges, if the original graph has n-number of vertices.", correct: false },
            { text: "A spanning tree will have n-1 edges, if the original graph has n-number of vertices.", correct: true }
        ]
    },
    {
        text: "The fundamental building block of all digital logic circuits.", type: "multiple_choice", options: [
            { text: "gates", correct: true },
            { text: "Adder", correct: false },
            { text: "Data", correct: false },
            { text: "Circuit", correct: false }
        ]
    },
    {
        text: "Which one of the following statement is TRUE?", type: "multiple_choice", options: [
            { text: "A relation R is in 3NF if every non-prime attribute of R is fully functionally dependent on every key of R", correct: false },
            { text: "Every relation in 3NF is also in BCNF", correct: false },
            { text: "No relation be both in BCNF & 3NF", correct: false },
            { text: "Every relation in BCNF is also in 3NF", correct: true }
        ]
    },
    {
        text: "Which tool is used for managing and controlling network access and security policies on a Windows Server?", type: "multiple_choice", options: [
            { text: "Network load balancing manager", correct: false },
            { text: "Group policy management", correct: false },
            { text: "Organizational Unit", correct: true },
            { text: "Container", correct: false }
        ]
    },
    {
        text: "The most basic digital arithmetic circuit which Performs the addition of two binary digits.", type: "multiple_choice", options: [
            { text: "decoder", correct: false },
            { text: "multiplexer", correct: false },
            { text: "Full adder", correct: false },
            { text: "Half adder", correct: true }
        ]
    },
    {
        text: "What is the preferred way for adding a background color in HTML?", type: "multiple_choice", options: [
            { text: "<background color=\"yellow\">text</background>", correct: false },
            { text: "<body style=\"background-color:yellow\">", correct: true },
            { text: "<body background=\"yellow\">", correct: false },
            { text: "<background>yellow</background>", correct: false }
        ]
    },
    {
        text: "Which system development method executes the phases of the SDLC is linear manner?", type: "multiple_choice", options: [
            { text: "XP", correct: false },
            { text: "Scrum", correct: false },
            { text: "Prototyping", correct: false },
            { text: "Waterfall model", correct: true }
        ]
    },
    {
        text: "Which one of the following is a correct representation of the fact 'Abebe is father of Natan' using first order logic in prolog?", type: "multiple_choice", options: [
            { text: "Father(abebe).", correct: false },
            { text: "Father(natan).", correct: false },
            { text: "father(abebe, natan).", correct: true },
            { text: "black(abebe).", correct: false }
        ]
    },
    {
        text: "Suppose there is a database that maintains business activities of the company. In the database Sales data is stored into two tables - one for recent sales (the past six months) and one for older or archived sales data. You are tasked with creating a solution to allow managers to be able to see monthly sales data from the previous month and for the same period a year ago. What would you do?", type: "multiple_choice", options: [
            { text: "Create a trigger to identify when data is added and query the new data.", correct: false },
            { text: "Create a view that joins data from both tables.", correct: true },
            { text: "Create indexes on the two tables based on the date and query the tables individually.", correct: false },
            { text: "Combine the data into a single table and query it.", correct: false }
        ]
    },
    {
        text: "Given the following set of unbreakable items with their associated values in Birr and weights in kilograms in a table, what is the maximum profit that can be made having a knapsack with a capacity of 6 kg. (Items: Value/Br: 60,20,32,15,40,36 | Weight/Kg: 4,2,2,1,3,2)", type: "multiple_choice", options: [
            { text: "96Br", correct: true },
            { text: "88Br", correct: false },
            { text: "98Br", correct: false },
            { text: "86Br", correct: false }
        ]
    },
    {
        text: "Which of the following is defined as an attempt to harm, damage or cause threat to a system or network?", type: "multiple_choice", options: [
            { text: "Cyber Attack", correct: true },
            { text: "Digital crime", correct: false },
            { text: "System hijacking", correct: false },
            { text: "Threats", correct: false }
        ]
    },
    {
        text: "Which of the following is an internet scam done by cyber-criminals where the user is convinced digitally to provide confidential information?", type: "multiple_choice", options: [
            { text: "MiTM attack", correct: false },
            { text: "Phishing attack", correct: true },
            { text: "Website attack", correct: false },
            { text: "DoS attack", correct: false }
        ]
    },
    {
        text: "Polymorphism reduces the effort required to extend an object system by:", type: "multiple_choice", options: [
            { text: "Making objects more dependent on one another", correct: false },
            { text: "Enabling a number of different operations to share the same name", correct: true },
            { text: "Coupling objects together more tightly", correct: false },
            { text: "Removing the barriers imposed by encapsulation", correct: false }
        ]
    },
    {
        text: "Which of the following backup technique is most space efficient?", type: "multiple_choice", options: [
            { text: "RAID Technology", correct: false },
            { text: "Incremental backup", correct: true },
            { text: "Differential backup", correct: false },
            { text: "Full backup", correct: false }
        ]
    },
    {
        text: "User views are included as part of which schema?", type: "multiple_choice", options: [
            { text: "External", correct: true },
            { text: "Conceptual", correct: false },
            { text: "Internal", correct: false },
            { text: "Physical", correct: false }
        ]
    },
    {
        text: "Which one of the following is wrong about interface?", type: "multiple_choice", options: [
            { text: "An interface can create an object of its own", correct: true },
            { text: "Interface is used to achieve full abstraction, loss coupling and multiple inheritance", correct: false },
            { text: "The default variable modifiers in an interface are public, static and final", correct: false },
            { text: "Methods in an interface are abstract, and public by default", correct: false }
        ]
    },
    {
        text: "The action of the Simple reflex agent completely depends upon:", type: "multiple_choice", options: [
            { text: "Perception history", correct: false },
            { text: "Learning theory", correct: true },
            { text: "Utility functions", correct: false },
            { text: "Current perception", correct: false }
        ]
    }
];

async function seedMockExam() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        let quizRes = await client.query('SELECT id FROM quizzes WHERE title = $1', ['exit_exam3']);
        let quizId;

        if (quizRes.rows.length === 0) {
            console.log('Inserting mock official quiz 2...');
            const courseRes = await client.query('SELECT id FROM courses LIMIT 1');
            const courseId = courseRes.rows.length ? courseRes.rows[0].id : null;

            const insertQuiz = await client.query(
                'INSERT INTO quizzes (title, is_official, course_id) VALUES ($1, $2, $3) RETURNING id',
                ['exit_exam3', true, courseId]
            );
            quizId = insertQuiz.rows[0].id;
        } else {
            quizId = quizRes.rows[0].id;
            console.log('Mock official quiz 2 already exists');
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
        console.log(`Successfully seeded ${mockQuestions.length} questions from Model 2!`);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error seeding mock exam:', err);
    } finally {
        client.release();
        pool.end();
    }
}

seedMockExam();