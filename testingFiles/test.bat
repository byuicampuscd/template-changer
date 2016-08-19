rmdir /s /q test
node ..\index.js test.txt test.handlebars
type test\test.html