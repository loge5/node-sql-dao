CREATE TABLE `example` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO dao_example.example (id, name, created) VALUES(1, 'FOO', '2019-03-12 16:35:03.000');
INSERT INTO dao_example.example (id, name, created) VALUES(2, 'BAR', '2019-03-12 16:35:03.000');

CREATE TABLE `customer` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `order` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `customerId` int(10) unsigned NOT NULL,
  `amount` decimal(10,0) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_FK` (`customerId`),
  CONSTRAINT `order_FK` FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `item` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `item_order` (
  `itemId` int(10) unsigned NOT NULL,
  `orderId` int(10) unsigned NOT NULL,
  KEY `item_order_order_FK` (`orderId`),
  KEY `item_order_FK` (`itemId`),
  CONSTRAINT `item_order_FK` FOREIGN KEY (`itemId`) REFERENCES `item` (`id`),
  CONSTRAINT `item_order_order_FK` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `customer` (id, name) VALUES(1, 'Testi Tester');
INSERT INTO `order` (id, customerId, amount) VALUES(1, 1, 10);
INSERT INTO `item` (id, description) VALUES(1, 'Mate');
INSERT INTO `item_order` (itemId, orderId) VALUES(1, 1);

