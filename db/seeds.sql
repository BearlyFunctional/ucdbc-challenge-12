INSERT INTO departments (dep_name)
VALUES  ("Management"),
        ("Front"), 
        ("Kitchen");

INSERT INTO roles (dep_id, title, salary)
VALUES  (1, "General Manager/CEO", 5326.75),
        (2, "Cashier", 4.25),
        (3, "Fry Cook", 0.50),
        (1, "Arch Nemesis", 0.00);

INSERT INTO employees (role_id, manager_id, first_name, last_name)
VALUES  (1, 1, "Eugene", "Krabs"),
        (2, 1, "Squidward", "Tentacles"),
        (3, 2, "SpongeBob", "SquarePants"),
        (4, 1, "Sheldon", "Plankton");