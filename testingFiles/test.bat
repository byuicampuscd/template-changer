rmdir /s /q test
node ..\cli.js test.txt test.handlebars
type test\test.html