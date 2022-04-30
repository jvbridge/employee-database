const Department = require("../lib/department");

describe("Department", () => {
    const name = "Sirius Cybernetics Corporation Marketing Department";

    it("should have an id and a name", () => {
        const marketing = new Department(name);
        expect(marketing.getName()).toEqual(name);
    });
});
