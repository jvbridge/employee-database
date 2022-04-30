const defaultName = "unnamed";

class Department {
    constructor(name) {
        if (typeof name !== "string" || name.length < 2 || name.length > 30) {
            console.warn("Invalid input for name using defaul");
            this.name = defaultName;
        } else {
            this.name = name;
        }
    }
    // getters
    getName() {
        return this.name;
    }

    getDefaultName() {
        return defaultName;
    }
}

module.exports = Department;
