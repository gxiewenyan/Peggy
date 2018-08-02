/*
SQLyog Ultimate v12.09 (64 bit)
MySQL - 8.0.12 : Database - peggy
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`peggy` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `peggy`;

/*Table structure for table `pg_administrative_cost_details` */

DROP TABLE IF EXISTS `pg_administrative_cost_details`;

CREATE TABLE `pg_administrative_cost_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cost_id` int(11) NOT NULL,
  `phone` decimal(10,2) DEFAULT NULL COMMENT '固定电话费',
  `mobile` decimal(10,2) DEFAULT NULL COMMENT '手机费',
  `post` decimal(10,2) DEFAULT NULL COMMENT '邮电费',
  `books` decimal(10,2) DEFAULT NULL COMMENT '书报杂志费',
  `other` decimal(10,2) DEFAULT NULL COMMENT '其他办公费',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `cost_id_idx` (`cost_id`),
  CONSTRAINT `administrative_cost_id` FOREIGN KEY (`cost_id`) REFERENCES `pg_cost` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `pg_administrative_cost_details` */

/*Table structure for table `pg_cost` */

DROP TABLE IF EXISTS `pg_cost`;

CREATE TABLE `pg_cost` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `office_id` int(11) NOT NULL COMMENT '外键，科室ID',
  `total_cost` decimal(10,0) NOT NULL COMMENT '总成本',
  `labour_cost` decimal(10,0) DEFAULT NULL COMMENT '人工成本（工资（含政府补助），社保费，商业保险费，福利费，教育培训费，工会费，劳动保护费，住房费，技术奖酬费，非货币福利，其他人工成本）',
  `administrative_cost` decimal(10,0) DEFAULT NULL COMMENT '办公费（固话费，手机费，邮电费，书报杂志费，其他办公费）',
  `depreciation_cost` decimal(10,0) DEFAULT NULL COMMENT '折旧费',
  `variable_cost` decimal(10,0) DEFAULT NULL COMMENT '可变动成本（差旅费，水电费，修理费，低值易耗品摊销，租赁费  等）',
  `year` int(11) NOT NULL COMMENT '成本发生所在年份',
  `month` int(11) NOT NULL COMMENT '成本发生所在月份',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `id_idx` (`office_id`),
  CONSTRAINT `id` FOREIGN KEY (`office_id`) REFERENCES `pg_offices` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `pg_cost` */

/*Table structure for table `pg_labour_cost_details` */

DROP TABLE IF EXISTS `pg_labour_cost_details`;

CREATE TABLE `pg_labour_cost_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cost_id` int(11) NOT NULL COMMENT '外键，成本ID',
  `salary` decimal(10,2) DEFAULT NULL COMMENT '工资（含政府补助）',
  `social_security` decimal(10,2) DEFAULT NULL COMMENT '社会保险费用',
  `commercial_insurance` decimal(10,2) DEFAULT NULL COMMENT '商业保险费用',
  `allowance` decimal(10,2) DEFAULT NULL COMMENT '福利费',
  `training` decimal(10,2) DEFAULT NULL COMMENT '教育培训经费',
  `trade_union` decimal(10,2) DEFAULT NULL COMMENT '工会经费',
  `labor_protection` decimal(10,2) DEFAULT NULL COMMENT '劳动保护费用',
  `housing` decimal(10,2) DEFAULT NULL COMMENT '住房费用',
  `tech_award` decimal(10,2) DEFAULT NULL COMMENT '技术奖酬金',
  `non_monetary` decimal(10,2) DEFAULT NULL COMMENT '非货币福利',
  `other` decimal(10,2) DEFAULT NULL COMMENT '其他人工成本',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `labour_cost_idx` (`cost_id`),
  CONSTRAINT `labour_cost_id` FOREIGN KEY (`cost_id`) REFERENCES `pg_cost` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `pg_labour_cost_details` */

/*Table structure for table `pg_offices` */

DROP TABLE IF EXISTS `pg_offices`;

CREATE TABLE `pg_offices` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id，自增',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '科室名',
  `code` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '科室编号,业务ID',
  `parent_id` int(11) DEFAULT NULL COMMENT '上级科室ID',
  `parent_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '上级科室名',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_UNIQUE` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `pg_offices` */

insert  into `pg_offices`(`id`,`name`,`code`,`parent_id`,`parent_name`) values (1,'技术服务','00003',NULL,NULL),(2,'管理部','00001',NULL,NULL),(3,'检测综合技术室','00002',NULL,NULL),(4,'质管部','00004',NULL,NULL),(5,'科研中心','00005',NULL,NULL);

/*Table structure for table `pg_variable_cost_details` */

DROP TABLE IF EXISTS `pg_variable_cost_details`;

CREATE TABLE `pg_variable_cost_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cost_id` int(11) NOT NULL,
  `trip` decimal(10,2) DEFAULT NULL COMMENT '差旅费',
  `water_eletric` decimal(10,2) DEFAULT NULL COMMENT '水电费',
  `repair` decimal(10,2) DEFAULT NULL COMMENT '修理费',
  `Consumable` decimal(10,2) DEFAULT NULL COMMENT '低值易耗品摊销',
  `rental` decimal(10,2) DEFAULT NULL COMMENT '租赁费',
  `meeting` decimal(10,2) DEFAULT NULL COMMENT '会议费',
  `advertisement` decimal(10,2) DEFAULT NULL COMMENT '广告费',
  `greening` decimal(10,2) DEFAULT NULL COMMENT '绿化费',
  `hospitality` decimal(10,2) DEFAULT NULL COMMENT '业务招待费',
  `decoration` decimal(10,2) DEFAULT NULL COMMENT '装修工程',
  `sales_service` decimal(10,2) DEFAULT NULL COMMENT '销售服务费',
  `consultant` decimal(10,2) DEFAULT NULL COMMENT '咨询费/审计费',
  `services` decimal(10,2) DEFAULT NULL COMMENT '出版/文献/信息传播/知识产权事务费',
  `sampling` decimal(10,2) DEFAULT NULL COMMENT '抽样费',
  `inspection` decimal(10,2) DEFAULT NULL COMMENT '商品检验费及外协费',
  `tax` decimal(10,2) DEFAULT NULL COMMENT '税金',
  `cleaning` decimal(10,2) DEFAULT NULL COMMENT '卫生保洁费',
  `vehicle` decimal(10,2) DEFAULT NULL COMMENT '汽车费用',
  `other` decimal(10,2) DEFAULT NULL COMMENT '其他',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `cost_id_idx` (`cost_id`),
  CONSTRAINT `variable_cost_id` FOREIGN KEY (`cost_id`) REFERENCES `pg_cost` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `pg_variable_cost_details` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
