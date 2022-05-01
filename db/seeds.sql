/*
These are some seed values for our database using some members of the USS 
ENTERPRISE NCC-1701-D. There is no money in the 24th Century so they're paid 
with units of pride and accomplishment 
*/

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
    ("Engineering", 100, 
        (SELECT id FROM department WHERE department_name = "Operations")
    ),
    ("Operations", 100, 
        (SELECT id FROM department WHERE department_name = "Operations")
    ),
    ("Medical", 100, 
        (SELECT id FROM department WHERE department_name = "Science")
    ),
    ("Counselor", 100, 
        (SELECT id FROM department WHERE department_name = "Science")
    ),
    ("Science", 100, 
        (SELECT id FROM department WHERE department_name = "Science")
    ),
    ("Crewman", 100,
        (SELECT id FROM department WHERE department_name = "Command")
    ),
    ("Civilian", 100,
        (SELECT id FROM department WHERE department_name = "Command")
    );

SELECT * FROM role;

-- Need to do a new insert for each layer of management

-- Picard is the big boss
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Jean-Luc", "Picard", (SELECT id FROM role WHERE title = "Captain"), NULL);

-- Rest of the bridge crew report to him 
/*
This only works because nobody else is named "Picard", This behavior is 
problematic when last names collide (such as for Beverley and Wesley Crusher).
For this exercise I'm going to just hard code things, but ideally a more full
implementation would reference a role they report to, and have unique roles for
each chief. (Data is chief of ops, Beverley Crusher is chief of medical etc.)
*/
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("William", "Riker", 
        (SELECT id FROM role WHERE title = "First Officer"), 
        (SELECT * FROM 
            (SELECT id FROM employee WHERE last_name = "Picard") as id
        )
    ),
    ("Data", "", 
        (SELECT id FROM role WHERE title = "Second Officer"), 
        (SELECT * FROM 
            (SELECT id FROM employee WHERE last_name = "Picard") as id
        )
    ),
    ("Worf", "", 
        (SELECT id FROM role WHERE title = "Security"), 
        (SELECT * FROM 
            (SELECT id FROM employee WHERE last_name = "Picard") as id
        )
    ),
    ("Geordi", "La Forge", 
        (SELECT id FROM role WHERE title = "Engineering"), 
        (SELECT * FROM 
            (SELECT id FROM employee WHERE last_name = "Picard") as id
        )
    ),
    ("Beverly", "Crusher", 
        (SELECT id FROM role WHERE title = "Medical"), 
        (SELECT * FROM 
            (SELECT id FROM employee WHERE last_name = "Picard") as id
        )
    ),
    ("Deanna", "Troi", 
        (SELECT id FROM role WHERE title = "counselor"), 
        (SELECT * FROM 
            (SELECT id FROM employee WHERE last_name = "Picard") as id
        )
    );

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Miles", "O'Brian",
        (SELECT id FROM role WHERE title = "Operations"),
        (SELECT * FROM 
            (SELECT id FROM employee WHERE first_name = "Worf") as id
        )
    ),
    ("Reginald", "Barclay", 
        (SELECT id FROM role WHERE title = "Engineering"), 
        (SELECT * FROM 
            (SELECT id FROM employee WHERE last_name = "La Forge") as id
        )
    ),
    ("Alyssa", "Ogawa",
        (SELECT id FROM role WHERE title = "Medical"), 
        (SELECT * FROM 
            (SELECT id FROM employee WHERE last_name = "Crusher") as id
        )
    ),
    ("Wesley", "Crusher",
        (SELECT id FROM role WHERE title = "Civilian"),
        (SELECT * FROM 
            (SELECT id FROM employee WHERE last_name = "Picard") as id
        )
    ),
    ("Guinan", "",
        (SELECT id FROM role WHERE title = "Civilian"),
        (SELECT * FROM 
            (SELECT id FROM employee WHERE last_name = "Picard") as id
        )
    ),
    ("Ro", "Laren",
        (SELECT id FROM role WHERE title = "Crewman"),
        (SELECT * FROM 
            (SELECT id FROM employee WHERE last_name = "Riker") as id
        )
    );
SELECT * FROM employee;