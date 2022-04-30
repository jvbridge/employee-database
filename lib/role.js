const defaultTitle = "none";
const defaultSalary = 24000;
const defaultDepartment = 1;

class Role {
    constructor(title, salary, departmentId) {
        if (
            typeof title !== "string" ||
            title.length < 3 ||
            title.length > 30
        ) {
            console.warn("Invalid title given, setting to default");
            this.title = defaultTitle;
        } else {
            this.title = title;
        }

        if (typeof salary !== "number") {
            console.warn("Invalid salary given, setting to default");
            this.salary = defaultSalary;
        } else {
            this.salary = salary;
        }

        if (
            typeof departmentId !== "number" ||
            !Number.isInteger(departmentId)
        ) {
            console.warn("Invalid ID given, setting to default");
            this.departmentId = defaultDepartment;
        } else {
            this.departmentId = departmentId;
        }
    }

    // Getters
    getTitle() {
        return this.title;
    }

    getSalary() {
        return this.salary;
    }

    getDepartmentId() {
        return this.departmentId;
    }

    // Constants
    getDefaultTitle() {
        return defaultTitle;
    }
    getDefaultSalary() {
        return defaultSalarydefaultTitle;
    }
    getDefaultDepartment() {
        return defaultDepartmentdefaultTitle;
    }
}

module.exports = Role;
