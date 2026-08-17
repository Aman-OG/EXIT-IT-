require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./src/config/db');

const questionsData = [
  {
    "id": 1,
    "question": "Which of the following is a collection of computers on a LAN that share common resources and responsibilities, where each computer is treated as an equal or peer?",
    "options": [
      "Domain",
      "Workgroup",
      "Active Directory",
      "Forest"
    ],
    "correctAnswer": 1,
    "explanation": "A workgroup is a collection of computers on a LAN that share common resources and responsibilities in a peer-to-peer networking model, where each computer is both a client and a server."
  },
  {
    "id": 2,
    "question": "What is the primary responsibility of a Domain Controller in a Windows Server domain?",
    "options": [
      "File sharing",
      "Print services",
      "User authentication and validation",
      "DHCP services"
    ],
    "correctAnswer": 2,
    "explanation": "The primary responsibility of a Domain Controller is to authenticate and validate user access on the network by checking usernames, passwords, and other credentials to either allow or deny access."
  },
  {
    "id": 3,
    "question": "Which of the following is a limitation of using a Domain Controller?",
    "options": [
      "Centralized user management",
      "Enable resource sharing",
      "Provide encryption",
      "Network dependency on Domain Controller uptime"
    ],
    "correctAnswer": 3,
    "explanation": "Network dependency on Domain Controller uptime is a limitation because if the Domain Controller goes down, authentication and access control may be affected. The other options are benefits of using a Domain Controller."
  },
  {
    "id": 4,
    "question": "In Active Directory, what is a collection of domains grouped together hierarchically?",
    "options": [
      "Domain",
      "Tree",
      "Forest",
      "Organizational Unit"
    ],
    "correctAnswer": 1,
    "explanation": "A Tree in Active Directory is a collection of domains grouped together hierarchically, sharing a contiguous namespace and transitive trusts."
  },
  {
    "id": 5,
    "question": "What type of trust relationship in Active Directory connects domains from different trees?",
    "options": [
      "Two-way transitive trust",
      "Explicit one-way trust",
      "Shortcut trust",
      "Realm trust"
    ],
    "correctAnswer": 1,
    "explanation": "Explicit one-way trust is used to connect domains from different trees, where one domain trusts users in another domain, but not necessarily vice versa."
  },
  {
    "id": 6,
    "question": "What does the DNS namespace primarily provide?",
    "options": [
      "IP address assignment",
      "Hostname to IP address resolution",
      "File sharing services",
      "Email routing"
    ],
    "correctAnswer": 1,
    "explanation": "DNS provides hostname to IP address lookup services, mapping human-readable domain names like www.example.com to machine-readable IP addresses."
  },
  {
    "id": 7,
    "question": "Which of the following is a top-level domain (TLD) for educational institutions?",
    "options": [
      ".com",
      ".org",
      ".edu",
      ".net"
    ],
    "correctAnswer": 2,
    "explanation": ".edu is the top-level domain used for educational institutions such as universities and colleges in the United States."
  },
  {
    "id": 8,
    "question": "What is the role of a Recursive DNS server?",
    "options": [
      "It only returns referrals",
      "It does all the work to resolve a query",
      "It caches DNS records",
      "It stores original DNS data"
    ],
    "correctAnswer": 1,
    "explanation": "A Recursive DNS server does all the work to resolve a query by querying other DNS servers and returning the final answer to the client."
  },
  {
    "id": 9,
    "question": "Which protocol is used by DHCP to assign IP addresses automatically to clients?",
    "options": [
      "TCP",
      "UDP",
      "HTTP",
      "FTP"
    ],
    "correctAnswer": 1,
    "explanation": "DHCP uses UDP (User Datagram Protocol) as its transport protocol, listening on port 67 for DHCP servers and port 68 for DHCP clients."
  },
  {
    "id": 10,
    "question": "What is the correct order of DHCP message exchange between client and server?",
    "options": [
      "Discover, Request, Offer, Acknowledgement",
      "Discover, Offer, Request, Acknowledgement",
      "Request, Discover, Offer, Acknowledgement",
      "Offer, Discover, Request, Acknowledgement"
    ],
    "correctAnswer": 1,
    "explanation": "The correct DHCP message order is: Discover (client finds server), Offer (server offers IP), Request (client requests offered IP), and Acknowledgement (server acknowledges and provides IP)."
  },
  {
    "id": 11,
    "question": "On which TCP port does HTTP operate?",
    "options": [
      "21",
      "25",
      "80",
      "443"
    ],
    "correctAnswer": 2,
    "explanation": "HTTP (HyperText Transfer Protocol) operates on port 80 by default. HTTPS uses port 443, FTP uses port 21, and SMTP uses port 25."
  },
  {
    "id": 12,
    "question": "Which of the following is an asynchronous communication service that uses SMTP for sending messages?",
    "options": [
      "HTTP",
      "FTP",
      "Email",
      "Telnet"
    ],
    "correctAnswer": 2,
    "explanation": "Email is an asynchronous communication service where messages can be sent and received at different times. SMTP (Simple Mail Transfer Protocol) is used for sending email messages."
  },
  {
    "id": 13,
    "question": "What does FTP stand for?",
    "options": [
      "File Transfer Protocol",
      "Fast Transfer Protocol",
      "File Transmission Protocol",
      "Full Transfer Protocol"
    ],
    "correctAnswer": 0,
    "explanation": "FTP stands for File Transfer Protocol, used for transferring files between a client and server over a network."
  },
  {
    "id": 14,
    "question": "Which component of the Linux file system contains essential user binaries such as ls and cp commands?",
    "options": [
      "/sbin",
      "/etc",
      "/bin",
      "/var"
    ],
    "correctAnswer": 2,
    "explanation": "/bin contains essential user binaries (commands) that are available in single-user mode, such as ls, cp, mv, and other basic system commands."
  },
  {
    "id": 15,
    "question": "In Linux, which permission type allows a user to list the contents of a directory?",
    "options": [
      "Read (r)",
      "Write (w)",
      "Execute (x)",
      "No permission (-)"
    ],
    "correctAnswer": 0,
    "explanation": "Read (r) permission on a directory allows a user to list the contents of that directory. Execute permission allows entering the directory, and write permission allows creating/deleting files."
  },
  {
    "id": 16,
    "question": "What is the octal permission value for read, write, and execute (rwx) for a file owner in Linux?",
    "options": [
      "4",
      "5",
      "6",
      "7"
    ],
    "correctAnswer": 3,
    "explanation": "Octal permission 7 represents read (4) + write (2) + execute (1) = 7, giving full read, write, and execute permissions."
  },
  {
    "id": 17,
    "question": "Which command is used to change file permissions in Linux?",
    "options": [
      "chown",
      "chmod",
      "chgrp",
      "umask"
    ],
    "correctAnswer": 1,
    "explanation": "chmod (change mode) is the command used to change file and directory permissions in Linux by specifying user, group, and other permissions."
  },
  {
    "id": 18,
    "question": "What command is used to display the full path of the current working directory in Linux?",
    "options": [
      "cd",
      "ls",
      "pwd",
      "mkdir"
    ],
    "correctAnswer": 2,
    "explanation": "pwd (print working directory) displays the absolute path of the current working directory in the file system."
  },
  {
    "id": 19,
    "question": "Which Linux command is used to copy files from one location to another?",
    "options": [
      "mv",
      "cp",
      "rm",
      "mkdir"
    ],
    "correctAnswer": 1,
    "explanation": "cp (copy) is used to copy files or directories from one location to another. mv is for moving/renaming, rm is for removing, and mkdir is for creating directories."
  },
  {
    "id": 20,
    "question": "Which command is used to display currently logged in users in Linux?",
    "options": [
      "who",
      "w",
      "users",
      "All of the above"
    ],
    "correctAnswer": 3,
    "explanation": "All commands display logged-in users: who (user details), w (users and processes), and users (simple list of usernames)."
  },
  {
    "id": 21,
    "question": "Which Linux command is used to test network connectivity to a remote host?",
    "options": [
      "traceroute",
      "ping",
      "nslookup",
      "netstat"
    ],
    "correctAnswer": 1,
    "explanation": "ping (Packet INternet Groper) is used to test network connectivity by sending ICMP echo requests to a remote host and waiting for responses."
  },
  {
    "id": 22,
    "question": "What command is used to display network connections, routing tables, and network interface statistics in Linux?",
    "options": [
      "ifconfig",
      "netstat",
      "tcpdump",
      "nslookup"
    ],
    "correctAnswer": 1,
    "explanation": "netstat (network statistics) displays network connections, routing tables, and network interface statistics. ifconfig configures interfaces, tcpdump captures traffic, and nslookup queries DNS."
  },
  {
    "id": 23,
    "question": "What is the purpose of the 'route' command in Linux?",
    "options": [
      "To configure network interfaces",
      "To display and modify the routing table",
      "To resolve hostnames",
      "To capture network packets"
    ],
    "correctAnswer": 1,
    "explanation": "The route command is used to display and modify the system's network routing table, which determines where network packets are forwarded."
  },
  {
    "id": 24,
    "question": "Which command is used to create a new user account in Linux?",
    "options": [
      "useradd",
      "usermod",
      "userdel",
      "groupadd"
    ],
    "correctAnswer": 0,
    "explanation": "useradd is the command used to create new user accounts in Linux. usermod modifies existing users, userdel removes users, and groupadd creates groups."
  },
  {
    "id": 25,
    "question": "What is the default file system for most modern Linux distributions?",
    "options": [
      "XFS",
      "btrfs",
      "ext4",
      "NTFS"
    ],
    "correctAnswer": 2,
    "explanation": "ext4 (Fourth Extended File System) is the default file system for most modern Linux distributions, known for its performance, stability, and features."
  },
  {
    "id": 26,
    "question": "Which command is used to mount a file system in Linux?",
    "options": [
      "mount",
      "umount",
      "mkfs",
      "fdisk"
    ],
    "correctAnswer": 0,
    "explanation": "mount is the command used to attach a file system to a directory in the existing file system hierarchy, making it accessible."
  },
  {
    "id": 27,
    "question": "What is Samba primarily used for?",
    "options": [
      "Hosting web pages",
      "Email services",
      "Sharing files and printers with Windows computers",
      "Database management"
    ],
    "correctAnswer": 2,
    "explanation": "Samba is free open-source software that allows Linux/Unix systems to share files and printers with Windows computers using the SMB/CIFS protocol."
  },
  {
    "id": 28,
    "question": "Which of the following is a Mail Transfer Agent (MTA) used in Linux mail servers?",
    "options": [
      "Dovecot",
      "Postfix",
      "Courier",
      "MySQL"
    ],
    "correctAnswer": 1,
    "explanation": "Postfix is a widely used Mail Transfer Agent (MTA) for handling incoming and outgoing mail. Dovecot and Courier are Mail Delivery Agents (MDAs), and MySQL is a database."
  },
  {
    "id": 29,
    "question": "Which of the following is NOT a component of a strong password?",
    "options": [
      "Letters",
      "Numbers",
      "Personal information like birthday",
      "Punctuation and symbols"
    ],
    "correctAnswer": 2,
    "explanation": "Personal information like birthdays should not be used in passwords. Strong passwords should be long and contain letters, numbers, punctuation, and symbols."
  },
  {
    "id": 30,
    "question": "What file system security advantage does NTFS provide over FAT?",
    "options": [
      "File encryption support",
      "Access Control Lists",
      "Granular permission structure",
      "All of the above"
    ],
    "correctAnswer": 3,
    "explanation": "NTFS offers all of these security advantages: Access Control Lists, granular permissions, server authentication, and support for Encrypted File System (EFS)."
  },
  {
    "id": 31,
    "question": "Which Windows security feature is used to encrypt individual files and directories?",
    "options": [
      "BitLocker",
      "Encrypted File System (EFS)",
      "Windows Defender",
      "Access Control Lists"
    ],
    "correctAnswer": 1,
    "explanation": "EFS (Encrypted File System) is a Windows feature that allows individual files and directories to be encrypted to protect sensitive data."
  },
  {
    "id": 32,
    "question": "What type of attack uses psychological manipulation to trick users into revealing sensitive information?",
    "options": [
      "Phishing",
      "Social Engineering",
      "Malware",
      "Man-in-the-Middle"
    ],
    "correctAnswer": 1,
    "explanation": "Social Engineering uses psychological manipulation to trick people into divulging confidential information or performing actions that compromise security."
  },
  {
    "id": 33,
    "question": "In Linux, where are hashed passwords typically stored?",
    "options": [
      "/etc/passwd",
      "/etc/shadow",
      "/etc/group",
      "/etc/login"
    ],
    "correctAnswer": 1,
    "explanation": "/etc/shadow stores hashed passwords and password expiration information in a secure, readable-only file format. /etc/passwd is world-readable and only stores user account information."
  },
  {
    "id": 34,
    "question": "What is the primary purpose of Pluggable Authentication Modules (PAMs) in Linux?",
    "options": [
      "To manage file permissions",
      "To reconfigure authentication techniques at runtime",
      "To monitor network traffic",
      "To compress files"
    ],
    "correctAnswer": 1,
    "explanation": "PAMs allow the system to be reconfigured at runtime to include enhanced authentication techniques, supporting methods like smart cards, Kerberos, and voice authentication."
  },
  {
    "id": 35,
    "question": "What does MAC stand for in the context of Linux security?",
    "options": [
      "Media Access Control",
      "Mandatory Access Control",
      "Memory Access Control",
      "Multi-Level Access Control"
    ],
    "correctAnswer": 1,
    "explanation": "MAC stands for Mandatory Access Control, a more sophisticated form of permissions handling that limits what permissions each program is granted (e.g., SELinux, AppArmor)."
  },
  {
    "id": 36,
    "question": "Which Linux security module provides mandatory access control (MAC) and adds a crucial security layer beyond traditional file permissions?",
    "options": [
      "IPtables",
      "SELinux",
      "Firewalld",
      "AppArmor"
    ],
    "correctAnswer": 1,
    "explanation": "SELinux (Security-Enhanced Linux) is a Linux kernel security module that provides mandatory access control (MAC), adding a crucial security layer beyond traditional file permissions."
  },
  {
    "id": 37,
    "question": "What is the purpose of the loopback device in Linux cryptography?",
    "options": [
      "To connect network cables",
      "To encrypt and decrypt data between processes and the file system",
      "To monitor system resources",
      "To run virtual machines"
    ],
    "correctAnswer": 1,
    "explanation": "The loopback device acts as a layer between the virtual file system and the existing file system, and can be used to encrypt and decrypt data transferred between processes and the underlying file system."
  },
  {
    "id": 38,
    "question": "What is the process of tracking and optimizing the use of resources within a system called?",
    "options": [
      "Resource Allocation",
      "Resource Monitoring and Management (RMM)",
      "Resource Planning",
      "Capacity Planning"
    ],
    "correctAnswer": 1,
    "explanation": "Resource Monitoring and Management (RMM) is the process of tracking and optimizing the use of resources such as CPU, memory, disk space, and network bandwidth to ensure efficient and effective operation."
  },
  {
    "id": 39,
    "question": "Which metric shows the percentage of time that a disk is actively serving requests in Windows Resource Monitor?",
    "options": [
      "Disk Queue Length",
      "Active Time (%)",
      "Available Space (MB)",
      "Response Time (ms)"
    ],
    "correctAnswer": 1,
    "explanation": "Active Time (%) shows the percentage of time that the disk is not idle and is actively serving requests. High active time may indicate a performance bottleneck."
  },
  {
    "id": 40,
    "question": "In Linux, which command-line tool displays real-time information about system processes, including CPU and memory usage?",
    "options": [
      "top",
      "iostat",
      "sar",
      "nmon"
    ],
    "correctAnswer": 0,
    "explanation": "top is a command-line tool that displays real-time information about system processes, including CPU usage, memory usage, and process states."
  },
  {
    "id": 41,
    "question": "Which open-source system monitoring tool provides real-time monitoring and alerting with visualization of system performance data?",
    "options": [
      "Nagios",
      "Prometheus",
      "Zabbix",
      "All of the above"
    ],
    "correctAnswer": 3,
    "explanation": "All of these tools provide system monitoring capabilities: Zabbix offers real-time monitoring and visualization, Prometheus specializes in time-series data, and Nagios monitors servers and applications."
  },
  {
    "id": 42,
    "question": "Which RAID level uses striping to spread data across multiple drives to improve performance without redundancy?",
    "options": [
      "RAID 0",
      "RAID 1",
      "RAID 5",
      "RAID 10"
    ],
    "correctAnswer": 0,
    "explanation": "RAID 0 uses striping to spread data across multiple drives, improving performance but providing no redundancy. If one drive fails, all data is lost."
  },
  {
    "id": 43,
    "question": "Which RAID level uses disk mirroring to provide fault tolerance and redundancy?",
    "options": [
      "RAID 0",
      "RAID 1",
      "RAID 5",
      "RAID 10"
    ],
    "correctAnswer": 1,
    "explanation": "RAID 1 uses disk mirroring where data is written identically to two or more drives, providing fault tolerance by maintaining duplicate copies of data."
  },
  {
    "id": 44,
    "question": "What is the minimum number of drives required for RAID 5?",
    "options": [
      "2 drives",
      "3 drives",
      "4 drives",
      "5 drives"
    ],
    "correctAnswer": 1,
    "explanation": "RAID 5 requires a minimum of 3 drives, using striping with parity to provide fault tolerance and performance."
  },
  {
    "id": 45,
    "question": "Which RAID level combines mirroring and striping to provide both performance and redundancy?",
    "options": [
      "RAID 0",
      "RAID 1",
      "RAID 5",
      "RAID 10"
    ],
    "correctAnswer": 3,
    "explanation": "RAID 10 (also known as RAID 1+0) combines mirroring and striping, providing both performance benefits (striping) and fault tolerance (mirroring), requiring at least 4 drives."
  },
  {
    "id": 46,
    "question": "What is Small Computer System Interface (SCSI) primarily used for?",
    "options": [
      "Network communication",
      "Connecting and transferring data between computers and peripheral devices",
      "Wireless connectivity",
      "Audio processing"
    ],
    "correctAnswer": 1,
    "explanation": "SCSI is a set of standards for connecting and transferring data between computers and peripheral devices such as hard drives, tape drives, and scanners, commonly used in server and storage environments."
  },
  {
    "id": 47,
    "question": "What is the purpose of bandwidth in network communication?",
    "options": [
      "It determines the distance data can travel",
      "It represents the maximum amount of data transmitted per unit of time",
      "It measures the latency of data transmission",
      "It controls the security of data transfer"
    ],
    "correctAnswer": 1,
    "explanation": "Bandwidth is the maximum amount of data that can be transmitted over a network or internet connection in a given amount of time, measured in bits per second (bps), Kbps, Mbps, or Gbps."
  },
  {
    "id": 48,
    "question": "What is the difference between a dedicated and a non-dedicated file server?",
    "options": [
      "Dedicated servers are slower than non-dedicated",
      "Dedicated servers are designed specifically as file servers with unique IP",
      "Non-dedicated servers are always more secure",
      "Dedicated servers are more expensive but less reliable"
    ],
    "correctAnswer": 1,
    "explanation": "A dedicated file server is designed specifically for use as a file server with a unique IP serving only specific users, while a non-dedicated file server is for general use with multiple websites and users."
  },
  {
    "id": 49,
    "question": "Which of the following is a benefit of remote administration?",
    "options": [
      "Increased efficiency",
      "Cost savings",
      "Improved security",
      "All of the above"
    ],
    "correctAnswer": 3,
    "explanation": "Remote administration offers increased efficiency by managing systems from a central location, cost savings, and improved security through centralized management and monitoring."
  },
  {
    "id": 50,
    "question": "What does the SAGE Code of Ethics include?",
    "options": [
      "Professionalism and Personal Integrity",
      "Privacy and Communication",
      "System Integrity and Social Responsibility",
      "All of the above"
    ],
    "correctAnswer": 3,
    "explanation": "The SAGE Code of Ethics includes Professionalism, Personal Integrity, Privacy, Laws and Policies, Communication, System Integrity, Education, and Social Responsibility."
  }
];

async function seedSNAQuizzes() {
  const client = await pool.connect();
  try {
    console.log('--- Seeding System and Network Administration Quizzes ---');
    await client.query('BEGIN');

    // Find course in DB
    let courseRes = await client.query("SELECT id, title, code FROM courses WHERE code = 'SNA313' OR title ILIKE '%System and Network Administration%' OR title ILIKE '%System & Network Administration%'");
    let courseId;
    let courseTitle;

    if (courseRes.rows.length === 0) {
      const ins = await client.query(`
        INSERT INTO courses (title, code, description)
        VALUES ('System and Network Administration', 'SNA313', 'Administration of operating systems, network services, Active Directory, DNS, DHCP, Linux administration, and security.')
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

    const CHUNK_SIZE = 15; // 15 questions per quiz
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

      const existingIdx = list.findIndex(c => c.course && (c.course.toLowerCase().includes('system and network administration') || c.course.toLowerCase().includes('system & network administration') || c.course.toLowerCase().includes('system_network_admin')));
      const formattedEntry = {
        course: "System and Network Administration",
        questions: questionsData
      };

      if (existingIdx >= 0) {
        list[existingIdx] = formattedEntry;
      } else {
        list.push(formattedEntry);
      }
      parsed['quiz-exam'] = list;
      fs.writeFileSync(quizJsonPath, JSON.stringify(parsed, null, 4), 'utf-8');
      console.log(`✅ Updated course-material/quiz.json with System and Network Administration!`);
    }

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding SNA quizzes:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seedSNAQuizzes();
