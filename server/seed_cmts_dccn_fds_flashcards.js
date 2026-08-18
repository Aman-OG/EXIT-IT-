const pool = require('./src/config/db');

const cmtsCards = [
  {"front": "What does BIOS stand for?", "back": "Basic Input Output System"},
  {"front": "What is the first component to load when a computer is turned on?", "back": "BIOS"},
  {"front": "What is the main circuit board that contains most of the electronics in a computer?", "back": "Motherboard"},
  {"front": "What type of memory loses its contents when power is removed?", "back": "Volatile memory (RAM)"},
  {"front": "What type of memory retains data even when power is off?", "back": "Non-volatile memory (ROM)"},
  {"front": "What does RAM stand for?", "back": "Random Access Memory"},
  {"front": "What does ROM stand for?", "back": "Read-Only Memory"},
  {"front": "What chip contains startup instructions for low-level hardware?", "back": "BIOS chip"},
  {"front": "What is the purpose of the CMOS battery?", "back": "To maintain system settings and time when the computer is off"},
  {"front": "What does ESD stand for?", "back": "Electrostatic Discharge"},
  {"front": "What is the minimum voltage that can damage a computer chip?", "back": "10 volts"},
  {"front": "What device is worn on the wrist to prevent ESD damage?", "back": "Anti-static wrist strap"},
  {"front": "What is the name of the test the BIOS runs at startup to check hardware?", "back": "POST (Power On Self Test)"},
  {"front": "What is the function of a power supply unit?", "back": "Converts AC power to DC power for computer components"},
  {"front": "What is the most common power connector for modern hard drives?", "back": "SATA power connector"},
  {"front": "What type of UPS provides continuous power from its battery at all times?", "back": "Online UPS"},
  {"front": "What type of UPS only activates when it detects a power sag?", "back": "Standby UPS"},
  {"front": "What is a brief decrease in voltage called?", "back": "Sag"},
  {"front": "What is a complete power failure called?", "back": "Blackout"},
  {"front": "What is a brief increase in voltage called?", "back": "Spike"},
  {"front": "What is a prolonged increase in voltage called?", "back": "Surge"},
  {"front": "What device protects against power surges?", "back": "Surge suppressor"},
  {"front": "What does CPU stand for?", "back": "Central Processing Unit"},
  {"front": "What type of socket has pins on the socket instead of the CPU?", "back": "LGA (Land Grid Array)"},
  {"front": "What type of socket has pins on the CPU?", "back": "PGA (Pin Grid Array)"},
  {"front": "What component is used to cool the CPU?", "back": "Heat sink"},
  {"front": "What is the fastest cache memory that is built into the CPU?", "back": "L1 cache"},
  {"front": "What is the second level of cache memory?", "back": "L2 cache"},
  {"front": "What type of RAM is faster and more expensive, used as cache?", "back": "SRAM (Static RAM)"},
  {"front": "What type of RAM is slower, less expensive, and needs refreshing?", "back": "DRAM (Dynamic RAM)"},
  {"front": "What is the memory module with a 64-bit data path called?", "back": "DIMM (Dual Inline Memory Module)"},
  {"front": "What is the older memory module with a 32-bit data path called?", "back": "SIMM (Single Inline Memory Module)"},
  {"front": "What is the type of ROM that can be erased with UV light?", "back": "EPROM (Erasable Programmable ROM)"},
  {"front": "What is the type of ROM that can be erased electronically?", "back": "EEPROM (Electrically Erasable Programmable ROM)"},
  {"front": "What is the central bus that connects the CPU to RAM?", "back": "System bus"},
  {"front": "What is the bus that connects the CPU to all other components except RAM?", "back": "I/O bus"},
  {"front": "What expansion bus was introduced by Intel in 1992 for high-speed devices?", "back": "PCI (Peripheral Component Interconnect)"},
  {"front": "What expansion bus was designed specifically for graphics cards?", "back": "AGP (Accelerated Graphics Port)"},
  {"front": "What is the connector used for keyboards and mice called?", "back": "PS/2 connector"},
  {"front": "What type of connector is a plug-and-play interface for peripherals?", "back": "USB (Universal Serial Bus)"},
  {"front": "What is the network connector also known as an Ethernet port?", "back": "RJ45 connector"},
  {"front": "What is the standard 15-pin connector used for monitors?", "back": "VGA connector"},
  {"front": "What is a 24-pin digital video connector called?", "back": "DVI (Digital Video Interface)"},
  {"front": "What digital interface carries both high-definition video and audio?", "back": "HDMI (High-Definition Multimedia Interface)"},
  {"front": "What is the main storage device that holds all programs and data?", "back": "Hard disk drive"},
  {"front": "What type of hard drive interface uses a parallel cable?", "back": "IDE/PATA"},
  {"front": "What type of hard drive interface uses a serial cable for faster transfer?", "back": "SATA"},
  {"front": "What is the drive setting that auto-configures as master or slave based on cable position?", "back": "Cable select"},
  {"front": "What type of hard drive interface is high-end and used for servers?", "back": "SCSI"},
  {"front": "What is the connector used for older 3.5-inch floppy disk drives?", "back": "Mini connector"},
  {"front": "What is the most common power connector type for older devices like PATA drives?", "back": "Molex connector"},
  {"front": "What is a surface-conducted electron-emitted display called?", "back": "SED monitor"},
  {"front": "What is the newer, flatter type of computer screen called?", "back": "LCD monitor"},
  {"front": "What is the type of connector that gives better quality than VGA but is older than DVI?", "back": "S-Video"},
  {"front": "What is the name of the memory location for storing BIOS settings?", "back": "CMOS RAM"},
  {"front": "What type of damage makes a component fail completely and immediately?", "back": "Catastrophic failure"},
  {"front": "What type of ESD damage causes erratic, unpredictable faults?", "back": "Upset failure"},
  {"front": "What type of ESD damage weakens transistors but may pass tests?", "back": "Latent failure"},
  {"front": "What is the name of the CPU package with pins arranged in a straight grid?", "back": "PGA (Pin Grid Array)"},
  {"front": "What is the name of the CPU package with pins arranged diagonally?", "back": "SPGA (Staggered Pin Grid Array)"},
  {"front": "What is the term for the connector that links the CPU to the motherboard?", "back": "CPU socket"},
  {"front": "What type of CPU cooler has no moving parts?", "back": "Passive heat sink"},
  {"front": "What type of CPU cooler includes a fan to blow air directly onto the heatsink?", "back": "Active heat sink"},
  {"front": "What is used to ensure maximum contact between the CPU and heatsink?", "back": "Thermal compound/grease"},
  {"front": "What does SATA stand for?", "back": "Serial Advanced Technology Attachment"},
  {"front": "What does IDE stand for?", "back": "Integrated Drive Electronics"},
  {"front": "What type of monitor displays shades of gray?", "back": "Gray-scale monitor"},
  {"front": "What type of monitor displays two colors, one for background and one for foreground?", "back": "Monochrome monitor"},
  {"front": "What is the name for the motherboard chip that controls communication between CPU, RAM, and AGP?", "back": "North Bridge"},
  {"front": "What is the name for the motherboard chip that controls slower devices like USB and hard drives?", "back": "South Bridge"},
  {"front": "What is the newer chipset architecture that replaced North/South Bridge?", "back": "Hub architecture"},
  {"front": "What is the name of the chip that controls serial ports, parallel ports, and floppy drives?", "back": "Super I/O chip"},
  {"front": "What is the term for the motherboard setting method that uses small pins and a shunt?", "back": "Jumpers"},
  {"front": "What is the term for a tiny switch or group of switches on a circuit board?", "back": "DIP switches"},
  {"front": "What is the device that provides battery backup and regulates power?", "back": "UPS (Uninterruptible Power Supply)"},
  {"front": "What is the space on the monitor that is actually usable called?", "back": "Viewable area"},
  {"front": "What is a port that resembles a slightly tapered USB port for video and audio?", "back": "HDMI port"},
  {"front": "What is the motherboard screw that secures a card to the case called?", "back": "Mounting bracket screw"},
  {"front": "What is the process of copying BIOS to RAM for faster execution called?", "back": "Shadowing"},
  {"front": "What error is indicated by 1 long, 2 short beeps on an AMI BIOS?", "back": "Video adapter error"},
  {"front": "What is the signal from the power supply that tells the motherboard it can start?", "back": "Power Good"},
  {"front": "What is the feature that allows devices to be added or removed while the computer is running?", "back": "Hot swapping"},
  {"front": "What is the measurement of a monitor screen from corner to corner?", "back": "Diagonal inches"},
  {"front": "What is the native resolution for a typical 15-inch LCD monitor?", "back": "1024 x 768 pixels"},
  {"front": "What is the term for a monitor orientation that is taller than it is wide?", "back": "Portrait"},
  {"front": "What is the term for a monitor orientation that is wider than it is tall?", "back": "Landscape"},
  {"front": "What is the acronym for the physical packaging of RAM modules?", "back": "SIMM/DIMM"},
  {"front": "What is the main cause of overheating in a CPU?", "back": "Fan failure or insufficient cooling"},
  {"front": "What is the symptom of a dead CMOS battery?", "back": "Loss of date/time and BIOS settings"},
  {"front": "What is the typical lifespan of a CMOS battery?", "back": "10 years"},
  {"front": "What is the most common cause of CD read errors?", "back": "Scratches, dirt, or dust"},
  {"front": "What should you use to clean a CD?", "back": "A soft, dry cloth"},
  {"front": "What is the term for electromagnetic interference from a PC?", "back": "EMI"},
  {"front": "What is the meaning of the '!' flag in Device Manager?", "back": "The device is acting incorrectly"},
  {"front": "What does the 'X' flag in Device Manager indicate?", "back": "The device is disabled"},
  {"front": "What is the first step in the troubleshooting process?", "back": "Gather data from the customer"},
  {"front": "What type of question encourages a customer to describe a problem in detail?", "back": "Open-ended question"},
  {"front": "What type of question has a yes/no answer?", "back": "Closed-ended question"},
  {"front": "What is the best way to clean a computer case?", "back": "Use mild cleaning solution and a lint-free cloth"},
  {"front": "What tool should be used to clean heat sinks?", "back": "Compressed air"},
  {"front": "What should be used to clean RAM modules?", "back": "Isopropyl alcohol and lint-free swabs"},
  {"front": "What is the tool used to clean a keyboard?", "back": "Hand-held vacuum cleaner with a brush attachment"},
  {"front": "What should you do before cleaning any electronic device?", "back": "Turn it off and unplug it"},
  {"front": "What is the first step in motherboard configuration using jumpers?", "back": "Read the motherboard manual"}
];

const dccnCards = [
  {"front": "What is the standard OSI model?", "back": "Open Systems Interconnection model"},
  {"front": "How many layers does the OSI model have?", "back": "7 layers"},
  {"front": "How many layers does the TCP/IP model have?", "back": "4 layers"},
  {"front": "Which OSI layer provides services to user applications?", "back": "Application layer (Layer 7)"},
  {"front": "Which OSI layer is responsible for data translation, encryption, and compression?", "back": "Presentation layer (Layer 6)"},
  {"front": "Which OSI layer establishes, manages, and terminates sessions?", "back": "Session layer (Layer 5)"},
  {"front": "Which OSI layer provides end-to-end communication and segmentation?", "back": "Transport layer (Layer 4)"},
  {"front": "Which OSI layer handles logical addressing and routing?", "back": "Network layer (Layer 3)"},
  {"front": "Which OSI layer provides physical addressing (MAC) and error detection?", "back": "Data Link layer (Layer 2)"},
  {"front": "Which OSI layer deals with the physical transmission of raw bits?", "back": "Physical layer (Layer 1)"},
  {"front": "Which layer of the OSI model encapsulates data into frames?", "back": "Data Link layer"},
  {"front": "Which layer of the OSI model encapsulates data into packets?", "back": "Network layer"},
  {"front": "What is a protocol?", "back": "A set of rules that govern data communication"},
  {"front": "What does TCP stand for?", "back": "Transmission Control Protocol"},
  {"front": "What does UDP stand for?", "back": "User Datagram Protocol"},
  {"front": "What does IP stand for?", "back": "Internet Protocol"},
  {"front": "What does HTTP stand for?", "back": "Hypertext Transfer Protocol"},
  {"front": "What does HTTPS stand for?", "back": "Hypertext Transfer Protocol Secure"},
  {"front": "What does FTP stand for?", "back": "File Transfer Protocol"},
  {"front": "What does SMTP stand for?", "back": "Simple Mail Transfer Protocol"},
  {"front": "What does DNS stand for?", "back": "Domain Name System"},
  {"front": "What is a MAC address?", "back": "A 48-bit physical address burned into a NIC"},
  {"front": "What is an IP address?", "back": "A 32-bit logical address used for network identification"},
  {"front": "How many bits are in an IPv4 address?", "back": "32 bits"},
  {"front": "How many bits are in an IPv6 address?", "back": "128 bits"},
  {"front": "What is a subnet mask?", "back": "Used to divide an IP address into network and host portions"},
  {"front": "What is the default subnet mask for a Class C network?", "back": "255.255.255.0"},
  {"front": "What is the default subnet mask for a Class B network?", "back": "255.255.0.0"},
  {"front": "What is the default subnet mask for a Class A network?", "back": "255.0.0.0"},
  {"front": "What is a socket?", "back": "The combination of an IP address and a port number"},
  {"front": "What is a port number used for?", "back": "Identifies a specific process or application on a host"},
  {"front": "What is port number 21 used for?", "back": "FTP (File Transfer Protocol)"},
  {"front": "What is port number 22 used for?", "back": "SSH (Secure Shell)"},
  {"front": "What is port number 25 used for?", "back": "SMTP (Simple Mail Transfer Protocol)"},
  {"front": "What is port number 53 used for?", "back": "DNS (Domain Name System)"},
  {"front": "What is port number 80 used for?", "back": "HTTP (Hypertext Transfer Protocol)"},
  {"front": "What is port number 443 used for?", "back": "HTTPS (Hypertext Transfer Protocol Secure)"},
  {"front": "Which protocol is connection-oriented?", "back": "TCP"},
  {"front": "Which protocol is connectionless?", "back": "UDP"},
  {"front": "What is the three-way handshake?", "back": "The process of establishing a TCP connection (SYN, SYN-ACK, ACK)"},
  {"front": "What is a VPN?", "back": "Virtual Private Network"},
  {"front": "What is encryption?", "back": "Process of converting data into an unreadable format"},
  {"front": "What is decryption?", "back": "Process of converting encrypted data back to its original form"},
  {"front": "What does HTTPS use for encryption?", "back": "TLS (Transport Layer Security)"},
  {"front": "What is TLS?", "back": "Transport Layer Security"},
  {"front": "What is the difference between symmetric and asymmetric encryption?", "back": "Symmetric uses one key; asymmetric uses a public/private key pair"},
  {"front": "What is a firewall?", "back": "A system that controls network traffic based on security rules"},
  {"front": "What is a router?", "back": "A device that routes packets between different networks"},
  {"front": "What is a switch?", "back": "A device that forwards frames within a LAN using MAC addresses"},
  {"front": "What is a hub?", "back": "A multiport repeater that broadcasts data to all ports"},
  {"front": "What is a bridge?", "back": "Connects and filters traffic between two LAN segments"},
  {"front": "What is a gateway?", "back": "Connects two networks with different protocols"},
  {"front": "What is a NIC?", "back": "Network Interface Card"},
  {"front": "What is ARP used for?", "back": "Resolving an IPv4 address to a MAC address"},
  {"front": "What is RARP used for?", "back": "Resolving a MAC address to an IP address"},
  {"front": "What is a datagram?", "back": "A self-contained, independent unit of data sent over a network"},
  {"front": "What is a packet?", "back": "A unit of data transmitted over a network at the network layer"},
  {"front": "What is a frame?", "back": "A unit of data transmitted at the data link layer"},
  {"front": "What does PAN stand for?", "back": "Personal Area Network"},
  {"front": "What does LAN stand for?", "back": "Local Area Network"},
  {"front": "What does MAN stand for?", "back": "Metropolitan Area Network"},
  {"front": "What does WAN stand for?", "back": "Wide Area Network"},
  {"front": "What is the name for the topology where all devices connect to a central device?", "back": "Star topology"},
  {"front": "What is the topology where all devices are connected in a single line?", "back": "Bus topology"},
  {"front": "What is the topology where devices form a circular path?", "back": "Ring topology"},
  {"front": "What is the topology where devices are connected in a random manner?", "back": "Mesh topology"},
  {"front": "What type of transmission medium uses glass fibers and light pulses?", "back": "Fiber optic cable"},
  {"front": "What is UTP cable?", "back": "Unshielded Twisted Pair cable"},
  {"front": "What is STP cable?", "back": "Shielded Twisted Pair cable"},
  {"front": "What connector is commonly used with UTP cables?", "back": "RJ-45 connector"},
  {"front": "What is multiplexing?", "back": "Combining multiple signals into one signal for transmission"},
  {"front": "What is demultiplexing?", "back": "Separating a combined signal back into individual signals"},
  {"front": "What is circuit switching?", "back": "A dedicated path is established before data transfer begins"},
  {"front": "What is packet switching?", "back": "Data is broken into packets and sent independently"},
  {"front": "What is message switching?", "back": "Store-and-forward technology for transmitting messages"},
  {"front": "What is simplex communication?", "back": "Data transmission in one direction only"},
  {"front": "What is half-duplex communication?", "back": "Data transmission in both directions, but one at a time"},
  {"front": "What is full-duplex communication?", "back": "Data transmission in both directions simultaneously"},
  {"front": "What is CSMA/CD?", "back": "Carrier Sense Multiple Access with Collision Detection"},
  {"front": "What is CSMA/CA?", "back": "Carrier Sense Multiple Access with Collision Avoidance"},
  {"front": "What is NAT?", "back": "Network Address Translation"},
  {"front": "What is PAT?", "back": "Port Address Translation"},
  {"front": "What is a private IP address range from Class A?", "back": "10.0.0.0/8"},
  {"front": "What is a private IP address range from Class B?", "back": "172.16.0.0/12"},
  {"front": "What is a private IP address range from Class C?", "back": "192.168.0.0/16"},
  {"front": "What is Classful addressing?", "back": "IP addressing divided into classes A, B, C, D, and E"},
  {"front": "What is CIDR?", "back": "Classless Inter-Domain Routing"},
  {"front": "What is VLSM?", "back": "Variable Length Subnet Mask"},
  {"front": "What is subnetting?", "back": "Dividing a network into smaller subnetworks"},
  {"front": "What is supernetting?", "back": "Combining multiple networks into one larger network"},
  {"front": "What is the range for Class A IP addresses?", "back": "1.0.0.0 to 127.255.255.255"},
  {"front": "What is the range for Class B IP addresses?", "back": "128.0.0.0 to 191.255.255.255"},
  {"front": "What is the range for Class C IP addresses?", "back": "192.0.0.0 to 223.255.255.255"},
  {"front": "What is ICMP used for?", "back": "Error reporting and diagnostic functions"},
  {"front": "What is IGMP used for?", "back": "Managing multicast group memberships"},
  {"front": "What is a CRC?", "back": "Cyclic Redundancy Check"},
  {"front": "What is a checksum?", "back": "Error detection method based on addition"},
  {"front": "What is a parity bit?", "back": "Redundant bit used for error detection"},
  {"front": "What is attenuation?", "back": "Loss of signal strength over distance"},
  {"front": "What is jitter?", "back": "Variation in packet arrival time"},
  {"front": "What is a unicast address?", "back": "Address for a single destination"},
  {"front": "What is a multicast address?", "back": "Address for a group of destinations"},
  {"front": "What is a broadcast address?", "back": "Address for all destinations on a network"},
  {"front": "What does NOS stand for in networking?", "back": "Network Operating System"}
];

const fdsCards = [
  {"front": "What is the difference between data and information?", "back": "Data is raw facts; information is processed data with meaning."},
  {"front": "What is a Database Management System (DBMS)?", "back": "Software that facilitates creation, manipulation, and maintenance of databases."},
  {"front": "What does ACID stand for in database systems?", "back": "Atomicity, Consistency, Isolation, Durability."},
  {"front": "Which ACID property ensures 'all or nothing' execution?", "back": "Atomicity."},
  {"front": "Which ACID property ensures data changes are permanent after commit?", "back": "Durability."},
  {"front": "What type of database stores data in tables with rows and columns?", "back": "Relational database."},
  {"front": "What is data redundancy?", "back": "Storing the same data in multiple places."},
  {"front": "What is metadata?", "back": "Data about data."},
  {"front": "What is a schema in a database?", "back": "The logical structure/description of the database."},
  {"front": "What are the three levels of the ANSI-SPARC architecture?", "back": "External, Conceptual, and Internal."},
  {"front": "Which schema describes the physical storage of data?", "back": "Internal schema."},
  {"front": "Which schema describes the structure of the whole database for users?", "back": "Conceptual schema."},
  {"front": "What is a user view in a database?", "back": "An external schema describing part of the database for a user group."},
  {"front": "What is a data model?", "back": "A set of concepts/tools for describing database structure."},
  {"front": "What is the Entity-Relationship (ER) model?", "back": "A high-level conceptual data model using entities, attributes, and relationships."},
  {"front": "What is an entity in an ER diagram?", "back": "A real-world object with independent existence."},
  {"front": "What is an attribute in an ER diagram?", "back": "A property that describes an entity."},
  {"front": "What is a relationship in an ER diagram?", "back": "An association among two or more entities."},
  {"front": "What is a weak entity?", "back": "An entity that cannot be identified by its own attributes."},
  {"front": "What is an identifying relationship?", "back": "The relationship that links a weak entity to its owner entity."},
  {"front": "What is a composite attribute?", "back": "An attribute that can be divided into smaller sub-parts."},
  {"front": "What is a multivalued attribute?", "back": "An attribute that can have more than one value."},
  {"front": "What is a derived attribute?", "back": "An attribute whose value is derived from other attributes."},
  {"front": "What is the degree of a relationship?", "back": "The number of entity types participating in it."},
  {"front": "What is a unary relationship?", "back": "A relationship involving one entity type."},
  {"front": "What is a binary relationship?", "back": "A relationship involving two entity types."},
  {"front": "What is cardinality ratio in a relationship?", "back": "The maximum number of relationship instances an entity can participate in."},
  {"front": "What is total participation in a relationship?", "back": "Every entity in the entity set occurs in at least one relationship instance."},
  {"front": "What is a superclass in EER modeling?", "back": "A higher-level entity type that contains distinct subgroups."},
  {"front": "What is a subclass in EER modeling?", "back": "A lower-level entity type that is a member of a superclass."},
  {"front": "What is inheritance in EER modeling?", "back": "Subclass inherits all properties of its superclass."},
  {"front": "What is specialization in EER modeling?", "back": "Defining a set of subclasses of an entity type."},
  {"front": "What is generalization in EER modeling?", "back": "Deriving a common superclass from multiple entity types."},
  {"front": "What is a category/union type in EER modeling?", "back": "A subclass representing a subset of the union of multiple entity types."},
  {"front": "What is a relation in the relational data model?", "back": "A two-dimensional table used to store data."},
  {"front": "What is a tuple in the relational model?", "back": "A row in a relation."},
  {"front": "What is an attribute in the relational model?", "back": "A column in a relation."},
  {"front": "What is a domain in the relational model?", "back": "The set of allowed values for an attribute."},
  {"front": "What is the degree of a relation?", "back": "The number of attributes in the relation schema."},
  {"front": "What is the cardinality of a relation?", "back": "The number of tuples in the relation."},
  {"front": "What is a primary key?", "back": "A unique identifier for a tuple in a relation."},
  {"front": "What is a candidate key?", "back": "A minimal superkey that can uniquely identify each tuple."},
  {"front": "What is a foreign key?", "back": "An attribute that refers to the primary key of another relation."},
  {"front": "What is the entity integrity constraint?", "back": "Primary key values cannot be NULL."},
  {"front": "What is the referential integrity constraint?", "back": "Foreign key values must match an existing primary key or be NULL."},
  {"front": "What is a functional dependency?", "back": "A constraint where attribute X uniquely determines attribute Y."},
  {"front": "What is the notation for 'X determines Y'?", "back": "X → Y."},
  {"front": "What is a trivial functional dependency?", "back": "Dependent attribute is a subset of determinant attributes."},
  {"front": "What is a non-trivial functional dependency?", "back": "Dependent attribute is not a subset of determinant attributes."},
  {"front": "What is partial dependency?", "back": "A non-prime attribute dependent on part of a candidate key."},
  {"front": "What is transitive dependency?", "back": "A → B and B → C implies A → C."},
  {"front": "What is full functional dependency?", "back": "An attribute is determined by the whole candidate key, not just part of it."},
  {"front": "What is data normalization?", "back": "The process of organizing data to reduce redundancy and improve integrity."},
  {"front": "What is the First Normal Form (1NF)?", "back": "Relation contains only atomic attributes."},
  {"front": "What is the Second Normal Form (2NF)?", "back": "Relation in 1NF with no partial dependencies."},
  {"front": "What is the Third Normal Form (3NF)?", "back": "Relation in 2NF with no transitive dependencies."},
  {"front": "What is an insertion anomaly?", "back": "Inability to insert a record due to missing primary key."},
  {"front": "What is a deletion anomaly?", "back": "Deleting a record results in losing other unrelated data."},
  {"front": "What is an update anomaly?", "back": "Inconsistent data due to redundant updates."},
  {"front": "What is an index in a database?", "back": "A data structure that improves data retrieval speed."},
  {"front": "What is a dense index?", "back": "An index entry for every search key value."},
  {"front": "What is a sparse index?", "back": "An index entry for every block."},
  {"front": "What is a heap file?", "back": "An unordered file where records are placed in no particular order."},
  {"front": "What is a sorted file?", "back": "A file where records are ordered by a specific field."},
  {"front": "What is hashing in file organization?", "back": "Using a hash function to determine record placement."},
  {"front": "What is a relational algebra?", "back": "A procedural query language using operations on relations."},
  {"front": "What is the SELECT operation in relational algebra?", "back": "σ (sigma) selects tuples satisfying a condition."},
  {"front": "What is the PROJECT operation in relational algebra?", "back": "π (pi) selects specific columns from a relation."},
  {"front": "What is the RENAME operation in relational algebra?", "back": "ρ (rho) renames relation or column names."},
  {"front": "What is the CARTESIAN PRODUCT operation?", "back": "Combines two relations by pairing each tuple from one with all tuples of the other."},
  {"front": "What is the JOIN operation in relational algebra?", "back": "Combines tuples from two relations based on a join condition."},
  {"front": "What is a Natural Join?", "back": "A join that combines two relations based on common attributes."},
  {"front": "What is a Theta Join?", "back": "A join based on a general comparison condition."},
  {"front": "What is an Equijoin?", "back": "A theta join using only the equality operator."},
  {"front": "What is a Left Outer Join?", "back": "Includes all tuples from the left relation, even if no match on the right."},
  {"front": "What is a Right Outer Join?", "back": "Includes all tuples from the right relation, even if no match on the left."},
  {"front": "What is a Full Outer Join?", "back": "Includes all tuples from both relations."},
  {"front": "What is relational calculus?", "back": "A non-procedural query language."},
  {"front": "What is tuple relational calculus?", "back": "Variables range over tuples."},
  {"front": "What is domain relational calculus?", "back": "Variables range over attribute domains."},
  {"front": "What is SQL?", "back": "Structured Query Language for relational databases."},
  {"front": "What is DDL?", "back": "Data Definition Language."},
  {"front": "What is DML?", "back": "Data Manipulation Language."},
  {"front": "What is DCL?", "back": "Data Control Language."},
  {"front": "What is TCL?", "back": "Transaction Control Language."},
  {"front": "Which SQL command is used to retrieve data?", "back": "SELECT."},
  {"front": "Which SQL command is used to insert new data?", "back": "INSERT."},
  {"front": "Which SQL command is used to modify existing data?", "back": "UPDATE."},
  {"front": "Which SQL command is used to delete data?", "back": "DELETE."},
  {"front": "Which SQL command is used to create a new table?", "back": "CREATE."},
  {"front": "Which SQL command is used to remove a table definition?", "back": "DROP."},
  {"front": "Which SQL command is used to modify a table structure?", "back": "ALTER."},
  {"front": "What is the '%' wildcard used for in SQL?", "back": "Represents zero or more characters."},
  {"front": "What is the '_' wildcard used for in SQL?", "back": "Represents a single character."},
  {"front": "What is a view in SQL?", "back": "A virtual table based on the result of a SELECT query."},
  {"front": "What is a stored procedure?", "back": "A pre-compiled group of SQL statements stored on the database server."},
  {"front": "What is a trigger in SQL?", "back": "A stored procedure automatically executed in response to an event."},
  {"front": "What does GRANT do in SQL?", "back": "Gives user access privileges to a database."},
  {"front": "What does REVOKE do in SQL?", "back": "Takes back permissions from a user."},
  {"front": "What is a transaction in SQL?", "back": "A group of operations that must be executed as a unit."},
  {"front": "What does COMMIT do in SQL?", "back": "Saves all changes made during the current transaction."},
  {"front": "What does ROLLBACK do in SQL?", "back": "Undoes all changes made during the current transaction."}
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
    console.log('🚀 Starting Flashcards Seeder for CMTS, DCCN, and FDS...');

    // 1. Computer Maintenance & Technical Support (CMTS301)
    await seedDeck(
      'CMTS301',
      'Computer Maintenance',
      'CMTS301: Computer Maintenance and Technical Support - Complete Flashcards (103 Questions)',
      cmtsCards
    );

    // 2. Data Communications & Computer Networks (DCCN312)
    await seedDeck(
      'DCCN312',
      'Data Communications',
      'DCCN312: Data Communications and Computer Networks - Complete Flashcards (104 Questions)',
      dccnCards
    );

    // 3. Fundamentals of Database Systems (FDS307)
    await seedDeck(
      'FDS307',
      'Fundamentals of Database',
      'FDS307: Fundamentals of Database Systems - Complete Flashcards (102 Questions)',
      fdsCards
    );

    console.log('🏁 All 3 requested decks successfully seeded!');
  } catch (err) {
    console.error('❌ Error during seeding:', err);
  } finally {
    process.exit(0);
  }
}

runSeed();
