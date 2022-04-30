const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

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

function addEmployeePrompt(queryResult) {
    const roles = queryResult.map((ele) => {
        return ele.title;
    });
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

function updateEmployeeRole() {
    // TODO: get employee and change role
    console.log("update employee role");
    mainMenu();
}

function addRole() {
    // TODO: create a role and add to it
    console.log("Add role");
    mainMenu();
}

function viewAllDepartments() {
    // TODO: return all departments
    console.log("view all departments");
    mainMenu();
}

function addDepartment() {
    // TODO: prompts for departments
    console.log("Add Department");
    mainMenu();
}

// options for the main menu
const mainMenuOptions = [
    "View All Employees",
    "Add Employee",
    "Update Employee Role",
    "Add Role",
    "View All Departments",
    "Add Department",
    "Quit",
];

/**
 * This will call up the main menu functions
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
                case "Add Employee":
                    addEmployeeQuery();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Quit":
                    console.info("Thank you for using EMPLOYEE DB");
                    process.exit(1);
                    break;
            }
        })
        .catch((err) => {
            if (err.isTtyError) {
                throw new Error("This shell is not supported");
            } else {
                console.error("Got error: ", err);
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
