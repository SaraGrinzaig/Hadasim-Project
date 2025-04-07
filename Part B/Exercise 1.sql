
---------------------------Genders table-------------------------------------

CREATE TABLE Genders (
    Gender_Id TINYINT PRIMARY KEY,
    Gender_Name NVARCHAR(10) UNIQUE
);

insert into Genders (Gender_Id, Gender_Name) values
(1, 'Male'),
(2, 'Female')


---------------------------Persons Table---------------------------------------

CREATE TABLE Persons (
    Person_Id VARCHAR(9) PRIMARY KEY, 
    Personal_Name NVARCHAR(50) NOT NULL, 
    Family_Name NVARCHAR(50) NOT NULL, 
    Gender_Id TINYINT NOT NULL,
    Father_Id VARCHAR(9) NULL, 
    Mother_Id VARCHAR(9) NULL, 
    Spouse_Id VARCHAR(9) NULL,
    FOREIGN KEY (Gender_Id) REFERENCES Genders(Gender_Id),
    FOREIGN KEY (Father_Id) REFERENCES Persons(Person_Id),
    FOREIGN KEY (Mother_Id) REFERENCES Persons(Person_Id),
    FOREIGN KEY (Spouse_Id) REFERENCES Persons(Person_Id)
);

INSERT INTO Persons (Person_Id, Personal_Name, Family_Name, Gender_Id, Father_Id, Mother_Id, Spouse_Id)
VALUES
('123456789', 'Jonathan', 'Cohen', 1, NULL, NULL, '234567890'),
('234567890', 'Maya', 'Cohen', 2, NULL, NULL, '123456789'), 
('345678901', 'Daniel', 'Cohen', 1, '123456789', '234567890', NULL),
('456789012', 'Sarah', 'Goldberg', 2, '123456789', '234567890', '443322110'),
('443322110', 'Danny', 'Goldberg', 1, NULL, NULL, '456789012'), 
('678901234', 'Tamar', 'Cohen', 2, '123456789', '234567890', NULL),
('789012345', 'Chana', 'Goldberg', 2, '443322110', '456789012', NULL),
('890123456', 'Yossi', 'Rosenberg', 1, NULL, NULL, '332211556'), 
('332211556', 'Malka', 'Rosenberg', 2, '123456789', '234567890', '890123456');

INSERT INTO Persons (Person_Id, Personal_Name, Family_Name, Gender_Id, Father_Id, Mother_Id, Spouse_Id)
VALUES
('556677345', 'Rivka', 'Cohen', 2, NULL, NULL, '345678901');


----------------------------Connection_Types Table-------------------------------

create table Connection_Types(
	Connection_Type_Id int primary key,
	Connection_Type_Name nvarchar(20) not null
);

INSERT INTO Connection_Types (Connection_Type_Id, Connection_Type_Name)
VALUES 
(1, 'Father'),
(2, 'Mother'),
(3, 'Brother'),
(4, 'Sister'),
(5, 'Son'),
(6, 'Daughter'),
(7, 'Husband'),
(8, 'Wife');


-----------------------------Relationships Table---------------------------------

CREATE TABLE Relationships(
	Person_Id VARCHAR(9),
	Relative_Id VARCHAR(9),
	Connection_Type_Id INT, 
	primary key (Person_Id, Relative_Id, Connection_Type_Id),
	foreign key (Person_Id) references Persons(Person_Id),
	foreign key (Relative_Id) references Persons(Person_Id),
	foreign key (Connection_Type_Id) references Connection_Types(Connection_Type_Id)
);

insert into Relationships (Person_Id, Relative_Id, Connection_Type_Id)
values
('123456789', '234567890', 8),
('123456789', '332211556', 6),
('123456789', '345678901', 5),
('123456789', '456789012', 6),
('456789012','345678901',3);

