--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

ALTER TABLE ONLY public.users_projects DROP CONSTRAINT fk_users_projects_users_id;
ALTER TABLE ONLY public.users_projects DROP CONSTRAINT fk_users_projects_project_id;
ALTER TABLE ONLY public.timelogging DROP CONSTRAINT fk_timelogging_user_fk;
ALTER TABLE ONLY public.targettype_labelset DROP CONSTRAINT fk_targettype_labelset_targettype;
ALTER TABLE ONLY public.targettype_labelset DROP CONSTRAINT fk_targettype_labelset_label_set_id;
ALTER TABLE ONLY public.state DROP CONSTRAINT fk_state_user_fk;
ALTER TABLE ONLY public.state DROP CONSTRAINT fk_state_document_fk;
ALTER TABLE ONLY public.scheme_targettype DROP CONSTRAINT fk_scheme_targettype_targettype;
ALTER TABLE ONLY public.scheme_targettype DROP CONSTRAINT fk_scheme_targettype_scheme_id;
ALTER TABLE ONLY public.scheme_linkset DROP CONSTRAINT fk_scheme_linkset_scheme_id;
ALTER TABLE ONLY public.scheme_linkset DROP CONSTRAINT fk_scheme_linkset_linkset_id;
ALTER TABLE ONLY public.scheme_labelset DROP CONSTRAINT fk_scheme_labelset_scheme_id;
ALTER TABLE ONLY public.scheme_labelset DROP CONSTRAINT fk_scheme_labelset_labelset_id;
ALTER TABLE ONLY public.scheme DROP CONSTRAINT fk_scheme_creator_id;
ALTER TABLE ONLY public.projects_watchingusers DROP CONSTRAINT fk_projects_watchingusers_watchinguser_id;
ALTER TABLE ONLY public.projects_watchingusers DROP CONSTRAINT fk_projects_watchingusers_project_id;
ALTER TABLE ONLY public.projects_manager DROP CONSTRAINT fk_projects_manager_project_id;
ALTER TABLE ONLY public.projects_manager DROP CONSTRAINT fk_projects_manager_manager_id;
ALTER TABLE ONLY public.project DROP CONSTRAINT fk_project_scheme;
ALTER TABLE ONLY public.linkset DROP CONSTRAINT fk_linkset_starttype_fk;
ALTER TABLE ONLY public.linkset DROP CONSTRAINT fk_linkset_endtype_fk;
ALTER TABLE ONLY public.linklabellinksetmap_linkset DROP CONSTRAINT fk_linklabellinksetmap_linkset_linklabellinksetmap_id;
ALTER TABLE ONLY public.linklabellinksetmap_linkset DROP CONSTRAINT fk_linklabellinksetmap_linkset_link_set_id;
ALTER TABLE ONLY public.linklabellinksetmap DROP CONSTRAINT fk_linklabellinksetmap_label_linklabel;
ALTER TABLE ONLY public.linklabel_linkset DROP CONSTRAINT fk_linklabel_linkset_linklabel_id;
ALTER TABLE ONLY public.linklabel_linkset DROP CONSTRAINT fk_linklabel_linkset_link_label_set_id;
ALTER TABLE ONLY public.link DROP CONSTRAINT fk_link_user_fk;
ALTER TABLE ONLY public.link_labelmap DROP CONSTRAINT fk_link_labelmap_map_id;
ALTER TABLE ONLY public.link_labelmap DROP CONSTRAINT fk_link_labelmap_link_id;
ALTER TABLE ONLY public.link DROP CONSTRAINT fk_link_document_fk;
ALTER TABLE ONLY public.link DROP CONSTRAINT fk_link_annotation2_fk;
ALTER TABLE ONLY public.link DROP CONSTRAINT fk_link_annotation1_fk;
ALTER TABLE ONLY public.labellabelsetmap_labelset DROP CONSTRAINT fk_labellabelsetmap_labelset_labellabelsetmap_id;
ALTER TABLE ONLY public.labellabelsetmap_labelset DROP CONSTRAINT fk_labellabelsetmap_labelset_label_set_id;
ALTER TABLE ONLY public.labellabelsetmap DROP CONSTRAINT fk_labellabelsetmap_label_labelid;
ALTER TABLE ONLY public.label_labelset DROP CONSTRAINT fk_label_labelset_label_set_id;
ALTER TABLE ONLY public.label_labelset DROP CONSTRAINT fk_label_labelset_label_id;
ALTER TABLE ONLY public.document DROP CONSTRAINT fk_document_project_fk;
ALTER TABLE ONLY public.document_defaultannotations DROP CONSTRAINT fk_document_defaultannotations_doc_id;
ALTER TABLE ONLY public.document_defaultannotations DROP CONSTRAINT fk_document_defaultannotations_defannotation_id;
ALTER TABLE ONLY public.annotation DROP CONSTRAINT fk_annotation_user_fk;
ALTER TABLE ONLY public.annotation DROP CONSTRAINT fk_annotation_targettype_fk;
ALTER TABLE ONLY public.annotation_labelmap DROP CONSTRAINT fk_annotation_labelmap_map_id;
ALTER TABLE ONLY public.annotation_labelmap DROP CONSTRAINT fk_annotation_labelmap_annotation_id;
ALTER TABLE ONLY public.annotation DROP CONSTRAINT fk_annotation_document_fk;
ALTER TABLE ONLY public.users_projects DROP CONSTRAINT users_projects_pkey;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
ALTER TABLE ONLY public.state DROP CONSTRAINT unq_state_0;
ALTER TABLE ONLY public.annotation DROP CONSTRAINT unq_annotation_0;
ALTER TABLE ONLY public.timelogging DROP CONSTRAINT timelogging_pkey;
ALTER TABLE ONLY public.targettype DROP CONSTRAINT targettype_pkey;
ALTER TABLE ONLY public.targettype_labelset DROP CONSTRAINT targettype_labelset_pkey;
ALTER TABLE ONLY public.state DROP CONSTRAINT state_pkey;
ALTER TABLE ONLY public.sequence DROP CONSTRAINT sequence_pkey;
ALTER TABLE ONLY public.scheme_targettype DROP CONSTRAINT scheme_targettype_pkey;
ALTER TABLE ONLY public.scheme DROP CONSTRAINT scheme_pkey;
ALTER TABLE ONLY public.scheme DROP CONSTRAINT scheme_name_key;
ALTER TABLE ONLY public.scheme_linkset DROP CONSTRAINT scheme_linkset_pkey;
ALTER TABLE ONLY public.scheme_labelset DROP CONSTRAINT scheme_labelset_pkey;
ALTER TABLE ONLY public.projects_watchingusers DROP CONSTRAINT projects_watchingusers_pkey;
ALTER TABLE ONLY public.projects_manager DROP CONSTRAINT projects_manager_pkey;
ALTER TABLE ONLY public.project DROP CONSTRAINT project_pkey;
ALTER TABLE ONLY public.project DROP CONSTRAINT project_name_key;
ALTER TABLE ONLY public.linkset DROP CONSTRAINT linkset_pkey;
ALTER TABLE ONLY public.linklabellinksetmap DROP CONSTRAINT linklabellinksetmap_pkey;
ALTER TABLE ONLY public.linklabellinksetmap_linkset DROP CONSTRAINT linklabellinksetmap_linkset_pkey;
ALTER TABLE ONLY public.linklabel DROP CONSTRAINT linklabel_pkey;
ALTER TABLE ONLY public.linklabel_linkset DROP CONSTRAINT linklabel_linkset_pkey;
ALTER TABLE ONLY public.link DROP CONSTRAINT link_pkey;
ALTER TABLE ONLY public.link_labelmap DROP CONSTRAINT link_labelmap_pkey;
ALTER TABLE ONLY public.labelset DROP CONSTRAINT labelset_pkey;
ALTER TABLE ONLY public.labellabelsetmap DROP CONSTRAINT labellabelsetmap_pkey;
ALTER TABLE ONLY public.labellabelsetmap_labelset DROP CONSTRAINT labellabelsetmap_labelset_pkey;
ALTER TABLE ONLY public.label DROP CONSTRAINT label_pkey;
ALTER TABLE ONLY public.label_labelset DROP CONSTRAINT label_labelset_pkey;
ALTER TABLE ONLY public.document DROP CONSTRAINT document_pkey;
ALTER TABLE ONLY public.document_defaultannotations DROP CONSTRAINT document_defaultannotations_pkey;
ALTER TABLE ONLY public.annotation DROP CONSTRAINT annotation_pkey;
ALTER TABLE ONLY public.annotation_labelmap DROP CONSTRAINT annotation_labelmap_pkey;
ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.timelogging ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.state ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.scheme ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.project ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.linkset ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.linklabellinksetmap ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.link ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.labelset ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.labellabelsetmap ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.document ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.annotation ALTER COLUMN id DROP DEFAULT;
DROP TABLE public.users_projects;
DROP SEQUENCE public.users_id_seq;
DROP TABLE public.users;
DROP SEQUENCE public.timelogging_id_seq;
DROP TABLE public.timelogging;
DROP TABLE public.targettype_labelset;
DROP TABLE public.targettype;
DROP SEQUENCE public.state_id_seq;
DROP TABLE public.state;
DROP TABLE public.sequence;
DROP TABLE public.scheme_targettype;
DROP TABLE public.scheme_linkset;
DROP TABLE public.scheme_labelset;
DROP SEQUENCE public.scheme_id_seq;
DROP TABLE public.scheme;
DROP TABLE public.projects_watchingusers;
DROP TABLE public.projects_manager;
DROP SEQUENCE public.project_id_seq;
DROP TABLE public.project;
DROP SEQUENCE public.linkset_id_seq;
DROP TABLE public.linkset;
DROP TABLE public.linklabellinksetmap_linkset;
DROP SEQUENCE public.linklabellinksetmap_id_seq;
DROP TABLE public.linklabellinksetmap;
DROP TABLE public.linklabel_linkset;
DROP TABLE public.linklabel;
DROP TABLE public.link_labelmap;
DROP SEQUENCE public.link_id_seq;
DROP TABLE public.link;
DROP SEQUENCE public.labelset_id_seq;
DROP TABLE public.labelset;
DROP TABLE public.labellabelsetmap_labelset;
DROP SEQUENCE public.labellabelsetmap_id_seq;
DROP TABLE public.labellabelsetmap;
DROP TABLE public.label_labelset;
DROP TABLE public.label;
DROP SEQUENCE public.document_id_seq;
DROP TABLE public.document_defaultannotations;
DROP TABLE public.document;
DROP TABLE public.annotation_labelmap;
DROP SEQUENCE public.annotation_id_seq;
DROP TABLE public.annotation;
DROP EXTENSION plpgsql;
DROP SCHEMA public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: annotation; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE annotation (
    id integer NOT NULL,
    ends integer,
    notsure boolean,
    starts integer,
    text text,
    document_fk bigint,
    targettype_fk character varying(255),
    user_fk bigint
);


ALTER TABLE public.annotation OWNER TO postgres;

--
-- Name: annotation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE annotation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.annotation_id_seq OWNER TO postgres;

--
-- Name: annotation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE annotation_id_seq OWNED BY annotation.id;


--
-- Name: annotation_labelmap; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE annotation_labelmap (
    annotation_id bigint NOT NULL,
    map_id bigint NOT NULL
);


ALTER TABLE public.annotation_labelmap OWNER TO postgres;

--
-- Name: document; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE document (
    id integer NOT NULL,
    name character varying(255),
    text text,
    project_fk bigint
);


ALTER TABLE public.document OWNER TO postgres;

--
-- Name: document_defaultannotations; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE document_defaultannotations (
    doc_id bigint NOT NULL,
    defannotation_id bigint NOT NULL
);


ALTER TABLE public.document_defaultannotations OWNER TO postgres;

--
-- Name: document_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE document_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.document_id_seq OWNER TO postgres;

--
-- Name: document_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE document_id_seq OWNED BY document.id;


--
-- Name: label; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE label (
    labelid character varying(255) NOT NULL
);


ALTER TABLE public.label OWNER TO postgres;

--
-- Name: label_labelset; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE label_labelset (
    label_set_id bigint NOT NULL,
    label_id character varying(255) NOT NULL
);


ALTER TABLE public.label_labelset OWNER TO postgres;

--
-- Name: labellabelsetmap; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE labellabelsetmap (
    id integer NOT NULL,
    label_labelid character varying(255)
);


ALTER TABLE public.labellabelsetmap OWNER TO postgres;

--
-- Name: labellabelsetmap_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE labellabelsetmap_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.labellabelsetmap_id_seq OWNER TO postgres;

--
-- Name: labellabelsetmap_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE labellabelsetmap_id_seq OWNED BY labellabelsetmap.id;


--
-- Name: labellabelsetmap_labelset; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE labellabelsetmap_labelset (
    labellabelsetmap_id bigint NOT NULL,
    label_set_id bigint NOT NULL
);


ALTER TABLE public.labellabelsetmap_labelset OWNER TO postgres;

--
-- Name: labelset; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE labelset (
    id integer NOT NULL,
    exclusive boolean,
    name character varying(255)
);


ALTER TABLE public.labelset OWNER TO postgres;

--
-- Name: labelset_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE labelset_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.labelset_id_seq OWNER TO postgres;

--
-- Name: labelset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE labelset_id_seq OWNED BY labelset.id;


--
-- Name: link; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE link (
    id integer NOT NULL,
    annotation1_fk bigint,
    annotation2_fk bigint,
    document_fk bigint,
    user_fk bigint
);


ALTER TABLE public.link OWNER TO postgres;

--
-- Name: link_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE link_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.link_id_seq OWNER TO postgres;

--
-- Name: link_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE link_id_seq OWNED BY link.id;


--
-- Name: link_labelmap; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE link_labelmap (
    link_id bigint NOT NULL,
    map_id bigint NOT NULL
);


ALTER TABLE public.link_labelmap OWNER TO postgres;

--
-- Name: linklabel; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE linklabel (
    linklabel character varying(255) NOT NULL
);


ALTER TABLE public.linklabel OWNER TO postgres;

--
-- Name: linklabel_linkset; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE linklabel_linkset (
    linklabel_id character varying(255) NOT NULL,
    link_label_set_id bigint NOT NULL
);


ALTER TABLE public.linklabel_linkset OWNER TO postgres;

--
-- Name: linklabellinksetmap; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE linklabellinksetmap (
    id integer NOT NULL,
    label_linklabel character varying(255)
);


ALTER TABLE public.linklabellinksetmap OWNER TO postgres;

--
-- Name: linklabellinksetmap_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE linklabellinksetmap_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.linklabellinksetmap_id_seq OWNER TO postgres;

--
-- Name: linklabellinksetmap_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE linklabellinksetmap_id_seq OWNED BY linklabellinksetmap.id;


--
-- Name: linklabellinksetmap_linkset; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE linklabellinksetmap_linkset (
    linklabellinksetmap_id bigint NOT NULL,
    link_set_id bigint NOT NULL
);


ALTER TABLE public.linklabellinksetmap_linkset OWNER TO postgres;

--
-- Name: linkset; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE linkset (
    id integer NOT NULL,
    allowunlabeledlinks boolean,
    name character varying(255),
    endtype_fk character varying(255) NOT NULL,
    starttype_fk character varying(255) NOT NULL
);


ALTER TABLE public.linkset OWNER TO postgres;

--
-- Name: linkset_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE linkset_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.linkset_id_seq OWNER TO postgres;

--
-- Name: linkset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE linkset_id_seq OWNED BY linkset.id;


--
-- Name: project; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE project (
    id integer NOT NULL,
    name character varying(255),
    scheme bigint NOT NULL
);


ALTER TABLE public.project OWNER TO postgres;

--
-- Name: project_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE project_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.project_id_seq OWNER TO postgres;

--
-- Name: project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE project_id_seq OWNED BY project.id;


--
-- Name: projects_manager; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE projects_manager (
    project_id bigint NOT NULL,
    manager_id bigint NOT NULL
);


ALTER TABLE public.projects_manager OWNER TO postgres;

--
-- Name: projects_watchingusers; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE projects_watchingusers (
    project_id bigint NOT NULL,
    watchinguser_id bigint NOT NULL
);


ALTER TABLE public.projects_watchingusers OWNER TO postgres;

--
-- Name: scheme; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE scheme (
    id integer NOT NULL,
    name character varying(255),
    creator_id bigint
);


ALTER TABLE public.scheme OWNER TO postgres;

--
-- Name: scheme_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE scheme_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.scheme_id_seq OWNER TO postgres;

--
-- Name: scheme_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE scheme_id_seq OWNED BY scheme.id;


--
-- Name: scheme_labelset; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE scheme_labelset (
    scheme_id bigint NOT NULL,
    labelset_id bigint NOT NULL
);


ALTER TABLE public.scheme_labelset OWNER TO postgres;

--
-- Name: scheme_linkset; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE scheme_linkset (
    scheme_id bigint NOT NULL,
    linkset_id bigint NOT NULL
);


ALTER TABLE public.scheme_linkset OWNER TO postgres;

--
-- Name: scheme_targettype; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE scheme_targettype (
    scheme_id bigint NOT NULL,
    targettype character varying(255) NOT NULL
);


ALTER TABLE public.scheme_targettype OWNER TO postgres;

--
-- Name: sequence; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE sequence (
    seq_name character varying(50) NOT NULL,
    seq_count numeric(38,0)
);


ALTER TABLE public.sequence OWNER TO postgres;

--
-- Name: state; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE state (
    id integer NOT NULL,
    completed boolean,
    lastedit timestamp without time zone,
    document_fk bigint,
    user_fk bigint
);


ALTER TABLE public.state OWNER TO postgres;

--
-- Name: state_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE state_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.state_id_seq OWNER TO postgres;

--
-- Name: state_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE state_id_seq OWNED BY state.id;


--
-- Name: targettype; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE targettype (
    targettype character varying(255) NOT NULL
);


ALTER TABLE public.targettype OWNER TO postgres;

--
-- Name: targettype_labelset; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE targettype_labelset (
    label_set_id bigint NOT NULL,
    targettype character varying(255) NOT NULL
);


ALTER TABLE public.targettype_labelset OWNER TO postgres;

--
-- Name: timelogging; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE timelogging (
    id integer NOT NULL,
    loggedat timestamp without time zone,
    loggedtime integer,
    user_fk bigint NOT NULL
);


ALTER TABLE public.timelogging OWNER TO postgres;

--
-- Name: timelogging_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE timelogging_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.timelogging_id_seq OWNER TO postgres;

--
-- Name: timelogging_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE timelogging_id_seq OWNED BY timelogging.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE users (
    id integer NOT NULL,
    createdate timestamp without time zone,
    email character varying(255),
    lastname character varying(255),
    password character varying(255),
    prename character varying(255),
    role character varying(255),
    session character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: users_projects; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE users_projects (
    project_id bigint NOT NULL,
    users_id bigint NOT NULL
);


ALTER TABLE public.users_projects OWNER TO postgres;

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY annotation ALTER COLUMN id SET DEFAULT nextval('annotation_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY document ALTER COLUMN id SET DEFAULT nextval('document_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY labellabelsetmap ALTER COLUMN id SET DEFAULT nextval('labellabelsetmap_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY labelset ALTER COLUMN id SET DEFAULT nextval('labelset_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY link ALTER COLUMN id SET DEFAULT nextval('link_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY linklabellinksetmap ALTER COLUMN id SET DEFAULT nextval('linklabellinksetmap_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY linkset ALTER COLUMN id SET DEFAULT nextval('linkset_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY project ALTER COLUMN id SET DEFAULT nextval('project_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY scheme ALTER COLUMN id SET DEFAULT nextval('scheme_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY state ALTER COLUMN id SET DEFAULT nextval('state_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY timelogging ALTER COLUMN id SET DEFAULT nextval('timelogging_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Data for Name: annotation; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: annotation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('annotation_id_seq', 1, false);


--
-- Data for Name: annotation_labelmap; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: document; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO document (id, name, text, project_fk) VALUES (1, 'WhitespaceTest2', 'test
 ', 1);
INSERT INTO document (id, name, text, project_fk) VALUES (2, 'targetEndsWithoutDot', 'As this document shows, sometimes they contain weird whitespace. Not sure how this would be displayed in the tool, but the final offsets should relate to the original text. For the first prototype, you can ignore that -- just display the text including whitespace or remove it. In general, I think a map of "displayed offsets" vs. "original offsets" could solve this problem.##The file 20000410_nyt-NEW.txt.xml contains the predefined targets of the annotations. In general, annotators should also be able to create such targes themselves and assign a type.#Here, all the targets are of type "verb". We will have to add different target types, which in the annotation scheme definition can then be linked to the possible tags/features/links that can be assigned to them. (But don''t worry about this for the first prototype.)
', 1);
INSERT INTO document (id, name, text, project_fk) VALUES (3, 'WhitespaceTest', 'test

 

test', 1);
INSERT INTO document (id, name, text, project_fk) VALUES (4, 'WhitespaceTest4', 'test1
test2

test4', 1);
INSERT INTO document (id, name, text, project_fk) VALUES (5, 'WhitespaceTest3', 'test
   ', 1);
INSERT INTO document (id, name, text, project_fk) VALUES (6, 'targetEndsWithDot', 'As this document shows, sometimes they contain weird whitespace. Not sure how this would be displayed in the tool, but the final offsets should relate to the original text. For the first prototype, you can ignore that -- just display the text including whitespace or remove it. In general, I think a map of "displayed offsets" vs. "original offsets" could solve this problem.

The file 20000410_nyt-NEW.txt.xml contains the predefined targets of the annotations. In general, annotators should also be able to create such targes themselves and assign a type.
Here, all the targets are of type "verb". We will have to add different target types, which in the annotation scheme definition can then be linked to the possible tags/features/links that can be assigned to them. (But don''t worry about this for the first prototype.)
', 1);
INSERT INTO document (id, name, text, project_fk) VALUES (7, 'longAnnotation', 'Iraq clears visit by Ohio official
By Scott Montgomery Washington
The Iraqi government has agreed to let U.S. Rep. Tony Hall visit the
Iraq clears visit by Ohio officialcountry next week to assess a humanitarian crisis that has festered
since the Gulf War of 1990, Hall''s office said Monday.
The Dayton Democrat, who has traveled to other crisis points including
Sierra Leone and North Korea, will spend three days visiting hospitals
and other facilities to seek understanding why aid has been ineffective
in stemming malnourishment and other medical problems.
Iraq has been under economic sanctions since the war ended, which some
say have thwarted the country''s ability to recover from the devastation
of the bombing campaign.
The Persian Gulf War destroyed much of the country''s medical
infrastructure, according to a report by the World Health Organization.
In 1996 the WHO found that much of the population existed in a state of
``semi starvation.''''
Hall will be only the second member of Congress to travel in Iraq since
the war, according to Hall''s office. The last visitor was then-U.S. Rep.
Bill Richardson of New Mexico, who went to help a pair of U.S. oilmen in
diplomatic trouble.
Hall flies to Amman, Jordan, on Friday, where he''ll spend the night
before driving to Iraq. Flights are not permitted into Iraq. Hall is to
return to Washington on April 22.
Story Filed By Cox Newspapers

Charlie you look quite down
With your big fat eyes
And your big fat frown
The world doesn''t have to be so gray
Charlie when your life''s a mess
When your feeling blue
Or are in distress
I know what can wash that sad away
All you have to do is
Put a banana in your ear (a banana in my ear?)
Put a ripe banana right into your favorite ear
It''s true (says who?)
So true
Once it''s in your gloom will disappear
The bad in the world is hard to hear
When in your ear a banana cheers
So go and put a banana in your ear
Put a banana in your ear (I''d rather keep my ear clear)
You will never be happy
If you live your life in fear
It''s true! (says you)
So true!
When it''s in the skies are bright and clear
Oh, every day of every year
The sun shines bright in this big blue sphere
So go and put a banana in your
Earrrrrrrrrrrrrrrrrrrrr
', 1);
INSERT INTO document (id, name, text, project_fk) VALUES (8, 'September_11th_attacks', 'The September 11 attacks (also referred to as September 11, September 11th, or 9/11) were a series of four coordinated terrorist attacks launched by the Islamic terrorist group al-Qaeda upon the United States in New York City and the Washington, D.C. metropolitan area on Tuesday, September 11, 2001.

Four passenger airliners were hijacked by 19 al-Qaeda terrorists so they could be flown into buildings in suicide attacks. Two of those planes, American Airlines Flight 11 and United Airlines Flight 175, were crashed into the North and South towers, respectively, of the World Trade Center complex in New York City. Within two hours, both towers collapsed with debris and the resulting fires causing partial or complete collapse of all other buildings in the WTC complex, as well as significant damage to ten other large surrounding structures. A third plane, American Airlines Flight 77, was crashed into the Pentagon (the headquarters of the United States Department of Defense), leading to a partial collapse in its western side. The fourth plane, United Airlines Flight 93, was targeted at Washington, D.C., but crashed into a field near Shanksville, Pennsylvania, after its passengers tried to overcome the hijackers. In total, almost 3,000 people died in the attacks, including the 227 civilians and 19 hijackers aboard the four planes. It also was the deadliest incident for firefighters in the history of the United States.

Suspicion quickly fell on al-Qaeda. Although the group''s leader, Osama bin Laden, initially denied any involvement, in 2004, he claimed responsibility for the attacks. Al-Qaeda and bin Laden cited U.S. support of Israel, the presence of U.S. troops in Saudi Arabia, and sanctions against Iraq as motives for the attacks. The United States responded to the attacks by launching the War on Terror and invading Afghanistan to depose the Taliban, which had harbored al-Qaeda. Many countries strengthened their anti-terrorism legislation and expanded law enforcement powers. Having evaded capture for years, bin Laden was located and killed by U.S. forces in May 2011.

The destruction of the Twin Towers and other properties caused serious damage to the economy of Lower Manhattan and had a significant effect on global markets, closing Wall Street until September 17 and the civilian airspace in the U.S. and Canada until September 13.  Many closings, evacuations, and cancellations followed the attack, either out of fear of further attacks or respect for the tragedy. Cleanup of the World Trade Center site was completed in May 2002, and the Pentagon was repaired within a year. Numerous memorials have been constructed, including the National September 11 Memorial & Museum in New York, the Pentagon Memorial, and the Flight 93 National Memorial in Pennsylvania.

On November 18, 2006, Construction of One World Trade Center began at the World Trade Center site. As of September 2013, the new tower''s concrete construction is largely complete, and will officially open when the installation of podium glass and interior construction is completed in late 2013 or early 2014.

==Attacks==

Early on the morning of September 11, 2001, 19 hijackers took control of four commercial airliners (two Boeing 757 and two Boeing 767) en route to California (three headed to LAX in Los Angeles, and one to San Francisco) after takeoffs from Boston, Massachusetts; Newark, New Jersey; and Washington, D.C. Large planes with long flights were selected for hijacking because they would be heavily fueled.

The four flights were:
*American Airlines Flight 11: Left Boston''s Logan Airport at 7:59 a.m. en route to Los Angeles with a crew of 11 and 76 passengers, not including five hijackers. The hijackers flew the plane into the North Tower of the World Trade Center at 8:46 a.m.
*United Airlines Flight 175: Left Logan Airport at 8:14 a.m. en route to Los Angeles with a crew of nine and 51 passengers, not including five hijackers. The hijackers flew the plane into the South Tower of the World Trade Center at 9:03 a.m.
*American Airlines Flight 77: Left Washington Dulles International Airport in Virginia at 8:20 a.m. en route to Los Angeles with a crew of six and 53 passengers, not including five hijackers. The hijackers flew the plane into the Pentagon at 9:37 a.m.
*United Airlines Flight 93: Left Newark International Airport at 8:42 a.m. en route to San Francisco, with a crew of seven and 33 passengers, not including four hijackers. As passengers attempted to subdue the hijackers, the aircraft crashed into the ground near Shanksville, Pennsylvania, at 10:03 a.m.
Media coverage was intense during the attacks and aftermath, beginning moments after the first crash into the World Trade Center.

===Events===
At 8:46 a.m., five hijackers crashed American Airlines Flight 11 into the northern facade of the World Trade Center''s North Tower (1 WTC), and at 9:03 a.m., another five hijackers crashed United Airlines Flight 175 into the southern facade of the South Tower (2 WTC).
Five hijackers flew American Airlines Flight 77 into the Pentagon at 9:37 a.m.

A fourth flight, United Airlines Flight 93, under the control of four hijackers, crashed near Shanksville, Pennsylvania, southeast of Pittsburgh, at 10:03 a.m. after the passengers fought the hijackers. Flight 93''s target is believed to have been either the Capitol or the White House. Flight 93''s cockpit voice recorder revealed crew and passengers tried to seize control of the plane from the hijackers after learning through phone calls that Flights 11, 77, and 175 been crashed into buildings that morning. Once it became evident to the hijackers that the passengers might regain control of the plane, the hijackers rolled the plane and intentionally crashed it.

Some passengers and crew members who called from the aircraft using the cabin airphone service and mobile phones provided details: several hijackers were aboard each plane; they used mace, tear gas, or pepper spray to overcome attendants; and some people aboard had been stabbed. Reports indicated hijackers stabbed and killed pilots, flight attendants, and one or more passengers. In their final report, the 9/11 Commission found the hijackers had recently purchased multi-function hand tools and assorted knives and blades. A flight attendant on Flight 11, a passenger on Flight 175, and passengers on Flight 93 said the hijackers had bombs, but one of the passengers said he thought the bombs were fake. The FBI found no traces of explosives at the crash sites, and the 9/11 Commission concluded that the bombs were probably fake.

Three buildings in the World Trade Center complex collapsed due to fire-induced structural failure. The South Tower collapsed at 9:59 a.m. after burning for 56 minutes in a fire caused by the impact of United Airlines Flight 175 and the explosion of its fuel. The North Tower collapsed at 10:28 a.m. after burning for 102 minutes. When the North Tower collapsed, debris fell on the nearby 7 World Trade Center building (7 WTC), damaging it and starting fires. These fires burned for hours, compromising the building''s structural integrity, and 7 WTC collapsed at 5:21 p.m. The Pentagon sustained major damage.

At 9:40 a.m., the FAA grounded all aircraft within the continental U.S., and aircraft already in flight were told to land immediately. All international civilian aircraft were either turned back or redirected to airports in Canada or Mexico, and all international flights were banned from landing on U.S. soil for three days. The attacks created widespread confusion among news organizations and air traffic controllers. Among the unconfirmed and often contradictory news reports aired throughout the day, one of the most prevalent said a car bomb had been detonated at the U.S. State Department''s headquarters in Washington, D.C. Another jet—Delta Air Lines Flight 1989—was suspected of having been hijacked, but the aircraft responded to controllers and landed safely in Cleveland, Ohio.

In a September  2002 interview, Khalid Sheikh Mohammed and Ramzi bin al-Shibh, who are believed to have organized the attacks, said Flight 93''s intended target was the United States Capitol, not the White House. During the planning stage of the attacks, Mohamed Atta, the hijacker and pilot of Flight 11, thought the White House might be too tough a target and sought an assessment from Hani Hanjour, who would later hijack and pilot Flight 77. Mohammed said al-Qaeda initially planned to target nuclear installations rather than the World Trade Center and the Pentagon, but decided against it, fearing things could "get out of control". Final decisions on targets, according to Mohammed, were left in the hands of the pilots.

===Casualties===

The attacks resulted in the deaths of 2,996 people, including the 19 hijackers and 2,977 victims. The victims included 246 on the four planes (from which there were no survivors), 2,606 in New York City in the towers and on the ground, and 125 at the Pentagon. Nearly all of the victims were civilians; 55 military personnel were among those killed at the Pentagon.

More than 90% of the workers and visitors who died in the towers had been at or above the points of impact. In the North Tower 1,355 people at or above the point of impact were trapped and died of smoke inhalation, fell or jumped from the tower to escape the smoke and flames, or were killed in the building''s eventual collapse. The destruction of all three staircases in the tower when Flight 11 hit made it impossible for anyone above the impact zone to escape. One hundred seven people below the point of impact died as well.

In the South Tower, one stairwell (A), was left intact after Flight 175 hit, allowing 14 people located on the floors of impact (including one man who saw the plane coming at him) and four more from the floors above to escape. 911 operators who received calls from individuals inside the tower were not well informed of the situation as it rapidly unfolded and as a result, told callers not to descend the tower on their own. 630 people died in that tower, fewer than half the number killed in the North Tower. Casualties in the South Tower were significantly reduced by some occupants deciding to start evacuating as soon as the North Tower was struck.

At least 200 people fell or jumped to their deaths from the burning towers (as exemplified in the photograph The Falling Man), landing on the streets and rooftops of adjacent buildings hundreds of feet below. Some occupants of each tower above the point of impact made their way toward the roof in hope of helicopter rescue, but the roof access doors were locked. No plan existed for helicopter rescues, and the combination of roof equipment and thick smoke and intense heat prevented helicopters from approaching.
A total of 411 emergency workers died as they tried to rescue people and fight fires. The New York City Fire Department (FDNY) lost 340 firefighters, a chaplain, and two paramedics. The New York City Police Department (NYPD) lost 23 officers. The Port Authority Police Department lost 37 officers. Eight emergency medical technicians (EMTs) and paramedics from private emergency medical services units were killed.

Cantor Fitzgerald L.P., an investment bank on the 101st–105th floors of the North Tower, lost 658 employees, considerably more than any other employer. Marsh Inc., located immediately below Cantor Fitzgerald on floors 93–100, lost 358 employees, and 175 employees of Aon Corporation were also killed. The National Institute of Standards and Technology (NIST) estimated that about 17,400 civilians were in the World Trade Center complex at the time of the attacks. Turnstile counts from the Port Authority suggest 14,154 people were typically in the Twin Towers by 8:45 a.m. The vast majority of people below the impact zone safely evacuated the buildings.

After New York, New Jersey lost the most state citizens, with the city of Hoboken sustaining the most deaths. More than 90 countries lost citizens in the attacks on the World Trade Center. Two people were added to the official death toll after dying from health conditions linked to exposure to dust from the collapse of the World Trade Center.

Weeks after the attack, the death toll was estimated to be over 6,000, more than twice the number of deaths eventually confirmed. The city was only able to identify remains for about 1,600 of the World Trade Center victims. The medical examiner''s office collected "about 10,000 unidentified bone and tissue fragments that cannot be matched to the list of the dead". Bone fragments were still being found in 2006 by workers who were preparing to demolish the damaged Deutsche Bank Building. In 2010, a team of anthropologists and archaeologists searched for human remains and personal items at the Fresh Kills Landfill, where seventy-two more human remains were recovered, bringing the total found to 1,845. DNA profiling continues in an attempt to identify additional victims. The remains are being held in storage in Memorial Park, outside the New York City Medical Examiner’s facilities. It is expected that the remains will be moved in 2013 to a repository behind a wall at the 9/11 museum. In July 2011, a team of scientists at the Office of Chief Medical Examiner was still trying to identify remains, in the hope that improved technology will allow them to identify other victims. On September 16, 2013, the 1,638th victim was identified. There are still 1,115 victims that have not been identified.

===Damage===

Along with the 110-floor Twin Towers, numerous other buildings at the World Trade Center site were destroyed or badly damaged, including WTC buildings 3 through 7 and St. Nicholas Greek Orthodox Church. The North Tower, South Tower, the Marriott Hotel (3 WTC), and 7 WTC were completely destroyed. The U.S. Customs House (6 World Trade Center), 4 World Trade Center, 5 World Trade Center, and both pedestrian bridges connecting buildings were severely damaged. The Deutsche Bank Building on 130 Liberty Street was partially damaged and demolished some years later, starting in 2007. The two buildings of the World Financial Center also suffered damage.

The Deutsche Bank Building across Liberty Street from the World Trade Center complex was later condemned as being uninhabitable because of toxic conditions inside the office tower, and was deconstructed. The Borough of Manhattan Community College''s Fiterman Hall at 30 West Broadway was condemned due to extensive damage in the attacks, and is being rebuilt. Other neighboring buildings including 90 West Street and the Verizon Building suffered major damage but have been restored. World Financial Center buildings, One Liberty Plaza, the Millenium Hilton, and 90 Church Street had moderate damage and have since been restored. Communications equipment on top of the North Tower was also destroyed, but media stations were quickly able to reroute signals and resume broadcasts.

The Pentagon was severely damaged by the impact of American Airlines Flight 77 and ensuing fires, causing one section of the building to collapse. As it approached the Pentagon, the airplane''s wings knocked over light poles and its right engine smashed into a power generator before crashing into the western side of the building, killing all 53 passengers, 5 hijackers, and 6 crew. The plane hit the Pentagon at the first-floor level. The front part of the fuselage disintegrated on impact, while the mid and tail sections kept moving for another fraction of a second. Debris from the tail section penetrated furthest into the building, breaking through  of the three outermost of the building''s five rings.

===Rescue and recovery===

The New York City Fire Department deployed 200 units (half of the department) to the site. Their efforts were supplemented by numerous off-duty firefighters and emergency medical technicians. The New York City Police Department sent Emergency Service Units and other police personnel, and deployed its aviation unit. Once on the scene, the FDNY, NYPD, and Port Authority police did not coordinate efforts and performed redundant searches for civilians. As conditions deteriorated, the NYPD aviation unit relayed information to police commanders, who issued orders for its personnel to evacuate the towers; most NYPD officers were able to safely evacuate before the buildings collapsed. With separate command posts set up and incompatible radio communications between the agencies, warnings were not passed along to FDNY commanders.

After the first tower collapsed, FDNY commanders issued evacuation warnings; however, due to technical difficulties with malfunctioning radio repeater systems, many firefighters never heard the evacuation orders. 9-1-1 dispatchers also received information from callers that was not passed along to commanders on the scene. Within hours of the attack, a substantial search and rescue operation was launched. After months of around-the-clock operations the World Trade Center site was cleared by the end of May 2002.

==Attackers and their background==

===al-Qaeda===

The origins of al-Qaeda can be traced to 1979 when the Soviet Union invaded Afghanistan. Osama bin Laden traveled to Afghanistan and helped organize Arab mujahideen to resist the Soviets. Under the guidance of Ayman al-Zawahiri, bin Laden became more radical. In 1996 bin Laden issued his first fatwā, calling for American soldiers to leave Saudi Arabia.

In a second fatwā in 1998, bin Laden outlined his objections to American foreign policy with respect to Israel, as well as the continued presence of American troops in Saudi Arabia after the Gulf War. Bin Laden used Islamic texts to exhort Muslims to attack Americans until the stated grievances are reversed, and according to bin Laden, Muslim legal scholars, "have throughout Islamic history unanimously agreed that the jihad is an individual duty if the enemy destroys the Muslim countries."

===Osama bin Laden===

Bin Laden, who orchestrated the attacks, initially denied but later admitted involvement. Al Jazeera broadcast a statement by bin Laden on September 16, 2001, stating, "I stress that I have not carried out this act, which appears to have been carried out by individuals with their own motivation." In November 2001, U.S. forces recovered a videotape from a destroyed house in Jalalabad, Afghanistan. In the tape, bin Laden is seen talking to Khaled al-Harbi and admits foreknowledge of the attacks. On December 27, 2001, a second bin Laden video was released. In the video, he said, "It has become clear that the West in general and America in particular have an unspeakable hatred for Islam....It is the hatred of crusaders. Terrorism against America deserves to be praised because it was a response to injustice, aimed at forcing America to stop its support for Israel, which kills our people...We say that the end of the United States is imminent, whether Bin Laden or his followers are alive or dead, for the awakening of the Muslim umma (nation) has occurred", but he stopped short of admitting responsibility for the attacks. The transcript references several times to the United States specifically targeting Muslims.

Shortly before the U.S. presidential election in 2004, in a taped statement, bin Laden publicly acknowledged al-Qaeda''s involvement in the attacks on the U.S. and admitted his direct link to the attacks. He said that the attacks were carried out because, "we are free ... and want to regain freedom for our nation. As you undermine our security we undermine yours." Bin Laden said he had personally directed his followers to attack the World Trade Center. Another video obtained by Al Jazeera in September 2006 shows bin Laden with Ramzi bin al-Shibh, as well as two hijackers, Hamza al-Ghamdi and Wail al-Shehri, as they make preparations for the attacks. The U.S. never formally indicted bin Laden for the 9/11 attacks but he was on the FBI''s Most Wanted List for the bombings of the U.S. Embassies in Dar es Salaam, Tanzania, and Nairobi, Kenya. After a nearly 10-year manhunt, bin Laden was killed by American special forces in a compound in Abbottabad, Pakistan on May 2, 2011.

===Khalid Sheikh Mohammed===

The journalist Yosri Fouda of the Arabic television channel Al Jazeera reported that in April 2002, Khalid Sheikh Mohammed admitted his involvement, along with Ramzi bin al-Shibh. The 9/11 Commission Report determined that the animosity towards the United States felt by Mohammed, the principal architect of the 9/11 attacks, stemmed from his "violent disagreement with U.S. foreign policy favoring Israel".

Mohammed was also an adviser and financier of the 1993 World Trade Center bombing and the uncle of Ramzi Yousef, the lead bomber in that attack.

Mohammed was arrested on March 1, 2003, in Rawalpindi, Pakistan, by Pakistani security officials working with the CIA, then transported to Guantanamo Bay and interrogated using methods including waterboarding. During U.S. hearings at Guantanamo Bay in March 2007, Mohammed again confessed his responsibility for the attacks, stating he "was responsible for the 9/11 operation from A to Z" and that his statement was not made under duress.

===Other al-Qaeda members===
In "Substitution for Testimony of Khalid Sheikh Mohammed" from the trial of Zacarias Moussaoui, five people are identified as having been completely aware of the operation''s details. They are bin Laden, Khalid Sheikh Mohammed, Ramzi bin al-Shibh, Abu Turab al-Urduni and Mohammed Atef. To date, only peripheral figures have been tried or convicted for the attacks.

On September 26, 2005, the Spanish high court sentenced Abu Dahdah to 27 years in prison for conspiracy on the 9/11 attacks and being a member of the terrorist organization al-Qaeda. At the same time, another 17 al-Qaeda members were sentenced to penalties of between six and eleven years. On February 16, 2006, the Spanish Supreme Court reduced the Abu Dahdah penalty to 12 years because it considered that his participation in the conspiracy was not proven.

Also in 2006, Moussaoui, who some originally suspected might have been the assigned 20th hijacker, was convicted for the lesser role of conspiracy to commit acts of terrorism and air piracy. He is serving a life sentence without parole. Mounir el-Motassadeq, an associate of the Hamburg-based hijackers, is serving 15 years for his role in helping the hijackers prepare for the attacks.

The Hamburg cell in Germany included radical Islamists who eventually came to be key operatives in the 9/11 attacks. Mohamed Atta, Marwan al-Shehhi, Ziad Jarrah, Ramzi bin al-Shibh, and Said Bahaji were all members of al-Qaeda''s Hamburg cell.

===Motives===

Osama bin Laden''s declaration of a holy war against the United States, and a 1998 fatwā signed by bin Laden and others, calling for the killing of American civilians, are seen by investigators as evidence of his motivation. In bin Laden''s November 2002 "Letter to America", he explicitly stated that al-Qaeda''s motives for their attacks include
*Support for the "attacks against Muslims" in Somalia
*Support of Russian "atrocities against Muslims" in Chechnya
*Support of Indian "oppression against Muslims" in Kashmir
*The presence of U.S. troops in Saudi Arabia
* U.S. support of Israel
* The sanctions against Iraq

After the attacks, bin Laden and al-Zawahiri released additional video tapes and audio tapes, some of which repeated those reasons for the attacks. Two particularly important publications were bin Laden''s 2002 "Letter to America", and a 2004 video tape by bin Laden.

Bin Laden interpreted the Prophet Muhammad as having banned the "permanent presence of infidels in Arabia". In 1996, bin Laden issued a fatwā calling for American troops to leave Saudi Arabia. In 1998, al-Qaeda wrote, "for over seven years the United States has been occupying the lands of Islam in the holiest of places, the Arabian Peninsula, plundering its riches, dictating to its rulers, humiliating its people, terrorizing its neighbors, and turning its bases in the Peninsula into a spearhead through which to fight the neighboring Muslim peoples."

In a December 1999 interview, bin Laden said he felt that Americans were "too near to Mecca", and considered this a provocation to the entire Muslim world. One analysis of suicide terrorism suggested that without U.S. troops in Saudi Arabia, al-Qaeda likely would not have been able to get people to commit to suicide missions.

In the 1998 fatwā, al-Qaeda identified the Iraq sanctions as a reason to kill Americans, condemning the "protracted blockade" among other actions that constitute a declaration of war against "Allah, his messenger, and Muslims." The fatwā declared that "the ruling to kill the Americans and their allies – civilians and military – is an individual duty for every Muslim who can do it in any country in which it is possible to do it, in order to liberate the al-Aqsa Mosque and the holy mosque of Mecca from their grip, and in order for their Americans'' armies to move out of all the lands of Islam, defeated and unable to threaten any Muslim."

Bin Laden claimed, in 2004, that the idea of destroying the towers had first occurred to him in 1982, when he witnessed Israel''s bombardment of high-rise apartment buildings during the 1982 Lebanon War. Some analysts, including Mearsheimer and Walt, also claim that one motivation for the attacks was U.S. support of Israel. In 2004 and 2010, bin Laden again connected the September 11 attacks with U.S. support of Israel, although most of the letter expressed bin Laden''s disdain with President Bush and bin Laden''s hope to "destroy and bankrupt" the U.S.

In addition to those cited by bin Laden and al-Qaeda, analysts have suggested other motives, including western support of Islamist and non-Islamist authoritarian regimes in Saudi Arabia, Iran, Egypt, Iraq, Pakistan and northern Africa, and the presence of western troops in some of these countries. Other authors suggest the "humiliation" resulting from the Islamic world falling behind the Western world – this discrepancy rendered especially visible by the globalization trend and a desire to provoke the U.S. into a broader war against the Islamic world in the hope of motivating more allies to support al-Qaeda.

Others have argued that 9/11 was a strategic move with the objective of provoking America into a war that would incite a pan-Islamic revolution.

==Planning of the attacks==

The idea for the attacks came from Khalid Sheikh Mohammed, who first presented it to Osama bin Laden in 1996. At that time, bin Laden and al-Qaeda were in a period of transition, having just relocated back to Afghanistan from Sudan. The 1998 African Embassy bombings and bin Laden''s 1998 fatwā marked a turning point, as bin Laden became intent on attacking the United States.

In late 1998 or early 1999, bin Laden gave approval for Mohammed to go forward with organizing the plot. A series of meetings occurred in early 1999, involving Mohammed, bin Laden, and his deputy Mohammed Atef. Atef provided operational support for the plot, including target selections and helping arrange travel for the hijackers. Bin Laden overruled Mohammed, rejecting some potential targets such as the U.S. Bank Tower in Los Angeles because, "there was not enough time to prepare for such an operation".

Bin Laden provided leadership and financial support for the plot, and was involved in selecting participants. Bin Laden initially selected Nawaf al-Hazmi and Khalid al-Mihdhar, both experienced jihadists who had fought in Bosnia. Hazmi and Mihdhar arrived in the United States in mid-January 2000. In spring 2000, Hazmi and Mihdhar took flying lessons in San Diego, California, but both spoke little English, did poorly with flying lessons, and eventually served as secondary – or "muscle" – hijackers.

In late 1999, a group of men from Hamburg, Germany, arrived in Afghanistan, including Mohamed Atta, Marwan al-Shehhi, Ziad Jarrah, and Ramzi bin al-Shibh. Bin Laden selected these men because they were educated, could speak English, and had experience living in the west. New recruits were routinely screened for special skills and al-Qaeda leaders consequently discovered that Hani Hanjour already had a commercial pilot''s license.

Hanjour arrived in San Diego on December 8, 2000, joining Hazmi. They soon left for Arizona, where Hanjour took refresher training. Marwan al-Shehhi arrived at the end of May 2000, while Atta arrived on June 3, 2000, and Jarrah arrived on June 27, 2000. Bin al-Shibh applied several times for a visa to the United States, but as a Yemeni, he was rejected out of concerns he would overstay his visa and remain as an illegal immigrant. Bin al-Shibh stayed in Hamburg, providing coordination between Atta and Mohammed. The three Hamburg cell members all took pilot training in South Florida.

In spring 2001, the secondary hijackers began arriving in the United States. In July 2001, Atta met with bin al-Shibh in Spain, where they coordinated details of the plot, including final target selection. Bin al-Shibh also passed along bin Laden''s wish for the attacks to be carried out as soon as possible.

==Aftermath==

===Immediate response===

At 8:32 a.m., Federal Aviation Administration (FAA) officials were notified Flight 11 had been hijacked and they in turn notified the North American Aerospace Defense Command (NORAD). NORAD scrambled two F-15s from Otis Air National Guard Base in Massachusetts and they were airborne by 8:53 a.m. Because of slow and confused communication from FAA officials, NORAD had 9 minutes'' notice that Flight 11 had been hijacked, and no notice about any of the other flights before they crashed. After both of the Twin Towers had already been hit, more fighters were scrambled from Langley Air Force Base in Virginia at 9:30 a.m. At 10:20 a.m. Vice President Dick Cheney issued orders to shoot down any commercial aircraft that could be positively identified as being hijacked. However, these instructions were not relayed in time for the fighters to take action. Some fighters took to the air without live ammunition, knowing that to prevent the hijackers from striking their intended targets, the pilots might have to intercept and crash their fighters into the hijacked planes, possibly ejecting at the last moment.

For the first time in U.S. history, SCATANA was invoked, closing all airspace and immediately grounding all non-emergency civilian aircraft in the United States, Canada, and several other countries, thus stranding tens of thousands of passengers across the world. The Federal Aviation Administration closed American airspace to all international flights, causing about five hundred flights to be turned back or redirected to other countries. Canada received 226 of the diverted flights and launched Operation Yellow Ribbon to deal with the large numbers of grounded planes and stranded passengers.

The 9/11 attacks had immediate effects upon the American people. Police and rescue workers from around the country took leaves of absence, traveling to New York City to help recover bodies from the twisted remnants of the Twin Towers. Blood donations across the U.S. surged in the weeks after 9/11.

The deaths of adults who were killed in the attacks or died in rescue operations resulted in over 3,000 children losing a parent. Subsequent studies documented children''s reactions to these actual losses and to feared losses of life, the protective environment in the aftermath of the attacks, and effects on surviving caregivers.

===Military operations following the attacks===

At 2:40 p.m. in the afternoon of September 11, Secretary of Defense Donald Rumsfeld was issuing rapid orders to his aides to look for evidence of Iraqi involvement. According to notes taken by senior policy official Stephen Cambone, Rumsfeld asked for, "Best info fast. Judge whether good enough hit S.H." (Saddam Hussein) "at same time. Not only UBL" (Osama bin Laden). Cambone''s notes quoted Rumsfeld as saying, "Need to move swiftly – Near term target needs – go massive – sweep it all up. Things related and not."

US 10th Mountain Division soldiers in Afghanistan.jpg|thumb|left|alt=A line of soldiers carrying equipment on their backs walking toward a transport helicopter in desert terrain|U.S. soldiers in Afghanistan

The NATO council declared the attacks on the United States were an attack on all NATO nations which satisfied Article 5 of the NATO charter. This marked the first invocation of Article 5, which had been written during the Cold War with an attack by the Soviet Union in mind. Australian Prime Minister John Howard who was in Washington D.C. during the attacks invoked Article IV of the ANZUS treaty. The Bush administration announced a War on Terror, with the stated goals of bringing bin Laden and al-Qaeda to justice and preventing the emergence of other terrorist networks. These goals would be accomplished by imposing economic and military sanctions against states harboring terrorists, and increasing global surveillance and intelligence sharing.

On September 14, 2001, the U.S. Congress passed the Authorization for Use of Military Force Against Terrorists. Still in effect, it grants the President the authority to use all "necessary and appropriate force" against those whom he determined "planned, authorized, committed or aided" the September 11th attacks, or who harbored said persons or groups.

On October 7, 2001, the War in Afghanistan began when U.S. and British forces initiated aerial bombing campaigns targeting Taliban and al-Qaeda camps, then later invaded Afghanistan with ground troops of the Special Forces. The overthrow of the Taliban rule of Afghanistan by a U.S.-led coalition was the second-biggest operation of the U.S. Global War on Terrorism outside of the United States, and the largest directly connected to terrorism. Conflict in Afghanistan between the Taliban insurgency and the International Security Assistance Force is ongoing. The Philippines and Indonesia, among other nations with their own internal conflicts with Islamic terrorism, also increased their military readiness.

===American response===

Following the attacks, President Bush''s approval rating soared to 90%. On September 20, 2001 he addressed the nation and a joint session of the United States Congress regarding the events of September 11 and the subsequent nine days of rescue and recovery efforts, and described his intended response to the attacks. New York City mayor Rudy Giuliani''s highly visible role won him high praise in New York and nationally.

Many relief funds were immediately set up to assist victims of the attacks, with the task of providing financial assistance to the survivors of the attacks and to the families of victims. By the deadline for victim''s compensation on September 11, 2003, 2,833 applications had been received from the families of those who were killed.

Contingency plans for the continuity of government and the evacuation of leaders were implemented almost immediately after the attacks. However, Congress was not told that the United States had been under a continuity of government status until February 2002.

In the largest restructuring of the U.S. government in contemporary history, the United States enacted the Homeland Security Act of 2002, creating the Department of Homeland Security. Congress also passed the USA PATRIOT Act, saying it would help detect and prosecute terrorism and other crimes. Civil liberties groups have criticized the PATRIOT Act, saying it allows law enforcement to invade the privacy of citizens and that it eliminates judicial oversight of law enforcement and domestic intelligence. In an effort to effectively combat future acts of terrorism, the National Security Agency (NSA) was given broad powers. NSA commenced warrantless surveillance of telecommunications which was sometimes criticized since it permitted the agency "to eavesdrop on telephone and e-mail communications between the United States and people overseas without a warrant".

====Hate crimes====
Numerous incidents of harassment and hate crimes against Muslims and South Asians were reported in the days following the 9/11 attacks. Sikhs were also targeted because Sikh males usually wear turbans, which are stereotypically associated with Muslims. There were reports of attacks on mosques and other religious buildings (including the firebombing of a Hindu temple), and assaults on people, including one murder: Balbir Singh Sodhi, a Sikh mistaken for a Muslim, was fatally shot on September 15, 2001, in Mesa, Arizona.

According to an academic study, people perceived to be Middle Eastern were as likely to be victims of hate crimes as followers of Islam during this time. The study also found a similar increase in hate crimes against people who may have been perceived as Muslims, Arabs and others thought to be of Middle Eastern origin. A report by the South Asian American advocacy group known as South Asian Americans Leading Together, documented media coverage of 645 bias incidents against Americans of South Asian or Middle Eastern descent between September 11 and 17. Various crimes such as vandalism, arson, assault, shootings, harassment, and threats in numerous places were documented.

====Muslim American response====
Muslim organizations in the United States were swift to condemn the attacks and called "upon Muslim Americans to come forward with their skills and resources to help alleviate the sufferings of the affected people and their families". These organizations included the Islamic Society of North America, American Muslim Alliance, American Muslim Council, Council on American-Islamic Relations, Islamic Circle of North America, and the Shari''a Scholars Association of North America. Along with monetary donations, many Islamic organizations launched blood drives and provided medical assistance, food, and shelter for victims.

===International response===

The attacks were denounced by mass media and governments worldwide. Across the globe, nations offered pro-American support and solidarity. Leaders in most Middle Eastern countries, and Afghanistan, condemned the attacks. Iraq was a notable exception, with an immediate official statement that, "the American cowboys are reaping the fruit of their crimes against humanity". While the government of Saudi Arabia officially condemned the attacks, privately many Saudis favored bin Laden''s cause. As in the United States, the aftermath of the attacks saw tensions increase in other countries between Muslims and non-Muslims.

United Nations Security Council Resolution 1368 condemned the attacks, and expressed readiness to take all necessary steps to respond and combat all forms of terrorism in accordance with their Charter. Numerous countries introduced anti-terrorism legislation and froze bank accounts they suspected of al-Qaeda ties. Law enforcement and intelligence agencies in a number of countries arrested alleged terrorists.

Tens of thousands of people attempted to flee Afghanistan following the attacks, fearing a response by the United States. Pakistan, already home to many Afghan refugees from previous conflicts, closed its border with Afghanistan on September 17, 2001. Approximately one month after the attacks, the United States led a broad coalition of international forces to overthrow the Taliban regime from Afghanistan for their harboring of al-Qaeda. Though Pakistani authorities were initially reluctant to align themselves with the United States against the Taliban, they permitted the coalition access to their military bases, and arrested and handed over to the U.S. over 600 suspected al-Qaeda members.

The U.S. set up the Guantanamo Bay detention camp to hold inmates they defined as "illegal enemy combatants". The legitimacy of these detentions has been questioned by the European Union and human rights organizations.

==Long-term effects==

===Economic aftermath===

The attacks had a significant economic impact on United States and world markets. The stock exchanges did not open on September 11 and remained closed until September 17. Reopening, the Dow Jones Industrial Average (DJIA) fell 684 points, or 7.1%, to 8921, a record-setting one-day point decline. By the end of the week, the DJIA had fallen 1,369.7 points (14.3%), at the time its largest one-week point drop in history. In 2001 dollars, U.S. stocks lost $1.4 trillion in valuation for the week.

In New York City, about 430,000 job-months and $2.8 billion dollars in wages were lost in the three months after the attacks. The economic effects were mainly on the economy''s export sectors. The city''s GDP was estimated to have declined by $27.3 billion for the last three months of 2001 and all of 2002. The U.S. government provided $11.2 billion in immediate assistance to the Government of New York City in September 2001, and $10.5 billion in early 2002 for economic development and infrastructure needs.
Deficits vs. Debt Increases - 2008.png|thumb|left|U.S. deficit and debt increases 2001–08
Also hurt were small businesses in Lower Manhattan near the World Trade Center, 18,000 of which were destroyed or displaced, resulting in lost jobs and their consequent wages. Assistance was provided by Small Business Administration loans, federal government Community Development Block Grants, and Economic Injury Disaster Loans. Some  of Lower Manhattan office space was damaged or destroyed. Many wondered whether these jobs would return, and if the damaged tax base would recover. Studies of the economic effects of 9/11 show the Manhattan office real-estate market and office employment were less affected than first feared, because of the financial services industry''s need for face-to-face interaction.

North American air space was closed for several days after the attacks and air travel decreased upon its reopening, leading to a nearly 20% cutback in air travel capacity, and exacerbating financial problems in the struggling U.S. airline industry.

The September 11 attacks also led indirectly to the U.S. wars in Afghanistan and Iraq, as well as additional homeland security spending, totaling at least $5 trillion.

===Health effects===

Hundreds of thousands of tons of toxic debris containing more than 2,500 contaminants, including known carcinogens, were spread across Lower Manhattan due to the collapse of the Twin Towers. Exposure to the toxins in the debris is alleged to have contributed to fatal or debilitating illnesses among people who were at ground zero. The Bush administration ordered the Environmental Protection Agency (EPA) to issue reassuring statements regarding air quality in the aftermath of the attacks, citing national security, but the EPA did not determine that air quality had returned to pre-September 11 levels until June 2002.

Health effects extended to residents, students, and office workers of Lower Manhattan and nearby Chinatown. Several deaths have been linked to the toxic dust, and the victims'' names were included in the World Trade Center memorial. Approximately 18,000 people have been estimated to have developed illnesses as a result of the toxic dust. There is also scientific speculation that exposure to various toxic products in the air may have negative effects on fetal development. A notable children''s environmental health center is currently analyzing the children whose mothers were pregnant during the WTC collapse, and were living or working nearby. A study of rescue workers released in April 2010 found that all those studied had impaired lung functions, and that 30–40% were reporting little or no improvement in persistent symptoms that started within the first year of the attack.

Years after the attacks, legal disputes over the costs of illnesses related to the attacks were still in the court system. On October 17, 2006, a federal judge rejected New York City''s refusal to pay for health costs for rescue workers, allowing for the possibility of numerous suits against the city. Government officials have been faulted for urging the public to return to lower Manhattan in the weeks shortly after the attacks. Christine Todd Whitman, administrator of the EPA in the aftermath of the attacks, was heavily criticized by a U.S. District Judge for incorrectly saying that the area was environmentally safe. Mayor Giuliani was criticized for urging financial industry personnel to return quickly to the greater Wall Street area.

The United States Congress passed the James L. Zadroga 9/11 Health and Compensation Act on December 22, 2010, and President Barack Obama signed the act into law on January 2, 2011. It allocated $4.2 billion to create the World Trade Center Health Program, which provides testing and treatment for people suffering from long-term health problems related to the 9/11 attacks. The WTC Health Program replaced preexisting 9/11-related health programs such as the Medical Monitoring and Treatment Program and the WTC Environmental Health Center program.

===Government policies toward terrorism===
As a result of the attacks, many governments across the world passed legislation to combat terrorism. In Germany, where several of the 9/11 terrorists had resided and taken advantage of that country''s liberal asylum policies, two major anti-terrorism packages were enacted. The first removed legal loopholes that permitted terrorists to live and raise money in Germany. The second addressed the effectiveness and communication of intelligence and law enforcement. Canada passed the Canadian Anti-Terrorism Act, that nation''s first anti-terrorism law. The United Kingdom passed the Anti-terrorism, Crime and Security Act 2001 and the Prevention of Terrorism Act 2005. New Zealand enacted the Terrorism Suppression Act 2002.

In the United States, the Department of Homeland Security was created to coordinate domestic anti-terrorism efforts. The USA Patriot Act gave the federal government greater powers, including the authority to detain foreign terror suspects for a week without charge, to monitor telephone communications, e-mail, and Internet use by terror suspects, and to prosecute suspected terrorists without time restrictions. The Federal Aviation Administration ordered that airplane cockpits be reinforced to prevent terrorists gaining control of planes, and assigned sky marshals to flights. Further, the Aviation and Transportation Security Act made the federal government, rather than airports, responsible for airport security. The law created a federal security force to inspect passengers and luggage, causing long delays and concern over passenger privacy.

===Cultural impact===

The impact of 9/11 extends beyond geopolitics into society and culture in general. Immediate responses to 9/11 included greater focus on home life and time spent with family, higher church attendance, and increased expressions of patriotism such as the flying of flags. The radio industry responded by removing certain songs from playlists, and the attacks have subsequently been used as background, narrative or thematic elements in film, television, music and literature. Already-running television shows as well as programs developed after 9/11 have reflected post-9/11 cultural concerns.  9/11 conspiracy theories have become social phenomena, despite negligible support for such views from expert scientists, engineers, and historians. 9/11 has also had a major impact on the religious faith of many individuals; for some it strengthened, to find consolation to cope with the loss of loved ones and overcome their grief; others started to question their faith or lost it entirely, because they couldn''t reconcile it with their view of religion.

The culture of America succeeding the attacks is noted for heightened security and an increased demand thereof, as well as paranoia and anxiety regarding future terrorist attacks that includes most of the nation. Psychologists have also confirmed that there has been an increased amount of national anxiety in commercial air travel.

==Investigations==

===FBI investigation===

Immediately after the attacks, the Federal Bureau of Investigation started PENTTBOM, the largest criminal inquiry in the history of the United States. At its height, more than half of the FBI''s agents worked on the investigation and followed a half-million leads. The FBI concluded that there was "clear and irrefutable" evidence linking al-Qaeda and bin Laden to the attacks. The FBI was quickly able to identify the hijackers, including leader Mohamed Atta, when his luggage was discovered at Boston''s Logan Airport. Atta had been forced to check two of his three bags due to space limitations on the 19-seat commuter flight he took to Boston.  Due to a new policy instituted to prevent flight delays, the luggage failed to make it aboard American Airlines Flight 11 as planned. The luggage contained the hijackers'' names, assignments and al-Qaeda connections. "It had all these Arab-language (sic) papers that amounted to the Rosetta stone of the investigation", said one FBI agent.

Within hours of the attacks, the FBI released the names and in many cases the personal details of the suspected pilots and hijackers. By midday, the U.S. National Security Agency and German intelligence agencies had intercepted communications pointing to Osama bin Laden. On September 27, 2001, the FBI released photos of the 19 hijackers, along with information about possible nationalities and aliases. Fifteen of the men were from Saudi Arabia, two from the United Arab Emirates, one (Atta) from Egypt, and one from Lebanon.

===9/11 Commission===

The National Commission on Terrorist Attacks Upon the United States (9/11 Commission), chaired by former New Jersey Governor Thomas Kean, was formed in late 2002 to prepare a thorough account of the circumstances surrounding the attacks, including preparedness for and the immediate response to the attacks. On July 22, 2004, the 9/11 Commission issued the 9/11 Commission Report. The report detailed the events of 9/11, found the attacks were carried out by members of al-Qaeda, and examined how security and intelligence agencies were inadequately coordinated to prevent the attacks. Formed from an independent bipartisan group of mostly former Senators, Representatives, and Governors, the commissioners explained, "We believe the 9/11 attacks revealed four kinds of failures: in imagination, policy, capabilities, and management". The commission made numerous recommendations on how to prevent future attacks, and in 2011 was dismayed that several of its recommendations had yet to be implemented.

===Collapse of the World Trade Center===

The U.S. National Institute of Standards and Technology (NIST) investigated the collapses of the Twin Towers and 7 WTC. The investigations examined why the buildings collapsed and what fire protection measures were in place, and evaluated how fire protection systems might be improved in future construction. The investigation into the collapse of 1 WTC and 2 WTC was concluded in October 2005 and that of 7 WTC was completed in August 2008.

NIST found that the fireproofing on the Twin Towers'' steel infrastructures was blown off by the initial impact of the planes and that, had this not occurred, the towers likely would have remained standing. A 2007 study of the north tower''s collapse published by researchers of Purdue University determined that, since the plane''s impact had stripped off much of the structure''s thermal insulation, the heat from a typical office fire would have softened and weakened the exposed girders and columns enough to initiate the collapse regardless of the number of columns cut or damaged by the impact.

The director of the original investigation stated that, "the towers really did amazingly well. The terrorist aircraft didn’t bring the buildings down; it was the fire which followed. It was proven that you could take out two thirds of the columns in a tower and the building would still stand." The fires weakened the trusses supporting the floors, making the floors sag. The sagging floors pulled on the exterior steel columns causing the exterior columns to bow inward. With the damage to the core columns, the buckling exterior columns could no longer support the buildings, causing them to collapse. Additionally, the report found the towers'' stairwells were not adequately reinforced to provide adequate emergency escape for people above the impact zones. NIST concluded that uncontrolled fires in 7 WTC caused floor beams and girders to heat and subsequently "caused a critical support column to fail, initiating a fire-induced progressive collapse that brought the building down".

===Internal review of the CIA===
The Inspector General of the CIA conducted an internal review of the CIA''s pre-9/11 performance and was harshly critical of senior CIA officials for not doing everything possible to confront terrorism. He criticized their failure to stop two of the 9/11 hijackers, Nawaf al-Hazmi and Khalid al-Mihdhar, as they entered the United States and their failure to share information on the two men with the FBI. In May 2007, senators from both major U.S. political parties drafted legislation to make the review public. One of the backers, Senator Ron Wyden said, "The American people have a right to know what the Central Intelligence Agency was doing in those critical months before 9/11."

==Rebuilding and revitalization==

On the day of the attacks, New York City mayor Rudy Giuliani proclaimed, "We will rebuild. We''re going to come out of this stronger than before, politically stronger, economically stronger. The skyline will be made whole again."

The damaged section of the Pentagon was rebuilt and occupied within a year of the attacks. The temporary World Trade Center PATH station opened in late 2003 and construction of the new 7 World Trade Center was completed in 2006. Work on rebuilding the main World Trade Center site was delayed until late 2006 when leaseholder Larry Silverstein and the Port Authority of New York and New Jersey agreed on financing. One World Trade Center is currently under construction at the site and on May 20, 2013, One World Trade Center became the tallest building in the Western Hemisphere at 1,776  ft (541 m) with the installation of the spire that rests atop the building.

On the World Trade Center site, three more office towers are expected to be built one block east of where the original towers stood. Construction has begun on all three of these towers; they are expected to be completed after One World Trade Center.

==Memorials==

In the days immediately following the attacks, many memorials and vigils were held around the world. In addition, people posted photographs of the dead and missing all around Ground Zero. A witness described being unable to "get away from faces of innocent victims who were killed. Their pictures are everywhere, on phone booths, street lights, walls of subway stations. Everything reminded me of a huge funeral, people quiet and sad, but also very nice. Before, New York gave me a cold feeling; now people were reaching out to help each other.”

One of the first memorials was the Tribute in Light, an installation of 88 searchlights at the footprints of the World Trade Center towers. In New York, the World Trade Center Site Memorial Competition was held to design an appropriate memorial on the site. The winning design, Reflecting Absence, was selected in August 2006, and consists of a pair of reflecting pools in the footprints of the towers, surrounded by a list of the victims'' names in an underground memorial space. Plans for a museum on the site have been put on hold, following the abandonment of the International Freedom Center in reaction to complaints from the families of many victims.

The Pentagon Memorial was completed and opened to the public on the seventh anniversary of the attacks in 2008. It consists of a landscaped park with 184 benches facing the Pentagon. When the Pentagon was repaired in 2001–2002, a private chapel and indoor memorial were included, located at the spot where Flight 77 crashed into the building.

In Shanksville, a permanent Flight 93 National Memorial is planned to include a sculpted grove of trees forming a circle around the crash site, bisected by the plane''s path, while wind chimes will bear the names of the victims. A temporary memorial is located  from the crash site.
New York City firefighters donated a cross made of steel from the World Trade Center and mounted on top of a platform shaped like the Pentagon. It was installed outside the firehouse on August 25, 2008. Many other permanent memorials are elsewhere. Scholarships and charities have been established by the victims'' families, and by many other organizations and private figures.

On every anniversary, in New York City, the names of the victims who died there are read out against a background of somber music. The President of the United States attends a memorial service at the Pentagon, and asks Americans to observe Patriot Day with a moment of silence. Smaller services are held in Shanksville, Pennsylvania, which are usually attended by the President''s spouse.', 1);


--
-- Data for Name: document_defaultannotations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: document_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('document_id_seq', 8, true);


--
-- Data for Name: label; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO label (labelid) VALUES ('OTHER');
INSERT INTO label (labelid) VALUES ('NONE');
INSERT INTO label (labelid) VALUES ('GENERIC');
INSERT INTO label (labelid) VALUES ('CHOCO');
INSERT INTO label (labelid) VALUES ('STATE');
INSERT INTO label (labelid) VALUES ('EVENT');


--
-- Data for Name: label_labelset; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO label_labelset (label_set_id, label_id) VALUES (2, 'OTHER');
INSERT INTO label_labelset (label_set_id, label_id) VALUES (1, 'OTHER');
INSERT INTO label_labelset (label_set_id, label_id) VALUES (3, 'OTHER');
INSERT INTO label_labelset (label_set_id, label_id) VALUES (1, 'NONE');
INSERT INTO label_labelset (label_set_id, label_id) VALUES (3, 'NONE');
INSERT INTO label_labelset (label_set_id, label_id) VALUES (2, 'GENERIC');
INSERT INTO label_labelset (label_set_id, label_id) VALUES (1, 'CHOCO');
INSERT INTO label_labelset (label_set_id, label_id) VALUES (3, 'CHOCO');
INSERT INTO label_labelset (label_set_id, label_id) VALUES (2, 'STATE');
INSERT INTO label_labelset (label_set_id, label_id) VALUES (1, 'STATE');
INSERT INTO label_labelset (label_set_id, label_id) VALUES (3, 'STATE');
INSERT INTO label_labelset (label_set_id, label_id) VALUES (2, 'EVENT');


--
-- Data for Name: labellabelsetmap; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: labellabelsetmap_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('labellabelsetmap_id_seq', 1, false);


--
-- Data for Name: labellabelsetmap_labelset; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: labelset; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO labelset (id, exclusive, name) VALUES (1, true, 'SituationEntityType2');
INSERT INTO labelset (id, exclusive, name) VALUES (2, false, 'SituationEntityType1');
INSERT INTO labelset (id, exclusive, name) VALUES (3, false, 'SituationEntityType3');


--
-- Name: labelset_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('labelset_id_seq', 3, true);


--
-- Data for Name: link; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: link_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('link_id_seq', 1, false);


--
-- Data for Name: link_labelmap; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: linklabel; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO linklabel (linklabel) VALUES ('red');
INSERT INTO linklabel (linklabel) VALUES ('brown');
INSERT INTO linklabel (linklabel) VALUES ('after');
INSERT INTO linklabel (linklabel) VALUES ('yellow');
INSERT INTO linklabel (linklabel) VALUES ('blue');
INSERT INTO linklabel (linklabel) VALUES ('before');
INSERT INTO linklabel (linklabel) VALUES ('overlap');


--
-- Data for Name: linklabel_linkset; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO linklabel_linkset (linklabel_id, link_label_set_id) VALUES ('red', 1);
INSERT INTO linklabel_linkset (linklabel_id, link_label_set_id) VALUES ('red', 3);
INSERT INTO linklabel_linkset (linklabel_id, link_label_set_id) VALUES ('brown', 1);
INSERT INTO linklabel_linkset (linklabel_id, link_label_set_id) VALUES ('brown', 3);
INSERT INTO linklabel_linkset (linklabel_id, link_label_set_id) VALUES ('after', 2);
INSERT INTO linklabel_linkset (linklabel_id, link_label_set_id) VALUES ('yellow', 1);
INSERT INTO linklabel_linkset (linklabel_id, link_label_set_id) VALUES ('blue', 3);
INSERT INTO linklabel_linkset (linklabel_id, link_label_set_id) VALUES ('before', 2);
INSERT INTO linklabel_linkset (linklabel_id, link_label_set_id) VALUES ('overlap', 2);


--
-- Data for Name: linklabellinksetmap; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: linklabellinksetmap_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('linklabellinksetmap_id_seq', 1, false);


--
-- Data for Name: linklabellinksetmap_linkset; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: linkset; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO linkset (id, allowunlabeledlinks, name, endtype_fk, starttype_fk) VALUES (1, false, NULL, 'verb', 'verb');
INSERT INTO linkset (id, allowunlabeledlinks, name, endtype_fk, starttype_fk) VALUES (2, false, NULL, 'verb', 'verb');
INSERT INTO linkset (id, allowunlabeledlinks, name, endtype_fk, starttype_fk) VALUES (3, false, NULL, 'passage', 'verb');


--
-- Name: linkset_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('linkset_id_seq', 3, true);


--
-- Data for Name: project; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO project (id, name, scheme) VALUES (1, 'Project1', 1);


--
-- Name: project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('project_id_seq', 1, true);


--
-- Data for Name: projects_manager; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO projects_manager (project_id, manager_id) VALUES (1, 6);


--
-- Data for Name: projects_watchingusers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: scheme; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO scheme (id, name, creator_id) VALUES (1, 'Copy of ThreeLinkSetsComplex', 3);


--
-- Name: scheme_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('scheme_id_seq', 1, true);


--
-- Data for Name: scheme_labelset; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO scheme_labelset (scheme_id, labelset_id) VALUES (1, 2);
INSERT INTO scheme_labelset (scheme_id, labelset_id) VALUES (1, 1);
INSERT INTO scheme_labelset (scheme_id, labelset_id) VALUES (1, 3);


--
-- Data for Name: scheme_linkset; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO scheme_linkset (scheme_id, linkset_id) VALUES (1, 2);
INSERT INTO scheme_linkset (scheme_id, linkset_id) VALUES (1, 1);
INSERT INTO scheme_linkset (scheme_id, linkset_id) VALUES (1, 3);


--
-- Data for Name: scheme_targettype; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO scheme_targettype (scheme_id, targettype) VALUES (1, 'passage');
INSERT INTO scheme_targettype (scheme_id, targettype) VALUES (1, 'verb');


--
-- Data for Name: sequence; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO sequence (seq_name, seq_count) VALUES ('SEQ_GEN', 0);


--
-- Data for Name: state; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO state (id, completed, lastedit, document_fk, user_fk) VALUES (1, false, '2016-06-01 20:53:13.125', 2, 2);
INSERT INTO state (id, completed, lastedit, document_fk, user_fk) VALUES (2, false, '2016-06-01 20:53:13.126', 8, 2);
INSERT INTO state (id, completed, lastedit, document_fk, user_fk) VALUES (3, false, '2016-06-01 20:53:13.126', 7, 2);
INSERT INTO state (id, completed, lastedit, document_fk, user_fk) VALUES (4, false, '2016-06-01 20:53:13.126', 6, 2);
INSERT INTO state (id, completed, lastedit, document_fk, user_fk) VALUES (5, false, '2016-06-01 20:53:13.125', 4, 2);
INSERT INTO state (id, completed, lastedit, document_fk, user_fk) VALUES (6, false, '2016-06-01 20:53:13.125', 3, 2);
INSERT INTO state (id, completed, lastedit, document_fk, user_fk) VALUES (7, false, '2016-06-01 20:53:13.125', 5, 2);
INSERT INTO state (id, completed, lastedit, document_fk, user_fk) VALUES (8, false, '2016-06-01 20:53:13.125', 1, 2);
INSERT INTO state (id, completed, lastedit, document_fk, user_fk) VALUES (9, false, '2016-06-01 20:53:14.793', 3, 5);
INSERT INTO state (id, completed, lastedit, document_fk, user_fk) VALUES (10, false, '2016-06-01 20:53:14.794', 4, 5);
INSERT INTO state (id, completed, lastedit, document_fk, user_fk) VALUES (11, false, '2016-06-01 20:53:14.794', 6, 5);
INSERT INTO state (id, completed, lastedit, document_fk, user_fk) VALUES (12, false, '2016-06-01 20:53:14.794', 5, 5);
INSERT INTO state (id, completed, lastedit, document_fk, user_fk) VALUES (13, false, '2016-06-01 20:53:14.79', 1, 5);
INSERT INTO state (id, completed, lastedit, document_fk, user_fk) VALUES (14, false, '2016-06-01 20:53:14.792', 2, 5);
INSERT INTO state (id, completed, lastedit, document_fk, user_fk) VALUES (15, false, '2016-06-01 20:53:14.795', 8, 5);
INSERT INTO state (id, completed, lastedit, document_fk, user_fk) VALUES (16, false, '2016-06-01 20:53:14.795', 7, 5);
INSERT INTO state (id, completed, lastedit, document_fk, user_fk) VALUES (17, false, '2016-06-01 20:53:16.638', 5, 4);
INSERT INTO state (id, completed, lastedit, document_fk, user_fk) VALUES (18, false, '2016-06-01 20:53:16.639', 6, 4);
INSERT INTO state (id, completed, lastedit, document_fk, user_fk) VALUES (19, false, '2016-06-01 20:53:16.637', 1, 4);
INSERT INTO state (id, completed, lastedit, document_fk, user_fk) VALUES (20, false, '2016-06-01 20:53:16.638', 3, 4);
INSERT INTO state (id, completed, lastedit, document_fk, user_fk) VALUES (21, false, '2016-06-01 20:53:16.639', 7, 4);
INSERT INTO state (id, completed, lastedit, document_fk, user_fk) VALUES (22, false, '2016-06-01 20:53:16.638', 4, 4);
INSERT INTO state (id, completed, lastedit, document_fk, user_fk) VALUES (23, false, '2016-06-01 20:53:16.639', 8, 4);
INSERT INTO state (id, completed, lastedit, document_fk, user_fk) VALUES (24, false, '2016-06-01 20:53:16.638', 2, 4);


--
-- Name: state_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('state_id_seq', 24, true);


--
-- Data for Name: targettype; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO targettype (targettype) VALUES ('passage');
INSERT INTO targettype (targettype) VALUES ('verb');


--
-- Data for Name: targettype_labelset; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO targettype_labelset (label_set_id, targettype) VALUES (1, 'verb');
INSERT INTO targettype_labelset (label_set_id, targettype) VALUES (2, 'verb');
INSERT INTO targettype_labelset (label_set_id, targettype) VALUES (3, 'passage');


--
-- Data for Name: timelogging; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: timelogging_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('timelogging_id_seq', 1, false);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO users (id, createdate, email, lastname, password, prename, role, session) VALUES (3, '2016-04-12 11:46:40.677', 'admin@web.de', 'Wish', '-2d8bd2605ef266f054a2b774af60ffdd9534c9edec5cba71', 'Timo', 'admin', 'd4f352f4d13443642123a859e192');
INSERT INTO users (id, createdate, email, lastname, password, prename, role, session) VALUES (5, '2016-04-15 18:25:32.724', 'coli3@web.de', 'Wish', '-2d8bd2605ef266f054a2b774af60ffdd9534c9edec5cba71', 'Coli3', 'annotator', NULL);
INSERT INTO users (id, createdate, email, lastname, password, prename, role, session) VALUES (4, '2016-04-15 18:25:13.029', 'coli2@web.de', 'Wish', '-2d8bd2605ef266f054a2b774af60ffdd9534c9edec5cba71', 'Coli2', 'annotator', NULL);
INSERT INTO users (id, createdate, email, lastname, password, prename, role, session) VALUES (1, '2016-04-07 13:23:41.881986', 'admin@swan.de', 'SWAN', '-2d8bd2605ef266f054a2b774af60ffdd9534c9edec5cba71', 'Admin', 'admin', NULL);
INSERT INTO users (id, createdate, email, lastname, password, prename, role, session) VALUES (2, '2016-04-07 13:25:18.716', 'coli@web.de', 'Wish', '-2d8bd2605ef266f054a2b774af60ffdd9534c9edec5cba71', 'Timo', 'annotator', NULL);
INSERT INTO users (id, createdate, email, lastname, password, prename, role, session) VALUES (6, '2016-05-06 15:44:43.621', 'manager@web.de', 'manager@web.de', '-2d8bd2605ef266f054a2b774af60ffdd9534c9edec5cba71', 'manager', 'projectmanager', 'd0c6fa4f7c0422e75c94c1b8ecad');


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('users_id_seq', 6, true);


--
-- Data for Name: users_projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO users_projects (project_id, users_id) VALUES (1, 2);
INSERT INTO users_projects (project_id, users_id) VALUES (1, 5);
INSERT INTO users_projects (project_id, users_id) VALUES (1, 4);


--
-- Name: annotation_labelmap_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY annotation_labelmap
    ADD CONSTRAINT annotation_labelmap_pkey PRIMARY KEY (annotation_id, map_id);


--
-- Name: annotation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY annotation
    ADD CONSTRAINT annotation_pkey PRIMARY KEY (id);


--
-- Name: document_defaultannotations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY document_defaultannotations
    ADD CONSTRAINT document_defaultannotations_pkey PRIMARY KEY (doc_id, defannotation_id);


--
-- Name: document_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY document
    ADD CONSTRAINT document_pkey PRIMARY KEY (id);


--
-- Name: label_labelset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY label_labelset
    ADD CONSTRAINT label_labelset_pkey PRIMARY KEY (label_set_id, label_id);


--
-- Name: label_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY label
    ADD CONSTRAINT label_pkey PRIMARY KEY (labelid);


--
-- Name: labellabelsetmap_labelset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY labellabelsetmap_labelset
    ADD CONSTRAINT labellabelsetmap_labelset_pkey PRIMARY KEY (labellabelsetmap_id, label_set_id);


--
-- Name: labellabelsetmap_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY labellabelsetmap
    ADD CONSTRAINT labellabelsetmap_pkey PRIMARY KEY (id);


--
-- Name: labelset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY labelset
    ADD CONSTRAINT labelset_pkey PRIMARY KEY (id);


--
-- Name: link_labelmap_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY link_labelmap
    ADD CONSTRAINT link_labelmap_pkey PRIMARY KEY (link_id, map_id);


--
-- Name: link_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY link
    ADD CONSTRAINT link_pkey PRIMARY KEY (id);


--
-- Name: linklabel_linkset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY linklabel_linkset
    ADD CONSTRAINT linklabel_linkset_pkey PRIMARY KEY (linklabel_id, link_label_set_id);


--
-- Name: linklabel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY linklabel
    ADD CONSTRAINT linklabel_pkey PRIMARY KEY (linklabel);


--
-- Name: linklabellinksetmap_linkset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY linklabellinksetmap_linkset
    ADD CONSTRAINT linklabellinksetmap_linkset_pkey PRIMARY KEY (linklabellinksetmap_id, link_set_id);


--
-- Name: linklabellinksetmap_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY linklabellinksetmap
    ADD CONSTRAINT linklabellinksetmap_pkey PRIMARY KEY (id);


--
-- Name: linkset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY linkset
    ADD CONSTRAINT linkset_pkey PRIMARY KEY (id);


--
-- Name: project_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY project
    ADD CONSTRAINT project_name_key UNIQUE (name);


--
-- Name: project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY project
    ADD CONSTRAINT project_pkey PRIMARY KEY (id);


--
-- Name: projects_manager_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY projects_manager
    ADD CONSTRAINT projects_manager_pkey PRIMARY KEY (project_id, manager_id);


--
-- Name: projects_watchingusers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY projects_watchingusers
    ADD CONSTRAINT projects_watchingusers_pkey PRIMARY KEY (project_id, watchinguser_id);


--
-- Name: scheme_labelset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY scheme_labelset
    ADD CONSTRAINT scheme_labelset_pkey PRIMARY KEY (scheme_id, labelset_id);


--
-- Name: scheme_linkset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY scheme_linkset
    ADD CONSTRAINT scheme_linkset_pkey PRIMARY KEY (scheme_id, linkset_id);


--
-- Name: scheme_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY scheme
    ADD CONSTRAINT scheme_name_key UNIQUE (name);


--
-- Name: scheme_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY scheme
    ADD CONSTRAINT scheme_pkey PRIMARY KEY (id);


--
-- Name: scheme_targettype_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY scheme_targettype
    ADD CONSTRAINT scheme_targettype_pkey PRIMARY KEY (scheme_id, targettype);


--
-- Name: sequence_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY sequence
    ADD CONSTRAINT sequence_pkey PRIMARY KEY (seq_name);


--
-- Name: state_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY state
    ADD CONSTRAINT state_pkey PRIMARY KEY (id);


--
-- Name: targettype_labelset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY targettype_labelset
    ADD CONSTRAINT targettype_labelset_pkey PRIMARY KEY (label_set_id, targettype);


--
-- Name: targettype_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY targettype
    ADD CONSTRAINT targettype_pkey PRIMARY KEY (targettype);


--
-- Name: timelogging_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY timelogging
    ADD CONSTRAINT timelogging_pkey PRIMARY KEY (id);


--
-- Name: unq_annotation_0; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY annotation
    ADD CONSTRAINT unq_annotation_0 UNIQUE (user_fk, document_fk, targettype_fk, starts, ends);


--
-- Name: unq_state_0; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY state
    ADD CONSTRAINT unq_state_0 UNIQUE (user_fk, document_fk);


--
-- Name: users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY users_projects
    ADD CONSTRAINT users_projects_pkey PRIMARY KEY (project_id, users_id);


--
-- Name: fk_annotation_document_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY annotation
    ADD CONSTRAINT fk_annotation_document_fk FOREIGN KEY (document_fk) REFERENCES document(id);


--
-- Name: fk_annotation_labelmap_annotation_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY annotation_labelmap
    ADD CONSTRAINT fk_annotation_labelmap_annotation_id FOREIGN KEY (annotation_id) REFERENCES annotation(id);


--
-- Name: fk_annotation_labelmap_map_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY annotation_labelmap
    ADD CONSTRAINT fk_annotation_labelmap_map_id FOREIGN KEY (map_id) REFERENCES labellabelsetmap(id);


--
-- Name: fk_annotation_targettype_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY annotation
    ADD CONSTRAINT fk_annotation_targettype_fk FOREIGN KEY (targettype_fk) REFERENCES targettype(targettype);


--
-- Name: fk_annotation_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY annotation
    ADD CONSTRAINT fk_annotation_user_fk FOREIGN KEY (user_fk) REFERENCES users(id);


--
-- Name: fk_document_defaultannotations_defannotation_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY document_defaultannotations
    ADD CONSTRAINT fk_document_defaultannotations_defannotation_id FOREIGN KEY (defannotation_id) REFERENCES annotation(id);


--
-- Name: fk_document_defaultannotations_doc_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY document_defaultannotations
    ADD CONSTRAINT fk_document_defaultannotations_doc_id FOREIGN KEY (doc_id) REFERENCES document(id);


--
-- Name: fk_document_project_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY document
    ADD CONSTRAINT fk_document_project_fk FOREIGN KEY (project_fk) REFERENCES project(id);


--
-- Name: fk_label_labelset_label_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY label_labelset
    ADD CONSTRAINT fk_label_labelset_label_id FOREIGN KEY (label_id) REFERENCES label(labelid);


--
-- Name: fk_label_labelset_label_set_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY label_labelset
    ADD CONSTRAINT fk_label_labelset_label_set_id FOREIGN KEY (label_set_id) REFERENCES labelset(id);


--
-- Name: fk_labellabelsetmap_label_labelid; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY labellabelsetmap
    ADD CONSTRAINT fk_labellabelsetmap_label_labelid FOREIGN KEY (label_labelid) REFERENCES label(labelid);


--
-- Name: fk_labellabelsetmap_labelset_label_set_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY labellabelsetmap_labelset
    ADD CONSTRAINT fk_labellabelsetmap_labelset_label_set_id FOREIGN KEY (label_set_id) REFERENCES labelset(id);


--
-- Name: fk_labellabelsetmap_labelset_labellabelsetmap_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY labellabelsetmap_labelset
    ADD CONSTRAINT fk_labellabelsetmap_labelset_labellabelsetmap_id FOREIGN KEY (labellabelsetmap_id) REFERENCES labellabelsetmap(id);


--
-- Name: fk_link_annotation1_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY link
    ADD CONSTRAINT fk_link_annotation1_fk FOREIGN KEY (annotation1_fk) REFERENCES annotation(id);


--
-- Name: fk_link_annotation2_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY link
    ADD CONSTRAINT fk_link_annotation2_fk FOREIGN KEY (annotation2_fk) REFERENCES annotation(id);


--
-- Name: fk_link_document_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY link
    ADD CONSTRAINT fk_link_document_fk FOREIGN KEY (document_fk) REFERENCES document(id);


--
-- Name: fk_link_labelmap_link_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY link_labelmap
    ADD CONSTRAINT fk_link_labelmap_link_id FOREIGN KEY (link_id) REFERENCES link(id);


--
-- Name: fk_link_labelmap_map_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY link_labelmap
    ADD CONSTRAINT fk_link_labelmap_map_id FOREIGN KEY (map_id) REFERENCES linklabellinksetmap(id);


--
-- Name: fk_link_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY link
    ADD CONSTRAINT fk_link_user_fk FOREIGN KEY (user_fk) REFERENCES users(id);


--
-- Name: fk_linklabel_linkset_link_label_set_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY linklabel_linkset
    ADD CONSTRAINT fk_linklabel_linkset_link_label_set_id FOREIGN KEY (link_label_set_id) REFERENCES linkset(id);


--
-- Name: fk_linklabel_linkset_linklabel_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY linklabel_linkset
    ADD CONSTRAINT fk_linklabel_linkset_linklabel_id FOREIGN KEY (linklabel_id) REFERENCES linklabel(linklabel);


--
-- Name: fk_linklabellinksetmap_label_linklabel; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY linklabellinksetmap
    ADD CONSTRAINT fk_linklabellinksetmap_label_linklabel FOREIGN KEY (label_linklabel) REFERENCES linklabel(linklabel);


--
-- Name: fk_linklabellinksetmap_linkset_link_set_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY linklabellinksetmap_linkset
    ADD CONSTRAINT fk_linklabellinksetmap_linkset_link_set_id FOREIGN KEY (link_set_id) REFERENCES linkset(id);


--
-- Name: fk_linklabellinksetmap_linkset_linklabellinksetmap_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY linklabellinksetmap_linkset
    ADD CONSTRAINT fk_linklabellinksetmap_linkset_linklabellinksetmap_id FOREIGN KEY (linklabellinksetmap_id) REFERENCES linklabellinksetmap(id);


--
-- Name: fk_linkset_endtype_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY linkset
    ADD CONSTRAINT fk_linkset_endtype_fk FOREIGN KEY (endtype_fk) REFERENCES targettype(targettype);


--
-- Name: fk_linkset_starttype_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY linkset
    ADD CONSTRAINT fk_linkset_starttype_fk FOREIGN KEY (starttype_fk) REFERENCES targettype(targettype);


--
-- Name: fk_project_scheme; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY project
    ADD CONSTRAINT fk_project_scheme FOREIGN KEY (scheme) REFERENCES scheme(id);


--
-- Name: fk_projects_manager_manager_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY projects_manager
    ADD CONSTRAINT fk_projects_manager_manager_id FOREIGN KEY (manager_id) REFERENCES users(id);


--
-- Name: fk_projects_manager_project_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY projects_manager
    ADD CONSTRAINT fk_projects_manager_project_id FOREIGN KEY (project_id) REFERENCES project(id);


--
-- Name: fk_projects_watchingusers_project_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY projects_watchingusers
    ADD CONSTRAINT fk_projects_watchingusers_project_id FOREIGN KEY (project_id) REFERENCES project(id);


--
-- Name: fk_projects_watchingusers_watchinguser_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY projects_watchingusers
    ADD CONSTRAINT fk_projects_watchingusers_watchinguser_id FOREIGN KEY (watchinguser_id) REFERENCES users(id);


--
-- Name: fk_scheme_creator_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY scheme
    ADD CONSTRAINT fk_scheme_creator_id FOREIGN KEY (creator_id) REFERENCES users(id);


--
-- Name: fk_scheme_labelset_labelset_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY scheme_labelset
    ADD CONSTRAINT fk_scheme_labelset_labelset_id FOREIGN KEY (labelset_id) REFERENCES labelset(id);


--
-- Name: fk_scheme_labelset_scheme_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY scheme_labelset
    ADD CONSTRAINT fk_scheme_labelset_scheme_id FOREIGN KEY (scheme_id) REFERENCES scheme(id);


--
-- Name: fk_scheme_linkset_linkset_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY scheme_linkset
    ADD CONSTRAINT fk_scheme_linkset_linkset_id FOREIGN KEY (linkset_id) REFERENCES linkset(id);


--
-- Name: fk_scheme_linkset_scheme_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY scheme_linkset
    ADD CONSTRAINT fk_scheme_linkset_scheme_id FOREIGN KEY (scheme_id) REFERENCES scheme(id);


--
-- Name: fk_scheme_targettype_scheme_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY scheme_targettype
    ADD CONSTRAINT fk_scheme_targettype_scheme_id FOREIGN KEY (scheme_id) REFERENCES scheme(id);


--
-- Name: fk_scheme_targettype_targettype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY scheme_targettype
    ADD CONSTRAINT fk_scheme_targettype_targettype FOREIGN KEY (targettype) REFERENCES targettype(targettype);


--
-- Name: fk_state_document_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY state
    ADD CONSTRAINT fk_state_document_fk FOREIGN KEY (document_fk) REFERENCES document(id);


--
-- Name: fk_state_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY state
    ADD CONSTRAINT fk_state_user_fk FOREIGN KEY (user_fk) REFERENCES users(id);


--
-- Name: fk_targettype_labelset_label_set_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY targettype_labelset
    ADD CONSTRAINT fk_targettype_labelset_label_set_id FOREIGN KEY (label_set_id) REFERENCES labelset(id);


--
-- Name: fk_targettype_labelset_targettype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY targettype_labelset
    ADD CONSTRAINT fk_targettype_labelset_targettype FOREIGN KEY (targettype) REFERENCES targettype(targettype);


--
-- Name: fk_timelogging_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY timelogging
    ADD CONSTRAINT fk_timelogging_user_fk FOREIGN KEY (user_fk) REFERENCES users(id);


--
-- Name: fk_users_projects_project_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users_projects
    ADD CONSTRAINT fk_users_projects_project_id FOREIGN KEY (project_id) REFERENCES project(id);


--
-- Name: fk_users_projects_users_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users_projects
    ADD CONSTRAINT fk_users_projects_users_id FOREIGN KEY (users_id) REFERENCES users(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

