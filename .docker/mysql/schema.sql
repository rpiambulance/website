--
-- Database: `ambulanc_web`
--

CREATE DATABASE IF NOT EXISTS `ambulanc_web`;

USE `ambulanc_web`;

-- --------------------------------------------------------

--
-- Table structure for table `crews`
--

CREATE TABLE `crews` (
  `id` int(10) NOT NULL,
  `date` date NOT NULL DEFAULT '1000-01-01',
  `cc` int(10) NOT NULL DEFAULT '0',
  `driver` int(10) NOT NULL DEFAULT '0',
  `attendant` int(10) NOT NULL DEFAULT '0',
  `observer` int(10) NOT NULL DEFAULT '0',
  `dutysup` int(10) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `default_crews`
--

CREATE TABLE `default_crews` (
  `day` tinyint(1) NOT NULL,
  `cc` int(10) NOT NULL,
  `driver` int(10) NOT NULL,
  `attendant` int(10) NOT NULL,
  `observer` int(10) NOT NULL,
  `dutysup` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `email_log`
--

CREATE TABLE `email_log` (
  `id` int(5) NOT NULL,
  `type` varchar(25) NOT NULL,
  `date` datetime NOT NULL,
  `ip` varchar(20) NOT NULL,
  `from` varchar(50) NOT NULL,
  `to` varchar(100) NOT NULL,
  `content` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(10) NOT NULL,
  `date` date NOT NULL DEFAULT '1000-01-01',
  `start` time NOT NULL DEFAULT '00:00:00',
  `end` time NOT NULL DEFAULT '00:00:00',
  `description` text NOT NULL,
  `location` text NOT NULL,
  `limit` tinyint(3) NOT NULL DEFAULT '0',
  `hide` tinyint(1) NOT NULL,
  `gcalEventId` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `events_attendees`
--

CREATE TABLE `events_attendees` (
  `id` int(10) NOT NULL,
  `eventid` int(10) NOT NULL,
  `memberid` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `expirations`
--

CREATE TABLE `expirations` (
  `memberid` int(10) NOT NULL,
  `expired` varchar(100) NOT NULL,
  `exp_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `fuel_log`
--

CREATE TABLE `fuel_log` (
  `id` int(10) NOT NULL,
  `date` date NOT NULL DEFAULT '1000-01-01',
  `time` time NOT NULL DEFAULT '00:00:00',
  `user` int(10) NOT NULL,
  `vehicle` varchar(10) NOT NULL,
  `amount` decimal(5,2) NOT NULL DEFAULT '0.00',
  `mileage` decimal(12,2) NOT NULL DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `games`
--

CREATE TABLE `games` (
  `id` int(10) NOT NULL,
  `date` date NOT NULL DEFAULT '1000-01-01',
  `start` time NOT NULL DEFAULT '00:00:00',
  `end` time NOT NULL DEFAULT '00:00:00',
  `description` text NOT NULL,
  `location` text NOT NULL,
  `ees` tinyint(1) NOT NULL DEFAULT '0',
  `hide` tinyint(1) NOT NULL,
  `gcalEventId` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `games_crews`
--

CREATE TABLE `games_crews` (
  `id` int(10) NOT NULL,
  `gameid` int(10) NOT NULL DEFAULT '0',
  `memberid` int(10) NOT NULL DEFAULT '0',
  `position` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `homepage`
--

CREATE TABLE `homepage` (
  `id` int(11) NOT NULL DEFAULT '0',
  `date` date NOT NULL DEFAULT '1000-01-01',
  `author` int(11) NOT NULL DEFAULT '0',
  `name` varchar(20) NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `type` varchar(20) NOT NULL,
  `parent` int(11) NOT NULL DEFAULT '0',
  `position` tinyint(4) NOT NULL DEFAULT '0',
  `hide` tinyint(4) NOT NULL DEFAULT '0',
  `members` tinyint(4) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `login_attempts`
--

CREATE TABLE `login_attempts` (
  `id` int(11) NOT NULL,
  `username` varchar(25) NOT NULL,
  `was_successful` tinyint(1) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ip_address` varchar(39) NOT NULL,
  `fail_type` varchar(13) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `login_overrides`
--

CREATE TABLE `login_overrides` (
  `id` int(11) NOT NULL,
  `username` varchar(25) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `overridden_by` varchar(25) NOT NULL,
  `notes` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `id` int(10) NOT NULL,
  `username` varchar(25) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(25) NOT NULL,
  `last_name` varchar(25) NOT NULL,
  `dob` date DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `rpi_address` text NOT NULL,
  `home_address` text NOT NULL,
  `cell_phone` varchar(20) NOT NULL,
  `home_phone` varchar(20) NOT NULL,
  `rcs_id` varchar(10) NOT NULL,
  `rin` int(9) NOT NULL DEFAULT '0',
  `radionum` int(5) NOT NULL DEFAULT '0',
  `radio` int(10) NOT NULL,
  `radiomodel` varchar(15) NOT NULL,
  `radioserial` varchar(12) NOT NULL,
  `radiocharger` tinyint(1) NOT NULL,
  `radiotacmic` tinyint(1) NOT NULL,
  `radioebattery` tinyint(1) NOT NULL,
  `cpr_exp` date DEFAULT NULL,
  `cpr_assoc` varchar(50) NOT NULL,
  `emt_level` varchar(10) NOT NULL,
  `emt_num` int(6) NOT NULL DEFAULT '0',
  `emt_exp` date DEFAULT NULL,
  `other_training` text NOT NULL,
  `dl_state` varchar(2) NOT NULL,
  `dl_exp` date DEFAULT NULL,
  `cevo_date` date DEFAULT NULL,
  `epinipherine` tinyint(1) NOT NULL DEFAULT '0',
  `atropine` tinyint(1) NOT NULL DEFAULT '0',
  `glucometry` tinyint(1) NOT NULL DEFAULT '0',
  `nims100` tinyint(1) NOT NULL DEFAULT '0',
  `nims200` tinyint(1) NOT NULL DEFAULT '0',
  `nims700` tinyint(1) NOT NULL DEFAULT '0',
  `nims800` tinyint(1) NOT NULL DEFAULT '0',
  `admin` tinyint(1) NOT NULL DEFAULT '0',
  `rank` tinyint(1) NOT NULL DEFAULT '0',
  `pres` tinyint(1) NOT NULL DEFAULT '0',
  `vicepres` tinyint(1) NOT NULL DEFAULT '0',
  `captain` tinyint(1) NOT NULL DEFAULT '0',
  `firstlt` tinyint(1) NOT NULL DEFAULT '0',
  `secondlt` tinyint(1) NOT NULL DEFAULT '0',
  `schedco` tinyint(1) NOT NULL DEFAULT '0',
  `radioco` tinyint(1) NOT NULL DEFAULT '0',
  `traincommchair` tinyint(1) NOT NULL DEFAULT '0',
  `dutysup` tinyint(1) NOT NULL DEFAULT '0',
  `ees` tinyint(1) NOT NULL DEFAULT '0',
  `cctrainer` tinyint(1) NOT NULL DEFAULT '0',
  `drivertrainer` tinyint(1) NOT NULL DEFAULT '0',
  `firstresponsecc` tinyint(1) NOT NULL DEFAULT '0',
  `crewchief` tinyint(1) NOT NULL DEFAULT '0',
  `driver` tinyint(1) NOT NULL DEFAULT '0',
  `backupcc` tinyint(1) NOT NULL DEFAULT '0',
  `clearedcc` tinyint(1) NOT NULL DEFAULT '0',
  `backupdriver` tinyint(1) NOT NULL DEFAULT '0',
  `cleareddriver` tinyint(1) NOT NULL DEFAULT '0',
  `attendant` tinyint(1) NOT NULL DEFAULT '0',
  `observer` tinyint(1) NOT NULL DEFAULT '1',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `lastlogin` date NOT NULL,
  `facility_id` varchar(2) DEFAULT NULL,
  `card_id` varchar(10) DEFAULT NULL,
  `access_revoked` tinyint(1) DEFAULT NULL,
  `cprco` tinyint(4) NOT NULL,
  `webmaster` tinyint(4) NOT NULL,
  `qaco` tinyint(4) NOT NULL,
  `devco` tinyint(4) NOT NULL,
  `slackID` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `radios`
--

CREATE TABLE `radios` (
  `id` int(10) NOT NULL,
  `model` varchar(25) NOT NULL,
  `serial` varchar(25) NOT NULL,
  `lastprogram` date NOT NULL,
  `issuedto` int(10) NOT NULL,
  `issuedate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `radio_log`
--

CREATE TABLE `radio_log` (
  `id` int(10) NOT NULL DEFAULT '0',
  `radio` int(10) NOT NULL DEFAULT '0',
  `issuedto` int(10) NOT NULL DEFAULT '0',
  `issuedate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `sessionID` varchar(100) NOT NULL,
  `userID` int(10) NOT NULL,
  `expiration` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `crews`
--
ALTER TABLE `crews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `games_crews`
--
ALTER TABLE `games_crews`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `login_attempts`
--
ALTER TABLE `login_attempts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `login_overrides`
--
ALTER TABLE `login_overrides`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `facility_id` (`facility_id`,`card_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`sessionID`),
  ADD KEY `userID` (`userID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `login_attempts`
--
ALTER TABLE `login_attempts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `login_overrides`
--
ALTER TABLE `login_overrides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `members` (`id`);
COMMIT;
