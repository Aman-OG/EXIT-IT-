const pool = require('./src/config/db');

async function runDeployPhase8() {
  try {
    console.log('🚀 Running Phase 8: Seed 14 Roadmap Courses...');

    const courses = [
      { title: 'Computer Maintenance and Technical Support', code: 'CMTS301', description: 'Hardware troubleshooting, system assembly, and technical support fundamentals' },
      { title: 'Object-Oriented Programming in Java', code: 'OOP302', description: 'Core OOP concepts including inheritance, polymorphism, and design patterns in Java' },
      { title: 'IT Project Management', code: 'ITPM303', description: 'Project lifecycle, Agile and Waterfall methodologies, risk management' },
      { title: 'Event-Driven Programming', code: 'EDP304', description: 'GUI development, event handling, and interactive application design' },
      { title: 'System Analysis and Design', code: 'SAD305', description: 'Requirements gathering, system modeling, UML diagrams, and design methodologies' },
      { title: 'Advanced Programming', code: 'AP306', description: 'Advanced data structures, algorithms, and software design principles' },
      { title: 'Fundamentals of Database Systems', code: 'FDS307', description: 'Relational databases, SQL, normalization, and ER modeling' },
      { title: 'Advanced Database Systems', code: 'ADS308', description: 'Query optimization, transactions, distributed databases, and NoSQL' },
      { title: 'Internet Programming I', code: 'IP1309', description: 'HTML, CSS, JavaScript fundamentals, and client-side web development' },
      { title: 'Internet Programming II', code: 'IP2310', description: 'Server-side development, APIs, frameworks, and full-stack integration' },
      { title: 'Mobile Application Development', code: 'MAD311', description: 'Native and cross-platform mobile app development for Android and iOS' },
      { title: 'Data Communications and Computer Networks', code: 'DCCN312', description: 'Network protocols, OSI model, TCP/IP, and data transmission fundamentals' },
      { title: 'System and Network Administration', code: 'SNA313', description: 'Server management, directory services, user administration, and security' },
      { title: 'Network Devices and Configuration', code: 'NDC314', description: 'Router and switch configuration, VLANs, subnetting, and network design' },
    ];

    for (const course of courses) {
      await pool.query(
        `INSERT INTO courses (title, code, description) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (code) DO NOTHING`,
        [course.title, course.code, course.description]
      );
      console.log(`  ✅ Seeded: ${course.title}`);
    }

    console.log('\n🎉 Phase 8: All 14 courses seeded successfully!');
    process.exit(0);
  } catch (e) {
    console.error('❌ Phase 8 Migration failed:', e);
    process.exit(1);
  }
}

runDeployPhase8();
