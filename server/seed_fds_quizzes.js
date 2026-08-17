require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./src/config/db');

const inputData = [
  // ── DBMS Model Exam (15 questions) ──
  {
    "id": 1,
    "question": "Which of the following is generally used for performing tasks like creating the structure of the relations, deleting relation?",
    "options": [
      "DML(Data Manipulation Language)",
      "Query",
      "Relational Schema",
      "DDL(Data Definition Language)"
    ],
    "correctAnswer": 3,
    "explanation": "DDL (Data Definition Language) is used for defining database structures including creating, altering, and deleting relations."
  },
  {
    "id": 2,
    "question": "Which one of the following given statements possibly contains the error?",
    "options": [
      "select * from emp where empid = 10003;",
      "select empid from emp where empid = 10006;",
      "select empid from emp;",
      "select empid where empid = 1009 and Lastname = 'ADDIS';"
    ],
    "correctAnswer": 3,
    "explanation": "The last statement is missing the FROM clause. Correct syntax: SELECT empid FROM emp WHERE empid = 1009 AND Lastname = 'ADDIS';"
  },
  {
    "id": 3,
    "question": "Which one of the following refers to the 'data about data'?",
    "options": [
      "Directory",
      "Sub Data",
      "Warehouse",
      "Meta Data"
    ],
    "correctAnswer": 3,
    "explanation": "Metadata is data about data, providing information about the structure, content, and context of data in the database."
  },
  {
    "id": 4,
    "question": "Which of the following refers to the level of data abstraction that describes exactly how the data actually stored?",
    "options": [
      "Conceptual Level",
      "Physical Level",
      "File Level",
      "Logical Level"
    ],
    "correctAnswer": 1,
    "explanation": "The Physical Level describes how data is actually stored on storage devices, including file organization and indexing."
  },
  {
    "id": 5,
    "question": "Which one of the following is a type of Data Manipulation Command?",
    "options": [
      "Create",
      "Alter",
      "Delete",
      "All of the above"
    ],
    "correctAnswer": 2,
    "explanation": "DELETE is a DML command used to remove data from tables. CREATE and ALTER are DDL commands."
  },
  {
    "id": 6,
    "question": "Which of the following is used in the application programs to request data from the database management system?",
    "options": [
      "Data Manipulation language",
      "Data Definition Language",
      "Data Control Language",
      "All of the above"
    ],
    "correctAnswer": 0,
    "explanation": "DML (Data Manipulation Language) is used to request and manipulate data in the database from application programs."
  },
  {
    "id": 7,
    "question": "Which of the following commands is used to save any transaction permanently into the database?",
    "options": [
      "Commit",
      "Rollback",
      "Savepoint",
      "None of the above"
    ],
    "correctAnswer": 0,
    "explanation": "COMMIT saves all changes made in the current transaction permanently to the database."
  },
  {
    "id": 8,
    "question": "Which one of the following refers to the total view of the database content?",
    "options": [
      "Conceptual view",
      "Physical view",
      "Internal view",
      "External view"
    ],
    "correctAnswer": 0,
    "explanation": "Conceptual view provides a complete picture of the entire database, representing all entities, relationships, and constraints."
  },
  {
    "id": 9,
    "question": "Which of the following keys is generally used to represents the relationships between the tables?",
    "options": [
      "Primary key",
      "Foreign key",
      "Secondary key",
      "None of the above"
    ],
    "correctAnswer": 1,
    "explanation": "Foreign keys establish and enforce relationships between tables by referencing the primary key of another table."
  },
  {
    "id": 10,
    "question": "The minimal set of super key is called",
    "options": [
      "Candidate key",
      "Foreign key",
      "Primary key",
      "None of the above"
    ],
    "correctAnswer": 2,
    "explanation": "A primary key is the minimal super key that uniquely identifies each row in a table. Candidate keys are all possible minimal super keys."
  },
  {
    "id": 11,
    "question": "Which of the following in true regarding Referential Integrity?",
    "options": [
      "Every primary-key value must match a primary-key value in an associated table",
      "Every primary-key value must match a foreign-key value in an associated table",
      "Every foreign-key value must match a primary-key value in an associated table",
      "Every foreign-key value must match a foreign-key value in an associated table"
    ],
    "correctAnswer": 2,
    "explanation": "Referential Integrity ensures that every foreign key value in a table matches a primary key value in the referenced table."
  },
  {
    "id": 12,
    "question": "What are ACID properties of Transactions?",
    "options": [
      "Atomicity, Consistency, Isolation, Database",
      "Atomicity, Consistency, Isolation, Durability",
      "Atomicity, Consistency, Inconsistent, Durability",
      "Automatically, Concurrency, Isolation, Durability"
    ],
    "correctAnswer": 1,
    "explanation": "ACID properties are Atomicity, Consistency, Isolation, and Durability - ensuring reliable transaction processing in databases."
  },
  {
    "id": 13,
    "question": "A relation that has no partial dependencies is in which normal form",
    "options": [
      "First",
      "Second",
      "Third",
      "BCNF"
    ],
    "correctAnswer": 1,
    "explanation": "A relation in 2NF has no partial dependencies (no non-prime attribute is dependent on part of a candidate key)."
  },
  {
    "id": 14,
    "question": "The object definition language (ODL) is which of the following?",
    "options": [
      "Used to develop logical schemas",
      "A data definition language for OODB",
      "A method to implement a logical schema",
      "All of the above."
    ],
    "correctAnswer": 3,
    "explanation": "ODL is a data definition language for Object-Oriented Databases used to develop logical schemas and implement them."
  },
  {
    "id": 15,
    "question": "In object-oriented database, the keyword 'inverse' is used in which of the following?",
    "options": [
      "Class",
      "Attribute",
      "Relationship",
      "All of the above"
    ],
    "correctAnswer": 2,
    "explanation": "The 'inverse' keyword is used in relationship specifications in ODL to specify the inverse relationship between two classes."
  },

  // ── Database (C.S Unit 4 and 5) (32 questions) ──
  {
    "id": 16,
    "question": "____ a very important phase in designing a successful database application.",
    "options": [
      "Data model",
      "Conceptual modeling",
      "Database",
      "DBMS"
    ],
    "correctAnswer": 1,
    "explanation": "Conceptual modeling is crucial for creating a high-level representation of database requirements independent of implementation details."
  },
  {
    "id": 17,
    "question": "____ refers to a particular database and associated programs that implement the database queries and updates.",
    "options": [
      "Database model",
      "Entity",
      "Database application",
      "All"
    ],
    "correctAnswer": 2,
    "explanation": "Database application includes the database and programs designed to interact with it, handling queries and updates."
  },
  {
    "id": 18,
    "question": "____ a popular high-level conceptual data model frequently used for the conceptual design of database applications.",
    "options": [
      "ER model",
      "Diagram model",
      "Schema",
      "None"
    ],
    "correctAnswer": 0,
    "explanation": "ER (Entity-Relationship) model is widely used for conceptual database design, representing entities, attributes, and relationships."
  },
  {
    "id": 19,
    "question": "The most widely implemented language for relational databases.",
    "options": [
      "SQL",
      "Structured language",
      "DB",
      "MySQL"
    ],
    "correctAnswer": 0,
    "explanation": "SQL (Structured Query Language) is the standard and most widely implemented language for relational database management."
  },
  {
    "id": 20,
    "question": "____ set of data whose values make up an instance of each attribute defined for that relation.",
    "options": [
      "Relation",
      "Row",
      "Tuple",
      "B and C"
    ],
    "correctAnswer": 3,
    "explanation": "A tuple (row) is a set of data values that forms an instance of attributes defined in a relation (table)."
  },
  {
    "id": 21,
    "question": "____ uses the terms table, column, and row to describe these items.",
    "options": [
      "Database",
      "Tuple",
      "Column",
      "SQL"
    ],
    "correctAnswer": 0,
    "explanation": "Relational databases use the terms table, column, and row to describe the structure of data storage."
  },
  {
    "id": 22,
    "question": "The standard language for Relation Database System.",
    "options": [
      "Data",
      "SQL",
      "ROW",
      "All"
    ],
    "correctAnswer": 1,
    "explanation": "SQL (Structured Query Language) is the standard language for relational database systems."
  },
  {
    "id": 23,
    "question": "The data in RDBMS is stored in database objects called ____.",
    "options": [
      "Relation",
      "Table",
      "Data model",
      "All"
    ],
    "correctAnswer": 1,
    "explanation": "In RDBMS, data is stored in tables (also called relations) which organize data into rows and columns."
  },
  {
    "id": 24,
    "question": "Which one of the following horizontal entity in table and vertical entity in table?",
    "options": [
      "Row and Record",
      "Column and Row",
      "Row and Column",
      "All"
    ],
    "correctAnswer": 2,
    "explanation": "In tables, horizontal entities are rows (records) and vertical entities are columns (attributes)."
  },
  {
    "id": 25,
    "question": "____ are the rules enforced on data columns on table.",
    "options": [
      "SQL",
      "SQL constraints",
      "Data model",
      "Table"
    ],
    "correctAnswer": 1,
    "explanation": "SQL constraints are rules enforced on data columns in tables to ensure data integrity and validity."
  },
  {
    "id": 26,
    "question": "Which one uniquely identify each rows/records in a database table?",
    "options": [
      "Candidate key",
      "Composite key",
      "Primary key",
      "Foreign key"
    ],
    "correctAnswer": 2,
    "explanation": "Primary key uniquely identifies each row/record in a database table, ensuring no duplicate rows."
  },
  {
    "id": 27,
    "question": "The ____ enforces no duplication rows in a table.",
    "options": [
      "Data integrity",
      "Domain integrity",
      "Entity integrity",
      "All"
    ],
    "correctAnswer": 2,
    "explanation": "Entity integrity ensures each table has a unique primary key and no duplicate rows exist in the table."
  },
  {
    "id": 28,
    "question": "____ enforces valid entries for a given column by restricting the type, the format, or the range of values.",
    "options": [
      "Data integrity",
      "Domain integrity",
      "Entity integrity",
      "Primary key"
    ],
    "correctAnswer": 1,
    "explanation": "Domain integrity ensures that data entered in a column meets specified constraints regarding type, format, and range."
  },
  {
    "id": 29,
    "question": "SQL is followed by unique set of rules and guidelines called ____.",
    "options": [
      "SQL",
      "Syntax",
      "SQL constraints",
      "None"
    ],
    "correctAnswer": 1,
    "explanation": "SQL syntax provides the specific rules and guidelines that must be followed when writing SQL statements."
  },
  {
    "id": 30,
    "question": "____ provides commands for defining databases and relation schemas, deleting relations and modifying relation schemas.",
    "options": [
      "DML",
      "DDL",
      "DCL",
      "DRL"
    ],
    "correctAnswer": 1,
    "explanation": "DDL (Data Definition Language) provides commands like CREATE, ALTER, and DROP for defining and modifying database schemas."
  },
  {
    "id": 31,
    "question": "____ used to delete existing database, table or constraints.",
    "options": [
      "Alter",
      "Drop",
      "Delete",
      "All"
    ],
    "correctAnswer": 1,
    "explanation": "DROP command is used to delete existing database objects like tables, databases, or constraints permanently."
  },
  {
    "id": 32,
    "question": "____ used to modify the definition of the existing relation schema.",
    "options": [
      "Delete",
      "Drop",
      "Alter",
      "Update"
    ],
    "correctAnswer": 2,
    "explanation": "ALTER command modifies the structure of existing tables by adding, deleting, or modifying columns and constraints."
  },
  {
    "id": 33,
    "question": "____ includes a query language based on both the relational algebra and the tuple relational calculus.",
    "options": [
      "DML",
      "DDL",
      "DUL",
      "All"
    ],
    "correctAnswer": 0,
    "explanation": "DML (Data Manipulation Language) includes query language based on relational algebra and relational calculus for data operations."
  },
  {
    "id": 34,
    "question": "SQL DML includes three clauses that can be used for updating the content of relations.",
    "options": [
      "DML",
      "DUL",
      "DDL",
      "DRL"
    ],
    "correctAnswer": 0,
    "explanation": "SQL DML includes INSERT, UPDATE, and DELETE clauses for modifying the content of database relations."
  },
  {
    "id": 35,
    "question": "____ it is a SQL clause used to add a number of tuples into a specified relation.",
    "options": [
      "Insertion",
      "Deletion",
      "Select",
      "Modify"
    ],
    "correctAnswer": 0,
    "explanation": "INSERT statement adds new tuples (rows) into a specified relation/table in the database."
  },
  {
    "id": 36,
    "question": "____ it is a clause used to delete specified tuples from a relation that meets specified criteria.",
    "options": [
      "Insertion",
      "Deletion",
      "Select",
      "Modify"
    ],
    "correctAnswer": 1,
    "explanation": "DELETE statement removes specified tuples from a relation that meet the criteria specified in the WHERE clause."
  },
  {
    "id": 37,
    "question": "____ an important feature in SQL Server.",
    "options": [
      "Data type",
      "Domain integrity",
      "Primary key",
      "All"
    ],
    "correctAnswer": 0,
    "explanation": "Data types are fundamental in SQL Server, defining the kind of data that can be stored in columns, including constraints and rules."
  },
  {
    "id": 38,
    "question": "Which of the following one table points to a primary key in another table?",
    "options": [
      "Candidate key",
      "Primary key",
      "Foreign key",
      "Composite key"
    ],
    "correctAnswer": 2,
    "explanation": "Foreign key in one table references (points to) the primary key of another table, establishing relationships between tables."
  },
  {
    "id": 39,
    "question": "____ describes data as entities, relationships, and attributes.",
    "options": [
      "ER diagram",
      "ER-model",
      "Data model schema",
      "All"
    ],
    "correctAnswer": 3,
    "explanation": "All these concepts describe data using entities (objects), relationships (associations), and attributes (properties)."
  },
  {
    "id": 40,
    "question": "____ is an object with a physical existence and conceptual existence.",
    "options": [
      "Entity type",
      "An entity",
      "Attribute",
      "Relation"
    ],
    "correctAnswer": 1,
    "explanation": "An entity is a real-world object with physical existence (like a person) or conceptual existence (like a department)."
  },
  {
    "id": 41,
    "question": "____ will have a value for each of its attributes.",
    "options": [
      "Data type",
      "Particular entity",
      "Each entity",
      "All"
    ],
    "correctAnswer": 2,
    "explanation": "Each entity instance must have a value for each of its attributes as defined by the entity type."
  },
  {
    "id": 42,
    "question": "An attribute that resulted when composite and multivalued attributes are arbitrarily nested.",
    "options": [
      "Derived attribute",
      "Complex attribute",
      "Single attribute",
      "Composite attribute"
    ],
    "correctAnswer": 1,
    "explanation": "Complex attributes result from nesting composite and multivalued attributes to represent complex data structures."
  },
  {
    "id": 43,
    "question": "____ are attributes/constraints on the entities of an entity type.",
    "options": [
      "Entity",
      "Attribute",
      "Key",
      "Relation"
    ],
    "correctAnswer": 2,
    "explanation": "Keys are attributes used to uniquely identify entities, serving as constraints on entity instances."
  },
  {
    "id": 44,
    "question": "____ describes participation of an entity type in a relationship type.",
    "options": [
      "Role",
      "Key",
      "Entity",
      "All"
    ],
    "correctAnswer": 0,
    "explanation": "Role describes how an entity type participates in a relationship, specifying the part played by the entity."
  },
  {
    "id": 45,
    "question": "____ is an association among the instances of one or more entity types.",
    "options": [
      "Entity",
      "Attribute",
      "Relationship",
      "Key"
    ],
    "correctAnswer": 2,
    "explanation": "A relationship is an association between instances of entity types, representing how entities are connected."
  },
  {
    "id": 46,
    "question": "Which one of the following is best match",
    "options": [
      "Record and Row",
      "Column and Field",
      "Row and Tuple",
      "A and B",
      "All"
    ],
    "correctAnswer": 4,
    "explanation": "All terms are correct matches: Row=Record=Tuple (horizontal), Column=Field (vertical) in database tables."
  },
  {
    "id": 47,
    "question": "____ allows us to check the value stored in the column or table in the form of range.",
    "options": [
      "Key constraint",
      "Check constraint",
      "Foreign key",
      "All"
    ],
    "correctAnswer": 1,
    "explanation": "CHECK constraint ensures that values in a column meet specified conditions or fall within a given range."
  }
];

async function seedFDSQuizzes() {
  const client = await pool.connect();
  try {
    console.log('--- Seeding Fundamentals of Database Systems Quizzes ---');
    await client.query('BEGIN');

    // Find or create course
    let courseRes = await client.query("SELECT id, title, code FROM courses WHERE code = 'FDS307' OR title ILIKE '%Fundamentals of Database%'");
    let courseId;
    let courseTitle;

    if (courseRes.rows.length === 0) {
      const ins = await client.query(`
        INSERT INTO courses (title, code, description)
        VALUES ('Fundamentals of Database Systems', 'FDS307', 'Core fundamentals of database design, relational modeling, SQL, and database transactions.')
        RETURNING id, title, code
      `);
      courseId = ins.rows[0].id;
      courseTitle = ins.rows[0].title;
      console.log(`Created course: ${courseTitle} (ID: ${courseId})`);
    } else {
      courseId = courseRes.rows[0].id;
      courseTitle = courseRes.rows[0].title;
      console.log(`Found existing course: ${courseTitle} (ID: ${courseId})`);
    }

    // Delete any previous practice quizzes for this course
    await client.query(`
      DELETE FROM quizzes
      WHERE course_id = $1
      AND COALESCE(quiz_type, 'quiz') = 'quiz'
      AND is_official = TRUE
      AND title LIKE $2
    `, [courseId, `${courseTitle} - Quiz %`]);

    const CHUNK_SIZE = 15;
    const totalQuizzes = Math.ceil(inputData.length / CHUNK_SIZE);
    let totalQuestionsInserted = 0;
    let totalOptionsInserted = 0;

    for (let i = 0; i < totalQuizzes; i++) {
      const startIdx = i * CHUNK_SIZE;
      const endIdx = Math.min((i + 1) * CHUNK_SIZE, inputData.length);
      const chunkQuestions = inputData.slice(startIdx, endIdx);
      const quizNumber = i + 1;
      const quizTitle = `${courseTitle} - Quiz ${quizNumber}`;
      const quizDesc = `Practice Quiz ${quizNumber} (${chunkQuestions.length} Questions)`;

      const quizRes = await client.query(`
        INSERT INTO quizzes (course_id, title, description, is_official, quiz_type, difficulty, created_at)
        VALUES ($1, $2, $3, TRUE, 'quiz', 'Medium', CURRENT_TIMESTAMP)
        RETURNING id
      `, [courseId, quizTitle, quizDesc]);
      const quizId = quizRes.rows[0].id;

      for (let qIdx = 0; qIdx < chunkQuestions.length; qIdx++) {
        const qData = chunkQuestions[qIdx];
        const questRes = await client.query(`
          INSERT INTO questions (quiz_id, question_text, explanation, question_type)
          VALUES ($1, $2, $3, 'single_choice')
          RETURNING id
        `, [quizId, qData.question, qData.explanation || null]);
        const questionId = questRes.rows[0].id;
        totalQuestionsInserted++;

        for (let optIdx = 0; optIdx < qData.options.length; optIdx++) {
          const optText = qData.options[optIdx];
          const isCorrect = optIdx === qData.correctAnswer;
          await client.query(`
            INSERT INTO options (question_id, option_text, is_correct)
            VALUES ($1, $2, $3)
          `, [questionId, optText, isCorrect]);
          totalOptionsInserted++;
        }
      }

      console.log(`  Created ${quizTitle} with ${chunkQuestions.length} questions.`);
    }

    await client.query('COMMIT');
    console.log(`\n🎉 Successfully inserted ${totalQuizzes} quizzes, ${totalQuestionsInserted} questions, and ${totalOptionsInserted} options for ${courseTitle}!`);

    // Also update quiz.json
    const quizJsonPath = path.join(__dirname, '..', 'course-material', 'quiz.json');
    if (fs.existsSync(quizJsonPath)) {
      const raw = fs.readFileSync(quizJsonPath, 'utf-8');
      const parsed = JSON.parse(raw);
      const list = parsed['quiz-exam'] || [];
      
      const existingIdx = list.findIndex(c => c.course && c.course.toLowerCase().includes('database') && !c.course.toLowerCase().includes('advanced'));
      const formattedEntry = {
        course: "Fundamentals of Database Systems",
        questions: inputData.map((q, idx) => ({
          id: idx + 1,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation
        }))
      };

      if (existingIdx >= 0) {
        list[existingIdx] = formattedEntry;
      } else {
        list.push(formattedEntry);
      }
      parsed['quiz-exam'] = list;
      fs.writeFileSync(quizJsonPath, JSON.stringify(parsed, null, 4), 'utf-8');
      console.log(`✅ Updated course-material/quiz.json with Fundamentals of Database Systems!`);
    }

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding FDS quizzes:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seedFDSQuizzes();
