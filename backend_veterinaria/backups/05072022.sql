--
-- PostgreSQL database dump
--

-- Dumped from database version 14.4
-- Dumped by pg_dump version 14.4

-- Started on 2022-07-05 12:27:37

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 212 (class 1259 OID 32800)
-- Name: Atencion; Type: TABLE; Schema: public; Owner: veterinaria
--

CREATE TABLE public."Atencion" (
    id uuid NOT NULL,
    "idVeterinario" uuid NOT NULL,
    "idMascota" uuid NOT NULL
);


ALTER TABLE public."Atencion" OWNER TO veterinaria;

--
-- TOC entry 209 (class 1259 OID 32770)
-- Name: Mascota; Type: TABLE; Schema: public; Owner: veterinaria
--

CREATE TABLE public."Mascota" (
    id uuid NOT NULL,
    nombre character varying(100),
    edad integer,
    birthday date NOT NULL,
    "idTipoMascota" uuid
);


ALTER TABLE public."Mascota" OWNER TO veterinaria;

--
-- TOC entry 210 (class 1259 OID 32775)
-- Name: TipoMascota; Type: TABLE; Schema: public; Owner: veterinaria
--

CREATE TABLE public."TipoMascota" (
    id uuid NOT NULL,
    nombre character varying(100),
    activo boolean NOT NULL
);


ALTER TABLE public."TipoMascota" OWNER TO veterinaria;

--
-- TOC entry 211 (class 1259 OID 32790)
-- Name: Veterinario; Type: TABLE; Schema: public; Owner: veterinaria
--

CREATE TABLE public."Veterinario" (
    id uuid NOT NULL,
    nombre character varying(200)
);


ALTER TABLE public."Veterinario" OWNER TO veterinaria;

--
-- TOC entry 3182 (class 2606 OID 32804)
-- Name: Atencion Atencion_pkey; Type: CONSTRAINT; Schema: public; Owner: veterinaria
--

ALTER TABLE ONLY public."Atencion"
    ADD CONSTRAINT "Atencion_pkey" PRIMARY KEY (id);


--
-- TOC entry 3176 (class 2606 OID 32774)
-- Name: Mascota Mascota_pkey; Type: CONSTRAINT; Schema: public; Owner: veterinaria
--

ALTER TABLE ONLY public."Mascota"
    ADD CONSTRAINT "Mascota_pkey" PRIMARY KEY (id);


--
-- TOC entry 3178 (class 2606 OID 32779)
-- Name: TipoMascota TipoMascota_pkey; Type: CONSTRAINT; Schema: public; Owner: veterinaria
--

ALTER TABLE ONLY public."TipoMascota"
    ADD CONSTRAINT "TipoMascota_pkey" PRIMARY KEY (id);


--
-- TOC entry 3180 (class 2606 OID 32794)
-- Name: Veterinario Veterinario_pkey; Type: CONSTRAINT; Schema: public; Owner: veterinaria
--

ALTER TABLE ONLY public."Veterinario"
    ADD CONSTRAINT "Veterinario_pkey" PRIMARY KEY (id);


--
-- TOC entry 3183 (class 2606 OID 32780)
-- Name: Mascota FK_MASCOTA_TIPOMASCOTA; Type: FK CONSTRAINT; Schema: public; Owner: veterinaria
--

ALTER TABLE ONLY public."Mascota"
    ADD CONSTRAINT "FK_MASCOTA_TIPOMASCOTA" FOREIGN KEY ("idTipoMascota") REFERENCES public."TipoMascota"(id) NOT VALID;


-- Completed on 2022-07-05 12:27:37

--
-- PostgreSQL database dump complete
--

