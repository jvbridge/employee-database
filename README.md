# employee-database

A command line based employee tracker that accesses a mysql database

## Installation

This requires an installation of [mysql](https://www.mysql.com/) and
[Node.js](https://nodejs.org/en/) to function.

Download the files of the repository and extract them to their own directory.

run `npm install` in the main directory

Open mysql in the command line and source the file at `./db/schema.sql`,
optionally source `./db/seeds.sql` if you want to populate the database with
some data.

https://user-images.githubusercontent.com/6423593/166390785-5838f44c-c4aa-408b-ace8-14488fd8bc81.mp4

This project assumes that the mysql root user's password is `"password"` if you
wish to use a different password you will need to alter `./server.js` to
connect differently.

## Usage

Some assumtions:

1. There are more roles than departments
2. there are more employees than roles

Because of this when asking the user to specify an employee, we first ask them
to specify a department and then specify a role. Similarly when asking to
specify a role we ask them to specify a department first.

https://user-images.githubusercontent.com/6423593/166391752-55ac1d29-2f22-4fd6-a111-951021016eb9.mp4

| Technologies used                                                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------------------- |
| [![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)](https://git-scm.com/)         |
| [![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/) |
| [![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)   |
| [![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)    |

## Credits

Markdown badges shamelessly pinched from:
https://github.com/Ileriayo/markdown-badges

Greeting string made with the help of https://patorjk.com/software/taag

## License

This project uses the MIT License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Copyright 2022 Jonathan Bridge
