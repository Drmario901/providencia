-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-10-2024 a las 22:27:15
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `serviaves_web`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehiculos`
--

CREATE TABLE `vehiculos` (
  `id` int(11) NOT NULL,
  `placa` varchar(10) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `peso_tara` decimal(10,2) NOT NULL,
  `fecha_peso_tara` date NOT NULL,
  `hora_entrada` time NOT NULL,
  `codigo_productos` varchar(255) DEFAULT NULL,
  `producto_ingresado` varchar(255) DEFAULT NULL,
  `vehiculo_activo` enum('Sí','No') DEFAULT 'Sí',
  `peso_bruto` decimal(10,2) DEFAULT NULL,
  `peso_neto` decimal(10,2) DEFAULT NULL,
  `hora_salida` time DEFAULT NULL,
  `estatus` enum('Pendiente','Finalizado') DEFAULT 'Pendiente',
  `caso` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vehiculos`
--

INSERT INTO `vehiculos` (`id`, `placa`, `tipo`, `peso_tara`, `fecha_peso_tara`, `hora_entrada`, `codigo_productos`, `producto_ingresado`, `vehiculo_activo`, `peso_bruto`, `peso_neto`, `hora_salida`, `estatus`, `caso`, `created_at`, `updated_at`) VALUES
(1, 'A23A06K', 'Plataformas', 112.15, '2024-10-21', '03:43:00', '01-001-0001', 'TRIPTOFANO 98%', 'Sí', NULL, NULL, NULL, 'Pendiente', 0, '2024-10-21 19:44:07', '2024-10-21 19:44:07'),
(2, 'A23A06K', 'Plataformas', 112.15, '2024-10-21', '03:43:00', 'Vacío', 'Vacío', 'Sí', NULL, NULL, NULL, 'Finalizado', 2, '2024-10-21 19:44:23', '2024-10-21 19:47:52'),
(3, 'A23A06K', 'Plataformas', 112.15, '2024-10-21', '03:43:00', '01-001-0001,01-001-0002,01-001-0003', 'TRIPTOFANO 98%,L-THREONINA 98.5%,LYSINA 98.5%', 'Sí', NULL, NULL, NULL, 'Pendiente', 1, '2024-10-21 19:44:35', '2024-10-21 19:44:35');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
