const Employee = require("../lib/employee");

describe("Employee", () => {
    const firstName = "Arthur";
    const lastName = "Dent";
    const roleId = 1234;
    const managerId = 7787;

    it("should have an id, first name, last name, role id, and manager id", () => {
        const dentArthurDent = new Employee(firstName, lastName);

        expect(dentArthurDent.getFirstName()).toEqual(firstName);
        expect(dentArthurDent.getLastName()).toEqual(lastName);
    });
});
