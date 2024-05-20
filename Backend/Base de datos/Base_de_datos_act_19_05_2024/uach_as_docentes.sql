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
-- Table structure for table `docentes`
--

DROP TABLE IF EXISTS `docentes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `docentes` (
  `Id_docente` int NOT NULL,
  `nombre_doc` varchar(100) NOT NULL,
  `Apellido` varchar(100) NOT NULL,
  `id_mat_as` int NOT NULL,
  `id_carrera_mat` int DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `apei2` varchar(100) DEFAULT NULL,
  `perfil` blob,
  `rol_doc` varchar(50) DEFAULT NULL,
  `contra_docente` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id_docente`),
  KEY `Mat_as_idx` (`id_mat_as`),
  KEY `NMat_as_idx` (`id_carrera_mat`),
  CONSTRAINT `num_carrera` FOREIGN KEY (`id_carrera_mat`) REFERENCES `carrera` (`Id_Carreras`) ON UPDATE CASCADE,
  CONSTRAINT `num_materia` FOREIGN KEY (`id_mat_as`) REFERENCES `materias` (`Id_Materias`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `docentes`
--

LOCK TABLES `docentes` WRITE;
/*!40000 ALTER TABLE `docentes` DISABLE KEYS */;
INSERT INTO `docentes` VALUES (0,'Opciones','',0,0,'opciones@uach.mx','',_binary '�\��\�\0JFIF\0\0\0\0\0\0�\�\0�\0	( \Z%!1!%)+...383-7(-.+\n\n\n\r\Z\Z+-----------------+-------------------------------+��\0\0�,\"\0�\�\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0�\�\0<\0\0\0\0\0!1AQaq\"������\�2BR\���#3br��C��\�\0\0\0\0\0\0\0\0\0\0\0\0\0\0�\�\0$\0\0\0\0\0\0\0\0\0!1AQ2\"#BR�\�\0\0\0?\0\�6�N��ʸB\�R\�\�\�)����\�j(�ԧr�\�Mk �r\�+)��NT����>�A���\�\�I12zAtԺsX��IE!Qm��YY<U�F@D,:�W;\\��\rW���{\�\�7�$�ϡZL>���\�N\�^s\�\�J坟�]�\�\�h\�m�:\�Fo�9�\���\0��H\����\�=nπ�fd�\0��\�pcU�\�\���Զ\���\�K\�70\�o?\"GPN�\�\�\�3+�;?S8\�\�CI6�\�LN\�\�9��\�L�ؒ.t\Z˜,5\���\�T\�8e�\�x<y\��D`��\�λ�7|�5a�0�K��%�b\0E�\"�:#�����\�$fh�\�0Lkz\�\�\���L���\��*J�\�\�\��\r\�0t�\�1�^��;.�Q\�0\0�\��k�v�\�H0\�lY�4И��AI���J���!�=6��\"�l�\�D�0풛���	a.�U{�%���	M�\�5��A\�e;܆�T�*\�1C�\"\�J\�D�\�5Īכ�,b�y��\"\'aʛ�\�E\"\n\�l�\"\�|�W\n�e%��\��J\�2�g��Qy�\�\�yu�l�G[2mӾ�i��{��k9\��̖+��63����%$�\Z@o\�\�eW�}\�sN�uU�\�T�\�*9�x0�s�\nޝ\0A\��YJN\�RTT�\�\�l�C�m	��;�{�g�DgM�I�y��ŉ˗цl\�.\�&\�-\�~�|I]up\0u�Y\�w�b.Uc��i\�?�\�F\��-���R8^V\�k�m&E�\�t\�\�!Y\�\�x�\0:u\r\�v��hVb�F\�\�<\�+�lY���)E1\�m3I���	d�\�2\�\�P,@�\n\�Ǩ)>!��\�`�0`p�\�Uƿ,J\�C�f\�t\�����6cY��\\\�d\�v�׎(\�8��G�XJ�f��ۆ�\�ICm�]\�|�\�\�f\�*=�����_�A�\�\�V{fv��\�y-^�^%�B�\�\�\�6?�\�2\�E��A6-\��^r����N��	�\�#�޽��k�C�\"7��>�3��/t@9@0\�PD8k9\�\�%h��<�a\�\�A[Z`؈�;��\�9�]�[�Y�n� �~h	�\�!]Sr�\���\�D6�\�\n��MF\�\�j`�&\�\�ۢ�Ɛ���jM�)�(,�\�V\�~1\�\�\�$�W\�k�V�b0��\�\�10��g,Q�\�\�2�av�\�\�HW�KK\n\�\�_\�+��)[*R\�Ut\�*:XJ�қ�\0�ǚ6�ƬuhoW���fIv\�\�1yW1x\�\�\�����~\�쎣�÷�f<\\I�\�\�\nL\�h�Xz\�=ւO\0	>��;\�\�\r^@���WC\0���\��P��>/$�H\�d��]U�\Z}L+���κB�\�\�\�	F�2��WaL�I\�=��h<%Mgީ\Z�H\Z���m�ⱹl�z���ړ�@\���\�᱿�I\ro�\�\�c\����{�p\r\�%=l\�74��\����H�>$�J\�\�\�U�V�@��\�դk��9�+\�\�hoˑRס��7&��6��q\�\�<�\�Sd���ǆq@\�c\����ɔi\�y<�T�o>��\�\00\�I\�\Z~�Ҿ\�I#_��\�\�i�\�}2=\"�w����>8\�\�M\�\�\�ϊ��6�b\�Ҩj\�\�CK%\�cp-��$tQ�+\�4�O�\�p��\�`xЍ>ag�\�4R�\�. �o��S�`9� \�\�\�m;�Ḭ?h��eW���^�\�\�\�\�cwV7}.˪[L=�\�;/\�\0\�9��\�\�T2Z\�8\�k�ćJ\�\�\�\�Ǻ-\�9�E�\�3�l\�\���%f�\��\�4�1ܟ,>w\n���\�̖8���eGj�h�mǍ%E���\�\�\r\�Oh��*��x���Ҙ\�\�U\�>jvv���Q�o�\�?�T��n�O\n����D��8�}S_�X\��(1\�^s	��\�Iz*��s�\n\�\�l\�k�\�wM\�G7\n�\�\�;Ev-�UP�pWC#��*\�	�TA�r\�9b赯�n��\�k��6<�=U���\�1���\�uң\�o\�&\�fm�l\�\�T�P\��T\rj/�sy�\�\�\'\�\Z��^\�*��2�>�Sa�\�͝c\�\�8v;�Ѵq\��j���|tC9�:���ÀP\�:ak��\�@Z$=U�iT\0f3�Sb�r�O	h6\��\�5\�ESE��l\�x��4ݕ\�p\�O@�\�\�r�<��3\�Wv)mg��\�\�\�<\�hc\\\�S\�XO\� �X\�4��\�+\��\�O1\�\����h�,A$Ө,�ȍ\�1[���\�.\�s\�\�9G�8FK��;nҦ\�%Ś\\wO�\�W[\n�s2�\r�t\�P\�Ow\��*�\�� \�y|~V�\�\�\���22�ӗ�G/��\�?\�(q�Ŧ}T\�b[r\�黪\�.�a�2�\0�pIU���拘�d��F��\��Yj5�AkZ\�e��q�˂\�1��h��i�\�D��\�*RR�˄�\�(\�;lA�T/��l:���~\�c�Vĸ7,<�]�4\Z[�V���bn*�\�9�=U\�\�#-66�yjy���C�\�aڏ\��\��L�\Z���I\�x�\�\��y�p\�\��:9�\�U�\�\�=��oרX\�\�\��?��\�(?\",�\�\��\�Y\�3M��	J�(��\0:%�X�\�+)�\�ãiPT�(\�\�!���a�\�\�ɰ�<�k�\�$�\�MbL��tXɤ-�%��\�}8\r�(\�[��U0UX\�\�I���Bb\n\�+YB箈�\rX \\uބ%j���>�\�1q\�u3�T\�YU\�u\�\�k!!\���89@�(�̜\�\�hH\�c\�\�*��*\r\�����m?x\n�5\�-Q5\�h\�c�0\�:�\��Q�\�9Ŝ�j�\��曏\��{I�\\;\��G.�Ww\��b�\�o\�f8�VObg-?\r�$n�\�\�[T�[j�/���\�\�ܹ/[���R[9,ѭ�\�B��;Ͽ�6`\�4���Ǥ.\�\�ߚ~K3���S�G�\�\�	\�I�)��7\�j�@B��X5#^!SS�\�:@Mu�\�\�Ff�\�թ��\�-�\�2�궖�cO8棫�wz{�R�.1H\�T\�\r\�wb��f$\r\�\�%ڻI�M��\']{3eFǳ�ܥ\�{��\�<�\�\�w��\�q_U\��I\��@[�Q\�\��Ì�\�\�ne\�f#p\�\�h�P\�5��\�@��YmM��\�}��\Z�r�\�\r\�O�h�Sf9�\�h.kn\��<�_vW��a$�\0\�nl��\��\�\���׎�_l\�\�<���ǂ�\�E\\�9�s�s�z���.:�\�FʊH��D\rw���\n�E@ꉿ1\�9R��e:뮬��\'\�[EQi�Tr�R\"�c\\\�\�L)����z��J\�P5�¤��5�8$�-;:\��ք��:�\�0�sQ\�\�u\�7�$	��\"�[;\���Tx\�`�\�r(�a�\�@\0�-vɉQd��9\�S!�$��:��W\�({m}X�#swn1\�\�uJZw\�\���fz�:�C\�\�\�F�\�8\'�\�,Al~\�Jʔ\�\rE\�cjl\n\�\�4�\�\�)ܩzfS�\�|`l�F�U���o\�OB	�)�\�`�?�\��z�\"\�4m\�\�GSѽg�[\�\��M\�\�uC��y�\�J5h��־/2\Z�0\rO��\0\�OCa\�u\�8���ܮp[�.\Z\'���)6��\�\Z�\��\0�~��\�\�Dm+YOዸ�I:��\�^bj��*\n\�.q�T�\�E\"<-\�\�\Z��zΧ\r��x�T]�\�n#\��\�\0\�\�lv~\r�$ܝ\�\��YדK�[l,;]}�4\�6�\�a�0\�9��ش�Z#K\�A�$�:ϊ��=�,\�\�ڤy\�lp�����\0!\��\0�rϽ\�\�{{�]R�j�I�9�\�!ԁȏR�\�\�c8\�\ZcÔnz\�eDP\�T(W\"�ȴCО\ZS�T�\�\�D:\'JU�\�Eɖ\���U�����+��T\�	\�\�\�T��iW\���0�WcVU]t�_B$YVF\�+-�\�.w��4\�X�-�i$�\�\�o�X\�>R\�5)\�PUt�Qb�fŇ�O�\�4�h�	\��ZFs�|�JVv�ѯC�Q\��\�\�\�\�\�-1�\�n\�Um^χ��\�w����:�kj�59�܈\��ݜĸ��X?T\�\'�XF�����\0���C؈\�!�\0\�\�(�#h\ZLZ\�\��*LS*\�yc�ƄqO�I�E1\�4�\�)�q#��_R\�\�\�~�z�\�lZ-�R���<�e\r<\�\�\�6U�aҥr3����i�V��h�\�ZO_��`���\0�\�>~IR�A�\�-nG\�6\"\�r�\�\��)e�_�k�\���~Rg�\�yx�\�%[p��,VƮ\Z\�&&~@_�-]\'�\�O���\\\�k\�.C\��}�\0;D@�^\�{�ˈ[\n-c\�mA��\Z\�Κg�A�Nj3j�kT�#;�4�\�#�\nThԏ\�B$(KRaC!(O!(Lj1@i�HM,N\�G~`eՎD\�R�2�v1<\�)��e@ٗw\'է	�ڊ\n#4\�qÄCh�)R\0I\�\���M\�.\�w�\�\�V�w�\�G�\�rӻ�<O%Z�\0\ZƼ\��6Gd\�e\�lޘ\�\�\�q*J?��j�M\�\�je\�`\�U6�\ny⃧Xj�\�b�i\�\�\�H��_�h��2/0\"#WO ����\\Ha\�w\�\�ߺ3Syt�g\�&\�\Z\r\�`�\�p \0\���\�\��\�\���\�h\�\��\��1\�\�=�6\r&\�\0@�yG��g�Q\��\�z�\�\�:zi�I�-�{ܖ\�\�<cczN\�*\�}�\'���\�[ \�R|\�U#|�l�m@7����<�g�˘^\�N\�\�\�8Z\�	�F�=V.�C��0�4v�6Q\�Q��>v\0o$9,\�iMA\��q�p<�w�EC⺓��\�j4���CK��Gb�\�\�\��I�7{\�\�L\�z\�v�B�?�\�s�tX�z)I�`}�셾.\�\�\��#�3��-z�s��흁u&aM�5�����7c�\�yj���ɣ��C�<CmR����nx\�\�\����\'G��\�\��\�a-sK\\lA\�Ơԏ\�dE6�c��\�2�B�S)�2|�\\sS\�\�ψ�C�Wh	z��`,Kt��y�\�xh��D\�n�X$q<���Qn\'��������49a<��\�\�X\�Ga4�\Z\�u$�Uا\�1��\0�\�`�\r��^�\�;�>Ⱥ��\�ߒO�8\�)ؚ��\�d\0U7\�8{�D\�A;�T*��J[��@\�f��fЯ4\�2%�5�3�\�XwJ�\�\�\����\0.Bf<HJ�![? o\�ZӠ\�5�\0�\Z�Q��}��-?�VQ;)\�NId�9{�L��P}\�E\��D(�\0e\�G\�\n\�{��\�\�\r�}x\"�0�i\�Mwi\��\n\�O)���p\�9\"\�Aov�߿�㫆��Z�\�2g\��P﹔�tY�\0��v�Dv��l6\�\�볁#�7G�\n�\�\�-�]\�^ �Pd�G\� s9\'\�$���}��q�\�\�E\�\�E�؎\rfs�\�q\�\�\0\\d\�U/D�~\�\�W��\�g{OMB�oT\'\�_��`\r\0Hp\�5U\�\�8���FB�\�@��\�\Z��\�p\�2χ�cf4Y\�\�\�:t\�2�,A�jV�S��߆�`�\�\��Vv{��\�\�\�V\�\�v�&\�\�#�Y�iQ.T\n\\F\�qk\�Z\�6*%\�\�n	e\�\�H�S�\���7\�\� �\Z�\�jdF\�WN\�A\\{\�\�R\�7\�V��!�x�YR�\�%d�\��Vk]���\r\\m��LS��\�y�\�\�\�A�\��Da��>��N��F����.\"�[��\�\�\\#i�Uݫ\�F^\rs��?%m�d��Ќ�c�\�i�|�U\�\\�=:�j\��L�\�n:���leX�u���u\�uA���}�)�\�Sq�J�\�qĶǇ\�\�%O�y�ꢫG�`�ϥoW;�RPX\�\�%\�\��E\�\�p=z�EP5�y��\\\0I\�`MwL	��Q,o w\�4Oh\�\�\�X�4�\�H\nR$�S�s\�J�hN�c��C}\�{YL�\�o�\���\�T����R O\���\���D~\�}J�ٵ�\�4�\�\�c�\�%�KM�i\�7�U�j�G��?\�X!Z��7\�kv6\�i�m\05\�`k��\�\�k5ݬ��ǚ\�b������B؃\��PՔ�J\�{2�*�:\��\��\�\�qα�wS�X�i���ӳ�X<C�xD\��\0W\�V��\03\�x�s\\<�G\�IK�g3�ZP�\�w�CS,\�A܆�VVfpW\�\�D$�tO�\�m\�UԖ��<RI&Nv�Z�\r�$�@Yl�Ix���\�*ƭV�\\����K\\�\�\�\�.k�\�I�q&����h�O�O�I#�����.��J��(\��Q��]I&Ɛ.�[6\�\'N_P:e���Hl)\�w46,X�>\�$��\r9��\"\�$�$!\��iџvI%T���\�$��\�<�ʪ\�a\�3����$�7Գ�ۢ\�\�\�28	I$�h=�\�v0\�$�_#��y�\�I*V\�c\�U{ڜVvП\�$r9`�z.$��4gC���RI��\�','teacher','$2a$10$v4T0Fn4Sk9w3eziDMWlEhOXUT5nBBLllrZ24m6iGzpZBe1W.Z1DZq'),(2345,'Andrea','Montes',4,1,'amontes@uach.mx','Lopez',_binary 'n','teacher','$2a$10$rt31Ytrqq8w.AWQjUKWQEusuXI48Cx0MPb9Cta360P6yP8SjbaGXS'),(4587,'Victor','Solis',9,0,'vsolis@uach.mx','Madrid',_binary 'n','teacher','$2a$10$Yz/lSdOjZJDBskKkdyt3D.1ydrKtcOJ5h6AxDDFFoO29CAt3Sex0i'),(9876,'Pedro','Solis',3,0,'psolis@uach.mx','Garcia',_binary 'n','teacher','$2a$10$NaLYIdmG42grYan14cMWL.mC/eCZIErasqXeSOgJpkUQ3oO6qa6Ee');
/*!40000 ALTER TABLE `docentes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-19 20:46:25
