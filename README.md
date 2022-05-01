# employee-database

a command line based employee tracker that accesses a mysql database

## Installation

This requires an installation of [mysql](https://www.mysql.com/) and
[Node.js](https://nodejs.org/en/) to function.

Download the files of the repository and extract them to their own directory.

run `npm install` in the main directory

Open mysql in the command line and source the file at `./db/schema.sql`,
optionally source `./db/seeds.sql` if you want to populate the database with
some data.

This project assumes that the mysql root user's password is `"password"` if you
wish to use a different password you will need to alter `./server.js` to
connect differently.

## Usage

It is entirely possible to use this product

Some assumtions:

1. There are more roles than departments
2. there are more employees than roles

Because of this when asking the user to specify an employee, we first ask them
to specify a department and then specify a role. Similarly when asking to
specify a role we ask them to specify a department first.

## Credits

Greeting string made with the help of https://patorjk.com/software/taag

## License

This project uses the MIT License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Copyright 2022 Jonathan Bridge
