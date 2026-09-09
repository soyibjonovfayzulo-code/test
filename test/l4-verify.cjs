/* L4 checks verification (temp) */
global.window = {};
require('./lessons-data.js');
const l4 = window.CoursesAPI.getCourse('html').lessons[3];
const good = {
  l4ex1: '<a href="https://google.com">Saytga kirish</a>',
  l4ex2: '<a href="https://example.com" target="_blank">Yangi tabda ochish</a>',
  l4ex3: '<a href="#contact">Kontaktga o\'tish</a>\n\n<section id="contact">\n    <h2>Kontakt</h2>\n</section>',
  l4js: '<a href="#" id="testLink">Bos</a>\n\n<script>\nconst link = document.getElementById("testLink");\nlink.addEventListener("click", function(event) { event.preventDefault(); alert("Salom!") });\n</script>'
};
let fail = 0;
l4.content.exercises.forEach(e => {
  const pass = e.checks.every(c => new RegExp(c.re, 'i').test(good[e.id]));
  const startPasses = e.checks.every(c => new RegExp(c.re, 'i').test(e.startCode));
  console.log(e.id, pass ? 'PASS' : 'FAIL', startPasses ? '(WARN: startCode already passes!)' : '(startCode properly locked)');
  if (!pass || startPasses) fail++;
});
const badSample = l4.content.exercises.filter(e => !e.bonus).every(e => !e.checks.every(c => new RegExp(c.re, 'i').test('<p>fake</p>')));
console.log('fake code rejected:', badSample);
process.exit(fail ? 1 : 0);
