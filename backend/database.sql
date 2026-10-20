-- Database: ip_std6730251158
-- System: HR Manager & Salary Analytics System
-- Student: std6730251158

CREATE TABLE IF NOT EXISTS `employees` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `position` varchar(100) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'Active',
  `salary` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Initial Mock Data (Phase 1)
INSERT INTO `employees` (`id`, `name`, `position`, `status`, `salary`) VALUES
('1', 'John Doe', 'Software Engineer', 'Active', 45000.00),
('2', 'Jane Smith', 'Senior Tech Lead', 'Active', 85000.00),
('3', 'Michael Scott', 'Regional Director', 'On Leave', 88000.00),
('4', 'Pam Beesly', 'HR Specialist', 'Active', 18500.00),
('5', 'Jim Halpert', 'Marketing Manager', 'Active', 48000.00),
('6', 'Dwight Schrute', 'Operations Lead', 'Active', 52000.00),
('7', 'Kevin Malone', 'Junior Accountant', 'On Leave', 20000.00)
ON DUPLICATE KEY UPDATE 
  `name` = VALUES(`name`),
  `position` = VALUES(`position`),
  `status` = VALUES(`status`),
  `salary` = VALUES(`salary`);
