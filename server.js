const inquirer = require("inquirer");
const mysql = require("mysql2");
// ctable isn't referenced because we an use `console.table` instead
const cTable = require("console.table");

// database connection
const db = mysql.createConnection(
    {
        host: "127.0.0.1",
        user: "root",
        password: "password",
        database: "employees_db",
    },
    console.log("creating connection to database")
);

/**
 * Simple string to greet user
 */
const greetStr = `
_____           _                       _ _   
|   __|_____ ___| |___ _ _ ___ ___ ___ _| | |_ 
|   __|     | . | | . | | | -_| -_|___| . | . |
|_____|_|_|_|  _|_|___|_  |___|___|   |___|___|
            |_|       |___|                    
`;

/**
 * Puts a list of all employees into the command line and then returns the user
 * to the main menu
 */
function viewAllEmployees() {
    console.info("Querying the database...");
    db.query(`SELECT * FROM employee`, (err, result) => {
        if (err) {
            console.error("Error in querying employees:\n", err);
        } else {
            console.table(result);
            mainMenu();
        }
    });
}

/**
 * Function is called when we are making a new employee. It queries the database
 * to fine the appropriate roles for the employee and then hands the output off
 * to a helper function to avoid more "callback hell"
 */
function addEmployeeQuery() {
    console.info("Querying the database...");

    db.query(`SELECT role.id, role.title FROM role`, (err, result) => {
        if (err) {
            console.error("Error in querying roles:\n", err);
        } else {
            addEmployeePrompt(result);
        }
    });
}

/**
 * This is a helper function that guides the user into making a new employee.
 * It will create the employee, and possibly specify a manager if needed.
 * If a manager is needed to be specified it will hand off the problem to a
 * another helper callback function
 * @param {array} rolesArray - result of query, still needs formatting
 */
function addEmployeePrompt(rolesArray) {
    // taking our results and making them appropriately formatted
    const roles = rolesArray.map((ele) => ele.title);
    inquirer
        .prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is their first name?",
            },
            {
                name: "lastName",
                type: "input",
                message: "What is their lastName?",
            },
            {
                name: "role",
                type: "list",
                choices: roles,
                message: "what is their role?",
            },
            {
                name: "manager",
                type: "confirm",
                message: "Would you like to add a manager?",
            },
        ])
        .then((ans) => {
            const { firstName, lastName, role, manager } = ans;
            console.log(
                `adding employee: ${firstName}, ${lastName}, ${role}, ${manager}`
            );
            mainMenu();
        });
}

/**
 * This will ask the user which employee they want to update and then allow them
 * to choose which info to update
 */
function updateEmployeeRole() {
    // TODO: get employee and change role
    console.log("update employee role");
    mainMenu();
}

/**
 * This will allow the user to add more roles to the database
 */
function addRole() {
    // TODO: create a role and add to it
    console.log("Add role");
    mainMenu();
}

/**
 * This will allow the user to see all the departments availible
 */
function viewAllDepartments() {
    db.query(
        `SELECT department_name AS \`Department Name\` FROM department `,
        (err, result) => {
            if (err) {
                console.error("Got an error querying departments:\n", err);
            }
            console.table(result);
            mainMenu();
        }
    );
}

/**
 * This will allow the user add a new department
 */
function addDepartment() {
    // TODO: prompts for departments
    console.log("Add Department");
    mainMenu();
}

/**
 * This will show the user all the possible roles and then send them back to
 * the menu
 */
function viewAllRoles() {
    db.query(`SELECT title, department_id, salary FROM role`, (err, result) => {
        if (err) {
            console.error("Recieved error:\n", err);
        }
        console.table(result);
        mainMenu();
    });
}

// options for the main menu
const mainMenuOptions = [
    "View All Employees",
    "View All Departments",
    "View All Roles",
    "Add Employee (WIP)",
    "Update Employee Role (WIP)",
    "Add Role (WIP)",
    "Add Department (WIP)",
    "Quit",
];

/**
 * This will call up the main menu functions. When the user responds to the
 * menu option it hands off operations to a helper function
 */
function mainMenu() {
    inquirer
        .prompt({
            type: "list",
            name: "menuChoice",
            message: "What would you like to do?",
            choices: mainMenuOptions,
        })
        .then((ans) => {
            switch (ans.menuChoice) {
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "Add Employee":
                    addEmployeeQuery();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Quit":
                    console.info("Thank you for using EMPLOYEE DB");
                    process.exit(0);
                    break;
            }
        })
        .catch((err) => {
            if (err.isTtyError) {
                throw new Error("This shell is not supported");
            } else {
                console.error("Got error: ", err);
                process.exit(1);
            }
        });
}

/**
 * Starts the whole chain
 */
function init() {
    console.log(greetStr);
    mainMenu();
}

init();
