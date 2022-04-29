const Role = require('../lib/role');

describe('Role', () =>{
    const id = 7787;
    const title = 'security robot';
    const salary = 20000;
    const departmentId = 42;
    it('should have an id, title, a salary, and a department id', () =>{
        const colin = new Role(id, title, salary, departmentId);

        expect(colin.getId()).toEqual(id);
        expect(colin.getTitle()).toEqual(title);
        expect(colin.getSalary()).toEqual(salary);
        expect(colin.getDepartmentId()).toEqual(departmentId);
    });
});