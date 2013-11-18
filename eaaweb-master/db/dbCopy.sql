-- MySQL dump 10.13  Distrib 5.5.34, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: emergencyAssistantApp
-- ------------------------------------------------------
-- Server version	5.5.34-0ubuntu0.12.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `agency`
--

DROP TABLE IF EXISTS `agency`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `agency` (
  `agencyPhoneNumber` varchar(15) DEFAULT NULL,
  `agencyName` varchar(50) DEFAULT NULL,
  `category` varchar(15) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agency`
--

LOCK TABLES `agency` WRITE;
/*!40000 ALTER TABLE `agency` DISABLE KEYS */;
INSERT INTO `agency` VALUES ('7877858416','firefigther','firefighter','Mayagüez','PR','PR'),('7879390000','vida hospital','hospital','Mayagüez','PR','PR'),('7874510000','policia','police','Ponce','PR','PR'),('7871240000','grua','tow','Loiza','PR','PR'),('7879000000','bombero rincon','firefighter','Rincon','PR','PR'),('7873000000','salud','ambulance','Loiza','PR','PR'),('7873110000','bombero','firefighter','San Juan','PR','PR'),('7876660000','auxilio','ambulance','Guanica','PR','PR'),('7878887000','vida','ambulance','Corozal','PR','PR'),('7877858414','health ambulance ','ambulance','Cabo Rojo','PR','PR'),('7875300000','policia yauco','police','Ponce','PR','PR'),('7877858415','policia ponce','police','Ponce','PR','PR'),('7874110000','policia cabo rojo','police','Cabo Rojo','PR','PR'),('7877850000','medical','hospital','Ponce','PR','PR');
/*!40000 ALTER TABLE `agency` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alternativeArea`
--

DROP TABLE IF EXISTS `alternativeArea`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alternativeArea` (
  `agencyPhoneNumber` varchar(15) DEFAULT NULL,
  `altArea` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alternativeArea`
--

LOCK TABLES `alternativeArea` WRITE;
/*!40000 ALTER TABLE `alternativeArea` DISABLE KEYS */;
INSERT INTO `alternativeArea` VALUES ('7877858416','Mayagüez'),('7879390000','Mayagüez'),('7874510000','Ponce'),('7871240000','Loiza'),('7879000000','Rincon'),('7873000000','Loiza'),('7873110000','San Juan'),('7876660000','Guanica'),('7876660000','Culebra'),('7878887000','Corozal'),('7877858414','Cabo Rojo'),('7875300000','Ponce'),('7875300000','Yauco'),('7877858415','Ponce'),('7874110000','Cabo Rojo'),('7877850000','Ponce');
/*!40000 ALTER TABLE `alternativeArea` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alternativePhoneNumber`
--

DROP TABLE IF EXISTS `alternativePhoneNumber`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alternativePhoneNumber` (
  `agencyPhoneNumber` varchar(15) DEFAULT NULL,
  `altPhoneNumber` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alternativePhoneNumber`
--

LOCK TABLES `alternativePhoneNumber` WRITE;
/*!40000 ALTER TABLE `alternativePhoneNumber` DISABLE KEYS */;
INSERT INTO `alternativePhoneNumber` VALUES ('7877858416','7877858416'),('7879390000','7879390000'),('7874510000','7874510000'),('7871240000','7871240000'),('7879000000','7879000000'),('7873000000','7873000000'),('7873110000','7873110000'),('7876660000','7876660000'),('7876660000','7871140000'),('7878887000','7878887000'),('7877858414','7877858414'),('7875300000','7875300000'),('7875300000','7871160000'),('7877858415','7877858415'),('7874110000','7874110000'),('7877850000','7877850000');
/*!40000 ALTER TABLE `alternativePhoneNumber` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coordinate`
--

DROP TABLE IF EXISTS `coordinate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coordinate` (
  `agencyPhoneNumber` varchar(15) DEFAULT NULL,
  `latitude` varchar(15) DEFAULT NULL,
  `longitude` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coordinate`
--

LOCK TABLES `coordinate` WRITE;
/*!40000 ALTER TABLE `coordinate` DISABLE KEYS */;
INSERT INTO `coordinate` VALUES ('7879390000','18.1557','-67.1417'),('7877850000','18.1557','-67.1417');
/*!40000 ALTER TABLE `coordinate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deviceAccount`
--

DROP TABLE IF EXISTS `deviceAccount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `deviceAccount` (
  `clientPhoneNumber` varchar(15) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `latitude` varchar(15) DEFAULT NULL,
  `longitude` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deviceAccount`
--

LOCK TABLES `deviceAccount` WRITE;
/*!40000 ALTER TABLE `deviceAccount` DISABLE KEYS */;
INSERT INTO `deviceAccount` VALUES ('100','pedro','18.4500','-66.0667'),('150','JORGE','18.4500','-66.0667'),('7879008000','LUIS','18.2011','-67.1397'),('333','pil','18.4500','-66.0667'),('854','pali','18.4500','-66.0667'),('7879006000','kola','18.4500','-66.0667'),('7879009000','kilo','18.4500','-66.0667'),('7879007000','pilo','18.2011','-67.1397'),('7874729078','carlos','18.0867','-67.1458'),('7875008000','marco','18.0867','-67.1458');
/*!40000 ALTER TABLE `deviceAccount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emergencyData`
--

DROP TABLE IF EXISTS `emergencyData`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `emergencyData` (
  `clientPhoneNumber` varchar(15) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `resolved` varchar(5) DEFAULT NULL,
  `emergencyType` varchar(50) DEFAULT NULL,
  `emergencyDetail` varchar(1000) DEFAULT NULL,
  `clientName` varchar(50) DEFAULT NULL,
  `clientAddress` varchar(1000) DEFAULT NULL,
  `latitude` varchar(15) DEFAULT NULL,
  `longitude` varchar(15) DEFAULT NULL,
  `outsideHome` varchar(15) DEFAULT NULL,
  `agencyPhoneNumber` varchar(15) DEFAULT NULL,
  `attendedBy` varchar(30) DEFAULT NULL,
  `timeCompleted` datetime DEFAULT NULL,
  `timeElapsed` varchar(50) DEFAULT NULL,
  `hasApplication` varchar(5) DEFAULT NULL,
  `onRelay` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emergencyData`
--

LOCK TABLES `emergencyData` WRITE;
/*!40000 ALTER TABLE `emergencyData` DISABLE KEYS */;
INSERT INTO `emergencyData` VALUES ('967','2013-10-18 00:00:00','no','kill','no podemos','manuel','capetillo','18.2400','-67.1387','yes','7877858415','milky','0000-00-00 00:00:00','34','yes','no'),('301','2013-10-17 12:15:10','yes','crash','no podemos','manuel','capetillo','18.2400','-67.1387','yes','7877858415','jack','0000-00-00 00:00:00','15','yes','no'),('933','2013-10-17 12:15:10','yes','kill','no podemos','manuel','capetillo','18.2400','-67.1387','no','7877858415','milky','0000-00-00 00:00:00','30','no','no'),('7873003000','2013-10-20 12:15:00','yes','crash','no podemos','manuel','capetillo','18.2400','-67.1387','yes','7877858416','pedro','0000-00-00 00:00:00','45','yes','yes'),('7874729078','2013-10-20 12:15:00','yes','crash','accidente','jose','alturas','18.2400','-67.1387','yes','7877858416','pedro','2013-10-20 12:30:00','15','yes','no'),('7875008000','2013-11-17 19:09:51',NULL,NULL,'d','pablo','bosque','18.0867','-67.1458','No',NULL,'jack',NULL,'45789',NULL,'no');
/*!40000 ALTER TABLE `emergencyData` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transferDetail`
--

DROP TABLE IF EXISTS `transferDetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transferDetail` (
  `clientPhoneNumber` varchar(15) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `reason` varchar(1000) DEFAULT NULL,
  `oldAgencyPhoneNumber` varchar(15) DEFAULT NULL,
  `newAgencyPhoneNumber` varchar(15) DEFAULT NULL,
  `onRelay` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transferDetail`
--

LOCK TABLES `transferDetail` WRITE;
/*!40000 ALTER TABLE `transferDetail` DISABLE KEYS */;
INSERT INTO `transferDetail` VALUES ('967','2013-10-18 00:00:00','no podemos','805','954','no'),('301','2013-10-17 12:15:10','no podemos','872','982','no'),('933','2013-10-17 12:15:10','no podemos','220','551','no'),('7873003000','2013-10-20 12:15:00','no podemos','111','666','yes');
/*!40000 ALTER TABLE `transferDetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userAccount`
--

DROP TABLE IF EXISTS `userAccount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userAccount` (
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `agencyPhoneNumber` varchar(30) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userAccount`
--

LOCK TABLES `userAccount` WRITE;
/*!40000 ALTER TABLE `userAccount` DISABLE KEYS */;
INSERT INTO `userAccount` VALUES ('marvin','m','goli@gmail.com','employee','7877858414','marvin'),('label','l','label@gmail.com','employee','7877858414','black'),('cal','c','cal@mail.com','employee','7877858414','california'),('milky','m','milky@mail.com','employee','7877858415','chocolate'),('jack','c','jack@mail.com','employee','7877858415','jack'),('mon','m','mon@mail.com','employee','7877858416','money'),('pedro','p','pedro@mail.com','employee','7877858416','pedro'),('admin','admin','admin@mail.com','admin','0','admin');
/*!40000 ALTER TABLE `userAccount` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-11-18 10:52:59
