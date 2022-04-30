const Department = require('../lib/department');

describe("Department", () => {
    const id = 42;
    const name = "Sirius Cybernetics Corporation Marketing Department";
    
    it("should have an id and a name", () =>{
        const marketing = new Department(id, name);

        expect(marketing.getId()).toEqual(id);
        expect(marketing.getName()).toEqual(name);
    });

});