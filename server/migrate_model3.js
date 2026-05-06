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
        text: "Which one of the following directories contains the configuration files?", type: "multiple_choice", options: [
            { text: "/bin/.", correct: false },
            { text: "/root/.", correct: false },
            { text: "/dev/.", correct: false },
            { text: "/etc/.", correct: true }
        ]
    },
    {
        text: "The statement 'x = 3 + 4*4' is executed. In this case what value will be assigned to the numeric variable x?", type: "multiple_choice", options: [
            { text: "92", correct: false },
            { text: "20", correct: false },
            { text: "19", correct: true },
            { text: "234", correct: false }
        ]
    },
    {
        text: "The result of the following Java code will be?", type: "multiple_choice", options: [
            { text: "Runtime error", correct: false },
            { text: "0", correct: false },
            { text: "05", correct: false },
            { text: "Compilation Error", correct: true }
        ]
    },
    {
        text: "Identify the necessary tool for creating and testing your android apps on different virtual devices.", type: "multiple_choice", options: [
            { text: "IntelliJ IDEA", correct: false },
            { text: "Android SDK tools and platform tools", correct: false },
            { text: "A system image for the Android emulator", correct: false },
            { text: "Android SDK", correct: true }
        ]
    },
    {
        text: "What command is used to show and create files?", type: "multiple_choice", options: [
            { text: "cat", correct: true },
            { text: "vi", correct: false },
            { text: "ed", correct: false },
            { text: "lyrix", correct: false }
        ]
    },
    {
        text: "_______ is a database schema that depicts key dependencies between the primary key and foreign key.", type: "multiple_choice", options: [
            { text: "Database Diagram", correct: false },
            { text: "Relation Schema", correct: false },
            { text: "Schema Diagram", correct: false },
            { text: "ER Diagram", correct: true }
        ]
    },
    {
        text: "What is the importance of ssh command?", type: "multiple_choice", options: [
            { text: "to restrict actions available to users", correct: false },
            { text: "performed in a synchronous way", correct: false },
            { text: "to connect remote hosts via an authenticated and encrypted channel", correct: true },
            { text: "performed in real-time", correct: false },
            { text: "to restricted set of commands", correct: false }
        ]
    },
    {
        text: "_______ is implemented by combining methods and attribute into a class.", type: "multiple_choice", options: [
            { text: "Abstraction", correct: false },
            { text: "Polymorphism", correct: false },
            { text: "Inheritance", correct: false },
            { text: "Encapsulation", correct: true }
        ]
    },
    {
        text: "_______ is a valid name for a variable?", type: "multiple_choice", options: [
            { text: "T4 Tutorials", correct: false },
            { text: "T4_Tutorials", correct: true },
            { text: "4 Tutorials", correct: false },
            { text: "T4.Tutorials", correct: false }
        ]
    },
    {
        text: "_______ describe when an activity will start interacting with the user.", type: "multiple_choice", options: [
            { text: "onResume", correct: false },
            { text: "onDestroy", correct: false },
            { text: "onStop", correct: false },
            { text: "onCreate", correct: true }
        ]
    },
    {
        text: "You have just replaced a processor in a computer and now need to add a cooling to attach the cooling system to the processor?", type: "multiple_choice", options: [
            { text: "Thermal paste", correct: false },
            { text: "Heat sink", correct: true },
            { text: "Superglue", correct: false },
            { text: "Fan", correct: false }
        ]
    },
    {
        text: "Which one of the following access methods used in a dedicated management channel?", type: "multiple_choice", options: [
            { text: "Telnet", correct: false },
            { text: "In-band", correct: true },
            { text: "SSH", correct: false },
            { text: "MAC", correct: false }
        ]
    },
    {
        text: "What is the proper syntax when using a message dialog box?", type: "multiple_choice", options: [
            { text: "MessageBox.Show \"Hi There\",\"Hi\"", correct: false },
            { text: "MessageBox.Show Hi There,Hi", correct: false },
            { text: "MessageBox.Show(\"Hi\",\"Hi\")", correct: true },
            { text: "MessageBox.Show(Hi there,Hi)", correct: false }
        ]
    },
    {
        text: "During installing a new video card into a desktop computer, what type of expansion slot is preferred today for high performance graphics adapters?", type: "multiple_choice", options: [
            { text: "AGP", correct: false },
            { text: "SATA", correct: false },
            { text: "PCI", correct: false },
            { text: "PCIe", correct: true }
        ]
    },
    {
        text: "Assume: Biruk wants to send a secure message M to Alem, and they want to assure its integrity and confidentiality. How do they make it possible if they use public crypto? (Consider public and private key pair K+B, and K-B respectively for Biruk, K+A, and K-A respectively for Alem).", type: "multiple_choice", options: [
            { text: "K+B(K-A-(M))", correct: true },
            { text: "K+B(K-A-(M))", correct: false },
            { text: "K-B(K-A-(M))", correct: false },
            { text: "K-A-(K-A(M))", correct: false }
        ]
    },
    {
        text: "Which of the following approaches is best for state decision support system software project management activities?", type: "multiple_choice", options: [
            { text: "Hybrid approach", correct: false },
            { text: "Activity-based approach", correct: true },
            { text: "Product-based approach", correct: false },
            { text: "Project execution", correct: false }
        ]
    },
    {
        text: "Assume: a computer lab where student demands the administrator access to a Windows 11 system to install SQL Server; but that right should not be given to the student unless he/she is member of an employee. Which principle of cyber security is considered here?", type: "multiple_choice", options: [
            { text: "Separation of privileges", correct: false },
            { text: "Fail-safe", correct: false },
            { text: "Open design", correct: false },
            { text: "Least privileges", correct: true }
        ]
    },
    {
        text: "Which one of the following creates a connection-oriented connection that provides reliable end-to-end transfer and uses window mechanism for control?", type: "multiple_choice", options: [
            { text: "Transport layer", correct: false },
            { text: "Internet protocol", correct: false },
            { text: "Session layer", correct: false },
            { text: "Transmission Control protocol", correct: true }
        ]
    },
    {
        text: "In order to establish a neighborship, which is a need for EIGRP routers?", type: "multiple_choice", options: [
            { text: "Matching areas", correct: false },
            { text: "Matching delay metrics", correct: false },
            { text: "Matching bandwidth metrics", correct: false },
            { text: "Matching K metrics", correct: true }
        ]
    },
    {
        text: "_______ is HTTP status code for client error such as page not found.", type: "multiple_choice", options: [
            { text: "5xx", correct: false },
            { text: "1xx", correct: false },
            { text: "3xx", correct: false },
            { text: "4xx", correct: true }
        ]
    },
    {
        text: "Which of the following is a physical memory format installed directly in today's desktop computer system?", type: "multiple_choice", options: [
            { text: "SSD", correct: false },
            { text: "eMMC", correct: false },
            { text: "DIMM", correct: true },
            { text: "HDD", correct: false }
        ]
    },
    {
        text: "In public key encryption, if A wants to send an encrypted message to B, which statement is true?", type: "multiple_choice", options: [
            { text: "A encrypts message using B's private key", correct: false },
            { text: "A encrypts message using B's public key", correct: true },
            { text: "A encrypts message using his private key", correct: false },
            { text: "A encrypts message using public key", correct: false }
        ]
    },
    {
        text: "_______ is the default file system type of Linux.", type: "multiple_choice", options: [
            { text: "ext2", correct: true },
            { text: "ext3", correct: false },
            { text: "ext", correct: false },
            { text: "minix", correct: false }
        ]
    },
    {
        text: "Select the task involves when you write object-oriented programs.", type: "multiple_choice", options: [
            { text: "Creating class, which are specific instances of objects", correct: false },
            { text: "Creating applications that manipulate or use objects", correct: true },
            { text: "Creating objects, which are blueprint for classes", correct: false },
            { text: "Creating a GUI environment for users is a natural use for object orientation", correct: false }
        ]
    },
    {
        text: "What will be the output of the following statement? txtBox.Text = FormatCurrency(1234.567)", type: "multiple_choice", options: [
            { text: "$1,234.57", correct: true },
            { text: "1,234.57", correct: false },
            { text: "$1234.567", correct: false },
            { text: "$1234.57", correct: false }
        ]
    },
    {
        text: "One of the following cannot measure the quality of an abstraction?", type: "multiple_choice", options: [
            { text: "sufficiency", correct: false },
            { text: "coupling", correct: true },
            { text: "primitiveness", correct: false },
            { text: "ease of use", correct: false }
        ]
    },
    {
        text: "Which OSI reference model layer is responsible for translating data in a form that can be understood by the receiver?", type: "multiple_choice", options: [
            { text: "Application layer", correct: false },
            { text: "Presentation layer", correct: true },
            { text: "Session layer", correct: false },
            { text: "Transport layer", correct: false }
        ]
    },
    {
        text: "One of the following is not the disadvantage of simple file processing?", type: "multiple_choice", options: [
            { text: "Data redundancy and inconsistency", correct: false },
            { text: "Data Separation and isolation", correct: false },
            { text: "Concurrent access anomalies", correct: false },
            { text: "Program-Data independence", correct: true }
        ]
    },
    {
        text: "A system is in a _______ state if there exists a set of transactions such that every transaction in the set is waiting for another transaction in the set.", type: "multiple_choice", options: [
            { text: "Ready", correct: false },
            { text: "Waiting", correct: false },
            { text: "Idle", correct: false },
            { text: "Deadlock", correct: true }
        ]
    },
    {
        text: "About the parts of a router, which of the following statements is true?", type: "multiple_choice", options: [
            { text: "A backup version of the ISO utilized during the boot process is kept in NVRAM", correct: false },
            { text: "ROM contains diagnostics that are run on the hardware modules", correct: true },
            { text: "A configuration file used during the boot process is permanently stored in RAM", correct: false },
            { text: "The most recent and updated configuration files are located in the ROM", correct: false }
        ]
    },
    {
        text: "_______ is the tag for the heading that is the largest and the most bold.", type: "multiple_choice", options: [
            { text: "H3", correct: false },
            { text: "H4", correct: false },
            { text: "H2", correct: false },
            { text: "H1", correct: true }
        ]
    },
    {
        text: "Which of the following is true regarding the command switchport mode dynamic auto?", type: "multiple_choice", options: [
            { text: "The interface will remain an access link if the native VLAN is changed", correct: false },
            { text: "The interface will become a trunk if requested on the neighboring port", correct: true },
            { text: "The interface will become a trunk if the neighboring port is configured the same", correct: false },
            { text: "The interface will remain an access link if the neighboring port is configured as a trunk", correct: false }
        ]
    },
    {
        text: "Routing loops are not a problem for link-state protocols like distance-vector protocols. Why?", type: "multiple_choice", options: [
            { text: "Link-state protocols require routers to maintain their own topology database of the network", correct: false },
            { text: "Link-state protocols share the topology database between all routers", correct: true },
            { text: "Link-state protocols use multiple routes to the same destination", correct: false },
            { text: "Link-state protocols allow routers to maintain a link-state database of all routers", correct: false }
        ]
    },
    {
        text: "_______ is a program that executes compiled Java code on a specific platform.", type: "multiple_choice", options: [
            { text: "Java programming manual", correct: false },
            { text: "Eclipse Editor", correct: false },
            { text: "Java Compiler", correct: false },
            { text: "Java Virtual Machine", correct: true }
        ]
    },
    {
        text: "Which factor that measures the quality of the management process?", type: "multiple_choice", options: [
            { text: "Budget management", correct: false },
            { text: "project team", correct: true },
            { text: "project plan", correct: false },
            { text: "Results", correct: false }
        ]
    },
    {
        text: "In case of any shutdown during transaction before commit, which of the following statement is done automatically?", type: "multiple_choice", options: [
            { text: "Rollback", correct: true },
            { text: "Commit", correct: false },
            { text: "Flashback", correct: false },
            { text: "View", correct: false }
        ]
    },
    {
        text: "In object-oriented development through which diagrams we are not analyze the dynamic semantics of problem or its implementation?", type: "multiple_choice", options: [
            { text: "script diagram", correct: false },
            { text: "interaction diagram", correct: false },
            { text: "process diagrams", correct: true },
            { text: "state transaction diagrams", correct: false }
        ]
    },
    {
        text: "If a method contains a local variable with the same as one of its class's the local variable _______ the field in the method's scope.", type: "multiple_choice", options: [
            { text: "import", correct: false },
            { text: "shadows", correct: true },
            { text: "class", correct: false },
            { text: "collector", correct: false }
        ]
    },
    {
        text: "On a router, you have numerous routes set up. What command only displays static routes?", type: "multiple_choice", options: [
            { text: "Router#show ip routes static", correct: false },
            { text: "Router#show ip routes", correct: true },
            { text: "Router#show ip static routes", correct: false },
            { text: "Router#show static routes", correct: false }
        ]
    },
    {
        text: "What is the correct HTML code for referring an external javascript?", type: "multiple_choice", options: [
            { text: "<script>mystyle.css</script>", correct: false },
            { text: "<script href=\"myscript.js\" type=\"text/javascript\"></script>", correct: false },
            { text: "<style src=\"myscript.js\"></style>", correct: false },
            { text: "<script src=\"myscript.js\" type=\"text/javascript\"></script>", correct: true }
        ]
    },
    {
        text: "The correct order of query optimization is _______", type: "multiple_choice", options: [
            { text: "Querying, Scanning, Validating, parsing", correct: false },
            { text: "Querying, parsing, validating, scanning", correct: false },
            { text: "Querying, scanning, parsing, validating", correct: true },
            { text: "Querying, validating, Scanning, Parsing", correct: false }
        ]
    },
    {
        text: "Suppose that the selector in a select Case block is the string variable myVar. Which of the following Case clause is invalid?", type: "multiple_choice", options: [
            { text: "Case \"Admas\"", correct: false },
            { text: "Case \"739\"", correct: false },
            { text: "Case (myCar.Substring(0,1))", correct: true },
            { text: "Case myVar.Length", correct: false }
        ]
    },
    {
        text: "What programming language is used to create system calls in UNIX?", type: "multiple_choice", options: [
            { text: "C++", correct: false },
            { text: "Assembly language", correct: false },
            { text: "Fortran", correct: false },
            { text: "C", correct: true }
        ]
    },
    {
        text: "Which of the following operations is utilized on java to allocate memory to an array variable?", type: "multiple_choice", options: [
            { text: "New malloc", correct: false },
            { text: "new", correct: true },
            { text: "malloc", correct: false },
            { text: "alloc", correct: false }
        ]
    },
    {
        text: "When you design a class diagram, which class hierarchies' relationship you are not going to apply?", type: "multiple_choice", options: [
            { text: "Aggregation", correct: false },
            { text: "Application", correct: true },
            { text: "Instantiation", correct: false },
            { text: "Association", correct: false }
        ]
    },
    {
        text: "Which information does the TCP header contain but the UDP header does not?", type: "multiple_choice", options: [
            { text: "checksum", correct: false },
            { text: "Source port", correct: false },
            { text: "Window", correct: true },
            { text: "Application layer data", correct: false }
        ]
    },
    {
        text: "Among the four frames of organization _______ addresses the question flow roles and responsibilities coordination and control are run?", type: "multiple_choice", options: [
            { text: "Human resources", correct: false },
            { text: "political", correct: false },
            { text: "symbolic", correct: false },
            { text: "Structure", correct: true }
        ]
    },
    {
        text: "What needs to be configured according to the topology below to allow traffic to be routed to the host if it enters routers A with the destination address 198.44.4.217?", type: "multiple_choice", options: [
            { text: "RouterA(config)#ip route 198.44.4.0 255.255.255.0 198.44.4.5", correct: false },
            { text: "RouterA(config)#ip route 198.44.4.0 255.255.255.0 fast 0/1", correct: false },
            { text: "nothing needs to be done", correct: true },
            { text: "RouterA(config)#ip route 198.44.4.0/24 fast 0/1", correct: false }
        ]
    },
    {
        text: "Assume a concept denoted by X→Y, between two sets of attributes X and Y that are subsets of a relation R specifies a constraint on the possible tuples that can form a relation state r of R. The constraint is that, for any two tuples t1 and t2 in r that have t1[X]=t2[X], they must also have t1[Y]=t2[Y]. Which normalization level describes this concept?", type: "multiple_choice", options: [
            { text: "1NF", correct: false },
            { text: "3NF", correct: false },
            { text: "BCNF", correct: false },
            { text: "2NF", correct: true }
        ]
    },
    {
        text: "Identify the function that changes the output of intSalary = inputBox(\"What is your salary\") into numerical representation.", type: "multiple_choice", options: [
            { text: "Convert()", correct: false },
            { text: "Val()", correct: true },
            { text: "Int()", correct: false },
            { text: "Parse()", correct: false }
        ]
    },
    {
        text: "What command will stop all plain-text password display in a router configuration files for unencrypted password?", type: "multiple_choice", options: [
            { text: "Router(config)# enable password secret", correct: false },
            { text: "Router(config)# service password-encryption", correct: true },
            { text: "Router(config)# service password encryption", correct: false },
            { text: "Router(config)# service-password-encryption", correct: false }
        ]
    },
    {
        text: "A communication between application and the android Operating System is handled by _______", type: "multiple_choice", options: [
            { text: "broadcast receiver", correct: false },
            { text: "service", correct: false },
            { text: "content provider", correct: false },
            { text: "Activities", correct: true }
        ]
    },
    {
        text: "Which one of the following statements correctly describe the feature of object-oriented programming?", type: "multiple_choice", options: [
            { text: "objects are a characteristic that define an attribute; they are properties of the attribute", correct: false },
            { text: "inheritance allows you to treat all of object's methods and data as a single entity", correct: false },
            { text: "A method is a self-contained block of program code that carries out some action similar to a procedure in a procedural program", correct: true },
            { text: "encapsulation allows a class to be a subclass of a superclass and thereby inherit public and protected variables and method of the superclass", correct: false }
        ]
    },
    {
        text: "Assume: Dawit created some nested tags as displayed here: <p><b><i>Peace!</i></b></p>. Did he perform valid nesting? Why?", type: "multiple_choice", options: [
            { text: "No, though the first part is right the second part should be </p></b></i>", correct: false },
            { text: "No, because paragraph tags need to be right before the actual text", correct: false },
            { text: "Yes, because the tags are nested correctly", correct: true },
            { text: "No, because italic must always come before bold tags", correct: false }
        ]
    },
    {
        text: "Which one of the following assigns the value 3 to the 0th index of the temp array?", type: "multiple_choice", options: [
            { text: "temp[0]=3;", correct: true },
            { text: "temp[3]=0;", correct: false },
            { text: "3=temp[0];", correct: false },
            { text: "temp(0)=3", correct: false }
        ]
    },
    {
        text: "If you want to display an image without any text around it, you should nest it inside what tag(s)?", type: "multiple_choice", options: [
            { text: "<p>", correct: false },
            { text: "<p:img>", correct: false },
            { text: "<img><p>", correct: true },
            { text: "<img : p>", correct: false }
        ]
    },
    {
        text: "Referencing the following HTML listing, how would you style only the first paragraph inside the footer element to have a smaller font size?", type: "multiple_choice", options: [
            { text: "footer:p:first-child{font-size:x-small;}", correct: false },
            { text: "footer p.first-child{font-size:x-small;}", correct: false },
            { text: "footer=>p,first-child{font-size:x-small;}", correct: false },
            { text: "footer p:first-child{font-size:x-small;}", correct: true }
        ]
    },
    {
        text: "Eavesdropping and packet sniffing are considered to be attacks of _______", type: "multiple_choice", options: [
            { text: "Confidentiality", correct: true },
            { text: "Authentication", correct: false },
            { text: "Integrity", correct: false },
            { text: "Non-repudiation", correct: false }
        ]
    },
    {
        text: "_______ is threats of a database, which can occur due to creation, insertion, updating, changing the status of data, and deletion.", type: "multiple_choice", options: [
            { text: "loss of accountability", correct: false },
            { text: "loss of confidentiality", correct: false },
            { text: "loss of availability", correct: false },
            { text: "loss of integrity", correct: true }
        ]
    },
    {
        text: "OSPF uses what multicast address for neighbor discovery?", type: "multiple_choice", options: [
            { text: "224.0.0.6", correct: false },
            { text: "224.0.0.7", correct: false },
            { text: "224.0.0.5", correct: true },
            { text: "224.0.0.4", correct: false }
        ]
    },
    {
        text: "What command alters the group owner of a file?", type: "multiple_choice", options: [
            { text: "group", correct: false },
            { text: "chgrp", correct: true },
            { text: "cgrp", correct: false },
            { text: "change", correct: false }
        ]
    },
    {
        text: "Assume the relation staff(eid:integer, ename:string, age:integer, salary:real) write SQL statement that increases employee salary by 5%?", type: "multiple_choice", options: [
            { text: "UPDATE staff SET salary=salary*1.05", correct: true },
            { text: "CHANGE staff SET salary=salary + 0.05", correct: false },
            { text: "ALTER staff SET salary = 0.05", correct: false },
            { text: "MODIFY staff SET salary = salary*.05", correct: false }
        ]
    },
    {
        text: "Digital signatures are primarily designed to provide additional protection with electronic messages in order to ensure:", type: "multiple_choice", options: [
            { text: "message deletion", correct: false },
            { text: "message modification", correct: false },
            { text: "message read by unauthorized party", correct: false },
            { text: "sender verification", correct: true }
        ]
    },
    {
        text: "Which of the following variable holds information about the web server and page?", type: "multiple_choice", options: [
            { text: "$_SESSION[]", correct: false },
            { text: "$_SERVER[]", correct: true },
            { text: "$_POST[]", correct: false },
            { text: "$_REQUEST[]", correct: false }
        ]
    },
    {
        text: "Which tag used to add a background color for all <h1> elements?", type: "multiple_choice", options: [
            { text: "h1.all{background-color:#FFFFF}", correct: false },
            { text: "all.h1{background-color:#FFFFF}", correct: false },
            { text: "h1{background-color:#FFFFF}", correct: true },
            { text: "All", correct: false }
        ]
    },
    {
        text: "Application-associated processing in the background is handled by:", type: "multiple_choice", options: [
            { text: "service", correct: true },
            { text: "broadcast receivers", correct: false },
            { text: "activities", correct: false },
            { text: "content provider", correct: false }
        ]
    },
    {
        text: "Which function is operated in layer 2 (function of a switch)?", type: "multiple_choice", options: [
            { text: "Determining the forwarding interfaces based upon the destination MAC address and tables", correct: false },
            { text: "Learning the MAC address by examining the destination MAC addresses", correct: true },
            { text: "Repeating the electrical signal to all ports", correct: false },
            { text: "Forwarding the data based upon logical addressing", correct: false }
        ]
    },
    {
        text: "Which function is not relevant to protect your site from characters that can potentially do damage to your system?", type: "multiple_choice", options: [
            { text: "urlencode()", correct: false },
            { text: "addslashes()", correct: false },
            { text: "mysql_real_escape_string()", correct: false },
            { text: "eval()", correct: true }
        ]
    },
    {
        text: "The _______ notation in a relative path of hypertext reference matches:", type: "multiple_choice", options: [
            { text: "Open the parent folder", correct: false },
            { text: "Go down a folder", correct: true },
            { text: "Create a folder", correct: false },
            { text: "Search a folder", correct: false }
        ]
    },
    {
        text: "_______ defined for a simple connectionless communication that provides no error recovery and no delivery guarantee.", type: "multiple_choice", options: [
            { text: "SMTP", correct: false },
            { text: "IP", correct: false },
            { text: "UDP", correct: true },
            { text: "FTP", correct: false }
        ]
    },
    {
        text: "The super global array variables are accessible:", type: "multiple_choice", options: [
            { text: "Only inside functions", correct: false },
            { text: "Only outside functions", correct: false },
            { text: "Anywhere except in classes", correct: false },
            { text: "Anywhere", correct: true }
        ]
    },
    {
        text: "When a new computer user wants to use virtualization, which hardware components need to support virtual technology for this to work properly?", type: "multiple_choice", options: [
            { text: "BIOS", correct: false },
            { text: "ROM", correct: false },
            { text: "Motherboard", correct: false },
            { text: "BIOS, Motherboard, and RAM", correct: true }
        ]
    },
    {
        text: "_______ is an insertion operator which is used for overloading.", type: "multiple_choice", options: [
            { text: "Overloading +=", correct: false },
            { text: "Overloading <<", correct: true },
            { text: "Overloading &&", correct: false },
            { text: "Overloading ||", correct: false }
        ]
    }
];

async function seedMockExam() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        let quizRes = await client.query('SELECT id FROM quizzes WHERE title = $1', ['exit_exam4']);
        let quizId;

        if (quizRes.rows.length === 0) {
            console.log('Inserting new model exam quiz...');
            const courseRes = await client.query('SELECT id FROM courses LIMIT 1');
            const courseId = courseRes.rows.length ? courseRes.rows[0].id : null;

            const insertQuiz = await client.query(
                'INSERT INTO quizzes (title, is_official, course_id) VALUES ($1, $2, $3) RETURNING id',
                ['exit_exam4', true, courseId]
            );
            quizId = insertQuiz.rows[0].id;
        } else {
            quizId = quizRes.rows[0].id;
            console.log('New model exam quiz already exists');
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
        console.log(`Successfully seeded ${mockQuestions.length} questions from New Model Exam IT 1-74!`);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error seeding mock exam:', err);
    } finally {
        client.release();
        pool.end();
    }
}

seedMockExam();