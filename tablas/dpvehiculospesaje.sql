-- --------------------------------------------------------
-- Host:                         192.168.1.16
-- Versión del servidor:         5.6.50 - MySQL Community Server (GPL)
-- SO del servidor:              Linux
-- HeidiSQL Versión:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Volcando estructura para tabla serviaves.dpvehiculospesaje
CREATE TABLE IF NOT EXISTS `dpvehiculospesaje` (
  `VHP_CODBAL` char(4) DEFAULT NULL,
  `VHP_FECHA` date DEFAULT NULL,
  `VHP_HORA` char(8) DEFAULT NULL,
  `VHP_IP` char(14) DEFAULT NULL,
  `VHP_MODO` char(1) DEFAULT NULL,
  `VHP_NUMERO` char(10) DEFAULT NULL,
  `VHP_PC` char(20) DEFAULT NULL,
  `VHP_PLACA` char(7) DEFAULT NULL,
  `VHP_TIPO` char(1) DEFAULT NULL,
  `VHP_CODINV` char(20) DEFAULT NULL,
  `VHP_CARGA` decimal(1,0) DEFAULT NULL,
  `VHP_COMPRA` decimal(1,0) DEFAULT NULL,
  `VHP_NUMASO` char(10) DEFAULT NULL,
  `VHP_NUMDIA` char(5) DEFAULT NULL,
  `VHP_PESO` decimal(19,0) DEFAULT NULL,
  `VHP_CODCON` char(15) DEFAULT NULL,
  KEY `DPVEHICULOSPESAJE_2` (`VHP_PLACA`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla serviaves.dpvehiculospesaje: ~3 rows (aproximadamente)
INSERT INTO `dpvehiculospesaje` (`VHP_CODBAL`, `VHP_FECHA`, `VHP_HORA`, `VHP_IP`, `VHP_MODO`, `VHP_NUMERO`, `VHP_PC`, `VHP_PLACA`, `VHP_TIPO`, `VHP_CODINV`, `VHP_CARGA`, `VHP_COMPRA`, `VHP_NUMASO`, `VHP_NUMDIA`, `VHP_PESO`, `VHP_CODCON`) VALUES
	('001', '2023-08-31', '15:05:00', '192.168.1.203', 'A', '1', '', '1234567', 'E', '', 0, 0, '', '', 20000, ''),
	('', '2023-09-01', '09:47:15', '192.168.1.23', 'M', '2', '', '1234567', 'E', '', 0, 0, '', '', 0, ''),
	('', '2023-09-01', '09:47:30', '192.168.1.23', 'M', '3', '', '1234567', 'E', '', 0, 0, '', '', 0, '');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
