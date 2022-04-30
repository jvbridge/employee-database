const defaultName = "unnamed";

class Department {
    constructor(id, name) {
        if (typeof id !== "number" || !Number.isInteger(id) || id < 1) {
            throw new Error("invalid Id for the department");
        } else {
            this.id = id;
        }

        if (typeof name !== "string" || name.length < 2 || name.length > 30) {
            console.warn("Invalid input for name using defaul");
            this.name = defaultName;
        } else {
            this.name = name;
        }
    }
    // getters
    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getDefaultName() {
        return defaultName;
    }
}

module.exports = Department;
