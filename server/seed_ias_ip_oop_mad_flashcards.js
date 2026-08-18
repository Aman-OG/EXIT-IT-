const pool = require('./src/config/db');

const iasCards = [
  {"front": "What does CIA stand for in information security?", "back": "Confidentiality, Integrity, Availability"},
  {"front": "Which security goal ensures data is accessible only to authorized users?", "back": "Confidentiality"},
  {"front": "Which security goal ensures data is accurate and unaltered?", "back": "Integrity"},
  {"front": "Which security goal ensures systems are accessible when needed?", "back": "Availability"},
  {"front": "What type of attack encrypts files and demands payment for decryption?", "back": "Ransomware"},
  {"front": "What is a zero-day vulnerability?", "back": "A vulnerability unknown to the vendor with no patch available"},
  {"front": "What is the difference between a virus and a worm?", "back": "Worms are self-replicating standalone programs; viruses attach to other programs"},
  {"front": "What is a Trojan horse?", "back": "Malicious software disguised as legitimate software"},
  {"front": "What is a logic bomb?", "back": "Malicious code triggered by a specific condition or event"},
  {"front": "What is a time bomb?", "back": "A logic bomb triggered by a specific time or date"},
  {"front": "What is a trapdoor/backdoor in software?", "back": "A hidden entry point for bypassing normal authentication"},
  {"front": "What is the primary difference between active and passive attacks?", "back": "Active attacks alter resources; passive attacks only observe"},
  {"front": "What is a masquerade attack?", "back": "An entity pretends to be another entity"},
  {"front": "What is a replay attack?", "back": "Capturing and retransmitting data to produce an unauthorized effect"},
  {"front": "What is traffic analysis?", "back": "Observing message patterns to infer information without decrypting"},
  {"front": "What is social engineering?", "back": "Psychological manipulation to trick people into revealing sensitive information"},
  {"front": "What are the five pillars of the NIST Cybersecurity Framework?", "back": "Identify, Protect, Detect, Respond, Recover"},
  {"front": "What is a firewall?", "back": "A device that filters traffic between a protected network and an untrusted network"},
  {"front": "What type of firewall filters packets based on headers at Layer 3?", "back": "Packet filtering firewall"},
  {"front": "What type of firewall tracks active connections for context-aware decisions?", "back": "Stateful inspection firewall"},
  {"front": "What type of firewall acts as a relay for application-level traffic?", "back": "Application-level gateway / Proxy server"},
  {"front": "What is a proxy server?", "back": "An intermediary that processes client requests for security, caching, or anonymity"},
  {"front": "What is a bastion host?", "back": "A hardened firewall host that is the primary point of contact from the outside"},
  {"front": "What is an IDS?", "back": "Intrusion Detection System - monitors for malicious activity"},
  {"front": "What is an IPS?", "back": "Intrusion Prevention System - detects and blocks attacks"},
  {"front": "What is the difference between signature-based and anomaly-based IDS?", "back": "Signature uses known patterns; anomaly detects deviations from normal"},
  {"front": "What is a VPN?", "back": "Virtual Private Network - creates a secure encrypted tunnel over a public network"},
  {"front": "What is the difference between RADIUS and TACACS+?", "back": "RADIUS encrypts only passwords; TACACS+ encrypts entire packets"},
  {"front": "Which AAA protocol uses UDP and is commonly used for Wi-Fi authentication?", "back": "RADIUS"},
  {"front": "Which AAA protocol uses TCP and is commonly used for device administration?", "back": "TACACS+"},
  {"front": "What does AAA stand for?", "back": "Authentication, Authorization, Accounting"},
  {"front": "What is authentication?", "back": "Verifying the identity of a user or system"},
  {"front": "What is authorization?", "back": "Determining what resources an authenticated user can access"},
  {"front": "What are the three factors of authentication?", "back": "Something you know, something you have, something you are"},
  {"front": "What is MFA?", "back": "Multi-Factor Authentication - using two or more authentication factors"},
  {"front": "What is Kerberos?", "back": "A network authentication protocol that uses tickets for secure identity verification"},
  {"front": "What is a TGT in Kerberos?", "back": "Ticket Granting Ticket - obtained initially for requesting service tickets"},
  {"front": "What is symmetric-key encryption?", "back": "Using the same key for both encryption and decryption"},
  {"front": "What is asymmetric-key encryption?", "back": "Using a public key for encryption and a private key for decryption"},
  {"front": "What is DES?", "back": "Data Encryption Standard - a symmetric block cipher with a 56-bit key"},
  {"front": "What is AES?", "back": "Advanced Encryption Standard - a symmetric block cipher with 128-bit blocks"},
  {"front": "What is RSA?", "back": "An asymmetric encryption algorithm based on factoring large prime numbers"},
  {"front": "What is a hash function?", "back": "A function that creates a fixed-length digest from variable-length input"},
  {"front": "What is a digital signature?", "back": "An electronic signature created using asymmetric encryption to verify authenticity and integrity"},
  {"front": "What is a PKI?", "back": "Public Key Infrastructure - manages public keys and digital certificates"},
  {"front": "What is a digital certificate?", "back": "A digitally signed document that binds a public key to an entity"},
  {"front": "What is a CA?", "back": "Certification Authority - issues and manages digital certificates"},
  {"front": "What is an RA?", "back": "Registration Authority - verifies identities before certificate issuance"},
  {"front": "What is SSL/TLS?", "back": "SSL (Secure Sockets Layer) / TLS (Transport Layer Security) - cryptographic protocols for secure communications"},
  {"front": "What is HTTPS?", "back": "Hypertext Transfer Protocol Secure - HTTP with TLS encryption"},
  {"front": "What is a Man-in-the-Middle (MitM) attack?", "back": "Intercepting communication between two parties without their knowledge"},
  {"front": "What is a phishing attack?", "back": "Deceptive communication tricking users into revealing sensitive information"},
  {"front": "What is a DDoS attack?", "back": "Distributed Denial of Service - overwhelming a target with traffic from multiple sources"},
  {"front": "What is a SYN flood?", "back": "Exploiting TCP handshake by sending SYN requests without completing connections"},
  {"front": "What is IP spoofing?", "back": "Falsifying source IP addresses to impersonate another system"},
  {"front": "What is ARP spoofing?", "back": "Sending fake ARP messages to link an attacker's MAC address with a legitimate IP"},
  {"front": "What is a buffer overflow?", "back": "Writing more data to a buffer than it can hold, overwriting adjacent memory"},
  {"front": "What is SQL injection?", "back": "Injecting malicious SQL code into input fields to manipulate a database"},
  {"front": "What is XSS?", "back": "Cross-Site Scripting - injecting malicious scripts into web pages"},
  {"front": "What is a WAF?", "back": "Web Application Firewall - protects web applications by filtering HTTP/HTTPS traffic"},
  {"front": "What is end-to-end encryption?", "back": "Encryption that protects data from sender to receiver, decryptable only by the recipient"},
  {"front": "What is malware?", "back": "Malicious software designed to damage or gain unauthorized access"},
  {"front": "What is spyware?", "back": "Malware designed to secretly gather information and send it to a third party"},
  {"front": "What is a keylogger?", "back": "Software that records every keystroke made on a device"},
  {"front": "What is a packet sniffer?", "back": "Software that captures data packets flowing across a network"},
  {"front": "What is a port scan?", "back": "Probing a system to identify open ports and services"},
  {"front": "What is risk analysis?", "back": "Identifying threats, vulnerabilities, and assessing potential impact"},
  {"front": "What is the formula Risk = Threat × Vulnerability?", "back": "Risk is the product of threat and vulnerability"},
  {"front": "What are the four risk treatment options?", "back": "Mitigate, Transfer, Avoid, Accept"},
  {"front": "What is the Zero Trust model?", "back": "A security model based on 'never trust, always verify'"},
  {"front": "What is least privilege?", "back": "Granting users only the minimum access needed for their role"},
  {"front": "What is Role-Based Access Control (RBAC)?", "back": "Access control based on assigned roles rather than individual users"},
  {"front": "What is Discretionary Access Control (DAC)?", "back": "Resource owners control who has access"},
  {"front": "What is Mandatory Access Control (MAC)?", "back": "Access controlled by a central authority based on security labels"},
  {"front": "What is Attribute-Based Access Control (ABAC)?", "back": "Access granted based on attributes of users, objects, and environment"},
  {"front": "What is an Acceptable Use Policy (AUP)?", "back": "A policy defining acceptable behavior on company systems"},
  {"front": "What is a security policy?", "back": "A high-level document defining rules for information security"},
  {"front": "What is the difference between a policy and a procedure?", "back": "A policy defines 'what' and 'why'; a procedure defines 'how'"},
  {"front": "What is a BCP?", "back": "Business Continuity Plan - keeps critical operations running during disruption"},
  {"front": "What is a DRP?", "back": "Disaster Recovery Plan - restores IT systems after a failure"},
  {"front": "What is the CIA Triad?", "back": "Confidentiality, Integrity, Availability - the core goals of security"},
  {"front": "What is encryption?", "back": "Transforming data into an unreadable format to protect confidentiality"},
  {"front": "What is decryption?", "back": "Converting encrypted data back to its original form"},
  {"front": "What is cryptanalysis?", "back": "Attempting to break encryption without knowing the key"},
  {"front": "What is a brute force attack?", "back": "Trying every possible key to decrypt a message"},
  {"front": "What is the Caesar cipher?", "back": "A simple additive cipher where each letter is shifted by a fixed number"},
  {"front": "What is the Vigenère cipher?", "back": "A polyalphabetic substitution cipher using a repeated keyword"},
  {"front": "What is frequency analysis?", "back": "Attacking ciphers by analyzing the frequency of characters in ciphertext"},
  {"front": "What is a one-time pad?", "back": "An unbreakable encryption scheme using a random key stream used only once"},
  {"front": "What is the Diffie-Hellman key exchange?", "back": "A method for securely exchanging cryptographic keys over a public channel"},
  {"front": "What is a session key?", "back": "A temporary symmetric key used for a single session"},
  {"front": "What is a master key?", "back": "A long-term key used to encrypt session keys"},
  {"front": "What is non-repudiation?", "back": "Ensuring a party cannot deny an action they performed"},
  {"front": "What is a Smurf attack?", "back": "A DoS attack using broadcast echo requests with a spoofed victim IP"},
  {"front": "What is Session Hijacking?", "back": "Taking over an active session by stealing a session token"},
  {"front": "What is a Passphrase vs Password?", "back": "Passphrase is longer with multiple words; Password is shorter with complexity"}
];

const ip1Cards = [
  {"front": "What does HTML stand for?", "back": "HyperText Markup Language"},
  {"front": "What does CSS stand for?", "back": "Cascading Style Sheets"},
  {"front": "What is the difference between HTML and CSS?", "back": "HTML defines content; CSS specifies layout and presentation"},
  {"front": "What is the difference between a programming language and a scripting language?", "back": "Programming languages are compiled; scripting languages are interpreted"},
  {"front": "What is JavaScript primarily used for in web development?", "back": "Adding interactivity and dynamic behavior to web pages"},
  {"front": "What is the difference between client-side and server-side scripting?", "back": "Client-side runs in the browser; server-side runs on the web server"},
  {"front": "What is the client-server model?", "back": "A distributed architecture where clients request services and servers provide them"},
  {"front": "What is the World Wide Web?", "back": "A collection of interlinked multimedia documents accessed via the Internet using HTTP"},
  {"front": "What is a URL?", "back": "Uniform Resource Locator - the address of a resource on the Internet"},
  {"front": "What is the significance of hypertext?", "back": "It allows navigation between documents through hyperlinks"},
  {"front": "What is the difference between the Internet and the World Wide Web?", "back": "Internet is the network infrastructure; WWW is a service that runs on it"},
  {"front": "What is HTTP?", "back": "HyperText Transfer Protocol - the protocol for transferring web documents"},
  {"front": "What is a web server?", "back": "A computer that delivers requested web pages to clients"},
  {"front": "What is a web browser?", "back": "Software that retrieves and displays web pages"},
  {"front": "What is ARPANET?", "back": "The first operational packet-switching network, precursor to the Internet"},
  {"front": "Who are considered the 'Fathers of the Internet'?", "back": "Vint Cerf and Bob Kahn (invented TCP/IP)"},
  {"front": "Who invented the World Wide Web?", "back": "Tim Berners-Lee"},
  {"front": "What is TCP/IP?", "back": "Transmission Control Protocol/Internet Protocol - the standard protocol suite for the Internet"},
  {"front": "What is Git?", "back": "A popular version control system for tracking code changes and collaboration"},
  {"front": "Who created Git?", "back": "Linus Torvalds in 2005"},
  {"front": "What is a Git repository?", "back": "A directory where Git tracks all changes to files"},
  {"front": "What is the difference between a commit and a push?", "back": "Commit saves changes locally; Push uploads changes to a remote repository"},
  {"front": "What is the staging area in Git?", "back": "Where you prepare specific changes for a commit"},
  {"front": "What does 'git init' do?", "back": "Creates an empty Git repository in the current folder"},
  {"front": "What does 'git add .' do?", "back": "Stages all changes in the current folder"},
  {"front": "What does 'git commit -m \"message\"' do?", "back": "Commits staged changes with a descriptive message"},
  {"front": "What does 'git status' do?", "back": "Shows the current state of the working directory and staging area"},
  {"front": "What does 'git log' do?", "back": "Shows the commit history"},
  {"front": "What is a Git branch?", "back": "A separate version of the repository for working on features or fixes"},
  {"front": "What does 'git branch' do?", "back": "Lists all local branches"},
  {"front": "What does 'git checkout -b branch_name' do?", "back": "Creates and switches to a new branch"},
  {"front": "What does 'git merge branch_name' do?", "back": "Combines changes from another branch into the current branch"},
  {"front": "What is the purpose of GitHub?", "back": "A cloud-based platform for hosting Git repositories and collaboration"},
  {"front": "What is the difference between `git clone` and `git pull`?", "back": "Clone copies a repository; Pull fetches and merges updates from a remote repository"},
  {"front": "What is the difference between `git fetch` and `git pull`?", "back": "Fetch downloads changes; Pull downloads and merges changes"},
  {"front": "What is a semantic element in HTML?", "back": "An element that describes its content or function, like <header>, <nav>, <article>, <footer>"},
  {"front": "What is the difference between <div> and <span>?", "back": "<div> is block-level; <span> is inline"},
  {"front": "What is the purpose of the id attribute in HTML?", "back": "To uniquely identify a single element in the document"},
  {"front": "What is the purpose of the class attribute in HTML?", "back": "To group multiple elements for styling or scripting"},
  {"front": "What is the difference between `id` and `class`?", "back": "id must be unique; class can be used multiple times"},
  {"front": "What is the purpose of the <link> tag?", "back": "To link external resources like stylesheets"},
  {"front": "What is the difference between inline, internal, and external CSS?", "back": "Inline is in the tag; internal is in the <head>; external is in a separate .css file"},
  {"front": "What is the highest priority CSS? Inline, internal, or external?", "back": "Inline CSS"},
  {"front": "What is a CSS selector?", "back": "Specifies which HTML elements a style applies to"},
  {"front": "What is a pseudo-class in CSS?", "back": "Used to define special states of an element, like :hover or :focus"},
  {"front": "What is the CSS box model?", "back": "Content, padding, border, and margin around an element"},
  {"front": "What is the difference between margin and padding?", "back": "Margin is outside the border; padding is inside the border"},
  {"front": "What is the difference between `display: block` and `display: inline`?", "back": "Block takes full width; inline takes only necessary space"},
  {"front": "What is the purpose of the `position` property in CSS?", "back": "Specifies the positioning method for an element (static, relative, absolute, fixed, sticky)"},
  {"front": "What is the difference between `position: relative` and `position: absolute`?", "back": "Relative positions relative to normal position; Absolute positions relative to nearest positioned ancestor"},
  {"front": "What is a form in HTML?", "back": "A container for input elements to collect data from users"},
  {"front": "What is the difference between GET and POST methods?", "back": "GET appends data to URL; POST sends data in the request body"},
  {"front": "When should POST be used over GET?", "back": "When sending sensitive data or large amounts of data"},
  {"front": "What is a table in HTML used for?", "back": "Displaying data in rows and columns"},
  {"front": "What does the `colspan` attribute do?", "back": "Merges multiple columns into one cell"},
  {"front": "What is the `rowspan` attribute in HTML tables?", "back": "Merges multiple rows into one cell"},
  {"front": "What is the <frameset> tag used for?", "back": "Dividing the browser window into multiple frames"},
  {"front": "What is a disadvantage of using HTML frames?", "back": "They can cause navigation and accessibility issues"},
  {"front": "What is JavaScript?", "back": "A lightweight, interpreted scripting language for adding interactivity to web pages"},
  {"front": "Is JavaScript compiled or interpreted?", "back": "Interpreted"},
  {"front": "What is the purpose of the `<script>` tag?", "back": "Embeds JavaScript code in an HTML document"},
  {"front": "What is the difference between `var`, `let`, and `const` in JavaScript?", "back": "var is function-scoped; let and const are block-scoped; const cannot be reassigned"},
  {"front": "What is a function in JavaScript?", "back": "A reusable block of code that performs a specific task"},
  {"front": "What is an event handler in JavaScript?", "back": "Code that executes in response to an event, like onclick"},
  {"front": "What is the purpose of form validation in JavaScript?", "back": "To ensure user input is correct before submitting it to the server"},
  {"front": "What is `document.getElementById()` used for?", "back": "Returns the element with the specified ID"},
  {"front": "What is the difference between `alert()`, `confirm()`, and `prompt()`?", "back": "Alert shows a message; Confirm asks OK/Cancel; Prompt asks for input"},
  {"front": "What is the `onclick` event?", "back": "Triggers when an element is clicked"},
  {"front": "What is the `onsubmit` event?", "back": "Triggers when a form is submitted"},
  {"front": "What is Bootstrap?", "back": "A front-end framework for responsive and mobile-first web development"},
  {"front": "What are the three languages all web developers must learn?", "back": "HTML, CSS, and JavaScript"},
  {"front": "What is the DOM in JavaScript?", "back": "Document Object Model - a programming interface for web documents"},
  {"front": "What is an array in JavaScript?", "back": "A data structure that stores multiple values in a single variable"},
  {"front": "What is the `for` loop used for?", "back": "Executing code a specific number of times"},
  {"front": "What is `debugging` in web development?", "back": "The process of finding and fixing errors in code"},
  {"front": "What is the character entity for a non-breaking space?", "back": "&nbsp;"},
  {"front": "What is `SEO`?", "back": "Search Engine Optimization - improving a website's visibility in search results"},
  {"front": "What is responsive web design?", "back": "Designing websites to work well on various devices and screen sizes"},
  {"front": "What is the difference between `frontend` and `backend` development?", "back": "Frontend is client-side; Backend is server-side"},
  {"front": "What is `version control`?", "back": "System for tracking changes to code over time"},
  {"front": "What is the difference between `compiled` and `interpreted` languages?", "back": "Compiled languages are translated to machine code once; Interpreted languages are translated at runtime"},
  {"front": "What is `just-in-time` (JIT) compilation?", "back": "A method that compiles code during execution to improve performance"},
  {"front": "What is the purpose of a `stylesheet`?", "back": "To define the presentation of a web page"},
  {"front": "What is the difference between `type=text` and `type=password`?", "back": "Text displays characters; Password masks characters"},
  {"front": "What is a `radio button`?", "back": "An input control that allows selecting only one option from a group"},
  {"front": "What is a `checkbox`?", "back": "An input control that allows selecting multiple options"},
  {"front": "What is a `select` dropdown?", "back": "A form control that provides a menu of options"},
  {"front": "What is the `textarea` element used for?", "back": "Creating a multi-line text input area"},
  {"front": "What is the `fieldset` element used for?", "back": "Grouping related form data"},
  {"front": "What is the `legend` element used for?", "back": "Defining a caption for a fieldset"},
  {"front": "What is the `src` attribute in the `<img>` tag?", "back": "Specifies the URL of the image to display"},
  {"front": "What is the `alt` attribute in the `<img>` tag?", "back": "Provides alternative text for accessibility when the image cannot be displayed"},
  {"front": "What is the `href` attribute in the `<a>` tag?", "back": "Specifies the URL the link points to"},
  {"front": "What is the `target` attribute in the `<a>` tag?", "back": "Specifies where to open the linked document"},
  {"front": "What is a `hyperlink`?", "back": "A reference to another resource that can be clicked to navigate"},
  {"front": "What is a `web application`?", "back": "An application accessed via a web browser over a network"},
  {"front": "What does `www` stand for?", "back": "World Wide Web"}
];

const oopCards = [
  {"front": "What does OOP stand for?", "back": "Object-Oriented Programming"},
  {"front": "What is a class in Java?", "back": "A blueprint or prototype that defines variables and methods common to all objects of a certain kind"},
  {"front": "What is an object in Java?", "back": "An instance of a class with state, behavior, and identity"},
  {"front": "What is the difference between a class and an object?", "back": "A class is a blueprint; an object is an instance of that class"},
  {"front": "What keyword is used to create an object in Java?", "back": "new"},
  {"front": "What is a constructor in Java?", "back": "A special method used to initialize objects"},
  {"front": "What is the difference between a constructor and a method?", "back": "Constructor has no return type and is called automatically; method has a return type and is called explicitly"},
  {"front": "What is the default constructor in Java?", "back": "A constructor provided by the compiler if no constructor is defined"},
  {"front": "What is constructor overloading?", "back": "Having multiple constructors with different parameter lists"},
  {"front": "What is inheritance in Java?", "back": "A mechanism where one class acquires the properties of another class"},
  {"front": "What keyword is used for inheritance in Java?", "back": "extends"},
  {"front": "What is a superclass?", "back": "The class whose properties are inherited (parent class)"},
  {"front": "What is a subclass?", "back": "The class that inherits properties from another class (child class)"},
  {"front": "What does the super keyword do?", "back": "Refers to the immediate parent class object"},
  {"front": "What are the four types of inheritance in Java?", "back": "Single, Multilevel, Hierarchical, and Hybrid"},
  {"front": "What is single inheritance?", "back": "A subclass derived from only one superclass"},
  {"front": "What is multilevel inheritance?", "back": "A chain of inheritance where a class inherits from another, which inherits from another"},
  {"front": "What is hierarchical inheritance?", "back": "Multiple subclasses inherit from a single superclass"},
  {"front": "What is method overriding?", "back": "When a subclass provides a specific implementation of a method already defined in its superclass"},
  {"front": "What is method overloading?", "back": "Multiple methods with the same name but different parameters in the same class"},
  {"front": "What are the three ways to overload a method?", "back": "Different number of parameters, different data types, different sequence of data types"},
  {"front": "What is the difference between method overloading and overriding?", "back": "Overloading is compile-time; overriding is runtime. Overloading occurs in same class; overriding occurs in subclass"},
  {"front": "What is encapsulation in Java?", "back": "Binding data and methods together and hiding internal details"},
  {"front": "How is encapsulation achieved in Java?", "back": "Using private fields with public getter and setter methods"},
  {"front": "What is a getter method?", "back": "An accessor method that returns the value of a private field"},
  {"front": "What is a setter method?", "back": "A mutator method that modifies the value of a private field"},
  {"front": "What is polymorphism?", "back": "The ability of an object to take on many forms"},
  {"front": "What are the two types of polymorphism in Java?", "back": "Compile-time (static) and Runtime (dynamic) polymorphism"},
  {"front": "What is compile-time polymorphism?", "back": "Method overloading, resolved at compile time"},
  {"front": "What is runtime polymorphism?", "back": "Method overriding, resolved at runtime via dynamic method dispatch"},
  {"front": "What is abstraction in Java?", "back": "Hiding implementation details and showing only essential features"},
  {"front": "What is an abstract class?", "back": "A class declared with the abstract keyword that cannot be instantiated"},
  {"front": "What is an abstract method?", "back": "A method declared with the abstract keyword that has no body"},
  {"front": "Can an abstract class have concrete methods?", "back": "Yes, it can have both abstract and concrete methods"},
  {"front": "What is the difference between abstraction and encapsulation?", "back": "Abstraction hides implementation; encapsulation hides data"},
  {"front": "What is an exception in Java?", "back": "An unwanted or unexpected event that disrupts normal program flow"},
  {"front": "What are the two types of exceptions in Java?", "back": "Checked (compile-time) and Unchecked (runtime) exceptions"},
  {"front": "What is a checked exception?", "back": "An exception checked at compile time"},
  {"front": "What is an unchecked exception?", "back": "An exception that occurs at runtime"},
  {"front": "What are the five keywords used for exception handling?", "back": "try, catch, finally, throw, throws"},
  {"front": "What is the try block?", "back": "A block that encloses code that might throw an exception"},
  {"front": "What is the catch block?", "back": "A block that handles exceptions thrown in the try block"},
  {"front": "What is the finally block?", "back": "A block that always executes, regardless of exception occurrence"},
  {"front": "What is the difference between throw and throws?", "back": "throw is used to explicitly throw an exception; throws is used in method signature to declare exceptions"},
  {"front": "What is the difference between checked and unchecked exceptions?", "back": "Checked exceptions are checked at compile time; unchecked exceptions occur at runtime"},
  {"front": "What is the while loop in Java?", "back": "A loop that executes code repeatedly while a condition is true"},
  {"front": "What is the do-while loop in Java?", "back": "A loop that executes code at least once before checking the condition"},
  {"front": "What is the for loop in Java?", "back": "A loop that executes code a specific number of times"},
  {"front": "What is a nested loop?", "back": "A loop inside another loop"},
  {"front": "What is the break statement in Java?", "back": "Used to exit a loop or switch statement prematurely"},
  {"front": "What is the continue statement in Java?", "back": "Used to skip the current iteration and move to the next iteration"},
  {"front": "What is the difference between break and continue?", "back": "Break exits the loop; continue skips to the next iteration"},
  {"front": "What is a variable in Java?", "back": "A named storage location that holds data which can be changed during program execution"},
  {"front": "What are the three types of variables in Java?", "back": "Local, Instance, and Static/Class variables"},
  {"front": "What is a local variable?", "back": "A variable declared inside a method, constructor, or block"},
  {"front": "What is an instance variable?", "back": "A variable declared inside a class but outside methods, created with each object"},
  {"front": "What is a static variable?", "back": "A variable declared with the static keyword, shared among all objects"},
  {"front": "What are primitive data types in Java?", "back": "byte, short, int, long, float, double, char, boolean"},
  {"front": "What is type casting in Java?", "back": "Converting data from one data type to another"},
  {"front": "What is implicit casting (widening)?", "back": "Automatic conversion from a smaller to a larger data type"},
  {"front": "What is explicit casting (narrowing)?", "back": "Manual conversion from a larger to a smaller data type"},
  {"front": "What are Java operators?", "back": "Symbols that perform operations on variables and values"},
  {"front": "What is the pre-increment operator?", "back": "++x - increments the value before using it"},
  {"front": "What is the post-increment operator?", "back": "x++ - uses the value before incrementing it"},
  {"front": "What is the pre-decrement operator?", "back": "--x - decrements the value before using it"},
  {"front": "What is the post-decrement operator?", "back": "x-- - uses the value before decrementing it"},
  {"front": "What is the superclass of all classes in Java?", "back": "Object class"},
  {"front": "What is the Java Virtual Machine (JVM)?", "back": "A runtime environment that executes Java bytecode"},
  {"front": "What is Java bytecode?", "back": "The intermediate code generated by the Java compiler that runs on the JVM"},
  {"front": "What is the difference between JVM, JRE, and JDK?", "back": "JVM runs bytecode; JRE is JVM + libraries; JDK is JRE + development tools"},
  {"front": "What is the main method signature in Java?", "back": "public static void main(String[] args)"},
  {"front": "What is the Scanner class used for?", "back": "Reading user input from the console"},
  {"front": "What is the difference between System.out.print() and System.out.println()?", "back": "println() adds a new line; print() does not"},
  {"front": "What is a package in Java?", "back": "A group of related classes and interfaces"},
  {"front": "What is the import statement used for?", "back": "To use classes from other packages"},
  {"front": "What is an identifier in Java?", "back": "A name given to a class, method, variable, or package"},
  {"front": "What are the rules for identifiers in Java?", "back": "Must start with letter, underscore, or currency symbol; can contain letters, digits, underscore, currency symbols"},
  {"front": "What are Java keywords?", "back": "Reserved words that have predefined meaning and cannot be used as identifiers"},
  {"front": "What is the this keyword in Java?", "back": "Refers to the current object instance"},
  {"front": "What is the difference between this and super?", "back": "this refers to current class; super refers to parent class"},
  {"front": "What is an access modifier?", "back": "A keyword that sets the visibility of classes, methods, and fields"},
  {"front": "What are the access modifiers in Java?", "back": "public, private, protected, and default (package-private)"},
  {"front": "What is the difference between public and private?", "back": "public is accessible everywhere; private is accessible only within the same class"},
  {"front": "What is the final keyword in Java?", "back": "Used to make a variable constant, prevent method overriding, or prevent class inheritance"},
  {"front": "What is the static keyword in Java?", "back": "Makes a variable or method belong to the class rather than instances"},
  {"front": "Can a static method access non-static members?", "back": "No, static methods cannot access non-static members directly"},
  {"front": "What is the instanceof operator used for?", "back": "Checking if an object is an instance of a specific class or interface"},
  {"front": "What is an array in Java?", "back": "A data structure that stores multiple values of the same type in a single variable"},
  {"front": "How do you get the length of an array in Java?", "back": "Using the length property"},
  {"front": "What is a multi-dimensional array in Java?", "back": "An array of arrays, used for table-like data structures"},
  {"front": "What is the enhanced for loop (for-each) in Java?", "back": "A loop that iterates over elements in an array or collection without using an index"},
  {"front": "What is the String class in Java?", "back": "A class that represents a sequence of characters"},
  {"front": "Are strings immutable in Java?", "back": "Yes, strings are immutable once created"},
  {"front": "What is a Java interface?", "back": "A completely abstract class with only abstract methods and constants"},
  {"front": "What is the difference between an abstract class and an interface?", "back": "Abstract class can have concrete methods; interface methods are abstract by default. A class can implement multiple interfaces but extend only one abstract class"},
  {"front": "What is upcasting in Java?", "back": "Assigning a subclass object to a superclass reference"},
  {"front": "What is downcasting in Java?", "back": "Casting a superclass reference to a subclass type"}
];

const madCards = [
  {"front": "What is a mobile operating system?", "back": "An OS that runs application software on mobile devices"},
  {"front": "What is the difference between iOS and Android?", "back": "iOS is closed-source, runs on Apple devices; Android is open-source, runs on multiple hardware"},
  {"front": "What is mobile computing?", "back": "A computing environment that connects a mobile device to a network anytime and anywhere"},
  {"front": "What is the dominant mobile OS by market share?", "back": "Android"},
  {"front": "What does SDK stand for?", "back": "Software Development Kit"},
  {"front": "What is Android Studio?", "back": "The official IDE for Android development"},
  {"front": "What is an AVD?", "back": "Android Virtual Device - an emulator for running Android apps"},
  {"front": "What is the Android Manifest file?", "back": "A configuration file specifying app-level details like permissions and components"},
  {"front": "What is an Activity in Android?", "back": "A single screen or page in an Android application"},
  {"front": "What method is called when an Activity is first created?", "back": "onCreate()"},
  {"front": "What does setContentView() do?", "back": "Specifies the UI layout for an Activity"},
  {"front": "What is the R class in Android?", "back": "A generated class containing constants from XML resources"},
  {"front": "What is a View in Android?", "back": "A basic building block of UI, a rectangular box that responds to user input"},
  {"front": "What is a ViewGroup?", "back": "An invisible container that holds Views and other ViewGroups"},
  {"front": "What is the difference between a View and a ViewGroup?", "back": "View is a UI component; ViewGroup is a container for Views"},
  {"front": "What are the most common layouts in Android?", "back": "LinearLayout, RelativeLayout, FrameLayout, TableLayout, ConstraintLayout"},
  {"front": "What does LinearLayout do?", "back": "Arranges children in a single row or single column"},
  {"front": "What does RelativeLayout do?", "back": "Arranges views in relation to each other or the parent"},
  {"front": "What is the difference between dp and px?", "back": "dp is density-independent; px is actual pixels"},
  {"front": "What does match_parent mean in layout?", "back": "Expands to fill the parent container"},
  {"front": "What does wrap_content mean in layout?", "back": "Expands only far enough to contain its contents"},
  {"front": "What is an Intent in Android?", "back": "A message object used to request an action from another app component"},
  {"front": "How do you pass data between Activities?", "back": "Using Intent extras with putExtra() and getExtra()"},
  {"front": "What is a PendingIntent?", "back": "An intent that allows another component to perform an action on your app's behalf later"},
  {"front": "What is a Service in Android?", "back": "A component that runs in the background without a UI"},
  {"front": "What is a Content Provider?", "back": "A component that provides data to other applications"},
  {"front": "What is a Content URI?", "back": "A URI used to access data from a Content Provider"},
  {"front": "What are the four CRUD operations in Content Providers?", "back": "Create, Read, Update, Delete"},
  {"front": "What is SQLite?", "back": "A lightweight relational database embedded in Android"},
  {"front": "What class is used to manage SQLite databases in Android?", "back": "SQLiteOpenHelper"},
  {"front": "What is a Cursor in Android?", "back": "An interface for navigating query results from a database"},
  {"front": "What are SharedPreferences used for?", "back": "Storing primitive data in key-value pairs"},
  {"front": "What is the difference between internal and external storage?", "back": "Internal storage is private to the app; external storage is shared and visible"},
  {"front": "What permission is needed for Internet access?", "back": "android.permission.INTERNET"},
  {"front": "How do you check network connectivity in Android?", "back": "Using ConnectivityManager and NetworkInfo"},
  {"front": "What is the AsyncTask class used for?", "back": "Performing background network operations on a separate thread"},
  {"front": "What is Retrofit?", "back": "A popular Android library for HTTP networking"},
  {"front": "What is NFC?", "back": "Near Field Communication - short-range wireless technology"},
  {"front": "What is the BluetoothAdapter class?", "back": "Used to perform Bluetooth operations like discovery and pairing"},
  {"front": "What is the TelephonyManager?", "back": "Used to access device telephony information"},
  {"front": "What is an AlarmManager?", "back": "Used to schedule operations outside the lifetime of an application"},
  {"front": "What is a Toast in Android?", "back": "A temporary popup message that appears and disappears"},
  {"front": "What is a Notification?", "back": "A message displayed outside the app's UI to provide updates"},
  {"front": "How do you create a Notification in Android?", "back": "Using NotificationCompat.Builder"},
  {"front": "What is the difference between a Toast and a Notification?", "back": "Toast is temporary; Notification persists in the status bar"},
  {"front": "What is an AlertDialog?", "back": "A floating window that prompts the user for a decision"},
  {"front": "What is an Option Menu?", "back": "A menu accessed via the menu button or action bar"},
  {"front": "What is a Context Menu?", "back": "A menu displayed when the user long-presses on an element"},
  {"front": "What is localization in Android?", "back": "Adapting the app for different regions and languages"},
  {"front": "What is the purpose of the values-local folder?", "back": "To store localized string resources for a specific language/region"},
  {"front": "What is the DVM?", "back": "Dalvik Virtual Machine - runtime for Android pre-5.0"},
  {"front": "What replaced DVM in Android?", "back": "ART (Android Runtime)"},
  {"front": "What is a .dex file?", "back": "Dalvik Executable - the compiled bytecode format for Android apps"},
  {"front": "What is an APK file?", "back": "Android Package Kit - the installable file for Android applications"},
  {"front": "What is the Linux kernel's role in Android?", "back": "Provides core system services like memory and process management"},
  {"front": "What is the EditText control?", "back": "A widget for user text input with editing capabilities"},
  {"front": "What is the Spinner widget?", "back": "A dropdown list that allows selecting one value from a set"},
  {"front": "What is the difference between CheckBox and RadioButton?", "back": "CheckBox allows multiple selections; RadioButton allows only one"},
  {"front": "What is a DatePicker?", "back": "A widget that allows users to select a date"},
  {"front": "What is a TimePicker?", "back": "A widget that allows users to select a time"},
  {"front": "What is the ProgressBar widget?", "back": "Provides visual feedback about ongoing background tasks"},
  {"front": "What is data synchronization in mobile computing?", "back": "Establishing consistency among data across multiple sources and targets"},
  {"front": "What are the four mobile app development models?", "back": "Responsive Web, Hybrid, Hybrid Mixed, and Native"},
  {"front": "What is the advantage of Native apps?", "back": "Best performance and full access to device hardware"},
  {"front": "What is the advantage of Hybrid apps?", "back": "Faster development using web technologies with app store distribution"},
  {"front": "What is Apache Cordova?", "back": "A framework for building hybrid mobile apps with HTML5 and JavaScript"},
  {"front": "What is a responsive web app?", "back": "A web app that automatically adapts to the device screen size"},
  {"front": "What is HAXM?", "back": "Intel's virtualization accelerator for speeding up Android emulation"},
  {"front": "What is the difference between portrait and landscape orientation?", "back": "Portrait is taller; landscape is wider"},
  {"front": "What is screen density?", "back": "The quantity of pixels within a physical area, measured in dpi"},
  {"front": "What is the padding property in Android?", "back": "Space inside the view border between the content and the border"},
  {"front": "What is the margin property in Android?", "back": "Space outside the view border between the view and adjacent elements"},
  {"front": "What is the difference between commit() and apply() in SharedPreferences?", "back": "commit() returns a boolean and writes synchronously; apply() writes asynchronously"},
  {"front": "What is the ContentResolver?", "back": "The class that communicates with ContentProviders"},
  {"front": "What is a BroadcastReceiver?", "back": "A component that responds to system-wide broadcast events"},
  {"front": "What is permission auto-reset in Android 11?", "back": "Auto-resets permissions for unused apps to protect user privacy"},
  {"front": "What is Material Design?", "back": "Google's design language introduced in Android Lollipop"},
  {"front": "What is the difference between Mode_PRIVATE and Mode_WORLD_READABLE in file storage?", "back": "Mode_PRIVATE creates a private file; Mode_WORLD_READABLE creates a public file"},
  {"front": "What is the Layout Editor in Android Studio?", "back": "A drag-and-drop interface for building XML layouts visually"},
  {"front": "What is a Fragment?", "back": "A reusable piece of UI that can be combined into activities"},
  {"front": "What is the getExternalFilesDir() method?", "back": "Returns the path to a private directory on external storage for the app"},
  {"front": "What is the getFilesDir() method?", "back": "Returns the path to the internal storage directory for the app"},
  {"front": "What is the purpose of the provider tag in AndroidManifest.xml?", "back": "To register a ContentProvider in the application"},
  {"front": "What is the difference between Bluetooth and NFC?", "back": "Bluetooth has longer range and higher data rate; NFC has very short range and lower data rate"},
  {"front": "What is an RFCOMM channel?", "back": "A Bluetooth communication channel for serial data transmission"},
  {"front": "What is the SmsManager class?", "back": "Used to send SMS messages programmatically"},
  {"front": "What is the getDefaultAdapter() method on BluetoothAdapter?", "back": "Returns the default Bluetooth adapter on the device"},
  {"front": "What is the difference between a Router and a Switch?", "back": "Router uses IP addresses to route between networks; Switch uses MAC addresses within a network"},
  {"front": "What is a Packet in networking?", "back": "The fundamental unit of data transmitted over the Internet"},
  {"front": "What does TCP stand for?", "back": "Transmission Control Protocol"},
  {"front": "What does IP stand for?", "back": "Internet Protocol"},
  {"front": "What is the difference between TCP and IP?", "back": "TCP handles establishing/maintaining conversations; IP handles routing"},
  {"front": "What is a client in networking?", "back": "A component that requests services on the network"},
  {"front": "What is a server in networking?", "back": "A host that responds to service requests from clients"},
  {"front": "What is the ConnectivityManager?", "back": "A class that answers queries about network connectivity state"},
  {"front": "What is the NetworkInfo class?", "back": "Describes the status of a network interface"},
  {"front": "What is the primary cause of battery drain in networking?", "back": "Using the wireless radio for data transfer"},
  {"front": "What is the difference between a Hub and a Switch?", "back": "Hub sends packets to all devices; Switch sends to specific destination based on MAC address"},
  {"front": "What is the internet?", "back": "An interconnected network of networks using TCP/IP"},
  {"front": "What was ARPANET?", "back": "The first operational packet-switching network, precursor to the Internet"},
  {"front": "What is the purpose of the getActiveNetworkInfo() method?", "back": "Checks whether a network connection is available"}
];

async function seedDeck(courseCode, courseTitleFallback, deckTitle, cards) {
  const courseRes = await pool.query(
    "SELECT id, title, code FROM courses WHERE code = $1 OR title ILIKE $2 LIMIT 1",
    [courseCode, `%${courseTitleFallback}%`]
  );

  let courseId;
  if (courseRes.rows.length > 0) {
    courseId = courseRes.rows[0].id;
    console.log(`✅ Found course: [${courseRes.rows[0].code}] ${courseRes.rows[0].title} (ID: ${courseId})`);
  } else {
    console.log(`⚠️ Course ${courseCode} not found in database.`);
    return;
  }

  // Check if deck exists
  const existingDeck = await pool.query(
    "SELECT id FROM flashcard_decks WHERE course_id = $1 AND is_public = TRUE",
    [courseId]
  );

  let deckId;
  if (existingDeck.rows.length > 0) {
    deckId = existingDeck.rows[0].id;
    console.log(`🔄 Updating existing public deck [${deckTitle}] (Deck ID: ${deckId})`);
    await pool.query(
      "UPDATE flashcard_decks SET title = $1, is_public = TRUE WHERE id = $2",
      [deckTitle, deckId]
    );
    await pool.query("DELETE FROM flashcards WHERE deck_id = $1", [deckId]);
  } else {
    const newDeck = await pool.query(
      "INSERT INTO flashcard_decks (user_id, course_id, title, is_public) VALUES (NULL, $1, $2, TRUE) RETURNING id",
      [courseId, deckTitle]
    );
    deckId = newDeck.rows[0].id;
    console.log(`✨ Created new public deck [${deckTitle}] (Deck ID: ${deckId})`);
  }

  // Batch insert cards in chunks of 25
  const chunkSize = 25;
  let totalInserted = 0;

  for (let i = 0; i < cards.length; i += chunkSize) {
    const chunk = cards.slice(i, i + chunkSize);
    const valueStrings = [];
    const values = [];

    chunk.forEach((card, idx) => {
      const offset = idx * 3;
      valueStrings.push(`($${offset + 1}, $${offset + 2}, $${offset + 3})`);
      values.push(deckId, card.front.trim(), card.back.trim());
    });

    const queryText = `INSERT INTO flashcards (deck_id, front, back) VALUES ${valueStrings.join(', ')}`;
    await pool.query(queryText, values);
    totalInserted += chunk.length;
  }

  console.log(`🎉 Seeded ${totalInserted} flashcards for [${deckTitle}]!`);
}

async function runSeed() {
  try {
    console.log('🚀 Starting Flashcards Seeder for IAS, IP1, OOP, and MAD...');

    // 1. Information Assurance & Security (IAS315)
    await seedDeck(
      'IAS315',
      'Information Assurance',
      'IAS315: Information Assurance and Security - Complete Flashcards (96 Questions)',
      iasCards
    );

    // 2. Internet Programming I (IP1309)
    await seedDeck(
      'IP1309',
      'Internet Programming I',
      'IP1309: Internet Programming I - Complete Flashcards (97 Questions)',
      ip1Cards
    );

    // 3. Object-Oriented Programming in Java (OOP302)
    await seedDeck(
      'OOP302',
      'Object-Oriented Programming',
      'OOP302: Object-Oriented Programming in Java - Complete Flashcards (97 Questions)',
      oopCards
    );

    // 4. Mobile Application Development (MAD311)
    await seedDeck(
      'MAD311',
      'Mobile Application Development',
      'MAD311: Mobile Application Development - Complete Flashcards (101 Questions)',
      madCards
    );

    console.log('🏁 All 4 requested decks successfully seeded!');
  } catch (err) {
    console.error('❌ Error during seeding:', err);
  } finally {
    process.exit(0);
  }
}

runSeed();
