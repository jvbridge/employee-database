const Employee = require("../lib/employee");

describe("Employee", () => {
    const firstName = "Arthur";
    const lastName = "Dent";
    const roleId = 1234;
    const managerId = 7787;

    it("should have an id, first name, last name, role id, and manager id", () => {
        const dentArthurDent = new Employee(
            firstName,
            lastName,
            roleId,
            managerId
        );

        expect(dentArthurDent.getFirstName()).toEqual(firstName);
        expect(dentArthurDent.getLastName()).toEqual(lastName);
        expect(dentArthurDent.getRoleId()).toEqual(roleId);
        expect(dentArthurDent.getManagerId()).toEqual(managerId);
    });
});
