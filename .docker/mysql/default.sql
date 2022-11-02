-- Set default values in the DB necessary for it to function

USE `ambulanc_web`;

INSERT INTO `default_crews` (`day`, `cc`, `driver`, `attendant`, `observer`, `dutysup`) VALUES ('0', '0', '0', '0', '0', '0');
INSERT INTO `default_crews` (`day`, `cc`, `driver`, `attendant`, `observer`, `dutysup`) VALUES ('1', '0', '0', '0', '0', '0');
INSERT INTO `default_crews` (`day`, `cc`, `driver`, `attendant`, `observer`, `dutysup`) VALUES ('2', '0', '0', '0', '0', '0');
INSERT INTO `default_crews` (`day`, `cc`, `driver`, `attendant`, `observer`, `dutysup`) VALUES ('3', '0', '0', '0', '0', '0');
INSERT INTO `default_crews` (`day`, `cc`, `driver`, `attendant`, `observer`, `dutysup`) VALUES ('4', '0', '0', '0', '0', '0');
INSERT INTO `default_crews` (`day`, `cc`, `driver`, `attendant`, `observer`, `dutysup`) VALUES ('5', '0', '0', '0', '0', '0');
INSERT INTO `default_crews` (`day`, `cc`, `driver`, `attendant`, `observer`, `dutysup`) VALUES ('6', '0', '0', '0', '0', '0');

INSERT INTO `members`(`id`, `username`, `password`, `first_name`, `last_name`, `dob`, `email`, `rpi_address`, `home_address`,
  `cell_phone`, `home_phone`, `rcs_id`, `rin`, `radionum`, `radio`, `radiomodel`, `radioserial`, `radiocharger`, `radiotacmic`,
  `radioebattery`, `cpr_exp`, `cpr_assoc`, `emt_level`, `emt_num`, `other_training`, `dl_state`, `admin`, `lastlogin`, `cprco`, `webmaster`,
  `qaco`, `devco`)
VALUES
(1, 'test','$2y$10$i.04nI3wrx4Ki.UyryYzpeK0SJRTeG5HAbLEC8hs7ubfz23vSlQDa', 'test', 'test', CURRENT_DATE(), 'test@rpi.edu','123',
'123-456-7890', '123-456-7890', 'test', 111111111, 999, 0, 0, '', '', 0, 0, 0,
CURRENT_DATE(), '', 'A-EMT', 123456, '', '', 1, CURRENT_DATE(), 0, 0, 0, 0);

INSERT INTO `games_crews`(`id`, `gameid`, `memberid`, `position`) VALUES (0, 0, 0, 0);

INSERT INTO `crews` (`id`, `date`) VALUES(1, DATE_SUB(DATE(NOW()), INTERVAL DAYOFWEEK(NOW())-1 DAY));
INSERT INTO `crews` (`id`, `date`) VALUES(2, DATE_SUB(DATE(NOW()), INTERVAL DAYOFWEEK(NOW())-2 DAY));
INSERT INTO `crews` (`id`, `date`) VALUES(3, DATE_SUB(DATE(NOW()), INTERVAL DAYOFWEEK(NOW())-3 DAY));
INSERT INTO `crews` (`id`, `date`) VALUES(4, DATE_SUB(DATE(NOW()), INTERVAL DAYOFWEEK(NOW())-4 DAY));
INSERT INTO `crews` (`id`, `date`) VALUES(5, DATE_SUB(DATE(NOW()), INTERVAL DAYOFWEEK(NOW())-5 DAY));
INSERT INTO `crews` (`id`, `date`) VALUES(6, DATE_SUB(DATE(NOW()), INTERVAL DAYOFWEEK(NOW())-6 DAY));
INSERT INTO `crews` (`id`, `date`) VALUES(7, DATE_SUB(DATE(NOW()), INTERVAL DAYOFWEEK(NOW())-7 DAY));
INSERT INTO `crews` (`id`, `date`) VALUES(8, DATE_SUB(DATE(NOW()), INTERVAL DAYOFWEEK(NOW())-8 DAY));
INSERT INTO `crews` (`id`, `date`) VALUES(9, DATE_SUB(DATE(NOW()), INTERVAL DAYOFWEEK(NOW())-9 DAY));
INSERT INTO `crews` (`id`, `date`) VALUES(10, DATE_SUB(DATE(NOW()), INTERVAL DAYOFWEEK(NOW())-10 DAY));
INSERT INTO `crews` (`id`, `date`) VALUES(11, DATE_SUB(DATE(NOW()), INTERVAL DAYOFWEEK(NOW())-11 DAY));
INSERT INTO `crews` (`id`, `date`) VALUES(12, DATE_SUB(DATE(NOW()), INTERVAL DAYOFWEEK(NOW())-12 DAY));
INSERT INTO `crews` (`id`, `date`) VALUES(13, DATE_SUB(DATE(NOW()), INTERVAL DAYOFWEEK(NOW())-13 DAY));
INSERT INTO `crews` (`id`, `date`) VALUES(14, DATE_SUB(DATE(NOW()), INTERVAL DAYOFWEEK(NOW())-14 DAY));
