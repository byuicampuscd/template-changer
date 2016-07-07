# Template Changer

## Description
Through out the LMS transition process, standard HTML and CSS templating have changed.  To make updating older templates easier, this application will go through all the HTML files given and replace the head and footer with what is standard.

## Use for Reference Courses
Go into the course and download the existing Web Files folder.  This will back up the information just in case the process fails.  Create a new folder on your computer as if the course was going to receive a new template.  Make the necessary changes and copies between the old CSS file and to the new CSS file standard.  Upload the new template to the Web Files.  Do not delete the old ones just yet.

On your computer, create txt files that resemble the new HTML template standard.  Make sure that they are accurate according to the course.  It is suggested to make relative file paths in the txt files so that a copy of the course will not point to the original course once the original course is copied.

In the reference course, download the Course Files folder (or the folder that contains all the HTML files for the course *See note).  Unzip the folder and put copies of the txt files made in the step before in the downloaded unzipped Course Files folder.  At this point, go into the txt files to change the file paths to reflect their corresponding directory.

Run Template Changer in the command line.  First, cd into the downloaded Course Files folder.  Run your chosen command to replace all the headers and footers in the HTML files. Template Changer will filter through only the HTML files and create new folders titled after the txt files.

Upload the new HTML files to overwrite the old ones.  Go into the content area of the course to verify that the pages look fine and according to the new standard.  Before the old Web Files sub-directories are deleted, make sure that the template setting option is set to just the Web Files folder instead of the HTML folder.  If not changed before the next step this will cause a course error when trying to edit course files.  The template setting option can be found in the content area of the course.  Once in the content area, just click on the link "Settings" near the top right-hand corner.  A pop up will appear and go to the option that says "Change Path" under the "HTML template" section. Change it to the Web Files folder.  Once done, go ahead and delete the old sub-directories in the Web Files folder.

### NOTE
If the HTML files are not all located within the Course Files folder, follow the same process but change the file paths to their respective locations.

## Commands
Run `templateChanger` with out any paramiters to see all the ways it can be ran.

### Multiple Template Change Example
`templateChanger #article IF .splash THEN large.txt ELSE small.txt`
