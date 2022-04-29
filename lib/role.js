class Role {
    constructor(id, title, salary, departmentId){
        this.id = id;
        this.title = title;
        this.salary = salary;
        this.departmentId = departmentId;
    }

    getId(){
        return this.id;
    }

    getTitle(){
        return this.title;
    }

    getSalary(){
        return this.salary;
    }

    getDepartmentId(){
        return this.departmentId;
    }
}

module.exports = Role;