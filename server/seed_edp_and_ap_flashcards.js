const pool = require('./src/config/db');

const eventDrivenProgrammingCards = [
  {"front": "What is the name of the base class for all exceptions in C#?", "back": "System.Exception"},
  {"front": "What keyword is used to throw an exception in C#?", "back": "throw"},
  {"front": "What is the purpose of the finally block in exception handling?", "back": "To execute cleanup code regardless of whether an exception occurred."},
  {"front": "What type of error is detected by the compiler before execution?", "back": "Compile-time error"},
  {"front": "What is the process of identifying and fixing defects in an application called?", "back": "Debugging"},
  {"front": "Which key is used to set a breakpoint in Visual Studio?", "back": "F9"},
  {"front": "Which debugger command executes the current line and moves to the next, skipping method details?", "back": "Step Over (F10)"},
  {"front": "Which debugger command dives into a method call to debug its implementation?", "back": "Step Into (F11)"},
  {"front": "What is a marker that pauses program execution at a specific line of code called?", "back": "Breakpoint"},
  {"front": "What is the programming paradigm where program flow is determined by events?", "back": "Event-Driven Programming"},
  {"front": "What is an action or occurrence that a program can recognize and respond to?", "back": "Event"},
  {"front": "What is a function that contains the logic to be executed when a particular event occurs?", "back": "Event Handler"},
  {"front": "What is a procedure or function that is configured to listen for specific events?", "back": "Event Listener"},
  {"front": "What is a core mechanism that constantly checks for new events and dispatches them?", "back": "Event Loop"},
  {"front": "What is the name of the .NET execution engine that manages memory and code execution?", "back": "Common Language Runtime (CLR)"},
  {"front": "What is the intermediate language that C# code is compiled into?", "back": "Microsoft Intermediate Language (MSIL)"},
  {"front": "What is the standard library in .NET that contains a collection of classes and interfaces?", "back": "Framework Class Library (FCL)"},
  {"front": "What is the name of the .NET class library for building Windows desktop applications?", "back": "Windows Forms"},
  {"front": "Which framework is used to establish a connection between an application and data sources?", "back": "ADO.NET"},
  {"front": "What is the .NET ORM framework used to work with a database using .NET objects?", "back": "Entity Framework (EF)"},
  {"front": "Which framework in .NET is used for building service-oriented applications?", "back": "Windows Communication Foundation (WCF)"},
  {"front": "What is the graphical subsystem for rendering user interfaces in Windows-based applications?", "back": "Windows Presentation Foundation (WPF)"},
  {"front": "What is the query language introduced in .NET 3.5 for querying data sources?", "back": "Language Integrated Query (LINQ)"},
  {"front": "What type of form blocks interaction with its parent until it is closed?", "back": "Modal Form"},
  {"front": "Which method is used to display a modal form?", "back": "ShowDialog()"},
  {"front": "What type of form allows users to interact with multiple forms simultaneously?", "back": "Modeless Form"},
  {"front": "Which method is used to display a modeless form?", "back": "Show()"},
  {"front": "What is the UI design where each document or window is a separate instance?", "back": "Single-Document Interface (SDI)"},
  {"front": "What is the UI design where a single parent window holds multiple child windows?", "back": "Multiple-Document Interface (MDI)"},
  {"front": "Which property of the main form must be set to true for MDI support?", "back": "IsMdiContainer"},
  {"front": "Which property of a child form specifies its parent in an MDI application?", "back": "MdiParent"},
  {"front": "Which control is used to display static text or instructions on a form?", "back": "Label"},
  {"front": "Which control accepts user input in the form of text?", "back": "TextBox"},
  {"front": "Which control is used to group related controls with a border and title?", "back": "GroupBox"},
  {"front": "Which control is used to display a scrollable list of items from which users can select?", "back": "ListBox"},
  {"front": "Which control combines a TextBox and a ListBox, allowing selection or custom entry?", "back": "ComboBox"},
  {"front": "Which control allows users to select one or more options and supports a binary choice?", "back": "CheckBox"},
  {"front": "Which control allows users to select only one option from a group?", "back": "RadioButton"},
  {"front": "Which control is used to display and edit tabular data?", "back": "DataGridView"},
  {"front": "Which control is used to display a hierarchical data example like a folder structure?", "back": "TreeView"},
  {"front": "What is the name of the standard menu bar control in Windows Forms?", "back": "MenuStrip"},
  {"front": "What is the name of the right-click menu that provides shortcuts to commands?", "back": "ContextMenuStrip"},
  {"front": "Which dialog is used to browse and select a file to open?", "back": "OpenFileDialog"},
  {"front": "Which dialog is used to save a file with a given name?", "back": "SaveFileDialog"},
  {"front": "Which dialog is used to choose a color from a palette?", "back": "ColorDialog"},
  {"front": "Which dialog is used to select a font and style?", "back": "FontDialog"},
  {"front": "In the .NET Framework, what is a type-safe function pointer?", "back": "Delegate"},
  {"front": "What is a delegate that points to multiple methods called?", "back": "Multicast Delegate"},
  {"front": "What keyword is used to declare an event in C#?", "back": "event"},
  {"front": "What is the primary purpose of JWT (JSON Web Token)?", "back": "To securely transmit identity and claims information between parties."},
  {"front": "In MVC, what is the component responsible for handling requests and coordinating Model and View?", "back": "Controller"},
  {"front": "In MVC, what component represents the user interface (HTML)?", "back": "View"},
  {"front": "In MVC, what component represents the data and business rules?", "back": "Model"},
  {"front": "What is the default route template in ASP.NET Core MVC?", "back": "{controller=Home}/{action=Index}/{id?}"},
  {"front": "What attribute is used to protect a controller action from unauthorized access in ASP.NET Core?", "back": "[Authorize]"},
  {"front": "What is the lightweight, cross-platform web framework by Microsoft?", "back": "ASP.NET Core"},
  {"front": "What is the architectural pattern that separates an application into Model, View, and Controller?", "back": "MVC"},
  {"front": "What is the mechanism in EF Core used to apply incremental database structure changes?", "back": "Migrations"},
  {"front": "What is the name of the method used in EF Core to configure entity relationships and constraints?", "back": "OnModelCreating"},
  {"front": "What is the base class for a DbContext in EF Core?", "back": "DbContext"},
  {"front": "What is the term for the process of storing the state of an object in a persistent medium?", "back": "Serialization"},
  {"front": "Which attribute is used to mark a property as the primary key in EF Core?", "back": "[Key]"},
  {"front": "What is the name of the DbSet property that represents a table in EF Core?", "back": "DbSet<T>"},
  {"front": "What does the acronym ORM stand for?", "back": "Object-Relational Mapping"},
  {"front": "What is the name of the .NET framework for building modern desktop applications using C#?", "back": ".NET MAUI"},
  {"front": "What is the process of converting MSIL to machine code at runtime called?", "back": "Just-In-Time (JIT) Compilation"},
  {"front": "What is the term for the practice of writing code to create programs that can communicate over a network?", "back": "Network Programming"},
  {"front": "What is the endpoint for communication between two programs over a network?", "back": "Socket"},
  {"front": "Which Java class represents an internet address (IP address and hostname)?", "back": "InetAddress"},
  {"front": "What is the name of the Java class used to create a server socket for TCP communication?", "back": "ServerSocket"},
  {"front": "Which Java class is used by clients to connect to a server via TCP?", "back": "Socket"},
  {"front": "Which Java class is used for sending and receiving datagram packets over UDP?", "back": "DatagramSocket"},
  {"front": "Which Java class represents an independent, self-contained message for UDP communication?", "back": "DatagramPacket"},
  {"front": "What is the name of the Java class for representing a Uniform Resource Locator?", "back": "URL"},
  {"front": "Which Java interface provides metadata about a database itself?", "back": "DatabaseMetaData"},
  {"front": "Which JDBC driver type is a pure Java driver that communicates directly with the database?", "back": "Type 4"},
  {"front": "What is the purpose of a PreparedStatement in JDBC?", "back": "To execute precompiled SQL statements with parameters, improving performance and security."},
  {"front": "What is the name of the Java class used to define a blueprint for objects?", "back": "Class"},
  {"front": "What is an instance of a class called?", "back": "Object"},
  {"front": "What is the process by which a subclass acquires properties and behaviors of a superclass?", "back": "Inheritance"},
  {"front": "What is the term for binding data and methods into a single unit called a class?", "back": "Encapsulation"},
  {"front": "What is the term for hiding internal details and showing only functionality?", "back": "Abstraction"},
  {"front": "What is the term for the ability of a method to perform different tasks based on the object it is called on?", "back": "Polymorphism"},
  {"front": "Which keyword is used to create a constant variable in C#?", "back": "const"},
  {"front": "Which keyword is used to declare a variable whose value can be assigned only once, either at declaration or in a constructor?", "back": "readonly"},
  {"front": "In C#, what is a method that performs an action but does not return a value called?", "back": "Void method"},
  {"front": "What is the control flow statement used to execute a block of code repeatedly based on a condition?", "back": "Loop"},
  {"front": "Which loop is guaranteed to execute at least once, regardless of the condition?", "back": "do-while loop"},
  {"front": "Which loop is used to iterate over all elements in a collection or array?", "back": "foreach loop"},
  {"front": "Which statement is used to skip the remaining statements of the current loop iteration and move to the next?", "back": "continue"},
  {"front": "Which statement is used to exit a loop or switch statement prematurely?", "back": "break"},
  {"front": "What is the process of creating a new type by deriving from an existing type called?", "back": "Inheritance"},
  {"front": "What is a method that initializes an object when it is created called?", "back": "Constructor"},
  {"front": "What is the term for a class that cannot be instantiated and serves as a blueprint for derived classes?", "back": "Abstract Class"},
  {"front": "What is the mechanism in .NET that cleans up unused memory automatically?", "back": "Garbage Collection"},
  {"front": "What is the data type used to store true or false values in C#?", "back": "bool"},
  {"front": "What is the data type used to store a single character in C#?", "back": "char"},
  {"front": "What is the method used to convert a string to an integer in C#?", "back": "Convert.ToInt32() or int.Parse()"},
  {"front": "What is the operator used for concatenating strings in C#?", "back": "+"},
  {"front": "What is the string interpolation syntax in C#?", "back": "$"},
  {"front": "What is the attribute used to specify the precision and scale of a decimal property in EF Core?", "back": "HasColumnType or Column (with TypeName)"}
];

const advancedProgrammingCards = [
  {"front": "What is the name of the Java class that represents a file path?", "back": "Path"},
  {"front": "Which Java package contains the Path and Files classes?", "back": "java.nio.file"},
  {"front": "What is the term for an endpoint for communication between two programs over a network?", "back": "Socket"},
  {"front": "Which class in Java is used to create a server socket for TCP communication?", "back": "ServerSocket"},
  {"front": "What is the term for encoding data to render it unreadable without a decryption key?", "back": "Encryption"},
  {"front": "Which Java class is used to read character data from a file?", "back": "FileReader"},
  {"front": "What is a servlet?", "back": "A Java class that extends server functionality to handle requests."},
  {"front": "Which Java interface defines the life cycle methods init, service, and destroy for a servlet?", "back": "javax.servlet.Servlet"},
  {"front": "What is the purpose of the servlet's init() method?", "back": "Called once to initialize the servlet after creation."},
  {"front": "What is the purpose of the servlet's service() method?", "back": "Called for each request to process it and generate a response."},
  {"front": "What is a JSP declaration?", "back": "A JSP scripting element (delimited by <%! %>) used to define variables and methods."},
  {"front": "What is a JSP expression?", "back": "A JSP scripting element (delimited by <%= %>) that evaluates and outputs a value."},
  {"front": "Which HTTP method is used to request data from a specified resource?", "back": "GET"},
  {"front": "Which HTTP method is used to send data to a server to create/update a resource?", "back": "POST"},
  {"front": "What is a thread?", "back": "A single sequential flow of control within a program."},
  {"front": "What is the name of the method that must be implemented by a Runnable interface?", "back": "run()"},
  {"front": "Which class is extended to create a thread in Java?", "back": "Thread"},
  {"front": "What is the name of the method that starts a thread's execution?", "back": "start()"},
  {"front": "Which method causes the current thread to pause execution for a specified time?", "back": "sleep()"},
  {"front": "Which method causes the current thread to wait until another thread completes?", "back": "join()"},
  {"front": "What is a deadlock?", "back": "A state where two or more threads wait indefinitely for locks held by each other."},
  {"front": "What is a synchronized method?", "back": "A method that allows only one thread to execute it on a given object at a time."},
  {"front": "What is the name of the Java class used to map Java objects to database tables?", "back": "Hibernate"},
  {"front": "What does JPA stand for?", "back": "Java Persistence API"},
  {"front": "Which Java testing framework is primarily used for unit testing?", "back": "JUnit"},
  {"front": "What is the name of the Spring module that simplifies building cloud-native microservices?", "back": "Spring Cloud"},
  {"front": "What are the four main phases of Query Processing?", "back": "Decomposition, Optimization, Code generation, and Execution."},
  {"front": "What is Query Decomposition?", "back": "The process of transforming a high-level query into a relational algebra query."},
  {"front": "What is a Query Tree?", "back": "A graphical representation of operators, relations, attributes, and predicates in a query."},
  {"front": "What does the 'C' in the ACID property stand for?", "back": "Consistency."},
  {"front": "What property ensures a transaction is treated as a single, indivisible unit?", "back": "Atomicity."},
  {"front": "What is a Dirty Read?", "back": "Reading uncommitted data from another transaction."},
  {"front": "What is a serializable schedule?", "back": "A schedule that yields the same result as some serial schedule."},
  {"front": "What tool is used to test for conflict serializability?", "back": "A precedence graph."},
  {"front": "What are the three basic concurrency control techniques?", "back": "Locking, Time stamping, and Optimistic."},
  {"front": "What type of lock allows multiple transactions to read data simultaneously?", "back": "Shared lock."},
  {"front": "What is the Two-Phase Locking (2PL) protocol?", "back": "A protocol where all locks precede the first unlock."},
  {"front": "What is a deadlock in transaction processing?", "back": "A state where two or more transactions are waiting for locks held by each other."},
  {"front": "What is a timestamp in concurrency control?", "back": "A unique identifier indicating a transaction's relative starting time."},
  {"front": "What is Granularity in concurrency control?", "back": "The size of the data items chosen as the unit of protection."},
  {"front": "What is a Write-Ahead Logging (WAL) protocol?", "back": "Ensures log records are written to stable storage before the database update."},
  {"front": "What is a Database Log?", "back": "A file containing a history of all actions executed by the DBMS for recovery purposes."},
  {"front": "What is a Checkpoint in a database system?", "back": "A point of synchronization between the database and the log file."},
  {"front": "What is the Deferred Update recovery technique?", "back": "Updates are not written to the database until after the transaction commits."},
  {"front": "What is the Immediate Update recovery technique?", "back": "Updates are applied to the database as they occur."},
  {"front": "What is Database Security?", "back": "Protection of information against unauthorized access, modification, or destruction."},
  {"front": "What is Database Integrity?", "back": "Mechanisms to ensure data in the database is correct and consistent."},
  {"front": "What is Authorization in database security?", "back": "Granting a right or privilege to access a system or object."},
  {"front": "What is a View used for in security?", "back": "To hide parts of the database from certain users."},
  {"front": "What is Authentication?", "back": "The process of checking whether a user is who they claim to be."},
  {"front": "What is an Object in OODBMS?", "back": "A uniquely identifiable entity that contains attributes and methods."},
  {"front": "What is Encapsulation?", "back": "The bundling of data structure and operations to manipulate it within an object."},
  {"front": "What is an Object Identifier (OID)?", "back": "A system-generated, unique, and invariant identifier for an object."},
  {"front": "What is a Method in an OODBMS?", "back": "Defines the behavior of an object as a set of encapsulated functions."},
  {"front": "What is a Class in an OODBMS?", "back": "A blueprint for defining a set of similar objects (instances)."},
  {"front": "What is Inheritance in OODBMS?", "back": "Allowing a class (subclass) to be defined as a special case of a more general class (superclass)."},
  {"front": "What is a Distributed Database (DDB)?", "back": "A collection of logically related databases distributed over a computer network."},
  {"front": "What is Data Allocation in DDBMS?", "back": "The process of deciding where to store particular data items."},
  {"front": "What is Data Replication in DDBMS?", "back": "Storing copies of data fragments at multiple sites."},
  {"front": "What is Data Fragmentation in DDBMS?", "back": "Partitioning a relation into several fragments stored in distinct sites."},
  {"front": "What is Horizontal Fragmentation?", "back": "Partitioning a relation by rows (using a Selection operation)."},
  {"front": "What is Vertical Fragmentation?", "back": "Partitioning a relation by columns (using a Projection operation)."},
  {"front": "What is a Local Transaction in DDBMS?", "back": "A transaction that accesses data only in a single site."},
  {"front": "What is a Global Transaction in DDBMS?", "back": "A transaction that accesses data in several sites."},
  {"front": "What is a Homogeneous Distributed Database?", "back": "All sites have the same DBMS software and are aware of each other."},
  {"front": "What is a Heterogeneous Distributed Database?", "back": "Different sites may use different schemas and DBMS software."},
  {"front": "What is the main goal of Query Optimization?", "back": "To minimize the cost of processing a query."},
  {"front": "What is a Lost Update problem?", "back": "An update by one transaction is overwritten by another."},
  {"front": "What is a Wait-For Graph?", "back": "A graph used to detect deadlocks by showing which transactions are waiting for locks held by others."},
  {"front": "What is the Wait-Die deadlock prevention scheme?", "back": "An older transaction waits, but a younger transaction dies (aborts) if it requests a locked item."},
  {"front": "What is the Wound-Wait deadlock prevention scheme?", "back": "An older transaction wounds (aborts) a younger one, while a younger transaction waits."},
  {"front": "What is a log record's Before-Image (BFIM)?", "back": "The old value of a data item before an update."},
  {"front": "What is the significance of 'LSN' (Log Sequence Number)?", "back": "A unique identifier for every log record, used to ensure order and for recovery."},
  {"front": "What is Centralized 2PL in a DDBMS?", "back": "A single site is responsible for granting and releasing locks for all transactions."},
  {"front": "What is Primary 2PL in a DDBMS?", "back": "A lock manager on a primary copy site is responsible for granting and releasing locks."},
  {"front": "What is the main advantage of data replication?", "back": "Improved availability and increased parallelism for read-only queries."},
  {"front": "What is the main disadvantage of data replication?", "back": "Increased overhead for updates and a higher risk of inconsistency."},
  {"front": "What is a major advantage of using views for security?", "back": "They can restrict users to a subset of the data in base relations, providing a more granular control."},
  {"front": "Which method of the ResultSet moves the cursor to the first row?", "back": "first()"},
  {"front": "Which JDBC driver type is a pure Java driver that communicates directly with the database?", "back": "Type 4"},
  {"front": "What is the purpose of a PreparedStatement in JDBC?", "back": "To execute precompiled SQL statements with parameters, improving performance and security."},
  {"front": "What is the name of the interface that provides metadata about a ResultSet?", "back": "ResultSetMetaData"},
  {"front": "Which class in JavaFX is the root of the scene graph?", "back": "Scene"},
  {"front": "What is the name of the mechanism that allows a subclass to use methods of its superclass?", "back": "Inheritance"},
  {"front": "Which keyword is used in Java to explicitly call a superclass constructor?", "back": "super"},
  {"front": "What is the term for the ability of a method to perform different tasks based on the object it is called on?", "back": "Polymorphism"},
  {"front": "Which keyword is used to create an abstract class in Java?", "back": "abstract"},
  {"front": "What is the name of the interface that must be implemented by classes whose objects can be serialized?", "back": "Serializable"},
  {"front": "Which method is used to read an integer from a Scanner object?", "back": "nextInt()"},
  {"front": "What is the Java class used to create and write to a file using formatted output?", "back": "Formatter"},
  {"front": "Which servlet method handles HTTP GET requests?", "back": "doGet()"},
  {"front": "Which servlet method handles HTTP POST requests?", "back": "doPost()"},
  {"front": "What is the name of the annotation used to mark a class as a Spring Boot application?", "back": "@SpringBootApplication"},
  {"front": "What is the term for a self-contained, deployable, and independently scalable service in a microservices architecture?", "back": "Microservice"}
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
    console.log('🚀 Starting Flashcards Seeder for EDP and AP...');

    // 1. Event-Driven Programming
    await seedDeck(
      'EDP304',
      'Event-Driven Programming',
      'EDP304: Event-Driven Programming - Complete Flashcards (100 Questions)',
      eventDrivenProgrammingCards
    );

    // 2. Advanced Programming
    await seedDeck(
      'AP306',
      'Advanced Programming',
      'AP306: Advanced Programming - Complete Flashcards (94 Questions)',
      advancedProgrammingCards
    );

    console.log('🏁 All requested decks successfully seeded!');
  } catch (err) {
    console.error('❌ Error during seeding:', err);
  } finally {
    process.exit(0);
  }
}

runSeed();
