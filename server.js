const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

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

// TODO: do IDs ever get set? Database should handle them

function viewAllEmployees() {
    // TODO: query
    console.log("query the DB here");
    mainMenu();
}

function addEmployee() {
    // TODO: create employee and update Db
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
                type: "input", // TODO: query database to get roles
                message: "what is their role?",
            },
            {
                name: "manager",
                type: "input", // TODO: query database to get managers
                message: "Who is their manager?",
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
                    addEmployee();
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
                    console.log("Thank you for using EMPLOYEE DB");
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
