--
-- PostgreSQL database dump
--

\restrict cEVnU3q8aaOA2A6zn09a9p1JooLaV3OA9ZhtbXRURqYVBuwottGh74ko2ZRdjxh

-- Dumped from database version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)

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
-- Name: ml_coins_transactions; Type: TABLE; Schema: gamification_system; Owner: postgres
--

-- =====================================================================================
-- Table: ml_coins_transactions
-- Schema: gamification_system
-- Description: Registro de transacciones de ML Coins (ingresos y gastos)
-- Version: 2.0 (2025-11-08) - Convertido a usar ENUM transaction_type
-- Source of Truth:
--   - RF: docs/01-fase-alcance-inicial/EAI-003-gamificacion/requerimientos/RF-GAM-004-economia-ml-coins.md
--   - ET: docs/01-fase-alcance-inicial/EAI-003-gamificacion/especificaciones/ET-GAM-004-tipos-compartidos-gamificacion.md
--
-- 📚 Documentación:
-- Requerimiento: docs/01-fase-alcance-inicial/EAI-003-gamificacion/requerimientos/RF-GAM-004-economia-ml-coins.md
-- Especificación (Tipos): docs/01-fase-alcance-inicial/EAI-003-gamificacion/especificaciones/ET-GAM-004-tipos-compartidos-gamificacion.md
-- Especificación (Comodines): docs/01-fase-alcance-inicial/EAI-003-gamificacion/especificaciones/ET-GAM-002-comodines.md
-- =====================================================================================

CREATE TABLE gamification_system.ml_coins_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    tenant_id uuid,
    amount integer NOT NULL,
    balance_before integer NOT NULL,
    balance_after integer NOT NULL,
    transaction_type gamification_system.transaction_type NOT NULL,
    description text,
    reason text,
    reference_id uuid,
    reference_type text,
    multiplier numeric(3,2) DEFAULT 1.00,
    bonus_applied boolean DEFAULT false,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT gamilit.now_mexico(),
    CONSTRAINT ml_coins_transactions_balance_after_check CHECK ((balance_after >= 0)),
    CONSTRAINT ml_coins_transactions_balance_before_check CHECK ((balance_before >= 0)),
    CONSTRAINT ml_coins_transactions_reference_type_check CHECK ((reference_type = ANY (ARRAY['exercise'::text, 'module'::text, 'achievement'::text, 'powerup'::text, 'admin'::text, 'streak'::text, 'rank'::text])))
);


ALTER TABLE gamification_system.ml_coins_transactions OWNER TO gamilit_user;

--
-- Name: TABLE ml_coins_transactions; Type: COMMENT; Schema: gamification_system; Owner: postgres
--

COMMENT ON TABLE gamification_system.ml_coins_transactions IS 'Registro de transacciones de ML Coins - earning y spending';


--
-- Name: COLUMN ml_coins_transactions.transaction_type; Type: COMMENT; Schema: gamification_system; Owner: postgres
--

COMMENT ON COLUMN gamification_system.ml_coins_transactions.transaction_type IS 'Tipo de transacción usando gamification_system.transaction_type ENUM (v2.0 - 14 tipos): 7 earned (ingresos), 3 spent (gastos), 4 admin/sistema. Ver ET-GAM-004-tipos-compartidos-gamificacion.md para especificación completa.';


--
-- Name: COLUMN ml_coins_transactions.multiplier; Type: COMMENT; Schema: gamification_system; Owner: postgres
--

COMMENT ON COLUMN gamification_system.ml_coins_transactions.multiplier IS 'Multiplicador aplicado (ej: 1.5x por racha)';


--
-- Name: COLUMN ml_coins_transactions.tenant_id; Type: COMMENT; Schema: gamification_system; Owner: postgres
--

COMMENT ON COLUMN gamification_system.ml_coins_transactions.tenant_id IS 'ID del tenant al que pertenece la transacción (multi-tenancy support)';


--
-- Name: ml_coins_transactions ml_coins_transactions_pkey; Type: CONSTRAINT; Schema: gamification_system; Owner: postgres
--

ALTER TABLE ONLY gamification_system.ml_coins_transactions
    ADD CONSTRAINT ml_coins_transactions_pkey PRIMARY KEY (id);


--
-- Name: idx_ml_transactions_created_at; Type: INDEX; Schema: gamification_system; Owner: postgres
--

CREATE INDEX idx_ml_transactions_created_at ON gamification_system.ml_coins_transactions USING btree (created_at DESC);


--
-- Name: idx_ml_transactions_reference; Type: INDEX; Schema: gamification_system; Owner: postgres
--

CREATE INDEX idx_ml_transactions_reference ON gamification_system.ml_coins_transactions USING btree (reference_id, reference_type);


--
-- Name: idx_ml_transactions_type; Type: INDEX; Schema: gamification_system; Owner: postgres
--

CREATE INDEX idx_ml_transactions_type ON gamification_system.ml_coins_transactions USING btree (transaction_type);


--
-- Name: idx_ml_transactions_user_id; Type: INDEX; Schema: gamification_system; Owner: postgres
--

CREATE INDEX idx_ml_transactions_user_id ON gamification_system.ml_coins_transactions USING btree (user_id);


--
-- Name: idx_ml_transactions_user_recent; Type: INDEX; Schema: gamification_system; Owner: postgres
--

CREATE INDEX idx_ml_transactions_user_recent ON gamification_system.ml_coins_transactions USING btree (user_id, created_at DESC);


--
-- Name: idx_ml_transactions_user_type_date; Type: INDEX; Schema: gamification_system; Owner: postgres
--

CREATE INDEX idx_ml_transactions_user_type_date ON gamification_system.ml_coins_transactions USING btree (user_id, transaction_type, created_at DESC);


--
-- Name: idx_ml_transactions_tenant_id; Type: INDEX; Schema: gamification_system; Owner: postgres
--

CREATE INDEX idx_ml_transactions_tenant_id ON gamification_system.ml_coins_transactions USING btree (tenant_id);


--
-- Name: ml_coins_transactions ml_coins_transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: gamification_system; Owner: postgres
--

ALTER TABLE ONLY gamification_system.ml_coins_transactions
    ADD CONSTRAINT ml_coins_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth_management.profiles(id) ON DELETE CASCADE;


--
-- Name: ml_coins_transactions ml_coins_transactions_tenant_id_fkey; Type: FK CONSTRAINT; Schema: gamification_system; Owner: postgres
--

ALTER TABLE ONLY gamification_system.ml_coins_transactions
    ADD CONSTRAINT ml_coins_transactions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES auth_management.tenants(id) ON DELETE SET NULL;


--
-- Name: ml_coins_transactions ml_transactions_select_admin; Type: POLICY; Schema: gamification_system; Owner: postgres
--

CREATE POLICY ml_transactions_select_admin ON gamification_system.ml_coins_transactions FOR SELECT USING (gamilit.is_admin());


--
-- Name: ml_coins_transactions ml_transactions_select_own; Type: POLICY; Schema: gamification_system; Owner: postgres
--

CREATE POLICY ml_transactions_select_own ON gamification_system.ml_coins_transactions FOR SELECT USING ((user_id = gamilit.get_current_user_id()));


--
-- Name: TABLE ml_coins_transactions; Type: ACL; Schema: gamification_system; Owner: postgres
--

GRANT ALL ON TABLE gamification_system.ml_coins_transactions TO gamilit_user;


--
-- PostgreSQL database dump complete
--

\unrestrict cEVnU3q8aaOA2A6zn09a9p1JooLaV3OA9ZhtbXRURqYVBuwottGh74ko2ZRdjxh
