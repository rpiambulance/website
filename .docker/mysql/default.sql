-- Set default values in the DB necessary for it to function

USE `ambulanc_web`;

INSERT INTO `default_crews` (`day`, `cc`, `driver`, `attendant`, `observer`) VALUES ('0', '0', '0', '0', '0');
INSERT INTO `default_crews` (`day`, `cc`, `driver`, `attendant`, `observer`) VALUES ('1', '0', '0', '0', '0');
INSERT INTO `default_crews` (`day`, `cc`, `driver`, `attendant`, `observer`) VALUES ('2', '0', '0', '0', '0');
INSERT INTO `default_crews` (`day`, `cc`, `driver`, `attendant`, `observer`) VALUES ('3', '0', '0', '0', '0');
INSERT INTO `default_crews` (`day`, `cc`, `driver`, `attendant`, `observer`) VALUES ('4', '0', '0', '0', '0');
INSERT INTO `default_crews` (`day`, `cc`, `driver`, `attendant`, `observer`) VALUES ('5', '0', '0', '0', '0');
INSERT INTO `default_crews` (`day`, `cc`, `driver`, `attendant`, `observer`) VALUES ('6', '0', '0', '0', '0');

INSERT INTO `members` (
  `id`, `username`, `password`, `first_name`, `last_name`, `email`, `rpi_address`, `home_address`, 
  `cell_phone`, `home_phone`, `rcs_id`, `radio`, `radiomodel`, `radioserial`, `radiocharger`,
  `radiotacmic`, `radioebattery`, `cpr_assoc`, `emt_level`, `other_training`, `dl_state`, `admin`, `lastlogin`) 
VALUES 
  (1, 'test', '$2y$10$i.04nI3wrx4Ki.UyryYzpeK0SJRTeG5HAbLEC8hs7ubfz23vSlQDa', 'Test', 'Person', 'test@rpi.edu', 
  '', '', '0', '0', 'test', 0, '', '', 0, 0, 0, '', '', '', 'NY', 1, CURRENT_DATE());