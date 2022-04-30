const Role = require("../lib/role");

describe("Role", () => {
    const title = "security robot";
    const salary = 20000;
    const departmentId = 42;
    it("should have an id, title, a salary, and a department id", () => {
        const colin = new Role(title, salary, departmentId);

        expect(colin.getTitle()).toEqual(title);
        expect(colin.getSalary()).toEqual(salary);
        expect(colin.getDepartmentId()).toEqual(departmentId);
    });

    it("should validate input and assign default values", () => {
        const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

        const dent = new Role(title, "Howdy!", departmentId);
        expect(warn).toBeCalledWith("Invalid salary given, setting to default");
        expect(dent.getSalary()).toEqual();

        // department ID
        const colin = new Role(title, salary);
        expect(warn).toBeCalledWith("Invalid ID given, setting to default");
        expect(colin.getDepartmentId()).toEqual(colin.getDefaultDepartment());

        const ford = new Role(title, salary, 1.5);
        expect(ford.getDepartmentId()).toEqual(colin.getDepartmentId());
    });
});
