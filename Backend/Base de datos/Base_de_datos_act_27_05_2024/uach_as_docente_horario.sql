CREATE DATABASE  IF NOT EXISTS `uach_as` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `uach_as`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: uach_as
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `docente_horario`
--

DROP TABLE IF EXISTS `docente_horario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `docente_horario` (
  `id_docente_horario` int NOT NULL AUTO_INCREMENT,
  `id_docente` int DEFAULT NULL,
  `id_horario` int DEFAULT NULL,
  `ocupado` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id_docente_horario`),
  KEY `fk_id_docente` (`id_docente`),
  KEY `fk_id_horario` (`id_horario`),
  CONSTRAINT `fk_id_docente` FOREIGN KEY (`id_docente`) REFERENCES `docentes` (`Id_docente`),
  CONSTRAINT `fk_id_horario` FOREIGN KEY (`id_horario`) REFERENCES `horarios` (`id_horario`)
) ENGINE=InnoDB AUTO_INCREMENT=224 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `docente_horario`
--

LOCK TABLES `docente_horario` WRITE;
/*!40000 ALTER TABLE `docente_horario` DISABLE KEYS */;
INSERT INTO `docente_horario` VALUES (101,9876,1,0),(102,9876,2,0),(103,9876,3,0),(104,9876,4,0),(105,9876,5,1),(106,9876,6,0),(107,9876,7,0),(108,9876,8,0),(109,9876,9,0),(110,9876,10,0),(111,9876,11,0),(112,9876,12,0),(113,9876,13,0),(114,9876,14,0),(115,9876,15,0),(116,9876,16,0),(117,9876,17,0),(118,9876,18,0),(119,9876,19,0),(120,9876,20,0),(121,9876,21,0),(122,9876,22,0),(123,9876,23,0),(124,9876,24,0),(125,9876,25,0),(126,9876,26,0),(127,9876,27,0),(128,9876,28,0),(129,9876,29,0),(130,9876,30,0),(131,9876,31,0),(132,9876,32,0),(133,9876,33,0),(134,9876,34,0),(135,9876,35,0),(136,9876,36,0),(137,9876,37,0),(138,9876,38,0),(139,9876,39,0),(140,9876,40,0),(141,9876,41,0),(142,9876,42,0),(143,9876,43,0),(144,9876,44,0),(145,9876,45,1),(146,9876,46,0),(147,9876,47,0),(148,9876,48,0),(149,9876,49,0),(150,9876,50,0),(151,2419,1,0),(152,2419,2,0),(153,2419,3,0),(154,2419,4,0),(155,2419,5,1),(156,2419,6,0),(157,2419,7,0),(158,2419,8,0),(159,2419,9,0),(160,2419,10,0),(161,2419,11,0),(162,2419,12,0),(163,2419,13,0),(164,2419,14,0),(165,2419,15,0),(166,2419,16,0),(167,2419,17,0),(168,2419,18,0),(169,2419,19,0),(170,2419,20,0),(171,2419,21,0),(172,2419,22,0),(173,2419,23,0),(174,2419,24,0),(175,2419,25,0),(176,2419,26,0),(177,2419,27,0),(178,2419,28,0),(179,2419,29,0),(180,2419,30,0),(181,2419,31,0),(182,2419,32,0),(183,2419,33,0),(184,2419,34,0),(185,2419,35,0),(186,2419,36,0),(187,2419,37,0),(188,2419,38,0),(189,2419,39,0),(190,2419,40,0),(191,2419,41,0),(192,2419,42,0),(193,2419,43,0),(194,2419,44,0),(195,2419,45,0),(196,2419,46,0),(197,2419,47,0),(198,2419,48,0),(199,2419,49,0),(200,2419,50,0),(201,4587,2,0),(202,4587,3,0),(203,4587,4,0),(204,4587,5,0),(205,4587,30,0),(206,4587,31,0),(207,4587,43,0),(208,4587,45,0),(209,870102,4,0),(210,870102,5,0),(211,870102,6,0),(212,870102,10,1),(213,870102,11,1),(214,870102,12,1),(215,543292,3,0),(216,543292,4,0),(217,543292,5,0),(218,543292,14,0),(219,543292,24,0),(220,543292,25,0),(221,543292,34,0),(222,543292,35,0),(223,543292,50,0);
/*!40000 ALTER TABLE `docente_horario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-27  0:40:32