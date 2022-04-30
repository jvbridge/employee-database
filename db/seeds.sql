-- These are some seed values for our database using some members of the 
-- USS ENTERPRISE NCC-1701-D. There is no money in the 24th Century so they're
-- paid with units of pride and accomplishment 

INSERT INTO department (department_name)
VALUES 
    ("Command"),
    ("Operations"),
    ("Science");

SELECT * FROM department;

INSERT INTO role (title, salary, department_id)
VALUES 
    ("Captain", 100, 
        (SELECT id FROM department WHERE department_name = "Command")
    ),
    ("First Officer", 100, 
        (SELECT id FROM department WHERE department_name = "Command")
    ),
    ("Second Officer", 100, 
        (SELECT id FROM department WHERE department_name = "Operations")
    ),
    ("Security", 100, 
        (SELECT id FROM department WHERE department_name = "Operations")
    ),
    ("Engineer", 100, 
        (SELECT id FROM department WHERE department_name = "Operations")
    ),
    ("Operations", 100, 
        (SELECT id FROM department WHERE department_name = "Operations")
    ),
    ("Medical", 100, 
        (SELECT id FROM department WHERE department_name = "Science")
    ),
    ("Counsilor", 100, 
        (SELECT id FROM department WHERE department_name = "Science")
    ),
    ("Science", 100, 
        (SELECT id FROM department WHERE department_name = "Science")
    );

SELECT * FROM role;

-- Need to do a new insert for each layer of management
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Jean-Luc", "Picard", (SELECT id FROM role WHERE name = "Captain"), NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("William", "Riker", 
        (SELECT id FROM role WHERE name = "First Officer"), 
        (SELECT id from employee WHERE title = "Captain")
    ),
    ("Data", "Soong", 
        (SELECT id FROM role WHERE name = "Second Officer"), 
        (SELECT id from employee WHERE title = "Captain")
    ),
    ("Worf", "Son of Mogh", 
        (SELECT id FROM role WHERE name = "Security"), 
        (SELECT id from employee WHERE title = "Captain")
    ),
    ("Geordi", "La Forge", 
        (SELECT id FROM role WHERE name = "Engineering"), 
        (SELECT id from employee WHERE title = "Captain")
    ),
    ("Deanna", "Troi", 
        (SELECT id FROM role WHERE name = "Counsilor"), 
        (SELECT id from employee WHERE title = "Captain")
    ),
    ("Beverly", "Crusher", 
        (SELECT id FROM role WHERE name = "Medical"), 
        (SELECT id from employee WHERE title = "Captain")
    )
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Reginald", "Barclay", 
        (SELECT id FROM role WHERE name = "Engineer"), 
        (SELECT id from employee WHERE last_name = "La Forge")
    ),
    