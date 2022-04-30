const defaultFirstName = "unnamed";
const defaultLastName = null;
const defaultRole = 1;
const defaultMangerId = null;

/**
 * Class representing employee
 */
class Employee {
    /**
     * Creates an employee
     * @param {string} firstName - the employee's first name
     * @param {string | null} lastName - the employee's last name, can be null
     * for people without a surname
     */
    constructor(firstName, lastName) {
        if (
            typeof firstName !== "string" ||
            firstName.length < 2 ||
            firstName.length > 30
        ) {
            console.warn("invalid input for first name, setting to default");
            this.firstName = defaultFirstName;
        } else {
            this.firstName = firstName;
        }
        if (
            typeof lastName !== "string" ||
            lastName !== null ||
            lastName.length < 2 ||
            lastName.length > 30
        ) {
            console.warn("invalid input for last name, setting to default");
            this.lastName = defaultLastName;
        } else {
            this.lastName = lastName;
        }
        this.role = null;
        this.managerId = null;
    }

    // setters
    /**
     * Sets the manager of the
     * @param {number} manager - the id of the manager
     */
    setManager(manager) {
        if (typeof manager === "number" && Number.isInteger(manager)) {
            this.managerId = manager;
        } else {
            console.error("manager must be an id");
        }
    }

    // getters
    getId() {
        return this.id;
    }

    getFirstName() {
        return this.firstName;
    }

    getLastName() {
        return this.lastName;
    }

    getRoleId() {
        return this.roleId;
    }

    getManagerId() {
        return this.managerId;
    }

    // constants
    getDefaultFirstName() {
        return defaultFirstName;
    }
    getDefaultLastName() {
        return defaultLastName;
    }
    getDefaultRole() {
        return defaultRole;
    }
    getDefaultMangerId() {
        return defaultMangerId;
    }
}

module.exports = Employee;
