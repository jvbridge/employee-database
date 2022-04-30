const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
const { listenerCount } = require("process");

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
            console.log(`Got answer: ${ans.menuChoice}`);
        })
        .catch((err) => {
            if (err.isTtyError) {
                throw new Error("This shell is not supported");
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
