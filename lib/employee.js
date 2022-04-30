const defaultFirstName = "unnamed";
const defaultLastName = "unnamed";
const defaultRole = 1;
const defaultMangerId = null;

class Employee {
    constructor(id, firstName, lastName, roleId, managerId) {
        if (typeof id !== "number" || !Number.isInteger(id)) {
            throw new Error("Invalid input for ID");
        } else {
            this.id = id;
        }
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
            lastName.length < 2 ||
            lastName.length > 30
        ) {
            console.warn("invalid input for last name, setting to default");
            this.lastName = defaultLastName;
        } else {
            this.lastName = lastName;
        }
        if (typeof roleId !== "number" || !Number.isInteger(roleId)) {
            console.warn("Invalid input for role ID setting to default");
            this.roleId = defaultRole;
        } else {
            this.roleId = roleId;
        }
        if (typeof managerId !== "number" || !Number.isInteger(managerId)) {
            console.warn("Invalid input for manager ID setting to default");
            this.managerId = defaultMangerId;
        } else {
            this.managerId = managerId;
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
