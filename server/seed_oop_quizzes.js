require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./src/config/db');

const questionsData = [
  {
    "id": 1,
    "question": "Which translator executes the individual steps in a high-level program one at a time rather than the whole program as a single unit.",
    "options": [
      "Interpreter",
      "Assembler",
      "Compiler",
      "JVM",
      "All"
    ],
    "correctAnswer": 0,
    "explanation": "An interpreter translates and executes high-level code line by line, while a compiler translates the entire program at once. JVM uses both interpretation and compilation (JIT)."
  },
  {
    "id": 2,
    "question": "It is based on commands that update variables in storage and control flow is an explicit sequence of commands.",
    "options": [
      "Imperative or procedural",
      "Declarative",
      "Logical or rule based",
      "Functional",
      "None"
    ],
    "correctAnswer": 0,
    "explanation": "Imperative/procedural programming uses explicit commands that update variables and control flow through statements, focusing on how to accomplish tasks step by step."
  },
  {
    "id": 3,
    "question": "What is procedure-oriented Language?",
    "options": [
      "A procedure-oriented Language is a language that incorporates all object-oriented programming features",
      "A procedure-oriented Language is a language that supports encapsulation and object identity",
      "A procedure-oriented Language is a language that consists of writing a list of instructions",
      "A procedure-oriented Language is a language that does not support Inheritance and Dynamic binding"
    ],
    "correctAnswer": 2,
    "explanation": "Procedure-oriented languages consist of writing a list of instructions (procedures/functions) that operate on data. They focus on the sequence of actions rather than objects."
  },
  {
    "id": 4,
    "question": "Which one is false about Java Key features?",
    "options": [
      "Platform-independent",
      "Simple",
      "Centralize",
      "Portable",
      "Multithreaded"
    ],
    "correctAnswer": 2,
    "explanation": "'Centralize' is not a Java key feature. Java is known for being platform-independent, simple, portable, and multithreaded."
  },
  {
    "id": 5,
    "question": "Which one is not java identifiers",
    "options": [
      "intab",
      "_ab",
      "All are possible",
      "a-bc",
      "a$b"
    ],
    "correctAnswer": 3,
    "explanation": "'a-bc' is not a valid Java identifier because it contains a hyphen (-), which is not allowed. Identifiers can contain letters, digits, underscore (_), and dollar sign ($) but cannot start with a digit."
  },
  {
    "id": 6,
    "question": "Which one is true about Java platform",
    "options": [
      "JRE is a superset of the JDK",
      "JRE = JVM + Java Packages of Classes + runtime libraries",
      "JDK is a superset of the JRE",
      "All are correct"
    ],
    "correctAnswer": 2,
    "explanation": "JDK (Java Development Kit) is a superset of JRE (Java Runtime Environment) as it includes JRE plus development tools like javac and javadoc."
  },
  {
    "id": 7,
    "question": "Which converted type is Casting with a larger range to a type with a small range",
    "options": [
      "Narrowing a type",
      "Widening a type",
      "Explicit casting",
      "Implicit casting"
    ],
    "correctAnswer": 0,
    "explanation": "Narrowing conversion casts a larger range type to a smaller range type, which may result in loss of data and requires explicit casting."
  },
  {
    "id": 8,
    "question": "Which one is false about while and do while loop",
    "options": [
      "Bothe are the same syntax",
      "While loop syntax first execute then check the expression",
      "Do While loop syntax first check the expression then executed",
      "All are false",
      "All are true"
    ],
    "correctAnswer": 3,
    "explanation": "All statements are false: while and do-while have different syntax, while checks condition first then executes, do-while executes first then checks condition."
  },
  {
    "id": 9,
    "question": "int x = 3; y = (x > 0) ? 5 : 6; what is the value of y?",
    "options": [
      "5",
      "0",
      "6",
      "None"
    ],
    "correctAnswer": 0,
    "explanation": "Since x = 3 > 0 is true, the ternary operator returns 5, so y = 5."
  },
  {
    "id": 10,
    "question": "Which is not a feature of OOP in general definitions?",
    "options": [
      "Efficient Code",
      "Code reusability",
      "Modularity",
      "Duplicate/Redundant data"
    ],
    "correctAnswer": 3,
    "explanation": "Duplicate/Redundant data is not a feature of OOP. OOP aims to avoid redundancy through reusability and modularity."
  },
  {
    "id": 11,
    "question": "Which was the first purely object oriented programming language developed?",
    "options": [
      "Kotlin",
      "SmallTalk",
      "Java",
      "C++"
    ],
    "correctAnswer": 1,
    "explanation": "SmallTalk was the first purely object-oriented programming language, developed at Xerox PARC in the 1970s."
  },
  {
    "id": 12,
    "question": "Which feature of OOP indicates code reusability?",
    "options": [
      "Abstraction",
      "Polymorphism",
      "Encapsulation",
      "Inheritance"
    ],
    "correctAnswer": 3,
    "explanation": "Inheritance enables code reusability by allowing derived classes to inherit and extend functionality from base classes."
  },
  {
    "id": 13,
    "question": "Which among the following doesn't come under OOP concept?",
    "options": [
      "Data hiding",
      "Message passing",
      "Platform independent",
      "Data binding"
    ],
    "correctAnswer": 2,
    "explanation": "Platform independence is a feature of Java (bytecode) but not an OOP concept. Data hiding, message passing, and data binding are OOP concepts."
  },
  {
    "id": 14,
    "question": "Which is the correct syntax of inheritance?",
    "options": [
      "class base_classname extends derived_classname{/*define class body*/};",
      "class derived_classname extends base_classname{/*define class body*/};",
      "class derived_classname base_classname{/*define class body*/};",
      "class base_classname derived_classname{/*define class body*/};"
    ],
    "correctAnswer": 1,
    "explanation": "The correct inheritance syntax is: class derived_classname extends base_classname { /* class body */ };"
  },
  {
    "id": 15,
    "question": "Which feature of OOP is indicated by the following code? class student { int marks; }; class topper:public student { int age; topper(int age){ this.age=age; } };",
    "options": [
      "Encapsulation and Inheritance",
      "Inheritance and polymorphism",
      "Polymorphism",
      "Inheritance"
    ],
    "correctAnswer": 3,
    "explanation": "The code shows inheritance (topper inherits from student) and encapsulation (data members are within class), but no polymorphism is demonstrated."
  },
  {
    "id": 16,
    "question": "What is encapsulation in OOP?",
    "options": [
      "It is a way of combining various data members and member functions that operate on those data members into a single unit",
      "It is a way of combining various data members and member functions into a single unit which can operate on any data",
      "It is a way of combining various data members into a single unit",
      "It is a way of combining various member functions into a single unit"
    ],
    "correctAnswer": 0,
    "explanation": "Encapsulation bundles data (attributes) and methods (functions) that operate on that data into a single unit (class), hiding internal details."
  },
  {
    "id": 17,
    "question": "Which is not true about polymorphism?",
    "options": [
      "Helps in redefining the same functionality",
      "Increases overhead of function definition always",
      "It is feature of OOP",
      "Ease in readability of program"
    ],
    "correctAnswer": 1,
    "explanation": "Polymorphism does not always increase overhead. It improves code flexibility and readability, allowing the same method name to have different implementations."
  },
  {
    "id": 18,
    "question": "Based on the following code: double x = 2.0; double y = 8.0; double z = x - ++(++y); Which one is true about the output of X?",
    "options": [
      "X = 0.0",
      "X = 2.0",
      "X = 1.0",
      "None"
    ],
    "correctAnswer": 1,
    "explanation": "x remains 2.0 because it is not modified. The expression only modifies y and z."
  },
  {
    "id": 19,
    "question": "Based on the following code: double x = 2.0; double y = 8.0; double z = x - ++(++y); Which one is true about the output of Y?",
    "options": [
      "Y = 11.0",
      "Y = 9.0",
      "Y = 10.0",
      "Y = 8.0",
      "None"
    ],
    "correctAnswer": 2,
    "explanation": "y starts at 8.0, then ++y increments to 9.0, then ++(++y) increments to 10.0, so y = 10.0."
  },
  {
    "id": 20,
    "question": "Based on the following code: double x = 2.0; double y = 8.0; double z = x - ++(++y); Which one is true about the output of Z?",
    "options": [
      "Z = 10.0",
      "Z = 8.0",
      "Z = -8.0",
      "Z = 9.0"
    ],
    "correctAnswer": 2,
    "explanation": "z = x - ++(++y) = 2.0 - 10.0 = -8.0"
  },
  {
    "id": 21,
    "question": "Which one is true to Creating Two-Dimensional Arrays(3 row and 4 column) the array reference variable is List and the element type is Double",
    "options": [
      "double list[][] = new double[3][4];",
      "double[][] list = new double[3][4];",
      "double[][] list = new double[4][3];",
      "double list[][] = new double[4][3];"
    ],
    "correctAnswer": 1,
    "explanation": "The correct syntax for a 2D array with 3 rows and 4 columns is: double[][] list = new double[3][4]; or double list[][] = new double[3][4];"
  },
  {
    "id": 22,
    "question": "Which one is true to assign the value 5.5 on the * place the array reference variable is List",
    "options": [
      "list[3][2] = 5.5;",
      "list[2][3] = 5.5;",
      "list[1][2] = 5.5;",
      "list[2][1] = 5.5;"
    ],
    "correctAnswer": 2,
    "explanation": "The star (*) position in the grid indicates row index 1 and column index 2 (assuming 0-based indexing), so list[1][2] = 5.5 is correct."
  },
  {
    "id": 23,
    "question": "Which of the following statements is false?",
    "options": [
      "A public class can be accessed by a class from a different package.",
      "A private method cannot be accessed by a class in a different package.",
      "A protected method can be accessed by a subclass in a different package.",
      "A method with default modifier can be accessed by a class in a different package"
    ],
    "correctAnswer": 3,
    "explanation": "Default (package-private) methods cannot be accessed by classes in different packages. They are only accessible within the same package."
  },
  {
    "id": 24,
    "question": "What is the output of the following code? public class Employee{ private String name; private int age; private double salary; private boolean attendance; public static void main(String[] args){ Employee emp = new Employee(); System.out.print(emp.name+\" \"+emp.age+\" \"+emp.attendance+\" \"+emp.salary); } }",
    "options": [
      "null 0.0 false 0",
      "0 false 0.0 null",
      "null 0 false 0.0",
      "null 0.0 false 0"
    ],
    "correctAnswer": 2,
    "explanation": "Default values in Java: String = null, int = 0, boolean = false, double = 0.0. Output: null 0 false 0.0"
  },
  {
    "id": 25,
    "question": "Which of the following modifier is not accessible in another class in different package but is accessible to any subclasses in any package?",
    "options": [
      "public",
      "private",
      "protected",
      "default"
    ],
    "correctAnswer": 2,
    "explanation": "Protected members are accessible to subclasses in any package but not to other classes in different packages."
  },
  {
    "id": 26,
    "question": "Which of the following is correct about static and instance?",
    "options": [
      "An Instance method can invoke static method",
      "A static method can invoke instance method",
      "A static method can access instance data fields directly without object",
      "A static method is inherited the subclass"
    ],
    "correctAnswer": 0,
    "explanation": "Instance methods can invoke static methods directly. Static methods cannot invoke instance methods directly without an object reference."
  },
  {
    "id": 27,
    "question": "Inheritance means that",
    "options": [
      "data fields should be declared private.",
      "a class can extend another class.",
      "a variable of super type can refer to a subtype object.",
      "a class can contain another class."
    ],
    "correctAnswer": 1,
    "explanation": "Inheritance means a class can extend another class, inheriting its attributes and methods."
  },
  {
    "id": 28,
    "question": "Which constructor will be called from the object created in the below C++ code? class A { int i; A() { i=0; cout<<i; } A(int x=0) { i=x; cout<<i; } };",
    "options": [
      "Parameterized constructor",
      "Default constructor",
      "Run time error",
      "Compile time error"
    ],
    "correctAnswer": 0,
    "explanation": "The constructor with int parameter (A(int x=0)) is a parameterized constructor with default argument, which will be called when an object is created with no arguments."
  },
  {
    "id": 29,
    "question": "What is an abstraction in object-oriented programming?",
    "options": [
      "Hiding the implementation and showing only the features",
      "Hiding the important data",
      "Hiding the implementation",
      "Showing the important data"
    ],
    "correctAnswer": 0,
    "explanation": "Abstraction hides implementation details and provides only the essential features, focusing on what the object does rather than how it does it."
  },
  {
    "id": 30,
    "question": "In which access should a constructor be defined, so that object of the class can be created in any function?",
    "options": [
      "Any access specifier will work",
      "Private",
      "Public",
      "Protected"
    ],
    "correctAnswer": 2,
    "explanation": "Constructors must be public to allow object creation from any function in any class."
  },
  {
    "id": 31,
    "question": "Which among the following is correct for the class defined below? class student { int marks; public: student(){} student(int x) { marks=x; } }; main() { student s1(100); student s2(); student s3=100; return 0; }",
    "options": [
      "Program will give compile time error",
      "Object s3, syntax error",
      "Only object s1 and s2 will be created",
      "Program runs and all objects are created"
    ],
    "correctAnswer": 3,
    "explanation": "All objects are valid: s1 uses parameterized constructor, s2 uses default constructor, s3 uses implicit conversion from int to student."
  },
  {
    "id": 32,
    "question": "The copy constructors can be used to ________",
    "options": [
      "Copy an object so that it can be passed to another primitive type variable",
      "Copy an object for type casting",
      "Copy an object so that it can be passed to a function",
      "Copy an object so that it can be passed to a class"
    ],
    "correctAnswer": 2,
    "explanation": "Copy constructors are used to copy an object so it can be passed to a function by value or to create a copy of an object."
  },
  {
    "id": 33,
    "question": "Which constructor will be called from the object obj2 in the following C++ program? class A { int i; A() { i=0; } A(int x) { i=x+1; } A(int y, int x) { i=x+y; } }; A obj1(10); A obj2(10,20); A obj3;",
    "options": [
      "A(int y, int x)",
      "A(int y; int x)",
      "A(int y)",
      "A(int x)"
    ],
    "correctAnswer": 0,
    "explanation": "obj2(10,20) calls the constructor A(int y, int x) which takes two int parameters."
  },
  {
    "id": 34,
    "question": "Which among the following represents correct constructor?",
    "options": [
      "-classname()",
      "classname()",
      "()classname",
      "~classname()"
    ],
    "correctAnswer": 1,
    "explanation": "A constructor has the same name as the class and no return type. Syntax: classname()"
  },
  {
    "id": 35,
    "question": "What happens when an object is passed by reference?",
    "options": [
      "Destructor is called at end of function",
      "Destructor is called when called explicitly",
      "Destructor is not called",
      "Destructor is called when function is out of scope"
    ],
    "correctAnswer": 0,
    "explanation": "When an object is passed by reference, the destructor is called at the end of the function when the reference goes out of scope."
  },
  {
    "id": 36,
    "question": "What is the file name of the above program?",
    "options": [
      "Circle.java",
      "ComputingFaculty.java",
      "Test.java",
      "Cannot be determined"
    ],
    "correctAnswer": 1,
    "explanation": "The program has a public class named ComputingFaculty, so the file name must be ComputingFaculty.java."
  },
  {
    "id": 37,
    "question": "What is the relationship between ComputingFaculty and Section classes?",
    "options": [
      "Composition relationship",
      "Inheritance relationship",
      "is-a relationship",
      "A and C",
      "B and C"
    ],
    "correctAnswer": 4,
    "explanation": "Section extends IT which extends ComputingFaculty, so it's an inheritance relationship (is-a relationship)."
  },
  {
    "id": 38,
    "question": "Which one is false statement?",
    "options": [
      "ComputingFaculty obj = new ComputingFaculty();",
      "IT obj = new IT();",
      "IT obj = new Section();",
      "IT obj = new ComputingFaculty();",
      "None"
    ],
    "correctAnswer": 3,
    "explanation": "IT obj = new ComputingFaculty(); is false because a superclass object cannot be assigned to a subclass reference (downcasting without explicit cast)."
  },
  {
    "id": 39,
    "question": "Which one is overridden method?",
    "options": [
      "display()",
      "getLocation()",
      "setLocation()",
      "IT()",
      "None"
    ],
    "correctAnswer": 0,
    "explanation": "display() is overridden in Section class. IT class has display() and Section class overrides it."
  },
  {
    "id": 40,
    "question": "What is the output of the above program?",
    "options": [
      "class of Computing Faculty class of IT class of Section",
      "class of Section class of Computing Faculty class of IT",
      "class of Section class of IT class of Computing Faculty",
      "None"
    ],
    "correctAnswer": 0,
    "explanation": "Constructors are called from top to bottom: ComputingFaculty constructor, then IT constructor, then Section constructor."
  },
  {
    "id": 41,
    "question": "Which one of the following is false statement about the object created by Section obj = new Section();",
    "options": [
      "obj instanceof ComputingFaculty",
      "obj instanceof IT",
      "obj instanceof Section",
      "obj instanceof ComputerScience",
      "None"
    ],
    "correctAnswer": 3,
    "explanation": "obj instanceof ComputerScience is false because ComputerScience is a sibling class, not in the inheritance hierarchy of Section."
  },
  {
    "id": 42,
    "question": "How to access data members of a class?",
    "options": [
      "Dot, arrow or direct call",
      "Dot operator",
      "Arrow operator",
      "Dot or arrow as required"
    ],
    "correctAnswer": 3,
    "explanation": "Data members can be accessed using dot operator (.) for objects and arrow operator (->) for pointers to objects."
  },
  {
    "id": 43,
    "question": "Which keyword among the following can be used to create an array of objects in java?",
    "options": [
      "allocate",
      "arr",
      "new",
      "create"
    ],
    "correctAnswer": 2,
    "explanation": "The 'new' keyword is used to create arrays and objects in Java. Syntax: new ClassName[size]"
  },
  {
    "id": 44,
    "question": "Which of the following is not a property of an object?",
    "options": [
      "Properties",
      "Names",
      "Identity",
      "Attributes"
    ],
    "correctAnswer": 0,
    "explanation": "Object properties include identity, state (attributes), and behavior (methods). 'Names' is not a fundamental property of an object."
  },
  {
    "id": 45,
    "question": "Which type of members can't be accessed in derived classes of a base class?",
    "options": [
      "All can be accessed",
      "Protected",
      "Private",
      "Public"
    ],
    "correctAnswer": 2,
    "explanation": "Private members of a base class cannot be accessed directly by derived classes. They are only accessible within the base class itself."
  },
  {
    "id": 46,
    "question": "Which among the following best describes the Inheritance?",
    "options": [
      "Using the data and functions into derived segment",
      "Using already defined functions in a programming language",
      "Using the code already written once",
      "Copying the code already written"
    ],
    "correctAnswer": 0,
    "explanation": "Inheritance allows a derived class to use the data and functions of a base class, extending and reusing existing code."
  },
  {
    "id": 47,
    "question": "What happens if non static members are used in static member function?",
    "options": [
      "Executes fine",
      "Compile time error",
      "Executes if that member function is not used",
      "Runtime error"
    ],
    "correctAnswer": 1,
    "explanation": "Static member functions cannot access non-static members directly because they don't have a 'this' reference. This causes a compile-time error."
  },
  {
    "id": 48,
    "question": "Where is the memory allocated for the objects?",
    "options": [
      "Cache",
      "ROM",
      "HDD",
      "RAM"
    ],
    "correctAnswer": 3,
    "explanation": "Objects are allocated memory in RAM (heap) at runtime. Cache is temporary, ROM is read-only, HDD is for persistent storage."
  },
  {
    "id": 49,
    "question": "Which of the following best describes member function overriding?",
    "options": [
      "Member functions having the same name in derived class only",
      "Member functions having the same name and different signature inside main function",
      "Member functions having the same name in base and derived classes",
      "Member functions having the same name in base class only"
    ],
    "correctAnswer": 2,
    "explanation": "Function overriding occurs when a derived class defines a function with the same name and signature as a function in the base class."
  },
  {
    "id": 50,
    "question": "Encapsulation and abstraction differ as",
    "options": [
      "Hiding and hiding respectively",
      "Binding and Hiding respectively",
      "Hiding and Binding respectively",
      "Binding and Binding respectively"
    ],
    "correctAnswer": 1,
    "explanation": "Encapsulation binds data and methods together, hiding implementation details. Abstraction hides complexity and shows only essential features."
  },
  {
    "id": 51,
    "question": "Which feature of OOP is exhibited by the function overriding?",
    "options": [
      "Polymorphism",
      "Encapsulation",
      "Abstraction",
      "Inheritance"
    ],
    "correctAnswer": 0,
    "explanation": "Function overriding is a form of polymorphism (runtime polymorphism) where the same function name has different implementations in derived classes."
  },
  {
    "id": 52,
    "question": "How to access the private member function of a class?",
    "options": [
      "Using class address",
      "Using object of class",
      "Using object pointer",
      "Using address of member function"
    ],
    "correctAnswer": 1,
    "explanation": "Private member functions can only be accessed through public member functions of the same class using the object of that class."
  },
  {
    "id": 53,
    "question": "Which keyword should be used to declare static variables?",
    "options": [
      "const",
      "common",
      "static",
      "stat"
    ],
    "correctAnswer": 2,
    "explanation": "The 'static' keyword is used to declare static variables, which are shared across all instances of a class."
  },
  {
    "id": 54,
    "question": "Which is correct syntax for declaring pointer to object?",
    "options": [
      "*className objectName;",
      "className* objectName;",
      "className objectName();",
      "className objectName;"
    ],
    "correctAnswer": 1,
    "explanation": "Pointer to object is declared as className* objectName; which stores the address of the object."
  },
  {
    "id": 55,
    "question": "Which class/set of classes can illustrate polymorphism in the following C++ code? abstract class student { public : int marks; calc_grade(); }; class topper:public student { public : calc_grade() { return 10; } }; class average:public student { public : calc_grade() { return 20; } }; class failed{ int marks; };",
    "options": [
      "Only class student and topper together can show polymorphism",
      "Only class student can show polymorphism",
      "Class failed should also inherit class student for this code to work for polymorphism",
      "All class student, topper and average together can show polymorphism"
    ],
    "correctAnswer": 3,
    "explanation": "student, topper, and average together demonstrate polymorphism. student is the base class (abstract), and topper/average override calc_grade()."
  },
  {
    "id": 56,
    "question": "If data members are private, what can we do to access them from the class object?",
    "options": [
      "Private data members can never be accessed from outside the class",
      "Create public member functions to access those data members",
      "Make them global variables",
      "Use friend function"
    ],
    "correctAnswer": 0,
    "explanation": "Private data members cannot be accessed directly from outside the class. They must be accessed through public getter/setter methods."
  },
  {
    "id": 57,
    "question": "Which among the following is not a necessary condition for constructors?",
    "options": [
      "Its name must be same as that of class",
      "It must not have any return type",
      "It must contain a definition body",
      "It can contains arguments"
    ],
    "correctAnswer": 3,
    "explanation": "Constructors may or may not contain arguments. Having arguments is not a necessary condition; constructors can be parameterless."
  },
  {
    "id": 58,
    "question": "Object being passed to a copy constructor",
    "options": [
      "Must not be mentioned in parameter list",
      "Must be passed with integer type",
      "Must be passed by value",
      "Must be passed by reference"
    ],
    "correctAnswer": 3,
    "explanation": "Copy constructors must pass the object by reference to avoid infinite recursion."
  },
  {
    "id": 59,
    "question": "If in multiple inheritance, class C inherits class B, and Class B inherits class A. In which sequence are their destructors called if an object of class C was declared?",
    "options": [
      "~A then ~B then ~C",
      "~C then ~A then ~B",
      "~C then ~B then ~A",
      "~B then ~C then ~A"
    ],
    "correctAnswer": 2,
    "explanation": "Destructors are called in reverse order of construction: ~C then ~B then ~A (from derived to base)."
  },
  {
    "id": 60,
    "question": "Instance of which type of class can't be created?",
    "options": [
      "Parent class",
      "Abstract class",
      "Anonymous class",
      "Nested class"
    ],
    "correctAnswer": 1,
    "explanation": "Abstract classes cannot be instantiated directly. They must be subclassed and the subclass can be instantiated."
  },
  {
    "id": 61,
    "question": "____ underlines the feature of Polymorphism in a class.",
    "options": [
      "Virtual Function",
      "Inline function",
      "Enclosing class",
      "Nested class"
    ],
    "correctAnswer": 0,
    "explanation": "Virtual functions enable runtime polymorphism by allowing derived classes to override base class methods."
  },
  {
    "id": 62,
    "question": "Which feature in OOP is used to allocate additional functions to a predefined operator in any language?",
    "options": [
      "Function Overloading",
      "Function Overriding",
      "Operator Overloading",
      "Operator Overriding"
    ],
    "correctAnswer": 2,
    "explanation": "Operator overloading allows defining additional functionality for operators (like +, -, etc.) for user-defined data types."
  },
  {
    "id": 63,
    "question": "Which feature can be implemented using encapsulation?",
    "options": [
      "Polymorphism",
      "Overloading",
      "Inheritance",
      "Abstraction"
    ],
    "correctAnswer": 3,
    "explanation": "Encapsulation implements abstraction by hiding internal implementation details and exposing only necessary functionality through public interfaces."
  },
  {
    "id": 64,
    "question": "Based on the code provided, which of the following statement is correct when you insert at line 29?",
    "options": [
      "price = price;",
      "this.price = price;",
      "price = this.price;",
      "None"
    ],
    "correctAnswer": 1,
    "explanation": "To set the instance variable price, use this.price = price; to distinguish the parameter from the instance variable."
  },
  {
    "id": 65,
    "question": "Based on the code provided, which of the following is a local variable in the above program?",
    "options": [
      "title",
      "authName",
      "name",
      "All"
    ],
    "correctAnswer": 0,
    "explanation": "In the constructor Book(String t, String n, float p), t, n, and p are local variables. title is an instance variable."
  },
  {
    "id": 66,
    "question": "Based on the code provided, which line of code is a package name in the above program?",
    "options": [
      "Line 2",
      "Line 1",
      "Line 3",
      "Line 32",
      "None"
    ],
    "correctAnswer": 1,
    "explanation": "Line 1 (package bookInfo;) declares the package name for the classes in the program."
  },
  {
    "id": 67,
    "question": "Based on the code provided, which of the following statement is correct to access variable num inside the main() method of TestBook class?",
    "options": [
      "TestBook.num;",
      "Book.num;",
      "book.num;",
      "testbook.num;",
      "None"
    ],
    "correctAnswer": 1,
    "explanation": "num is a static variable of the Book class, so it can be accessed as Book.num (using class name, not object)."
  },
  {
    "id": 68,
    "question": "Based on the code provided, which of the following statement is correct to access title inside the main() method of TestBook class using the object created: Book bk = new Book(\"computer\", \"William Jems\", 56)?",
    "options": [
      "System.out.println(bk.title);",
      "System.out.println(title);",
      "System.out.println(bk.getTitle());",
      "System.out.println(getTitle());"
    ],
    "correctAnswer": 2,
    "explanation": "title is private, so it can only be accessed through the public getter method bk.getTitle()."
  },
  {
    "id": 69,
    "question": "Based on the code provided, which one is correct statement to call/invoke method getNum() inside the main() method?",
    "options": [
      "Book.getNum();",
      "TestBook.getNum();",
      "book.getNum();",
      "getNum();",
      "None"
    ],
    "correctAnswer": 0,
    "explanation": "getNum() is a static method of Book class, so it can be called as Book.getNum() (using class name)."
  },
  {
    "id": 70,
    "question": "Based on the code provided, which of the following statement is false?",
    "options": [
      "Book bk = new Object();",
      "Object obj = new Book();",
      "Object obj = new Object();",
      "None"
    ],
    "correctAnswer": 0,
    "explanation": "Book bk = new Object(); is false because Object is a superclass, cannot be assigned to a subclass reference (downcasting without explicit cast)."
  },
  {
    "id": 71,
    "question": "Which one of the following statement is true",
    "options": [
      "A has-a relationship is implemented via inheritance.",
      "A House class has is-a relationship with door",
      "In java it is possible subclass redefined a superclass method.",
      "Superclass constructor is not inherited by sub class",
      "all are correct"
    ],
    "correctAnswer": 3,
    "explanation": "Superclass constructors are not inherited by subclasses. They must be invoked using super()."
  },
  {
    "id": 72,
    "question": "Inheritance means that",
    "options": [
      "Data fields should be declared private.",
      "A class can extends another class",
      "A variable of super type can refer to a subtype object",
      "A class can contain another class.",
      "all are answer"
    ],
    "correctAnswer": 1,
    "explanation": "Inheritance means a class can extend another class, inheriting its attributes and methods."
  },
  {
    "id": 73,
    "question": "Which of the following is false",
    "options": [
      "Class A extends B means B is subset of A",
      "A subclass is a subset of superclass",
      "Subclass contains specific data fields and functionality in addition to the superclass member.",
      "Super class is define common behavior for related and unrelated classes."
    ],
    "correctAnswer": 3,
    "explanation": "Superclasses define common behavior for related classes (not unrelated classes). Unrelated classes should not share inheritance."
  },
  {
    "id": 74,
    "question": "Which error occur when a program doesn't perform the way it was intended to.",
    "options": [
      "Logic errors",
      "Syntax errors",
      "Runtime errors",
      "Runtime and Logic errors",
      "None"
    ],
    "correctAnswer": 0,
    "explanation": "Logic errors occur when the program runs but produces incorrect results due to logical flaws in the code."
  },
  {
    "id": 75,
    "question": "Which two features of object-oriented programming are the same?",
    "options": [
      "Abstraction and Polymorphism features are the same",
      "Inheritance and Encapsulation features are the same",
      "Encapsulation and Polymorphism features are the same",
      "Encapsulation and Abstraction"
    ],
    "correctAnswer": 3,
    "explanation": "Encapsulation and abstraction are closely related. Encapsulation hides implementation details, which is the mechanism that enables abstraction."
  },
  {
    "id": 76,
    "question": "Which among the following cannot be used for the concept of polymorphism?",
    "options": [
      "Static member function",
      "Constructor Overloading",
      "Member function overloading",
      "Global member function"
    ],
    "correctAnswer": 3,
    "explanation": "Global member functions (free functions) are not part of classes, so they cannot be used for polymorphism."
  },
  {
    "id": 77,
    "question": "Which function best describe the concept of polymorphism in programming languages?",
    "options": [
      "Class member function",
      "Virtual function",
      "Inline function",
      "Undefined function"
    ],
    "correctAnswer": 1,
    "explanation": "Virtual functions are the key mechanism for implementing polymorphism in C++, enabling runtime dynamic dispatch."
  },
  {
    "id": 78,
    "question": "Which of the following feature is also known as run-time binding or late binding?",
    "options": [
      "Dynamic typing",
      "Dynamic loading",
      "Dynamic binding",
      "Data hiding"
    ],
    "correctAnswer": 2,
    "explanation": "Dynamic binding (late binding) resolves method calls at runtime, enabling polymorphism and virtual function dispatch."
  },
  {
    "id": 79,
    "question": "Which of the following OOP concept binds the code and data together and keeps them secure from the outside world?",
    "options": [
      "Polymorphism",
      "Encapsulation",
      "Inheritance",
      "Abstraction"
    ],
    "correctAnswer": 1,
    "explanation": "Encapsulation binds code and data together (bundling) and hides the internal details, keeping them secure from external interference."
  },
  {
    "id": 80,
    "question": "Which of the following variable violates the definition of encapsulation?",
    "options": [
      "Array variables",
      "Local variables",
      "Global variables",
      "protected variables"
    ],
    "correctAnswer": 2,
    "explanation": "Global variables violate encapsulation because they are accessible from anywhere, breaking data hiding principles."
  },
  {
    "id": 81,
    "question": "The concept of encapsulation helps in writing which type of classes in the Java programming language?",
    "options": [
      "Abstract classes",
      "Wrapper classes",
      "Mutable classes",
      "Immutable classes"
    ],
    "correctAnswer": 3,
    "explanation": "Encapsulation helps in creating immutable classes by making data private and providing only getters without setters."
  },
  {
    "id": 82,
    "question": "Which of the following syntax is incorrect for the class definition?",
    "options": [
      "student class{ }",
      "class student{ student(int a){ } ;",
      "class teacher{ public: teacher(int a){ } ;",
      "None of the mentioned"
    ],
    "correctAnswer": 0,
    "explanation": "'student class{ }' is incorrect because the class keyword must come before the class name. Correct syntax is 'class student{ }'"
  },
  {
    "id": 83,
    "question": "The object cannot be",
    "options": [
      "passed by copy",
      "passed as function",
      "passed by value",
      "passed by reference"
    ],
    "correctAnswer": 1,
    "explanation": "Objects cannot be 'passed as function'. They can be passed by value, by reference, or by copy, but not as a function itself."
  },
  {
    "id": 84,
    "question": "Which of the following definition best describes the concept of polymorphism?",
    "options": [
      "It is the ability to process the many messages and data in one way",
      "It is the ability to process the undefined messages or data in at least one way",
      "It is the ability to process the message or data in more than one form",
      "It is the ability to process the message or data in only one form"
    ],
    "correctAnswer": 2,
    "explanation": "Polymorphism is the ability to process messages or data in more than one form, allowing different objects to respond to the same message differently."
  },
  {
    "id": 85,
    "question": "____ is considered to be a partitioned area of computer memory that stores data and set of operations that can access the data.",
    "options": [
      "Classes",
      "Objects",
      "Variables",
      "Functions"
    ],
    "correctAnswer": 0,
    "explanation": "Classes are blueprints that partition memory to store data (attributes) and define operations (methods) that can access that data."
  },
  {
    "id": 86,
    "question": "Objects are the variables of the type",
    "options": [
      "String",
      "Boolean",
      "Class",
      "All data types can be included"
    ],
    "correctAnswer": 2,
    "explanation": "Objects are instances (variables) of a class type. A class defines the blueprint, and objects are instantiated from that class."
  },
  {
    "id": 87,
    "question": "Why classes are known as abstract data types (ADT)?",
    "options": [
      "Because classes are user-defined data types",
      "Because it supports the theory of hierarchical classification",
      "Because it allows dynamic binding",
      "Because it uses the concept of data abstraction"
    ],
    "correctAnswer": 0,
    "explanation": "Classes are ADTs because they are user-defined data types that encapsulate data and operations, providing abstraction from implementation details."
  },
  {
    "id": 88,
    "question": "Which is not true about the object-oriented approach?",
    "options": [
      "Emphasis is on data rather than procedure",
      "Data is hidden and cannot be accessed by external functions",
      "Objects communicate through functions",
      "It supports abstract data but not the class"
    ],
    "correctAnswer": 3,
    "explanation": "OOP does support abstract data through classes. Classes are the fundamental constructs for implementing ADTs in OOP."
  },
  {
    "id": 89,
    "question": "____ is the process of compartmentalizing the elements of an abstraction that contribute to its structure and behavior?",
    "options": [
      "Encapsulation",
      "Abstraction",
      "Classes",
      "Inheritance"
    ],
    "correctAnswer": 0,
    "explanation": "Encapsulation compartmentalizes elements of an abstraction, keeping the structure and behavior together within a class."
  },
  {
    "id": 90,
    "question": "A ____ object gets its memory allocated at runtime.",
    "options": [
      "Static objects",
      "Dynamic objects",
      "a and b",
      "None"
    ],
    "correctAnswer": 1,
    "explanation": "Dynamic objects are created at runtime using the 'new' keyword in Java or 'new' operator in C++, allocating memory on the heap."
  },
  {
    "id": 91,
    "question": "A ____ object gets its memory allocated at compile time.",
    "options": [
      "Static objects",
      "Dynamic objects",
      "Both",
      "None"
    ],
    "correctAnswer": 0,
    "explanation": "Static objects are allocated at compile time and exist throughout program execution, unlike dynamic objects that are created at runtime."
  },
  {
    "id": 92,
    "question": "Which access specifier makes the class member accessible outside the class but can be accessed by any subclass of that class?",
    "options": [
      "Private",
      "Public",
      "Protected",
      "Default"
    ],
    "correctAnswer": 2,
    "explanation": "Protected access specifier allows members to be accessible outside the class but only to subclasses in any package."
  },
  {
    "id": 93,
    "question": "Which access specifiers have strict access control?",
    "options": [
      "Private",
      "Public",
      "Protected",
      "Default"
    ],
    "correctAnswer": 0,
    "explanation": "Private access specifier has the strictest access control, making members accessible only within the same class."
  },
  {
    "id": 94,
    "question": "When an object is created an initialization needs to be done which is automatically done by the ____ function?",
    "options": [
      "Constructor",
      "Destructor",
      "Friend",
      "Member"
    ],
    "correctAnswer": 0,
    "explanation": "Constructors automatically initialize object state when objects are created, handling initialization requirements."
  },
  {
    "id": 95,
    "question": "____ is associated with polymorphism and inheritance.",
    "options": [
      "Message parsing",
      "Abstraction",
      "Dynamic Binding",
      "Encapsulation"
    ],
    "correctAnswer": 2,
    "explanation": "Dynamic binding is associated with polymorphism and inheritance as it determines which method to call at runtime based on the actual object type."
  },
  {
    "id": 96,
    "question": "The scope resolution operator is used to ____ function in the Inheritance.",
    "options": [
      "Overload",
      "Override",
      "Both",
      "None"
    ],
    "correctAnswer": 1,
    "explanation": "The scope resolution operator (::) is used to override functions in inheritance by calling the base class version of an overridden function."
  },
  {
    "id": 97,
    "question": "Which one is false about implicit and explicit casting object?",
    "options": [
      "Object o = new Student(); Implicit casting",
      "Student s = (Student) o; Explicit casting",
      "String s = (String) o; Explicit casting",
      "None"
    ],
    "correctAnswer": 2,
    "explanation": "String s = (String) o; is false because o is an Object that holds a Student object, which cannot be cast to String (ClassCastException)."
  },
  {
    "id": 98,
    "question": "Which one is false about abstract classes and interfaces?",
    "options": [
      "All Interfaces variables must be public static final",
      "All Interfaces methods must be public abstract instance methods",
      "Both abstract class and interface cannot be instantiated using the new operator",
      "Abstract class constructors are invoked by subclasses through constructor chaining.",
      "All are true"
    ],
    "correctAnswer": 4,
    "explanation": "All statements are true. Interface variables are public static final by default, interface methods are public abstract, both cannot be instantiated, and abstract class constructors are invoked via super()."
  },
  {
    "id": 99,
    "question": "Which one is true to create using inner non-static class object",
    "options": [
      "OuterClass.InnerClass innerObject = outerObject.new InnerClass();",
      "OuterClass.InnerClass innerObject = new OuterClass.InnerClass();",
      "InnerClass.OuterClass innerObject = new outerObject.InnerClass();",
      "OuterClass.InnerClass innerObject = new InnerClass OuterClass();"
    ],
    "correctAnswer": 0,
    "explanation": "To create an inner (non-static) class object, use: OuterClass.InnerClass innerObject = outerObject.new InnerClass();"
  },
  {
    "id": 100,
    "question": "Which one is false about finally block is executed on exceptions?",
    "options": [
      "If no exception arises in the try block, final Statements is executed, and the next statement after the try statement is executed.",
      "If a statement causes an exception in the try block that is caught in a catch block, the rest of the statements in the try block are skipped, the catch block is executed, and the finally clause is executed. The next statement after the try statement is executed.",
      "If one of the statements causes an exception that is not caught in any catch block, the other statements in the try block are skipped, the finally clause is executed, and the exception is passed to the caller of this method.",
      "All are correct"
    ],
    "correctAnswer": 3,
    "explanation": "All statements about finally block execution are correct. The finally block always executes regardless of whether an exception occurs or not."
  }
];

async function seedOOPQuizzes() {
  const client = await pool.connect();
  try {
    console.log('--- Seeding Object-Oriented Programming Quizzes ---');
    await client.query('BEGIN');

    // Find course in DB
    let courseRes = await client.query("SELECT id, title, code FROM courses WHERE code = 'OOP302' OR title ILIKE '%Object-Oriented%' OR title ILIKE '%Object Oriented%'");
    let courseId;
    let courseTitle;

    if (courseRes.rows.length === 0) {
      const ins = await client.query(`
        INSERT INTO courses (title, code, description)
        VALUES ('Object-Oriented Programming in Java', 'OOP302', 'Foundations of object-oriented programming, classes, encapsulation, inheritance, polymorphism, and Java fundamentals.')
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

    const CHUNK_SIZE = 25; // 25 questions per quiz
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

      const existingIdx = list.findIndex(c => c.course && (c.course.toLowerCase().includes('object oriented') || c.course.toLowerCase().includes('object-oriented')));
      const formattedEntry = {
        course: "Object-Oriented Programming in Java",
        questions: questionsData
      };

      if (existingIdx >= 0) {
        list[existingIdx] = formattedEntry;
      } else {
        list.push(formattedEntry);
      }
      parsed['quiz-exam'] = list;
      fs.writeFileSync(quizJsonPath, JSON.stringify(parsed, null, 4), 'utf-8');
      console.log(`✅ Updated course-material/quiz.json with Object-Oriented Programming in Java!`);
    }

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding OOP quizzes:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seedOOPQuizzes();
