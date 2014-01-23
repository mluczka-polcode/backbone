CREATE TABLE `c_forms` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(32) NOT NULL,
    `lastName` VARCHAR(32) NOT NULL,
    `phone` VARCHAR(32) NOT NULL,
    `cardNumber` VARCHAR(32) NOT NULL,
    `persons` TEXT NOT NULL,
    `courses` TEXT NOT NULL,
    `resources` TEXT NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1
