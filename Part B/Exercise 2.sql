
UPDATE p2
SET p2.Spouse_Id = p1.Person_Id
FROM Persons p1
JOIN Persons p2 ON p1.Spouse_Id = p2.Person_Id
WHERE p2.Spouse_Id IS NULL;

