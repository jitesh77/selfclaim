## SureServe - Hospitalization Assistance | Reimbursement Claims Assistance

#### Prerequisite

Install following softwares-

1. nodejs
2. redis
3. MySql
4. Git

#### How to execute project

1. Clone the repository `git clone https://varunon9@bitbucket.org/sureclaim/selfclaim.git`
2. Go to project `cd selfclaim`
3. Install all nodejs dependencies `npm install`
4. Move to public folder `cd public`
5. Install bower dependencies `bower install`
6. create database 'sureserve' in MySql
7. Update MySql credentials of your machine in config/config.json (Replace 'root' with your MySql user and 'hiThere!!' with your MySql password.
8. Install and start redis `sudo service redis start`. (Linux) Check online for Windows
9. Install nodemon `npm install -g nodemon`
10. Return to previous directory `cd ..`
11. Start server `nodemon`
12. Visit localhost:3000/selfclaim in browser


#### How to contribute

1. Create your own branch in repository (follow steps 2 and 3)
2. Go to project `cd selfclaim`
3. create a new branch `git checkout -b spider` here 'spider' is branch name. Choose your own. 
4. Take a pull form bitbucket so as to get latest code `git pull origin master`
5. Make changes to your branch i.e. edit files
6. After editing some files you can use `git status` to check status of your current branch
7. Add those changes `git add <filename>` or `git add .` to add all files in one go
8. Commit changes `git commit -m "implemented validation"` Provide exlanatory comment
9. Push changes to your branch `git push`
10. Go to bitbucket and create a merge request from your branch to master branch.
11. Once approved, it will be merged to master


#### Coding standards-

For Javascript development please follow below link-

https://www.w3schools.com/js/js_conventions.asp