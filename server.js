const inquirer = require("inquirer");
const mysql = require("mysql2");
// ctable isn't referenced because we an use `console.table` instead
const cTable = require("console.table");

// database connection
const db = mysql.createConnection(
  {
    host: "127.0.0.1",
    user: "root",
    password: "password", // Change this to YOUR password
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
  db.query(
    `SELECT 
        CONCAT(employee.first_name, ' ', employee.last_name) AS Name,
        role.title AS Title
        FROM employee, role
        WHERE role.id = employee.role_id`,
    (err, result) => {
      if (err) {
        console.error("Error in querying employees:\n", err);
      } else {
        console.table(result);
        mainMenu();
      }
    }
  );
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
  const roleStrings = rolesArray.map((ele) => ele.title);
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
        name: "roleStr",
        type: "list",
        choices: roleStrings,
        message: "what is their role?",
      },
      {
        name: "manager",
        type: "confirm",
        message: "Would you like to add a manager?",
      },
    ])
    .then((ans) => {
      // Destructure answer object
      const { firstName, lastName, roleStr, manager } = ans;
      // getting the appropriate ID from the role chosen
      const rawRole = rolesArray.find((element) => element.title == roleStr);
      const roleId = rawRole.id;

      if (manager) {
        // if they want to add a manager we need a separate query
        addEmployeeManager(ans);
      } else {
        addEmployee(firstName, lastName, roleId);
      }
    });
}

/**
 * Adds an employee into the database, should use parsed user input
 * @param {string} firstName the first name answered by the user
 * @param {string} lastName the last name answered by the user
 * @param {number} roleId the role chosen by the user
 * @param {number} [manager] id for manager given, NULL if none given
 */
function addEmployee(firstName, lastName, roleId, manager) {
  // check if manager argument was passed
  const managerId = manager ? manager : null;

  // do our insert into the database
  db.query(
    `INSERT INTO employee (
            first_name, 
            last_name, 
            role_id, 
            manager_id
        )
        VALUES(?, ?, ?, ?);`,
    [firstName, lastName, roleId, managerId],
    (err, result) => {
      if (err) console.error("Error inserting employee:\n", err);
      mainMenu();
    }
  );
}

/**
 * This function is called when the employee wants to make a manager. We use it
 * because we need a second query to find all the other employees.
 * @param {object} ans the answers the user gave for making the new employee
 */
function addEmployeeManager(ans) {
  const { firstName, lastName, role } = ans;

  // query the database to get the managers
  db.query("", (err, result) => {});
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
 * Prompts the user to select employees by department and role
 * @param {function} cb - callback function with employee id passed in as
 * the argument
 */
function selectEmployee(cb) {}

/**
 * Prompts the user to select a department. Calls a callback function with a
 * department ID as the argument, if there are no deparments given we call it
 * with null as an argument
 * @param {function} cb callback function supplied
 */
function selectDepartment(cb) {
  // main query
  db.query("SELECT * from department", (err, results) => {
    if (err) console.error("got an error querying for department:\n", err);
    // check if we have any departments
    if (results.length == 0) {
      console.info("No departments so far");
      cb(null);
      return;
    }
    // get the names for all the departments
    const departmentStrs = results.map((dept) => dept.department_name);
    // ask the user which department based on query
    inquirer
      .prompt({
        type: "list",
        name: "departmentStr",
        message: "Which department?",
        choices: departmentStrs,
      })
      .then((ans) => {
        // take their selection and call the callback function
        const rawDepartment = results.find(
          (dept) => dept.department_name == ans.departmentStr
        );
        cb(rawDepartment.id);
      });
  });
}

/**
 * Prompts the user to select a role with the given department, calls a callback
 * function with the id of the role selected
 * @param {number} department the ID of the department we are looking for roles
 * @param {function} cb the callback function
 */
function selectRole(department, cb) {
  // query db
  db.query(
    "SELECT * FROM role WHERE department_id = ?",
    department,
    (err, results) => {
      if (err) console.error("got an error querying for roles:\n", err);
      // check if we have any roles at all
      if (results.length == 0) {
        console.info("No roles so far");
        cb(null);
        return;
      }
      // get the titles from the roles
      const roleStrs = results.map((role) => role.title);
      inquirer
        .prompt({
          type: "list",
          name: "roleStr",
          message: "Which role?",
          choices: roleStrs,
        })
        .then((ans) => {
          // get the id of their selection
          const rawRole = results.find((role) => role.title == ans.roleStr);
          cb(rawRole.id);
        });
    }
  );
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
  db.query(
    `SELECT title AS \`Title\`, (
            SELECT 
            department_name 
            FROM department 
            WHERE id = role.department_id
        ) AS Department
        , salary FROM role`,
    (err, result) => {
      if (err) {
        console.error("Recieved error:\n", err);
      }
      console.table(result);
      mainMenu();
    }
  );
}

// options for the main menu
const mainMenuOptions = [
  "Select",
  "View All Employees",
  "View All Departments",
  "View All Roles",
  "Add Employee",
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
        case "Select":
          selectDepartment((deptId) => {
            console.log("chose department ID: ", deptId);
            selectRole(deptId, (roleId) => {
              console.log("chose role ID: ", roleId);
              mainMenu();
            });
          });
          break;
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
        default:
          console.info("That option hasn't beem implemented yet");
          mainMenu();
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
