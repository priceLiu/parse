http://about.me/alexgorbatchev


1. write website rule
2. save website info into file, format is json. 
3. send file name to MQ queue
3. download from website urls
4. save web page into server path
5. send finished page path to parse machine
6. parse web page from website rule
7. move finished file to backup path
8. save result into file or DB ?



settings
1. key="readyRoot"
2. key="parseRoot"
3. key="finishedPath"
4. key="msmqName"
5. key="result"