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
        text: "Which of the following is a basic component of a computer system?", type: "multiple_choice", options: [
            { text: "mouse", correct: false },
            { text: "Printer", correct: false },
            { text: "Scanner", correct: false },
            { text: "USB drive", correct: true }
        ]
    },
    {
        text: "What is the role of thermal paste in a computer system?", type: "multiple_choice", options: [
            { text: "To protect the processor from overheating", correct: false },
            { text: "To provide a seal between the processor and heatsink", correct: true },
            { text: "To prevent static electricity from damaging the processor", correct: false },
            { text: "To speed up the processor's performance", correct: false }
        ]
    },
    {
        text: "Which of the following is a method of preventing malware infections on a computer system?", type: "multiple_choice", options: [
            { text: "Keep your software up-to-date", correct: true },
            { text: "Use weak passwords", correct: false },
            { text: "Disable your firewall", correct: false },
            { text: "Share your personal information online", correct: false }
        ]
    },
    {
        text: "What is the purpose of a UPS (Uninterruptible Power Supply)?", type: "multiple_choice", options: [
            { text: "To provide temporary power during a power outage", correct: false },
            { text: "To regulate the power supply to the computer system", correct: false },
            { text: "To prevent damage to the computer system from power surges", correct: false },
            { text: "All of the above", correct: true }
        ]
    },
    {
        text: "How can you clean the keyboard of your computer system?", type: "multiple_choice", options: [
            { text: "Use a damp cloth to wipe the keys", correct: false },
            { text: "Use a can of compressed air to blow out debris", correct: false },
            { text: "Remove the keys and wash them in soapy water", correct: false },
            { text: "All of the above", correct: true }
        ]
    },
    {
        text: "Which of the following is a reason to perform regular backups of your data?", type: "multiple_choice", options: [
            { text: "To recover lost or deleted files", correct: false },
            { text: "To protect against hardware failure", correct: false },
            { text: "To prepare for a disaster", correct: false },
            { text: "All of the above", correct: true }
        ]
    },
    {
        text: "How can you test the performance of your computer system?", type: "multiple_choice", options: [
            { text: "Use benchmarking software", correct: false },
            { text: "Run diagnostic tests", correct: false },
            { text: "Check the system's event log", correct: false },
            { text: "All of the above", correct: true }
        ]
    },
    {
        text: "What is the purpose of a BIOS (Basic Input/Output System)?", type: "multiple_choice", options: [
            { text: "To control the computer's basic functions", correct: false },
            { text: "To configure the hardware settings of the computer", correct: false },
            { text: "To provide a platform for the operating system to run on", correct: false },
            { text: "All of the above", correct: true }
        ]
    },
    {
        text: "How can you remove a virus or malware from your computer system?", type: "multiple_choice", options: [
            { text: "Use anti-virus and anti-malware software", correct: false },
            { text: "Reformat the hard drive and reinstall the operating system", correct: false },
            { text: "Delete infected files manually", correct: false },
            { text: "All of the above", correct: true }
        ]
    },
    {
        text: "Which of the following is a safety measure to take when repairing or maintaining a computer system?", type: "multiple_choice", options: [
            { text: "Wear an anti-static wristband", correct: true },
            { text: "Work in a poorly ventilated area", correct: false },
            { text: "Use metal tools near the power supply", correct: false },
            { text: "None of the above", correct: false }
        ]
    },
    {
        text: "In which database design phase we will develop all the technologies and organizational specifications?", type: "multiple_choice", options: [
            { text: "conceptual design", correct: false },
            { text: "Logical Design", correct: false },
            { text: "Physical design", correct: true },
            { text: "Enterprise designing", correct: false }
        ]
    },
    {
        text: "Which of the following statement is not true about the database approach?", type: "multiple_choice", options: [
            { text: "Database system contains only the database itself but does not contain a complete definition or description of the database structure and constraints", correct: true },
            { text: "The Database approach is characterized by program-data independence.", correct: false },
            { text: "It allows multiple users to access the database at the same time.", correct: false },
            { text: "It provides facilities for recovering hardware and software failures", correct: false }
        ]
    },
    {
        text: "Which of the following statement is true about distributed database systems?", type: "multiple_choice", options: [
            { text: "User at one site cannot be able access data that is available at another site", correct: false },
            { text: "If one site fails the rest can continue operation as long as transaction does not demand data from the failed system and the data is not replicated in other sites", correct: true },
            { text: "cannot Speedup of query processing", correct: false },
            { text: "there is no communication problems in DDBMS", correct: false }
        ]
    },
    {
        text: "Which of the following statement shows the difference between homogenous and heterogeneous in distributed database system respectively?", type: "multiple_choice", options: [
            { text: "Appears to user as a single system and Appears to user as multiple system", correct: false },
            { text: "Different sites may use different schemas and software and all sites have identical software", correct: true },
            { text: "Difference in schema is a major problem for query processing and same in schema is a major problem for query processing", correct: false },
            { text: "Sites may not be aware of each other and Sites have aware of each other", correct: false }
        ]
    },
    {
        text: "A schedule where the operations of each transaction are executed consecutively without any other interference from other transactions.", type: "multiple_choice", options: [
            { text: "Conflict schedules", correct: false },
            { text: "Equivalent schedules", correct: false },
            { text: "No-serial schedules", correct: false },
            { text: "Serial schedule", correct: true }
        ]
    },
    {
        text: "It is a Recovery Techniques which is useful if transactions execute serially.", type: "multiple_choice", options: [
            { text: "Shadow paging", correct: true },
            { text: "Check pointing", correct: false },
            { text: "Log-Based", correct: false },
            { text: "Taking Backup", correct: false }
        ]
    },
    {
        text: "In Which transaction properties all statements or none are executed.", type: "multiple_choice", options: [
            { text: "Consistency", correct: false },
            { text: "Isolation", correct: false },
            { text: "Durability", correct: false },
            { text: "Atomicity", correct: true }
        ]
    },
    {
        text: "The aims of query processing is:", type: "multiple_choice", options: [
            { text: "To transform a query written in a low-level language into a high-level language", correct: false },
            { text: "To determine a strategy the one which is the most cost effective and efficient", correct: true },
            { text: "To execute the strategy to retrieve the irrelevant data", correct: false },
            { text: "To check that the query is only syntactically correct", correct: false }
        ]
    },
    {
        text: "It is a technique that holds great promise for providing even more improvements to query processing efficiency in the future relational database system.", type: "multiple_choice", options: [
            { text: "Semantic optimization", correct: true },
            { text: "Syntactical Optimization", correct: false },
            { text: "Heuristic query optimization", correct: false },
            { text: "Cost based query optimization", correct: false }
        ]
    },
    {
        text: "Assume the admin of the database and newly created user user1 by the admin. So Which of the following SQL query is used to access or modify the data from the admin by user?", type: "multiple_choice", options: [
            { text: "grant delete on table name to user1;", correct: true },
            { text: "grant on table name delete to user1", correct: false },
            { text: "grant on table name delete from user1", correct: false },
            { text: "grant delete on table name from user1;", correct: false }
        ]
    },
    {
        text: "Which of the following statement is true about triggers?", type: "multiple_choice", options: [
            { text: "A trigger is not a stored procedure", correct: false },
            { text: "A trigger can be invoked when a row is inserted into a specified table", correct: true },
            { text: "A trigger cannot be invoked when certain table columns are being updated", correct: false },
            { text: "AFTER triggers run the trigger action before the triggering statement is run", correct: false }
        ]
    },
    {
        text: "Which of the following statement is true about the indexes?", type: "multiple_choice", options: [
            { text: "It is used to speed up querying during fetching data", correct: true },
            { text: "It is used to speed up update time than the normal update time", correct: false },
            { text: "Cannot speed up fetching time than the normal fetching time", correct: false },
            { text: "we cannot stored table keys in indexes", correct: false }
        ]
    },
    {
        text: "Which of the following data management approach is difficult to cross-referencing?", type: "multiple_choice", options: [
            { text: "Manual approach", correct: false },
            { text: "File-based approach", correct: true },
            { text: "Database approach", correct: false },
            { text: "all", correct: false }
        ]
    },
    {
        text: "Which of the following statement is served as a criterion for Optimization?", type: "multiple_choice", options: [
            { text: "Reduce total execution time of the query", correct: true },
            { text: "increase the number of disk access", correct: false },
            { text: "increase response time of the query", correct: false },
            { text: "reduce pipelining", correct: false }
        ]
    },
    {
        text: "One of your classmates creates the student table. then he or she creates a view and he or she wants an update on his or her view with aggregation and summary but she or he can't see the updated result why?", type: "multiple_choice", options: [
            { text: "because the view is secured", correct: false },
            { text: "because it hides unnecessary information from users", correct: false },
            { text: "because it Provides very low flexibility", correct: false },
            { text: "aggregation and summary results are computed from a base relation", correct: true }
        ]
    },
    {
        text: "The key difference between the hierarchical data model and the network data model is?", type: "multiple_choice", options: [
            { text: "There is one parent in the hierarchical data model but in the network data model there will be more than one", correct: true },
            { text: "in hierarchical data model sees records as a set of members but not network data model", correct: false },
            { text: "in hierarchical data model allows no many to many relationships between entities but not network data model", correct: false },
            { text: "hierarchical data model is collection of physically linked records but not network data model", correct: false }
        ]
    },
    {
        text: "Which one of the following is carry information from sender to receiver?", type: "multiple_choice", options: [
            { text: "Protocol", correct: false },
            { text: "Media", correct: false },
            { text: "Sender", correct: false },
            { text: "All", correct: true }
        ]
    },
    {
        text: "Which one is Metropolitan Area Network (MAN) technology?", type: "multiple_choice", options: [
            { text: "WiFi", correct: false },
            { text: "WiMAX", correct: true },
            { text: "Internet", correct: false },
            { text: "Ad hoc network", correct: false }
        ]
    },
    {
        text: "Computer is connect to the network connection via?", type: "multiple_choice", options: [
            { text: "NIC", correct: true },
            { text: "Module", correct: false },
            { text: "NOS", correct: false },
            { text: "Modem", correct: false }
        ]
    },
    {
        text: "Which one is incorrect about MAC address and IP address?", type: "multiple_choice", options: [
            { text: "IPv4 uses 32-bit addresses in dotted notations.", correct: false },
            { text: "48-bit address in colons notations", correct: false },
            { text: "IPv6 uses 128-bit addresses in hexadecimal notations", correct: false },
            { text: "MAC Address of computer can be changed", correct: true }
        ]
    },
    {
        text: "Which one is true about Connection-oriented and Connection-less communication?", type: "multiple_choice", options: [
            { text: "Connection-oriented is faster than Connection-less", correct: false },
            { text: "Connection-oriented and Connection-less performed by the same protocol", correct: false },
            { text: "In Connection-less traffic congestion is possible", correct: true },
            { text: "In connection-oriented acknowledge is not important", correct: false }
        ]
    },
    {
        text: "The advantage of wireless network over wired network is?", type: "multiple_choice", options: [
            { text: "Security", correct: false },
            { text: "Accessibility", correct: true },
            { text: "Speed", correct: false },
            { text: "Communication", correct: false }
        ]
    },
    {
        text: "Let, network designer installed 6 hosts by using mush topology, so how many cables are needed?", type: "multiple_choice", options: [
            { text: "5", correct: false },
            { text: "15", correct: true },
            { text: "30", correct: false },
            { text: "None", correct: false }
        ]
    },
    {
        text: "Transmission media is present at the OSI layer of?", type: "multiple_choice", options: [
            { text: "Physical", correct: true },
            { text: "Network", correct: false },
            { text: "Presentation", correct: false },
            { text: "Application", correct: false }
        ]
    },
    {
        text: "Which division multiplexing is divided channel into fixed length and cannot available (reallocate) when channel is free?", type: "multiple_choice", options: [
            { text: "TDM", correct: true },
            { text: "FDM", correct: false },
            { text: "SDM", correct: false },
            { text: "All", correct: false }
        ]
    },
    {
        text: "In which OSI layer dissimilar devices communicate by bit reordering?", type: "multiple_choice", options: [
            { text: "Physical layer", correct: false },
            { text: "Presentation layer", correct: true },
            { text: "Network layer", correct: false },
            { text: "Session layer", correct: false }
        ]
    },
    {
        text: "In which OSI layer both error detection and correction is performed?", type: "multiple_choice", options: [
            { text: "Transport layer", correct: false },
            { text: "Data link layer", correct: true },
            { text: "Network layer", correct: false },
            { text: "Session layer", correct: false }
        ]
    },
    {
        text: "Which one is combine Segment into Frame and Frame into Packet?", type: "multiple_choice", options: [
            { text: "Network layer", correct: false },
            { text: "Transport layer", correct: false },
            { text: "Data link layer", correct: false },
            { text: "Session layer", correct: false }
        ]
    },
    {
        text: "At which layer routing protocols are determining the shortest path of the destination?", type: "multiple_choice", options: [
            { text: "Network layer", correct: true },
            { text: "Transport layer", correct: false },
            { text: "Data link layer", correct: false },
            { text: "Session layer", correct: false }
        ]
    },
    {
        text: "At which layer transmission mode (simplex, half duplex, full duplex) is determine?", type: "multiple_choice", options: [
            { text: "Network layer", correct: false },
            { text: "Transport layer", correct: false },
            { text: "Data link layer", correct: true },
            { text: "Session layer", correct: false }
        ]
    },
    {
        text: "Which one is Protocol Data Unit (PDU) of Data-link layer?", type: "multiple_choice", options: [
            { text: "Frame", correct: true },
            { text: "Packet", correct: false },
            { text: "Segment", correct: false },
            { text: "Data", correct: false }
        ]
    },
    {
        text: "Which protocol is available in Data-link layer?", type: "multiple_choice", options: [
            { text: "Ethernet", correct: true },
            { text: "PPP", correct: true },
            { text: "UDP", correct: false },
            { text: "SMTP", correct: false }
        ]
    },
    {
        text: "Which one is incorrect about OSI and TCP/IP model?", type: "multiple_choice", options: [
            { text: "TCP/IP model has 4 layers", correct: false },
            { text: "TCP/IP is developed by ARPANET", correct: false },
            { text: "OSI Model has 7 layers", correct: false },
            { text: "OSI model is support both connection-oriented and connectionless", correct: true }
        ]
    },
    {
        text: "Which protocol is address resolution protocol responsible for translating from IP addresses to MAC addresses?", type: "multiple_choice", options: [
            { text: "ARP", correct: true },
            { text: "RARP", correct: false },
            { text: "UDP", correct: false },
            { text: "TCP", correct: false }
        ]
    },
    {
        text: "The Port Number of Secure Shell (SSH) is?", type: "multiple_choice", options: [
            { text: "23", correct: false },
            { text: "22", correct: true },
            { text: "25", correct: false },
            { text: "80", correct: false }
        ]
    },
    {
        text: "Which one is not available in IPv4 network?", type: "multiple_choice", options: [
            { text: "Unicast", correct: false },
            { text: "Broadcast", correct: false },
            { text: "Multicast", correct: false },
            { text: "Anycast", correct: true }
        ]
    },
    {
        text: "Workgroup name and computer name must be?", type: "multiple_choice", options: [
            { text: "The same name", correct: false },
            { text: "Different name", correct: true },
            { text: "Name may be special characters", correct: false },
            { text: "All", correct: false }
        ]
    },
    {
        text: "Which one is false concerned on domain and workgroup?", type: "multiple_choice", options: [
            { text: "In workgroup, all computers are managed by server", correct: true },
            { text: "In domain, all computers are managed by server", correct: false },
            { text: "A workgroup is not protected by a password", correct: false },
            { text: "In workgroup, all computers must be on the same local network", correct: false }
        ]
    },
    {
        text: "Logical structure of active directory includes?", type: "multiple_choice", options: [
            { text: "Domain", correct: false },
            { text: "Tree", correct: false },
            { text: "Forest", correct: false },
            { text: "Domain controller", correct: true }
        ]
    },
    {
        text: "A collection of trees that share a common global catalog, directory schema, logical structure, and directory configuration is known as?", type: "multiple_choice", options: [
            { text: "Domain", correct: false },
            { text: "Tree", correct: false },
            { text: "Forest", correct: true },
            { text: "Site", correct: false }
        ]
    },
    {
        text: "A relationship between different domains or forests that allow sharing of resources between them is called?", type: "multiple_choice", options: [
            { text: "Trust", correct: true },
            { text: "Tree", correct: false },
            { text: "Domain", correct: false },
            { text: "Group", correct: false }
        ]
    },
    {
        text: "The process of granting someone to access a resource is called?", type: "multiple_choice", options: [
            { text: "Authentication", correct: false },
            { text: "Authorization", correct: true },
            { text: "Access control", correct: false },
            { text: "Validation", correct: false }
        ]
    },
    {
        text: "Which password policy prevents users from creating a new password that is the same as their current password or a recently used password?", type: "multiple_choice", options: [
            { text: "Enforce password history", correct: true },
            { text: "Maximum password age", correct: false },
            { text: "Minimum password length", correct: false },
            { text: "Passwords must meet complexity requirements", correct: false }
        ]
    },
    {
        text: "Dividing a network & its IP addresses into segments is called?", type: "multiple_choice", options: [
            { text: "Subneting", correct: true },
            { text: "Cider", correct: false },
            { text: "Superneting", correct: false },
            { text: "IP classification", correct: false }
        ]
    },
    {
        text: "Why subnetting a given IP address?", type: "multiple_choice", options: [
            { text: "To enhance the growth of global Internet routing table", correct: false },
            { text: "To prevent buying new IP address", correct: false },
            { text: "To secure computers", correct: false },
            { text: "All", correct: true }
        ]
    },
    {
        text: "Subneting IP address to support 25 hosts, so how many available hosts?", type: "multiple_choice", options: [
            { text: "8", correct: false },
            { text: "30", correct: true },
            { text: "32", correct: false },
            { text: "24", correct: false }
        ]
    },
    {
        text: "Which one is correct about Link-State routing algorithm?", type: "multiple_choice", options: [
            { text: "It available for flat topology", correct: false },
            { text: "It uses Open Shortest Path First rule", correct: true },
            { text: "Routing Information Protocol used to rout packets", correct: false },
            { text: "None", correct: false }
        ]
    },
    {
        text: "Which one is used to store configured routing information permanently?", type: "multiple_choice", options: [
            { text: "RAM", correct: false },
            { text: "FLASH", correct: false },
            { text: "Non-Volatile RAM", correct: true },
            { text: "Volatile RAM", correct: false }
        ]
    },
    {
        text: "Which one is global configuration mode?", type: "multiple_choice", options: [
            { text: "Switch>", correct: false },
            { text: "Switch(config)#", correct: true },
            { text: "Switch(config-if)#", correct: false },
            { text: "Switch#", correct: false }
        ]
    },
    {
        text: "Which one is used single key to encrypt and decrypt?", type: "multiple_choice", options: [
            { text: "Symmetric Key Cryptography", correct: true },
            { text: "Asymmetric Key Cryptography", correct: false },
            { text: "Hash Functions", correct: false },
            { text: "RMD Function", correct: false }
        ]
    },
    {
        text: "Which protocol is used to secure when transfer data through a network?", type: "multiple_choice", options: [
            { text: "Secure Shell (SSH)", correct: false },
            { text: "HyperText Transfer Protocol Secure (HTTPS)", correct: false },
            { text: "IPSec protocol", correct: false },
            { text: "All", correct: true }
        ]
    },
    {
        text: "Which one is add?", type: "multiple_choice", options: [
            { text: "Virus", correct: false },
            { text: "Trapdoor", correct: false },
            { text: "Bacterium", correct: false },
            { text: "OpenVAS", correct: true }
        ]
    },
    {
        text: "Which types of Trusts created automatically?", type: "multiple_choice", options: [
            { text: "Realm trust", correct: false },
            { text: "External trust", correct: false },
            { text: "Tree-root trust", correct: true },
            { text: "Forest trust", correct: false }
        ]
    },
    {
        text: "Which one is False about FLSM and VLSM?", type: "multiple_choice", options: [
            { text: "FLSM has equal interval of hosts", correct: false },
            { text: "FLSM has the same subnet mask", correct: false },
            { text: "VLSM wasted more IP address than FLSM", correct: true },
            { text: "VLSM has different subnet mask", correct: false }
        ]
    },
    {
        text: "Which of the following line of code is incorrect? (Java inheritance)", type: "multiple_choice", options: [
            { text: "Java_class1 myObj=new Java_class1();", correct: false },
            { text: "Main myObj1=new Main();", correct: false },
            { text: "Main myObj2=new Java_class1();", correct: false },
            { text: "Java_class1 myObj3=new Main();", correct: true }
        ]
    },
    {
        text: "What is the output of the Java program? (private static variable access)", type: "multiple_choice", options: [
            { text: "10", correct: false },
            { text: "89", correct: false },
            { text: "Error", correct: true },
            { text: "None", correct: false }
        ]
    },
    {
        text: "What is the output of the Java program? (method overriding)", type: "multiple_choice", options: [
            { text: "14", correct: true },
            { text: "11", correct: false },
            { text: "10", correct: false },
            { text: "A & B", correct: false }
        ]
    },
    {
        text: "What will be the access modifier of an object if you don't specify when declaring?", type: "multiple_choice", options: [
            { text: "private", correct: false },
            { text: "public", correct: false },
            { text: "default", correct: true },
            { text: "protected", correct: false }
        ]
    },
    {
        text: "Which of the following is false about abstraction in java?", type: "multiple_choice", options: [
            { text: "Data abstraction is the process of hiding certain details and showing only essential information to the user", correct: false },
            { text: "The abstract keyword can be used for classes and methods", correct: false },
            { text: "Abstract class cannot be used to create objects", correct: false },
            { text: "Abstraction can only be achieved by interface classes", correct: true }
        ]
    },
    {
        text: "Which of the following is false about inheritance in java?", type: "multiple_choice", options: [
            { text: "the class that inherits from another class is known as superclass", correct: true },
            { text: "If you don't want other classes to inherit from a class, use the final keyword", correct: false },
            { text: "Java doesn't allow multiple inheritance", correct: false },
            { text: "the class that inherits from another class is known as child class", correct: false }
        ]
    },
    {
        text: "Which of the following is correct about the difference between structural and object oriented programming?", type: "multiple_choice", options: [
            { text: "The structured programming allows developing a program using a set of modules or functions", correct: false },
            { text: "Structured programming includes data hiding feature therefore it is more secure", correct: false },
            { text: "brings together data and functions", correct: false },
            { text: "A & C", correct: true }
        ]
    },
    {
        text: "One of the following programming focuses on representing both structure and behavior of information system into small modules that combines data and process together?", type: "multiple_choice", options: [
            { text: "Structured programming", correct: false },
            { text: "Object oriented programming", correct: true },
            { text: "modular programming", correct: false },
            { text: "functional programming", correct: false }
        ]
    },
    {
        text: "What will be the output of the Java array program?", type: "multiple_choice", options: [
            { text: "3\n2", correct: true },
            { text: "2\n3", correct: false },
            { text: "4\n3", correct: false },
            { text: "3\n4", correct: false }
        ]
    },
    {
        text: "How do you insert a list item to the list? (ArrayList)", type: "multiple_choice", options: [
            { text: "DEPARTMENT_LIST.iterator(\"IT\");", correct: false },
            { text: "DEPARTMENT_LIST.stream(\"IT\");", correct: false },
            { text: "DEPARTMENT_LIST.add(\"IT\");", correct: true },
            { text: "DEPARTMENT_LIST.get(\"IT\");", correct: false }
        ]
    },
    {
        text: "Which of the following is the correct way to handle an exception that occurs in this program? (ArithmeticException)", type: "multiple_choice", options: [
            { text: "try{ int res=100/0; System.out.println(res); } catch(ArithmeticException e){ System.out.println(e); }", correct: true },
            { text: "try{ int res=100/0; System.out.println(res); } catch(NullPointerException e){ System.out.println(e); }", correct: false },
            { text: "try{ int res=100/0; System.out.println(res); } catch(ArrayIndexOutOfBoundsException e){ System.out.println(e); }", correct: false },
            { text: "try{ int res=100/0; System.out.println(res); } catch(NumberFormatException e){ System.out.println(e); }", correct: false }
        ]
    },
    {
        text: "String s=null; System.out.println(s.length()); Which type of exception must be handled?", type: "multiple_choice", options: [
            { text: "NumberFormatException", correct: false },
            { text: "NullPointerException", correct: true },
            { text: "Although using exception handling is a better programming method, the above program will not through an exception", correct: false },
            { text: "IndexOutOfBoundsException", correct: false }
        ]
    },
    {
        text: "The ______ method when used in the method field, leaves entity body empty.", type: "multiple_choice", options: [
            { text: "POST", correct: false },
            { text: "SEND", correct: false },
            { text: "GET", correct: true },
            { text: "PUT", correct: false }
        ]
    },
    {
        text: "The correct sequence of HTML tags for starting a webpage is?", type: "multiple_choice", options: [
            { text: "Head, Title, HTML, body", correct: false },
            { text: "HTML, Body, Title, Head", correct: false },
            { text: "HTML, Head, Title, Body", correct: true },
            { text: "HTML, Head, Title, Body", correct: true }
        ]
    },
    {
        text: "Which is the right way of declaring a variable in PHP?", type: "multiple_choice", options: [
            { text: "$3hello", correct: false },
            { text: "$_hello", correct: true },
            { text: "$this", correct: false },
            { text: "$5_Hello", correct: false }
        ]
    },
    {
        text: "What is an activity in Android?", type: "multiple_choice", options: [
            { text: "Activity performs the actions on the screen", correct: true },
            { text: "Manage the Application content", correct: false },
            { text: "Screen UI", correct: false },
            { text: "None of the above", correct: false }
        ]
    },
    {
        text: "What is the life cycle of services in android?", type: "multiple_choice", options: [
            { text: "onCreate() -> onStartCommand() -> onDestroy()", correct: true },
            { text: "onReceive()", correct: false },
            { text: "final()", correct: false },
            { text: "Service life cycle is same as activity life cycle.", correct: false }
        ]
    },
    {
        text: "What is the life cycle of broadcast receivers in android?", type: "multiple_choice", options: [
            { text: "send intent()", correct: false },
            { text: "onReceive()", correct: true },
            { text: "implicitBroadcast()", correct: false },
            { text: "sendBroadcast(), sendOrderBroadcast(), and sendStickyBroadcast().", correct: false }
        ]
    },
    {
        text: "Which of the following is not considered as a risk in project management?", type: "multiple_choice", options: [
            { text: "Specification delays", correct: false },
            { text: "Product competition", correct: false },
            { text: "Testing", correct: true },
            { text: "Staff turnover", correct: false }
        ]
    },
    {
        text: "Which of the following is not project management goal?", type: "multiple_choice", options: [
            { text: "Keeping overall costs within budget", correct: false },
            { text: "Delivering the software to the customer at the agreed time", correct: false },
            { text: "Maintaining a happy and well-functioning development team", correct: false },
            { text: "Avoiding customer complaints", correct: true }
        ]
    },
    {
        text: "Which of these truly defines Software design?", type: "multiple_choice", options: [
            { text: "software design is an activity subjected to constraints", correct: false },
            { text: "software design specifies nature and composition of software product", correct: false },
            { text: "software design satisfies client needs and desires", correct: false },
            { text: "all of the mentioned", correct: true }
        ]
    },
    {
        text: "What are the Five Project Management Process Groups in order?", type: "multiple_choice", options: [
            { text: "Initiating, Planning, Monitoring & Controlling, Executing, and Closing.", correct: false },
            { text: "Initiating, Monitoring & controlling, Planning, Executing, and Closing", correct: false },
            { text: "Initiating, Executing, Planning, Monitoring & Controlling, and Closing", correct: false },
            { text: "Initiating, Planning, Executing, Monitoring & Controlling, and Closing", correct: true }
        ]
    },
    {
        text: "What is the purpose of system analysis and design?", type: "multiple_choice", options: [
            { text: "To develop software", correct: false },
            { text: "To improve system efficiency", correct: true },
            { text: "To provide training to employees", correct: false },
            { text: "To monitor system performance", correct: false }
        ]
    },
    {
        text: "What is the purpose of the planning phase of the SDLC?", type: "multiple_choice", options: [
            { text: "To determine the system requirements", correct: false },
            { text: "To develop a detailed project plan", correct: true },
            { text: "To design the system", correct: false },
            { text: "To implement the system", correct: false }
        ]
    },
    {
        text: "Which of the following is not a type of system requirement?", type: "multiple_choice", options: [
            { text: "Functional", correct: false },
            { text: "Non-functional", correct: false },
            { text: "User", correct: true },
            { text: "Technical", correct: false }
        ]
    },
    {
        text: "Which of the following is not a software development methodology?", type: "multiple_choice", options: [
            { text: "Agile", correct: false },
            { text: "Waterfall", correct: false },
            { text: "RAD (Rapid Application Development)", correct: false },
            { text: "UML (Unified Modeling Language)", correct: true }
        ]
    },
    {
        text: "What is the purpose of a class diagram?", type: "multiple_choice", options: [
            { text: "To depict the system inputs and outputs", correct: false },
            { text: "To depict the system processes", correct: false },
            { text: "To depict the system data and relationships", correct: true },
            { text: "To illustrate the system architecture", correct: false }
        ]
    },
    {
        text: "How can we create and manage threads in java?", type: "multiple_choice", options: [
            { text: "only by extending the Thread class", correct: false },
            { text: "only by implementing the Runnable interface", correct: false },
            { text: "by extending the Runnable interface and implementing the Thread class", correct: false },
            { text: "by implementing the Runnable interface & extending the Thread class", correct: true }
        ]
    },
    {
        text: "This Of The Following Is An Internet Protocol.", type: "multiple_choice", options: [
            { text: "FTP", correct: false },
            { text: "TCP/IP", correct: true },
            { text: "EFT", correct: false },
            { text: "EDI", correct: false }
        ]
    },
    {
        text: "Which Of The Following Is An Example Of FTP.", type: "multiple_choice", options: [
            { text: "Personal", correct: false },
            { text: "Web Server", correct: false },
            { text: "Sql", correct: false },
            { text: "Cute-ftp", correct: true }
        ]
    },
    {
        text: "What is PHP?", type: "multiple_choice", options: [
            { text: "PHP is an open-source programming language", correct: false },
            { text: "PHP is used to develop dynamic and interactive websites", correct: false },
            { text: "PHP is a server-side scripting language", correct: false },
            { text: "All of the mentioned", correct: true }
        ]
    },
    {
        text: "What is a web browser?", type: "multiple_choice", options: [
            { text: "a program that can display a web page", correct: false },
            { text: "a program used to view html documents", correct: false },
            { text: "it enables user to access the resources of internet", correct: false },
            { text: "all of the mentioned", correct: true }
        ]
    },
    {
        text: "Which of the following is used to read an HTML page and render it?", type: "multiple_choice", options: [
            { text: "Web server", correct: false },
            { text: "Web network", correct: false },
            { text: "Web browser", correct: true },
            { text: "Web matrix", correct: false }
        ]
    },
    {
        text: "Variable name in PHP starts with?", type: "multiple_choice", options: [
            { text: "! (Exclamation)", correct: false },
            { text: "$ (Dollar)", correct: true },
            { text: "& (Ampersand)", correct: false },
            { text: "# (Hash)", correct: false }
        ]
    },
    {
        text: "Which of the following is used to display the output in PHP?", type: "multiple_choice", options: [
            { text: "echo", correct: false },
            { text: "write", correct: false },
            { text: "print", correct: false },
            { text: "Both (a) and (c)", correct: true }
        ]
    },
    {
        text: "Which of the following is used for concatenation in PHP?", type: "multiple_choice", options: [
            { text: "+ (plus)", correct: false },
            { text: "* (Asterisk)", correct: false },
            { text: ". (dot)", correct: true },
            { text: "append()", correct: false }
        ]
    }
];

async function seedMockExam() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        let quizRes = await client.query('SELECT id FROM quizzes WHERE title = $1', ['exit_exam2']);
        let quizId;

        if (quizRes.rows.length === 0) {
            console.log('Inserting mock official quiz...');
            const courseRes = await client.query('SELECT id FROM courses LIMIT 1');
            const courseId = courseRes.rows.length ? courseRes.rows[0].id : null;

            const insertQuiz = await client.query(
                'INSERT INTO quizzes (title, is_official, course_id) VALUES ($1, $2, $3) RETURNING id',
                ['exit_exam2', true, courseId]
            );
            quizId = insertQuiz.rows[0].id;
        } else {
            quizId = quizRes.rows[0].id;
            console.log('Mock official quiz already exists');
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
        console.log(`Successfully seeded ${mockQuestions.length} questions!`);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error seeding mock exam:', err);
    } finally {
        client.release();
        pool.end();
    }
}

seedMockExam();