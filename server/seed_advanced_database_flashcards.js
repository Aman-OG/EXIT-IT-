const pool = require('./src/config/db');

const advancedDatabaseCards = [
  {"front": "What is a query?", "back": "A request for data or information from a database table."},
  {"front": "What are the four main phases of Query Processing?", "back": "Decomposition, Optimization, Code generation, and Execution."},
  {"front": "What is the main role of the Parser and Translator in query processing?", "back": "To check correct query syntax and schema elements."},
  {"front": "What is Query Decomposition?", "back": "The process of transforming a high-level query into a relational algebra query."},
  {"front": "What is the purpose of the Optimizer in query processing?", "back": "To find the best execution plan with the least cost."},
  {"front": "What is a Query Tree?", "back": "A graphical representation of operators, relations, attributes, and predicates in a query."},
  {"front": "What does 'Normalization' of a query do?", "back": "Converts the WHERE predicate into Conjunctive or Disjunctive Normal Form."},
  {"front": "What is a transaction?", "back": "A logical unit of work on the database."},
  {"front": "What does the 'A' in the ACID property stand for?", "back": "Atomicity."},
  {"front": "What does the 'C' in the ACID property stand for?", "back": "Consistency."},
  {"front": "What does the 'I' in the ACID property stand for?", "back": "Isolation."},
  {"front": "What does the 'D' in the ACID property stand for?", "back": "Durability."},
  {"front": "What property ensures a transaction is treated as a single, indivisible unit?", "back": "Atomicity."},
  {"front": "What property ensures a transaction brings the database from one consistent state to another?", "back": "Consistency."},
  {"front": "What property ensures a transaction executes without interference from other concurrent transactions?", "back": "Isolation."},
  {"front": "What property ensures the effects of a completed transaction persist in the database?", "back": "Durability."},
  {"front": "What is a Dirty Read?", "back": "Reading uncommitted data from another transaction."},
  {"front": "What is a Nonrepeatable Read?", "back": "Reading a value that is later changed and re-read, yielding a different result."},
  {"front": "What is a Phantom Read?", "back": "A new row appearing that satisfies a previously run query's condition."},
  {"front": "What are the two ways a transaction can end?", "back": "Commit (success) or Rollback/Abort (failure)."},
  {"front": "What is a serial schedule of transactions?", "back": "A schedule where transactions are executed one after another without interleaving."},
  {"front": "What is a non-serial schedule of transactions?", "back": "A schedule where operations from concurrent transactions are interleaved."},
  {"front": "What is a serializable schedule?", "back": "A schedule that yields the same result as some serial schedule."},
  {"front": "What tool is used to test for conflict serializability?", "back": "A precedence graph."},
  {"front": "What does a cycle in a precedence graph indicate?", "back": "The schedule is non-serializable."},
  {"front": "What is the main purpose of Concurrency Control?", "back": "To manage simultaneous operations without interference."},
  {"front": "What are the three basic concurrency control techniques?", "back": "Locking, Time stamping, and Optimistic."},
  {"front": "What type of lock allows multiple transactions to read data simultaneously?", "back": "Shared lock."},
  {"front": "What type of lock grants exclusive access to a data item for reading and writing?", "back": "Exclusive lock."},
  {"front": "What is the Two-Phase Locking (2PL) protocol?", "back": "A protocol where all locks precede the first unlock."},
  {"front": "What are the two phases of the 2PL protocol?", "back": "Growing phase (locking) and Shrinking phase (unlocking)."},
  {"front": "What is a deadlock in transaction processing?", "back": "A state where two or more transactions are waiting for locks held by each other."},
  {"front": "What are two general techniques for handling deadlocks?", "back": "Deadlock prevention and Deadlock detection and recovery."},
  {"front": "What is a timestamp in concurrency control?", "back": "A unique identifier indicating a transaction's relative starting time."},
  {"front": "In timestamp ordering, when is a transaction rolled back?", "back": "When it attempts to read a value that has been overwritten or writes a value that has been read by a newer transaction."},
  {"front": "What is the main assumption of the Optimistic concurrency control technique?", "back": "That conflicts between transactions are rare."},
  {"front": "What are the three phases of the Optimistic technique?", "back": "Read phase, Validation phase, and Write phase."},
  {"front": "What is Granularity in concurrency control?", "back": "The size of the data items chosen as the unit of protection."},
  {"front": "What is a Write-Ahead Logging (WAL) protocol?", "back": "Ensures log records are written to stable storage before the database update."},
  {"front": "What is a Database Log?", "back": "A file containing a history of all actions executed by the DBMS for recovery purposes."},
  {"front": "What is a Checkpoint in a database system?", "back": "A point of synchronization between the database and the log file."},
  {"front": "What is the Deferred Update recovery technique?", "back": "Updates are not written to the database until after the transaction commits."},
  {"front": "What is the Immediate Update recovery technique?", "back": "Updates are applied to the database as they occur."},
  {"front": "What is the main purpose of a database backup?", "back": "To provide a copy of the database to restore in case of catastrophic failure."},
  {"front": "What is Database Security?", "back": "Protection of information against unauthorized access, modification, or destruction."},
  {"front": "What is Database Integrity?", "back": "Mechanisms to ensure data in the database is correct and consistent."},
  {"front": "What is Authorization in database security?", "back": "Granting a right or privilege to access a system or object."},
  {"front": "What is a View used for in security?", "back": "To hide parts of the database from certain users."},
  {"front": "What is Encryption?", "back": "Encoding data by a special algorithm to render it unreadable without the decryption key."},
  {"front": "What is Authentication?", "back": "The process of checking whether a user is who they claim to be."},
  {"front": "What is a Discretionary Access Control (DAC) mechanism?", "back": "Granting different privileges to different users on various data objects."},
  {"front": "What is a Mandatory Access Control (MAC) mechanism?", "back": "Enforcing multilevel security by classifying data and users into security classes."},
  {"front": "What is an Object in OODBMS?", "back": "A uniquely identifiable entity that contains attributes and methods."},
  {"front": "What is Encapsulation?", "back": "The bundling of data structure and operations to manipulate it within an object."},
  {"front": "What is Information Hiding?", "back": "Separating external aspects of an object from its internal implementation details."},
  {"front": "What is an Object Identifier (OID)?", "back": "A system-generated, unique, and invariant identifier for an object."},
  {"front": "What is a Method in an OODBMS?", "back": "Defines the behavior of an object as a set of encapsulated functions."},
  {"front": "What is a Class in an OODBMS?", "back": "A blueprint for defining a set of similar objects (instances)."},
  {"front": "What is Inheritance in OODBMS?", "back": "Allowing a class (subclass) to be defined as a special case of a more general class (superclass)."},
  {"front": "What is an AKO relationship?", "back": "A Kind Of relationship between a subclass and its superclass."},
  {"front": "What is Polymorphism in OODBMS?", "back": "The ability of a method to take many forms."},
  {"front": "What is a complex object in OODBMS?", "back": "An object that contains one or more complex attributes or collections of other objects."},
  {"front": "What is an Advanced Database Application for OODBMS?", "back": "Computer-Aided Design/Manufacturing (CAD/CAM)."},
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
  {"front": "What is the role of System Catalogs/Statistics in Optimization?", "back": "To provide information for estimating query execution costs."},
  {"front": "What is the meaning of 'Select Before Join' as a heuristic?", "back": "It's a rule of thumb to perform selection first to reduce relation size before an expensive join."},
  {"front": "What is a Rule-based (Heuristic) Optimizer?", "back": "An optimizer that uses transformation rules to rewrite a query."},
  {"front": "What is a Cost-based Optimizer?", "back": "An optimizer that estimates the cost of different execution plans and chooses the cheapest one."},
  {"front": "What is a Lost Update problem?", "back": "An update by one transaction is overwritten by another."},
  {"front": "What is an Uncommitted Dependency problem?", "back": "A transaction reads data written by another uncommitted transaction."},
  {"front": "What does the term 'Rollback' mean?", "back": "To undo the operations of a transaction that has not yet committed."},
  {"front": "What does the term 'Commit' mean?", "back": "To make all updates of a transaction permanent in the database."},
  {"front": "What is a Wait-For Graph?", "back": "A graph used to detect deadlocks by showing which transactions are waiting for locks held by others."},
  {"front": "What is the Wait-Die deadlock prevention scheme?", "back": "An older transaction waits, but a younger transaction dies (aborts) if it requests a locked item."},
  {"front": "What is the Wound-Wait deadlock prevention scheme?", "back": "An older transaction wounds (aborts) a younger one, while a younger transaction waits."},
  {"front": "What is a log record's Before-Image (BFIM)?", "back": "The old value of a data item before an update."},
  {"front": "What is a log record's After-Image (AFIM)?", "back": "The new value of a data item after an update."},
  {"front": "What is a Transaction Table used for in recovery?", "back": "To track the state of active transactions during recovery."},
  {"front": "What is a Dirty Page Table used for in recovery?", "back": "To track which pages have been modified in the buffer and need to be written back."},
  {"front": "What is the 'Steal' policy in a recovery algorithm?", "back": "Allows a buffer page to be written to disk before the transaction that modified it commits."},
  {"front": "What is the 'No-Force' policy in a recovery algorithm?", "back": "Does not require all modified pages to be written to disk at commit time."},
  {"front": "What is the significance of 'LSN' (Log Sequence Number)?", "back": "A unique identifier for every log record, used to ensure order and for recovery."},
  {"front": "What is the second phase of the Two-Phase Commit (2PC) protocol?", "back": "The commit phase, where a signal is issued to commit or rollback based on first-phase votes."},
  {"front": "What is a distributed transaction?", "back": "A transaction that updates data on two or more distinct nodes of a distributed database."},
  {"front": "What is a remote transaction?", "back": "A transaction that contains only statements that access a single remote node."},
  {"front": "What is Centralized 2PL in a DDBMS?", "back": "A single site is responsible for granting and releasing locks for all transactions."},
  {"front": "What is Primary 2PL in a DDBMS?", "back": "A lock manager on a primary copy site is responsible for granting and releasing locks."},
  {"front": "What is the main advantage of data replication?", "back": "Improved availability and increased parallelism for read-only queries."},
  {"front": "What is the main disadvantage of data replication?", "back": "Increased overhead for updates and a higher risk of inconsistency."},
  {"front": "What is a 'cryptosystem'?", "back": "A system including an encryption key, a decryption key, and algorithms for encrypting and decrypting data."},
  {"front": "What is a major advantage of using views for security?", "back": "They can restrict users to a subset of the data in base relations, providing a more granular control."}
];

async function seedAdvancedDatabaseDeck() {
  try {
    console.log('🚀 Seeding Advanced Database Systems flashcard deck...');

    // Find course ID for Advanced Database Systems (or code ADS308)
    const courseRes = await pool.query(
      "SELECT id, title, code FROM courses WHERE code = 'ADS308' OR title ILIKE '%Advanced Database%' LIMIT 1"
    );

    let courseId = 11;
    if (courseRes.rows.length > 0) {
      courseId = courseRes.rows[0].id;
      console.log(`✅ Found course: [${courseRes.rows[0].code}] ${courseRes.rows[0].title} (ID: ${courseId})`);
    }

    const deckTitle = 'ADS308: Advanced Database Systems - Complete Flashcards (100 Questions)';

    // Check if deck exists
    const existingDeck = await pool.query(
      "SELECT id FROM flashcard_decks WHERE course_id = $1 OR title ILIKE '%Advanced Database%'",
      [courseId]
    );

    let deckId;
    if (existingDeck.rows.length > 0) {
      deckId = existingDeck.rows[0].id;
      console.log(`🔄 Existing deck found with ID ${deckId}. Updating properties...`);
      await pool.query(
        "UPDATE flashcard_decks SET title = $1, is_public = TRUE, course_id = $2 WHERE id = $3",
        [deckTitle, courseId, deckId]
      );
      // Clear old cards to re-insert freshly
      await pool.query("DELETE FROM flashcards WHERE deck_id = $1", [deckId]);
    } else {
      const newDeck = await pool.query(
        "INSERT INTO flashcard_decks (user_id, course_id, title, is_public) VALUES (NULL, $1, $2, TRUE) RETURNING id",
        [courseId, deckTitle]
      );
      deckId = newDeck.rows[0].id;
      console.log(`✨ Created new public deck with ID ${deckId}`);
    }

    // Bulk insert in chunks of 25 for fast network transmission
    const chunkSize = 25;
    let totalInserted = 0;

    for (let i = 0; i < advancedDatabaseCards.length; i += chunkSize) {
      const chunk = advancedDatabaseCards.slice(i, i + chunkSize);
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
      console.log(`  Inserted batch: ${totalInserted} / ${advancedDatabaseCards.length} cards`);
    }

    console.log(`🎉 Successfully seeded ${totalInserted} flashcards for [${deckTitle}] (Deck ID: ${deckId})!`);
  } catch (error) {
    console.error('❌ Error seeding flashcards:', error);
  } finally {
    process.exit(0);
  }
}

seedAdvancedDatabaseDeck();
