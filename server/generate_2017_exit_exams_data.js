const fs = require('fs');
const path = require('path');

const targetPathServer = path.join(__dirname, 'src', 'data', 'information_technology_2017_exit_exams.json');
const targetPathCourse = path.join(__dirname, '..', 'course-material', 'information_technology_2017_exit_exams.json');

console.log('Validating 2017 exit exams datasets...');

if (fs.existsSync(targetPathServer)) {
  const data = JSON.parse(fs.readFileSync(targetPathServer, 'utf8'));
  console.log('Server Dataset:');
  console.log('- 2017 Tir Exit Exam:', data['2017_tir_exit_exam'] ? data['2017_tir_exit_exam'].length : 0, 'questions');
  console.log('- 2017 Sene Exit Exam:', data['2017_sene_exit_exam'] ? data['2017_sene_exit_exam'].length : 0, 'questions');
}

if (fs.existsSync(targetPathCourse)) {
  const data = JSON.parse(fs.readFileSync(targetPathCourse, 'utf8'));
  console.log('Course Material Dataset:');
  console.log('- 2017 Tir Exit Exam:', data['2017_tir_exit_exam'] ? data['2017_tir_exit_exam'].length : 0, 'questions');
  console.log('- 2017 Sene Exit Exam:', data['2017_sene_exit_exam'] ? data['2017_sene_exit_exam'].length : 0, 'questions');
}
