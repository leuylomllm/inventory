-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 28, 2026 at 09:25 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `inventory_db`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_category` (IN `p_category_name` VARCHAR(255), IN `p_description` VARCHAR(255))   BEGIN
    INSERT INTO tbl_categories (category_name,description)
    VALUES (p_category_name,p_description);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_product` (IN `p_product_name` VARCHAR(255), IN `p_category_id` INT, IN `p_supplier_id` INT, IN `p_stock` INT, IN `p_price` DECIMAL(10,2), IN `p_description` TEXT, IN `p_isDeleted` TINYINT(1))   BEGIN
  DECLARE v_isDeleted TINYINT(1) DEFAULT 0;
  SET v_isDeleted = COALESCE(p_isDeleted, 0);
  INSERT INTO `tbl_products`
    (`product_name`, `category_id`, `supplier_id`, `stock`, `price`, `description`, `isDeleted`)
  VALUES
    (p_product_name, p_category_id, p_supplier_id, p_stock, p_price, p_description, v_isDeleted);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_supplier` (IN `p_supplier_name` VARCHAR(255), IN `p_contact_name` VARCHAR(255), IN `p_supplier_address` VARCHAR(255), IN `p_supplier_phone` VARCHAR(255), IN `p_supplier_email` VARCHAR(255))   BEGIN
  INSERT INTO `tbl_suppliers`
    (`supplier_name`, `contact_name` ,`address`, `phone`, `email`)
  VALUES
    (p_supplier_name, p_contact_name, p_supplier_address, p_supplier_phone, p_supplier_email);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_user` (IN `p_username` VARCHAR(255), IN `p_email` VARCHAR(255), IN `p_password` VARCHAR(255), IN `p_address` VARCHAR(255), IN `p_role_id` INT)   BEGIN
  INSERT INTO `tbl_users`
    (`username`, `email`, `password`, `address`, `role_id`)
  VALUES
    (p_username, p_email, p_password, p_address, p_role_id);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_category` (IN `p_category_id` INT)   BEGIN
    DELETE FROM tbl_categories
    WHERE id = p_category_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_product` (IN `p_product_id` INT)   BEGIN
  UPDATE `tbl_products` SET `isDeleted` = 1 WHERE `id` = p_product_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_supplier` (IN `p_supplier_id` INT)   BEGIN
  DELETE FROM `tbl_suppliers` WHERE `id` = p_supplier_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_user` (IN `p_user_id` INT)   BEGIN
  DELETE FROM `tbl_users` WHERE `id` = p_user_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_form_load_product` ()   BEGIN
    SELECT c.id, c.category_name
    FROM `tbl_categories` c;

    SELECT s.id, s.supplier_name
    FROM `tbl_suppliers` s;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_all_categories` (IN `p_category_name` VARCHAR(255))   BEGIN
    SELECT * FROM tbl_categories
    WHERE p_category_name IS NULL
       OR category_name LIKE CONCAT('%', p_category_name, '%');
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_all_products` (IN `p_product_name` VARCHAR(255), IN `p_category_id` INT, IN `p_supplier_id` INT, IN `p_price` DECIMAL(10,2), IN `p_stock` INT)   BEGIN
    SELECT
        p.id,
        p.product_name,
        p.category_id,
        p.supplier_id,
        p.stock,
        p.price,
        p.description,
        p.created_at,
        c.category_name AS cate_name,
        s.supplier_name AS sup_name
    FROM
        tbl_products p
    LEFT JOIN
        tbl_categories c ON p.category_id = c.id
    LEFT JOIN
        tbl_suppliers s ON p.supplier_id = s.id
    WHERE
        (p_product_name IS NULL OR p.product_name LIKE CONCAT('%', p_product_name, '%'))
        AND (p_category_id IS NULL OR p.category_id = p_category_id)
        AND (p_supplier_id IS NULL OR p.supplier_id = p_supplier_id)
        AND (p_price IS NULL OR p.price = p_price)
        AND (p_stock IS NULL OR p.stock = p_stock);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_all_supplier` ()   BEGIN
    SELECT *
    FROM `tbl_suppliers` s;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_all_user` ()   BEGIN
    SELECT u.id, u.username, u.email, u.address, r.role_name
    FROM `tbl_users` u
    LEFT JOIN `tbl_roles` r ON u.role_id = r.id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_one_category` (IN `p_category_id` INT)   BEGIN
    SELECT * FROM tbl_categories
    WHERE id = p_category_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_one_product` (IN `p_product_id` INT)   BEGIN
  SELECT
      p.*,
      c.category_name as cate_name,
      s.supplier_name as sup_name
  FROM `tbl_products` p
  LEFT JOIN `tbl_categories` c ON p.category_id = c.id
  LEFT JOIN `tbl_suppliers` s ON p.supplier_id = s.id
  WHERE p.`id` = p_product_id
  AND `isDeleted` = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_supplier_by_id` (IN `p_supplier_id` INT)   BEGIN
    SELECT *
    FROM `tbl_suppliers` s
    WHERE s.`id` = p_supplier_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_user_by_id` (IN `p_user_id` INT)   BEGIN
    SELECT u.id, u.username, u.email, u.address, r.role_name
    FROM `tbl_users` u
    LEFT JOIN `tbl_roles` r ON u.role_id = r.id
    WHERE u.`id` = p_user_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_category` (IN `p_category_id` INT, IN `p_category_name` VARCHAR(255), IN `p_description` VARCHAR(255))   BEGIN
    UPDATE tbl_categories
    SET category_name = p_category_name,
        description = p_description
    WHERE id = p_category_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_product` (IN `p_product_id` INT, IN `p_product_name` VARCHAR(255), IN `p_category_id` INT, IN `p_supplier_id` INT, IN `p_stock` INT, IN `p_price` DECIMAL(10,2), IN `p_description` TEXT, IN `p_isDeleted` TINYINT(1))   BEGIN
  DECLARE v_isDeleted TINYINT(1) DEFAULT 0;
  SET v_isDeleted = COALESCE(p_isDeleted, 0);
  UPDATE `tbl_products`
    SET
      `product_name` = p_product_name,
      `category_id` = p_category_id,
      `supplier_id` = p_supplier_id,
      `stock` = p_stock,
      `price` = p_price,
      `description` = p_description,
      `isDeleted` = v_isDeleted
    WHERE `id` = p_product_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_supplier` (IN `p_supplier_id` INT, IN `p_supplier_name` VARCHAR(255), IN `p_contact_name` VARCHAR(255), IN `p_supplier_address` VARCHAR(255), IN `p_supplier_phone` VARCHAR(255), IN `p_supplier_email` VARCHAR(255))   BEGIN
  UPDATE `tbl_suppliers`
    SET
      `supplier_name` = p_supplier_name,
      `contact_name` = p_contact_name,
      `address` = p_supplier_address,
      `phone` = p_supplier_phone,
      `email` = p_supplier_email
    WHERE `id` = p_supplier_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_user` (IN `p_user_id` INT, IN `p_username` VARCHAR(255), IN `p_email` VARCHAR(255), IN `p_password` VARCHAR(255), IN `p_address` VARCHAR(255), IN `p_role_id` INT)   BEGIN
  UPDATE `tbl_users`
    SET
      `username` = p_username,
      `email` = p_email,
      `password` = p_password,
      `address` = p_address,
      `role_id` = p_role_id
    WHERE `id` = p_user_id;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `result_27`
--

CREATE TABLE `result_27` (
  `id` int DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `role_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `result_27`
--

INSERT INTO `result_27` (`id`, `username`, `email`, `address`, `role_name`) VALUES
(6, 'john', 'john@example.com', '456 John Avenue', 'staff'),
(8, 'admin', 'admin@example.com', 'Siem Reap Municipality', NULL),
(9, 'Hong', 'heng@gmail.com', NULL, 'customer'),
(10, 'linda', 'linda@gmail.com', 'Oddor', 'admin'),
(11, 'leuyllm', 'leuy@gmail.com', 'Siem Reap Municipality', NULL),
(12, 'vin', 'vin@gmail.com', 'Seimreap', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_categories`
--

CREATE TABLE `tbl_categories` (
  `id` int NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tbl_categories`
--

INSERT INTO `tbl_categories` (`id`, `category_name`, `description`, `created_at`) VALUES
(2, 'Office Supplies', 'Items used in the office like pens, papers', '2025-10-08 09:20:15'),
(3, 'Electronics', 'Updated category description', '2025-10-08 09:20:15'),
(4, 'Groceries', 'Food and consumables', '2025-10-08 09:20:15'),
(10, 'Phone', 'Good ', '2025-10-15 15:16:49'),
(12, 'Test', 'fasdkfs', '2025-10-18 07:25:21'),
(33, 'Elet', 'good', '2025-10-24 04:27:11'),
(34, 'df', 'df', '2025-10-24 04:56:21'),
(35, 'dddd', '', '2025-10-24 04:56:33'),
(36, 'drinks', 'Good', '2025-10-25 04:07:14'),
(37, 'Electronics', 'Electronic devices and gadgets', '2025-10-25 09:09:49'),
(38, 'Books', 'Books and stationery', '2025-10-25 09:09:49'),
(39, 'Clothing', 'Men and women clothing', '2025-10-25 09:09:49'),
(40, 'Kitchenware', 'Utensils and kitchen items', '2025-10-25 09:09:49'),
(41, 'Sports', 'Sporting goods and outdoor items', '2025-10-25 09:09:49'),
(42, 'Phone', '', '2025-11-08 06:31:34'),
(43, 'Test', '', '2025-11-08 07:07:14'),
(44, 'Phone', '', '2025-11-14 03:44:09'),
(45, 'Tes8', 'Good', '2026-04-28 08:40:46'),
(46, 'gg', 'df', '2026-04-28 08:41:48');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_permissions`
--

CREATE TABLE `tbl_permissions` (
  `id` int NOT NULL,
  `permission_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tbl_permissions`
--

INSERT INTO `tbl_permissions` (`id`, `permission_name`) VALUES
(17, 'create_categories'),
(24, 'create_customer'),
(13, 'create_products'),
(21, 'create_suppliers'),
(9, 'create_users'),
(19, 'delete_categories'),
(27, 'delete_customer'),
(15, 'delete_products'),
(23, 'delete_suppliers'),
(11, 'delete_users'),
(18, 'edit_categories'),
(26, 'edit_customer'),
(14, 'edit_products'),
(22, 'edit_suppliers'),
(10, 'edit_users'),
(16, 'view_categories'),
(25, 'view_dashboard'),
(12, 'view_products'),
(20, 'view_suppliers'),
(8, 'view_users');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_products`
--

CREATE TABLE `tbl_products` (
  `id` int NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `category_id` int NOT NULL,
  `supplier_id` int NOT NULL,
  `stock` int NOT NULL,
  `price` decimal(10,2) DEFAULT '0.00',
  `description` varchar(255) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tbl_products`
--

INSERT INTO `tbl_products` (`id`, `product_name`, `category_id`, `supplier_id`, `stock`, `price`, `description`, `created_at`, `isDeleted`) VALUES
(8, 'Phone', 3, 4, 3, '1200.00', 'Good for user and ', '2025-10-17 06:59:00', 0),
(9, 'Rem', 35, 4, 9, '7000.00', 'Id', '2025-10-17 07:08:46', 1),
(10, 'Coca', 36, 4, 0, '5000.00', 'Good', '2025-10-25 04:07:41', 1),
(11, 'Fanta', 35, 4, 10, '2000.00', 'g', '2025-10-25 04:29:04', 0),
(15, 'Tv', 33, 6, 0, '1000.00', 'dfdf', '2025-10-25 04:53:53', 0),
(16, 'Laptop', 33, 4, 5, '1500.00', 'High performance laptop', '2025-10-25 09:09:59', 0),
(17, 'Desk Chair', 3, 4, 10, '200.00', 'Comfortable office chair', '2025-10-25 09:09:59', 0),
(18, 'Notebook', 2, 4, 50, '5.00', 'A5 notebook', '2025-10-25 09:09:59', 0),
(19, 'T-Shirt', 35, 6, 20, '12.00', 'Cotton t-shirt', '2025-10-25 09:09:59', 0),
(20, 'Coffee Mug', 36, 6, 30, '8.00', 'Ceramic mug', '2025-10-25 09:09:59', 0),
(21, 'Football', 36, 6, 15, '25.00', 'Official size football', '2025-10-25 09:09:59', 0),
(23, 'Example Product', 2, 2, 100, '19.99', 'Short description', '2025-11-14 03:05:27', 0),
(24, 'Shop', 3, 3, 200, '19.99', 'GOod', '2025-11-14 03:14:06', 0),
(25, 'Shop25', 3, 3, 200, '19.99', 'GOod', '2025-11-14 04:39:15', 1),
(26, 'Shop5', 3, 3, 200, '19.99', 'GOod', '2025-11-14 04:56:19', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_roles`
--

CREATE TABLE `tbl_roles` (
  `id` int NOT NULL,
  `role_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tbl_roles`
--

INSERT INTO `tbl_roles` (`id`, `role_name`) VALUES
(4, 'admin'),
(6, 'customer'),
(5, 'staff');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_stock_transactions`
--

CREATE TABLE `tbl_stock_transactions` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `type` enum('Online','Offline','InStore') NOT NULL,
  `quantity` int NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tbl_stock_transactions`
--

INSERT INTO `tbl_stock_transactions` (`id`, `product_id`, `customer_id`, `type`, `quantity`, `note`, `created_at`) VALUES
(8, 8, 8, 'Online', 2, '', '2025-10-20 06:38:06'),
(9, 8, 10, 'Online', 2, '', '2025-10-20 07:16:02'),
(10, 8, 11, 'Online', 2, '', '2025-10-22 12:44:14'),
(11, 8, 12, 'Online', 2, '', '2025-10-24 10:06:10'),
(12, 9, 12, 'Online', 1, '', '2025-10-24 13:31:26'),
(13, 9, 12, 'Online', 3, '', '2025-10-25 03:39:36'),
(14, 9, 12, 'Online', 1, '', '2025-10-25 03:49:14'),
(15, 9, 12, 'Online', 2, '', '2025-10-25 03:50:34'),
(16, 10, 12, 'Online', 7, '', '2025-10-25 04:08:47'),
(19, 10, 12, 'Online', 1, '', '2025-10-25 04:18:50'),
(20, 10, 12, 'Online', 1, '', '2025-10-25 04:21:12'),
(21, 10, 12, 'Online', 2, '', '2025-10-25 04:22:15'),
(22, 10, 12, 'Online', 2, '', '2025-10-25 04:25:43'),
(23, 11, 12, 'Online', 3, '', '2025-10-25 04:30:23'),
(24, 11, 12, 'Online', 4, '', '2025-10-25 04:31:21'),
(28, 15, 12, 'Online', 8, '', '2025-10-25 04:56:16'),
(29, 15, 12, 'Online', 1, '', '2025-10-25 06:15:31'),
(30, 8, 12, 'Online', 2, '', '2025-10-25 06:15:57'),
(31, 10, 9, 'Online', 1, '', '2025-10-25 08:18:23'),
(32, 10, 9, 'Online', 2, '', '2025-10-25 08:20:43'),
(33, 10, 9, 'Online', 2, '', '2025-10-25 08:21:31'),
(34, 10, 9, 'Online', 3, '', '2025-10-25 08:21:52');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_suppliers`
--

CREATE TABLE `tbl_suppliers` (
  `id` int NOT NULL,
  `supplier_name` varchar(100) NOT NULL,
  `contact_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tbl_suppliers`
--

INSERT INTO `tbl_suppliers` (`id`, `supplier_name`, `contact_name`, `phone`, `email`, `address`, `created_at`) VALUES
(2, 'Leuy llm', 'Leuy', '098765432', 'leuy@gmail.com', '456 Street Rd, Phnom Penh', '2025-10-08 09:20:20'),
(3, 'Heng visal', 'Alice Lim', '011223344', 'sales@furnico.com', '789 Furniture Ave, Phnom Penh', '2025-10-08 09:20:20'),
(4, 'FreshFoods', 'Bob Chan', '015667788', 'info@freshfoods.com', '321 Market St, Phnom Penh', '2025-10-08 09:20:20'),
(5, 'Leuy', 'Leuy llm', '0975894543', 'leuy@gmail.com', 'Siem Reap', '2025-10-16 06:43:12'),
(6, 'Supplier 6 test', 'Contact 6', 'Phone 6', 'Email 6', 'Address 6', '2025-10-16 06:44:43'),
(10, 'Bopha', 'bopha12', '09758945432', 'bopha@gmail.com', 'siem reap', '2026-04-28 08:50:47');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `role_id` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`id`, `username`, `email`, `password`, `address`, `role_id`, `created_at`, `isDeleted`) VALUES
(6, 'john', 'john@example.com', '$2b$10$u3fV5b4D8F2kS1r3v9G8jOoZB1h2Q1F4k3N0m6wP5d8Q2t9R6fE5u', '456 John Avenue', '5', '2025-10-14 09:12:34', 0),
(8, 'admin', 'admin@example.com', '$2b$10$AMw7G.ONTl2YLLD.gIwn3.WpY30QSg3ssBKK7p9sVkPgPvL3kQn9S', 'Siem Reap Municipality', NULL, '2025-10-14 09:24:05', 0),
(9, 'Hong', 'heng@gmail.com', '$2b$10$xmEBk06klzTzuuk3k1wsVeloKihVL8lwJlwGftd4k8QsOBKGAq9C6', NULL, '6', '2025-10-20 07:02:39', 0),
(10, 'linda', 'linda@gmail.com', '$2b$10$HWqfycLp7EoSBq1Me02AbefNHdCW9CguNndCS9GomH50UGi183y/e', 'Oddor', '4', '2025-10-20 07:06:59', 0),
(11, 'leuyllm', 'leuy@gmail.com', '$2b$10$R8nJe4mKAWQ0HS7CYUZBPOyP13H8U/Jw2Q9sSEeL8td9X6mIJxCJG', 'Siem Reap Municipality', NULL, '2025-10-20 07:21:55', 0),
(12, 'vin', 'vin@gmail.com', '$2b$10$i3ivkzYeIfTll4qIwcLAcORBtlTZI3nzjpIKnOzpoyFcoanYIEeSe', 'Seimreap', '4', '2025-10-24 04:07:00', 0),
(13, 'leuyllm', 'leuyllm@gmail.com', '$2b$10$W7VH6CRK2jlBUxUt7PNEE.OpnZHrkUqDQ8e67/BrqQtsYQmrrVkbu', 'Phnom Penh', '4', '2026-04-28 08:10:37', 0),
(14, 'hong', 'hong@gmail.com', '$2b$10$MUDIQ8.JSpnJ4s74yqDBj.OjMGVRmxIIAO3MaDS0UcsWiKecFQVBC', 'Oddor', '5', '2026-04-28 08:59:56', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_categories`
--
ALTER TABLE `tbl_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_permissions`
--
ALTER TABLE `tbl_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permission_name` (`permission_name`);

--
-- Indexes for table `tbl_products`
--
ALTER TABLE `tbl_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `supplier_id` (`supplier_id`);

--
-- Indexes for table `tbl_roles`
--
ALTER TABLE `tbl_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `tbl_stock_transactions`
--
ALTER TABLE `tbl_stock_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `tbl_suppliers`
--
ALTER TABLE `tbl_suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_categories`
--
ALTER TABLE `tbl_categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `tbl_permissions`
--
ALTER TABLE `tbl_permissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `tbl_products`
--
ALTER TABLE `tbl_products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `tbl_roles`
--
ALTER TABLE `tbl_roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_stock_transactions`
--
ALTER TABLE `tbl_stock_transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `tbl_suppliers`
--
ALTER TABLE `tbl_suppliers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_products`
--
ALTER TABLE `tbl_products`
  ADD CONSTRAINT `tbl_products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `tbl_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_products_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `tbl_suppliers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_stock_transactions`
--
ALTER TABLE `tbl_stock_transactions`
  ADD CONSTRAINT `tbl_stock_transactions_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `tbl_products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
