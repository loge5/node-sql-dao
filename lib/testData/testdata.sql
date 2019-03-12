CREATE TABLE `example` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO dao_example.example (id, name, created) VALUES(1, 'FOO', '2019-03-12 16:35:03.000');
INSERT INTO dao_example.example (id, name, created) VALUES(2, 'BAR', '2019-03-12 16:35:03.000');