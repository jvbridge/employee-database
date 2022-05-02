const inquirer = require("inquirer");
const mysql = require("mysql2");
// ctable isn't referenced because we an use `console.table` instead
const cTable = require("console.table");
const { add } = require("nodemon/lib/rules");

// max lengths for all of the different values in the sql database
const DEPARTMENT_NAME_LENGTH = 30;
const ROLE_TITLE_LENGTH = 30;
const EMPLOYEE_NAME_LENGTH = 30;
const MAX_SALARY = 1000000000.0;

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
        if (result.length === 0) console.info("No employees added yet");
        console.table(result);
        mainMenu();
      }
    }
  );
}

/**
 * Function is called when we are making a new employee. It queries the database
 * to find the appropriate roles for the employee and then hands the output off
 * to a helper function to avoid more "callback hell"
 */
function addEmployeeQuery() {
  console.info("Querying the database...");

  db.query(`SELECT role.id, role.title FROM role`, (err, result) => {
    if (err) {
      console.error("Error in querying roles:\n", err);
    } else {
      // ensure that there are roles set up before adding an employee
      if (result.length === 0) {
        console.info("We don't have any roles set up! Set up a role first!");
        mainMenu();
        return;
      }
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
      if (
        firstName.length > EMPLOYEE_NAME_LENGTH ||
        lastName.length > EMPLOYEE_NAME_LENGTH
      ) {
        console.info(
          "Names must be " + EMPLOYEE_NAME_LENGTH + " characters or less"
        );
        addEmployeePrompt();
        return;
      }

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
 * This function is called when the employee wants to designate an employee as
 * a manager for a new employee.
 */
function addEmployeeManager(ans) {
  const { firstName, lastName, role } = ans;
  console.info("Okay, lets select which employee will be their manager!");
  // helper function promts user to select the employee
  employeeSelector((manager) => {
    // selecting managers
    if (manager) {
      addEmployee(firstName, lastName, role, manager);
      return;
    }
    console.info("Looks like we couldn't find any employees to be a manager");
    mainMenu();
  });

  // TODO: find role ID bug
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
  console.info(
    "To start making a role we need to choose the department it's in"
  );

  selectDepartment((deptId) => {
    if (!deptId) {
      console.info(
        "We need to set up a department before we can add any roles"
      );
      mainMenu();
      return;
    }
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the tile for this role?",
        },
        {
          name: "salary",
          type: "number",
          message: `What is their salary? Must be less than ${MAX_SALARY}`,
        },
      ])
      .then((ans) => {
        // validate title input
        if (ans.title.length > ROLE_TITLE_LENGTH) {
          console.info(
            "Roles must have a title length of " +
              ROLE_TITLE_LENGTH +
              " or smaller"
          );
          addRole();
          return;
        }
        // validate salary input
        if (isNaN(ans.salary)) {
          console.info("Salary must be a number");
          addRole();
          return;
        }
        if (ans.salary >= MAX_SALARY) {
          console.info("Salary is too large for database");
          addRole();
          return;
        }
        if (ans.salary < 0) {
          console.info("Salary cannot be negative");
          addRole();
          return;
        }

        db.query(
          `
          INSERT INTO role (title, salary, department_id)
          VALUES (?, ?, ?)
          `,
          [ans.title, ans.salary, deptId],
          (err, response) => {
            if (err) console.error("Got an error inserting the role:\n", err);
            mainMenu();
          }
        );
      });
  });
}

/**
 * Prompts the user to select an employee by first asking about which department
 * and then their role, will then invoke a call back function with their id as
 * an argument. The id will be null if no employees are found.
 * @callback cb
 */
function employeeSelector(cb) {
  selectDepartment((deptId) => {
    if (!deptId) {
      cb(null);
      return;
    }
    selectRole(deptId, (roleId) => {
      if (!roleId) {
        cb(null);
        return;
      }
      selectEmployee(roleId, (empId) => {
        cb(empId);
      });
    });
  });
}

/**
 * Prompts the user to select employees by role. Will list all given employees
 * with that role and then ask the user to choose one. After the user chooses
 * one the callback function will be executed with that employee's id as the
 * argument. If there are none found we will execute it with null as the
 * argument
 * @param {number} role  id number of the role
 * @callback cb
 */
function selectEmployee(role, cb) {
  // get all employees of the appropriate role
  db.query("SELECT * FROM employee WHERE role_id = ?", role, (err, results) => {
    if (err) console.error("got an error querying for employees:\n", err);
    // check if there are employees
    if (results.length == 0) {
      console.info("No employees with that role so far");
      cb(null); // callback function with null as argument
      return;
    }
    // get a list of all the names of employees
    const names = results.map((employee) => {
      return employee.first_name + " " + employee.last_name;
    });

    inquirer
      .prompt({
        type: "list",
        name: "fullName",
        message: "Which employee?",
        choices: names,
      })
      .then((ans) => {
        // get the id of their selection
        const rawEmployee = results.find((employee) => {
          const fullName = employee.first_name + " " + employee.last_name;
          return ans.fullName === fullName;
        });
        // call the callback with it
        cb(rawEmployee.id);
      });
  });
}

/**
 * Prompts the user to select a department. Calls a callback function with a
 * department ID as the argument, if there are no deparments given we call it
 * with null as an argument
 * @callback cb
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
 * @callback cb
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
          // call our callback function with it
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
      if (result.length === 0) console.info("No departments set up yet");
      console.table(result);
      mainMenu();
    }
  );
}

/**
 * This will allow the user add a new department
 */
function addDepartment() {
  inquirer
    .prompt({
      name: "deptName",
      type: "input",
      message: "What is the name of this department?",
    })
    .then((ans) => {
      if (ans.deptName.length > DEPARTMENT_NAME_LENGTH) {
        console.info(
          "Department names must be " +
            DEPARTMENT_NAME_LENGTH +
            " characters or less"
        );
        addDepartment();
        return;
      }
      db.query(
        `INSERT INTO department(department_name)
          VALUES (?)
        `,
        ans.deptName,
        (err, result) => {
          if (err) console.error("Error inserting into department:\n", err);
          mainMenu();
        }
      );
    });
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
      if (result.length === 0) console.info("No roles set up yet");
      console.table(result);
      mainMenu();
    }
  );
}

// options for the main menu
const mainMenuOptions = [
  "View All Employees",
  "View All Departments",
  "View All Roles",
  "Add Employee",
  "Update Employee Role (WIP)",
  "Add Role",
  "Add Department",
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
