
/**
 * This is the "top level" class that 
 */
class Department{
    constructor (id, name) {
        this.id = id;
        this.name = name;
    }

    getId(){
        return this.id;
    }
    
    getName(){
        return this.name;
    }
}

module.exports = Department;