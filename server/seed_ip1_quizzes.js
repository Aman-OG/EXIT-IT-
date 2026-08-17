require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./src/config/db');

const questionsData = [
  {
    "id": 1,
    "question": "What was the first operational packet-switching network that laid the foundation for the Internet?",
    "options": [
      "NSFNET",
      "ARPANET",
      "CSNET",
      "BITNET"
    ],
    "correctAnswer": 1,
    "explanation": "ARPANET (Advanced Research Projects Agency Network) was the first operational packet-switching network, launched in 1969, which later evolved into the modern Internet."
  },
  {
    "id": 2,
    "question": "Which protocol was invented by Vint Cerf and Bob Kahn that became the foundation for data transmission on the Internet?",
    "options": [
      "HTTP",
      "FTP",
      "TCP/IP",
      "SMTP"
    ],
    "correctAnswer": 2,
    "explanation": "Vint Cerf and Bob Kahn invented the TCP/IP protocol in 1974, which became the standard for data transmission on the Internet and established basic Internet communication standards."
  },
  {
    "id": 3,
    "question": "Who is credited with inventing the World Wide Web?",
    "options": [
      "Vint Cerf",
      "Bob Kahn",
      "Tim Berners-Lee",
      "Ray Tomlinson"
    ],
    "correctAnswer": 2,
    "explanation": "Tim Berners-Lee invented the World Wide Web in 1989-1990 while working at CERN, creating HTTP, HTML, and the first web browser."
  },
  {
    "id": 4,
    "question": "Which of the following is NOT a service provided by the Internet?",
    "options": [
      "Electronic Mail",
      "Telnet",
      "Internet Relay Chat (IRC)",
      "File System Management"
    ],
    "correctAnswer": 3,
    "explanation": "File System Management is an operating system function, not an Internet service. Electronic Mail, Telnet, and IRC are all Internet communication services."
  },
  {
    "id": 5,
    "question": "What does HTTP stand for?",
    "options": [
      "Hyper Text Transfer Protocol",
      "High Tech Transfer Protocol",
      "Hyperlink Text Transfer Protocol",
      "High Transfer Text Protocol"
    ],
    "correctAnswer": 0,
    "explanation": "HTTP stands for Hyper Text Transfer Protocol, which is the foundation of data communication for the World Wide Web."
  },
  {
    "id": 6,
    "question": "Which of the following is NOT a client-side technology?",
    "options": [
      "HTML",
      "CSS",
      "JavaScript",
      "PHP"
    ],
    "correctAnswer": 3,
    "explanation": "PHP is a server-side scripting language, not a client-side technology. HTML, CSS, and JavaScript all run on the client side (browser)."
  },
  {
    "id": 7,
    "question": "Which of the following best describes server-side scripting?",
    "options": [
      "Code that runs on the user's browser",
      "Code that executes on the web server",
      "Code that manages the database only",
      "Code that handles user interface design"
    ],
    "correctAnswer": 1,
    "explanation": "Server-side scripting refers to code that executes on the web server, handling data processing, database access, and generating dynamic content before sending it to the client."
  },
  {
    "id": 8,
    "question": "Which of the following is an advantage of scripting languages over traditional programming languages?",
    "options": [
      "They require compilation before execution",
      "They are less efficient for web development",
      "They are easier and quicker to learn",
      "They require more complex data structures"
    ],
    "correctAnswer": 2,
    "explanation": "Scripting languages are generally easier and quicker to learn than traditional compiled languages, with simpler syntax and less code-intensive requirements."
  },
  {
    "id": 9,
    "question": "Which of the following is true about just-in-time (JIT) compilation?",
    "options": [
      "It compiles the entire program before execution",
      "It is a method for improving performance of interpreted programs",
      "It only works with compiled languages",
      "It requires explicit compilation step"
    ],
    "correctAnswer": 1,
    "explanation": "Just-in-time compilation is a method for improving the performance of interpreted programs by compiling code into native code during execution, reducing the performance gap between interpreted and compiled languages."
  },
  {
    "id": 10,
    "question": "Which of the following is a characteristic of client-side scripting?",
    "options": [
      "It is more secure than server-side scripting",
      "It provides complete access to server files",
      "It runs on the user's computer",
      "It is processed and interacts with the server"
    ],
    "correctAnswer": 2,
    "explanation": "Client-side scripting runs on the user's computer (browser) and does not require server interaction for execution, unlike server-side scripting which runs on the web server."
  },
  {
    "id": 11,
    "question": "What is the primary function of server-side scripting?",
    "options": [
      "To create attractive user interfaces",
      "To manipulate and provide access to databases",
      "To reduce server load",
      "To validate form data on the client side"
    ],
    "correctAnswer": 1,
    "explanation": "Server-side scripting's primary function is to manipulate and provide access to databases, handle data processing, and generate dynamic content based on user requests."
  },
  {
    "id": 12,
    "question": "In the client-server model, what is a server?",
    "options": [
      "A device that requests services or resources",
      "A powerful machine providing resources or services",
      "A user's personal computer",
      "A network router"
    ],
    "correctAnswer": 1,
    "explanation": "In the client-server model, a server is a powerful machine that provides resources, services, or data to client devices that request them."
  },
  {
    "id": 13,
    "question": "What is the purpose of the <div> tag in HTML?",
    "options": [
      "To define a single line of text",
      "To create a generic block-level container",
      "To define hyperlinks",
      "To display images"
    ],
    "correctAnswer": 1,
    "explanation": "The <div> tag is a generic block-level container used to group large sections of HTML elements together for styling and layout purposes."
  },
  {
    "id": 14,
    "question": "Which of the following is a semantic HTML element?",
    "options": [
      "<div>",
      "<span>",
      "<header>",
      "<b>"
    ],
    "correctAnswer": 2,
    "explanation": "<header> is a semantic element that describes the content or function of the element (the header section of a page). <div> and <span> are generic elements, and <b> is a presentational element."
  },
  {
    "id": 15,
    "question": "What is the difference between the 'id' and 'class' attributes in HTML?",
    "options": [
      "Both must be unique in the document",
      "id must be unique, class can be used multiple times",
      "class must be unique, id can be used multiple times",
      "Both can be used multiple times"
    ],
    "correctAnswer": 1,
    "explanation": "The id attribute must be unique within the document and identifies a single element, while the class attribute can be used multiple times to group similar elements."
  },
  {
    "id": 16,
    "question": "What is the correct syntax for a character entity in HTML?",
    "options": [
      "&entity_name;",
      "&entity_name",
      "#entity_name;",
      "&entity_name#;"
    ],
    "correctAnswer": 0,
    "explanation": "Character entities in HTML consist of an ampersand (&), an entity name or number, and a semicolon (;), e.g., &amp; for & or &#160; for non-breaking space."
  },
  {
    "id": 17,
    "question": "Which HTML tag is used to create a multi-line text input control?",
    "options": [
      "<input>",
      "<text>",
      "<textarea>",
      "<multiline>"
    ],
    "correctAnswer": 2,
    "explanation": "The <textarea> tag is used to create multi-line text input controls in HTML forms, allowing users to enter multiple lines of text."
  },
  {
    "id": 18,
    "question": "What attribute is used to merge two or more columns in an HTML table?",
    "options": [
      "rowspan",
      "colspan",
      "merge",
      "colmerge"
    ],
    "correctAnswer": 1,
    "explanation": "The colspan attribute is used to merge two or more columns into a single column in an HTML table."
  },
  {
    "id": 19,
    "question": "Which HTML form method should be used when dealing with sensitive data?",
    "options": [
      "GET",
      "POST",
      "SEND",
      "PUT"
    ],
    "correctAnswer": 1,
    "explanation": "The POST method should be used for sensitive data because it sends data in the HTTP message body, not in the URL, and doesn't remain in browser history."
  },
  {
    "id": 20,
    "question": "What is the purpose of the <fieldset> tag in HTML forms?",
    "options": [
      "To create a single-line text input",
      "To group related data in a form",
      "To create a submit button",
      "To define form validation rules"
    ],
    "correctAnswer": 1,
    "explanation": "The <fieldset> tag is used to group related data in a form, providing visual structure and organization for form elements."
  },
  {
    "id": 21,
    "question": "Which of the following correctly describes the difference between <span> and <div> elements?",
    "options": [
      "<span> is block-level, <div> is inline",
      "<span> is inline, <div> is block-level",
      "Both are block-level elements",
      "Both are inline elements"
    ],
    "correctAnswer": 1,
    "explanation": "The <span> element is inline and used for small chunks of HTML inside a line, while the <div> element is block-level (with line-break before and after) and used to group larger chunks of code."
  },
  {
    "id": 22,
    "question": "What is the effect of setting the 'target' attribute of a link to '_blank'?",
    "options": [
      "Loads the page into the current frame",
      "Loads the page into the parent window",
      "Loads the page into a new browser window",
      "Loads the page into the main browser window"
    ],
    "correctAnswer": 2,
    "explanation": "The target='_blank' attribute value opens the link in a new browser window or tab, keeping the current page open."
  },
  {
    "id": 23,
    "question": "Which CSS property is used to set the background color of an element?",
    "options": [
      "background-color",
      "color",
      "bgcolor",
      "background"
    ],
    "correctAnswer": 0,
    "explanation": "The background-color property is used to set the background color of an element in CSS. The 'color' property sets text color, and 'bgcolor' is an HTML attribute (deprecated)."
  },
  {
    "id": 24,
    "question": "What is the correct syntax for an internal CSS stylesheet?",
    "options": [
      "<style type='text/css'> p {color: green;} </style>",
      "<css> p {color: green;} </css>",
      "<stylesheet> p {color: green;} </stylesheet>",
      "<style> p {color: green;} </style>"
    ],
    "correctAnswer": 0,
    "explanation": "An internal stylesheet is defined using the <style> tag with type='text/css' attribute placed in the head section of the HTML document."
  },
  {
    "id": 25,
    "question": "What is the priority order of CSS stylesheets from highest to lowest?",
    "options": [
      "External > Internal > Inline > Browser default",
      "Inline > Internal > External > Browser default",
      "Browser default > External > Internal > Inline",
      "Internal > Inline > External > Browser default"
    ],
    "correctAnswer": 1,
    "explanation": "Inline styles have highest priority, followed by internal styles, then external styles, and finally browser default styles. Inline styles override all others."
  },
  {
    "id": 26,
    "question": "Which CSS property is used to align text within an element?",
    "options": [
      "align",
      "text-align",
      "vertical-align",
      "align-text"
    ],
    "correctAnswer": 1,
    "explanation": "The text-align property is used to align text within an element to the left, right, center, or justify."
  },
  {
    "id": 27,
    "question": "How do you set an image as the background of a webpage using CSS?",
    "options": [
      "background-image: url('image.jpg');",
      "background: url('image.jpg');",
      "image: url('image.jpg');",
      "Both A and B are correct"
    ],
    "correctAnswer": 3,
    "explanation": "Both background-image: url('image.jpg') and background: url('image.jpg') can be used to set a background image. The 'background' shorthand property can set multiple background properties at once."
  },
  {
    "id": 28,
    "question": "Which CSS property specifies the type of border (solid, dashed, dotted, etc.)?",
    "options": [
      "border-width",
      "border-color",
      "border-style",
      "border-type"
    ],
    "correctAnswer": 2,
    "explanation": "The border-style property specifies the type of border, with possible values including solid, dashed, dotted, double, groove, and outset."
  },
  {
    "id": 29,
    "question": "What is the purpose of the 'float' property in CSS?",
    "options": [
      "To make an element disappear",
      "To position an element to the left or right of its container",
      "To add a border to an element",
      "To change the font size"
    ],
    "correctAnswer": 1,
    "explanation": "The float property positions an element to the left or right of its container, allowing text and inline elements to wrap around it."
  },
  {
    "id": 30,
    "question": "Which CSS value for the 'position' property makes an element stay in a fixed position relative to the viewport?",
    "options": [
      "static",
      "relative",
      "absolute",
      "fixed"
    ],
    "correctAnswer": 3,
    "explanation": "The 'fixed' position value positions an element relative to the viewport, making it stay in the same position even when the page is scrolled."
  },
  {
    "id": 31,
    "question": "Which of the following is NOT a valid list-style-type value in CSS?",
    "options": [
      "disc",
      "square",
      "decimal",
      "dash"
    ],
    "correctAnswer": 3,
    "explanation": "'dash' is not a valid list-style-type value. Valid values include disc, square, decimal, circle, lower-roman, upper-alpha, etc."
  },
  {
    "id": 32,
    "question": "What is the Bootstrap grid system based on?",
    "options": [
      "8 columns",
      "12 columns",
      "16 columns",
      "24 columns"
    ],
    "correctAnswer": 1,
    "explanation": "Bootstrap uses a 12-column grid system that can be divided into various widths to accommodate different screen sizes, making web design responsive."
  },
  {
    "id": 33,
    "question": "Which of the following is a limitation of Bootstrap?",
    "options": [
      "Cross-browser compatibility",
      "Open source availability",
      "Generic and similar designs requiring customization",
      "Responsive design support"
    ],
    "correctAnswer": 2,
    "explanation": "Bootstrap has generic and similar designs, requiring additional CSS customization to create unique designs. Cross-browser compatibility, open source availability, and responsive design support are advantages."
  },
  {
    "id": 34,
    "question": "Which of the following is NOT a JavaScript characteristic?",
    "options": [
      "Platform independent",
      "Compiled language",
      "Event-driven",
      "Object-based"
    ],
    "correctAnswer": 1,
    "explanation": "JavaScript is an interpreted language, not a compiled language. It is platform-independent, event-driven, and object-based/object-oriented."
  },
  {
    "id": 35,
    "question": "What is the correct way to declare a variable in JavaScript?",
    "options": [
      "variable x = 10;",
      "var x = 10;",
      "int x = 10;",
      "x = 10; (without declaration)"
    ],
    "correctAnswer": 1,
    "explanation": "The 'var' keyword is used to declare variables in JavaScript. Variables can also be declared with 'let' or 'const', or without a keyword (though this is not recommended)."
  },
  {
    "id": 36,
    "question": "Which of the following is NOT a valid JavaScript array declaration?",
    "options": [
      "var x = new Array(10);",
      "var y = new Array(18,'hi',22);",
      "var z = [1,0,2];",
      "var w = array(1,2,3);"
    ],
    "correctAnswer": 3,
    "explanation": "'array(1,2,3)' is not valid JavaScript syntax. Arrays can be created using new Array(), new Array(size), or array literal [] syntax."
  },
  {
    "id": 37,
    "question": "What will be the output of the following JavaScript code? x = '5' + 5; document.write(x);",
    "options": [
      "10",
      "55",
      "Error",
      "Undefined"
    ],
    "correctAnswer": 1,
    "explanation": "In JavaScript, when one operand is a string, the + operator performs string concatenation. '5' + 5 results in the string '55'."
  },
  {
    "id": 38,
    "question": "Which JavaScript statement is used to make decisions based on multiple possible values of a single variable?",
    "options": [
      "if-else",
      "switch",
      "for",
      "while"
    ],
    "correctAnswer": 1,
    "explanation": "The switch statement is used to select one of many code blocks to execute based on the value of a single expression, more efficient than multiple if-else if statements for this purpose."
  },
  {
    "id": 39,
    "question": "What is the correct syntax for a JavaScript function declaration?",
    "options": [
      "function myfunction() { }",
      "myfunction() { }",
      "function myfunction { }",
      "function() myfunction { }"
    ],
    "correctAnswer": 0,
    "explanation": "The correct syntax is: function functionName(parameters) { code }. The function keyword is followed by the function name, parentheses, and curly braces."
  },
  {
    "id": 40,
    "question": "Which JavaScript popup box is used to get input from the user?",
    "options": [
      "alert()",
      "confirm()",
      "prompt()",
      "message()"
    ],
    "correctAnswer": 2,
    "explanation": "The prompt() method displays a dialog box that asks the user for input. alert() displays a message, confirm() asks for confirmation, and message() is not a standard JavaScript method."
  },
  {
    "id": 41,
    "question": "Which event occurs when a user clicks on an HTML element?",
    "options": [
      "onclick",
      "onmouseover",
      "onchange",
      "onsubmit"
    ],
    "correctAnswer": 0,
    "explanation": "The onclick event occurs when a user clicks on an HTML element. onmouseover occurs when hovering, onchange occurs when input changes, and onsubmit occurs when a form is submitted."
  },
  {
    "id": 42,
    "question": "How can you change the content of an HTML element with the id 'demo' using JavaScript?",
    "options": [
      "document.getElementById('demo').innerHTML = 'New Content';",
      "document.id('demo').innerHTML = 'New Content';",
      "demo.innerHTML = 'New Content';",
      "document.getElement('demo').innerHTML = 'New Content';"
    ],
    "correctAnswer": 0,
    "explanation": "The correct syntax is document.getElementById('demo').innerHTML = 'New Content'. getElementById is the standard DOM method to access elements by id."
  },
  {
    "id": 43,
    "question": "Which JavaScript method is used to validate radio buttons in a form?",
    "options": [
      ".value",
      ".checked",
      ".selectedIndex",
      ".selected"
    ],
    "correctAnswer": 1,
    "explanation": "The .checked property is used to check if a radio button or checkbox is selected. It returns true if selected, false otherwise."
  },
  {
    "id": 44,
    "question": "Which of the following is NOT a valid CSS pseudo-class?",
    "options": [
      ":hover",
      ":link",
      ":focus",
      ":click"
    ],
    "correctAnswer": 3,
    "explanation": ":click is not a valid CSS pseudo-class. Valid pseudo-classes include :hover, :link, :visited, :active, :focus, and many others."
  },
  {
    "id": 45,
    "question": "What is the purpose of the Git 'commit' command?",
    "options": [
      "To move files from working directory to staging area",
      "To save a snapshot of staged changes",
      "To view the commit history",
      "To create a new branch"
    ],
    "correctAnswer": 1,
    "explanation": "The 'git commit' command saves a snapshot of your staged changes to the repository history, creating a permanent record of the changes with a message."
  },
  {
    "id": 46,
    "question": "Which command creates a new Git branch and switches to it in a single step?",
    "options": [
      "git branch -b branch-name",
      "git checkout -b branch-name",
      "git switch -b branch-name",
      "Both B and C"
    ],
    "correctAnswer": 3,
    "explanation": "Both 'git checkout -b branch-name' and 'git switch -b branch-name' can create a new branch and switch to it in a single command."
  },
  {
    "id": 47,
    "question": "What is the purpose of the 'git remote add origin' command?",
    "options": [
      "To create a new repository on GitHub",
      "To link a local repository to a remote repository",
      "To push changes to the remote repository",
      "To clone a repository from GitHub"
    ],
    "correctAnswer": 1,
    "explanation": "'git remote add origin repository-url' links a local Git repository to a remote repository, allowing you to push and pull changes."
  },
  {
    "id": 48,
    "question": "Which of the following is a recommended branch naming convention for new features?",
    "options": [
      "NewFeature123",
      "feature/login-page",
      "feature_login_page",
      "Fix/Bug#123"
    ],
    "correctAnswer": 1,
    "explanation": "Recommended branch naming uses lowercase letters with hyphens or slashes, e.g., 'feature/login-page'. The format should be descriptive, clear, and consistent."
  },
  {
    "id": 49,
    "question": "What is the primary purpose of using Git branches?",
    "options": [
      "To delete old code",
      "To create separate versions for adding features or fixing bugs",
      "To merge code from different developers",
      "To store configuration files"
    ],
    "correctAnswer": 1,
    "explanation": "Git branches allow developers to work on separate versions of a project for adding new features or fixing bugs without affecting the main codebase."
  },
  {
    "id": 50,
    "question": "What is the effect of the 'background-size: 100% 100%;' property?",
    "options": [
      "The background image repeats both vertically and horizontally",
      "The background image is stretched to cover the entire element",
      "The background image is centered on the page",
      "The background image is displayed at its original size"
    ],
    "correctAnswer": 1,
    "explanation": "'background-size: 100% 100%;' stretches the background image to fill the entire width and height of the element, potentially distorting the image."
  },
  {
    "id": 51,
    "question": "Which CSS property is used to specify the distance between the content of an element and its border?",
    "options": [
      "margin",
      "padding",
      "spacing",
      "border-spacing"
    ],
    "correctAnswer": 1,
    "explanation": "The padding property specifies the space between the content of an element and its border, providing internal spacing."
  },
  {
    "id": 52,
    "question": "What is the correct way to include an external CSS file in an HTML document?",
    "options": [
      "<link rel='stylesheet' href='style.css'>",
      "<stylesheet src='style.css'>",
      "<style src='style.css'></style>",
      "<link rel='stylesheet' type='text/css' href='style.css'>"
    ],
    "correctAnswer": 3,
    "explanation": "The correct syntax for linking an external CSS file is <link rel='stylesheet' type='text/css' href='style.css'> in the head section."
  },
  {
    "id": 53,
    "question": "Which JavaScript method is used to find an HTML element by its id?",
    "options": [
      "getElementById()",
      "getElementByClass()",
      "querySelector()",
      "findElement()"
    ],
    "correctAnswer": 0,
    "explanation": "The getElementById() method returns the element with the specified id. It is the most commonly used method for accessing DOM elements."
  },
  {
    "id": 54,
    "question": "Which of the following is NOT a reason to use web frameworks like Bootstrap?",
    "options": [
      "Time-saving",
      "Responsive design support",
      "Eliminates the need for custom CSS",
      "Consistent styling"
    ],
    "correctAnswer": 2,
    "explanation": "While Bootstrap provides pre-designed components and styles, it does not eliminate the need for custom CSS when you want a unique design. It saves time, supports responsive design, and provides consistent styling."
  },
  {
    "id": 55,
    "question": "What is the purpose of the HTML <datalist> element?",
    "options": [
      "To store data in a database",
      "To provide an autocomplete feature for input fields",
      "To create a dropdown menu",
      "To define a list of items in a menu"
    ],
    "correctAnswer": 1,
    "explanation": "The <datalist> element provides an autocomplete feature for input fields by specifying a list of pre-defined options that users can choose from."
  },
  {
    "id": 56,
    "question": "Which Git command shows the commit history?",
    "options": [
      "git status",
      "git log",
      "git diff",
      "git show"
    ],
    "correctAnswer": 1,
    "explanation": "The 'git log' command displays the commit history of the repository, showing commit SHA, author, date, and commit messages."
  },
  {
    "id": 57,
    "question": "What is the correct way to set the font family in CSS?",
    "options": [
      "font-family: Arial, sans-serif;",
      "font: Arial, sans-serif;",
      "text-font: Arial;",
      "family-font: Arial;"
    ],
    "correctAnswer": 0,
    "explanation": "The correct syntax is 'font-family: Arial, sans-serif;'. Multiple font names can be specified as a fallback list."
  },
  {
    "id": 58,
    "question": "Which of the following is a valid CSS comment?",
    "options": [
      "// This is a comment",
      "/* This is a comment */",
      "# This is a comment",
      "<!-- This is a comment -->"
    ],
    "correctAnswer": 1,
    "explanation": "CSS comments are written between /* and */. Single-line comments (//) are not valid in CSS, and <!-- --> is an HTML comment."
  },
  {
    "id": 59,
    "question": "What is the purpose of the 'overflow' property in CSS?",
    "options": [
      "To add a border to a container",
      "To decide what to do if content exceeds element dimensions",
      "To float elements left or right",
      "To position elements absolutely"
    ],
    "correctAnswer": 1,
    "explanation": "The overflow property determines what to do when content inside an element exceeds its height and width, with options like visible, hidden, scroll, or auto."
  },
  {
    "id": 60,
    "question": "Which of the following correctly describes how to use Bootstrap via CDN?",
    "options": [
      "Download the Bootstrap files and host them locally",
      "Add the Bootstrap CSS link from a CDN to the HTML head section",
      "Only use Bootstrap components in JavaScript",
      "Install Bootstrap using npm only"
    ],
    "correctAnswer": 1,
    "explanation": "Using Bootstrap via CDN involves adding the Bootstrap CSS link from a content delivery network (CDN) to the HTML head section, making it easy to include Bootstrap without downloading files."
  }
];

async function seedIP1Quizzes() {
  const client = await pool.connect();
  try {
    console.log('--- Seeding Internet Programming I Quizzes ---');
    await client.query('BEGIN');

    // Find course in DB
    let courseRes = await client.query("SELECT id, title, code FROM courses WHERE code = 'IP1309' OR title ILIKE '%Internet Programming I%' OR title ILIKE '%Internet Programming 1%'");
    let courseId;
    let courseTitle;

    if (courseRes.rows.length === 0) {
      const ins = await client.query(`
        INSERT INTO courses (title, code, description)
        VALUES ('Internet Programming I', 'IP1309', 'Fundamentals of client-side web development including HTML, CSS, JavaScript, and responsive design.')
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

    // Delete existing practice quizzes for this course
    await client.query(`
      DELETE FROM quizzes
      WHERE course_id = $1
      AND COALESCE(quiz_type, 'quiz') = 'quiz'
      AND is_official = TRUE
      AND title LIKE $2
    `, [courseId, `${courseTitle} - Quiz %`]);

    const CHUNK_SIZE = 15; // 15 questions per quiz as requested
    const totalQuizzes = Math.ceil(questionsData.length / CHUNK_SIZE);
    let totalQuestionsInserted = 0;
    let totalOptionsInserted = 0;

    for (let i = 0; i < totalQuizzes; i++) {
      const startIdx = i * CHUNK_SIZE;
      const endIdx = Math.min((i + 1) * CHUNK_SIZE, questionsData.length);
      const chunkQuestions = questionsData.slice(startIdx, endIdx);
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
        const isMulti = Array.isArray(qData.correctAnswer) && qData.correctAnswer.length > 1;
        const qType = isMulti ? 'multi_choice' : 'single_choice';

        const questRes = await client.query(`
          INSERT INTO questions (quiz_id, question_text, explanation, question_type)
          VALUES ($1, $2, $3, $4)
          RETURNING id
        `, [quizId, qData.question, qData.explanation || null, qType]);
        const questionId = questRes.rows[0].id;
        totalQuestionsInserted++;

        for (let optIdx = 0; optIdx < qData.options.length; optIdx++) {
          const optText = qData.options[optIdx];
          const isCorrect = Array.isArray(qData.correctAnswer) 
            ? qData.correctAnswer.includes(optIdx)
            : optIdx === qData.correctAnswer;

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

    // Update course-material/quiz.json
    const quizJsonPath = path.join(__dirname, '..', 'course-material', 'quiz.json');
    if (fs.existsSync(quizJsonPath)) {
      const raw = fs.readFileSync(quizJsonPath, 'utf-8');
      const parsed = JSON.parse(raw);
      const list = parsed['quiz-exam'] || [];

      const existingIdx = list.findIndex(c => c.course && (c.course.toLowerCase().includes('internet programming i') || c.course.toLowerCase().includes('internet programming 1') || c.course.toLowerCase().includes('web programming')));
      const formattedEntry = {
        course: "Internet Programming I",
        questions: questionsData
      };

      if (existingIdx >= 0) {
        list[existingIdx] = formattedEntry;
      } else {
        list.push(formattedEntry);
      }
      parsed['quiz-exam'] = list;
      fs.writeFileSync(quizJsonPath, JSON.stringify(parsed, null, 4), 'utf-8');
      console.log(`✅ Updated course-material/quiz.json with Internet Programming I!`);
    }

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding IP1 quizzes:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seedIP1Quizzes();
