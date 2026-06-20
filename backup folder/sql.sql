--
-- PostgreSQL database dump
--

\restrict abUxYNqbnZeMe3Zc9pGJG17Hmx3l2RhKYvyIAXQNjIXMBeM2uFKVaeSD3rBG590

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.1

-- Started on 2026-06-19 23:17:22

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- TOC entry 241 (class 1259 OID 24701)
-- Name: ai_cache; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ai_cache (
    id integer NOT NULL,
    query_hash character varying(64) NOT NULL,
    response text NOT NULL,
    model_used character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.ai_cache OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 24700)
-- Name: ai_cache_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ai_cache_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ai_cache_id_seq OWNER TO postgres;

--
-- TOC entry 5292 (class 0 OID 0)
-- Dependencies: 240
-- Name: ai_cache_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ai_cache_id_seq OWNED BY public.ai_cache.id;


--
-- TOC entry 243 (class 1259 OID 24716)
-- Name: ai_usage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ai_usage (
    id integer NOT NULL,
    user_id integer,
    usage_date date DEFAULT CURRENT_DATE,
    action_count integer DEFAULT 1
);


ALTER TABLE public.ai_usage OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 24715)
-- Name: ai_usage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ai_usage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ai_usage_id_seq OWNER TO postgres;

--
-- TOC entry 5293 (class 0 OID 0)
-- Dependencies: 242
-- Name: ai_usage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ai_usage_id_seq OWNED BY public.ai_usage.id;


--
-- TOC entry 259 (class 1259 OID 49286)
-- Name: certificates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.certificates (
    id integer NOT NULL,
    user_id integer,
    course_id integer,
    issued_at timestamp without time zone DEFAULT now(),
    certificate_code character varying(50)
);


ALTER TABLE public.certificates OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 49285)
-- Name: certificates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.certificates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.certificates_id_seq OWNER TO postgres;

--
-- TOC entry 5294 (class 0 OID 0)
-- Dependencies: 258
-- Name: certificates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.certificates_id_seq OWNED BY public.certificates.id;


--
-- TOC entry 223 (class 1259 OID 16416)
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    title character varying(150) NOT NULL,
    code character varying(50) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16415)
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courses_id_seq OWNER TO postgres;

--
-- TOC entry 5295 (class 0 OID 0)
-- Dependencies: 222
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- TOC entry 239 (class 1259 OID 24678)
-- Name: exam_attempts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exam_attempts (
    id integer NOT NULL,
    user_id integer,
    score integer NOT NULL,
    total_questions integer NOT NULL,
    time_spent_seconds integer,
    completed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.exam_attempts OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 24677)
-- Name: exam_attempts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exam_attempts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exam_attempts_id_seq OWNER TO postgres;

--
-- TOC entry 5296 (class 0 OID 0)
-- Dependencies: 238
-- Name: exam_attempts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exam_attempts_id_seq OWNED BY public.exam_attempts.id;


--
-- TOC entry 249 (class 1259 OID 49176)
-- Name: flashcard_decks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flashcard_decks (
    id integer NOT NULL,
    user_id integer,
    course_id integer,
    title character varying(255) NOT NULL,
    is_public boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.flashcard_decks OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 49175)
-- Name: flashcard_decks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.flashcard_decks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.flashcard_decks_id_seq OWNER TO postgres;

--
-- TOC entry 5297 (class 0 OID 0)
-- Dependencies: 248
-- Name: flashcard_decks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.flashcard_decks_id_seq OWNED BY public.flashcard_decks.id;


--
-- TOC entry 253 (class 1259 OID 49215)
-- Name: flashcard_reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flashcard_reviews (
    id integer NOT NULL,
    user_id integer,
    card_id integer,
    ease_factor double precision DEFAULT 2.5,
    interval_days integer DEFAULT 1,
    repetitions integer DEFAULT 0,
    next_review_date date DEFAULT CURRENT_DATE,
    last_quality integer,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.flashcard_reviews OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 49214)
-- Name: flashcard_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.flashcard_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.flashcard_reviews_id_seq OWNER TO postgres;

--
-- TOC entry 5298 (class 0 OID 0)
-- Dependencies: 252
-- Name: flashcard_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.flashcard_reviews_id_seq OWNED BY public.flashcard_reviews.id;


--
-- TOC entry 251 (class 1259 OID 49197)
-- Name: flashcards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flashcards (
    id integer NOT NULL,
    deck_id integer,
    front text NOT NULL,
    back text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.flashcards OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 49196)
-- Name: flashcards_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.flashcards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.flashcards_id_seq OWNER TO postgres;

--
-- TOC entry 5299 (class 0 OID 0)
-- Dependencies: 250
-- Name: flashcards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.flashcards_id_seq OWNED BY public.flashcards.id;


--
-- TOC entry 261 (class 1259 OID 49309)
-- Name: friendships; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.friendships (
    id integer NOT NULL,
    user_id integer,
    friend_id integer,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT friendships_check CHECK ((user_id <> friend_id))
);


ALTER TABLE public.friendships OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 49308)
-- Name: friendships_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.friendships_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.friendships_id_seq OWNER TO postgres;

--
-- TOC entry 5300 (class 0 OID 0)
-- Dependencies: 260
-- Name: friendships_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.friendships_id_seq OWNED BY public.friendships.id;


--
-- TOC entry 269 (class 1259 OID 57345)
-- Name: material_videos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.material_videos (
    id integer NOT NULL,
    material_id integer,
    youtube_url text NOT NULL,
    youtube_id character varying(20) NOT NULL,
    title character varying(300),
    added_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.material_videos OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 57344)
-- Name: material_videos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.material_videos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.material_videos_id_seq OWNER TO postgres;

--
-- TOC entry 5301 (class 0 OID 0)
-- Dependencies: 268
-- Name: material_videos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.material_videos_id_seq OWNED BY public.material_videos.id;


--
-- TOC entry 225 (class 1259 OID 16431)
-- Name: materials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.materials (
    id integer NOT NULL,
    course_id integer,
    title character varying(200) NOT NULL,
    file_url text NOT NULL,
    type character varying(20) DEFAULT 'pdf'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    sort_order integer DEFAULT 0
);


ALTER TABLE public.materials OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16430)
-- Name: materials_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.materials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.materials_id_seq OWNER TO postgres;

--
-- TOC entry 5302 (class 0 OID 0)
-- Dependencies: 224
-- Name: materials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.materials_id_seq OWNED BY public.materials.id;


--
-- TOC entry 265 (class 1259 OID 49359)
-- Name: notification_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification_preferences (
    id integer NOT NULL,
    user_id integer,
    email_enabled boolean DEFAULT true,
    push_enabled boolean DEFAULT true,
    friend_requests boolean DEFAULT true,
    streak_warnings boolean DEFAULT true,
    exam_reminders boolean DEFAULT true,
    achievements boolean DEFAULT true,
    daily_goals boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notification_preferences OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 49358)
-- Name: notification_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notification_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notification_preferences_id_seq OWNER TO postgres;

--
-- TOC entry 5303 (class 0 OID 0)
-- Dependencies: 264
-- Name: notification_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notification_preferences_id_seq OWNED BY public.notification_preferences.id;


--
-- TOC entry 263 (class 1259 OID 49336)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer,
    type character varying(50) NOT NULL,
    title character varying(200) NOT NULL,
    message text NOT NULL,
    link character varying(255),
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 49335)
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- TOC entry 5304 (class 0 OID 0)
-- Dependencies: 262
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- TOC entry 233 (class 1259 OID 24612)
-- Name: options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.options (
    id integer NOT NULL,
    question_id integer,
    option_text text NOT NULL,
    is_correct boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.options OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 24611)
-- Name: options_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.options_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.options_id_seq OWNER TO postgres;

--
-- TOC entry 5305 (class 0 OID 0)
-- Dependencies: 232
-- Name: options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.options_id_seq OWNED BY public.options.id;


--
-- TOC entry 255 (class 1259 OID 49240)
-- Name: pdf_bookmarks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pdf_bookmarks (
    id integer NOT NULL,
    user_id integer,
    material_id integer,
    page_number integer NOT NULL,
    label character varying(255),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.pdf_bookmarks OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 49239)
-- Name: pdf_bookmarks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pdf_bookmarks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pdf_bookmarks_id_seq OWNER TO postgres;

--
-- TOC entry 5306 (class 0 OID 0)
-- Dependencies: 254
-- Name: pdf_bookmarks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pdf_bookmarks_id_seq OWNED BY public.pdf_bookmarks.id;


--
-- TOC entry 257 (class 1259 OID 49262)
-- Name: pdf_highlights; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pdf_highlights (
    id integer NOT NULL,
    user_id integer,
    material_id integer,
    page_number integer NOT NULL,
    selected_text text NOT NULL,
    color character varying(20) DEFAULT 'yellow'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.pdf_highlights OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 49261)
-- Name: pdf_highlights_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pdf_highlights_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pdf_highlights_id_seq OWNER TO postgres;

--
-- TOC entry 5307 (class 0 OID 0)
-- Dependencies: 256
-- Name: pdf_highlights_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pdf_highlights_id_seq OWNED BY public.pdf_highlights.id;


--
-- TOC entry 231 (class 1259 OID 24594)
-- Name: questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.questions (
    id integer NOT NULL,
    quiz_id integer,
    question_text text NOT NULL,
    question_type character varying(20) DEFAULT 'mcq'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    explanation text
);


ALTER TABLE public.questions OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 24593)
-- Name: questions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.questions_id_seq OWNER TO postgres;

--
-- TOC entry 5308 (class 0 OID 0)
-- Dependencies: 230
-- Name: questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.questions_id_seq OWNED BY public.questions.id;


--
-- TOC entry 235 (class 1259 OID 24630)
-- Name: quiz_attempts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quiz_attempts (
    id integer NOT NULL,
    user_id integer,
    quiz_id integer,
    score integer NOT NULL,
    total_questions integer NOT NULL,
    completed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.quiz_attempts OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 24629)
-- Name: quiz_attempts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quiz_attempts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quiz_attempts_id_seq OWNER TO postgres;

--
-- TOC entry 5309 (class 0 OID 0)
-- Dependencies: 234
-- Name: quiz_attempts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quiz_attempts_id_seq OWNED BY public.quiz_attempts.id;


--
-- TOC entry 229 (class 1259 OID 24577)
-- Name: quizzes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quizzes (
    id integer NOT NULL,
    course_id integer,
    title character varying(200) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_official boolean DEFAULT true,
    user_id integer,
    difficulty character varying(15),
    quiz_type character varying(20) DEFAULT 'quiz'::character varying
);


ALTER TABLE public.quizzes OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 24576)
-- Name: quizzes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quizzes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quizzes_id_seq OWNER TO postgres;

--
-- TOC entry 5310 (class 0 OID 0)
-- Dependencies: 228
-- Name: quizzes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quizzes_id_seq OWNED BY public.quizzes.id;


--
-- TOC entry 245 (class 1259 OID 32786)
-- Name: reported_questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reported_questions (
    id integer NOT NULL,
    question_id integer,
    reason text NOT NULL,
    user_id integer,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.reported_questions OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 32785)
-- Name: reported_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reported_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reported_questions_id_seq OWNER TO postgres;

--
-- TOC entry 5311 (class 0 OID 0)
-- Dependencies: 244
-- Name: reported_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reported_questions_id_seq OWNED BY public.reported_questions.id;


--
-- TOC entry 267 (class 1259 OID 49383)
-- Name: scheduled_notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scheduled_notifications (
    id integer NOT NULL,
    user_id integer,
    type character varying(50) NOT NULL,
    scheduled_for timestamp without time zone NOT NULL,
    payload jsonb,
    sent boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.scheduled_notifications OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 49382)
-- Name: scheduled_notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.scheduled_notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.scheduled_notifications_id_seq OWNER TO postgres;

--
-- TOC entry 5312 (class 0 OID 0)
-- Dependencies: 266
-- Name: scheduled_notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.scheduled_notifications_id_seq OWNED BY public.scheduled_notifications.id;


--
-- TOC entry 247 (class 1259 OID 49155)
-- Name: study_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.study_sessions (
    id integer NOT NULL,
    user_id integer,
    material_id integer,
    started_at timestamp without time zone DEFAULT now(),
    duration_seconds integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.study_sessions OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 49154)
-- Name: study_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.study_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.study_sessions_id_seq OWNER TO postgres;

--
-- TOC entry 5313 (class 0 OID 0)
-- Dependencies: 246
-- Name: study_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.study_sessions_id_seq OWNED BY public.study_sessions.id;


--
-- TOC entry 221 (class 1259 OID 16406)
-- Name: system_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_settings (
    key character varying(50) NOT NULL,
    value text NOT NULL
);


ALTER TABLE public.system_settings OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 24651)
-- Name: user_notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_notes (
    id integer NOT NULL,
    user_id integer,
    material_id integer,
    content text NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    title character varying(255) DEFAULT 'My Notes'::character varying
);


ALTER TABLE public.user_notes OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 24650)
-- Name: user_notes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_notes_id_seq OWNER TO postgres;

--
-- TOC entry 5314 (class 0 OID 0)
-- Dependencies: 236
-- Name: user_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_notes_id_seq OWNED BY public.user_notes.id;


--
-- TOC entry 227 (class 1259 OID 16450)
-- Name: user_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_progress (
    id integer NOT NULL,
    user_id integer,
    material_id integer,
    status character varying(20) DEFAULT 'completed'::character varying,
    completed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    percentage integer DEFAULT 0,
    last_accessed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_progress OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16449)
-- Name: user_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_progress_id_seq OWNER TO postgres;

--
-- TOC entry 5315 (class 0 OID 0)
-- Dependencies: 226
-- Name: user_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_progress_id_seq OWNED BY public.user_progress.id;


--
-- TOC entry 220 (class 1259 OID 16389)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    theme character varying(50) DEFAULT 'light'::character varying,
    role character varying(50) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    current_streak integer DEFAULT 0,
    max_streak integer DEFAULT 0,
    last_active_date date,
    total_score integer DEFAULT 0,
    streak_freezes integer DEFAULT 2,
    daily_goal_minutes integer DEFAULT 20
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16388)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5316 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4916 (class 2604 OID 24704)
-- Name: ai_cache id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_cache ALTER COLUMN id SET DEFAULT nextval('public.ai_cache_id_seq'::regclass);


--
-- TOC entry 4918 (class 2604 OID 24719)
-- Name: ai_usage id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_usage ALTER COLUMN id SET DEFAULT nextval('public.ai_usage_id_seq'::regclass);


--
-- TOC entry 4943 (class 2604 OID 49289)
-- Name: certificates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates ALTER COLUMN id SET DEFAULT nextval('public.certificates_id_seq'::regclass);


--
-- TOC entry 4888 (class 2604 OID 16419)
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- TOC entry 4914 (class 2604 OID 24681)
-- Name: exam_attempts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_attempts ALTER COLUMN id SET DEFAULT nextval('public.exam_attempts_id_seq'::regclass);


--
-- TOC entry 4927 (class 2604 OID 49179)
-- Name: flashcard_decks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flashcard_decks ALTER COLUMN id SET DEFAULT nextval('public.flashcard_decks_id_seq'::regclass);


--
-- TOC entry 4932 (class 2604 OID 49218)
-- Name: flashcard_reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flashcard_reviews ALTER COLUMN id SET DEFAULT nextval('public.flashcard_reviews_id_seq'::regclass);


--
-- TOC entry 4930 (class 2604 OID 49200)
-- Name: flashcards id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flashcards ALTER COLUMN id SET DEFAULT nextval('public.flashcards_id_seq'::regclass);


--
-- TOC entry 4945 (class 2604 OID 49312)
-- Name: friendships id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendships ALTER COLUMN id SET DEFAULT nextval('public.friendships_id_seq'::regclass);


--
-- TOC entry 4965 (class 2604 OID 57348)
-- Name: material_videos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_videos ALTER COLUMN id SET DEFAULT nextval('public.material_videos_id_seq'::regclass);


--
-- TOC entry 4890 (class 2604 OID 16434)
-- Name: materials id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materials ALTER COLUMN id SET DEFAULT nextval('public.materials_id_seq'::regclass);


--
-- TOC entry 4952 (class 2604 OID 49362)
-- Name: notification_preferences id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_preferences ALTER COLUMN id SET DEFAULT nextval('public.notification_preferences_id_seq'::regclass);


--
-- TOC entry 4949 (class 2604 OID 49339)
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- TOC entry 4906 (class 2604 OID 24615)
-- Name: options id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.options ALTER COLUMN id SET DEFAULT nextval('public.options_id_seq'::regclass);


--
-- TOC entry 4938 (class 2604 OID 49243)
-- Name: pdf_bookmarks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pdf_bookmarks ALTER COLUMN id SET DEFAULT nextval('public.pdf_bookmarks_id_seq'::regclass);


--
-- TOC entry 4940 (class 2604 OID 49265)
-- Name: pdf_highlights id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pdf_highlights ALTER COLUMN id SET DEFAULT nextval('public.pdf_highlights_id_seq'::regclass);


--
-- TOC entry 4903 (class 2604 OID 24597)
-- Name: questions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions ALTER COLUMN id SET DEFAULT nextval('public.questions_id_seq'::regclass);


--
-- TOC entry 4909 (class 2604 OID 24633)
-- Name: quiz_attempts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_attempts ALTER COLUMN id SET DEFAULT nextval('public.quiz_attempts_id_seq'::regclass);


--
-- TOC entry 4899 (class 2604 OID 24580)
-- Name: quizzes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes ALTER COLUMN id SET DEFAULT nextval('public.quizzes_id_seq'::regclass);


--
-- TOC entry 4921 (class 2604 OID 32789)
-- Name: reported_questions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reported_questions ALTER COLUMN id SET DEFAULT nextval('public.reported_questions_id_seq'::regclass);


--
-- TOC entry 4962 (class 2604 OID 49386)
-- Name: scheduled_notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheduled_notifications ALTER COLUMN id SET DEFAULT nextval('public.scheduled_notifications_id_seq'::regclass);


--
-- TOC entry 4924 (class 2604 OID 49158)
-- Name: study_sessions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.study_sessions ALTER COLUMN id SET DEFAULT nextval('public.study_sessions_id_seq'::regclass);


--
-- TOC entry 4911 (class 2604 OID 24654)
-- Name: user_notes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notes ALTER COLUMN id SET DEFAULT nextval('public.user_notes_id_seq'::regclass);


--
-- TOC entry 4894 (class 2604 OID 16453)
-- Name: user_progress id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress ALTER COLUMN id SET DEFAULT nextval('public.user_progress_id_seq'::regclass);


--
-- TOC entry 4879 (class 2604 OID 16392)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5258 (class 0 OID 24701)
-- Dependencies: 241
-- Data for Name: ai_cache; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ai_cache (id, query_hash, response, model_used, created_at) FROM stdin;
6	dc28590fd2fcf0cc6f9a7c83af83ff9ca5dfba2c2151bcc28b762144490ac4da	The key features of GSM (Global System for Mobile Communications) that contribute to its popularity are:\n\n1. **Improved spectrum efficiency**: Efficient use of radio spectrum.\n2. **International roaming**: Allows users to make and receive calls across different countries.\n3. **Low-cost mobile sets and base stations**: Affordable infrastructure and devices.\n4. **High-quality speech**: Clear and reliable voice communication.\n5. **Compatibility with ISDN and other services**: Seamless integration with existing telephone systems.\n6. **Support for new services**: Ability to adapt to emerging technologies and innovations.	llama-3.1-8b-instant	2026-04-05 10:33:23.946713
7	bd1ae2288773e779c883de57e3f2b57d6692cf52176454dac7d46cc8b3de281d	**What makes GSM (Global System for Mobile Communications) popular?**\n\nHere are the key features that contribute to its widespread use:\n\n* **Improved Spectrum Efficiency**: GSM uses the spectrum more efficiently, allowing for more calls and data to be transmitted on the same frequency.\n* **International Roaming**: GSM allows users to make and receive calls across international borders, making it a convenient choice for travelers.\n* **Low-Cost Mobile Sets and Base Stations (BSs)**: GSM equipment is relatively affordable, making it accessible to a wider range of users.\n* **High-Quality Speech**: GSM provides clear and reliable voice communication, ensuring that users get a good call quality.\n* **Compatibility with ISDN and Other Telephone Services**: GSM is compatible with Integrated Services Digital Network (ISDN) and other telephone services, making it easy to integrate with existing communication systems.\n* **Support for New Services**: GSM supports new services, such as data transmission and messaging, which has enabled the development of new mobile applications and services.	llama-3.1-8b-instant	2026-04-05 10:33:42.027323
8	6309ac83eabf20d7225ef66b11b560c5f65799f48193c3e45e7a3c092d83d4df	[{"question_text":"Which of the following data structures in Python is immutable?","options":[{"text":"List","is_correct":false},{"text":"Dictionary","is_correct":false},{"text":"Tuple","is_correct":true},{"text":"Set","is_correct":false}],"explanation":"Tuples are immutable in Python, meaning their elements cannot be changed after creation. Lists, dictionaries, and sets are mutable."},{"question_text":"Which loop structure guarantees execution of its block at least once before checking the condition?","options":[{"text":"For loop","is_correct":false},{"text":"While loop","is_correct":false},{"text":"Do-while loop","is_correct":true},{"text":"None of the above","is_correct":false}],"explanation":"A do-while loop (not natively supported in Python but conceptually valid) executes the block first, then checks the condition. Python uses while/for loops instead."},{"question_text":"What is the primary difference between a function and a method in Python?","options":[{"text":"Functions are declared with def, methods with class","is_correct":false},{"text":"Methods belong to an object, functions are standalone","is_correct":true},{"text":"Functions can accept parameters, methods cannot","is_correct":false},{"text":"Methods are faster than functions","is_correct":false}],"explanation":"Methods are functions that are associated with an object or class, while standalone functions exist independently of objects."},{"question_text":"Which keyword is used to handle exceptions in Python?","options":[{"text":"Try","is_correct":false},{"text":"Except","is_correct":true},{"text":"Catch","is_correct":false},{"text":"Handle","is_correct":false}],"explanation":"Python uses 'try-except' blocks for exception handling. 'Catch' is used in languages like Java, but not in Python."},{"question_text":"What scope does a variable declared outside all functions have in Python?","options":[{"text":"Local scope","is_correct":false},{"text":"Global scope","is_correct":true},{"text":"Enclosed scope","is_correct":false},{"text":"Built-in scope","is_correct":false}],"explanation":"Variables declared outside all functions have global scope and can be accessed throughout the module."}]	qwen-3-32b	2026-04-05 10:36:20.538267
9	28860fde7a17b733c30f6057a33b87e67094ef30d869e501e1f2e6c77059ea64	[{"question_text":"What is a primary purpose of a linked list in data structures?","options":[{"text":"To allow dynamic memory allocation","is_correct":true},{"text":"To store data in contiguous memory","is_correct":false},{"text":"To limit the maximum number of elements","is_correct":false},{"text":"To enforce fixed-size storage","is_correct":false}],"explanation":"Linked lists dynamically allocate memory for elements, allowing efficient insertion/deletion without contiguous storage requirements."},{"question_text":"Which data structure follows the Last-In-First-Out (LIFO) principle?","options":[{"text":"Queue","is_correct":false},{"text":"Stack","is_correct":true},{"text":"Array","is_correct":false},{"text":"Linked List","is_correct":false}],"explanation":"A stack processes elements in LIFO order, where the last element added is the first to be removed."},{"question_text":"What is the time complexity of binary search in a sorted array?","options":[{"text":"O(n)","is_correct":false},{"text":"O(log n)","is_correct":true},{"text":"O(n²)","is_correct":false},{"text":"O(1)","is_correct":false}],"explanation":"Binary search halves the search space each time, resulting in logarithmic time complexity."},{"question_text":"Which of these is a non-linear data structure?","options":[{"text":"Array","is_correct":false},{"text":"Tree","is_correct":true},{"text":"Stack","is_correct":false},{"text":"Queue","is_correct":false}],"explanation":"Trees are hierarchical (non-linear) structures, unlike arrays, stacks, or queues, which are linear."},{"question_text":"What does FIFO stand for in queue operations?","options":[{"text":"First In, First Out","is_correct":true},{"text":"Fast In, Fast Out","is_correct":false},{"text":"First In, Last Out","is_correct":false},{"text":"None of the above","is_correct":false}],"explanation":"FIFO describes the queue behavior where the first element added is the first to be removed."}]	qwen-3-32b	2026-04-05 12:00:14.433311
10	4183f870b5ab5ef8962e09936df43cd4ce0244a9fdc3fedc57077d1dfc55c98d	**What is a Self-Replicating Virus or Worm?**\n\n* A self-replicating virus or worm is a type of computer program that:\n\t+ **Copies itself repeatedly** without stopping\n\t+ **Uses up all available resources**, such as disk space or computing power\n\t+ **Does not have a specific goal**, only to cause harm or exhaust resources\n\n**Example: The Rabbit Scenario**\n\n* Imagine a computer program called "Rabbit" that behaves in the following way:\n\t+ **Creates copies of itself** and stores them on the computer's hard drive\n\t+ **Fills up the entire disk space** by duplicating itself over and over\n\t+ **Does not stop until the disk is full**, causing the computer to become unresponsive or crash.	llama-3.1-8b-instant	2026-04-09 10:32:18.865579
11	20b47be58bed915d36c12a704779482d578e5860a7dff7718021d47fc00abd2d	Key concept: \n\nA self-replicating virus or worm is a type of malware that:\n\n- Replicates without bound, using up computing resources.\n- Can fill storage devices (e.g., disk) by creating multiple copies of itself.	llama-3.1-8b-instant	2026-04-09 10:32:37.395943
12	0862bf66a3502f79f2bdde57dbd6fad29fb6be43b2087ca2a4c5cfa1fdfa0255	[{"question_text":"What is the general name for unexpected or undesired effects in programs?","options":[{"text":"Malicious code","is_correct":true},{"text":"Virus","is_correct":false},{"text":"Trojan horse","is_correct":false},{"text":"Logic bomb","is_correct":false}],"explanation":"Malicious code is the general name for unexpected or undesired effects in programs, caused by an agent committed on damage."},{"question_text":"What is a program that can replicate itself and pass on malicious code to other non-malicious programs?","options":[{"text":"Virus","is_correct":true},{"text":"Worm","is_correct":false},{"text":"Trojan horse","is_correct":false},{"text":"Logic bomb","is_correct":false}],"explanation":"A virus is a program that can replicate itself and pass on malicious code to other non-malicious programs by modifying them."},{"question_text":"What is a type of malicious software that is designed to infiltrate your computer or mobile device and gather data about you?","options":[{"text":"Spyware","is_correct":true},{"text":"Virus","is_correct":false},{"text":"Worm","is_correct":false},{"text":"Trojan horse","is_correct":false}],"explanation":"Spyware is a type of malicious software (malware) designed to infiltrate your computer or mobile device, gather data about you, and forward it to a third party without your consent."},{"question_text":"How does a transient virus spread its infection?","options":[{"text":"It locates itself in memory","is_correct":false},{"text":"It runs when its attached program executes and terminates when its attached program ends","is_correct":true},{"text":"It remains active or be activated as a stand-alone program","is_correct":false},{"text":"It spreads through networks","is_correct":false}],"explanation":"A transient virus runs when its attached program executes and terminates when its attached program ends."},{"question_text":"What is the primary difference between a worm and a virus?","options":[{"text":"A worm operates through networks, and a virus can spread through any medium","is_correct":true},{"text":"A worm spreads copies of itself as a program that attaches to other programs, and a virus spreads copies of itself as a stand-alone program","is_correct":false},{"text":"A worm is a type of spyware, and a virus is a type of malware","is_correct":false},{"text":"A worm is a type of Trojan horse, and a virus is a type of logic bomb","is_correct":false}],"explanation":"The primary difference between a worm and a virus is that a worm operates through networks, and a virus can spread through any medium."}]	qwen-3-32b	2026-04-09 10:37:27.166333
13	ecbfdaa5a1939fb2d97ddd110162a566cb0f1dc73e5be8a376afbe94b34d388d	[{"question_text":"What is the primary difference between a virus and a worm?","options":[{"text":"A virus spreads through networks, while a worm can spread through any medium.","is_correct":true},{"text":"A virus operates as a standalone program, while a worm attaches to other programs.","is_correct":false},{"text":"A virus is a type of spyware, while a worm is a type of virus.","is_correct":false},{"text":"A virus is a type of malware, while a worm is a type of software.","is_correct":false}],"explanation":"A virus can spread through any medium, while a worm operates through networks."},{"question_text":"What is the purpose of a logic bomb?","options":[{"text":"To cause damage to a system.","is_correct":false},{"text":"To spread a virus.","is_correct":false},{"text":"To 'detonate' when a specified condition occurs.","is_correct":true},{"text":"To create a backdoor.","is_correct":false}],"explanation":"A logic bomb is a type of malicious code that 'detonates' when a specified condition occurs."},{"question_text":"What is the primary goal of spyware?","options":[{"text":"To damage systems or spread to other files.","is_correct":false},{"text":"To remain undetected for as long as possible to maximize data collection.","is_correct":true},{"text":"To create a backdoor.","is_correct":false},{"text":"To spread a virus.","is_correct":false}],"explanation":"Spyware is typically stealthy and its goal is to remain undetected for as long as possible to maximize data collection."},{"question_text":"What is the lifecycle of spyware?","options":[{"text":"Infiltration, Monitoring & Collection, Exfiltration.","is_correct":true},{"text":"Infiltration, Exfiltration, Monitoring & Collection.","is_correct":false},{"text":"Monitoring & Collection, Infiltration, Exfiltration.","is_correct":false},{"text":"Exfiltration, Monitoring & Collection, Infiltration.","is_correct":false}],"explanation":"The lifecycle of spyware is Infiltration, Monitoring & Collection, Exfiltration."},{"question_text":"What is a Trojan horse?","options":[{"text":"A type of virus.","is_correct":false},{"text":"A type of spyware.","is_correct":false},{"text":"A program that has a non-obvious malicious effect.","is_correct":true},{"text":"A type of malware.","is_correct":false}],"explanation":"A Trojan horse is a program that has a non-obvious malicious effect."}]	qwen-3-32b	2026-04-09 10:39:49.940924
14	eb95b3f8c258f2d9784bc16a80eb078f42e1868c8015fea4b6af373b9d8d7836	[{"question_text":"What is the main goal of Query Processing?","options":[{"text":"To find information in one or more databases and deliver it to the user quickly and efficiently.","is_correct":true},{"text":"To store data in a database.","is_correct":false},{"text":"To create a new database.","is_correct":false},{"text":"To delete data from a database.","is_correct":false}],"explanation":"Query Processing is the process of finding information in one or more databases and delivering it to the user quickly and efficiently."},{"question_text":"What are the four main phases of Query Processing?","options":[{"text":"Decomposition, Optimization, Code generation, and Execution.","is_correct":true},{"text":"Decomposition, Optimization, Execution, and Storage.","is_correct":false},{"text":"Decomposition, Optimization, Code generation, and Storage.","is_correct":false},{"text":"Decomposition, Execution, Code generation, and Optimization.","is_correct":false}],"explanation":"The four main phases of Query Processing are Decomposition, Optimization, Code generation, and Execution."},{"question_text":"What is the purpose of the Optimizer in Query Processing?","options":[{"text":"To find the best plan to relational algebra.","is_correct":true},{"text":"To evaluate the query plan and get the results.","is_correct":false},{"text":"To store data in a database.","is_correct":false},{"text":"To create a new database.","is_correct":false}],"explanation":"The Optimizer's purpose is to find the best plan to relational algebra."},{"question_text":"What are the typical stages in Query Decomposition?","options":[{"text":"Analysis, Normalization, Semantic Analysis, and Simplification.","is_correct":true},{"text":"Analysis, Normalization, Simplification, and Execution.","is_correct":false},{"text":"Analysis, Semantic Analysis, Simplification, and Normalization.","is_correct":false},{"text":"Normalization, Simplification, Analysis, and Semantic Analysis.","is_correct":false}],"explanation":"The typical stages in Query Decomposition are Analysis, Normalization, Semantic Analysis, and Simplification."},{"question_text":"Which of the following expressions is best (Optimal)?","options":[{"text":"(position=’manager’) ^ (City=’Addis’ ) ^ (staff.branchNo=branch.branchNo ) (Staff X Branch)","is_correct":false},{"text":"(position=’manager’) ^ (City=’Addis’)(Staff staff.branchNo=branch.branchNo Branch)","is_correct":false},{"text":"(  position =’manager’ (Staff )) staff.branchNo=branch.branchNo (  City=’Addis’(Branch))","is_correct":true},{"text":"None of the above.","is_correct":false}],"explanation":"The optimal expression is (  position =’manager’ (Staff )) staff.branchNo=branch.branchNo (  City=’Addis’(Branch))"}]	qwen-3-32b	2026-05-17 09:40:44.871382
\.


--
-- TOC entry 5260 (class 0 OID 24716)
-- Dependencies: 243
-- Data for Name: ai_usage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ai_usage (id, user_id, usage_date, action_count) FROM stdin;
1	3	2026-04-04	5
6	1	2026-04-05	3
9	2	2026-04-05	1
10	1	2026-04-09	4
14	1	2026-05-17	4
\.


--
-- TOC entry 5276 (class 0 OID 49286)
-- Dependencies: 259
-- Data for Name: certificates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.certificates (id, user_id, course_id, issued_at, certificate_code) FROM stdin;
1	1	9	2026-05-19 23:43:05.3893	EXITIT-BCBFD8E8135B
2	1	7	2026-05-19 23:43:27.357736	EXITIT-C873F7FC00D8
\.


--
-- TOC entry 5240 (class 0 OID 16416)
-- Dependencies: 223
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (id, title, code, description, created_at) FROM stdin;
4	Computer Maintenance and Technical Support	CMTS301	Hardware troubleshooting, system assembly, and technical support fundamentals	2026-04-06 12:02:33.185003
5	Object-Oriented Programming in Java	OOP302	Core OOP concepts including inheritance, polymorphism, and design patterns in Java	2026-04-06 12:02:33.400831
6	IT Project Management	ITPM303	Project lifecycle, Agile and Waterfall methodologies, risk management	2026-04-06 12:02:33.402529
7	Event-Driven Programming	EDP304	GUI development, event handling, and interactive application design	2026-04-06 12:02:33.425162
8	System Analysis and Design	SAD305	Requirements gathering, system modeling, UML diagrams, and design methodologies	2026-04-06 12:02:33.448942
9	Advanced Programming	AP306	Advanced data structures, algorithms, and software design principles	2026-04-06 12:02:33.479568
10	Fundamentals of Database Systems	FDS307	Relational databases, SQL, normalization, and ER modeling	2026-04-06 12:02:33.480258
11	Advanced Database Systems	ADS308	Query optimization, transactions, distributed databases, and NoSQL	2026-04-06 12:02:33.480907
12	Internet Programming I	IP1309	HTML, CSS, JavaScript fundamentals, and client-side web development	2026-04-06 12:02:33.481797
13	Internet Programming II	IP2310	Server-side development, APIs, frameworks, and full-stack integration	2026-04-06 12:02:33.482424
14	Mobile Application Development	MAD311	Native and cross-platform mobile app development for Android and iOS	2026-04-06 12:02:33.529375
15	Data Communications and Computer Networks	DCCN312	Network protocols, OSI model, TCP/IP, and data transmission fundamentals	2026-04-06 12:02:33.532221
16	System and Network Administration	SNA313	Server management, directory services, user administration, and security	2026-04-06 12:02:33.533018
17	Network Devices and Configuration	NDC314	Router and switch configuration, VLANs, subnetting, and network design	2026-04-06 12:02:33.533522
\.


--
-- TOC entry 5256 (class 0 OID 24678)
-- Dependencies: 239
-- Data for Name: exam_attempts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exam_attempts (id, user_id, score, total_questions, time_spent_seconds, completed_at) FROM stdin;
1	1	2	3	7	2026-04-04 16:29:51.61717
2	3	2	3	17	2026-04-05 09:21:09.232499
3	2	1	3	149	2026-04-05 12:47:09.822939
4	2	3	3	81	2026-04-05 12:50:30.217024
5	1	0	5	19	2026-04-06 16:29:21.839884
6	3	5	5	64	2026-04-06 16:31:19.958031
7	3	0	5	12	2026-04-06 16:35:46.026378
8	2	0	5	13	2026-04-07 10:16:04.306786
9	2	1	5	477	2026-04-07 10:25:27.357178
10	2	0	100	60	2026-04-08 10:40:11.865831
11	2	0	100	17	2026-04-08 10:41:05.162697
12	2	0	100	45	2026-04-08 10:42:05.218962
13	2	0	100	421	2026-04-08 17:42:31.529172
14	2	1	100	132	2026-04-08 17:45:56.399568
15	1	1	100	329	2026-04-08 18:31:59.378341
16	1	0	100	31	2026-04-08 18:37:00.356878
17	1	7	100	364	2026-04-09 10:28:27.793297
18	1	0	100	12	2026-06-11 09:56:36.813619
\.


--
-- TOC entry 5266 (class 0 OID 49176)
-- Dependencies: 249
-- Data for Name: flashcard_decks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flashcard_decks (id, user_id, course_id, title, is_public, created_at) FROM stdin;
1	1	9	OOp concepts	f	2026-05-19 21:49:00.773242
\.


--
-- TOC entry 5270 (class 0 OID 49215)
-- Dependencies: 253
-- Data for Name: flashcard_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flashcard_reviews (id, user_id, card_id, ease_factor, interval_days, repetitions, next_review_date, last_quality, updated_at) FROM stdin;
3	1	2	2.5	1	1	2026-05-21	4	2026-05-20 08:30:48.342074
4	1	3	2.5	1	1	2026-05-21	4	2026-05-20 08:30:52.453362
5	1	4	2.5	1	0	2026-05-21	2	2026-05-20 08:30:56.78235
6	1	5	2.5	1	0	2026-05-21	2	2026-05-20 08:30:58.776123
7	1	6	2.5	1	1	2026-05-21	4	2026-05-20 08:30:59.959598
8	1	7	2.5	1	1	2026-05-21	4	2026-05-20 08:31:01.166591
9	1	8	2.5	1	1	2026-05-21	4	2026-05-20 08:31:02.559674
10	1	9	2.5	1	1	2026-05-21	4	2026-05-20 08:31:05.376541
11	1	10	2.5	1	1	2026-05-21	4	2026-05-20 08:31:08.053652
12	1	11	2.5	1	0	2026-05-21	2	2026-05-20 08:31:10.257641
1	1	1	2.6	6	2	2026-06-17	4	2026-06-11 09:55:55.278795
\.


--
-- TOC entry 5268 (class 0 OID 49197)
-- Dependencies: 251
-- Data for Name: flashcards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flashcards (id, deck_id, front, back, created_at) FROM stdin;
1	1	what is encapsulation?	Bundling data and methods  that operate on data	2026-05-19 21:49:53.748576
2	1	What does DBMS stand for?	Database Management System	2026-05-20 08:30:13.431419
3	1	What are the ACID properties in a DBMS?	Atomicity, Consistency, Isolation, Durability	2026-05-20 08:30:13.819311
4	1	What is Atomicity in ACID properties?	Ensures that database transactions are treated as a single, indivisible unit	2026-05-20 08:30:13.822732
5	1	What is Consistency in ACID properties?	Ensures that the database remains in a consistent state after a transaction	2026-05-20 08:30:13.824943
6	1	What is Isolation in ACID properties?	Ensures that concurrent transactions do not interfere with each other	2026-05-20 08:30:13.827107
7	1	What is Durability in ACID properties?	Ensures that once a transaction is committed, its effects are permanent	2026-05-20 08:30:13.84377
8	1	What is the purpose of a DBMS?	To manage and provide access to a database in a controlled and efficient manner	2026-05-20 08:30:13.84644
9	1	What are some benefits of using a DBMS?	Improved data integrity, reduced data redundancy, improved data security, and better data management	2026-05-20 08:30:13.872483
10	1	What are some common types of DBMS?	Relational DBMS, NoSQL DBMS, Object-Oriented DBMS, Graph DBMS	2026-05-20 08:30:13.874545
11	1	What is a transaction in a DBMS?	A sequence of operations performed on a database that are treated as a single, indivisible unit	2026-05-20 08:30:13.876366
\.


--
-- TOC entry 5278 (class 0 OID 49309)
-- Dependencies: 261
-- Data for Name: friendships; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.friendships (id, user_id, friend_id, status, created_at, updated_at) FROM stdin;
1	1	3	pending	2026-05-19 21:50:32.011889	2026-05-19 21:50:32.011889
3	1	7	pending	2026-05-19 21:51:54.116527	2026-05-19 21:51:54.116527
2	1	2	accepted	2026-05-19 21:51:37.931638	2026-05-19 21:52:25.349343
\.


--
-- TOC entry 5286 (class 0 OID 57345)
-- Dependencies: 269
-- Data for Name: material_videos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.material_videos (id, material_id, youtube_url, youtube_id, title, added_by, created_at) FROM stdin;
1	18	https://youtu.be/dUWckzX8srw?si=7jebYfcEJrdZWAyT	dUWckzX8srw	aaa	1	2026-05-27 11:23:18.759729
\.


--
-- TOC entry 5242 (class 0 OID 16431)
-- Dependencies: 225
-- Data for Name: materials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.materials (id, course_id, title, file_url, type, created_at, sort_order) FROM stdin;
15	11	Ch-4-Database Recovery	/uploads/1776244052931-Chapter-4-Database Recovery.pdf	pdf	2026-04-15 12:07:32.950535	4
19	9	Advanced Programming Chapter 1	/uploads/1776244313459-Advanced Programming Chapter 1.pdf	pdf	2026-04-15 12:11:53.801945	1
20	9	Advanced Programming Chapter 2	/uploads/1776244326828-Advanced Programming Chapter 2.pdf	pdf	2026-04-15 12:12:06.952341	2
21	9	Advanced Programming Chapter 3	/uploads/1776244352530-Advanced Programming Chapter 3.pdf	pdf	2026-04-15 12:12:32.560827	3
22	9	Advanced Programming Chapter 4 Servlets	/uploads/1776244370619-Advanced Programming Chapter 4 Servlets.pdf	pdf	2026-04-15 12:12:50.650814	4
23	9	Advanced Programming Chapter 5 Java frameworks	/uploads/1776244449769-Advanced Programming Chapter 5 Java frameworks.pdf	pdf	2026-04-15 12:14:09.983913	5
16	11	Ch-3-Concurrency_Control_Techniques	/uploads/1776244123406-Chapter-3-Concurrency_Control_Techniques.pdf	pdf	2026-04-15 12:08:43.680682	3
14	11	Ch-5-Datbase Integrity & Security	/uploads/1776244036022-Chapter-5-Datbase Integrity & Security.pdf	pdf	2026-04-15 12:07:16.156012	5
13	11	Ch-6-Object Oriented Database Systems	/uploads/1776244018713-Chapter-6-Object Oriented Database Systems.pdf	pdf	2026-04-15 12:06:59.217778	6
12	11	Ch-7 Distributed Database Systems	/uploads/1776244000025-Chapter-7 Distributed Database Systems.pdf	pdf	2026-04-15 12:06:40.120241	7
31	7	week 1	/uploads/1778959425165-Bus Scheduling & E-Ticketing Final Year.pdf	pdf	2026-05-16 22:23:45.322066	1
24	15	chapter 1	/uploads/1776244518557-Chapter 1.pdf	pdf	2026-04-15 12:15:18.611386	1
25	15	chapter 2	/uploads/1776244535980-Chapter 2.pdf	pdf	2026-04-15 12:15:36.017689	2
26	15	chapter 3	/uploads/1776244558216-Chapter 3 .pdf	pdf	2026-04-15 12:15:58.238659	3
27	15	chapter 4	/uploads/1776244591147-Chapter 4 .pdf	pdf	2026-04-15 12:16:31.251137	4
28	15	chapter 5	/uploads/1776244605434-Chapter 5 .pdf	pdf	2026-04-15 12:16:45.664248	5
29	15	chapter 6	/uploads/1776244620600-Chapter 6 .pdf	pdf	2026-04-15 12:17:00.658105	6
30	15	chapter 7	/uploads/1776244633309-Chapter 7.pdf	pdf	2026-04-15 12:17:13.380987	7
4	17	chapter 2	/uploads/1775719912695-ch2Full.pdf	pdf	2026-04-09 10:31:52.81037	1
17	11	Ch-2-Transaction Management	/uploads/1776244245505-chapter-2-Transaction Management.pdf	pdf	2026-04-15 12:10:45.632288	2
18	11	Ch-1-Query Processing and Optimization	/uploads/1776244268481-Chapter-1-Query Processing and Optimization.pdf	pdf	2026-04-15 12:11:08.614566	1
\.


--
-- TOC entry 5282 (class 0 OID 49359)
-- Dependencies: 265
-- Data for Name: notification_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification_preferences (id, user_id, email_enabled, push_enabled, friend_requests, streak_warnings, exam_reminders, achievements, daily_goals, created_at, updated_at) FROM stdin;
1	1	t	t	t	t	t	t	t	2026-05-19 21:47:13.678142	2026-05-19 21:47:13.678142
2	2	t	t	t	t	t	t	t	2026-05-19 21:56:57.835997	2026-05-19 21:56:57.835997
\.


--
-- TOC entry 5280 (class 0 OID 49336)
-- Dependencies: 263
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, type, title, message, link, is_read, created_at) FROM stdin;
1	3	friend_request	New Friend Request	undefined sent you a friend request	/friends	f	2026-05-19 21:50:32.067364
3	7	friend_request	New Friend Request	undefined sent you a friend request	/friends	f	2026-05-19 21:51:54.117387
2	2	friend_request	New Friend Request	undefined sent you a friend request	/friends	t	2026-05-19 21:51:37.933159
4	1	friend_request	Friend Request Accepted	undefined accepted your friend request	/friends	t	2026-05-19 21:52:25.35076
6	2	streak_warnings	Your streak is at risk!	You haven't studied today. Your 1-day streak will be lost at midnight unless you study now.	/dashboard	f	2026-05-20 20:00:00.852873
7	3	streak_warnings	Your streak is at risk!	You haven't studied today. Your 1-day streak will be lost at midnight unless you study now or use a streak freeze.	/dashboard	f	2026-05-20 20:00:00.872482
8	6	streak_warnings	Your streak is at risk!	You haven't studied today. Your 1-day streak will be lost at midnight unless you study now or use a streak freeze.	/dashboard	f	2026-05-20 20:00:00.877727
9	7	streak_warnings	Your streak is at risk!	You haven't studied today. Your 1-day streak will be lost at midnight unless you study now or use a streak freeze.	/dashboard	f	2026-05-20 20:00:00.878863
5	1	streak_warnings	Your streak is at risk!	You haven't studied today. Your 1-day streak will be lost at midnight unless you study now or use a streak freeze.	/dashboard	t	2026-05-20 20:00:00.544675
\.


--
-- TOC entry 5250 (class 0 OID 24612)
-- Dependencies: 233
-- Data for Name: options; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.options (id, question_id, option_text, is_correct, created_at) FROM stdin;
1456	364	To store data permanently	f	2026-04-08 11:33:58.43932
1457	364	To execute instructions and process data	t	2026-04-08 11:33:58.43932
1458	364	To display graphics	f	2026-04-08 11:33:58.43932
1459	364	To cool down the motherboard	f	2026-04-08 11:33:58.43932
1460	365	Hiding internal state and requiring all interaction to be performed through an object's methods	t	2026-04-08 11:33:58.43932
1461	365	Inheriting properties from a parent class	f	2026-04-08 11:33:58.43932
1462	365	Creating multiple objects from a single class	f	2026-04-08 11:33:58.43932
1463	365	Converting code into machine language	f	2026-04-08 11:33:58.43932
1464	366	HTTP	f	2026-04-08 11:33:58.43932
1465	366	FTP	f	2026-04-08 11:33:58.43932
1466	366	HTTPS	t	2026-04-08 11:33:58.43932
1467	366	SMTP	f	2026-04-08 11:33:58.43932
1472	368	To write all the documentation before coding	f	2026-04-08 11:33:58.43932
1473	368	To deliver software in small, incremental, and flexible iterations	t	2026-04-08 11:33:58.43932
1474	368	To strictly follow a linear, sequential design process	f	2026-04-08 11:33:58.43932
1475	368	To avoid testing until the end of the project	f	2026-04-08 11:33:58.43932
97	25	To protect the processor from overheating	f	2026-04-08 10:35:27.233171
98	25	To provide a seal between the processor and heatsink	t	2026-04-08 10:35:27.233171
99	25	To prevent static electricity from damaging the processor	f	2026-04-08 10:35:27.233171
100	25	To speed up the processor's performance	f	2026-04-08 10:35:27.233171
105	27	To provide temporary power during a power outage	f	2026-04-08 10:35:27.233171
106	27	To regulate the power supply to the computer system	f	2026-04-08 10:35:27.233171
107	27	To prevent damage to the computer system from power surges	f	2026-04-08 10:35:27.233171
108	27	All of the above	t	2026-04-08 10:35:27.233171
109	28	Use a damp cloth to wipe the keys	f	2026-04-08 10:35:27.233171
110	28	Use a can of compressed air to blow out debris	f	2026-04-08 10:35:27.233171
111	28	Remove the keys and wash them in soapy water	f	2026-04-08 10:35:27.233171
112	28	All of the above	t	2026-04-08 10:35:27.233171
113	29	To recover lost or deleted files	f	2026-04-08 10:35:27.233171
114	29	To protect against hardware failure	f	2026-04-08 10:35:27.233171
115	29	To prepare for a disaster	f	2026-04-08 10:35:27.233171
116	29	All of the above	t	2026-04-08 10:35:27.233171
117	30	Use benchmarking software	f	2026-04-08 10:35:27.233171
118	30	Run diagnostic tests	f	2026-04-08 10:35:27.233171
119	30	Check the system's event log	f	2026-04-08 10:35:27.233171
120	30	All of the above	t	2026-04-08 10:35:27.233171
121	31	To control the computer's basic functions	f	2026-04-08 10:35:27.233171
122	31	To configure the hardware settings of the computer	f	2026-04-08 10:35:27.233171
123	31	To provide a platform for the operating system to run on	f	2026-04-08 10:35:27.233171
124	31	All of the above	t	2026-04-08 10:35:27.233171
125	32	Use anti-virus and anti-malware software	f	2026-04-08 10:35:27.233171
126	32	Reformat the hard drive and reinstall the operating system	f	2026-04-08 10:35:27.233171
127	32	Delete infected files manually	f	2026-04-08 10:35:27.233171
128	32	All of the above	t	2026-04-08 10:35:27.233171
133	34	conceptual design	f	2026-04-08 10:35:27.233171
134	34	Logical Design	f	2026-04-08 10:35:27.233171
135	34	Physical design	t	2026-04-08 10:35:27.233171
136	34	Enterprise designing	f	2026-04-08 10:35:27.233171
137	35	Database system contains only the database itself but does not contain a complete definition or description of the database structure and constraints	t	2026-04-08 10:35:27.233171
138	35	The Database approach is characterized by program-data independence.	f	2026-04-08 10:35:27.233171
139	35	It allows multiple users to access the database at the same time.	f	2026-04-08 10:35:27.233171
140	35	It provides facilities for recovering hardware and software failures	f	2026-04-08 10:35:27.233171
141	36	User at one site cannot be able access data that is available at another site	f	2026-04-08 10:35:27.233171
142	36	If one site fails the rest can continue operation as long as transaction does not demand data from the failed system and the data is not replicated in other sites	t	2026-04-08 10:35:27.233171
143	36	cannot Speedup of query processing	f	2026-04-08 10:35:27.233171
144	36	there is no communication problems in DDBMS	f	2026-04-08 10:35:27.233171
145	37	Appears to user as a single system and Appears to user as multiple system	f	2026-04-08 10:35:27.233171
146	37	Different sites may use different schemas and software and all sites have identical software	t	2026-04-08 10:35:27.233171
147	37	Difference in schema is a major problem for query processing and same in schema is a major problem for query processing	f	2026-04-08 10:35:27.233171
148	37	Sites may not be aware of each other and Sites have aware of each other	f	2026-04-08 10:35:27.233171
153	39	Shadow paging	t	2026-04-08 10:35:27.233171
154	39	Check pointing	f	2026-04-08 10:35:27.233171
155	39	Log-Based	f	2026-04-08 10:35:27.233171
156	39	Taking Backup	f	2026-04-08 10:35:27.233171
161	41	To transform a query written in a low-level language into a high-level language	f	2026-04-08 10:35:27.233171
162	41	To determine a strategy the one which is the most cost effective and efficient	t	2026-04-08 10:35:27.233171
163	41	To execute the strategy to retrieve the irrelevant data	f	2026-04-08 10:35:27.233171
164	41	To check that the query is only syntactically correct	f	2026-04-08 10:35:27.233171
165	42	Semantic optimization	t	2026-04-08 10:35:27.233171
166	42	Syntactical Optimization	f	2026-04-08 10:35:27.233171
167	42	Heuristic query optimization	f	2026-04-08 10:35:27.233171
168	42	Cost based query optimization	f	2026-04-08 10:35:27.233171
169	43	grant delete on table name to user1;	t	2026-04-08 10:35:27.233171
170	43	grant on table name delete to user1	f	2026-04-08 10:35:27.233171
171	43	grant on table name delete from user1	f	2026-04-08 10:35:27.233171
172	43	grant delete on table name from user1;	f	2026-04-08 10:35:27.233171
173	44	A trigger is not a stored procedure	f	2026-04-08 10:35:27.233171
174	44	A trigger can be invoked when a row is inserted into a specified table	t	2026-04-08 10:35:27.233171
175	44	A trigger cannot be invoked when certain table columns are being updated	f	2026-04-08 10:35:27.233171
176	44	AFTER triggers run the trigger action before the triggering statement is run	f	2026-04-08 10:35:27.233171
177	45	It is used to speed up querying during fetching data	t	2026-04-08 10:35:27.233171
178	45	It is used to speed up update time than the normal update time	f	2026-04-08 10:35:27.233171
179	45	Cannot speed up fetching time than the normal fetching time	f	2026-04-08 10:35:27.233171
180	45	we cannot stored table keys in indexes	f	2026-04-08 10:35:27.233171
181	46	Manual approach	f	2026-04-08 10:35:27.233171
182	46	File-based approach	t	2026-04-08 10:35:27.233171
183	46	Database approach	f	2026-04-08 10:35:27.233171
184	46	all	f	2026-04-08 10:35:27.233171
185	47	Reduce total execution time of the query	t	2026-04-08 10:35:27.233171
186	47	increase the number of disk access	f	2026-04-08 10:35:27.233171
187	47	increase response time of the query	f	2026-04-08 10:35:27.233171
188	47	reduce pipelining	f	2026-04-08 10:35:27.233171
189	48	because the view is secured	f	2026-04-08 10:35:27.233171
190	48	because it hides unnecessary information from users	f	2026-04-08 10:35:27.233171
191	48	because it Provides very low flexibility	f	2026-04-08 10:35:27.233171
192	48	aggregation and summary results are computed from a base relation	t	2026-04-08 10:35:27.233171
193	49	There is one parent in the hierarchical data model but in the network data model there will be more than one	t	2026-04-08 10:35:27.233171
194	49	in hierarchical data model sees records as a set of members but not network data model	f	2026-04-08 10:35:27.233171
195	49	in hierarchical data model allows no many to many relationships between entities but not network data model	f	2026-04-08 10:35:27.233171
196	49	hierarchical data model is collection of physically linked records but not network data model	f	2026-04-08 10:35:27.233171
197	50	Protocol	f	2026-04-08 10:35:27.233171
198	50	Media	f	2026-04-08 10:35:27.233171
199	50	Sender	f	2026-04-08 10:35:27.233171
200	50	All	t	2026-04-08 10:35:27.233171
201	51	WiFi	f	2026-04-08 10:35:27.233171
202	51	WiMAX	t	2026-04-08 10:35:27.233171
203	51	Internet	f	2026-04-08 10:35:27.233171
204	51	Ad hoc network	f	2026-04-08 10:35:27.233171
209	53	IPv4 uses 32-bit addresses in dotted notations.	f	2026-04-08 10:35:27.233171
210	53	48-bit address in colons notations	f	2026-04-08 10:35:27.233171
211	53	IPv6 uses 128-bit addresses in hexadecimal notations	f	2026-04-08 10:35:27.233171
212	53	MAC Address of computer can be changed	t	2026-04-08 10:35:27.233171
217	55	Security	f	2026-04-08 10:35:27.233171
218	55	Accessibility	t	2026-04-08 10:35:27.233171
219	55	Speed	f	2026-04-08 10:35:27.233171
220	55	Communication	f	2026-04-08 10:35:27.233171
221	56	5	f	2026-04-08 10:35:27.233171
222	56	15	t	2026-04-08 10:35:27.233171
223	56	30	f	2026-04-08 10:35:27.233171
224	56	None	f	2026-04-08 10:35:27.233171
225	57	Physical	t	2026-04-08 10:35:27.233171
226	57	Network	f	2026-04-08 10:35:27.233171
227	57	Presentation	f	2026-04-08 10:35:27.233171
228	57	Application	f	2026-04-08 10:35:27.233171
229	58	TDM	t	2026-04-08 10:35:27.233171
230	58	FDM	f	2026-04-08 10:35:27.233171
231	58	SDM	f	2026-04-08 10:35:27.233171
232	58	All	f	2026-04-08 10:35:27.233171
233	59	Physical layer	f	2026-04-08 10:35:27.233171
234	59	Presentation layer	t	2026-04-08 10:35:27.233171
235	59	Network layer	f	2026-04-08 10:35:27.233171
236	59	Session layer	f	2026-04-08 10:35:27.233171
241	61	Network layer	f	2026-04-08 10:35:27.233171
242	61	Transport layer	f	2026-04-08 10:35:27.233171
243	61	Data link layer	f	2026-04-08 10:35:27.233171
244	61	Session layer	f	2026-04-08 10:35:27.233171
249	63	Network layer	f	2026-04-08 10:35:27.233171
250	63	Transport layer	f	2026-04-08 10:35:27.233171
251	63	Data link layer	t	2026-04-08 10:35:27.233171
252	63	Session layer	f	2026-04-08 10:35:27.233171
253	64	Frame	t	2026-04-08 10:35:27.233171
254	64	Packet	f	2026-04-08 10:35:27.233171
255	64	Segment	f	2026-04-08 10:35:27.233171
256	64	Data	f	2026-04-08 10:35:27.233171
257	65	Ethernet	t	2026-04-08 10:35:27.233171
258	65	PPP	t	2026-04-08 10:35:27.233171
259	65	UDP	f	2026-04-08 10:35:27.233171
260	65	SMTP	f	2026-04-08 10:35:27.233171
261	66	TCP/IP model has 4 layers	f	2026-04-08 10:35:27.233171
262	66	TCP/IP is developed by ARPANET	f	2026-04-08 10:35:27.233171
263	66	OSI Model has 7 layers	f	2026-04-08 10:35:27.233171
264	66	OSI model is support both connection-oriented and connectionless	t	2026-04-08 10:35:27.233171
265	67	ARP	t	2026-04-08 10:35:27.233171
266	67	RARP	f	2026-04-08 10:35:27.233171
267	67	UDP	f	2026-04-08 10:35:27.233171
268	67	TCP	f	2026-04-08 10:35:27.233171
269	68	23	f	2026-04-08 10:35:27.233171
270	68	22	t	2026-04-08 10:35:27.233171
271	68	25	f	2026-04-08 10:35:27.233171
272	68	80	f	2026-04-08 10:35:27.233171
273	69	Unicast	f	2026-04-08 10:35:27.233171
274	69	Broadcast	f	2026-04-08 10:35:27.233171
275	69	Multicast	f	2026-04-08 10:35:27.233171
276	69	Anycast	t	2026-04-08 10:35:27.233171
277	70	The same name	f	2026-04-08 10:35:27.233171
278	70	Different name	t	2026-04-08 10:35:27.233171
622	156	Exploit	f	2026-04-08 10:54:13.316109
237	60	Transport layer	f	2026-04-08 10:35:27.233171
238	60	Data link layer	t	2026-04-08 10:35:27.233171
239	60	Network layer	f	2026-04-08 10:35:27.233171
240	60	Session layer	f	2026-04-08 10:35:27.233171
279	70	Name may be special characters	f	2026-04-08 10:35:27.233171
280	70	All	f	2026-04-08 10:35:27.233171
281	71	In workgroup, all computers are managed by server	t	2026-04-08 10:35:27.233171
282	71	In domain, all computers are managed by server	f	2026-04-08 10:35:27.233171
283	71	A workgroup is not protected by a password	f	2026-04-08 10:35:27.233171
284	71	In workgroup, all computers must be on the same local network	f	2026-04-08 10:35:27.233171
285	72	Domain	f	2026-04-08 10:35:27.233171
286	72	Tree	f	2026-04-08 10:35:27.233171
287	72	Forest	f	2026-04-08 10:35:27.233171
288	72	Domain controller	t	2026-04-08 10:35:27.233171
289	73	Domain	f	2026-04-08 10:35:27.233171
290	73	Tree	f	2026-04-08 10:35:27.233171
291	73	Forest	t	2026-04-08 10:35:27.233171
292	73	Site	f	2026-04-08 10:35:27.233171
293	74	Trust	t	2026-04-08 10:35:27.233171
294	74	Tree	f	2026-04-08 10:35:27.233171
295	74	Domain	f	2026-04-08 10:35:27.233171
296	74	Group	f	2026-04-08 10:35:27.233171
297	75	Authentication	f	2026-04-08 10:35:27.233171
298	75	Authorization	t	2026-04-08 10:35:27.233171
299	75	Access control	f	2026-04-08 10:35:27.233171
300	75	Validation	f	2026-04-08 10:35:27.233171
301	76	Enforce password history	t	2026-04-08 10:35:27.233171
302	76	Maximum password age	f	2026-04-08 10:35:27.233171
303	76	Minimum password length	f	2026-04-08 10:35:27.233171
304	76	Passwords must meet complexity requirements	f	2026-04-08 10:35:27.233171
305	77	Subneting	t	2026-04-08 10:35:27.233171
306	77	Cider	f	2026-04-08 10:35:27.233171
307	77	Superneting	f	2026-04-08 10:35:27.233171
308	77	IP classification	f	2026-04-08 10:35:27.233171
309	78	To enhance the growth of global Internet routing table	f	2026-04-08 10:35:27.233171
310	78	To prevent buying new IP address	f	2026-04-08 10:35:27.233171
311	78	To secure computers	f	2026-04-08 10:35:27.233171
312	78	All	t	2026-04-08 10:35:27.233171
313	79	8	f	2026-04-08 10:35:27.233171
314	79	30	t	2026-04-08 10:35:27.233171
315	79	32	f	2026-04-08 10:35:27.233171
316	79	24	f	2026-04-08 10:35:27.233171
317	80	It available for flat topology	f	2026-04-08 10:35:27.233171
318	80	It uses Open Shortest Path First rule	t	2026-04-08 10:35:27.233171
319	80	Routing Information Protocol used to rout packets	f	2026-04-08 10:35:27.233171
320	80	None	f	2026-04-08 10:35:27.233171
321	81	RAM	f	2026-04-08 10:35:27.233171
322	81	FLASH	f	2026-04-08 10:35:27.233171
323	81	Non-Volatile RAM	t	2026-04-08 10:35:27.233171
324	81	Volatile RAM	f	2026-04-08 10:35:27.233171
325	82	Switch>	f	2026-04-08 10:35:27.233171
326	82	Switch(config)#	t	2026-04-08 10:35:27.233171
327	82	Switch(config-if)#	f	2026-04-08 10:35:27.233171
328	82	Switch#	f	2026-04-08 10:35:27.233171
333	84	Secure Shell (SSH)	f	2026-04-08 10:35:27.233171
334	84	HyperText Transfer Protocol Secure (HTTPS)	f	2026-04-08 10:35:27.233171
335	84	IPSec protocol	f	2026-04-08 10:35:27.233171
336	84	All	t	2026-04-08 10:35:27.233171
345	87	FLSM has equal interval of hosts	f	2026-04-08 10:35:27.233171
346	87	FLSM has the same subnet mask	f	2026-04-08 10:35:27.233171
347	87	VLSM wasted more IP address than FLSM	t	2026-04-08 10:35:27.233171
348	87	VLSM has different subnet mask	f	2026-04-08 10:35:27.233171
349	88	Java_class1 myObj=new Java_class1();	f	2026-04-08 10:35:27.233171
350	88	Main myObj1=new Main();	f	2026-04-08 10:35:27.233171
351	88	Main myObj2=new Java_class1();	f	2026-04-08 10:35:27.233171
352	88	Java_class1 myObj3=new Main();	t	2026-04-08 10:35:27.233171
353	89	10	f	2026-04-08 10:35:27.233171
354	89	89	f	2026-04-08 10:35:27.233171
355	89	Error	t	2026-04-08 10:35:27.233171
356	89	None	f	2026-04-08 10:35:27.233171
361	91	private	f	2026-04-08 10:35:27.233171
362	91	public	f	2026-04-08 10:35:27.233171
363	91	default	t	2026-04-08 10:35:27.233171
364	91	protected	f	2026-04-08 10:35:27.233171
365	92	Data abstraction is the process of hiding certain details and showing only essential information to the user	f	2026-04-08 10:35:27.233171
366	92	The abstract keyword can be used for classes and methods	f	2026-04-08 10:35:27.233171
367	92	Abstract class cannot be used to create objects	f	2026-04-08 10:35:27.233171
368	92	Abstraction can only be achieved by interface classes	t	2026-04-08 10:35:27.233171
373	94	The structured programming allows developing a program using a set of modules or functions	f	2026-04-08 10:35:27.233171
374	94	Structured programming includes data hiding feature therefore it is more secure	f	2026-04-08 10:35:27.233171
375	94	brings together data and functions	f	2026-04-08 10:35:27.233171
376	94	A & C	t	2026-04-08 10:35:27.233171
377	95	Structured programming	f	2026-04-08 10:35:27.233171
378	95	Object oriented programming	t	2026-04-08 10:35:27.233171
379	95	modular programming	f	2026-04-08 10:35:27.233171
380	95	functional programming	f	2026-04-08 10:35:27.233171
381	96	3\n2	t	2026-04-08 10:35:27.233171
382	96	2\n3	f	2026-04-08 10:35:27.233171
383	96	4\n3	f	2026-04-08 10:35:27.233171
384	96	3\n4	f	2026-04-08 10:35:27.233171
385	97	DEPARTMENT_LIST.iterator("IT");	f	2026-04-08 10:35:27.233171
386	97	DEPARTMENT_LIST.stream("IT");	f	2026-04-08 10:35:27.233171
387	97	DEPARTMENT_LIST.add("IT");	t	2026-04-08 10:35:27.233171
388	97	DEPARTMENT_LIST.get("IT");	f	2026-04-08 10:35:27.233171
389	98	try{ int res=100/0; System.out.println(res); } catch(ArithmeticException e){ System.out.println(e); }	t	2026-04-08 10:35:27.233171
390	98	try{ int res=100/0; System.out.println(res); } catch(NullPointerException e){ System.out.println(e); }	f	2026-04-08 10:35:27.233171
391	98	try{ int res=100/0; System.out.println(res); } catch(ArrayIndexOutOfBoundsException e){ System.out.println(e); }	f	2026-04-08 10:35:27.233171
392	98	try{ int res=100/0; System.out.println(res); } catch(NumberFormatException e){ System.out.println(e); }	f	2026-04-08 10:35:27.233171
393	99	NumberFormatException	f	2026-04-08 10:35:27.233171
394	99	NullPointerException	t	2026-04-08 10:35:27.233171
395	99	Although using exception handling is a better programming method, the above program will not through an exception	f	2026-04-08 10:35:27.233171
396	99	IndexOutOfBoundsException	f	2026-04-08 10:35:27.233171
397	100	POST	f	2026-04-08 10:35:27.233171
398	100	SEND	f	2026-04-08 10:35:27.233171
399	100	GET	t	2026-04-08 10:35:27.233171
400	100	PUT	f	2026-04-08 10:35:27.233171
409	103	Activity performs the actions on the screen	t	2026-04-08 10:35:27.233171
410	103	Manage the Application content	f	2026-04-08 10:35:27.233171
411	103	Screen UI	f	2026-04-08 10:35:27.233171
412	103	None of the above	f	2026-04-08 10:35:27.233171
413	104	onCreate() -> onStartCommand() -> onDestroy()	t	2026-04-08 10:35:27.233171
414	104	onReceive()	f	2026-04-08 10:35:27.233171
415	104	final()	f	2026-04-08 10:35:27.233171
416	104	Service life cycle is same as activity life cycle.	f	2026-04-08 10:35:27.233171
417	105	send intent()	f	2026-04-08 10:35:27.233171
418	105	onReceive()	t	2026-04-08 10:35:27.233171
419	105	implicitBroadcast()	f	2026-04-08 10:35:27.233171
420	105	sendBroadcast(), sendOrderBroadcast(), and sendStickyBroadcast().	f	2026-04-08 10:35:27.233171
421	106	Specification delays	f	2026-04-08 10:35:27.233171
422	106	Product competition	f	2026-04-08 10:35:27.233171
423	106	Testing	t	2026-04-08 10:35:27.233171
424	106	Staff turnover	f	2026-04-08 10:35:27.233171
425	107	Keeping overall costs within budget	f	2026-04-08 10:35:27.233171
426	107	Delivering the software to the customer at the agreed time	f	2026-04-08 10:35:27.233171
427	107	Maintaining a happy and well-functioning development team	f	2026-04-08 10:35:27.233171
428	107	Avoiding customer complaints	t	2026-04-08 10:35:27.233171
437	110	To develop software	f	2026-04-08 10:35:27.233171
438	110	To improve system efficiency	t	2026-04-08 10:35:27.233171
439	110	To provide training to employees	f	2026-04-08 10:35:27.233171
440	110	To monitor system performance	f	2026-04-08 10:35:27.233171
441	111	To determine the system requirements	f	2026-04-08 10:35:27.233171
442	111	To develop a detailed project plan	t	2026-04-08 10:35:27.233171
443	111	To design the system	f	2026-04-08 10:35:27.233171
444	111	To implement the system	f	2026-04-08 10:35:27.233171
445	112	Functional	f	2026-04-08 10:35:27.233171
446	112	Non-functional	f	2026-04-08 10:35:27.233171
447	112	User	t	2026-04-08 10:35:27.233171
448	112	Technical	f	2026-04-08 10:35:27.233171
449	113	Agile	f	2026-04-08 10:35:27.233171
450	113	Waterfall	f	2026-04-08 10:35:27.233171
451	113	RAD (Rapid Application Development)	f	2026-04-08 10:35:27.233171
452	113	UML (Unified Modeling Language)	t	2026-04-08 10:35:27.233171
453	114	To depict the system inputs and outputs	f	2026-04-08 10:35:27.233171
454	114	To depict the system processes	f	2026-04-08 10:35:27.233171
455	114	To depict the system data and relationships	t	2026-04-08 10:35:27.233171
456	114	To illustrate the system architecture	f	2026-04-08 10:35:27.233171
457	115	only by extending the Thread class	f	2026-04-08 10:35:27.233171
458	115	only by implementing the Runnable interface	f	2026-04-08 10:35:27.233171
459	115	by extending the Runnable interface and implementing the Thread class	f	2026-04-08 10:35:27.233171
460	115	by implementing the Runnable interface & extending the Thread class	t	2026-04-08 10:35:27.233171
461	116	FTP	f	2026-04-08 10:35:27.233171
462	116	TCP/IP	t	2026-04-08 10:35:27.233171
463	116	EFT	f	2026-04-08 10:35:27.233171
464	116	EDI	f	2026-04-08 10:35:27.233171
465	117	Personal	f	2026-04-08 10:35:27.233171
466	117	Web Server	f	2026-04-08 10:35:27.233171
467	117	Sql	f	2026-04-08 10:35:27.233171
468	117	Cute-ftp	t	2026-04-08 10:35:27.233171
473	119	a program that can display a web page	f	2026-04-08 10:35:27.233171
474	119	a program used to view html documents	f	2026-04-08 10:35:27.233171
475	119	it enables user to access the resources of internet	f	2026-04-08 10:35:27.233171
476	119	all of the mentioned	t	2026-04-08 10:35:27.233171
477	120	Web server	f	2026-04-08 10:35:27.233171
478	120	Web network	f	2026-04-08 10:35:27.233171
479	120	Web browser	t	2026-04-08 10:35:27.233171
480	120	Web matrix	f	2026-04-08 10:35:27.233171
481	121	! (Exclamation)	f	2026-04-08 10:35:27.233171
482	121	$ (Dollar)	t	2026-04-08 10:35:27.233171
483	121	& (Ampersand)	f	2026-04-08 10:35:27.233171
484	121	# (Hash)	f	2026-04-08 10:35:27.233171
489	123	+ (plus)	f	2026-04-08 10:35:27.233171
490	123	* (Asterisk)	f	2026-04-08 10:35:27.233171
491	123	. (dot)	t	2026-04-08 10:35:27.233171
492	123	append()	f	2026-04-08 10:35:27.233171
493	124	Minimum cost	f	2026-04-08 10:54:13.316109
494	124	Shallower	f	2026-04-08 10:54:13.316109
495	124	Child node	f	2026-04-08 10:54:13.316109
496	124	Deepest	t	2026-04-08 10:54:13.316109
497	125	Microwave	f	2026-04-08 10:54:13.316109
498	125	Optical fiber	f	2026-04-08 10:54:13.316109
499	125	Unshielded twisted pair	f	2026-04-08 10:54:13.316109
500	125	Coaxial cable	t	2026-04-08 10:54:13.316109
501	126	Animal animal = new Animal();	f	2026-04-08 10:54:13.316109
502	126	new Animal();	f	2026-04-08 10:54:13.316109
503	126	It is not supported to create an object of Animal	t	2026-04-08 10:54:13.316109
504	126	Interface Animal animal = new Animal();	f	2026-04-08 10:54:13.316109
505	127	RR	t	2026-04-08 10:54:13.316109
506	127	SJF	f	2026-04-08 10:54:13.316109
507	127	Priority	f	2026-04-08 10:54:13.316109
508	127	FCFS	f	2026-04-08 10:54:13.316109
509	128	Hi there! Rose flower I am.	f	2026-04-08 10:54:13.316109
510	128	I am Rose Flower. Hi there!	t	2026-04-08 10:54:13.316109
511	128	I am Flower. Rose! Hi there!	f	2026-04-08 10:54:13.316109
512	128	Hi there! I am Rose Flower.	f	2026-04-08 10:54:13.316109
513	129	It is also known as logical address	f	2026-04-08 10:54:13.316109
514	129	It is used for subnetting purpose	f	2026-04-08 10:54:13.316109
515	129	It is represented by 128 bits	f	2026-04-08 10:54:13.316109
516	129	It is commonly assigned by the manufacturer of the NIC	t	2026-04-08 10:54:13.316109
517	130	Scanner is a co-routine of parser	t	2026-04-08 10:54:13.316109
518	130	Lexical analyzer works on simple recursive constructs a language	f	2026-04-08 10:54:13.316109
519	130	Syntax analyzer works on simple none recursive constructs a language	f	2026-04-08 10:54:13.316109
520	130	Syntax analyzer is a co-routine of lexical analyzer	f	2026-04-08 10:54:13.316109
521	131	WPA	f	2026-04-08 10:54:13.316109
522	131	WEP	t	2026-04-08 10:54:13.316109
523	131	WPA3	f	2026-04-08 10:54:13.316109
524	131	WPA2	f	2026-04-08 10:54:13.316109
525	132	Domain	f	2026-04-08 10:54:13.316109
526	132	Domain controller	f	2026-04-08 10:54:13.316109
527	132	Global Catalog	t	2026-04-08 10:54:13.316109
528	132	Sites	f	2026-04-08 10:54:13.316109
529	133	Inheritance	f	2026-04-08 10:54:13.316109
530	133	Encapsulation	t	2026-04-08 10:54:13.316109
531	133	Polymorphism	f	2026-04-08 10:54:13.316109
532	133	Abstraction	f	2026-04-08 10:54:13.316109
537	135	*, +, .	f	2026-04-08 10:54:13.316109
538	135	., *, +	f	2026-04-08 10:54:13.316109
539	135	*, ., +	f	2026-04-08 10:54:13.316109
540	135	+, ., *	t	2026-04-08 10:54:13.316109
541	136	Testing	f	2026-04-08 10:54:13.316109
542	136	Modeling	f	2026-04-08 10:54:13.316109
543	136	Data acquisition	t	2026-04-08 10:54:13.316109
544	136	Data representation	f	2026-04-08 10:54:13.316109
545	137	6 grammar symbols	t	2026-04-08 10:54:13.316109
546	137	2 grammar symbols	f	2026-04-08 10:54:13.316109
547	137	1 grammar symbols	f	2026-04-08 10:54:13.316109
548	137	3 grammar symbols	f	2026-04-08 10:54:13.316109
549	138	int	f	2026-04-08 10:54:13.316109
550	138	short	f	2026-04-08 10:54:13.316109
551	138	char	f	2026-04-08 10:54:13.316109
552	138	double	t	2026-04-08 10:54:13.316109
553	139	PID of child process	t	2026-04-08 10:54:13.316109
554	139	Local variables	f	2026-04-08 10:54:13.316109
555	139	Return addresses	f	2026-04-08 10:54:13.316109
556	139	Function parameters	f	2026-04-08 10:54:13.316109
557	140	RMI	f	2026-04-08 10:54:13.316109
558	140	DOM	t	2026-04-08 10:54:13.316109
559	140	MVC	f	2026-04-08 10:54:13.316109
560	140	RPC	f	2026-04-08 10:54:13.316109
573	144	O(logn)	f	2026-04-08 10:54:13.316109
574	144	O(nlogn)	f	2026-04-08 10:54:13.316109
575	144	O(1)	t	2026-04-08 10:54:13.316109
576	144	O(n)	f	2026-04-08 10:54:13.316109
581	146	Administrator	t	2026-04-08 10:54:13.316109
582	146	Transmission media	f	2026-04-08 10:54:13.316109
583	146	Sender	f	2026-04-08 10:54:13.316109
584	146	Protocol	f	2026-04-08 10:54:13.316109
585	147	Titles of the five most expensive books	t	2026-04-08 10:54:13.316109
586	147	Title of the fifth most inexpensive book	f	2026-04-08 10:54:13.316109
587	147	Titles of the four most expensive books	f	2026-04-08 10:54:13.316109
588	147	Title of the fifth most expensive book	f	2026-04-08 10:54:13.316109
589	148	Session	f	2026-04-08 10:54:13.316109
590	148	Style declarations	f	2026-04-08 10:54:13.316109
591	148	Text Editors	f	2026-04-08 10:54:13.316109
592	148	Cascading Style Sheets	t	2026-04-08 10:54:13.316109
593	149	Elements in an array cannot be sorted	f	2026-04-08 10:54:13.316109
594	149	Index of first element of an array is 1	f	2026-04-08 10:54:13.316109
595	149	Objects of mixed data types can be stored	f	2026-04-08 10:54:13.316109
596	149	Easier to store elements of same data type	t	2026-04-08 10:54:13.316109
597	150	b*a*	t	2026-04-08 10:54:13.316109
598	150	(a*b*)*	f	2026-04-08 10:54:13.316109
599	150	a*b+	f	2026-04-08 10:54:13.316109
600	150	a*b*	f	2026-04-08 10:54:13.316109
601	151	Handle to events, errors and exceptions	f	2026-04-08 10:54:13.316109
602	151	to validate data	f	2026-04-08 10:54:13.316109
603	151	to access database data and file system	t	2026-04-08 10:54:13.316109
604	151	to manipulate HTML elements	f	2026-04-08 10:54:13.316109
609	153	$_POST['text']	f	2026-04-08 10:54:13.316109
610	153	$_GET['email']	f	2026-04-08 10:54:13.316109
611	153	$_SESSION['text']	f	2026-04-08 10:54:13.316109
612	153	$_POST['email']	t	2026-04-08 10:54:13.316109
617	155	The symbols used are 0 and 1	f	2026-04-08 10:54:13.316109
618	155	It positional weighted number	f	2026-04-08 10:54:13.316109
619	155	it also used as a machine language	f	2026-04-08 10:54:13.316109
620	155	The base is 3	t	2026-04-08 10:54:13.316109
621	156	Threat	f	2026-04-08 10:54:13.316109
623	156	Attack	t	2026-04-08 10:54:13.316109
624	156	Vulnerability	f	2026-04-08 10:54:13.316109
625	157	Always, even if there is a failure of any kind	t	2026-04-08 10:54:13.316109
626	157	Except in case of a disk crash	f	2026-04-08 10:54:13.316109
627	157	Except in case of an operating system crash	f	2026-04-08 10:54:13.316109
628	157	Except in case of a power failure	f	2026-04-08 10:54:13.316109
633	159	LONG	f	2026-04-08 10:54:13.316109
634	159	CHAR	t	2026-04-08 10:54:13.316109
635	159	VARCHAR2	f	2026-04-08 10:54:13.316109
636	159	NUMBER	f	2026-04-08 10:54:13.316109
637	160	Restrict users to access some pages of your website	f	2026-04-08 10:54:13.316109
638	160	Encrypt and decrypt data using built-in algorithms	f	2026-04-08 10:54:13.316109
639	160	Handle sessions of pages using setCookie() function	t	2026-04-08 10:54:13.316109
640	160	Enable and disable cookies using setCookie() function	f	2026-04-08 10:54:13.316109
649	163	T Q O P S R	f	2026-04-08 10:54:13.316109
650	163	T Q O P S R	t	2026-04-08 10:54:13.316109
651	163	T Q R S O P	f	2026-04-08 10:54:13.316109
652	163	T O Q R P S	f	2026-04-08 10:54:13.316109
653	164	Type 1 language	f	2026-04-08 10:54:13.316109
654	164	Type 2 language	f	2026-04-08 10:54:13.316109
655	164	Type 3 language	t	2026-04-08 10:54:13.316109
656	164	Type 0 language	f	2026-04-08 10:54:13.316109
657	165	+ab	f	2026-04-08 10:54:13.316109
658	165	abc+*	f	2026-04-08 10:54:13.316109
659	165	(a + b)*(c + d)	t	2026-04-08 10:54:13.316109
660	165	ab + c*	f	2026-04-08 10:54:13.316109
661	166	Stack	t	2026-04-08 10:54:13.316109
662	166	Array	f	2026-04-08 10:54:13.316109
663	166	Queue	f	2026-04-08 10:54:13.316109
664	166	Tree	f	2026-04-08 10:54:13.316109
669	168	Programs	f	2026-04-08 10:54:13.316109
670	168	Virus	f	2026-04-08 10:54:13.316109
671	168	Botnets	t	2026-04-08 10:54:13.316109
672	168	Worms	f	2026-04-08 10:54:13.316109
673	169	Initially the stack contains $ and starting none terminal of the grammar	t	2026-04-08 10:54:13.316109
674	169	The parsing is successful if the stack is left with $ and the starting symbol of the grammar and the input buffer is left with $	f	2026-04-08 10:54:13.316109
675	169	$ is used to mark the bottom of the stack and the right end of the input buffer	f	2026-04-08 10:54:13.316109
676	169	The parser repeats shifting and reducing actions until the stack is empty or an error is happened	f	2026-04-08 10:54:13.316109
677	170	Access authentication, view definition	t	2026-04-08 10:54:13.316109
678	170	Data access, user monitoring	f	2026-04-08 10:54:13.316109
679	170	Access authentication, user definition	f	2026-04-08 10:54:13.316109
680	170	Access control, database security	f	2026-04-08 10:54:13.316109
681	171	Router	t	2026-04-08 10:54:13.316109
682	171	Bridge	f	2026-04-08 10:54:13.316109
683	171	Switch	f	2026-04-08 10:54:13.316109
684	171	Hub	f	2026-04-08 10:54:13.316109
685	172	Input	f	2026-04-08 10:54:13.316109
686	172	Intermediate state	f	2026-04-08 10:54:13.316109
687	172	Initial state	f	2026-04-08 10:54:13.316109
688	172	Goal	t	2026-04-08 10:54:13.316109
689	173	Achieving worst case time-complexity.	t	2026-04-08 10:54:13.316109
690	173	Efficiency in running time.	f	2026-04-08 10:54:13.316109
691	173	Implementing problems requiring randomization.	f	2026-04-08 10:54:13.316109
692	173	Simplicity of implementation.	f	2026-04-08 10:54:13.316109
697	175	DFS	f	2026-04-08 10:54:13.316109
698	175	BFS	f	2026-04-08 10:54:13.316109
699	175	Uninformed searching techniques	f	2026-04-08 10:54:13.316109
700	175	Informed Searching	t	2026-04-08 10:54:13.316109
701	176	To provide a basis for validation testing	f	2026-04-08 10:54:13.316109
702	176	To define the functional and operational requirements	f	2026-04-08 10:54:13.316109
703	176	To provide a description of end user and system interaction	f	2026-04-08 10:54:13.316109
704	176	To define the hierarchy for the system	t	2026-04-08 10:54:13.316109
713	179	Trojan	t	2026-04-08 10:54:13.316109
714	179	port scanning	f	2026-04-08 10:54:13.316109
715	179	Worm	f	2026-04-08 10:54:13.316109
716	179	denial of service	f	2026-04-08 10:54:13.316109
717	180	It is possible to override the move() method in Lion class.	t	2026-04-08 10:54:13.316109
718	180	The sound() method in the super class must be implemented in the subclass Lion	f	2026-04-08 10:54:13.316109
719	180	The eat() method defined in Animal class is not supported	f	2026-04-08 10:54:13.316109
720	180	It is must for the subclass to have at least one constructor.	f	2026-04-08 10:54:13.316109
721	181	Graph coloring problem	f	2026-04-08 10:54:13.316109
722	181	Finding the maximum continuous sum in the array.	t	2026-04-08 10:54:13.316109
723	181	N-queens problem.	f	2026-04-08 10:54:13.316109
724	181	Minimum spanning tree problem.	f	2026-04-08 10:54:13.316109
725	182	FILE is a keyword in C for representing files and fp is a variable of FILE type.	f	2026-04-08 10:54:13.316109
726	182	FILE is a buffered stream	f	2026-04-08 10:54:13.316109
727	182	FILE is a structure and fp is a pointer to the structure of FILE type	t	2026-04-08 10:54:13.316109
728	182	FILE is a stream	f	2026-04-08 10:54:13.316109
729	183	A function that is expanded at each call during execution	t	2026-04-08 10:54:13.316109
730	183	A function that is not checked for semantic analysis	f	2026-04-08 10:54:13.316109
731	183	A function that is called during compile time	f	2026-04-08 10:54:13.316109
732	183	A function that is not checked for syntax errors	f	2026-04-08 10:54:13.316109
733	184	Node list	f	2026-04-08 10:54:13.316109
734	184	Primitive list	f	2026-04-08 10:54:13.316109
735	184	Linked list	t	2026-04-08 10:54:13.316109
736	184	Unordered list	f	2026-04-08 10:54:13.316109
737	185	Code generation	f	2026-04-08 10:54:13.316109
738	185	Parser	f	2026-04-08 10:54:13.316109
739	185	Code optimization	f	2026-04-08 10:54:13.316109
740	185	Lexical analysis	t	2026-04-08 10:54:13.316109
741	186	1	f	2026-04-08 10:54:13.316109
742	186	0	f	2026-04-08 10:54:13.316109
743	186	Any RAID level	f	2026-04-08 10:54:13.316109
744	186	0+1	t	2026-04-08 10:54:13.316109
745	187	192.168.1.248	f	2026-04-08 10:54:13.316109
746	187	224.1.120.29	f	2026-04-08 10:54:13.316109
747	187	172.12.12.48	t	2026-04-08 10:54:13.316109
748	187	121.12.12.8	f	2026-04-08 10:54:13.316109
749	188	FOR EACH ROW trigger on the AUDIT_TABLE table.	f	2026-04-08 10:54:13.316109
750	188	Statement-level trigger on the EMPLOYEES table.	f	2026-04-08 10:54:13.316109
751	188	FOR EACH ROW trigger on the EMPLOYEES table.	t	2026-04-08 10:54:13.316109
752	188	Statement-level trigger on the AUDIT_TABLE table.	f	2026-04-08 10:54:13.316109
753	189	MBR	t	2026-04-08 10:54:13.316109
754	189	Partition	f	2026-04-08 10:54:13.316109
755	189	Bootblock	f	2026-04-08 10:54:13.316109
756	189	Superblock	f	2026-04-08 10:54:13.316109
761	191	Operation translation	f	2026-04-08 10:54:13.316109
762	191	memory transfer	f	2026-04-08 10:54:13.316109
763	191	Register transfer	t	2026-04-08 10:54:13.316109
764	191	common bus system	f	2026-04-08 10:54:13.316109
765	192	computer specification	f	2026-04-08 10:54:13.316109
766	192	computer application	f	2026-04-08 10:54:13.316109
767	192	Computer architecture	t	2026-04-08 10:54:13.316109
768	192	Computer organization	f	2026-04-08 10:54:13.316109
773	194	A function must return a value to the calling environment, whereas a procedure can return zero or more values to its calling environment.	t	2026-04-08 10:54:13.316109
774	194	A function can be called only as part of a SQL statement, whereas a procedure can be called only as a PL/SQL statement.	f	2026-04-08 10:54:13.316109
775	194	A function may return one or more values to the calling environment, whereas a procedure must return a single value to its calling environment.	f	2026-04-08 10:54:13.316109
776	194	They only have syntax difference otherwise similar	f	2026-04-08 10:54:13.316109
777	195	removal of a state	f	2026-04-08 10:54:13.316109
778	195	addition of new state	f	2026-04-08 10:54:13.316109
779	195	more than one option is correct	t	2026-04-08 10:54:13.316109
780	195	make the newly added state as final	f	2026-04-08 10:54:13.316109
781	196	Primary key	f	2026-04-08 10:54:13.316109
782	196	Index	t	2026-04-08 10:54:13.316109
783	196	Stored procedure	f	2026-04-08 10:54:13.316109
784	196	Default	f	2026-04-08 10:54:13.316109
785	197	Unit testing	f	2026-04-08 10:54:13.316109
786	197	Performance testing	f	2026-04-08 10:54:13.316109
787	197	Security testing	f	2026-04-08 10:54:13.316109
788	197	Stress testing	t	2026-04-08 10:54:13.316109
789	197	Recovery testing	f	2026-04-08 10:54:13.316109
790	198	accepted by LBA	f	2026-04-08 10:54:13.316109
791	198	accepted by PDA	f	2026-04-08 10:54:13.316109
792	198	accepted by DFA	t	2026-04-08 10:54:13.316109
793	198	accepted by Turing machine	f	2026-04-08 10:54:13.316109
794	199	2	t	2026-04-08 10:54:13.316109
795	199	4	f	2026-04-08 10:54:13.316109
796	199	3	f	2026-04-08 10:54:13.316109
797	199	1	f	2026-04-08 10:54:13.316109
798	200	Use case modeling	t	2026-04-08 10:54:13.316109
799	200	Class diagram	f	2026-04-08 10:54:13.316109
800	200	Sequence diagram	f	2026-04-08 10:54:13.316109
801	200	State diagram	f	2026-04-08 10:54:13.316109
802	201	A spanning tree will have n-1 vertices, if the original graph has n-number of vertices.	f	2026-04-08 10:54:13.316109
803	201	A spanning tree will have n+1 edge, if the original graph has n-number of vertices.	f	2026-04-08 10:54:13.316109
804	201	A spanning tree will have n edges, if the original graph has n-number of vertices.	f	2026-04-08 10:54:13.316109
805	201	A spanning tree will have n-1 edges, if the original graph has n-number of vertices.	t	2026-04-08 10:54:13.316109
806	202	gates	t	2026-04-08 10:54:13.316109
807	202	Adder	f	2026-04-08 10:54:13.316109
808	202	Data	f	2026-04-08 10:54:13.316109
809	202	Circuit	f	2026-04-08 10:54:13.316109
810	203	A relation R is in 3NF if every non-prime attribute of R is fully functionally dependent on every key of R	f	2026-04-08 10:54:13.316109
811	203	Every relation in 3NF is also in BCNF	f	2026-04-08 10:54:13.316109
812	203	No relation be both in BCNF & 3NF	f	2026-04-08 10:54:13.316109
813	203	Every relation in BCNF is also in 3NF	t	2026-04-08 10:54:13.316109
814	204	Network load balancing manager	f	2026-04-08 10:54:13.316109
815	204	Group policy management	f	2026-04-08 10:54:13.316109
816	204	Organizational Unit	t	2026-04-08 10:54:13.316109
817	204	Container	f	2026-04-08 10:54:13.316109
818	205	decoder	f	2026-04-08 10:54:13.316109
819	205	multiplexer	f	2026-04-08 10:54:13.316109
820	205	Full adder	f	2026-04-08 10:54:13.316109
821	205	Half adder	t	2026-04-08 10:54:13.316109
822	206	<background color="yellow">text</background>	f	2026-04-08 10:54:13.316109
823	206	<body style="background-color:yellow">	t	2026-04-08 10:54:13.316109
824	206	<body background="yellow">	f	2026-04-08 10:54:13.316109
825	206	<background>yellow</background>	f	2026-04-08 10:54:13.316109
826	207	XP	f	2026-04-08 10:54:13.316109
827	207	Scrum	f	2026-04-08 10:54:13.316109
828	207	Prototyping	f	2026-04-08 10:54:13.316109
829	207	Waterfall model	t	2026-04-08 10:54:13.316109
830	208	Father(abebe).	f	2026-04-08 10:54:13.316109
831	208	Father(natan).	f	2026-04-08 10:54:13.316109
832	208	father(abebe, natan).	t	2026-04-08 10:54:13.316109
833	208	black(abebe).	f	2026-04-08 10:54:13.316109
838	210	96Br	t	2026-04-08 10:54:13.316109
839	210	88Br	f	2026-04-08 10:54:13.316109
840	210	98Br	f	2026-04-08 10:54:13.316109
841	210	86Br	f	2026-04-08 10:54:13.316109
842	211	Cyber Attack	t	2026-04-08 10:54:13.316109
843	211	Digital crime	f	2026-04-08 10:54:13.316109
844	211	System hijacking	f	2026-04-08 10:54:13.316109
845	211	Threats	f	2026-04-08 10:54:13.316109
854	214	RAID Technology	f	2026-04-08 10:54:13.316109
855	214	Incremental backup	t	2026-04-08 10:54:13.316109
856	214	Differential backup	f	2026-04-08 10:54:13.316109
857	214	Full backup	f	2026-04-08 10:54:13.316109
858	215	External	t	2026-04-08 10:54:13.316109
859	215	Conceptual	f	2026-04-08 10:54:13.316109
860	215	Internal	f	2026-04-08 10:54:13.316109
861	215	Physical	f	2026-04-08 10:54:13.316109
862	216	An interface can create an object of its own	t	2026-04-08 10:54:13.316109
863	216	Interface is used to achieve full abstraction, loss coupling and multiple inheritance	f	2026-04-08 10:54:13.316109
864	216	The default variable modifiers in an interface are public, static and final	f	2026-04-08 10:54:13.316109
865	216	Methods in an interface are abstract, and public by default	f	2026-04-08 10:54:13.316109
866	217	Perception history	f	2026-04-08 10:54:13.316109
867	217	Learning theory	t	2026-04-08 10:54:13.316109
868	217	Utility functions	f	2026-04-08 10:54:13.316109
869	217	Current perception	f	2026-04-08 10:54:13.316109
1476	369	mouse	f	2026-04-08 11:34:12.895991
1477	369	Printer	f	2026-04-08 11:34:12.895991
1478	369	Scanner	f	2026-04-08 11:34:12.895991
1479	369	USB drive	t	2026-04-08 11:34:12.895991
1492	373	Use a damp cloth to wipe the keys	f	2026-04-08 11:34:12.895991
1493	373	Use a can of compressed air to blow out debris	f	2026-04-08 11:34:12.895991
1494	373	Remove the keys and wash them in soapy water	f	2026-04-08 11:34:12.895991
1495	373	All of the above	t	2026-04-08 11:34:12.895991
1496	374	To recover lost or deleted files	f	2026-04-08 11:34:12.895991
1497	374	To protect against hardware failure	f	2026-04-08 11:34:12.895991
1498	374	To prepare for a disaster	f	2026-04-08 11:34:12.895991
1499	374	All of the above	t	2026-04-08 11:34:12.895991
1500	375	Use benchmarking software	f	2026-04-08 11:34:12.895991
1501	375	Run diagnostic tests	f	2026-04-08 11:34:12.895991
1502	375	Check the system's event log	f	2026-04-08 11:34:12.895991
1503	375	All of the above	t	2026-04-08 11:34:12.895991
1504	376	To control the computer's basic functions	f	2026-04-08 11:34:12.895991
1505	376	To configure the hardware settings of the computer	f	2026-04-08 11:34:12.895991
1506	376	To provide a platform for the operating system to run on	f	2026-04-08 11:34:12.895991
1507	376	All of the above	t	2026-04-08 11:34:12.895991
1508	377	Use anti-virus and anti-malware software	f	2026-04-08 11:34:12.895991
1509	377	Reformat the hard drive and reinstall the operating system	f	2026-04-08 11:34:12.895991
1510	377	Delete infected files manually	f	2026-04-08 11:34:12.895991
1511	377	All of the above	t	2026-04-08 11:34:12.895991
1512	378	Wear an anti-static wristband	t	2026-04-08 11:34:12.895991
1513	378	Work in a poorly ventilated area	f	2026-04-08 11:34:12.895991
1514	378	Use metal tools near the power supply	f	2026-04-08 11:34:12.895991
1515	378	None of the above	f	2026-04-08 11:34:12.895991
1516	379	conceptual design	f	2026-04-08 11:34:12.895991
1517	379	Logical Design	f	2026-04-08 11:34:12.895991
1518	379	Physical design	t	2026-04-08 11:34:12.895991
1519	379	Enterprise designing	f	2026-04-08 11:34:12.895991
1524	381	User at one site cannot be able access data that is available at another site	f	2026-04-08 11:34:12.895991
1525	381	If one site fails the rest can continue operation as long as transaction does not demand data from the failed system and the data is not replicated in other sites	t	2026-04-08 11:34:12.895991
1526	381	cannot Speedup of query processing	f	2026-04-08 11:34:12.895991
1527	381	there is no communication problems in DDBMS	f	2026-04-08 11:34:12.895991
1528	382	Appears to user as a single system and Appears to user as multiple system	f	2026-04-08 11:34:12.895991
1529	382	Different sites may use different schemas and software and all sites have identical software	t	2026-04-08 11:34:12.895991
1530	382	Difference in schema is a major problem for query processing and same in schema is a major problem for query processing	f	2026-04-08 11:34:12.895991
1531	382	Sites may not be aware of each other and Sites have aware of each other	f	2026-04-08 11:34:12.895991
1532	383	Conflict schedules	f	2026-04-08 11:34:12.895991
1533	383	Equivalent schedules	f	2026-04-08 11:34:12.895991
1534	383	No-serial schedules	f	2026-04-08 11:34:12.895991
1535	383	Serial schedule	t	2026-04-08 11:34:12.895991
1536	384	Shadow paging	t	2026-04-08 11:34:12.895991
1537	384	Check pointing	f	2026-04-08 11:34:12.895991
1538	384	Log-Based	f	2026-04-08 11:34:12.895991
1539	384	Taking Backup	f	2026-04-08 11:34:12.895991
1544	386	To transform a query written in a low-level language into a high-level language	f	2026-04-08 11:34:12.895991
1545	386	To determine a strategy the one which is the most cost effective and efficient	t	2026-04-08 11:34:12.895991
1546	386	To execute the strategy to retrieve the irrelevant data	f	2026-04-08 11:34:12.895991
1547	386	To check that the query is only syntactically correct	f	2026-04-08 11:34:12.895991
1548	387	Semantic optimization	t	2026-04-08 11:34:12.895991
1549	387	Syntactical Optimization	f	2026-04-08 11:34:12.895991
1550	387	Heuristic query optimization	f	2026-04-08 11:34:12.895991
1551	387	Cost based query optimization	f	2026-04-08 11:34:12.895991
1552	388	grant delete on table name to user1;	t	2026-04-08 11:34:12.895991
1553	388	grant on table name delete to user1	f	2026-04-08 11:34:12.895991
1554	388	grant on table name delete from user1	f	2026-04-08 11:34:12.895991
1555	388	grant delete on table name from user1;	f	2026-04-08 11:34:12.895991
1560	390	It is used to speed up querying during fetching data	t	2026-04-08 11:34:12.895991
1561	390	It is used to speed up update time than the normal update time	f	2026-04-08 11:34:12.895991
1562	390	Cannot speed up fetching time than the normal fetching time	f	2026-04-08 11:34:12.895991
1563	390	we cannot stored table keys in indexes	f	2026-04-08 11:34:12.895991
1564	391	Manual approach	f	2026-04-08 11:34:12.895991
1565	391	File-based approach	t	2026-04-08 11:34:12.895991
1566	391	Database approach	f	2026-04-08 11:34:12.895991
1567	391	all	f	2026-04-08 11:34:12.895991
1568	392	Reduce total execution time of the query	t	2026-04-08 11:34:12.895991
1569	392	increase the number of disk access	f	2026-04-08 11:34:12.895991
1570	392	increase response time of the query	f	2026-04-08 11:34:12.895991
1571	392	reduce pipelining	f	2026-04-08 11:34:12.895991
1572	393	because the view is secured	f	2026-04-08 11:34:12.895991
1573	393	because it hides unnecessary information from users	f	2026-04-08 11:34:12.895991
1574	393	because it Provides very low flexibility	f	2026-04-08 11:34:12.895991
1575	393	aggregation and summary results are computed from a base relation	t	2026-04-08 11:34:12.895991
1576	394	There is one parent in the hierarchical data model but in the network data model there will be more than one	t	2026-04-08 11:34:12.895991
1577	394	in hierarchical data model sees records as a set of members but not network data model	f	2026-04-08 11:34:12.895991
1578	394	in hierarchical data model allows no many to many relationships between entities but not network data model	f	2026-04-08 11:34:12.895991
1579	394	hierarchical data model is collection of physically linked records but not network data model	f	2026-04-08 11:34:12.895991
1580	395	Protocol	f	2026-04-08 11:34:12.895991
1581	395	Media	f	2026-04-08 11:34:12.895991
1582	395	Sender	f	2026-04-08 11:34:12.895991
1583	395	All	t	2026-04-08 11:34:12.895991
1584	396	WiFi	f	2026-04-08 11:34:12.895991
1585	396	WiMAX	t	2026-04-08 11:34:12.895991
1586	396	Internet	f	2026-04-08 11:34:12.895991
1587	396	Ad hoc network	f	2026-04-08 11:34:12.895991
1588	397	NIC	t	2026-04-08 11:34:12.895991
1589	397	Module	f	2026-04-08 11:34:12.895991
1590	397	NOS	f	2026-04-08 11:34:12.895991
1591	397	Modem	f	2026-04-08 11:34:12.895991
1592	398	IPv4 uses 32-bit addresses in dotted notations.	f	2026-04-08 11:34:12.895991
1593	398	48-bit address in colons notations	f	2026-04-08 11:34:12.895991
1594	398	IPv6 uses 128-bit addresses in hexadecimal notations	f	2026-04-08 11:34:12.895991
1595	398	MAC Address of computer can be changed	t	2026-04-08 11:34:12.895991
1596	399	Connection-oriented is faster than Connection-less	f	2026-04-08 11:34:12.895991
1597	399	Connection-oriented and Connection-less performed by the same protocol	f	2026-04-08 11:34:12.895991
1598	399	In Connection-less traffic congestion is possible	t	2026-04-08 11:34:12.895991
1599	399	In connection-oriented acknowledge is not important	f	2026-04-08 11:34:12.895991
1600	400	Security	f	2026-04-08 11:34:12.895991
1601	400	Accessibility	t	2026-04-08 11:34:12.895991
1602	400	Speed	f	2026-04-08 11:34:12.895991
1603	400	Communication	f	2026-04-08 11:34:12.895991
1608	402	Physical	t	2026-04-08 11:34:12.895991
1609	402	Network	f	2026-04-08 11:34:12.895991
1610	402	Presentation	f	2026-04-08 11:34:12.895991
1611	402	Application	f	2026-04-08 11:34:12.895991
1616	404	Physical layer	f	2026-04-08 11:34:12.895991
1617	404	Presentation layer	t	2026-04-08 11:34:12.895991
1618	404	Network layer	f	2026-04-08 11:34:12.895991
1619	404	Session layer	f	2026-04-08 11:34:12.895991
1620	405	Transport layer	f	2026-04-08 11:34:12.895991
1621	405	Data link layer	t	2026-04-08 11:34:12.895991
1622	405	Network layer	f	2026-04-08 11:34:12.895991
1623	405	Session layer	f	2026-04-08 11:34:12.895991
1624	406	Network layer	f	2026-04-08 11:34:12.895991
1625	406	Transport layer	f	2026-04-08 11:34:12.895991
1626	406	Data link layer	f	2026-04-08 11:34:12.895991
1627	406	Session layer	f	2026-04-08 11:34:12.895991
1628	407	Network layer	t	2026-04-08 11:34:12.895991
1629	407	Transport layer	f	2026-04-08 11:34:12.895991
1630	407	Data link layer	f	2026-04-08 11:34:12.895991
1631	407	Session layer	f	2026-04-08 11:34:12.895991
1632	408	Network layer	f	2026-04-08 11:34:12.895991
1633	408	Transport layer	f	2026-04-08 11:34:12.895991
1634	408	Data link layer	t	2026-04-08 11:34:12.895991
1635	408	Session layer	f	2026-04-08 11:34:12.895991
1636	409	Frame	t	2026-04-08 11:34:12.895991
1637	409	Packet	f	2026-04-08 11:34:12.895991
1638	409	Segment	f	2026-04-08 11:34:12.895991
1639	409	Data	f	2026-04-08 11:34:12.895991
1640	410	Ethernet	t	2026-04-08 11:34:12.895991
1641	410	PPP	t	2026-04-08 11:34:12.895991
1642	410	UDP	f	2026-04-08 11:34:12.895991
1643	410	SMTP	f	2026-04-08 11:34:12.895991
1644	411	TCP/IP model has 4 layers	f	2026-04-08 11:34:12.895991
1645	411	TCP/IP is developed by ARPANET	f	2026-04-08 11:34:12.895991
1646	411	OSI Model has 7 layers	f	2026-04-08 11:34:12.895991
1647	411	OSI model is support both connection-oriented and connectionless	t	2026-04-08 11:34:12.895991
1652	413	23	f	2026-04-08 11:34:12.895991
1653	413	22	t	2026-04-08 11:34:12.895991
1654	413	25	f	2026-04-08 11:34:12.895991
1655	413	80	f	2026-04-08 11:34:12.895991
1656	414	Unicast	f	2026-04-08 11:34:12.895991
1657	414	Broadcast	f	2026-04-08 11:34:12.895991
1658	414	Multicast	f	2026-04-08 11:34:12.895991
1659	414	Anycast	t	2026-04-08 11:34:12.895991
1660	415	The same name	f	2026-04-08 11:34:12.895991
1661	415	Different name	t	2026-04-08 11:34:12.895991
1662	415	Name may be special characters	f	2026-04-08 11:34:12.895991
1663	415	All	f	2026-04-08 11:34:12.895991
1664	416	In workgroup, all computers are managed by server	t	2026-04-08 11:34:12.895991
1665	416	In domain, all computers are managed by server	f	2026-04-08 11:34:12.895991
1666	416	A workgroup is not protected by a password	f	2026-04-08 11:34:12.895991
1667	416	In workgroup, all computers must be on the same local network	f	2026-04-08 11:34:12.895991
1668	417	Domain	f	2026-04-08 11:34:12.895991
1669	417	Tree	f	2026-04-08 11:34:12.895991
1670	417	Forest	f	2026-04-08 11:34:12.895991
1671	417	Domain controller	t	2026-04-08 11:34:12.895991
1672	418	Domain	f	2026-04-08 11:34:12.895991
1673	418	Tree	f	2026-04-08 11:34:12.895991
1674	418	Forest	t	2026-04-08 11:34:12.895991
1675	418	Site	f	2026-04-08 11:34:12.895991
1676	419	Trust	t	2026-04-08 11:34:12.895991
1677	419	Tree	f	2026-04-08 11:34:12.895991
1678	419	Domain	f	2026-04-08 11:34:12.895991
1679	419	Group	f	2026-04-08 11:34:12.895991
1680	420	Authentication	f	2026-04-08 11:34:12.895991
1681	420	Authorization	t	2026-04-08 11:34:12.895991
1682	420	Access control	f	2026-04-08 11:34:12.895991
1683	420	Validation	f	2026-04-08 11:34:12.895991
1684	421	Enforce password history	t	2026-04-08 11:34:12.895991
1685	421	Maximum password age	f	2026-04-08 11:34:12.895991
1686	421	Minimum password length	f	2026-04-08 11:34:12.895991
1687	421	Passwords must meet complexity requirements	f	2026-04-08 11:34:12.895991
1700	425	It available for flat topology	f	2026-04-08 11:34:12.895991
1701	425	It uses Open Shortest Path First rule	t	2026-04-08 11:34:12.895991
1702	425	Routing Information Protocol used to rout packets	f	2026-04-08 11:34:12.895991
1703	425	None	f	2026-04-08 11:34:12.895991
1704	426	RAM	f	2026-04-08 11:34:12.895991
1705	426	FLASH	f	2026-04-08 11:34:12.895991
1706	426	Non-Volatile RAM	t	2026-04-08 11:34:12.895991
1707	426	Volatile RAM	f	2026-04-08 11:34:12.895991
1712	428	Symmetric Key Cryptography	t	2026-04-08 11:34:12.895991
1713	428	Asymmetric Key Cryptography	f	2026-04-08 11:34:12.895991
1714	428	Hash Functions	f	2026-04-08 11:34:12.895991
1715	428	RMD Function	f	2026-04-08 11:34:12.895991
1716	429	Secure Shell (SSH)	f	2026-04-08 11:34:12.895991
1717	429	HyperText Transfer Protocol Secure (HTTPS)	f	2026-04-08 11:34:12.895991
1718	429	IPSec protocol	f	2026-04-08 11:34:12.895991
1719	429	All	t	2026-04-08 11:34:12.895991
1720	430	Virus	f	2026-04-08 11:34:12.895991
1721	430	Trapdoor	f	2026-04-08 11:34:12.895991
1722	430	Bacterium	f	2026-04-08 11:34:12.895991
1723	430	OpenVAS	t	2026-04-08 11:34:12.895991
1724	431	Realm trust	f	2026-04-08 11:34:12.895991
1725	431	External trust	f	2026-04-08 11:34:12.895991
1726	431	Tree-root trust	t	2026-04-08 11:34:12.895991
1727	431	Forest trust	f	2026-04-08 11:34:12.895991
1728	432	FLSM has equal interval of hosts	f	2026-04-08 11:34:12.895991
1729	432	FLSM has the same subnet mask	f	2026-04-08 11:34:12.895991
1730	432	VLSM wasted more IP address than FLSM	t	2026-04-08 11:34:12.895991
1731	432	VLSM has different subnet mask	f	2026-04-08 11:34:12.895991
1732	433	Java_class1 myObj=new Java_class1();	f	2026-04-08 11:34:12.895991
1733	433	Main myObj1=new Main();	f	2026-04-08 11:34:12.895991
1734	433	Main myObj2=new Java_class1();	f	2026-04-08 11:34:12.895991
1735	433	Java_class1 myObj3=new Main();	t	2026-04-08 11:34:12.895991
1736	434	10	f	2026-04-08 11:34:12.895991
1737	434	89	f	2026-04-08 11:34:12.895991
1738	434	Error	t	2026-04-08 11:34:12.895991
1739	434	None	f	2026-04-08 11:34:12.895991
1740	435	14	t	2026-04-08 11:34:12.895991
1167	292	92	f	2026-04-08 11:02:19.828102
1168	292	20	f	2026-04-08 11:02:19.828102
1169	292	19	t	2026-04-08 11:02:19.828102
1170	292	234	f	2026-04-08 11:02:19.828102
1171	293	Runtime error	f	2026-04-08 11:02:19.828102
1172	293	0	f	2026-04-08 11:02:19.828102
1173	293	05	f	2026-04-08 11:02:19.828102
1174	293	Compilation Error	t	2026-04-08 11:02:19.828102
1741	435	11	f	2026-04-08 11:34:12.895991
1742	435	10	f	2026-04-08 11:34:12.895991
1743	435	A & B	f	2026-04-08 11:34:12.895991
1744	436	private	f	2026-04-08 11:34:12.895991
1745	436	public	f	2026-04-08 11:34:12.895991
1746	436	default	t	2026-04-08 11:34:12.895991
1747	436	protected	f	2026-04-08 11:34:12.895991
1876	469	Minimum cost	f	2026-04-08 11:34:18.713484
1183	296	Database Diagram	f	2026-04-08 11:02:19.828102
1184	296	Relation Schema	f	2026-04-08 11:02:19.828102
1185	296	Schema Diagram	f	2026-04-08 11:02:19.828102
1186	296	ER Diagram	t	2026-04-08 11:02:19.828102
1187	297	to restrict actions available to users	f	2026-04-08 11:02:19.828102
1188	297	performed in a synchronous way	f	2026-04-08 11:02:19.828102
1189	297	to connect remote hosts via an authenticated and encrypted channel	t	2026-04-08 11:02:19.828102
1190	297	performed in real-time	f	2026-04-08 11:02:19.828102
1191	297	to restricted set of commands	f	2026-04-08 11:02:19.828102
1192	298	Abstraction	f	2026-04-08 11:02:19.828102
1193	298	Polymorphism	f	2026-04-08 11:02:19.828102
1194	298	Inheritance	f	2026-04-08 11:02:19.828102
1195	298	Encapsulation	t	2026-04-08 11:02:19.828102
1196	299	T4 Tutorials	f	2026-04-08 11:02:19.828102
1197	299	T4_Tutorials	t	2026-04-08 11:02:19.828102
1198	299	4 Tutorials	f	2026-04-08 11:02:19.828102
1199	299	T4.Tutorials	f	2026-04-08 11:02:19.828102
1200	300	onResume	f	2026-04-08 11:02:19.828102
1201	300	onDestroy	f	2026-04-08 11:02:19.828102
1202	300	onStop	f	2026-04-08 11:02:19.828102
1203	300	onCreate	t	2026-04-08 11:02:19.828102
1212	303	MessageBox.Show "Hi There","Hi"	f	2026-04-08 11:02:19.828102
1213	303	MessageBox.Show Hi There,Hi	f	2026-04-08 11:02:19.828102
1214	303	MessageBox.Show("Hi","Hi")	t	2026-04-08 11:02:19.828102
1215	303	MessageBox.Show(Hi there,Hi)	f	2026-04-08 11:02:19.828102
1216	304	AGP	f	2026-04-08 11:02:19.828102
1217	304	SATA	f	2026-04-08 11:02:19.828102
1218	304	PCI	f	2026-04-08 11:02:19.828102
1219	304	PCIe	t	2026-04-08 11:02:19.828102
1220	305	K+B(K-A-(M))	t	2026-04-08 11:02:19.828102
1221	305	K+B(K-A-(M))	f	2026-04-08 11:02:19.828102
1222	305	K-B(K-A-(M))	f	2026-04-08 11:02:19.828102
1223	305	K-A-(K-A(M))	f	2026-04-08 11:02:19.828102
1228	307	Separation of privileges	f	2026-04-08 11:02:19.828102
1229	307	Fail-safe	f	2026-04-08 11:02:19.828102
1230	307	Open design	f	2026-04-08 11:02:19.828102
1231	307	Least privileges	t	2026-04-08 11:02:19.828102
1232	308	Transport layer	f	2026-04-08 11:02:19.828102
1233	308	Internet protocol	f	2026-04-08 11:02:19.828102
1234	308	Session layer	f	2026-04-08 11:02:19.828102
1235	308	Transmission Control protocol	t	2026-04-08 11:02:19.828102
1236	309	Matching areas	f	2026-04-08 11:02:19.828102
1237	309	Matching delay metrics	f	2026-04-08 11:02:19.828102
1238	309	Matching bandwidth metrics	f	2026-04-08 11:02:19.828102
1239	309	Matching K metrics	t	2026-04-08 11:02:19.828102
1240	310	5xx	f	2026-04-08 11:02:19.828102
1241	310	1xx	f	2026-04-08 11:02:19.828102
1242	310	3xx	f	2026-04-08 11:02:19.828102
1243	310	4xx	t	2026-04-08 11:02:19.828102
1244	311	SSD	f	2026-04-08 11:02:19.828102
1245	311	eMMC	f	2026-04-08 11:02:19.828102
1246	311	DIMM	t	2026-04-08 11:02:19.828102
1247	311	HDD	f	2026-04-08 11:02:19.828102
1248	312	A encrypts message using B's private key	f	2026-04-08 11:02:19.828102
1249	312	A encrypts message using B's public key	t	2026-04-08 11:02:19.828102
1250	312	A encrypts message using his private key	f	2026-04-08 11:02:19.828102
1251	312	A encrypts message using public key	f	2026-04-08 11:02:19.828102
1256	314	Creating class, which are specific instances of objects	f	2026-04-08 11:02:19.828102
1257	314	Creating applications that manipulate or use objects	t	2026-04-08 11:02:19.828102
1258	314	Creating objects, which are blueprint for classes	f	2026-04-08 11:02:19.828102
1259	314	Creating a GUI environment for users is a natural use for object orientation	f	2026-04-08 11:02:19.828102
1260	315	$1,234.57	t	2026-04-08 11:02:19.828102
1261	315	1,234.57	f	2026-04-08 11:02:19.828102
1262	315	$1234.567	f	2026-04-08 11:02:19.828102
1263	315	$1234.57	f	2026-04-08 11:02:19.828102
1264	316	sufficiency	f	2026-04-08 11:02:19.828102
1265	316	coupling	t	2026-04-08 11:02:19.828102
1266	316	primitiveness	f	2026-04-08 11:02:19.828102
1267	316	ease of use	f	2026-04-08 11:02:19.828102
1268	317	Application layer	f	2026-04-08 11:02:19.828102
1269	317	Presentation layer	t	2026-04-08 11:02:19.828102
1270	317	Session layer	f	2026-04-08 11:02:19.828102
1271	317	Transport layer	f	2026-04-08 11:02:19.828102
1272	318	Data redundancy and inconsistency	f	2026-04-08 11:02:19.828102
1273	318	Data Separation and isolation	f	2026-04-08 11:02:19.828102
1274	318	Concurrent access anomalies	f	2026-04-08 11:02:19.828102
1275	318	Program-Data independence	t	2026-04-08 11:02:19.828102
1280	320	A backup version of the ISO utilized during the boot process is kept in NVRAM	f	2026-04-08 11:02:19.828102
1281	320	ROM contains diagnostics that are run on the hardware modules	t	2026-04-08 11:02:19.828102
1282	320	A configuration file used during the boot process is permanently stored in RAM	f	2026-04-08 11:02:19.828102
1283	320	The most recent and updated configuration files are located in the ROM	f	2026-04-08 11:02:19.828102
1284	321	H3	f	2026-04-08 11:02:19.828102
1285	321	H4	f	2026-04-08 11:02:19.828102
1286	321	H2	f	2026-04-08 11:02:19.828102
1287	321	H1	t	2026-04-08 11:02:19.828102
1288	322	The interface will remain an access link if the native VLAN is changed	f	2026-04-08 11:02:19.828102
1289	322	The interface will become a trunk if requested on the neighboring port	t	2026-04-08 11:02:19.828102
1290	322	The interface will become a trunk if the neighboring port is configured the same	f	2026-04-08 11:02:19.828102
1291	322	The interface will remain an access link if the neighboring port is configured as a trunk	f	2026-04-08 11:02:19.828102
4783	1191	To find information in one or more databases and deliver it to the user quickly and efficiently.	t	2026-05-17 09:40:45.489692
4784	1191	To store data in a database.	f	2026-05-17 09:40:45.599205
4785	1191	To create a new database.	f	2026-05-17 09:40:45.600962
4786	1191	To delete data from a database.	f	2026-05-17 09:40:45.604321
1296	324	Java programming manual	f	2026-04-08 11:02:19.828102
4787	1192	Decomposition, Optimization, Code generation, and Execution.	t	2026-05-17 09:40:45.608245
4788	1192	Decomposition, Optimization, Execution, and Storage.	f	2026-05-17 09:40:45.609341
4789	1192	Decomposition, Optimization, Code generation, and Storage.	f	2026-05-17 09:40:45.610311
4790	1192	Decomposition, Execution, Code generation, and Optimization.	f	2026-05-17 09:40:45.611247
4791	1193	To find the best plan to relational algebra.	t	2026-05-17 09:40:45.659324
4792	1193	To evaluate the query plan and get the results.	f	2026-05-17 09:40:45.659968
4793	1193	To store data in a database.	f	2026-05-17 09:40:45.660499
4794	1193	To create a new database.	f	2026-05-17 09:40:45.661075
4795	1194	Analysis, Normalization, Semantic Analysis, and Simplification.	t	2026-05-17 09:40:45.662354
4796	1194	Analysis, Normalization, Simplification, and Execution.	f	2026-05-17 09:40:45.662777
4797	1194	Analysis, Semantic Analysis, Simplification, and Normalization.	f	2026-05-17 09:40:45.663329
4798	1194	Normalization, Simplification, Analysis, and Semantic Analysis.	f	2026-05-17 09:40:45.663743
1297	324	Eclipse Editor	f	2026-04-08 11:02:19.828102
1298	324	Java Compiler	f	2026-04-08 11:02:19.828102
1299	324	Java Virtual Machine	t	2026-04-08 11:02:19.828102
1300	325	Budget management	f	2026-04-08 11:02:19.828102
1301	325	project team	t	2026-04-08 11:02:19.828102
1302	325	project plan	f	2026-04-08 11:02:19.828102
1303	325	Results	f	2026-04-08 11:02:19.828102
1304	326	Rollback	t	2026-04-08 11:02:19.828102
1305	326	Commit	f	2026-04-08 11:02:19.828102
1306	326	Flashback	f	2026-04-08 11:02:19.828102
1307	326	View	f	2026-04-08 11:02:19.828102
1308	327	script diagram	f	2026-04-08 11:02:19.828102
1309	327	interaction diagram	f	2026-04-08 11:02:19.828102
1310	327	process diagrams	t	2026-04-08 11:02:19.828102
1311	327	state transaction diagrams	f	2026-04-08 11:02:19.828102
1316	329	Router#show ip routes static	f	2026-04-08 11:02:19.828102
1317	329	Router#show ip routes	t	2026-04-08 11:02:19.828102
1318	329	Router#show ip static routes	f	2026-04-08 11:02:19.828102
1319	329	Router#show static routes	f	2026-04-08 11:02:19.828102
1320	330	<script>mystyle.css</script>	f	2026-04-08 11:02:19.828102
1321	330	<script href="myscript.js" type="text/javascript"></script>	f	2026-04-08 11:02:19.828102
1322	330	<style src="myscript.js"></style>	f	2026-04-08 11:02:19.828102
1323	330	<script src="myscript.js" type="text/javascript"></script>	t	2026-04-08 11:02:19.828102
1324	331	Querying, Scanning, Validating, parsing	f	2026-04-08 11:02:19.828102
1325	331	Querying, parsing, validating, scanning	f	2026-04-08 11:02:19.828102
1326	331	Querying, scanning, parsing, validating	t	2026-04-08 11:02:19.828102
1327	331	Querying, validating, Scanning, Parsing	f	2026-04-08 11:02:19.828102
1340	335	Aggregation	f	2026-04-08 11:02:19.828102
1341	335	Application	t	2026-04-08 11:02:19.828102
1342	335	Instantiation	f	2026-04-08 11:02:19.828102
1343	335	Association	f	2026-04-08 11:02:19.828102
1348	337	Human resources	f	2026-04-08 11:02:19.828102
1349	337	political	f	2026-04-08 11:02:19.828102
1350	337	symbolic	f	2026-04-08 11:02:19.828102
1351	337	Structure	t	2026-04-08 11:02:19.828102
1352	338	RouterA(config)#ip route 198.44.4.0 255.255.255.0 198.44.4.5	f	2026-04-08 11:02:19.828102
1353	338	RouterA(config)#ip route 198.44.4.0 255.255.255.0 fast 0/1	f	2026-04-08 11:02:19.828102
1354	338	nothing needs to be done	t	2026-04-08 11:02:19.828102
1355	338	RouterA(config)#ip route 198.44.4.0/24 fast 0/1	f	2026-04-08 11:02:19.828102
1356	339	1NF	f	2026-04-08 11:02:19.828102
1357	339	3NF	f	2026-04-08 11:02:19.828102
1358	339	BCNF	f	2026-04-08 11:02:19.828102
1359	339	2NF	t	2026-04-08 11:02:19.828102
4799	1195	(position=’manager’) ^ (City=’Addis’ ) ^ (staff.branchNo=branch.branchNo ) (Staff X Branch)	f	2026-05-17 09:40:45.664811
4800	1195	(position=’manager’) ^ (City=’Addis’)(Staff staff.branchNo=branch.branchNo Branch)	f	2026-05-17 09:40:45.665529
4801	1195	(  position =’manager’ (Staff )) staff.branchNo=branch.branchNo (  City=’Addis’(Branch))	t	2026-05-17 09:40:45.665958
4802	1195	None of the above.	f	2026-05-17 09:40:45.666378
1364	341	Router(config)# enable password secret	f	2026-04-08 11:02:19.828102
1365	341	Router(config)# service password-encryption	t	2026-04-08 11:02:19.828102
1366	341	Router(config)# service password encryption	f	2026-04-08 11:02:19.828102
1367	341	Router(config)# service-password-encryption	f	2026-04-08 11:02:19.828102
1368	342	broadcast receiver	f	2026-04-08 11:02:19.828102
1369	342	service	f	2026-04-08 11:02:19.828102
1370	342	content provider	f	2026-04-08 11:02:19.828102
1371	342	Activities	t	2026-04-08 11:02:19.828102
1376	344	No, though the first part is right the second part should be </p></b></i>	f	2026-04-08 11:02:19.828102
1377	344	No, because paragraph tags need to be right before the actual text	f	2026-04-08 11:02:19.828102
1378	344	Yes, because the tags are nested correctly	t	2026-04-08 11:02:19.828102
1379	344	No, because italic must always come before bold tags	f	2026-04-08 11:02:19.828102
1380	345	temp[0]=3;	t	2026-04-08 11:02:19.828102
1381	345	temp[3]=0;	f	2026-04-08 11:02:19.828102
1382	345	3=temp[0];	f	2026-04-08 11:02:19.828102
1383	345	temp(0)=3	f	2026-04-08 11:02:19.828102
1384	346	<p>	f	2026-04-08 11:02:19.828102
1385	346	<p:img>	f	2026-04-08 11:02:19.828102
1386	346	<img><p>	t	2026-04-08 11:02:19.828102
1387	346	<img : p>	f	2026-04-08 11:02:19.828102
1388	347	footer:p:first-child{font-size:x-small;}	f	2026-04-08 11:02:19.828102
1389	347	footer p.first-child{font-size:x-small;}	f	2026-04-08 11:02:19.828102
1390	347	footer=>p,first-child{font-size:x-small;}	f	2026-04-08 11:02:19.828102
1391	347	footer p:first-child{font-size:x-small;}	t	2026-04-08 11:02:19.828102
1392	348	Confidentiality	t	2026-04-08 11:02:19.828102
1393	348	Authentication	f	2026-04-08 11:02:19.828102
1394	348	Integrity	f	2026-04-08 11:02:19.828102
1395	348	Non-repudiation	f	2026-04-08 11:02:19.828102
1400	350	224.0.0.6	f	2026-04-08 11:02:19.828102
1401	350	224.0.0.7	f	2026-04-08 11:02:19.828102
1402	350	224.0.0.5	t	2026-04-08 11:02:19.828102
1403	350	224.0.0.4	f	2026-04-08 11:02:19.828102
1404	351	group	f	2026-04-08 11:02:19.828102
1405	351	chgrp	t	2026-04-08 11:02:19.828102
1406	351	cgrp	f	2026-04-08 11:02:19.828102
1407	351	change	f	2026-04-08 11:02:19.828102
1416	354	$_SESSION[]	f	2026-04-08 11:02:19.828102
1417	354	$_SERVER[]	t	2026-04-08 11:02:19.828102
1418	354	$_POST[]	f	2026-04-08 11:02:19.828102
1419	354	$_REQUEST[]	f	2026-04-08 11:02:19.828102
1420	355	h1.all{background-color:#FFFFF}	f	2026-04-08 11:02:19.828102
1421	355	all.h1{background-color:#FFFFF}	f	2026-04-08 11:02:19.828102
1422	355	h1{background-color:#FFFFF}	t	2026-04-08 11:02:19.828102
1423	355	All	f	2026-04-08 11:02:19.828102
1424	356	service	t	2026-04-08 11:02:19.828102
1425	356	broadcast receivers	f	2026-04-08 11:02:19.828102
1426	356	activities	f	2026-04-08 11:02:19.828102
1427	356	content provider	f	2026-04-08 11:02:19.828102
1428	357	Determining the forwarding interfaces based upon the destination MAC address and tables	f	2026-04-08 11:02:19.828102
1429	357	Learning the MAC address by examining the destination MAC addresses	t	2026-04-08 11:02:19.828102
1430	357	Repeating the electrical signal to all ports	f	2026-04-08 11:02:19.828102
1431	357	Forwarding the data based upon logical addressing	f	2026-04-08 11:02:19.828102
1432	358	urlencode()	f	2026-04-08 11:02:19.828102
1433	358	addslashes()	f	2026-04-08 11:02:19.828102
1434	358	mysql_real_escape_string()	f	2026-04-08 11:02:19.828102
1435	358	eval()	t	2026-04-08 11:02:19.828102
1436	359	Open the parent folder	f	2026-04-08 11:02:19.828102
1437	359	Go down a folder	t	2026-04-08 11:02:19.828102
1438	359	Create a folder	f	2026-04-08 11:02:19.828102
1439	359	Search a folder	f	2026-04-08 11:02:19.828102
1444	361	Only inside functions	f	2026-04-08 11:02:19.828102
1445	361	Only outside functions	f	2026-04-08 11:02:19.828102
1446	361	Anywhere except in classes	f	2026-04-08 11:02:19.828102
1447	361	Anywhere	t	2026-04-08 11:02:19.828102
1448	362	BIOS	f	2026-04-08 11:02:19.828102
1449	362	ROM	f	2026-04-08 11:02:19.828102
1450	362	Motherboard	f	2026-04-08 11:02:19.828102
1451	362	BIOS, Motherboard, and RAM	t	2026-04-08 11:02:19.828102
1752	438	the class that inherits from another class is known as superclass	t	2026-04-08 11:34:12.895991
1753	438	If you don't want other classes to inherit from a class, use the final keyword	f	2026-04-08 11:34:12.895991
1754	438	Java doesn't allow multiple inheritance	f	2026-04-08 11:34:12.895991
1755	438	the class that inherits from another class is known as child class	f	2026-04-08 11:34:12.895991
1756	439	The structured programming allows developing a program using a set of modules or functions	f	2026-04-08 11:34:12.895991
1757	439	Structured programming includes data hiding feature therefore it is more secure	f	2026-04-08 11:34:12.895991
1758	439	brings together data and functions	f	2026-04-08 11:34:12.895991
1759	439	A & C	t	2026-04-08 11:34:12.895991
1760	440	Structured programming	f	2026-04-08 11:34:12.895991
1761	440	Object oriented programming	t	2026-04-08 11:34:12.895991
1762	440	modular programming	f	2026-04-08 11:34:12.895991
1763	440	functional programming	f	2026-04-08 11:34:12.895991
1764	441	3\n2	t	2026-04-08 11:34:12.895991
1765	441	2\n3	f	2026-04-08 11:34:12.895991
1766	441	4\n3	f	2026-04-08 11:34:12.895991
1767	441	3\n4	f	2026-04-08 11:34:12.895991
1768	442	DEPARTMENT_LIST.iterator("IT");	f	2026-04-08 11:34:12.895991
1769	442	DEPARTMENT_LIST.stream("IT");	f	2026-04-08 11:34:12.895991
1770	442	DEPARTMENT_LIST.add("IT");	t	2026-04-08 11:34:12.895991
1771	442	DEPARTMENT_LIST.get("IT");	f	2026-04-08 11:34:12.895991
1776	444	NumberFormatException	f	2026-04-08 11:34:12.895991
1777	444	NullPointerException	t	2026-04-08 11:34:12.895991
1778	444	Although using exception handling is a better programming method, the above program will not through an exception	f	2026-04-08 11:34:12.895991
1779	444	IndexOutOfBoundsException	f	2026-04-08 11:34:12.895991
1780	445	POST	f	2026-04-08 11:34:12.895991
1781	445	SEND	f	2026-04-08 11:34:12.895991
1782	445	GET	t	2026-04-08 11:34:12.895991
1783	445	PUT	f	2026-04-08 11:34:12.895991
1784	446	Head, Title, HTML, body	f	2026-04-08 11:34:12.895991
1785	446	HTML, Body, Title, Head	f	2026-04-08 11:34:12.895991
1786	446	HTML, Head, Title, Body	t	2026-04-08 11:34:12.895991
1787	446	HTML, Head, Title, Body	t	2026-04-08 11:34:12.895991
1788	447	$3hello	f	2026-04-08 11:34:12.895991
1789	447	$_hello	t	2026-04-08 11:34:12.895991
1790	447	$this	f	2026-04-08 11:34:12.895991
1791	447	$5_Hello	f	2026-04-08 11:34:12.895991
1792	448	Activity performs the actions on the screen	t	2026-04-08 11:34:12.895991
1793	448	Manage the Application content	f	2026-04-08 11:34:12.895991
1794	448	Screen UI	f	2026-04-08 11:34:12.895991
1795	448	None of the above	f	2026-04-08 11:34:12.895991
1800	450	send intent()	f	2026-04-08 11:34:12.895991
1801	450	onReceive()	t	2026-04-08 11:34:12.895991
1802	450	implicitBroadcast()	f	2026-04-08 11:34:12.895991
1803	450	sendBroadcast(), sendOrderBroadcast(), and sendStickyBroadcast().	f	2026-04-08 11:34:12.895991
1804	451	Specification delays	f	2026-04-08 11:34:12.895991
1805	451	Product competition	f	2026-04-08 11:34:12.895991
1806	451	Testing	t	2026-04-08 11:34:12.895991
1807	451	Staff turnover	f	2026-04-08 11:34:12.895991
1808	452	Keeping overall costs within budget	f	2026-04-08 11:34:12.895991
1809	452	Delivering the software to the customer at the agreed time	f	2026-04-08 11:34:12.895991
1810	452	Maintaining a happy and well-functioning development team	f	2026-04-08 11:34:12.895991
1811	452	Avoiding customer complaints	t	2026-04-08 11:34:12.895991
1812	453	software design is an activity subjected to constraints	f	2026-04-08 11:34:12.895991
1813	453	software design specifies nature and composition of software product	f	2026-04-08 11:34:12.895991
1814	453	software design satisfies client needs and desires	f	2026-04-08 11:34:12.895991
1815	453	all of the mentioned	t	2026-04-08 11:34:12.895991
1816	454	Initiating, Planning, Monitoring & Controlling, Executing, and Closing.	f	2026-04-08 11:34:12.895991
1817	454	Initiating, Monitoring & controlling, Planning, Executing, and Closing	f	2026-04-08 11:34:12.895991
1818	454	Initiating, Executing, Planning, Monitoring & Controlling, and Closing	f	2026-04-08 11:34:12.895991
1819	454	Initiating, Planning, Executing, Monitoring & Controlling, and Closing	t	2026-04-08 11:34:12.895991
1820	455	To develop software	f	2026-04-08 11:34:12.895991
1821	455	To improve system efficiency	t	2026-04-08 11:34:12.895991
1822	455	To provide training to employees	f	2026-04-08 11:34:12.895991
1823	455	To monitor system performance	f	2026-04-08 11:34:12.895991
1824	456	To determine the system requirements	f	2026-04-08 11:34:12.895991
1825	456	To develop a detailed project plan	t	2026-04-08 11:34:12.895991
1826	456	To design the system	f	2026-04-08 11:34:12.895991
1827	456	To implement the system	f	2026-04-08 11:34:12.895991
1832	458	Agile	f	2026-04-08 11:34:12.895991
1833	458	Waterfall	f	2026-04-08 11:34:12.895991
1834	458	RAD (Rapid Application Development)	f	2026-04-08 11:34:12.895991
1835	458	UML (Unified Modeling Language)	t	2026-04-08 11:34:12.895991
1836	459	To depict the system inputs and outputs	f	2026-04-08 11:34:12.895991
1837	459	To depict the system processes	f	2026-04-08 11:34:12.895991
1838	459	To depict the system data and relationships	t	2026-04-08 11:34:12.895991
1839	459	To illustrate the system architecture	f	2026-04-08 11:34:12.895991
1840	460	only by extending the Thread class	f	2026-04-08 11:34:12.895991
1841	460	only by implementing the Runnable interface	f	2026-04-08 11:34:12.895991
1842	460	by extending the Runnable interface and implementing the Thread class	f	2026-04-08 11:34:12.895991
1843	460	by implementing the Runnable interface & extending the Thread class	t	2026-04-08 11:34:12.895991
1844	461	FTP	f	2026-04-08 11:34:12.895991
1845	461	TCP/IP	t	2026-04-08 11:34:12.895991
1846	461	EFT	f	2026-04-08 11:34:12.895991
1847	461	EDI	f	2026-04-08 11:34:12.895991
1848	462	Personal	f	2026-04-08 11:34:12.895991
1849	462	Web Server	f	2026-04-08 11:34:12.895991
1850	462	Sql	f	2026-04-08 11:34:12.895991
1851	462	Cute-ftp	t	2026-04-08 11:34:12.895991
1860	465	Web server	f	2026-04-08 11:34:12.895991
1861	465	Web network	f	2026-04-08 11:34:12.895991
1862	465	Web browser	t	2026-04-08 11:34:12.895991
1863	465	Web matrix	f	2026-04-08 11:34:12.895991
1864	466	! (Exclamation)	f	2026-04-08 11:34:12.895991
1865	466	$ (Dollar)	t	2026-04-08 11:34:12.895991
1866	466	& (Ampersand)	f	2026-04-08 11:34:12.895991
1867	466	# (Hash)	f	2026-04-08 11:34:12.895991
1872	468	+ (plus)	f	2026-04-08 11:34:12.895991
1873	468	* (Asterisk)	f	2026-04-08 11:34:12.895991
1874	468	. (dot)	t	2026-04-08 11:34:12.895991
1875	468	append()	f	2026-04-08 11:34:12.895991
2986	746	Method overloading is resolved at compile time	f	2026-04-08 16:44:44.130372
2987	746	Method overriding is resolved at run time	f	2026-04-08 16:44:44.130372
2988	746	Overridden methods coexist in the same class	t	2026-04-08 16:44:44.130372
2989	746	Overloaded methods have the same name but different signature	f	2026-04-08 16:44:44.130372
2994	748	The content of a static web page can only change if the source code is changed.	f	2026-04-08 16:44:44.130372
2995	748	The content of a dynamic page may change in response to users' actions.	f	2026-04-08 16:44:44.130372
2996	748	An application that collects data from users through a form and stores it in a database requires the integration of client & server-side scripts	f	2026-04-08 16:44:44.130372
2997	748	Source code of a program written in a server-side scripting language is visible on a client application such as a browser	t	2026-04-08 16:44:44.130372
2998	749	ArithmeticException	f	2026-04-08 16:44:44.130372
2999	749	OutOfMemoryError	f	2026-04-08 16:44:44.130372
3000	749	NumberFormatException	f	2026-04-08 16:44:44.130372
3001	749	NullPointerException	t	2026-04-08 16:44:44.130372
3002	750	Round Robin	f	2026-04-08 16:44:44.130372
3003	750	Priority	t	2026-04-08 16:44:44.130372
3004	750	FCFS	f	2026-04-08 16:44:44.130372
3005	750	SJF	f	2026-04-08 16:44:44.130372
3006	751	Simplex	f	2026-04-08 16:44:44.130372
3007	751	Half duplex	f	2026-04-08 16:44:44.130372
3008	751	Full duplex	t	2026-04-08 16:44:44.130372
3009	751	all except A	f	2026-04-08 16:44:44.130372
3010	752	Query execution	f	2026-04-08 16:44:44.130372
3011	752	Query plan evaluation	f	2026-04-08 16:44:44.130372
3012	752	Query optimization	t	2026-04-08 16:44:44.130372
3013	752	Query parsing	f	2026-04-08 16:44:44.130372
3022	755	Database application and the database	t	2026-04-08 16:44:44.130372
3023	755	Data and the database	f	2026-04-08 16:44:44.130372
3024	755	The user and the database application	f	2026-04-08 16:44:44.130372
3025	755	Database application and SQL	f	2026-04-08 16:44:44.130372
1877	469	Shallower	f	2026-04-08 11:34:18.713484
1878	469	Child node	f	2026-04-08 11:34:18.713484
1879	469	Deepest	t	2026-04-08 11:34:18.713484
1884	471	Animal animal = new Animal();	f	2026-04-08 11:34:18.713484
1885	471	new Animal();	f	2026-04-08 11:34:18.713484
1886	471	It is not supported to create an object of Animal	t	2026-04-08 11:34:18.713484
1887	471	Interface Animal animal = new Animal();	f	2026-04-08 11:34:18.713484
1896	474	It is also known as logical address	f	2026-04-08 11:34:18.713484
1897	474	It is used for subnetting purpose	f	2026-04-08 11:34:18.713484
1898	474	It is represented by 128 bits	f	2026-04-08 11:34:18.713484
1899	474	It is commonly assigned by the manufacturer of the NIC	t	2026-04-08 11:34:18.713484
1900	475	Scanner is a co-routine of parser	t	2026-04-08 11:34:18.713484
1901	475	Lexical analyzer works on simple recursive constructs a language	f	2026-04-08 11:34:18.713484
1902	475	Syntax analyzer works on simple none recursive constructs a language	f	2026-04-08 11:34:18.713484
1903	475	Syntax analyzer is a co-routine of lexical analyzer	f	2026-04-08 11:34:18.713484
1908	477	Domain	f	2026-04-08 11:34:18.713484
1909	477	Domain controller	f	2026-04-08 11:34:18.713484
1910	477	Global Catalog	t	2026-04-08 11:34:18.713484
1911	477	Sites	f	2026-04-08 11:34:18.713484
1912	478	Inheritance	f	2026-04-08 11:34:18.713484
1913	478	Encapsulation	t	2026-04-08 11:34:18.713484
1914	478	Polymorphism	f	2026-04-08 11:34:18.713484
1915	478	Abstraction	f	2026-04-08 11:34:18.713484
1920	480	*, +, .	f	2026-04-08 11:34:18.713484
1921	480	., *, +	f	2026-04-08 11:34:18.713484
1922	480	*, ., +	f	2026-04-08 11:34:18.713484
1923	480	+, ., *	t	2026-04-08 11:34:18.713484
1924	481	Testing	f	2026-04-08 11:34:18.713484
1925	481	Modeling	f	2026-04-08 11:34:18.713484
1926	481	Data acquisition	t	2026-04-08 11:34:18.713484
1927	481	Data representation	f	2026-04-08 11:34:18.713484
1928	482	6 grammar symbols	t	2026-04-08 11:34:18.713484
1929	482	2 grammar symbols	f	2026-04-08 11:34:18.713484
1930	482	1 grammar symbols	f	2026-04-08 11:34:18.713484
1931	482	3 grammar symbols	f	2026-04-08 11:34:18.713484
1932	483	int	f	2026-04-08 11:34:18.713484
1933	483	short	f	2026-04-08 11:34:18.713484
1934	483	char	f	2026-04-08 11:34:18.713484
1935	483	double	t	2026-04-08 11:34:18.713484
1936	484	PID of child process	t	2026-04-08 11:34:18.713484
1937	484	Local variables	f	2026-04-08 11:34:18.713484
1938	484	Return addresses	f	2026-04-08 11:34:18.713484
1939	484	Function parameters	f	2026-04-08 11:34:18.713484
1940	485	RMI	f	2026-04-08 11:34:18.713484
1941	485	DOM	t	2026-04-08 11:34:18.713484
1942	485	MVC	f	2026-04-08 11:34:18.713484
1943	485	RPC	f	2026-04-08 11:34:18.713484
1944	486	Separation	f	2026-04-08 11:34:18.713484
1945	486	Confidentiality	f	2026-04-08 11:34:18.713484
1946	486	Authentication	t	2026-04-08 11:34:18.713484
1947	486	Integrity	f	2026-04-08 11:34:18.713484
1952	488	alert.window("Welcome JS");	f	2026-04-08 11:34:18.713484
1953	488	window("<alert>Welcome JS</alert>");	f	2026-04-08 11:34:18.713484
1954	488	window("alert = \\"Welcome JS\\"");	f	2026-04-08 11:34:18.713484
1955	488	window.alert("Welcome JS");	t	2026-04-08 11:34:18.713484
1956	489	O(logn)	f	2026-04-08 11:34:18.713484
1957	489	O(nlogn)	f	2026-04-08 11:34:18.713484
1958	489	O(1)	t	2026-04-08 11:34:18.713484
1959	489	O(n)	f	2026-04-08 11:34:18.713484
1960	490	Malware	f	2026-04-08 11:34:18.713484
1961	490	Denial of Service	f	2026-04-08 11:34:18.713484
1962	490	AES	t	2026-04-08 11:34:18.713484
1963	490	Man in the Middle	f	2026-04-08 11:34:18.713484
1964	491	Administrator	t	2026-04-08 11:34:18.713484
1965	491	Transmission media	f	2026-04-08 11:34:18.713484
1966	491	Sender	f	2026-04-08 11:34:18.713484
1967	491	Protocol	f	2026-04-08 11:34:18.713484
1972	493	Session	f	2026-04-08 11:34:18.713484
1973	493	Style declarations	f	2026-04-08 11:34:18.713484
1974	493	Text Editors	f	2026-04-08 11:34:18.713484
1975	493	Cascading Style Sheets	t	2026-04-08 11:34:18.713484
1976	494	Elements in an array cannot be sorted	f	2026-04-08 11:34:18.713484
1977	494	Index of first element of an array is 1	f	2026-04-08 11:34:18.713484
1978	494	Objects of mixed data types can be stored	f	2026-04-08 11:34:18.713484
1979	494	Easier to store elements of same data type	t	2026-04-08 11:34:18.713484
1980	495	b*a*	t	2026-04-08 11:34:18.713484
1981	495	(a*b*)*	f	2026-04-08 11:34:18.713484
1982	495	a*b+	f	2026-04-08 11:34:18.713484
1983	495	a*b*	f	2026-04-08 11:34:18.713484
1984	496	Handle to events, errors and exceptions	f	2026-04-08 11:34:18.713484
1985	496	to validate data	f	2026-04-08 11:34:18.713484
1986	496	to access database data and file system	t	2026-04-08 11:34:18.713484
1987	496	to manipulate HTML elements	f	2026-04-08 11:34:18.713484
1988	497	14	f	2026-04-08 11:34:18.713484
1989	497	14.8	f	2026-04-08 11:34:18.713484
1990	497	15	f	2026-04-08 11:34:18.713484
1991	497	13	t	2026-04-08 11:34:18.713484
1992	498	$_POST['text']	f	2026-04-08 11:34:18.713484
1993	498	$_GET['email']	f	2026-04-08 11:34:18.713484
1994	498	$_SESSION['text']	f	2026-04-08 11:34:18.713484
1995	498	$_POST['email']	t	2026-04-08 11:34:18.713484
2000	500	The symbols used are 0 and 1	f	2026-04-08 11:34:18.713484
2001	500	It positional weighted number	f	2026-04-08 11:34:18.713484
2002	500	it also used as a machine language	f	2026-04-08 11:34:18.713484
2003	500	The base is 3	t	2026-04-08 11:34:18.713484
2004	501	Threat	f	2026-04-08 11:34:18.713484
2005	501	Exploit	f	2026-04-08 11:34:18.713484
2006	501	Attack	t	2026-04-08 11:34:18.713484
2007	501	Vulnerability	f	2026-04-08 11:34:18.713484
2012	503	DNS Start of Authority Record	f	2026-04-08 11:34:18.713484
2013	503	DNS A Record	t	2026-04-08 11:34:18.713484
2014	503	DNS NS Record	f	2026-04-08 11:34:18.713484
2015	503	DNS PTR Record	f	2026-04-08 11:34:18.713484
2016	504	LONG	f	2026-04-08 11:34:18.713484
2017	504	CHAR	t	2026-04-08 11:34:18.713484
2018	504	VARCHAR2	f	2026-04-08 11:34:18.713484
2019	504	NUMBER	f	2026-04-08 11:34:18.713484
4883	1216	To assign IP addresses to devices	f	2026-05-17 13:29:36.022309
4884	1216	To translate human-readable domain names into numerical IP addresses	t	2026-05-17 13:29:36.024248
2032	508	T Q O P S R	f	2026-04-08 11:34:18.713484
2033	508	T Q O P S R	t	2026-04-08 11:34:18.713484
2034	508	T Q R S O P	f	2026-04-08 11:34:18.713484
2035	508	T O Q R P S	f	2026-04-08 11:34:18.713484
2036	509	Type 1 language	f	2026-04-08 11:34:18.713484
2037	509	Type 2 language	f	2026-04-08 11:34:18.713484
2038	509	Type 3 language	t	2026-04-08 11:34:18.713484
2039	509	Type 0 language	f	2026-04-08 11:34:18.713484
2040	510	+ab	f	2026-04-08 11:34:18.713484
2041	510	abc+*	f	2026-04-08 11:34:18.713484
2042	510	(a + b)*(c + d)	t	2026-04-08 11:34:18.713484
2043	510	ab + c*	f	2026-04-08 11:34:18.713484
2044	511	Stack	t	2026-04-08 11:34:18.713484
2045	511	Array	f	2026-04-08 11:34:18.713484
2046	511	Queue	f	2026-04-08 11:34:18.713484
2047	511	Tree	f	2026-04-08 11:34:18.713484
2048	512	The query will not work - an error is generated	f	2026-04-08 11:34:18.713484
2049	512	All records in each table are associated with all records in the other tables	t	2026-04-08 11:34:18.713484
2050	512	The foreign keys in each table are linked to the primary keys in the other tables	f	2026-04-08 11:34:18.713484
2051	512	The primary keys in each table are joined together	f	2026-04-08 11:34:18.713484
2052	513	Programs	f	2026-04-08 11:34:18.713484
2053	513	Virus	f	2026-04-08 11:34:18.713484
2054	513	Botnets	t	2026-04-08 11:34:18.713484
2055	513	Worms	f	2026-04-08 11:34:18.713484
2056	514	Initially the stack contains $ and starting none terminal of the grammar	t	2026-04-08 11:34:18.713484
2057	514	The parsing is successful if the stack is left with $ and the starting symbol of the grammar and the input buffer is left with $	f	2026-04-08 11:34:18.713484
2058	514	$ is used to mark the bottom of the stack and the right end of the input buffer	f	2026-04-08 11:34:18.713484
2059	514	The parser repeats shifting and reducing actions until the stack is empty or an error is happened	f	2026-04-08 11:34:18.713484
4885	1216	To manage port numbers for applications	f	2026-05-17 13:29:36.02596
4886	1216	To enable two-way communication between programs	f	2026-05-17 13:29:36.027378
4887	1217	To identify a specific device on a network	f	2026-05-17 13:29:36.030032
4888	1217	To identify a specific application or service on a host	t	2026-05-17 13:29:36.031144
2064	516	Router	t	2026-04-08 11:34:18.713484
2065	516	Bridge	f	2026-04-08 11:34:18.713484
2066	516	Switch	f	2026-04-08 11:34:18.713484
2067	516	Hub	f	2026-04-08 11:34:18.713484
2068	517	Input	f	2026-04-08 11:34:18.713484
2069	517	Intermediate state	f	2026-04-08 11:34:18.713484
2070	517	Initial state	f	2026-04-08 11:34:18.713484
2071	517	Goal	t	2026-04-08 11:34:18.713484
4889	1217	To enable two-way communication between programs	f	2026-05-17 13:29:36.032369
4890	1217	To assign IP addresses to devices	f	2026-05-17 13:29:36.033779
4891	1218	Stream sockets are connection-oriented, while datagram sockets are connectionless	t	2026-05-17 13:29:36.035893
4892	1218	Stream sockets are connectionless, while datagram sockets are connection-oriented	f	2026-05-17 13:29:36.036757
2076	519	Car golf = new Car("Volkswagen","Golf","green");	f	2026-04-08 11:34:18.713484
2077	519	new Car("Volkswagen","Golf","green");	f	2026-04-08 11:34:18.713484
2078	519	Car focus = new Car("Ford","Focus","red");	f	2026-04-08 11:34:18.713484
2079	519	Car auris = new Car("Toyota","Auris");	t	2026-04-08 11:34:18.713484
2080	520	DFS	f	2026-04-08 11:34:18.713484
2081	520	BFS	f	2026-04-08 11:34:18.713484
2082	520	Uninformed searching techniques	f	2026-04-08 11:34:18.713484
2083	520	Informed Searching	t	2026-04-08 11:34:18.713484
4893	1218	Stream sockets are used for TCP, while datagram sockets are used for UDP	f	2026-05-17 13:29:36.037562
4894	1218	Stream sockets are used for UDP, while datagram sockets are used for TCP	f	2026-05-17 13:29:36.03872
4895	1219	To provide a set of classes for working with files and directories	f	2026-05-17 13:29:36.041226
4896	1219	To provide a set of classes for working with network applications	t	2026-05-17 13:29:36.042015
4897	1219	To provide a set of classes for working with databases	f	2026-05-17 13:29:36.060117
4898	1219	To provide a set of classes for working with graphics	f	2026-05-17 13:29:36.060944
2092	523	Trusted applet	f	2026-04-08 11:34:18.713484
2093	523	Untrusted applet	f	2026-04-08 11:34:18.713484
2094	523	Sandboxes	t	2026-04-08 11:34:18.713484
2095	523	Interpreter	f	2026-04-08 11:34:18.713484
2096	524	Trojan	t	2026-04-08 11:34:18.713484
2097	524	port scanning	f	2026-04-08 11:34:18.713484
2098	524	Worm	f	2026-04-08 11:34:18.713484
2099	524	denial of service	f	2026-04-08 11:34:18.713484
2100	525	It is possible to override the move() method in Lion class.	t	2026-04-08 11:34:18.713484
2101	525	The sound() method in the super class must be implemented in the subclass Lion	f	2026-04-08 11:34:18.713484
2102	525	The eat() method defined in Animal class is not supported	f	2026-04-08 11:34:18.713484
2103	525	It is must for the subclass to have at least one constructor.	f	2026-04-08 11:34:18.713484
4899	1220	To provide a way to work with IP addresses and host names	t	2026-05-17 13:29:36.062309
2108	527	FILE is a keyword in C for representing files and fp is a variable of FILE type.	f	2026-04-08 11:34:18.713484
2109	527	FILE is a buffered stream	f	2026-04-08 11:34:18.713484
2110	527	FILE is a structure and fp is a pointer to the structure of FILE type	t	2026-04-08 11:34:18.713484
2111	527	FILE is a stream	f	2026-04-08 11:34:18.713484
2112	528	A function that is expanded at each call during execution	t	2026-04-08 11:34:18.713484
2113	528	A function that is not checked for semantic analysis	f	2026-04-08 11:34:18.713484
2114	528	A function that is called during compile time	f	2026-04-08 11:34:18.713484
2115	528	A function that is not checked for syntax errors	f	2026-04-08 11:34:18.713484
2116	529	Node list	f	2026-04-08 11:34:18.713484
2117	529	Primitive list	f	2026-04-08 11:34:18.713484
2118	529	Linked list	t	2026-04-08 11:34:18.713484
2119	529	Unordered list	f	2026-04-08 11:34:18.713484
4900	1220	To provide a way to work with port numbers and sockets	f	2026-05-17 13:29:36.063043
4901	1220	To provide a way to work with files and directories	f	2026-05-17 13:29:36.063758
4902	1220	To provide a way to work with databases	f	2026-05-17 13:29:36.064368
4903	1221	To create client sockets	f	2026-05-17 13:29:36.065811
2124	531	1	f	2026-04-08 11:34:18.713484
2125	531	0	f	2026-04-08 11:34:18.713484
2126	531	Any RAID level	f	2026-04-08 11:34:18.713484
2127	531	0+1	t	2026-04-08 11:34:18.713484
2128	532	192.168.1.248	f	2026-04-08 11:34:18.713484
2129	532	224.1.120.29	f	2026-04-08 11:34:18.713484
2130	532	172.12.12.48	t	2026-04-08 11:34:18.713484
2131	532	121.12.12.8	f	2026-04-08 11:34:18.713484
2132	533	FOR EACH ROW trigger on the AUDIT_TABLE table.	f	2026-04-08 11:34:18.713484
2133	533	Statement-level trigger on the EMPLOYEES table.	f	2026-04-08 11:34:18.713484
2134	533	FOR EACH ROW trigger on the EMPLOYEES table.	t	2026-04-08 11:34:18.713484
2135	533	Statement-level trigger on the AUDIT_TABLE table.	f	2026-04-08 11:34:18.713484
2136	534	MBR	t	2026-04-08 11:34:18.713484
2137	534	Partition	f	2026-04-08 11:34:18.713484
2138	534	Bootblock	f	2026-04-08 11:34:18.713484
2139	534	Superblock	f	2026-04-08 11:34:18.713484
2140	535	Address register	f	2026-04-08 11:34:18.713484
2141	535	Accumulator	f	2026-04-08 11:34:18.713484
2142	535	data register	f	2026-04-08 11:34:18.713484
2143	535	Program counter	t	2026-04-08 11:34:18.713484
2144	536	Operation translation	f	2026-04-08 11:34:18.713484
2145	536	memory transfer	f	2026-04-08 11:34:18.713484
2146	536	Register transfer	t	2026-04-08 11:34:18.713484
2147	536	common bus system	f	2026-04-08 11:34:18.713484
2148	537	computer specification	f	2026-04-08 11:34:18.713484
2149	537	computer application	f	2026-04-08 11:34:18.713484
2150	537	Computer architecture	t	2026-04-08 11:34:18.713484
2151	537	Computer organization	f	2026-04-08 11:34:18.713484
2152	538	Unify single transitions to multi transitions that contains union of input	t	2026-04-08 11:34:18.713484
2153	538	Unifying all the final states into one using e-transitions	f	2026-04-08 11:34:18.713484
2154	538	Get the resulting regular expression by direct calculation	f	2026-04-08 11:34:18.713484
2155	538	Remove states until there is only starting and accepting states	f	2026-04-08 11:34:18.713484
4904	1221	To create server sockets for connection-oriented communication	t	2026-05-17 13:29:36.066746
4905	1221	To work with datagram sockets	f	2026-05-17 13:29:36.067515
4906	1221	To work with stream sockets	f	2026-05-17 13:29:36.068264
4907	1222	To close the server socket	f	2026-05-17 13:29:36.069738
4908	1222	To wait for a connection request and return a Socket object	t	2026-05-17 13:29:36.070373
4909	1222	To get the input stream of the server socket	f	2026-05-17 13:29:36.071081
4910	1222	To get the output stream of the server socket	f	2026-05-17 13:29:36.071918
4911	1223	To create server sockets	f	2026-05-17 13:29:36.074044
2164	541	Primary key	f	2026-04-08 11:34:18.713484
2165	541	Index	t	2026-04-08 11:34:18.713484
2166	541	Stored procedure	f	2026-04-08 11:34:18.713484
2167	541	Default	f	2026-04-08 11:34:18.713484
2168	542	Unit testing	f	2026-04-08 11:34:18.713484
2169	542	Performance testing	f	2026-04-08 11:34:18.713484
2170	542	Security testing	f	2026-04-08 11:34:18.713484
2171	542	Stress testing	t	2026-04-08 11:34:18.713484
2172	542	Recovery testing	f	2026-04-08 11:34:18.713484
4912	1223	To create client sockets for connection-oriented communication	t	2026-05-17 13:29:36.074768
4913	1223	To work with datagram sockets	f	2026-05-17 13:29:36.075403
4914	1223	To work with stream sockets	f	2026-05-17 13:29:36.076077
4915	1224	To get the output stream of the socket	f	2026-05-17 13:29:36.077947
2177	544	2	t	2026-04-08 11:34:18.713484
2178	544	4	f	2026-04-08 11:34:18.713484
2179	544	3	f	2026-04-08 11:34:18.713484
2180	544	1	f	2026-04-08 11:34:18.713484
2181	545	Use case modeling	t	2026-04-08 11:34:18.713484
2182	545	Class diagram	f	2026-04-08 11:34:18.713484
2183	545	Sequence diagram	f	2026-04-08 11:34:18.713484
2184	545	State diagram	f	2026-04-08 11:34:18.713484
2185	546	A spanning tree will have n-1 vertices, if the original graph has n-number of vertices.	f	2026-04-08 11:34:18.713484
2186	546	A spanning tree will have n+1 edge, if the original graph has n-number of vertices.	f	2026-04-08 11:34:18.713484
2187	546	A spanning tree will have n edges, if the original graph has n-number of vertices.	f	2026-04-08 11:34:18.713484
2188	546	A spanning tree will have n-1 edges, if the original graph has n-number of vertices.	t	2026-04-08 11:34:18.713484
4916	1224	To get the input stream of the socket	t	2026-05-17 13:29:36.078607
4917	1224	To close the socket	f	2026-05-17 13:29:36.079229
4918	1224	To connect to a server	f	2026-05-17 13:29:36.07987
4919	1225	To get the IP address of a device	f	2026-05-17 13:29:36.081174
4920	1225	To get the host name of a device	f	2026-05-17 13:29:36.08177
4921	1225	To create an InetAddress object from a host name or IP address	t	2026-05-17 13:29:36.08236
4922	1225	To close an InetAddress object	f	2026-05-17 13:29:36.083005
2197	549	Network load balancing manager	f	2026-04-08 11:34:18.713484
2198	549	Group policy management	f	2026-04-08 11:34:18.713484
2199	549	Organizational Unit	t	2026-04-08 11:34:18.713484
2200	549	Container	f	2026-04-08 11:34:18.713484
2201	550	decoder	f	2026-04-08 11:34:18.713484
2202	550	multiplexer	f	2026-04-08 11:34:18.713484
2203	550	Full adder	f	2026-04-08 11:34:18.713484
2204	550	Half adder	t	2026-04-08 11:34:18.713484
2209	552	XP	f	2026-04-08 11:34:18.713484
2210	552	Scrum	f	2026-04-08 11:34:18.713484
2211	552	Prototyping	f	2026-04-08 11:34:18.713484
2212	552	Waterfall model	t	2026-04-08 11:34:18.713484
2217	554	Create a trigger to identify when data is added and query the new data.	f	2026-04-08 11:34:18.713484
2218	554	Create a view that joins data from both tables.	t	2026-04-08 11:34:18.713484
2219	554	Create indexes on the two tables based on the date and query the tables individually.	f	2026-04-08 11:34:18.713484
2220	554	Combine the data into a single table and query it.	f	2026-04-08 11:34:18.713484
2225	556	Cyber Attack	t	2026-04-08 11:34:18.713484
2226	556	Digital crime	f	2026-04-08 11:34:18.713484
2227	556	System hijacking	f	2026-04-08 11:34:18.713484
2228	556	Threats	f	2026-04-08 11:34:18.713484
2229	557	MiTM attack	f	2026-04-08 11:34:18.713484
2230	557	Phishing attack	t	2026-04-08 11:34:18.713484
2231	557	Website attack	f	2026-04-08 11:34:18.713484
2232	557	DoS attack	f	2026-04-08 11:34:18.713484
2241	560	External	t	2026-04-08 11:34:18.713484
2242	560	Conceptual	f	2026-04-08 11:34:18.713484
2243	560	Internal	f	2026-04-08 11:34:18.713484
2244	560	Physical	f	2026-04-08 11:34:18.713484
2245	561	An interface can create an object of its own	t	2026-04-08 11:34:18.713484
2246	561	Interface is used to achieve full abstraction, loss coupling and multiple inheritance	f	2026-04-08 11:34:18.713484
2247	561	The default variable modifiers in an interface are public, static and final	f	2026-04-08 11:34:18.713484
2248	561	Methods in an interface are abstract, and public by default	f	2026-04-08 11:34:18.713484
2253	563	/bin/.	f	2026-04-08 11:34:29.136225
2254	563	/root/.	f	2026-04-08 11:34:29.136225
2255	563	/dev/.	f	2026-04-08 11:34:29.136225
2256	563	/etc/.	t	2026-04-08 11:34:29.136225
2257	564	92	f	2026-04-08 11:34:29.136225
2258	564	20	f	2026-04-08 11:34:29.136225
2259	564	19	t	2026-04-08 11:34:29.136225
2260	564	234	f	2026-04-08 11:34:29.136225
2261	565	Runtime error	f	2026-04-08 11:34:29.136225
2262	565	0	f	2026-04-08 11:34:29.136225
2263	565	05	f	2026-04-08 11:34:29.136225
2264	565	Compilation Error	t	2026-04-08 11:34:29.136225
2265	566	IntelliJ IDEA	f	2026-04-08 11:34:29.136225
2266	566	Android SDK tools and platform tools	f	2026-04-08 11:34:29.136225
2267	566	A system image for the Android emulator	f	2026-04-08 11:34:29.136225
2268	566	Android SDK	t	2026-04-08 11:34:29.136225
2269	567	cat	t	2026-04-08 11:34:29.136225
2270	567	vi	f	2026-04-08 11:34:29.136225
2271	567	ed	f	2026-04-08 11:34:29.136225
2272	567	lyrix	f	2026-04-08 11:34:29.136225
2273	568	Database Diagram	f	2026-04-08 11:34:29.136225
2274	568	Relation Schema	f	2026-04-08 11:34:29.136225
2275	568	Schema Diagram	f	2026-04-08 11:34:29.136225
2276	568	ER Diagram	t	2026-04-08 11:34:29.136225
2277	569	to restrict actions available to users	f	2026-04-08 11:34:29.136225
2278	569	performed in a synchronous way	f	2026-04-08 11:34:29.136225
2279	569	to connect remote hosts via an authenticated and encrypted channel	t	2026-04-08 11:34:29.136225
2280	569	performed in real-time	f	2026-04-08 11:34:29.136225
2281	569	to restricted set of commands	f	2026-04-08 11:34:29.136225
2286	571	T4 Tutorials	f	2026-04-08 11:34:29.136225
2287	571	T4_Tutorials	t	2026-04-08 11:34:29.136225
2288	571	4 Tutorials	f	2026-04-08 11:34:29.136225
2289	571	T4.Tutorials	f	2026-04-08 11:34:29.136225
2294	573	Thermal paste	f	2026-04-08 11:34:29.136225
2295	573	Heat sink	t	2026-04-08 11:34:29.136225
2296	573	Superglue	f	2026-04-08 11:34:29.136225
2297	573	Fan	f	2026-04-08 11:34:29.136225
2298	574	Telnet	f	2026-04-08 11:34:29.136225
2299	574	In-band	t	2026-04-08 11:34:29.136225
2300	574	SSH	f	2026-04-08 11:34:29.136225
2301	574	MAC	f	2026-04-08 11:34:29.136225
2302	575	MessageBox.Show "Hi There","Hi"	f	2026-04-08 11:34:29.136225
2303	575	MessageBox.Show Hi There,Hi	f	2026-04-08 11:34:29.136225
2304	575	MessageBox.Show("Hi","Hi")	t	2026-04-08 11:34:29.136225
2305	575	MessageBox.Show(Hi there,Hi)	f	2026-04-08 11:34:29.136225
2306	576	AGP	f	2026-04-08 11:34:29.136225
2307	576	SATA	f	2026-04-08 11:34:29.136225
2308	576	PCI	f	2026-04-08 11:34:29.136225
2309	576	PCIe	t	2026-04-08 11:34:29.136225
2314	578	Hybrid approach	f	2026-04-08 11:34:29.136225
2315	578	Activity-based approach	t	2026-04-08 11:34:29.136225
2316	578	Product-based approach	f	2026-04-08 11:34:29.136225
2317	578	Project execution	f	2026-04-08 11:34:29.136225
2318	579	Separation of privileges	f	2026-04-08 11:34:29.136225
2319	579	Fail-safe	f	2026-04-08 11:34:29.136225
2320	579	Open design	f	2026-04-08 11:34:29.136225
2321	579	Least privileges	t	2026-04-08 11:34:29.136225
2322	580	Transport layer	f	2026-04-08 11:34:29.136225
2323	580	Internet protocol	f	2026-04-08 11:34:29.136225
2324	580	Session layer	f	2026-04-08 11:34:29.136225
2325	580	Transmission Control protocol	t	2026-04-08 11:34:29.136225
2326	581	Matching areas	f	2026-04-08 11:34:29.136225
2327	581	Matching delay metrics	f	2026-04-08 11:34:29.136225
2328	581	Matching bandwidth metrics	f	2026-04-08 11:34:29.136225
2329	581	Matching K metrics	t	2026-04-08 11:34:29.136225
2330	582	5xx	f	2026-04-08 11:34:29.136225
2331	582	1xx	f	2026-04-08 11:34:29.136225
2332	582	3xx	f	2026-04-08 11:34:29.136225
2333	582	4xx	t	2026-04-08 11:34:29.136225
2334	583	SSD	f	2026-04-08 11:34:29.136225
2335	583	eMMC	f	2026-04-08 11:34:29.136225
2336	583	DIMM	t	2026-04-08 11:34:29.136225
2337	583	HDD	f	2026-04-08 11:34:29.136225
2338	584	A encrypts message using B's private key	f	2026-04-08 11:34:29.136225
2339	584	A encrypts message using B's public key	t	2026-04-08 11:34:29.136225
2340	584	A encrypts message using his private key	f	2026-04-08 11:34:29.136225
2341	584	A encrypts message using public key	f	2026-04-08 11:34:29.136225
2342	585	ext2	t	2026-04-08 11:34:29.136225
2343	585	ext3	f	2026-04-08 11:34:29.136225
2344	585	ext	f	2026-04-08 11:34:29.136225
2345	585	minix	f	2026-04-08 11:34:29.136225
2346	586	Creating class, which are specific instances of objects	f	2026-04-08 11:34:29.136225
2347	586	Creating applications that manipulate or use objects	t	2026-04-08 11:34:29.136225
2348	586	Creating objects, which are blueprint for classes	f	2026-04-08 11:34:29.136225
2349	586	Creating a GUI environment for users is a natural use for object orientation	f	2026-04-08 11:34:29.136225
2350	587	$1,234.57	t	2026-04-08 11:34:29.136225
2351	587	1,234.57	f	2026-04-08 11:34:29.136225
2352	587	$1234.567	f	2026-04-08 11:34:29.136225
2353	587	$1234.57	f	2026-04-08 11:34:29.136225
2354	588	sufficiency	f	2026-04-08 11:34:29.136225
2355	588	coupling	t	2026-04-08 11:34:29.136225
2356	588	primitiveness	f	2026-04-08 11:34:29.136225
2357	588	ease of use	f	2026-04-08 11:34:29.136225
2362	590	Data redundancy and inconsistency	f	2026-04-08 11:34:29.136225
2363	590	Data Separation and isolation	f	2026-04-08 11:34:29.136225
2364	590	Concurrent access anomalies	f	2026-04-08 11:34:29.136225
2365	590	Program-Data independence	t	2026-04-08 11:34:29.136225
2370	592	A backup version of the ISO utilized during the boot process is kept in NVRAM	f	2026-04-08 11:34:29.136225
2371	592	ROM contains diagnostics that are run on the hardware modules	t	2026-04-08 11:34:29.136225
2372	592	A configuration file used during the boot process is permanently stored in RAM	f	2026-04-08 11:34:29.136225
2373	592	The most recent and updated configuration files are located in the ROM	f	2026-04-08 11:34:29.136225
2374	593	H3	f	2026-04-08 11:34:29.136225
2375	593	H4	f	2026-04-08 11:34:29.136225
2376	593	H2	f	2026-04-08 11:34:29.136225
2377	593	H1	t	2026-04-08 11:34:29.136225
2378	594	The interface will remain an access link if the native VLAN is changed	f	2026-04-08 11:34:29.136225
2379	594	The interface will become a trunk if requested on the neighboring port	t	2026-04-08 11:34:29.136225
2380	594	The interface will become a trunk if the neighboring port is configured the same	f	2026-04-08 11:34:29.136225
2381	594	The interface will remain an access link if the neighboring port is configured as a trunk	f	2026-04-08 11:34:29.136225
2382	595	Link-state protocols require routers to maintain their own topology database of the network	f	2026-04-08 11:34:29.136225
2383	595	Link-state protocols share the topology database between all routers	t	2026-04-08 11:34:29.136225
2384	595	Link-state protocols use multiple routes to the same destination	f	2026-04-08 11:34:29.136225
2385	595	Link-state protocols allow routers to maintain a link-state database of all routers	f	2026-04-08 11:34:29.136225
2386	596	Java programming manual	f	2026-04-08 11:34:29.136225
2387	596	Eclipse Editor	f	2026-04-08 11:34:29.136225
2388	596	Java Compiler	f	2026-04-08 11:34:29.136225
2389	596	Java Virtual Machine	t	2026-04-08 11:34:29.136225
2394	598	Rollback	t	2026-04-08 11:34:29.136225
2395	598	Commit	f	2026-04-08 11:34:29.136225
2396	598	Flashback	f	2026-04-08 11:34:29.136225
2397	598	View	f	2026-04-08 11:34:29.136225
2402	600	import	f	2026-04-08 11:34:29.136225
2403	600	shadows	t	2026-04-08 11:34:29.136225
2404	600	class	f	2026-04-08 11:34:29.136225
2405	600	collector	f	2026-04-08 11:34:29.136225
2406	601	Router#show ip routes static	f	2026-04-08 11:34:29.136225
2407	601	Router#show ip routes	t	2026-04-08 11:34:29.136225
2408	601	Router#show ip static routes	f	2026-04-08 11:34:29.136225
2409	601	Router#show static routes	f	2026-04-08 11:34:29.136225
2414	603	Querying, Scanning, Validating, parsing	f	2026-04-08 11:34:29.136225
2415	603	Querying, parsing, validating, scanning	f	2026-04-08 11:34:29.136225
2416	603	Querying, scanning, parsing, validating	t	2026-04-08 11:34:29.136225
2417	603	Querying, validating, Scanning, Parsing	f	2026-04-08 11:34:29.136225
2418	604	Case "Admas"	f	2026-04-08 11:34:29.136225
2419	604	Case "739"	f	2026-04-08 11:34:29.136225
2420	604	Case (myCar.Substring(0,1))	t	2026-04-08 11:34:29.136225
2421	604	Case myVar.Length	f	2026-04-08 11:34:29.136225
2422	605	C++	f	2026-04-08 11:34:29.136225
2423	605	Assembly language	f	2026-04-08 11:34:29.136225
2424	605	Fortran	f	2026-04-08 11:34:29.136225
2425	605	C	t	2026-04-08 11:34:29.136225
2426	606	New malloc	f	2026-04-08 11:34:29.136225
2427	606	new	t	2026-04-08 11:34:29.136225
2428	606	malloc	f	2026-04-08 11:34:29.136225
2429	606	alloc	f	2026-04-08 11:34:29.136225
2430	607	Aggregation	f	2026-04-08 11:34:29.136225
2431	607	Application	t	2026-04-08 11:34:29.136225
2432	607	Instantiation	f	2026-04-08 11:34:29.136225
2433	607	Association	f	2026-04-08 11:34:29.136225
2434	608	checksum	f	2026-04-08 11:34:29.136225
2435	608	Source port	f	2026-04-08 11:34:29.136225
2436	608	Window	t	2026-04-08 11:34:29.136225
2437	608	Application layer data	f	2026-04-08 11:34:29.136225
2438	609	Human resources	f	2026-04-08 11:34:29.136225
2439	609	political	f	2026-04-08 11:34:29.136225
2440	609	symbolic	f	2026-04-08 11:34:29.136225
2441	609	Structure	t	2026-04-08 11:34:29.136225
2442	610	RouterA(config)#ip route 198.44.4.0 255.255.255.0 198.44.4.5	f	2026-04-08 11:34:29.136225
2443	610	RouterA(config)#ip route 198.44.4.0 255.255.255.0 fast 0/1	f	2026-04-08 11:34:29.136225
2444	610	nothing needs to be done	t	2026-04-08 11:34:29.136225
2445	610	RouterA(config)#ip route 198.44.4.0/24 fast 0/1	f	2026-04-08 11:34:29.136225
2446	611	1NF	f	2026-04-08 11:34:29.136225
2447	611	3NF	f	2026-04-08 11:34:29.136225
2448	611	BCNF	f	2026-04-08 11:34:29.136225
2449	611	2NF	t	2026-04-08 11:34:29.136225
2450	612	Convert()	f	2026-04-08 11:34:29.136225
2451	612	Val()	t	2026-04-08 11:34:29.136225
2452	612	Int()	f	2026-04-08 11:34:29.136225
2453	612	Parse()	f	2026-04-08 11:34:29.136225
2458	614	broadcast receiver	f	2026-04-08 11:34:29.136225
2459	614	service	f	2026-04-08 11:34:29.136225
2460	614	content provider	f	2026-04-08 11:34:29.136225
2461	614	Activities	t	2026-04-08 11:34:29.136225
2462	615	objects are a characteristic that define an attribute; they are properties of the attribute	f	2026-04-08 11:34:29.136225
2463	615	inheritance allows you to treat all of object's methods and data as a single entity	f	2026-04-08 11:34:29.136225
2464	615	A method is a self-contained block of program code that carries out some action similar to a procedure in a procedural program	t	2026-04-08 11:34:29.136225
2465	615	encapsulation allows a class to be a subclass of a superclass and thereby inherit public and protected variables and method of the superclass	f	2026-04-08 11:34:29.136225
2466	616	No, though the first part is right the second part should be </p></b></i>	f	2026-04-08 11:34:29.136225
2467	616	No, because paragraph tags need to be right before the actual text	f	2026-04-08 11:34:29.136225
2468	616	Yes, because the tags are nested correctly	t	2026-04-08 11:34:29.136225
2469	616	No, because italic must always come before bold tags	f	2026-04-08 11:34:29.136225
2470	617	temp[0]=3;	t	2026-04-08 11:34:29.136225
2471	617	temp[3]=0;	f	2026-04-08 11:34:29.136225
2472	617	3=temp[0];	f	2026-04-08 11:34:29.136225
2473	617	temp(0)=3	f	2026-04-08 11:34:29.136225
2474	618	<p>	f	2026-04-08 11:34:29.136225
2475	618	<p:img>	f	2026-04-08 11:34:29.136225
2476	618	<img><p>	t	2026-04-08 11:34:29.136225
2477	618	<img : p>	f	2026-04-08 11:34:29.136225
2478	619	footer:p:first-child{font-size:x-small;}	f	2026-04-08 11:34:29.136225
2479	619	footer p.first-child{font-size:x-small;}	f	2026-04-08 11:34:29.136225
2480	619	footer=>p,first-child{font-size:x-small;}	f	2026-04-08 11:34:29.136225
2481	619	footer p:first-child{font-size:x-small;}	t	2026-04-08 11:34:29.136225
2482	620	Confidentiality	t	2026-04-08 11:34:29.136225
2483	620	Authentication	f	2026-04-08 11:34:29.136225
2484	620	Integrity	f	2026-04-08 11:34:29.136225
2485	620	Non-repudiation	f	2026-04-08 11:34:29.136225
2486	621	loss of accountability	f	2026-04-08 11:34:29.136225
2487	621	loss of confidentiality	f	2026-04-08 11:34:29.136225
2488	621	loss of availability	f	2026-04-08 11:34:29.136225
2489	621	loss of integrity	t	2026-04-08 11:34:29.136225
2490	622	224.0.0.6	f	2026-04-08 11:34:29.136225
2491	622	224.0.0.7	f	2026-04-08 11:34:29.136225
2492	622	224.0.0.5	t	2026-04-08 11:34:29.136225
2493	622	224.0.0.4	f	2026-04-08 11:34:29.136225
2494	623	group	f	2026-04-08 11:34:29.136225
2495	623	chgrp	t	2026-04-08 11:34:29.136225
2496	623	cgrp	f	2026-04-08 11:34:29.136225
2497	623	change	f	2026-04-08 11:34:29.136225
2498	624	UPDATE staff SET salary=salary*1.05	t	2026-04-08 11:34:29.136225
2499	624	CHANGE staff SET salary=salary + 0.05	f	2026-04-08 11:34:29.136225
2500	624	ALTER staff SET salary = 0.05	f	2026-04-08 11:34:29.136225
2501	624	MODIFY staff SET salary = salary*.05	f	2026-04-08 11:34:29.136225
2502	625	message deletion	f	2026-04-08 11:34:29.136225
2503	625	message modification	f	2026-04-08 11:34:29.136225
2504	625	message read by unauthorized party	f	2026-04-08 11:34:29.136225
2505	625	sender verification	t	2026-04-08 11:34:29.136225
2506	626	$_SESSION[]	f	2026-04-08 11:34:29.136225
2507	626	$_SERVER[]	t	2026-04-08 11:34:29.136225
2508	626	$_POST[]	f	2026-04-08 11:34:29.136225
2509	626	$_REQUEST[]	f	2026-04-08 11:34:29.136225
2510	627	h1.all{background-color:#FFFFF}	f	2026-04-08 11:34:29.136225
2511	627	all.h1{background-color:#FFFFF}	f	2026-04-08 11:34:29.136225
2512	627	h1{background-color:#FFFFF}	t	2026-04-08 11:34:29.136225
2513	627	All	f	2026-04-08 11:34:29.136225
2514	628	service	t	2026-04-08 11:34:29.136225
2515	628	broadcast receivers	f	2026-04-08 11:34:29.136225
2516	628	activities	f	2026-04-08 11:34:29.136225
2517	628	content provider	f	2026-04-08 11:34:29.136225
2518	629	Determining the forwarding interfaces based upon the destination MAC address and tables	f	2026-04-08 11:34:29.136225
2519	629	Learning the MAC address by examining the destination MAC addresses	t	2026-04-08 11:34:29.136225
2520	629	Repeating the electrical signal to all ports	f	2026-04-08 11:34:29.136225
2521	629	Forwarding the data based upon logical addressing	f	2026-04-08 11:34:29.136225
2522	630	urlencode()	f	2026-04-08 11:34:29.136225
2523	630	addslashes()	f	2026-04-08 11:34:29.136225
2524	630	mysql_real_escape_string()	f	2026-04-08 11:34:29.136225
2525	630	eval()	t	2026-04-08 11:34:29.136225
2530	632	SMTP	f	2026-04-08 11:34:29.136225
2531	632	IP	f	2026-04-08 11:34:29.136225
2532	632	UDP	t	2026-04-08 11:34:29.136225
2533	632	FTP	f	2026-04-08 11:34:29.136225
2534	633	Only inside functions	f	2026-04-08 11:34:29.136225
2535	633	Only outside functions	f	2026-04-08 11:34:29.136225
2536	633	Anywhere except in classes	f	2026-04-08 11:34:29.136225
2537	633	Anywhere	t	2026-04-08 11:34:29.136225
2542	635	Overloading +=	f	2026-04-08 11:34:29.136225
2543	635	Overloading <<	t	2026-04-08 11:34:29.136225
2544	635	Overloading &&	f	2026-04-08 11:34:29.136225
2545	635	Overloading ||	f	2026-04-08 11:34:29.136225
2664	665	public	f	2026-04-08 11:34:34.057608
2554	638	The content of a static web page can only change if the source code is changed.	f	2026-04-08 11:34:34.057608
2555	638	The content of a dynamic page may change in response to users' actions.	f	2026-04-08 11:34:34.057608
2556	638	An application that collects data from users through a form and stores it in a database requires the integration of client & server-side scripts	f	2026-04-08 11:34:34.057608
2557	638	Source code of a program written in a server-side scripting language is visible on a client application such as a browser	t	2026-04-08 11:34:34.057608
2562	640	Round Robin	f	2026-04-08 11:34:34.057608
2563	640	Priority	t	2026-04-08 11:34:34.057608
2564	640	FCFS	f	2026-04-08 11:34:34.057608
2565	640	SJF	f	2026-04-08 11:34:34.057608
2570	642	Query execution	f	2026-04-08 11:34:34.057608
2571	642	Query plan evaluation	f	2026-04-08 11:34:34.057608
2572	642	Query optimization	t	2026-04-08 11:34:34.057608
2573	642	Query parsing	f	2026-04-08 11:34:34.057608
2574	643	Circuit Switching	f	2026-04-08 11:34:34.057608
2575	643	Packet Switching	f	2026-04-08 11:34:34.057608
2576	643	Message Switching	t	2026-04-08 11:34:34.057608
2577	643	all	f	2026-04-08 11:34:34.057608
2578	644	All the catch blocks for that try statement are executed in order.	f	2026-04-08 11:34:34.057608
2579	644	The first catch block is executed and the others are skipped.	t	2026-04-08 11:34:34.057608
2580	644	All the catch blocks for that try statement are skipped.	f	2026-04-08 11:34:34.057608
2581	644	The program will terminate without executing any of the catch blocks.	f	2026-04-08 11:34:34.057608
2582	645	Database application and the database	t	2026-04-08 11:34:34.057608
2583	645	Data and the database	f	2026-04-08 11:34:34.057608
2584	645	The user and the database application	f	2026-04-08 11:34:34.057608
2585	645	Database application and SQL	f	2026-04-08 11:34:34.057608
2590	647	9	t	2026-04-08 11:34:34.057608
2591	647	81	f	2026-04-08 11:34:34.057608
2592	647	27	f	2026-04-08 11:34:34.057608
2593	647	3	f	2026-04-08 11:34:34.057608
2594	648	required	f	2026-04-08 11:34:34.057608
2595	648	pattern	f	2026-04-08 11:34:34.057608
2596	648	read-only	t	2026-04-08 11:34:34.057608
2597	648	disable	f	2026-04-08 11:34:34.057608
2598	649	outside program	f	2026-04-08 11:34:34.057608
2599	649	inside function	f	2026-04-08 11:34:34.057608
2600	649	outside function	t	2026-04-08 11:34:34.057608
2601	649	None Of the Above	f	2026-04-08 11:34:34.057608
2606	651	file server	f	2026-04-08 11:34:34.057608
2607	651	mail server	f	2026-04-08 11:34:34.057608
2608	651	web server	t	2026-04-08 11:34:34.057608
2609	651	A and C	f	2026-04-08 11:34:34.057608
2610	652	Inheritance is used for code reusing	f	2026-04-08 11:34:34.057608
2611	652	In inheritance the sub class can introduce its own specific variables	f	2026-04-08 11:34:34.057608
2612	652	A super class can access its own sub classes unique data members	t	2026-04-08 11:34:34.057608
2613	652	Java uses the word extends to implement inheritance	f	2026-04-08 11:34:34.057608
2618	654	Hold and Wait	f	2026-04-08 11:34:34.057608
2619	654	Mutual inclusion	t	2026-04-08 11:34:34.057608
2620	654	No- preemption	f	2026-04-08 11:34:34.057608
2621	654	Circular wait	f	2026-04-08 11:34:34.057608
2622	655	Application layer	f	2026-04-08 11:34:34.057608
2623	655	Internet layer	f	2026-04-08 11:34:34.057608
2624	655	network access layer	t	2026-04-08 11:34:34.057608
2625	655	transport layer	f	2026-04-08 11:34:34.057608
2626	656	Function parameters	f	2026-04-08 11:34:34.057608
2627	656	Local variables	f	2026-04-08 11:34:34.057608
2628	656	Return addresses	f	2026-04-08 11:34:34.057608
2629	656	PID of the child process	t	2026-04-08 11:34:34.057608
2630	657	To utilized storage space efficiently	f	2026-04-08 11:34:34.057608
2631	657	To increase system performance	f	2026-04-08 11:34:34.057608
2632	657	To maximize throughput	f	2026-04-08 11:34:34.057608
2633	657	To increase response time	t	2026-04-08 11:34:34.057608
2638	659	Constructor Student ( ) { }	f	2026-04-08 11:34:34.057608
2639	659	public Student ( ) { }	t	2026-04-08 11:34:34.057608
2640	659	Student Student ( ) { }	f	2026-04-08 11:34:34.057608
2641	659	Void Student ( ) { }	f	2026-04-08 11:34:34.057608
2642	660	Control all the computer I/O devices.	f	2026-04-08 11:34:34.057608
2643	660	Issue commands to I/O devices, catching interrupts and handling errors	f	2026-04-08 11:34:34.057608
2644	660	Provide an interface between the device and the rest of the system.	f	2026-04-08 11:34:34.057608
2645	660	All	t	2026-04-08 11:34:34.057608
2646	661	xyz.txt file is opened for reading only	f	2026-04-08 11:34:34.057608
2647	661	the text hello will be appended to the existing content in xyz.txt file	t	2026-04-08 11:34:34.057608
2648	661	the text hello won't be written to xyz.txt file, if the file does not exist	f	2026-04-08 11:34:34.057608
2649	661	xyz.txt file is opened for write-only access	f	2026-04-08 11:34:34.057608
2650	662	Atomicity	f	2026-04-08 11:34:34.057608
2651	662	Isolation	t	2026-04-08 11:34:34.057608
2652	662	Consistency	f	2026-04-08 11:34:34.057608
2653	662	Durability	f	2026-04-08 11:34:34.057608
2658	664	Internet layer	f	2026-04-08 11:34:34.057608
2659	664	Network access layer	t	2026-04-08 11:34:34.057608
2660	664	Transport layer	f	2026-04-08 11:34:34.057608
2661	664	Application layer	f	2026-04-08 11:34:34.057608
2662	665	private	f	2026-04-08 11:34:34.057608
2663	665	static	f	2026-04-08 11:34:34.057608
2665	665	string	t	2026-04-08 11:34:34.057608
2666	666	ROTS	f	2026-04-08 11:34:34.057608
2667	666	Multi-tasking	t	2026-04-08 11:34:34.057608
2668	666	Multi-user	f	2026-04-08 11:34:34.057608
2669	666	DOS	f	2026-04-08 11:34:34.057608
2670	667	$email= $_GET['email'];	f	2026-04-08 11:34:34.057608
2671	667	$email= $_POST['email'];	f	2026-04-08 11:34:34.057608
2672	667	echo $_REQUEST['email'];	f	2026-04-08 11:34:34.057608
2673	667	$email= $_REQUEST['UserEmail'];	t	2026-04-08 11:34:34.057608
2674	668	Input/Output cost	f	2026-04-08 11:34:34.057608
2675	668	Communication cost	f	2026-04-08 11:34:34.057608
2676	668	CPU processing cost	f	2026-04-08 11:34:34.057608
2677	668	Device cost	t	2026-04-08 11:34:34.057608
2678	669	Record	t	2026-04-08 11:34:34.057608
2679	669	Attributes	f	2026-04-08 11:34:34.057608
2680	669	Column	f	2026-04-08 11:34:34.057608
2681	669	All of them	f	2026-04-08 11:34:34.057608
2682	670	catch, try, finally	f	2026-04-08 11:34:34.057608
2683	670	try, catch, finally	t	2026-04-08 11:34:34.057608
2684	670	finally, catch, try	f	2026-04-08 11:34:34.057608
2685	670	try, finally, catch	f	2026-04-08 11:34:34.057608
2686	671	It will have to be moved a process to a partition having a small space.	t	2026-04-08 11:34:34.057608
2687	671	Swapped out of memory until a large enough hole can be created	f	2026-04-08 11:34:34.057608
2688	671	Kill the process.	f	2026-04-08 11:34:34.057608
2689	671	All	f	2026-04-08 11:34:34.057608
2690	672	byte	f	2026-04-08 11:34:34.057608
2691	672	double	t	2026-04-08 11:34:34.057608
2692	672	int	f	2026-04-08 11:34:34.057608
2693	672	short	f	2026-04-08 11:34:34.057608
2694	673	Structural Programming can solve moderate problems	f	2026-04-08 11:34:34.057608
2695	673	Object-Oriented Programming provides data hiding	f	2026-04-08 11:34:34.057608
2696	673	Structural Programming does not provide data hiding	f	2026-04-08 11:34:34.057608
2697	673	Structural Programming support code reusability	t	2026-04-08 11:34:34.057608
2698	674	The isset() function is used to check whether a variable is set or not	t	2026-04-08 11:34:34.057608
2699	674	The isset() function is used to check whether a variable is free or not	f	2026-04-08 11:34:34.057608
2700	674	The isset() function is used to check whether a variable is a string or not	f	2026-04-08 11:34:34.057608
2701	674	The isset() function is used to set a new value to a variable	f	2026-04-08 11:34:34.057608
2702	675	Class is an entity that contains both data and methods.	f	2026-04-08 11:34:34.057608
2703	675	new operator used to create object from a given class	f	2026-04-08 11:34:34.057608
2704	675	In java new operator used to declare variable that used to store single value	t	2026-04-08 11:34:34.057608
2705	675	Classes are model of a given problem domain.	f	2026-04-08 11:34:34.057608
2706	676	0134	f	2026-04-08 11:34:34.057608
2707	676	Nov	f	2026-04-08 11:34:34.057608
2708	676	2	t	2026-04-08 11:34:34.057608
2709	676	SeptOctDecJan	f	2026-04-08 11:34:34.057608
2710	677	p,h1,h2,li { text-align: center; color: red; }	f	2026-04-08 11:34:34.057608
2711	677	p { background: yellow; color: red; }	f	2026-04-08 11:34:34.057608
2712	677	#par{ background: yellow; color: red; }	f	2026-04-08 11:34:34.057608
2713	677	.par { background: yellow; color: red; }	t	2026-04-08 11:34:34.057608
2714	678	Send_redirect()	f	2026-04-08 11:34:34.057608
2715	678	header_location()	f	2026-04-08 11:34:34.057608
2716	678	header()	t	2026-04-08 11:34:34.057608
2717	678	redirect()	f	2026-04-08 11:34:34.057608
2718	679	Composite Key	f	2026-04-08 11:34:34.057608
2719	679	Primary Key	t	2026-04-08 11:34:34.057608
2720	679	Foreign key	f	2026-04-08 11:34:34.057608
2721	679	Candidate Key	f	2026-04-08 11:34:34.057608
2722	680	Differential Manchester	t	2026-04-08 11:34:34.057608
2723	680	Manchester	f	2026-04-08 11:34:34.057608
2724	680	Delta modulation	f	2026-04-08 11:34:34.057608
2725	680	Pulse code modulation	f	2026-04-08 11:34:34.057608
2726	681	String	t	2026-04-08 11:34:34.057608
2727	681	long	f	2026-04-08 11:34:34.057608
2728	681	Boolean	f	2026-04-08 11:34:34.057608
2729	681	int	f	2026-04-08 11:34:34.057608
2734	683	Functional data dependency	f	2026-04-08 11:34:34.057608
2735	683	Partial functional data dependency	f	2026-04-08 11:34:34.057608
2736	683	Full functional data dependency	f	2026-04-08 11:34:34.057608
2737	683	Transitive functional data dependency	t	2026-04-08 11:34:34.057608
2738	684	Shared Locking	f	2026-04-08 11:34:34.057608
2739	684	Optimistic	t	2026-04-08 11:34:34.057608
2740	684	Time stamping	f	2026-04-08 11:34:34.057608
2741	684	Executive locking	f	2026-04-08 11:34:34.057608
2742	685	Entity integrity	t	2026-04-08 11:34:34.057608
2743	685	Referential integrity	f	2026-04-08 11:34:34.057608
2744	685	Domain Integrity	f	2026-04-08 11:34:34.057608
2745	685	Cardinal integrity	f	2026-04-08 11:34:34.057608
2746	686	document.write()	f	2026-04-08 11:34:34.057608
2747	686	out.print()	f	2026-04-08 11:34:34.057608
2748	686	print()	t	2026-04-08 11:34:34.057608
2749	686	write()	f	2026-04-08 11:34:34.057608
2750	687	Decomposition	f	2026-04-08 11:34:34.057608
2751	687	Normalization	t	2026-04-08 11:34:34.057608
2752	687	Partitioning	f	2026-04-08 11:34:34.057608
2753	687	Distributing	f	2026-04-08 11:34:34.057608
2754	688	E-R diagram	f	2026-04-08 11:34:34.057608
2755	688	Entity	f	2026-04-08 11:34:34.057608
2756	688	Relationship	f	2026-04-08 11:34:34.057608
2757	688	constraints	t	2026-04-08 11:34:34.057608
2758	689	PHP	f	2026-04-08 11:34:34.057608
2759	689	Servlet	f	2026-04-08 11:34:34.057608
2760	689	JSP	f	2026-04-08 11:34:34.057608
2761	689	HTML	t	2026-04-08 11:34:34.057608
2762	690	An exception is a compile time error	t	2026-04-08 11:34:34.057608
2763	690	In java there are predefined classes that used to handle exceptions	f	2026-04-08 11:34:34.057608
2764	690	In exception handling technique an exception object contains expected error information	f	2026-04-08 11:34:34.057608
2765	690	Exception handling mechanism decreases your program performance	f	2026-04-08 11:34:34.057608
2770	692	Polymorphism	f	2026-04-08 11:34:34.057608
2771	692	Inheritance	f	2026-04-08 11:34:34.057608
2772	692	Abstraction	f	2026-04-08 11:34:34.057608
2773	692	Encapsulation	t	2026-04-08 11:34:34.057608
2774	693	EMP_Salary	f	2026-04-08 11:34:34.057608
2775	693	Age27	f	2026-04-08 11:34:34.057608
2776	693	My-Name	t	2026-04-08 11:34:34.057608
2777	693	_1200IDN	f	2026-04-08 11:34:34.057608
2778	694	mysqli_select_db()	f	2026-04-08 11:34:34.057608
2779	694	mysqli_fetch_assoc()	f	2026-04-08 11:34:34.057608
2780	694	mysqli_execute_query()	f	2026-04-08 11:34:34.057608
2781	694	mysqli_query()	t	2026-04-08 11:34:34.057608
2786	696	private	f	2026-04-08 11:34:34.057608
2787	696	final	f	2026-04-08 11:34:34.057608
2788	696	public	t	2026-04-08 11:34:34.057608
2789	696	abstract	f	2026-04-08 11:34:34.057608
2794	698	</p> is an end tag and has no problem if we forget it	f	2026-04-08 11:34:34.057608
2795	698	'Hello Everyone' is an element that will be displayed on the browser in red color	t	2026-04-08 11:34:34.057608
2796	698	'style' is a CSS property	f	2026-04-08 11:34:34.057608
2797	698	style='color:red;'> is an internal CSS	f	2026-04-08 11:34:34.057608
2802	700	In segmentation segments size is unequal and dynamic.	f	2026-04-08 11:34:34.057608
2803	700	In paging the virtual address space is divided into equal-sized block called pages frame.	t	2026-04-08 11:34:34.057608
2804	700	Pages and page frames should have the same size.	f	2026-04-08 11:34:34.057608
2805	700	To map each page into frames we need a special data structure called page table	f	2026-04-08 11:34:34.057608
2806	701	Journaling	t	2026-04-08 11:34:34.057608
2807	701	View	f	2026-04-08 11:34:34.057608
2808	701	Backup	f	2026-04-08 11:34:34.057608
2809	701	Encryption	f	2026-04-08 11:34:34.057608
2810	702	It is cascading free	f	2026-04-08 11:34:34.057608
2811	702	No transaction is made to wait	t	2026-04-08 11:34:34.057608
2812	702	It guarantees serializability	f	2026-04-08 11:34:34.057608
2813	702	None of them	f	2026-04-08 11:34:34.057608
2818	704	final	t	2026-04-08 11:34:34.057608
2819	704	last	f	2026-04-08 11:34:34.057608
2820	704	constant	f	2026-04-08 11:34:34.057608
2821	704	static	f	2026-04-08 11:34:34.057608
2822	705	It provides a platform on which application software can be installed on the bottom.	f	2026-04-08 11:34:34.057608
2823	705	It controls the overall functionality of the computer system.	t	2026-04-08 11:34:34.057608
2824	705	It primarily focuses on managing the hardware resource rather than software resources.	f	2026-04-08 11:34:34.057608
2825	705	We can use a computer, even if a computer has no installed operating system.	f	2026-04-08 11:34:34.057608
2826	706	Improved transaction throughput	t	2026-04-08 11:34:34.057608
2827	706	Serializability	f	2026-04-08 11:34:34.057608
2828	706	Reduced execution complexity	f	2026-04-08 11:34:34.057608
2829	706	Reduced waiting time	f	2026-04-08 11:34:34.057608
2830	707	255.0.0.0	f	2026-04-08 11:34:34.057608
2831	707	255.255.0.0	f	2026-04-08 11:34:34.057608
2832	707	255.255.255.0	f	2026-04-08 11:34:34.057608
2833	707	all	t	2026-04-08 11:34:34.057608
2834	708	Simplex	f	2026-04-08 11:34:34.057608
2835	708	Half duplex	f	2026-04-08 11:34:34.057608
2836	708	Full duplex	t	2026-04-08 11:34:34.057608
2837	708	all except A	f	2026-04-08 11:34:34.057608
2838	709	Repeatable read	f	2026-04-08 11:34:34.057608
2839	709	Dirty read	t	2026-04-08 11:34:34.057608
2840	709	Phantom read	f	2026-04-08 11:34:34.057608
2841	709	Conflict read	f	2026-04-08 11:34:34.057608
2842	710	Loss Update	f	2026-04-08 11:34:34.057608
2843	710	Incorrect summery	f	2026-04-08 11:34:34.057608
2844	710	Temporary read	f	2026-04-08 11:34:34.057608
2845	710	Unrepeatable read	t	2026-04-08 11:34:34.057608
2858	714	Several classes can be declared as sub classes of the same super class	f	2026-04-08 11:34:34.057608
2859	714	Several classes can share the same variable.	f	2026-04-08 11:34:34.057608
2860	714	When we create an object of a sub class, constructor of a subclass executed first and then constructors of super class	t	2026-04-08 11:34:34.057608
2861	714	In inheritance we can have more than one sub class	f	2026-04-08 11:34:34.057608
2862	715	The beginning of transaction	f	2026-04-08 11:34:34.057608
2863	715	The operation not performed	t	2026-04-08 11:34:34.057608
2864	715	The ending of the transaction	f	2026-04-08 11:34:34.057608
2865	715	Transaction status(committed/aborted)	f	2026-04-08 11:34:34.057608
2870	717	Microwave	f	2026-04-08 11:34:34.057608
2871	717	Radio waves	t	2026-04-08 11:34:34.057608
2872	717	Infrared waves	f	2026-04-08 11:34:34.057608
2873	717	Bluetooth	f	2026-04-08 11:34:34.057608
2874	718	It is used to make data accessible across all pages of a website	f	2026-04-08 11:34:34.057608
2875	718	echo $_SESSION['email']; is used to display the value of a session variable called email.	f	2026-04-08 11:34:34.057608
2876	718	session_start() function is used to start a session and must be there at the beginning of an index.php page of the website	f	2026-04-08 11:34:34.057608
2877	718	session_unset() function destroys all session variables	t	2026-04-08 11:34:34.057608
2878	719	Array elements 3 4 0 5 will be printed	f	2026-04-08 11:34:34.057608
2879	719	10 7 0 6 will be printed	f	2026-04-08 11:34:34.057608
2880	719	Compile Error will occur	f	2026-04-08 11:34:34.057608
2881	719	10 7 0 6 3 4 0 5 will be printed	t	2026-04-08 11:34:34.057608
2886	721	172.16.6.2	f	2026-04-08 11:34:34.057608
2887	721	10.123.16.145	f	2026-04-08 11:34:34.057608
2888	721	192.168.14.23	f	2026-04-08 11:34:34.057608
2889	721	All	t	2026-04-08 11:34:34.057608
2898	724	base	f	2026-04-08 11:34:34.057608
2899	724	super	t	2026-04-08 11:34:34.057608
2900	724	this	f	2026-04-08 11:34:34.057608
2901	724	upper	f	2026-04-08 11:34:34.057608
2906	726	Polymorphism	f	2026-04-08 11:34:34.057608
2907	726	Inheritance	t	2026-04-08 11:34:34.057608
2908	726	Encapsulation	f	2026-04-08 11:34:34.057608
2909	726	Abstraction	f	2026-04-08 11:34:34.057608
2910	727	Navigational nature of processing.	f	2026-04-08 11:34:34.057608
2911	727	Visualized as a linear arrangement of records	f	2026-04-08 11:34:34.057608
2912	727	Little scope for query optimization	f	2026-04-08 11:34:34.057608
2913	727	High scope of query optimization	t	2026-04-08 11:34:34.057608
2914	728	Constructors are methods of a given class which used to create objects	t	2026-04-08 11:34:34.057608
2915	728	Constructors are special attributes	f	2026-04-08 11:34:34.057608
2916	728	Constructors have the same name as class name and can return values	f	2026-04-08 11:34:34.057608
2917	728	A class can't have more than one constructor	f	2026-04-08 11:34:34.057608
2918	729	int stud_age=20;	f	2026-04-08 11:34:34.057608
2919	729	$stud-age=20;	f	2026-04-08 11:34:34.057608
2920	729	stud_age=20;	f	2026-04-08 11:34:34.057608
2921	729	$_age=20;	t	2026-04-08 11:34:34.057608
2922	730	Variable names can start with a digit.	f	2026-04-08 11:34:34.057608
2923	730	Some Java keywords can be used as naming a variable	f	2026-04-08 11:34:34.057608
2924	730	Variable names can contain digits 0-9.	t	2026-04-08 11:34:34.057608
2925	730	All variables cannot be changing its value during execution	f	2026-04-08 11:34:34.057608
2926	731	Switch	f	2026-04-08 11:34:34.057608
2927	731	router	f	2026-04-08 11:34:34.057608
2928	731	Hub	t	2026-04-08 11:34:34.057608
2929	731	Bridges	f	2026-04-08 11:34:34.057608
2930	732	createcookie('product','smart phone',time()+(60*60*14),'/','localhost',0);	f	2026-04-08 11:34:34.057608
2931	732	setcookie('product','smart phone',time()+(60*60*2*24),'/','localhost',0);	f	2026-04-08 11:34:34.057608
2932	732	setcookie('product','smart phone',time()+(60*60*24*14),'/','localhost',0);	t	2026-04-08 11:34:34.057608
2933	732	setcookie('product','smart phone',time()+(60*60*24),'/','localhost',0);	f	2026-04-08 11:34:34.057608
2942	735	If the given quantum time expired a running process can be interrupted and goes to the ready queue.	f	2026-04-08 11:34:34.057608
2943	735	When a process is created it goes to a ready state immediately.	f	2026-04-08 11:34:34.057608
2944	735	When a process successfully finished its task, it goes to a terminated state	f	2026-04-08 11:34:34.057608
2945	735	all	t	2026-04-08 11:34:34.057608
2950	737	Exception	t	2026-04-08 11:34:34.057608
2951	737	Runtime Exception	f	2026-04-08 11:34:34.057608
2952	737	Checked Exceptions	f	2026-04-08 11:34:34.057608
2953	737	Unchecked Exception	f	2026-04-08 11:34:34.057608
2954	738	Recoverable	f	2026-04-08 11:34:34.057608
2955	738	Conflict serializable	f	2026-04-08 11:34:34.057608
2956	738	Non-recoverable	t	2026-04-08 11:34:34.057608
2957	738	Serial	f	2026-04-08 11:34:34.057608
2958	739	strong Entity	f	2026-04-08 11:34:34.057608
2959	739	Weak entity	t	2026-04-08 11:34:34.057608
2960	739	dependent entity	f	2026-04-08 11:34:34.057608
2961	739	Independent	f	2026-04-08 11:34:34.057608
2966	741	When Exception occurs and not handled	f	2026-04-08 11:34:34.057608
2967	741	When System.Exit() is called	t	2026-04-08 11:34:34.057608
2968	741	When Exception does not occur	f	2026-04-08 11:34:34.057608
2969	741	When Exception occurs and handled	f	2026-04-08 11:34:34.057608
2970	742	if...else if	f	2026-04-08 11:34:34.057608
2971	742	for loop	t	2026-04-08 11:34:34.057608
2972	742	nested if	f	2026-04-08 11:34:34.057608
2973	742	if...else	f	2026-04-08 11:34:34.057608
2974	743	NetBeans	f	2026-04-08 11:34:34.057608
2975	743	JVM	t	2026-04-08 11:34:34.057608
2976	743	JDK	f	2026-04-08 11:34:34.057608
2977	743	JRE	f	2026-04-08 11:34:34.057608
2978	744	Hierarchical Database Model	f	2026-04-08 11:34:34.057608
2979	744	Network Database Model	f	2026-04-08 11:34:34.057608
2980	744	Relational Database Model	f	2026-04-08 11:34:34.057608
2981	744	all of them	t	2026-04-08 11:34:34.057608
2982	745	interface A implements B {}	f	2026-04-08 11:34:34.057608
2983	745	class B implements A {}	t	2026-04-08 11:34:34.057608
2984	745	class B extends A {}	f	2026-04-08 11:34:34.057608
2985	745	interface B extends A {}	f	2026-04-08 11:34:34.057608
3026	756	Processing and storing data submitted by HTML form.	f	2026-04-08 16:44:44.130372
3027	756	Providing dynamic content.	f	2026-04-08 16:44:44.130372
3028	756	Used to handle multiple requests concurrently	f	2026-04-08 16:44:44.130372
3029	756	Processing and returning data to user in HTML form only.	t	2026-04-08 16:44:44.130372
3034	758	required	f	2026-04-08 16:44:44.130372
3035	758	pattern	f	2026-04-08 16:44:44.130372
3036	758	read-only	t	2026-04-08 16:44:44.130372
3037	758	disable	f	2026-04-08 16:44:44.130372
3038	759	outside program	f	2026-04-08 16:44:44.130372
3039	759	inside function	f	2026-04-08 16:44:44.130372
3040	759	outside function	t	2026-04-08 16:44:44.130372
3041	759	None Of the Above	f	2026-04-08 16:44:44.130372
3042	760	for	f	2026-04-08 16:44:44.130372
3043	760	do-while	t	2026-04-08 16:44:44.130372
3044	760	while	f	2026-04-08 16:44:44.130372
3045	760	continue	f	2026-04-08 16:44:44.130372
3050	762	Inheritance is used for code reusing	f	2026-04-08 16:44:44.130372
3051	762	In inheritance the sub class can introduce its own specific variables	f	2026-04-08 16:44:44.130372
3052	762	A super class can access its own sub classes unique data members	t	2026-04-08 16:44:44.130372
3053	762	Java uses the word extends to implement inheritance	f	2026-04-08 16:44:44.130372
3054	763	Distributed	f	2026-04-08 16:44:44.130372
3055	763	Platform-Independent	f	2026-04-08 16:44:44.130372
3056	763	Portable	f	2026-04-08 16:44:44.130372
3057	763	Multi-threaded	t	2026-04-08 16:44:44.130372
3058	764	Hold and Wait	f	2026-04-08 16:44:44.130372
3059	764	Mutual inclusion	t	2026-04-08 16:44:44.130372
3060	764	No- preemption	f	2026-04-08 16:44:44.130372
3061	764	Circular wait	f	2026-04-08 16:44:44.130372
3062	765	Application layer	f	2026-04-08 16:44:44.130372
3063	765	Internet layer	f	2026-04-08 16:44:44.130372
3064	765	network access layer	t	2026-04-08 16:44:44.130372
3065	765	transport layer	f	2026-04-08 16:44:44.130372
3066	766	Function parameters	f	2026-04-08 16:44:44.130372
3067	766	Local variables	f	2026-04-08 16:44:44.130372
3068	766	Return addresses	f	2026-04-08 16:44:44.130372
3069	766	PID of the child process	t	2026-04-08 16:44:44.130372
3074	768	static variables	f	2026-04-08 16:44:44.130372
3075	768	final variables	f	2026-04-08 16:44:44.130372
3076	768	private members	t	2026-04-08 16:44:44.130372
3077	768	abstract methods	f	2026-04-08 16:44:44.130372
3082	770	Control all the computer I/O devices.	f	2026-04-08 16:44:44.130372
3083	770	Issue commands to I/O devices, catching interrupts and handling errors	f	2026-04-08 16:44:44.130372
3084	770	Provide an interface between the device and the rest of the system.	f	2026-04-08 16:44:44.130372
3085	770	All	t	2026-04-08 16:44:44.130372
3086	771	xyz.txt file is opened for reading only	f	2026-04-08 16:44:44.130372
3087	771	the text hello will be appended to the existing content in xyz.txt file	t	2026-04-08 16:44:44.130372
3088	771	the text hello won't be written to xyz.txt file, if the file does not exist	f	2026-04-08 16:44:44.130372
3089	771	xyz.txt file is opened for write-only access	f	2026-04-08 16:44:44.130372
3090	772	Atomicity	f	2026-04-08 16:44:44.130372
3091	772	Isolation	t	2026-04-08 16:44:44.130372
3092	772	Consistency	f	2026-04-08 16:44:44.130372
3093	772	Durability	f	2026-04-08 16:44:44.130372
3098	774	Internet layer	f	2026-04-08 16:44:44.130372
3099	774	Network access layer	t	2026-04-08 16:44:44.130372
3100	774	Transport layer	f	2026-04-08 16:44:44.130372
3101	774	Application layer	f	2026-04-08 16:44:44.130372
3102	775	private	f	2026-04-08 16:44:44.130372
3103	775	static	f	2026-04-08 16:44:44.130372
3104	775	public	f	2026-04-08 16:44:44.130372
3105	775	string	t	2026-04-08 16:44:44.130372
3106	776	ROTS	f	2026-04-08 16:44:44.130372
3107	776	Multi-tasking	t	2026-04-08 16:44:44.130372
3108	776	Multi-user	f	2026-04-08 16:44:44.130372
3109	776	DOS	f	2026-04-08 16:44:44.130372
3110	777	$email= $_GET['email'];	f	2026-04-08 16:44:44.130372
3111	777	$email= $_POST['email'];	f	2026-04-08 16:44:44.130372
3112	777	echo $_REQUEST['email'];	f	2026-04-08 16:44:44.130372
3113	777	$email= $_REQUEST['UserEmail'];	t	2026-04-08 16:44:44.130372
3114	778	Input/Output cost	f	2026-04-08 16:44:44.130372
3115	778	Communication cost	f	2026-04-08 16:44:44.130372
3116	778	CPU processing cost	f	2026-04-08 16:44:44.130372
3117	778	Device cost	t	2026-04-08 16:44:44.130372
3118	779	Record	t	2026-04-08 16:44:44.130372
3119	779	Attributes	f	2026-04-08 16:44:44.130372
3120	779	Column	f	2026-04-08 16:44:44.130372
3121	779	All of them	f	2026-04-08 16:44:44.130372
3122	780	catch, try, finally	f	2026-04-08 16:44:44.130372
3123	780	try, catch, finally	t	2026-04-08 16:44:44.130372
3124	780	finally, catch, try	f	2026-04-08 16:44:44.130372
3125	780	try, finally, catch	f	2026-04-08 16:44:44.130372
3126	781	It will have to be moved a process to a partition having a small space.	t	2026-04-08 16:44:44.130372
3127	781	Swapped out of memory until a large enough hole can be created	f	2026-04-08 16:44:44.130372
3128	781	Kill the process.	f	2026-04-08 16:44:44.130372
3129	781	All	f	2026-04-08 16:44:44.130372
3130	782	byte	f	2026-04-08 16:44:44.130372
3131	782	double	t	2026-04-08 16:44:44.130372
3132	782	int	f	2026-04-08 16:44:44.130372
3133	782	short	f	2026-04-08 16:44:44.130372
3134	783	Structural Programming can solve moderate problems	f	2026-04-08 16:44:44.130372
3135	783	Object-Oriented Programming provides data hiding	f	2026-04-08 16:44:44.130372
3136	783	Structural Programming does not provide data hiding	f	2026-04-08 16:44:44.130372
3137	783	Structural Programming support code reusability	t	2026-04-08 16:44:44.130372
3138	784	The isset() function is used to check whether a variable is set or not	t	2026-04-08 16:44:44.130372
3139	784	The isset() function is used to check whether a variable is free or not	f	2026-04-08 16:44:44.130372
3140	784	The isset() function is used to check whether a variable is a string or not	f	2026-04-08 16:44:44.130372
3141	784	The isset() function is used to set a new value to a variable	f	2026-04-08 16:44:44.130372
3142	785	Class is an entity that contains both data and methods.	f	2026-04-08 16:44:44.130372
3143	785	new operator used to create object from a given class	f	2026-04-08 16:44:44.130372
3360	839	stud_age=20;	f	2026-04-08 16:44:44.130372
3144	785	In java new operator used to declare variable that used to store single value	t	2026-04-08 16:44:44.130372
3145	785	Classes are model of a given problem domain.	f	2026-04-08 16:44:44.130372
3146	786	0134	f	2026-04-08 16:44:44.130372
3147	786	Nov	f	2026-04-08 16:44:44.130372
3148	786	2	t	2026-04-08 16:44:44.130372
3149	786	SeptOctDecJan	f	2026-04-08 16:44:44.130372
3150	787	p,h1,h2,li { text-align: center; color: red; }	f	2026-04-08 16:44:44.130372
3151	787	p { background: yellow; color: red; }	f	2026-04-08 16:44:44.130372
3152	787	#par{ background: yellow; color: red; }	f	2026-04-08 16:44:44.130372
3153	787	.par { background: yellow; color: red; }	t	2026-04-08 16:44:44.130372
3154	788	Send_redirect()	f	2026-04-08 16:44:44.130372
3155	788	header_location()	f	2026-04-08 16:44:44.130372
3156	788	header()	t	2026-04-08 16:44:44.130372
3157	788	redirect()	f	2026-04-08 16:44:44.130372
3158	789	Composite Key	f	2026-04-08 16:44:44.130372
3159	789	Primary Key	t	2026-04-08 16:44:44.130372
3160	789	Foreign key	f	2026-04-08 16:44:44.130372
3161	789	Candidate Key	f	2026-04-08 16:44:44.130372
3162	790	Differential Manchester	t	2026-04-08 16:44:44.130372
3163	790	Manchester	f	2026-04-08 16:44:44.130372
3164	790	Delta modulation	f	2026-04-08 16:44:44.130372
3165	790	Pulse code modulation	f	2026-04-08 16:44:44.130372
3166	791	String	t	2026-04-08 16:44:44.130372
3167	791	long	f	2026-04-08 16:44:44.130372
3168	791	Boolean	f	2026-04-08 16:44:44.130372
3169	791	int	f	2026-04-08 16:44:44.130372
3170	792	Noise	f	2026-04-08 16:44:44.130372
3171	792	Attenuation distortion	f	2026-04-08 16:44:44.130372
3172	792	Delay distortion	f	2026-04-08 16:44:44.130372
3173	792	B and C	t	2026-04-08 16:44:44.130372
3182	795	Entity integrity	t	2026-04-08 16:44:44.130372
3183	795	Referential integrity	f	2026-04-08 16:44:44.130372
3184	795	Domain Integrity	f	2026-04-08 16:44:44.130372
3185	795	Cardinal integrity	f	2026-04-08 16:44:44.130372
3186	796	document.write()	f	2026-04-08 16:44:44.130372
3187	796	out.print()	f	2026-04-08 16:44:44.130372
3188	796	print()	t	2026-04-08 16:44:44.130372
3189	796	write()	f	2026-04-08 16:44:44.130372
3190	797	Decomposition	f	2026-04-08 16:44:44.130372
3191	797	Normalization	t	2026-04-08 16:44:44.130372
3192	797	Partitioning	f	2026-04-08 16:44:44.130372
3193	797	Distributing	f	2026-04-08 16:44:44.130372
3194	798	E-R diagram	f	2026-04-08 16:44:44.130372
3195	798	Entity	f	2026-04-08 16:44:44.130372
3196	798	Relationship	f	2026-04-08 16:44:44.130372
3197	798	constraints	t	2026-04-08 16:44:44.130372
3198	799	PHP	f	2026-04-08 16:44:44.130372
3199	799	Servlet	f	2026-04-08 16:44:44.130372
3200	799	JSP	f	2026-04-08 16:44:44.130372
3201	799	HTML	t	2026-04-08 16:44:44.130372
3202	800	An exception is a compile time error	t	2026-04-08 16:44:44.130372
3203	800	In java there are predefined classes that used to handle exceptions	f	2026-04-08 16:44:44.130372
3204	800	In exception handling technique an exception object contains expected error information	f	2026-04-08 16:44:44.130372
3205	800	Exception handling mechanism decreases your program performance	f	2026-04-08 16:44:44.130372
3206	801	An interface cannot have instance variables.	f	2026-04-08 16:44:44.130372
3207	801	In Java, an Interface cannot be final	f	2026-04-08 16:44:44.130372
3208	801	There can be non-abstract methods within abstract class.	f	2026-04-08 16:44:44.130372
3209	801	We can define private modifier for variables in interfaces.	t	2026-04-08 16:44:44.130372
3210	802	Polymorphism	f	2026-04-08 16:44:44.130372
3211	802	Inheritance	f	2026-04-08 16:44:44.130372
3212	802	Abstraction	f	2026-04-08 16:44:44.130372
3213	802	Encapsulation	t	2026-04-08 16:44:44.130372
3214	803	EMP_Salary	f	2026-04-08 16:44:44.130372
3215	803	Age27	f	2026-04-08 16:44:44.130372
3216	803	My-Name	t	2026-04-08 16:44:44.130372
3217	803	_1200IDN	f	2026-04-08 16:44:44.130372
3218	804	mysqli_select_db()	f	2026-04-08 16:44:44.130372
3219	804	mysqli_fetch_assoc()	f	2026-04-08 16:44:44.130372
3220	804	mysqli_execute_query()	f	2026-04-08 16:44:44.130372
3221	804	mysqli_query()	t	2026-04-08 16:44:44.130372
3222	805	Service ( )	f	2026-04-08 16:44:44.130372
3223	805	destroy ( )	f	2026-04-08 16:44:44.130372
3224	805	init( )	t	2026-04-08 16:44:44.130372
3225	805	start( )	f	2026-04-08 16:44:44.130372
3226	806	private	f	2026-04-08 16:44:44.130372
3227	806	final	f	2026-04-08 16:44:44.130372
3228	806	public	t	2026-04-08 16:44:44.130372
3229	806	abstract	f	2026-04-08 16:44:44.130372
3230	807	Internet layer	f	2026-04-08 16:44:44.130372
3231	807	Network access layer	t	2026-04-08 16:44:44.130372
3232	807	Transport layer	f	2026-04-08 16:44:44.130372
3233	807	Application layer	f	2026-04-08 16:44:44.130372
3238	809	Both unipolar encoding and polar encoding techniques are NRZ.	f	2026-04-08 16:44:44.130372
3239	809	Both NRZ-L and NRZ-I changes voltage level when different bit is encountered	f	2026-04-08 16:44:44.130372
3240	809	NRZ-I changes voltage level at when a different bit is encountered	t	2026-04-08 16:44:44.130372
3241	809	NRZ-L changes voltage when a 1 is encountered.	f	2026-04-08 16:44:44.130372
3246	811	Journaling	t	2026-04-08 16:44:44.130372
3247	811	View	f	2026-04-08 16:44:44.130372
3248	811	Backup	f	2026-04-08 16:44:44.130372
3249	811	Encryption	f	2026-04-08 16:44:44.130372
3254	813	It allows you to create Java application that can access data from different types of database systems.	f	2026-04-08 16:44:44.130372
3361	839	$_age=20;	t	2026-04-08 16:44:44.130372
3255	813	It used to connect Java standalone applications with back-end database servers.	f	2026-04-08 16:44:44.130372
3256	813	It uses different predefined java classes and methods to handle various data access functions.	f	2026-04-08 16:44:44.130372
3257	813	Different database systems can use the same JDBC driver, which used to establish the connection interface.	t	2026-04-08 16:44:44.130372
3258	814	final	t	2026-04-08 16:44:44.130372
3259	814	last	f	2026-04-08 16:44:44.130372
3260	814	constant	f	2026-04-08 16:44:44.130372
3261	814	static	f	2026-04-08 16:44:44.130372
3334	833	Possible attributes	f	2026-04-08 16:44:44.130372
3335	833	Possible methods	f	2026-04-08 16:44:44.130372
3336	833	Possible class	t	2026-04-08 16:44:44.130372
3337	833	Well Organized codes	f	2026-04-08 16:44:44.130372
3266	816	Improved transaction throughput	t	2026-04-08 16:44:44.130372
3267	816	Serializability	f	2026-04-08 16:44:44.130372
3268	816	Reduced execution complexity	f	2026-04-08 16:44:44.130372
3269	816	Reduced waiting time	f	2026-04-08 16:44:44.130372
3270	817	255.0.0.0	f	2026-04-08 16:44:44.130372
3271	817	255.255.0.0	f	2026-04-08 16:44:44.130372
3272	817	255.255.255.0	f	2026-04-08 16:44:44.130372
3273	817	all	t	2026-04-08 16:44:44.130372
3274	818	Simplex	f	2026-04-08 16:44:44.130372
3275	818	Half duplex	f	2026-04-08 16:44:44.130372
3276	818	Full duplex	t	2026-04-08 16:44:44.130372
3277	818	all except A	f	2026-04-08 16:44:44.130372
3282	820	Loss Update	f	2026-04-08 16:44:44.130372
3283	820	Incorrect summery	f	2026-04-08 16:44:44.130372
3284	820	Temporary read	f	2026-04-08 16:44:44.130372
3285	820	Unrepeatable read	t	2026-04-08 16:44:44.130372
3286	821	functionName(parameters) {function body}	f	2026-04-08 16:44:44.130372
3287	821	function {function body}	f	2026-04-08 16:44:44.130372
3288	821	function functionName(parameters) {function body}	t	2026-04-08 16:44:44.130372
3289	821	data type functionName(parameters) {function body}	f	2026-04-08 16:44:44.130372
3290	822	nextInt()	f	2026-04-08 16:44:44.130372
3291	822	next()	f	2026-04-08 16:44:44.130372
3292	822	nextLine()	f	2026-04-08 16:44:44.130372
3293	822	nextString()	t	2026-04-08 16:44:44.130372
3294	823	.php	t	2026-04-08 16:44:44.130372
3295	823	.hphp	f	2026-04-08 16:44:44.130372
3296	823	.xml	f	2026-04-08 16:44:44.130372
3297	823	.html	f	2026-04-08 16:44:44.130372
3298	824	Several classes can be declared as sub classes of the same super class	f	2026-04-08 16:44:44.130372
3299	824	Several classes can share the same variable.	f	2026-04-08 16:44:44.130372
3300	824	When we create an object of a sub class, constructor of a subclass executed first and then constructors of super class	t	2026-04-08 16:44:44.130372
3301	824	In inheritance we can have more than one sub class	f	2026-04-08 16:44:44.130372
3302	825	The beginning of transaction	f	2026-04-08 16:44:44.130372
3303	825	The operation not performed	t	2026-04-08 16:44:44.130372
3304	825	The ending of the transaction	f	2026-04-08 16:44:44.130372
3305	825	Transaction status(committed/aborted)	f	2026-04-08 16:44:44.130372
3306	826	Instance methods belong to the class rather than the object of a class.	f	2026-04-08 16:44:44.130372
3307	826	Instance methods can be invoked without the need for creating an instance of a class.	f	2026-04-08 16:44:44.130372
3308	826	A static method can access static data member and can change the value of it.	t	2026-04-08 16:44:44.130372
3309	826	Static methods require an object of its class to be created before it can be called.	f	2026-04-08 16:44:44.130372
3314	828	It is used to make data accessible across all pages of a website	f	2026-04-08 16:44:44.130372
3315	828	echo $_SESSION['email']; is used to display the value of a session variable called email.	f	2026-04-08 16:44:44.130372
3316	828	session_start() function is used to start a session and must be there at the beginning of an index.php page of the website	f	2026-04-08 16:44:44.130372
3317	828	session_unset() function destroys all session variables	t	2026-04-08 16:44:44.130372
3318	829	Array elements 3 4 0 5 will be printed	f	2026-04-08 16:44:44.130372
3319	829	10 7 0 6 will be printed	f	2026-04-08 16:44:44.130372
3320	829	Compile Error will occur	f	2026-04-08 16:44:44.130372
3321	829	10 7 0 6 3 4 0 5 will be printed	t	2026-04-08 16:44:44.130372
3322	830	Isolated	f	2026-04-08 16:44:44.130372
3323	830	Atomicity	t	2026-04-08 16:44:44.130372
3324	830	Consistency	f	2026-04-08 16:44:44.130372
3325	830	Durability	f	2026-04-08 16:44:44.130372
3326	831	172.16.6.2	f	2026-04-08 16:44:44.130372
3327	831	10.123.16.145	f	2026-04-08 16:44:44.130372
3328	831	192.168.14.23	f	2026-04-08 16:44:44.130372
3329	831	All	t	2026-04-08 16:44:44.130372
3330	832	void	t	2026-04-08 16:44:44.130372
3331	832	protected	f	2026-04-08 16:44:44.130372
3332	832	public	f	2026-04-08 16:44:44.130372
3333	832	private	f	2026-04-08 16:44:44.130372
3338	834	base	f	2026-04-08 16:44:44.130372
3339	834	super	t	2026-04-08 16:44:44.130372
3340	834	this	f	2026-04-08 16:44:44.130372
3341	834	upper	f	2026-04-08 16:44:44.130372
3346	836	Polymorphism	f	2026-04-08 16:44:44.130372
3347	836	Inheritance	t	2026-04-08 16:44:44.130372
3348	836	Encapsulation	f	2026-04-08 16:44:44.130372
3349	836	Abstraction	f	2026-04-08 16:44:44.130372
3350	837	Navigational nature of processing.	f	2026-04-08 16:44:44.130372
3351	837	Visualized as a linear arrangement of records	f	2026-04-08 16:44:44.130372
3352	837	Little scope for query optimization	f	2026-04-08 16:44:44.130372
3353	837	High scope of query optimization	t	2026-04-08 16:44:44.130372
3358	839	int stud_age=20;	f	2026-04-08 16:44:44.130372
3359	839	$stud-age=20;	f	2026-04-08 16:44:44.130372
3362	840	Variable names can start with a digit.	f	2026-04-08 16:44:44.130372
3363	840	Some Java keywords can be used as naming a variable	f	2026-04-08 16:44:44.130372
3364	840	Variable names can contain digits 0-9.	t	2026-04-08 16:44:44.130372
3365	840	All variables cannot be changing its value during execution	f	2026-04-08 16:44:44.130372
3366	841	Switch	f	2026-04-08 16:44:44.130372
3367	841	router	f	2026-04-08 16:44:44.130372
3368	841	Hub	t	2026-04-08 16:44:44.130372
3369	841	Bridges	f	2026-04-08 16:44:44.130372
3370	842	createcookie('product','smart phone',time()+(60*60*14),'/','localhost',0);	f	2026-04-08 16:44:44.130372
3371	842	setcookie('product','smart phone',time()+(60*60*2*24),'/','localhost',0);	f	2026-04-08 16:44:44.130372
3372	842	setcookie('product','smart phone',time()+(60*60*24*14),'/','localhost',0);	t	2026-04-08 16:44:44.130372
3373	842	setcookie('product','smart phone',time()+(60*60*24),'/','localhost',0);	f	2026-04-08 16:44:44.130372
3374	843	178.191.0.255	f	2026-04-08 16:44:44.130372
3375	843	178.191.255.255	f	2026-04-08 16:44:44.130372
3376	843	178.191.12.255	f	2026-04-08 16:44:44.130372
3377	843	178.191.1.255	t	2026-04-08 16:44:44.130372
3378	844	Category 5	f	2026-04-08 16:44:44.130372
3379	844	Category 6	f	2026-04-08 16:44:44.130372
3380	844	Category 4	t	2026-04-08 16:44:44.130372
3381	844	Category 3	f	2026-04-08 16:44:44.130372
3382	845	If the given quantum time expired a running process can be interrupted and goes to the ready queue.	f	2026-04-08 16:44:44.130372
3383	845	When a process is created it goes to a ready state immediately.	f	2026-04-08 16:44:44.130372
3384	845	When a process successfully finished its task, it goes to a terminated state	f	2026-04-08 16:44:44.130372
3385	845	all	t	2026-04-08 16:44:44.130372
3386	846	Undo	f	2026-04-08 16:44:44.130372
3387	846	Backup	t	2026-04-08 16:44:44.130372
3388	846	Redo	f	2026-04-08 16:44:44.130372
3389	846	Encryption	f	2026-04-08 16:44:44.130372
3394	848	Recoverable	f	2026-04-08 16:44:44.130372
3395	848	Conflict serializable	f	2026-04-08 16:44:44.130372
3396	848	Non-recoverable	t	2026-04-08 16:44:44.130372
3397	848	Serial	f	2026-04-08 16:44:44.130372
3398	849	strong Entity	f	2026-04-08 16:44:44.130372
3399	849	Weak entity	t	2026-04-08 16:44:44.130372
3400	849	dependent entity	f	2026-04-08 16:44:44.130372
3401	849	Independent	f	2026-04-08 16:44:44.130372
3402	850	Wi-Fi Protected Access	f	2026-04-08 16:44:44.130372
3403	850	Extensible Authentication Protocol	t	2026-04-08 16:44:44.130372
3404	850	Wired Equivalency Protocol	f	2026-04-08 16:44:44.130372
3405	850	Traffic Filtering	f	2026-04-08 16:44:44.130372
3410	852	if...else if	f	2026-04-08 16:44:44.130372
3411	852	for loop	t	2026-04-08 16:44:44.130372
3412	852	nested if	f	2026-04-08 16:44:44.130372
3413	852	if...else	f	2026-04-08 16:44:44.130372
3418	854	Hierarchical Database Model	f	2026-04-08 16:44:44.130372
3419	854	Network Database Model	f	2026-04-08 16:44:44.130372
3420	854	Relational Database Model	f	2026-04-08 16:44:44.130372
3421	854	all of them	t	2026-04-08 16:44:44.130372
3422	855	interface A implements B {}	f	2026-04-08 16:44:44.130372
3423	855	class B implements A {}	t	2026-04-08 16:44:44.130372
3424	855	class B extends A {}	f	2026-04-08 16:44:44.130372
3425	855	interface B extends A {}	f	2026-04-08 16:44:44.130372
3426	856	Transparency	f	2026-04-08 16:44:44.130372
3427	856	tolerance	f	2026-04-08 16:44:44.130372
3428	856	autonomy	t	2026-04-08 16:44:44.130372
3429	856	scalability	f	2026-04-08 16:44:44.130372
3430	857	primary key	f	2026-04-08 16:44:44.130372
3431	857	Foreign key	f	2026-04-08 16:44:44.130372
3432	857	Default	f	2026-04-08 16:44:44.130372
3433	857	Null	t	2026-04-08 16:44:44.130372
3434	858	Data normalization	f	2026-04-08 16:44:44.130372
3435	858	Data distribution (or data allocation)	t	2026-04-08 16:44:44.130372
3436	858	Replication schema	f	2026-04-08 16:44:44.130372
3437	858	Partial replication	f	2026-04-08 16:44:44.130372
3442	860	Relation	f	2026-04-08 16:44:44.130372
3443	860	Domain	t	2026-04-08 16:44:44.130372
3444	860	Tuple	f	2026-04-08 16:44:44.130372
3445	860	Schema	f	2026-04-08 16:44:44.130372
3446	861	Key constraints	f	2026-04-08 16:44:44.130372
3447	861	Entity integrity constraints	f	2026-04-08 16:44:44.130372
3448	861	Referential integrity constraints	f	2026-04-08 16:44:44.130372
3449	861	Application base constraint	t	2026-04-08 16:44:44.130372
3450	862	The lost update problem.	t	2026-04-08 16:44:44.130372
3451	862	The temporary update problem.	f	2026-04-08 16:44:44.130372
3452	862	The incorrect summary problem.	f	2026-04-08 16:44:44.130372
3453	862	The unrepeatable read problem	f	2026-04-08 16:44:44.130372
3454	863	Abort	f	2026-04-08 16:44:44.130372
3455	863	Commit	f	2026-04-08 16:44:44.130372
3456	863	Checkpoint	t	2026-04-08 16:44:44.130372
3457	863	Rollback	f	2026-04-08 16:44:44.130372
3466	866	Data Visualization	f	2026-04-08 16:44:44.130372
3467	866	Unauthorized access	t	2026-04-08 16:44:44.130372
3468	866	Data loss	f	2026-04-08 16:44:44.130372
3469	866	A and B	f	2026-04-08 16:44:44.130372
3470	867	Serializability	f	2026-04-08 16:44:44.130372
3471	867	Read committed	f	2026-04-08 16:44:44.130372
3472	867	Read uncommitted	f	2026-04-08 16:44:44.130372
3473	867	Repeatable read	t	2026-04-08 16:44:44.130372
3474	868	A specific instance of an object with its own data and behavior.	f	2026-04-08 16:44:44.130372
3475	868	A blueprint that defines the properties and methods of similar objects.	t	2026-04-08 16:44:44.130372
3476	868	A function that performs a specific task on an object.	f	2026-04-08 16:44:44.130372
3477	868	A collection of variables that store data used by the program.	f	2026-04-08 16:44:44.130372
3478	869	Inheritance	f	2026-04-08 16:44:44.130372
3479	869	Polymorphism	f	2026-04-08 16:44:44.130372
3480	869	Encapsulation	t	2026-04-08 16:44:44.130372
3481	869	Abstraction	f	2026-04-08 16:44:44.130372
3482	870	It simplifies the modeling process by focusing on a single technique.	f	2026-04-08 16:44:44.130372
3483	870	It provides a more comprehensive view of the system by using different perspectives.	t	2026-04-08 16:44:44.130372
3484	870	It reduces the time required to develop the system model.	f	2026-04-08 16:44:44.130372
3485	870	It introduces unnecessary complexity and confusion for stakeholders.	f	2026-04-08 16:44:44.130372
3486	871	Class diagram	f	2026-04-08 16:44:44.130372
3487	871	Use case diagram	f	2026-04-08 16:44:44.130372
3488	871	State diagram	t	2026-04-08 16:44:44.130372
3489	871	Sequence diagram	f	2026-04-08 16:44:44.130372
3494	873	Class Diagram	f	2026-04-08 16:44:44.130372
3495	873	Sequence Diagram	f	2026-04-08 16:44:44.130372
3496	873	Activity Diagram	f	2026-04-08 16:44:44.130372
3497	873	Use Case Diagram	t	2026-04-08 16:44:44.130372
3498	874	State	f	2026-04-08 16:44:44.130372
3499	874	Event	t	2026-04-08 16:44:44.130372
3500	874	Guard condition	f	2026-04-08 16:44:44.130372
3501	874	Action	f	2026-04-08 16:44:44.130372
3502	875	Generalization	f	2026-04-08 16:44:44.130372
3503	875	Association	t	2026-04-08 16:44:44.130372
3504	875	Aggregation	f	2026-04-08 16:44:44.130372
3505	875	Composition	f	2026-04-08 16:44:44.130372
3506	876	All concrete subclasses must override methods declared in abstract classes.	f	2026-04-08 16:44:44.130372
3507	876	Interfaces can only define abstract methods, while abstract classes can have concrete implementations.	t	2026-04-08 16:44:44.130372
3508	876	Polymorphism is achieved solely through method overloading within the same class.	f	2026-04-08 16:44:44.130372
3509	876	Interfaces promote tight coupling, allowing unrelated classes to share functionality.	f	2026-04-08 16:44:44.130372
3510	877	At run time	f	2026-04-08 16:44:44.130372
3511	877	At compile time	t	2026-04-08 16:44:44.130372
3512	877	At coding time	f	2026-04-08 16:44:44.130372
3513	877	At execution time	f	2026-04-08 16:44:44.130372
3514	878	Data structures and their manipulation.	f	2026-04-08 16:44:44.130372
3515	878	Encapsulating data and behavior within objects.	f	2026-04-08 16:44:44.130372
3516	878	Procedures and functions as the building blocks of programs.	t	2026-04-08 16:44:44.130372
3517	878	Inheritance and polymorphism for code reuse.	f	2026-04-08 16:44:44.130372
3518	879	Data structures are statically allocated	f	2026-04-08 16:44:44.130372
3519	879	Data structures cannot contain objects as elements	f	2026-04-08 16:44:44.130372
3520	879	Data structures can be changed after declaration	t	2026-04-08 16:44:44.130372
3521	879	Data structures cannot be used to represent a database schema	f	2026-04-08 16:44:44.130372
3522	880	Loose coupling, where objects interact through well-defined interfaces	t	2026-04-08 16:44:44.130372
3523	880	Code duplication to avoid unnecessary complexity.	f	2026-04-08 16:44:44.130372
3524	880	Tight coupling between objects, creating dependencies.	f	2026-04-08 16:44:44.130372
3525	880	Global variables for easy access to data across different parts of the system.	f	2026-04-08 16:44:44.130372
3526	881	Encapsulation and Inheritance	f	2026-04-08 16:44:44.130372
3527	881	Inheritance and polymorphism	f	2026-04-08 16:44:44.130372
3528	881	Polymorphism	f	2026-04-08 16:44:44.130372
3529	881	Inheritance	t	2026-04-08 16:44:44.130372
3530	882	Removing Stmt-1 will make the program compilable and it will print 'Base: Hello Derived'	t	2026-04-08 16:44:44.130372
3531	882	Removing both Stmt-1 and Stmt-2 will make the program compilable and it will print 'Base: Hello Derived'	f	2026-04-08 16:44:44.130372
3532	882	Removing Stmt-2 will make the program compilable and it will print 'Hello Derived'	f	2026-04-08 16:44:44.130372
3533	882	Removing Stmt-1 will make the program compilable and it will print 'Base Derived'	f	2026-04-08 16:44:44.130372
3534	883	A value of Final variable cannot be changed.	f	2026-04-08 16:44:44.130372
3535	883	A Final method cannot be overridden	f	2026-04-08 16:44:44.130372
3536	883	A Final method cannot be inherited	t	2026-04-08 16:44:44.130372
3537	883	A Final class cannot be extended	f	2026-04-08 16:44:44.130372
3538	884	Create a base class FileWriter with a writeData(String data) method. Subclasses like TextFileWriter and CSVFileWriter will inherit and implement specific file writing logic for their formats.	f	2026-04-08 16:44:44.130372
3539	884	Use a single FileWriter class with overloaded methods writeData(String data) for text and CSV formats.	f	2026-04-08 16:44:44.130372
3540	884	Write separate functions for writing text and CSV data.	f	2026-04-08 16:44:44.130372
3541	884	Define an interface Writable with a method writeData(String data). Implement separate classes for TextFile and CSVFile, each implementing Writable and having their own file writing logic.	t	2026-04-08 16:44:44.130372
3542	885	The class must have two separate methods named draw().	f	2026-04-08 16:44:44.130372
3543	885	The compiler throws an error due to method name conflict.	f	2026-04-08 16:44:44.130372
3544	885	The class can choose to implement only one draw() method.	t	2026-04-08 16:44:44.130372
3545	885	The class needs to explicitly specify which interface's draw() to implement.	f	2026-04-08 16:44:44.130372
3550	887	It is used to define the object's behavior when explicitly garbage collected.	f	2026-04-08 16:44:44.130372
3551	887	It is called by the garbage collector before an object is reclaimed.	t	2026-04-08 16:44:44.130372
3552	887	It allows for manual memory management.	f	2026-04-08 16:44:44.130372
3553	887	It is called by the constructor of the class.	f	2026-04-08 16:44:44.130372
3554	888	Anyone will be executed first lexographically	f	2026-04-08 16:44:44.130372
3555	888	Both of them will be executed simultaneously	f	2026-04-08 16:44:44.130372
3556	888	None of them will be executed	f	2026-04-08 16:44:44.130372
3557	888	It is dependent on the operating system	t	2026-04-08 16:44:44.130372
3558	889	58881	t	2026-04-08 16:44:44.130372
3559	889	12885	f	2026-04-08 16:44:44.130372
3560	889	12845	f	2026-04-08 16:44:44.130372
3561	889	54881	f	2026-04-08 16:44:44.130372
3570	892	Python	f	2026-04-08 16:44:44.130372
3571	892	Java	f	2026-04-08 16:44:44.130372
3572	892	JavaScript	t	2026-04-08 16:44:44.130372
3573	892	C++	f	2026-04-08 16:44:44.130372
3574	893	To add interactivity to web pages	f	2026-04-08 16:44:44.130372
3575	893	To define the structure and content of web pages	t	2026-04-08 16:44:44.130372
3576	893	To handle communication between server and client	f	2026-04-08 16:44:44.130372
3577	893	To create animations and graphics	f	2026-04-08 16:44:44.130372
3582	895	Validating user input on the client-side to prevent malicious code injection	t	2026-04-08 16:44:44.130372
3583	895	Encrypting sensitive data like credit card and session information on the server-side	f	2026-04-08 16:44:44.130372
3584	895	Using secure protocols like HTTPS for communication	f	2026-04-08 16:44:44.130372
3585	896	Use JavaScript to check for uniqueness before submitting the form	f	2026-04-08 16:44:44.130372
3586	896	Write server-side code to query the database for existing usernames before storing the new one.	t	2026-04-08 16:44:44.130372
3587	896	rely on the database to handle duplicate entries automatically.	f	2026-04-08 16:44:44.130372
3588	896	There's no way to guarantee uniqueness in a web application.	f	2026-04-08 16:44:44.130372
3589	897	Client-side validation with JavaScript and server-side processing using HTML forms.	t	2026-04-08 16:44:44.130372
3590	897	Only client-side validation with JavaScript for a more responsive experience.	f	2026-04-08 16:44:44.130372
3591	897	Only server-side validation to avoid user manipulation of data.	f	2026-04-08 16:44:44.130372
3592	897	Client-side validation with JavaScript, but storing data directly in the browser for security reasons.	f	2026-04-08 16:44:44.130372
3593	898	The button should submit a form to the server for processing.	f	2026-04-08 16:44:44.130372
3594	898	Use JavaScript to handle the button click event and perform actions like displaying animations or updating content dynamically on the page.	f	2026-04-08 16:44:44.130372
3595	898	Re-render the entire page using JavaScript to simulate interactivity.	t	2026-04-08 16:44:44.130372
3596	898	Client-side scripting cannot handle button clicks without server interaction.	f	2026-04-08 16:44:44.130372
3601	900	Display all images in full resolution on a single page, potentially causing slow loading times.	f	2026-04-08 16:44:44.130372
3602	900	Use a single, large image file containing all photos.	f	2026-04-08 16:44:44.130372
3603	900	Implement a database to manage image information and utilize thumbnails for browsing with options to view full-size versions on demand.	t	2026-04-08 16:44:44.130372
3604	900	Upload all images directly into HTML code.	f	2026-04-08 16:44:44.130372
3605	901	Create static HTML pages for each news article, requiring manual updates for new content.	f	2026-04-08 16:44:44.130372
3606	901	Develop a content management system (CMS) allowing for easy content creation, editing, and organization for a dynamic website.	t	2026-04-08 16:44:44.130372
3607	901	Rely on users to submit news articles directly through HTML forms, leading to potential quality and security issues.	f	2026-04-08 16:44:44.130372
3608	901	Use a single, long webpage with all news articles listed chronologically, making navigation challenging for older content.	f	2026-04-08 16:44:44.130372
3609	902	No concurrency controls	f	2026-04-08 16:44:44.130372
3610	902	Semaphores: Signaling mechanism for controlling access to shared resources, a viable option.	t	2026-04-08 16:44:44.130372
3611	902	Cookies: Used for client-side state management.	f	2026-04-08 16:44:44.130372
3612	902	Hyperlinks: Used for linking web pages	f	2026-04-08 16:44:44.130372
3613	903	Increase server hardware resources without understanding the root cause of the problem.	f	2026-04-08 16:44:44.130372
3614	903	Use profiling tools to identify sections of code causing concurrency bottlenecks and optimize them.	t	2026-04-08 16:44:44.130372
3615	903	Limit the number of concurrent clients accessing the server, potentially impacting user experience.	f	2026-04-08 16:44:44.130372
3616	903	Rewrite the entire system from scratch without a clear understanding of the existing issues.	f	2026-04-08 16:44:44.130372
3621	905	Planning quality	t	2026-04-08 16:44:44.130372
3622	905	Quality assurance	f	2026-04-08 16:44:44.130372
3623	905	Perform quality control	f	2026-04-08 16:44:44.130372
3624	905	Statistical analysis	f	2026-04-08 16:44:44.130372
3625	906	Ask his client to pay for the completed project deliverables.	f	2026-04-08 16:44:44.130372
3626	906	Award all of his project team members for such a great accomplishment.	f	2026-04-08 16:44:44.130372
3627	906	Offer a party for his project team and client to celebrate the success of the project.	f	2026-04-08 16:44:44.130372
3628	906	Ask his client to conduct an inspection on all of the completed project deliverables.	t	2026-04-08 16:44:44.130372
3637	909	Pareto diagram	f	2026-04-08 16:44:44.130372
3638	909	PERT chart	f	2026-04-08 16:44:44.130372
3639	909	Control chart	t	2026-04-08 16:44:44.130372
3640	909	HR personnel chart	f	2026-04-08 16:44:44.130372
3641	910	192.168.1.16/28 and 192.168.1.64/27	t	2026-04-08 16:44:44.130372
3642	910	192.168.1.64/27 and 192.168.1.128/27	f	2026-04-08 16:44:44.130372
3643	910	192.168.1.64/27 and 192.168.1.96/28	f	2026-04-08 16:44:44.130372
3644	910	192.168.1.96/28 and 192.168.1.192/28	f	2026-04-08 16:44:44.130372
3645	911	Internetwork	f	2026-04-08 16:44:44.130372
3646	911	Session	f	2026-04-08 16:44:44.130372
3647	911	Application	t	2026-04-08 16:44:44.130372
3648	911	Presentation	f	2026-04-08 16:44:44.130372
3649	912	When a client sends a segment to a server	f	2026-04-08 16:44:44.130372
3650	912	When all the data must be fully received before any part of it is considered useful	f	2026-04-08 16:44:44.130372
3651	912	When an application can tolerate some loss of data during transmission	t	2026-04-08 16:44:44.130372
3652	912	When segments must arrive in a very specific sequence to be processed successfully	f	2026-04-08 16:44:44.130372
3661	915	ping	t	2026-04-08 16:44:44.130372
3662	915	ipconfig	f	2026-04-08 16:44:44.130372
3663	915	show interfaces	f	2026-04-08 16:44:44.130372
3664	915	show ip interface brief	f	2026-04-08 16:44:44.130372
3665	916	Coaxial Cable	f	2026-04-08 16:44:44.130372
3666	916	Twisted Pair Cable	f	2026-04-08 16:44:44.130372
3667	916	Satellite	f	2026-04-08 16:44:44.130372
3668	916	Fiber Optic	t	2026-04-08 16:44:44.130372
3669	917	Encapsulation	t	2026-04-08 16:44:44.130372
3670	917	Flow control	f	2026-04-08 16:44:44.130372
3671	917	Access method	f	2026-04-08 16:44:44.130372
3672	917	Response timeout	f	2026-04-08 16:44:44.130372
3673	918	Hosts always have the same IP address and are therefore always reachable.	f	2026-04-08 16:44:44.130372
3674	918	DHCP allows users to refer to locations by a name rather than an IP address.	f	2026-04-08 16:44:44.130372
3675	918	Hosts can connect to the network and get an IP address without manual configuration.	t	2026-04-08 16:44:44.130372
3676	918	Duplicate addresses cannot occur on a network that issues dynamic addresses using DHCP and has static assignments.	f	2026-04-08 16:44:44.130372
3677	919	To display a message when a user accesses the switch	t	2026-04-08 16:44:44.130372
3678	919	To configure switch SW2 so that only the users in the admin group can telnet into SW2	f	2026-04-08 16:44:44.130372
3679	919	To force users of the admin group to enter a password for authentication	f	2026-04-08 16:44:44.130372
3680	919	To configure switch SW2 so that the message will display when a user enters the enable command	f	2026-04-08 16:44:44.130372
3681	920	A router	t	2026-04-08 16:44:44.130372
3682	920	A firewall	f	2026-04-08 16:44:44.130372
3683	920	A web server	f	2026-04-08 16:44:44.130372
3684	920	A DSL modems	f	2026-04-08 16:44:44.130372
3689	922	Ping and traceroute	f	2026-04-08 16:44:44.130372
3690	922	SNMP and NetFlow	f	2026-04-08 16:44:44.130372
3691	922	Wireshark and tcpdump	f	2026-04-08 16:44:44.130372
3692	922	All	t	2026-04-08 16:44:44.130372
3693	923	Alerts, and Critical	f	2026-04-08 16:44:44.130372
3694	923	Alerts, Errors and, Emergency	f	2026-04-08 16:44:44.130372
3695	923	Critical, Alert, and Emergency	t	2026-04-08 16:44:44.130372
3696	923	Critical, Error, and Emergency	f	2026-04-08 16:44:44.130372
3697	924	Firewall	t	2026-04-08 16:44:44.130372
3698	924	Router	f	2026-04-08 16:44:44.130372
3699	924	Switch	f	2026-04-08 16:44:44.130372
3700	924	Transparent Bridge	f	2026-04-08 16:44:44.130372
3701	925	copy running-config tftp	f	2026-04-08 16:44:44.130372
3702	925	copy tftp running-config	f	2026-04-08 16:44:44.130372
3703	925	copy startup-config tftp	t	2026-04-08 16:44:44.130372
3704	925	copy tftp startup-config	f	2026-04-08 16:44:44.130372
3713	928	Trunk mode	f	2026-04-08 16:44:44.130372
3714	928	Access mode	t	2026-04-08 16:44:44.130372
3715	928	Native mode	f	2026-04-08 16:44:44.130372
3716	928	VLAN mode	f	2026-04-08 16:44:44.130372
3717	929	Activity	f	2026-04-08 16:44:44.130372
3718	929	Service	f	2026-04-08 16:44:44.130372
3719	929	Content provider	f	2026-04-08 16:44:44.130372
3720	929	Layout	t	2026-04-08 16:44:44.130372
3721	930	onCreate()	f	2026-04-08 16:44:44.130372
3722	930	onResume()	t	2026-04-08 16:44:44.130372
3723	930	onDestroy()	f	2026-04-08 16:44:44.130372
3724	930	onPause()	f	2026-04-08 16:44:44.130372
3725	931	bt.setOnClickListener(new View.OnClickListener() { Toast.maketext(contex,'Hello mock',Toast.LENGTH_LONG).show(); @Override public void onClick(View view) {} });	f	2026-04-08 16:44:44.130372
3726	931	bt.setOnClickListener(new View.OnClickListener() { @Override public void onClick(View view) { Toast.maketext('Hello mock',contex, Toast.LENGTH_LONG).show(); } });	f	2026-04-08 16:44:44.130372
3727	931	bt.setOnClickListener(new View.OnClickListener() { @Override public void onClick(View view) { Toast.maketext(contex, 'Hello mock', Toast.LENGTH_LONG).show(); } });	t	2026-04-08 16:44:44.130372
3728	931	None	f	2026-04-08 16:44:44.130372
3729	932	Media player	f	2026-04-08 16:44:44.130372
3730	932	Canvas	t	2026-04-08 16:44:44.130372
3731	932	Drawer	f	2026-04-08 16:44:44.130372
3732	932	None	f	2026-04-08 16:44:44.130372
3733	933	Canvas	f	2026-04-08 16:44:44.130372
3734	933	Paint	t	2026-04-08 16:44:44.130372
3735	933	MediaEncoder	f	2026-04-08 16:44:44.130372
3736	933	None	f	2026-04-08 16:44:44.130372
3745	936	Textview	f	2026-04-08 16:44:44.130372
3746	936	Imageview	f	2026-04-08 16:44:44.130372
3747	936	Listview	t	2026-04-08 16:44:44.130372
3748	936	Edittext	f	2026-04-08 16:44:44.130372
3749	937	NAT	f	2026-04-08 16:44:44.130372
3750	937	VPN	f	2026-04-08 16:44:44.130372
3751	937	DMZ	f	2026-04-08 16:44:44.130372
3752	937	VLAN	t	2026-04-08 16:44:44.130372
3753	938	Adding them to the Administrators group	t	2026-04-08 16:44:44.130372
3754	938	Changing their password	f	2026-04-08 16:44:44.130372
3755	938	Enabling Remote Desktop	f	2026-04-08 16:44:44.130372
3756	938	None of the above	f	2026-04-08 16:44:44.130372
3757	939	Using the groupmod command	f	2026-04-08 16:44:44.130372
3758	939	Using the usermod command	t	2026-04-08 16:44:44.130372
3759	939	Using the passwd command	f	2026-04-08 16:44:44.130372
3760	939	Using the chown command	f	2026-04-08 16:44:44.130372
3761	940	Using the System Configuration tool	f	2026-04-08 16:44:44.130372
3762	940	Using the System Restore feature	f	2026-04-08 16:44:44.130372
3763	940	Using the Command Prompt	f	2026-04-08 16:44:44.130372
3764	940	Using the Backup and Restore tool	t	2026-04-08 16:44:44.130372
3765	941	Remote Desktop Connection	t	2026-04-08 16:44:44.130372
3766	941	Terminal	f	2026-04-08 16:44:44.130372
3767	941	SSH	f	2026-04-08 16:44:44.130372
3768	941	Telnet	f	2026-04-08 16:44:44.130372
3781	945	PCI	f	2026-04-08 16:44:44.130372
3782	945	SCSI	f	2026-04-08 16:44:44.130372
3783	945	AGP	t	2026-04-08 16:44:44.130372
3784	945	PCI-e	f	2026-04-08 16:44:44.130372
3785	946	Port replicator	f	2026-04-08 16:44:44.130372
3786	946	USB hub	f	2026-04-08 16:44:44.130372
3787	946	Mobile PCI Express Module	f	2026-04-08 16:44:44.130372
3788	946	Docking station	t	2026-04-08 16:44:44.130372
3789	947	Regularly defragmenting the hard drive	f	2026-04-08 16:44:44.130372
3790	947	Ensuring proper ventilation and cleaning dust off the system fans	t	2026-04-08 16:44:44.130372
3791	947	Installing a high-quality antivirus program	f	2026-04-08 16:44:44.130372
3792	947	Upgrading the RAM	f	2026-04-08 16:44:44.130372
3793	948	Graphics Card	t	2026-04-08 16:44:44.130372
3794	948	CPU	f	2026-04-08 16:44:44.130372
3795	948	Motherboard	f	2026-04-08 16:44:44.130372
3796	948	Power Supply Unit	f	2026-04-08 16:44:44.130372
3797	949	Class A	f	2026-04-08 16:44:44.130372
3798	949	Class B	f	2026-04-08 16:44:44.130372
3799	949	Class ABC	f	2026-04-08 16:44:44.130372
3800	949	Class D	t	2026-04-08 16:44:44.130372
3805	951	CustomerDataset.Fill(CustomerDataAdapter)	f	2026-04-08 16:44:44.130372
3806	951	CustomerDataAdapter.Fill(CustomerDataset)	t	2026-04-08 16:44:44.130372
3807	951	CustomerDataset.Load(CustomerDataAdapter)	f	2026-04-08 16:44:44.130372
3808	951	CustomerDataAdapter.Load(CustomerDataset)	f	2026-04-08 16:44:44.130372
3809	952	Standard programming only works with text-based interfaces	f	2026-04-08 16:44:44.130372
3810	952	Event-driven programming doesn't require user input	f	2026-04-08 16:44:44.130372
3811	952	Standard programming is faster than event-driven programming	f	2026-04-08 16:44:44.130372
3812	952	Event-driven programming relies on the actions of the user	t	2026-04-08 16:44:44.130372
3813	953	Use the StrComp function with a comparison type of vbTextCompare	f	2026-04-08 16:44:44.130372
3814	953	Use the = operator with the ComparisonOption.IgnoreCase option	f	2026-04-08 16:44:44.130372
3815	953	Use the Compare method with a StringComparison type of OrdinalIgnoreCase	t	2026-04-08 16:44:44.130372
3816	953	You cannot perform case-insensitive string comparison in VB.NET	f	2026-04-08 16:44:44.130372
3825	956	Data Provider for SQL Server-> System.Data.MySqlClient	t	2026-04-08 16:44:44.130372
3826	956	Data Provider for Oracle->System.Data.OracleClient	f	2026-04-08 16:44:44.130372
3827	956	Data Provider for OLEDB->System.Data.OleDb	f	2026-04-08 16:44:44.130372
3828	956	Data Provider for ODBC->System.Data.Odbc	f	2026-04-08 16:44:44.130372
3829	957	When we want to connect to the Oracle database.	f	2026-04-08 16:44:44.130372
3830	957	When we want to connect to the Sql server database	f	2026-04-08 16:44:44.130372
3831	957	When we want to connect to Microsoft Access database	f	2026-04-08 16:44:44.130372
3832	957	When we want to connect to the MySql server database	t	2026-04-08 16:44:44.130372
3837	959	Value parameter	f	2026-04-08 16:44:44.130372
3838	959	reference parameter	f	2026-04-08 16:44:44.130372
3839	959	Out parameter	t	2026-04-08 16:44:44.130372
3840	959	Array parameter	f	2026-04-08 16:44:44.130372
3841	960	121	f	2026-04-08 16:44:44.130372
3842	960	144	f	2026-04-08 16:44:44.130372
3843	960	132	t	2026-04-08 16:44:44.130372
3844	960	100	f	2026-04-08 16:44:44.130372
3853	963	Encapsulation	f	2026-04-08 16:44:44.130372
3854	963	Abstraction	t	2026-04-08 16:44:44.130372
3855	963	Inheritance	f	2026-04-08 16:44:44.130372
3856	963	Polymorphism	f	2026-04-08 16:44:44.130372
3857	964	Single inheritance	f	2026-04-08 16:44:44.130372
3858	964	Multiple inheritances	t	2026-04-08 16:44:44.130372
3859	964	Hierarchical inheritance	f	2026-04-08 16:44:44.130372
3860	964	Hybrid Inheritance	f	2026-04-08 16:44:44.130372
3865	966	Statement	f	2026-04-08 16:44:44.130372
3866	966	StatemetSets	f	2026-04-08 16:44:44.130372
3867	966	Result	f	2026-04-08 16:44:44.130372
3868	966	ResultSet	t	2026-04-08 16:44:44.130372
3869	967	Type IV driver	t	2026-04-08 16:44:44.130372
3870	967	Type I driver	f	2026-04-08 16:44:44.130372
3871	967	Type III driver	f	2026-04-08 16:44:44.130372
3872	967	Type II driver	f	2026-04-08 16:44:44.130372
3873	968	The Class.forName('sun.jdbc.odbc.JdbcOdbcDriver') driver loading is used to connecting to Microsoft Access database	f	2026-04-08 16:44:44.130372
3874	968	The Class.forName('com.cloudscape.core.JDBCDriver') driver loading is used to connecting to Cloudscape database	f	2026-04-08 16:44:44.130372
3875	968	The Class.forName('com.mysql.jdbc.Driver') driver loading is used to connecting to SQL server database	t	2026-04-08 16:44:44.130372
3876	968	The Class.forName('oracle.jdbc.driver.OracleDriver') driver loading is used to connecting to oracle database	f	2026-04-08 16:44:44.130372
3881	970	Integer	t	2026-04-08 16:44:44.130372
3882	970	Array	f	2026-04-08 16:44:44.130372
3883	970	Class	f	2026-04-08 16:44:44.130372
3884	970	List	f	2026-04-08 16:44:44.130372
3885	970	None	f	2026-04-08 16:44:44.130372
3886	971	Class loaded -> Default constructor -> static variables -> non static variables and methods	f	2026-04-08 16:44:44.130372
3887	971	Main method -> Class loaded -> Parameterized constructor	f	2026-04-08 16:44:44.130372
3888	971	Class loaded -> static variables and methods -> constructor -> non static variables and methods	t	2026-04-08 16:44:44.130372
3889	971	Class loaded -> Instance Variables -> constructor -> non static variables and methods	f	2026-04-08 16:44:44.130372
3890	971	A and C	f	2026-04-08 16:44:44.130372
3891	971	C and D	f	2026-04-08 16:44:44.130372
3892	972	javac	f	2026-04-08 16:44:44.130372
3893	972	javarmic	f	2026-04-08 16:44:44.130372
3894	972	rmi	f	2026-04-08 16:44:44.130372
3895	972	rmic	t	2026-04-08 16:44:44.130372
3896	972	None	f	2026-04-08 16:44:44.130372
3897	973	Is an object act as getaway for the client side	t	2026-04-08 16:44:44.130372
3898	973	It read the parameter for the remote method and Unmarshals it	f	2026-04-08 16:44:44.130372
3899	973	It communicate directly with the stub objects	f	2026-04-08 16:44:44.130372
3900	973	All the incoming requests are routed through it.	f	2026-04-08 16:44:44.130372
3901	973	A and C	f	2026-04-08 16:44:44.130372
3902	973	A and D	f	2026-04-08 16:44:44.130372
3903	974	Panel	t	2026-04-08 16:44:44.130372
3904	974	Frame	f	2026-04-08 16:44:44.130372
3905	974	java.awt	f	2026-04-08 16:44:44.130372
3906	974	javax.wing	f	2026-04-08 16:44:44.130372
3907	974	all	f	2026-04-08 16:44:44.130372
3908	975	new Jframe('Hello GUI')	f	2026-04-08 16:44:44.130372
3909	975	JFrame frame = new JFrame('Hello GUI')	f	2026-04-08 16:44:44.130372
3910	975	frame.setText('Hello GUI')	f	2026-04-08 16:44:44.130372
3911	975	A and B	t	2026-04-08 16:44:44.130372
3912	975	All	f	2026-04-08 16:44:44.130372
3913	976	remote Object	f	2026-04-08 16:44:44.130372
3914	976	stub	f	2026-04-08 16:44:44.130372
3915	976	skeleton	t	2026-04-08 16:44:44.130372
3916	976	rmic	f	2026-04-08 16:44:44.130372
3917	976	All	f	2026-04-08 16:44:44.130372
3918	977	BlackBerry OS	t	2026-04-08 16:44:44.130372
3919	977	Symbian OS	f	2026-04-08 16:44:44.130372
3920	977	Harmony OS	f	2026-04-08 16:44:44.130372
3921	977	Bada OS	f	2026-04-08 16:44:44.130372
3926	979	Determine the target audience for your app.	f	2026-04-08 16:44:44.130372
3927	979	Examine the competition.	f	2026-04-08 16:44:44.130372
3928	979	Establish the app's aims and objectives.	f	2026-04-08 16:44:44.130372
3929	979	Identifying the talents required for your app development initiative.	t	2026-04-08 16:44:44.130372
3930	980	onCreate()	f	2026-04-08 16:44:44.130372
3931	980	onResume()	t	2026-04-08 16:44:44.130372
3932	980	onStart()	f	2026-04-08 16:44:44.130372
3933	980	onPause()	f	2026-04-08 16:44:44.130372
3938	982	SQLlite	f	2026-04-08 16:44:44.130372
3939	982	Preferences	t	2026-04-08 16:44:44.130372
3940	982	Internal Storage	f	2026-04-08 16:44:44.130372
3941	982	External Storage	f	2026-04-08 16:44:44.130372
3946	984	Considering the broad need of the organization	f	2026-04-08 16:44:44.130372
3947	984	By categorizing the project based opportunity, directive and problem.	f	2026-04-08 16:44:44.130372
3948	984	Weighing score method	f	2026-04-08 16:44:44.130372
3949	984	All.	t	2026-04-08 16:44:44.130372
3950	985	Bad control of financial, physical, and human resources	f	2026-04-08 16:44:44.130372
3951	985	Improved customer relations	t	2026-04-08 16:44:44.130372
3952	985	Longer development times	f	2026-04-08 16:44:44.130372
3953	985	Higher costs	f	2026-04-08 16:44:44.130372
3954	986	scope, time, cost, and quality are facilitating knowledge area	f	2026-04-08 16:44:44.130372
3955	986	scope, time, cost, and quality are the key knowledge area	t	2026-04-08 16:44:44.130372
3956	986	project integration management is facilitating knowledge area	f	2026-04-08 16:44:44.130372
3957	986	All.	f	2026-04-08 16:44:44.130372
3966	989	Requires customer satisfaction	f	2026-04-08 16:44:44.130372
3967	989	Prefers to inspection to prevention	f	2026-04-08 16:44:44.130372
3968	989	Unaware of management responsibility for quality	t	2026-04-08 16:44:44.130372
3969	989	None.	f	2026-04-08 16:44:44.130372
3982	993	Virtual Private Network (VPN)	f	2026-04-08 16:44:44.130372
3983	993	Reverse Proxy	f	2026-04-08 16:44:44.130372
3984	993	Content Filter Proxy	t	2026-04-08 16:44:44.130372
3985	993	Load Balancer	f	2026-04-08 16:44:44.130372
3986	994	Remote Desktop Connection	f	2026-04-08 16:44:44.130372
3987	994	Virtual Private Network (VPN)	f	2026-04-08 16:44:44.130372
3988	994	Telnet	t	2026-04-08 16:44:44.130372
3989	994	File Transfer Protocol (FTP)	f	2026-04-08 16:44:44.130372
3990	995	SMTP	f	2026-04-08 16:44:44.130372
3991	995	POP3	f	2026-04-08 16:44:44.130372
3992	995	IMAP	f	2026-04-08 16:44:44.130372
3993	995	TLS	t	2026-04-08 16:44:44.130372
3994	996	Regularly updating software and security patches	f	2026-04-08 16:44:44.130372
3995	996	Disabling unnecessary network services	f	2026-04-08 16:44:44.130372
3996	996	Running processes with root privileges	t	2026-04-08 16:44:44.130372
3997	996	Configuring a firewall	f	2026-04-08 16:44:44.130372
3998	997	FAT32	f	2026-04-08 16:44:44.130372
3999	997	NTFS	f	2026-04-08 16:44:44.130372
4000	997	Ext4	t	2026-04-08 16:44:44.130372
4001	997	HFS+	f	2026-04-08 16:44:44.130372
4002	998	The DEFAULT constraint defines the initial value in a column: the value that will appear if you don't insert anything.	f	2026-04-08 16:44:44.130372
4003	998	Constraints are used to enforce data integrity in a relational database.	f	2026-04-08 16:44:44.130372
4004	998	Each column in the table has a specific data type, so it's possible to insert text into a column with INT type or a decimal number into a column with BOOLEAN type data.	t	2026-04-08 16:44:44.130372
4005	998	None of the above	f	2026-04-08 16:44:44.130372
4010	1000	Create a new table (which is the associative entity) and post primary key or candidate key from each entity as attributes in the new table along with some additional attributes	f	2026-04-08 16:44:44.130372
4011	1000	Post the primary key or candidate key from the 'one' side as a foreign key attribute to the 'many' side.	t	2026-04-08 16:44:44.130372
4012	1000	All the attributes are merged into a single table. Which means one can post the primary key or candidate key of one of the relations to the other as a foreign key.	f	2026-04-08 16:44:44.130372
4013	1000	None	f	2026-04-08 16:44:44.130372
4014	1001	Global transaction	t	2026-04-08 16:44:44.130372
4015	1001	Parallel transaction	f	2026-04-08 16:44:44.130372
4016	1001	Local transaction	f	2026-04-08 16:44:44.130372
4017	1001	None	f	2026-04-08 16:44:44.130372
4018	1002	Shared nothing	f	2026-04-08 16:44:44.130372
4019	1002	Parallel DBMS	f	2026-04-08 16:44:44.130372
4020	1002	Shared disk	t	2026-04-08 16:44:44.130372
4021	1002	Multi-database system	f	2026-04-08 16:44:44.130372
4022	1003	Filtering	f	2026-04-08 16:44:44.130372
4023	1003	Poly-instantiation	t	2026-04-08 16:44:44.130372
4024	1003	Fragmentation	f	2026-04-08 16:44:44.130372
4025	1003	Concurrency control	f	2026-04-08 16:44:44.130372
4026	1004	Steal/No-Force (Redo/Undo)	f	2026-04-08 16:44:44.130372
4027	1004	No-Steal/Force (Undo/No-redo)	t	2026-04-08 16:44:44.130372
4028	1004	Force/Steal (No-undo/Redo)	f	2026-04-08 16:44:44.130372
4029	1004	No-Steal/Force (No-undo/No-redo)	f	2026-04-08 16:44:44.130372
4030	1005	A vertical fragment is produced by specifying a predicate that performs a restriction on the tuples in the relation.	f	2026-04-08 16:44:44.130372
4031	1005	A horizontal fragment is defined using the Projection operation of the relational algebra	f	2026-04-08 16:44:44.130372
4032	1005	In vertical fragmentation all schemas must contain a common candidate key (or superkey) to ensure lossless join property	t	2026-04-08 16:44:44.130372
4033	1005	Horizontal fragmentation is a subset of a relation which is created by a subset of columns.	f	2026-04-08 16:44:44.130372
4038	1007	MAC implements zero-trust principles with its control mechanisms.	f	2026-04-08 16:44:44.130372
4039	1007	It considered the strictest of all levels of access control systems.	f	2026-04-08 16:44:44.130372
4040	1007	Manual configuration of security levels and clearances requires constant attention from administrators.	f	2026-04-08 16:44:44.130372
4041	1007	Users can configure data access parameters without administrators	t	2026-04-08 16:44:44.130372
4046	1009	TCP organizes data so that it can be transmitted between a server and a client.	f	2026-04-08 16:44:44.130372
4047	1009	It guarantees the integrity of the data being transmitted over the network	f	2026-04-08 16:44:44.130372
4048	1009	Compared to user datagram protocol, transmission control protocol establishes a low latency between applications	t	2026-04-08 16:44:44.130372
4049	1009	TCP can be an expensive network tool as it includes absent or corrupted packets	f	2026-04-08 16:44:44.130372
4150	1033	By installing a jumper	f	2026-04-08 16:44:44.130372
4054	1011	Variable used in the code doesn't exist	f	2026-04-08 16:44:44.130372
4055	1011	Variable is not assigned to any value	f	2026-04-08 16:44:44.130372
4056	1011	Property does not exist.	f	2026-04-08 16:44:44.130372
4057	1011	All	t	2026-04-08 16:44:44.130372
4058	1012	Session is a small file that the server is embedding on the user's computer	t	2026-04-08 16:44:44.130372
4059	1012	It is recommended to check if cookie is set or not before trying to access its values	f	2026-04-08 16:44:44.130372
4060	1012	Session_distroy() function is the function used to destroy a session without using any arguments	f	2026-04-08 16:44:44.130372
4061	1012	None of the above	f	2026-04-08 16:44:44.130372
4062	1013	<p>a=a*b<sup>2</sup>+c<sup>2</sup></p>	f	2026-04-08 16:44:44.130372
4063	1013	<p>a<sup>2</sup>=a*b<sup>2</sup>+c<sup>2</sup></p>	t	2026-04-08 16:44:44.130372
4064	1013	<p>a<sub>2</sub>=a*b<sub>2</sub>+c<sub>2</sub></p>	f	2026-04-08 16:44:44.130372
4065	1013	<p>a<sup>2</sup>=a*<sup>b2</sup>+<sup>c2</sup></p>	f	2026-04-08 16:44:44.130372
4070	1015	Session	t	2026-04-08 16:44:44.130372
4071	1015	cookies	f	2026-04-08 16:44:44.130372
4072	1015	Request	f	2026-04-08 16:44:44.130372
4073	1015	Post	f	2026-04-08 16:44:44.130372
4074	1015	All	f	2026-04-08 16:44:44.130372
4075	1016	Otherwise, the server could never see if it set a cookie on the browser	f	2026-04-08 16:44:44.130372
4076	1016	Otherwise, the server would have to send a separate request when it needed to check a cookie value	f	2026-04-08 16:44:44.130372
4077	1016	The browser initiates all contact with the server, the server cannot send a request to the browser	t	2026-04-08 16:44:44.130372
4078	1016	All of the above are true	f	2026-04-08 16:44:44.130372
4084	1018	Server Scripting language	f	2026-04-08 16:44:44.130372
4085	1018	Java Scripting Language	f	2026-04-08 16:44:44.130372
4086	1018	Hypertext Preprocessor	f	2026-04-08 16:44:44.130372
4087	1018	A and c	t	2026-04-08 16:44:44.130372
4088	1018	A and B	f	2026-04-08 16:44:44.130372
4089	1018	All	f	2026-04-08 16:44:44.130372
4090	1019	function	f	2026-04-08 16:44:44.130372
4091	1019	variable	f	2026-04-08 16:44:44.130372
4092	1019	Operation	f	2026-04-08 16:44:44.130372
4093	1019	operators	t	2026-04-08 16:44:44.130372
4094	1019	All	f	2026-04-08 16:44:44.130372
4095	1019	None	f	2026-04-08 16:44:44.130372
4096	1020	openfile()	f	2026-04-08 16:44:44.130372
4097	1020	fileOpen()	f	2026-04-08 16:44:44.130372
4098	1020	openf()	f	2026-04-08 16:44:44.130372
4099	1020	fopen()	t	2026-04-08 16:44:44.130372
4100	1020	All	f	2026-04-08 16:44:44.130372
4101	1020	None	f	2026-04-08 16:44:44.130372
4102	1021	Event logging	f	2026-04-08 16:44:44.130372
4103	1021	Intrusion detection tool	f	2026-04-08 16:44:44.130372
4104	1021	File system integrity monitoring tool	t	2026-04-08 16:44:44.130372
4105	1021	Log analysis tool	f	2026-04-08 16:44:44.130372
4106	1022	Public key algorithms for data confidentiality and MD5 or SHA1 for data integrity.	f	2026-04-08 16:44:44.130372
4107	1022	Symmetric key algorithms for key exchange and message authentication codes for authentication	f	2026-04-08 16:44:44.130372
4108	1022	Message authentication codes for data integrity and symmetric key algorithms for data confidentiality.	t	2026-04-08 16:44:44.130372
4109	1022	Public key algorithms for key exchange and Diffie-Hellman for data integrity.	f	2026-04-08 16:44:44.130372
4114	1024	Threat	f	2026-04-08 16:44:44.130372
4115	1024	Attack	f	2026-04-08 16:44:44.130372
4116	1024	Exploit	t	2026-04-08 16:44:44.130372
4117	1024	Vulnerability	f	2026-04-08 16:44:44.130372
4122	1026	Access matrix	f	2026-04-08 16:44:44.130372
4123	1026	Mandatory access control (MAC)	f	2026-04-08 16:44:44.130372
4124	1026	Discretionary access control (DAC)	f	2026-04-08 16:44:44.130372
4125	1026	Role based access control (RBAC)	t	2026-04-08 16:44:44.130372
4126	1027	The system must be evaluated according to established evaluation criteria	t	2026-04-08 16:44:44.130372
4127	1027	A formal management decision is required before the system can be used	f	2026-04-08 16:44:44.130372
4128	1027	Penetration tests must be performed against the system	f	2026-04-08 16:44:44.130372
4129	1027	A code review must be performed against the system	f	2026-04-08 16:44:44.130372
4130	1028	Dynamic random access memory (DRAM)	f	2026-04-08 16:44:44.130372
4131	1028	Static random Access memory (SRAM)	t	2026-04-08 16:44:44.130372
4132	1028	Programmable read only memory (PROM)	f	2026-04-08 16:44:44.130372
4133	1028	Electric erasable read only memory (EEROM)	f	2026-04-08 16:44:44.130372
4142	1031	Random access memory	f	2026-04-08 16:44:44.130372
4143	1031	Virtual memory	t	2026-04-08 16:44:44.130372
4144	1031	Cache memory	f	2026-04-08 16:44:44.130372
4145	1031	Read only memory	f	2026-04-08 16:44:44.130372
4151	1033	By installing a terminator plug	f	2026-04-08 16:44:44.130372
4152	1033	By using software	f	2026-04-08 16:44:44.130372
4153	1033	All are the answers	t	2026-04-08 16:44:44.130372
4154	1034	Windows registry	t	2026-04-08 16:44:44.130372
4155	1034	Windows help center	f	2026-04-08 16:44:44.130372
4156	1034	My document	f	2026-04-08 16:44:44.130372
4157	1034	Windows recovery folder	f	2026-04-08 16:44:44.130372
4158	1035	Using Antistatic devices (antistatic mat and antistatic wrist strap).	f	2026-04-08 16:44:44.130372
4159	1035	Using magnetized screw drivers while disassembling a HDD.	t	2026-04-08 16:44:44.130372
4160	1035	Keeping paper and pen nearby for note taking and diagramming.	f	2026-04-08 16:44:44.130372
4161	1035	When removing adapters, do not stack the adapters on top of one another	f	2026-04-08 16:44:44.130372
4162	1036	A primary corona	f	2026-04-08 16:44:44.130372
4163	1036	A fuser cleaning pad	f	2026-04-08 16:44:44.130372
4164	1036	A Print spooler	t	2026-04-08 16:44:44.130372
4165	1036	A print writer	f	2026-04-08 16:44:44.130372
4166	1037	Keyboard	f	2026-04-08 16:44:44.130372
4167	1037	BIOS	f	2026-04-08 16:44:44.130372
4168	1037	Memory (RAM)	t	2026-04-08 16:44:44.130372
4169	1037	Video	f	2026-04-08 16:44:44.130372
4170	1038	Network layer and Routing	f	2026-04-08 16:44:44.130372
4171	1038	Data Link Layer and Bit synchronization	t	2026-04-08 16:44:44.130372
4172	1038	Transport layer and End-to-end process communication	f	2026-04-08 16:44:44.130372
4173	1038	Medium Access Control sub-layer and Channel sharing	f	2026-04-08 16:44:44.130372
4174	1039	TCP, UDP, UDP and TCP	f	2026-04-08 16:44:44.130372
4175	1039	UDP, TCP, TCP and UDP	f	2026-04-08 16:44:44.130372
4176	1039	UDP, TCP, UDP and TCP	t	2026-04-08 16:44:44.130372
4177	1039	TCP, UDP, TCP and UDP	f	2026-04-08 16:44:44.130372
4178	1040	HTTP, TELNET	f	2026-04-08 16:44:44.130372
4179	1040	FTP, SMTP	f	2026-04-08 16:44:44.130372
4180	1040	HTTP, FTP	t	2026-04-08 16:44:44.130372
4181	1040	HTTP, SMTP	f	2026-04-08 16:44:44.130372
4182	1041	192.168.20.63	f	2026-04-08 16:44:44.130372
4183	1041	192.168.20.47	t	2026-04-08 16:44:44.130372
4184	1041	192.168.20.41	f	2026-04-08 16:44:44.130372
4185	1041	192.168.20.64	f	2026-04-08 16:44:44.130372
4194	1044	Session layer	f	2026-04-08 16:44:44.130372
4195	1044	Presentation layer	t	2026-04-08 16:44:44.130372
4196	1044	Transport layer	f	2026-04-08 16:44:44.130372
4197	1044	Datalink layer	f	2026-04-08 16:44:44.130372
4198	1045	Source and destination Layer 2 address	t	2026-04-08 16:44:44.130372
4199	1045	Source Layer 3 address	f	2026-04-08 16:44:44.130372
4200	1045	Destination Layer 3 address	f	2026-04-08 16:44:44.130372
4201	1045	Destination port	f	2026-04-08 16:44:44.130372
4206	1047	S1, S2 and S3 are all true	f	2026-04-08 16:44:44.130372
4207	1047	S1, S2 and S3 are all false	f	2026-04-08 16:44:44.130372
4208	1047	S1 and S2 are true, but S3 is false	f	2026-04-08 16:44:44.130372
4209	1047	S1 and S3 are true, but S2 is false.	t	2026-04-08 16:44:44.130372
4210	1048	I and IV only	f	2026-04-08 16:44:44.130372
4211	1048	I, II and III only	f	2026-04-08 16:44:44.130372
4212	1048	I, II and IV only	t	2026-04-08 16:44:44.130372
4213	1048	II, III and IV only	f	2026-04-08 16:44:44.130372
4214	1049	600 workstations, with 300 workstations in two broadcast domains and each workstation in its own collision domain	f	2026-04-08 16:44:44.130372
4215	1049	300 workstations, with 150 workstations in two broadcast domains and each workstation in its own collision domain	t	2026-04-08 16:44:44.130372
4216	1049	300 workstations, with 150 workstations in two broadcast domains and all workstations in the same collision domain	f	2026-04-08 16:44:44.130372
4217	1049	300 workstations, in a single broadcast domains and each workstation in its own collision domain	f	2026-04-08 16:44:44.130372
4218	1050	Access-list 15 permit TCP 192.168.144.25 0.0.0.0 172.16.0.0 0.0.255.255 eq 23	f	2026-04-08 16:44:44.130372
4219	1050	Access-list 150 permit UDP 192.168.144.25 0.0.0.0 172.16.0.0 0.0.255.255 eq 23	f	2026-04-08 16:44:44.130372
4220	1050	Access-list 150 permit TCP 192.168.144.25 0.0.0.0 172.16.0.0 0.0.255.255 eq 21	f	2026-04-08 16:44:44.130372
4221	1050	Access-list 150 permit TCP 192.168.144.25 0.0.0.0 172.16.0.0 0.0.255.255 eq 23	t	2026-04-08 16:44:44.130372
4222	1051	RIP uses distance vector routing and OSPF uses link state routing	t	2026-04-08 16:44:44.130372
4223	1051	OSPF uses distance vector routing and RIP uses link state routing	f	2026-04-08 16:44:44.130372
4224	1051	Both RIP and OSPF use link state routing	f	2026-04-08 16:44:44.130372
4225	1051	Both RIP and OSPF use distance vector routing	f	2026-04-08 16:44:44.130372
4226	1052	Dijkstra Routing	f	2026-04-08 16:44:44.130372
4227	1052	Flooding	t	2026-04-08 16:44:44.130372
4228	1052	Distance Vector Routing	f	2026-04-08 16:44:44.130372
4229	1052	Link State Routing	f	2026-04-08 16:44:44.130372
4230	1053	Router (config)#access-list 100 deny TCP any 200.15.24.0/24 eq echo	f	2026-04-08 16:44:44.130372
4231	1053	Router (config)#access-list 1 deny ICMP any 200.15.24.0 0.0.0.255 eq ping	f	2026-04-08 16:44:44.130372
4232	1053	Router (config)#access-list 100 deny TCP any 200.15.24.0 0.0.0.255 eq echo	t	2026-04-08 16:44:44.130372
4233	1053	Router (config)#access-list 1 deny ICMP any 200.15.24.0 0.0.0.255 eq ping	f	2026-04-08 16:44:44.130372
4234	1054	Transport layer	f	2026-04-08 16:44:44.130372
4235	1054	Presentation layer	t	2026-04-08 16:44:44.130372
4236	1054	Session layer	f	2026-04-08 16:44:44.130372
4237	1054	Application layer	f	2026-04-08 16:44:44.130372
4238	1055	Overloading &&	f	2026-04-08 16:44:44.130372
4239	1055	Overloading ||	f	2026-04-08 16:44:44.130372
4240	1055	Overloading <<	t	2026-04-08 16:44:44.130372
4241	1055	Overloading +=	f	2026-04-08 16:44:44.130372
4242	1056	Internet Protocol	f	2026-04-08 16:44:44.130372
4243	1056	Session Layer	f	2026-04-08 16:44:44.130372
4244	1056	Transport layer	f	2026-04-08 16:44:44.130372
4245	1056	Transmission Control Protocol	t	2026-04-08 16:44:44.130372
4250	1058	<img = 'mountains.jpg' src aligh='right'>	f	2026-04-08 16:44:44.130372
4251	1058	<img src='mountains.jpg' style='float:right'>	t	2026-04-08 16:44:44.130372
4252	1058	<img src align='mountains.jpg' 'right'>	f	2026-04-08 16:44:44.130372
4253	1058	<img align='mountains.jpg' src='float:right'>	f	2026-04-08 16:44:44.130372
4258	1060	/root/	f	2026-04-08 16:44:44.130372
4259	1060	/bin/	f	2026-04-08 16:44:44.130372
4260	1060	/etc/	t	2026-04-08 16:44:44.130372
4261	1060	/dev/	f	2026-04-08 16:44:44.130372
4262	1061	$_POST[]	f	2026-04-08 16:44:44.130372
4263	1061	$_REQUEST[]	f	2026-04-08 16:44:44.130372
4264	1061	$_SESSION[]	f	2026-04-08 16:44:44.130372
4265	1061	$_SERVER[]	t	2026-04-08 16:44:44.130372
4270	1063	Creating classes, which are specific instances of objects	f	2026-04-08 16:44:44.130372
4271	1063	Creating applications that manipulate or use objects	t	2026-04-08 16:44:44.130372
4272	1063	Creating AI environment for users is a natural use for object orientation	f	2026-04-08 16:44:44.130372
4273	1063	Creating objects, which are blueprints for classes	f	2026-04-08 16:44:44.130372
4282	1066	Table and Row	t	2026-04-08 16:44:44.130372
4283	1066	Table and key	f	2026-04-08 16:44:44.130372
4284	1066	Table and Column	f	2026-04-08 16:44:44.130372
4285	1066	Table and Field	f	2026-04-08 16:44:44.130372
4286	1067	Anywhere	t	2026-04-08 16:44:44.130372
4287	1067	Anywhere except in classes	f	2026-04-08 16:44:44.130372
4288	1067	Only inside functions	f	2026-04-08 16:44:44.130372
4289	1067	Only outside functions	f	2026-04-08 16:44:44.130372
4290	1068	3NF	f	2026-04-08 16:44:44.130372
4291	1068	BCNF	t	2026-04-08 16:44:44.130372
4292	1068	2NF	f	2026-04-08 16:44:44.130372
4293	1068	1NF	f	2026-04-08 16:44:44.130372
4306	1072	import	f	2026-04-08 16:44:44.130372
4307	1072	collector	f	2026-04-08 16:44:44.130372
4308	1072	shadows	t	2026-04-08 16:44:44.130372
4309	1072	class	f	2026-04-08 16:44:44.130372
4314	1074	Querying, Scanning, Validating, Parsing	f	2026-04-08 16:44:44.130372
4315	1074	Querying, Scanning, Parsing, Validating	f	2026-04-08 16:44:44.130372
4316	1074	Querying, Parsing, Validating, Scanning	t	2026-04-08 16:44:44.130372
4317	1074	Querying, Validating, Scanning, Parsing	f	2026-04-08 16:44:44.130372
4318	1075	Deadlock	t	2026-04-08 16:44:44.130372
4319	1075	Ready	f	2026-04-08 16:44:44.130372
4320	1075	Waiting	f	2026-04-08 16:44:44.130372
4321	1075	Idle	f	2026-04-08 16:44:44.130372
4322	1076	Application	t	2026-04-08 16:44:44.130372
4323	1076	Aggregation	f	2026-04-08 16:44:44.130372
4324	1076	Association	f	2026-04-08 16:44:44.130372
4325	1076	Instantiation	f	2026-04-08 16:44:44.130372
4326	1077	fopen('time.txt','r+');	f	2026-04-08 16:44:44.130372
4327	1077	open('time.txt','read');	f	2026-04-08 16:44:44.130372
4328	1077	fopen('time.txt','r');	t	2026-04-08 16:44:44.130372
4329	1077	open('time.txt');	f	2026-04-08 16:44:44.130372
4334	1079	No, though the first part is right, the second part should be </p> </b></i>	f	2026-04-08 16:44:44.130372
4335	1079	No, because paragraph tags need to be right before the actual text	f	2026-04-08 16:44:44.130372
4336	1079	No, because italic tags must always come before bold tags	f	2026-04-08 16:44:44.130372
4337	1079	Yes, because the tags are nested correctly	t	2026-04-08 16:44:44.130372
4338	1080	Case myVar.Length	t	2026-04-08 16:44:44.130372
4339	1080	Case '739'	f	2026-04-08 16:44:44.130372
4340	1080	Case (myVar.Substring(0, 1)	f	2026-04-08 16:44:44.130372
4341	1080	Case 'Adams'	f	2026-04-08 16:44:44.130372
4342	1081	Results	f	2026-04-08 16:44:44.130372
4343	1081	Project plan	t	2026-04-08 16:44:44.130372
4344	1081	Budget management	f	2026-04-08 16:44:44.130372
4345	1081	Project team	f	2026-04-08 16:44:44.130372
4346	1082	The interface will become a trunk if the neighboring port is configured the same.	f	2026-04-08 16:44:44.130372
4347	1082	The interface will remain an access link if the neighboring port is configured as a trunk.	f	2026-04-08 16:44:44.130372
4348	1082	The interface will become a trunk if requested on the neighboring port.	t	2026-04-08 16:44:44.130372
4349	1082	The interface will remain an access link if the native VLAN is changed	f	2026-04-08 16:44:44.130372
4350	1083	Polymorphism	f	2026-04-08 16:44:44.130372
4351	1083	Encapsulation	t	2026-04-08 16:44:44.130372
4352	1083	Abstraction	f	2026-04-08 16:44:44.130372
4353	1083	Inheritance	f	2026-04-08 16:44:44.130372
4358	1085	Broadcast Receivers	f	2026-04-08 16:44:44.130372
4359	1085	Service	t	2026-04-08 16:44:44.130372
4360	1085	Content Provider	f	2026-04-08 16:44:44.130372
4361	1085	Activities	f	2026-04-08 16:44:44.130372
4366	1087	K-A (K-B (M))	f	2026-04-08 16:44:44.130372
4367	1087	K-B (K+A (M))	f	2026-04-08 16:44:44.130372
4368	1087	K+B (K-A (M))	t	2026-04-08 16:44:44.130372
4369	1087	K+B (K-B (M))	f	2026-04-08 16:44:44.130372
4370	1088	File transfer protocol	f	2026-04-08 16:44:44.130372
4371	1088	User Datagram Protocol	t	2026-04-08 16:44:44.130372
4372	1088	Internet Protocol	f	2026-04-08 16:44:44.130372
4373	1088	Simple mail transfer protocol	f	2026-04-08 16:44:44.130372
4378	1090	Void	f	2026-04-08 16:44:44.130372
4379	1090	Unit	t	2026-04-08 16:44:44.130372
4380	1090	True	f	2026-04-08 16:44:44.130372
4381	1090	False	f	2026-04-08 16:44:44.130372
4382	1091	Broadcast Receivers	f	2026-04-08 16:44:44.130372
4383	1091	Content Provider	f	2026-04-08 16:44:44.130372
4384	1091	Service	f	2026-04-08 16:44:44.130372
4385	1091	Activities	t	2026-04-08 16:44:44.130372
4386	1092	Complex attribute	f	2026-04-08 16:44:44.130372
4387	1092	Derived attribute	f	2026-04-08 16:44:44.130372
4388	1092	Multivalued Attribute	f	2026-04-08 16:44:44.130372
4389	1092	Key attribute	t	2026-04-08 16:44:44.130372
4390	1093	Switch(config-if)# switchport mode trunk 802.1q	f	2026-04-08 16:44:44.130372
4391	1093	Switch(config-if)# switchport encapsulation trunk 802.1q	f	2026-04-08 16:44:44.130372
4392	1093	Switch(config-if)# switchport 802.1q	f	2026-04-08 16:44:44.130372
4393	1093	Switch(config-if)# switchport trunk encapsulation 802.1q	t	2026-04-08 16:44:44.130372
4394	1094	temp[3]=0;	f	2026-04-08 16:44:44.130372
4395	1094	temp[0]=3;	t	2026-04-08 16:44:44.130372
4396	1094	temp(0)=3	f	2026-04-08 16:44:44.130372
4397	1094	3=temp[0];	f	2026-04-08 16:44:44.130372
4398	1095	If two devices transmit at the same time, a collision will occur	f	2026-04-08 16:44:44.130372
4399	1095	Data sent by both devices will not be corrupted and will need to be resent	f	2026-04-08 16:44:44.130372
4400	1095	Collision never occur the two devices transmit at the same time	t	2026-04-08 16:44:44.130372
4401	1095	Devices will not detect the collision on the network	f	2026-04-08 16:44:44.130372
4406	1097	Objects are the characteristics that define an attribute; they are properties of the attribute.	f	2026-04-08 16:44:44.130372
4407	1097	Inheritance allows you to treat all of an object's methods and data as a single entity	f	2026-04-08 16:44:44.130372
4408	1097	A method is a self-contained block of program code that carries out some action, similar to a procedure in a procedural program.	t	2026-04-08 16:44:44.130372
4409	1097	Encapsulation allows a class to be a subclass of a superclass and thereby inherit public and protected variables and methods of the superclass.	f	2026-04-08 16:44:44.130372
4410	1098	A encrypts message using B's public key	t	2026-04-08 16:44:44.130372
4411	1098	A encrypts message using public key	f	2026-04-08 16:44:44.130372
4412	1098	A encrypts message using B's private key	f	2026-04-08 16:44:44.130372
4413	1098	A encrypts message using his private key	f	2026-04-08 16:44:44.130372
4414	1099	Loss of availability	f	2026-04-08 16:44:44.130372
4415	1099	Loss of integrity	t	2026-04-08 16:44:44.130372
4416	1099	Loss of accountability	f	2026-04-08 16:44:44.130372
4417	1099	Loss of confidentiality	f	2026-04-08 16:44:44.130372
4418	1100	Open the parent folder	t	2026-04-08 16:44:44.130372
4419	1100	Search a folder	f	2026-04-08 16:44:44.130372
4420	1100	Create a folder	f	2026-04-08 16:44:44.130372
4421	1100	Go down a folder	f	2026-04-08 16:44:44.130372
4422	1101	Hybrid approach	f	2026-04-08 16:44:44.130372
4423	1101	Activity-based approach	f	2026-04-08 16:44:44.130372
4424	1101	Product-based approach	t	2026-04-08 16:44:44.130372
4425	1101	Project execution	f	2026-04-08 16:44:44.130372
4426	1102	$1,234.57	t	2026-04-08 16:44:44.130372
4427	1102	$1234.57	f	2026-04-08 16:44:44.130372
4428	1102	1,234.57	f	2026-04-08 16:44:44.130372
4429	1102	$1234.567	f	2026-04-08 16:44:44.130372
4434	1104	Political	f	2026-04-08 16:44:44.130372
4435	1104	Human resources	f	2026-04-08 16:44:44.130372
4436	1104	Symbolic	f	2026-04-08 16:44:44.130372
4437	1104	Structure	t	2026-04-08 16:44:44.130372
4438	1105	performed in a synchrous way	f	2026-04-08 16:44:44.130372
4439	1105	to restricted set of commands	f	2026-04-08 16:44:44.130372
4440	1105	to connect remote hosts via an authenticated and encrypted channel.	t	2026-04-08 16:44:44.130372
4441	1105	performed in real-time	f	2026-04-08 16:44:44.130372
4442	1105	to restrict actions available to users	f	2026-04-08 16:44:44.130372
4451	1108	Eclipse Editor	f	2026-04-08 16:44:44.130372
4452	1108	Java Programming Manual	f	2026-04-08 16:44:44.130372
4453	1108	Java Compiler	f	2026-04-08 16:44:44.130372
4454	1108	Java Virtual Machine	t	2026-04-08 16:44:44.130372
4459	1110	MessageBox.Show 'Hi There', 'Hi'	f	2026-04-08 16:44:44.130372
4460	1110	MessageBox.Show Hi There, Hi	f	2026-04-08 16:44:44.130372
4461	1110	MessageBox.Show(Hi there, Hi)	f	2026-04-08 16:44:44.130372
4462	1110	MessageBox.Show('Hi there', 'Hi')	t	2026-04-08 16:44:44.130372
4463	1111	Android SDK tools and platform tools	f	2026-04-08 16:44:44.130372
4464	1111	Android SDK	f	2026-04-08 16:44:44.130372
4465	1111	IntelliJ IDEA	f	2026-04-08 16:44:44.130372
4466	1111	A system image for the Android emulator	t	2026-04-08 16:44:44.130372
4467	1112	3xx	f	2026-04-08 16:44:44.130372
4468	1112	4xx	t	2026-04-08 16:44:44.130372
4469	1112	1xx	f	2026-04-08 16:44:44.130372
4470	1112	5xx	f	2026-04-08 16:44:44.130372
4471	1113	224.0.0.7	f	2026-04-08 16:44:44.130372
4472	1113	224.0.0.5	t	2026-04-08 16:44:44.130372
4473	1113	224.0.0.4	f	2026-04-08 16:44:44.130372
4474	1113	224.0.0.6	f	2026-04-08 16:44:44.130372
4479	1115	request received, processing continues	f	2026-04-08 16:44:44.130372
4480	1115	further action must be taken to complete the request	f	2026-04-08 16:44:44.130372
4481	1115	success, action was successfully received, understood and accepted	t	2026-04-08 16:44:44.130372
4482	1115	server error occurred	f	2026-04-08 16:44:44.130372
4487	1117	<p>	t	2026-04-08 16:44:44.130372
4488	1117	<img:p>	f	2026-04-08 16:44:44.130372
4489	1117	<img><p>	f	2026-04-08 16:44:44.130372
4490	1117	<p:img>	f	2026-04-08 16:44:44.130372
4491	1118	Matching areas.	f	2026-04-08 16:44:44.130372
4492	1118	Matching K metrics	t	2026-04-08 16:44:44.130372
4493	1118	Matching bandwidth metrics	f	2026-04-08 16:44:44.130372
4494	1118	Matching delay metrics	f	2026-04-08 16:44:44.130372
4507	1122	Storage	f	2026-04-08 16:44:44.130372
4508	1122	Input/Output	f	2026-04-08 16:44:44.130372
4509	1122	Multimedia	f	2026-04-08 16:44:44.130372
4510	1122	Communications	t	2026-04-08 16:44:44.130372
4511	1123	5 Gbps	f	2026-04-08 16:44:44.130372
4512	1123	12 Mbps	f	2026-04-08 16:44:44.130372
4513	1123	10 Gbps.	f	2026-04-08 16:44:44.130372
4514	1123	480 Mbps	t	2026-04-08 16:44:44.130372
4515	1124	Login page	f	2026-04-08 16:44:44.130372
4516	1124	Index page	f	2026-04-08 16:44:44.130372
4517	1124	Logout page	f	2026-04-08 16:44:44.130372
4518	1124	Password change page	t	2026-04-08 16:44:44.130372
4519	1125	Fail-safe	f	2026-04-08 16:44:44.130372
4520	1125	Separation of privileges	f	2026-04-08 16:44:44.130372
4521	1125	Least privileges	t	2026-04-08 16:44:44.130372
4522	1125	Open design	f	2026-04-08 16:44:44.130372
4523	1126	Int0	f	2026-04-08 16:44:44.130372
4524	1126	Parse(	f	2026-04-08 16:44:44.130372
4525	1126	Convert()	f	2026-04-08 16:44:44.130372
4526	1126	Val0	t	2026-04-08 16:44:44.130372
4527	1127	Superglue	f	2026-04-08 16:44:44.130372
4528	1127	Thermal paste	t	2026-04-08 16:44:44.130372
4529	1127	Fan	f	2026-04-08 16:44:44.130372
4530	1127	Heat sink	f	2026-04-08 16:44:44.130372
4531	1128	The most recent and updated configuration files are located in the ROM	f	2026-04-08 16:44:44.130372
4532	1128	A backup version of the IOS utilized during the boot process is kept in NVRAM	f	2026-04-08 16:44:44.130372
4533	1128	ROM contains diagnostics that are run on the hardware modules	t	2026-04-08 16:44:44.130372
4534	1128	A configuration file used during the boot process is permanently stored in RAM	f	2026-04-08 16:44:44.130372
4535	1129	sufficiency	f	2026-04-08 16:44:44.130372
4536	1129	primitiveness	f	2026-04-08 16:44:44.130372
4537	1129	coupling	t	2026-04-08 16:44:44.130372
4538	1129	ease of use	f	2026-04-08 16:44:44.130372
4539	1130	Router#show ip static routes	f	2026-04-08 16:44:44.130372
4540	1130	Router#show ip routes	f	2026-04-08 16:44:44.130372
4541	1130	Router#show ip routes static	t	2026-04-08 16:44:44.130372
4542	1130	Router#show static routes	f	2026-04-08 16:44:44.130372
4543	1131	Program-Data independence	t	2026-04-08 16:44:44.130372
4544	1131	Concurrent access anomalies	f	2026-04-08 16:44:44.130372
4545	1131	Data Separation and isolation	f	2026-04-08 16:44:44.130372
4546	1131	Data redundancy and inconsistency	f	2026-04-08 16:44:44.130372
4547	1132	Sender verification	t	2026-04-08 16:44:44.130372
4548	1132	Message modification	f	2026-04-08 16:44:44.130372
4549	1132	Message read by unauthorized party	f	2026-04-08 16:44:44.130372
4550	1132	Message deletion	f	2026-04-08 16:44:44.130372
4551	1133	passed by reference	f	2026-04-08 16:44:44.130372
4552	1133	passed by value.	f	2026-04-08 16:44:44.130372
4553	1133	passed by copy	t	2026-04-08 16:44:44.130372
4554	1133	passed as function	f	2026-04-08 16:44:44.130372
4555	1134	<script href='myscript.js' type='text/javascript'></script>	f	2026-04-08 16:44:44.130372
4556	1134	<script scr='myscript.js' type='text/javascript'></script>	t	2026-04-08 16:44:44.130372
4557	1134	<script>mystyle.css </script>	f	2026-04-08 16:44:44.130372
4558	1134	<style scr='myscript.js'/> </style>	f	2026-04-08 16:44:44.130372
4559	1135	h1.all {background-color:#FFFFFF}	f	2026-04-08 16:44:44.130372
4560	1135	all.h1 {background-color:#FFFFFF}	f	2026-04-08 16:44:44.130372
4561	1135	h1 {background-color:#FFFFFF}	t	2026-04-08 16:44:44.130372
4562	1135	All	f	2026-04-08 16:44:44.130372
4567	1137	C	t	2026-04-08 16:44:44.130372
4568	1137	Assembly Language	f	2026-04-08 16:44:44.130372
4569	1137	Fortran	f	2026-04-08 16:44:44.130372
4570	1137	C++	f	2026-04-08 16:44:44.130372
4571	1138	Confidentiality	t	2026-04-08 16:44:44.130372
4572	1138	Integrity	f	2026-04-08 16:44:44.130372
4573	1138	non-repudiation	f	2026-04-08 16:44:44.130372
4574	1138	Authentication	f	2026-04-08 16:44:44.130372
4575	1139	Commit	f	2026-04-08 16:44:44.130372
4576	1139	Rollback	t	2026-04-08 16:44:44.130372
4577	1139	Flashback	f	2026-04-08 16:44:44.130372
4578	1139	View	f	2026-04-08 16:44:44.130372
4579	1140	T4.Tutorials	f	2026-04-08 16:44:44.130372
4580	1140	T4 Tutorials	f	2026-04-08 16:44:44.130372
4581	1140	4 Tutorials	f	2026-04-08 16:44:44.130372
4582	1140	T4_Tutorials	t	2026-04-08 16:44:44.130372
\.


--
-- TOC entry 5272 (class 0 OID 49240)
-- Dependencies: 255
-- Data for Name: pdf_bookmarks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pdf_bookmarks (id, user_id, material_id, page_number, label, created_at) FROM stdin;
1	1	18	39	Page 39	2026-05-19 21:48:02.911643
2	1	18	2	Page 2	2026-05-20 21:46:02.833223
4	1	18	37	Page 37	2026-05-20 21:46:33.315196
\.


--
-- TOC entry 5274 (class 0 OID 49262)
-- Dependencies: 257
-- Data for Name: pdf_highlights; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pdf_highlights (id, user_id, material_id, page_number, selected_text, color, created_at) FROM stdin;
\.


--
-- TOC entry 5248 (class 0 OID 24594)
-- Dependencies: 231
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.questions (id, quiz_id, question_text, question_type, created_at, explanation) FROM stdin;
1191	35	What is the main goal of Query Processing?	mcq	2026-05-17 09:40:45.300997	Query Processing is the process of finding information in one or more databases and delivering it to the user quickly and efficiently.
1192	35	What are the four main phases of Query Processing?	mcq	2026-05-17 09:40:45.606458	The four main phases of Query Processing are Decomposition, Optimization, Code generation, and Execution.
1193	35	What is the purpose of the Optimizer in Query Processing?	mcq	2026-05-17 09:40:45.612088	The Optimizer's purpose is to find the best plan to relational algebra.
1194	35	What are the typical stages in Query Decomposition?	mcq	2026-05-17 09:40:45.661729	The typical stages in Query Decomposition are Analysis, Normalization, Semantic Analysis, and Simplification.
1195	35	Which of the following expressions is best (Optimal)?	mcq	2026-05-17 09:40:45.664219	The optimal expression is (  position =’manager’ (Staff )) staff.branchNo=branch.branchNo (  City=’Addis’(Branch))
27	17	What is the purpose of a UPS (Uninterruptible Power Supply)?	multiple_choice	2026-04-08 10:35:27.233171	\N
43	17	Assume the admin of the database and newly created user user1 by the admin. So Which of the following SQL query is used to access or modify the data from the admin by user?	multiple_choice	2026-04-08 10:35:27.233171	\N
44	17	Which of the following statement is true about triggers?	multiple_choice	2026-04-08 10:35:27.233171	\N
47	17	Which of the following statement is served as a criterion for Optimization?	multiple_choice	2026-04-08 10:35:27.233171	\N
1216	37	What is the primary function of the Domain Name System (DNS) in networking?	mcq	2026-05-17 13:29:36.020047	DNS is a hierarchical and decentralized system that translates human-readable domain names into numerical IP addresses that computers use to communicate.
1217	37	What is the purpose of a port number in networking?	mcq	2026-05-17 13:29:36.028733	A port number is a 16-bit number that identifies a specific application or service on a host, allowing multiple applications to run on the same device.
1218	37	What is the difference between a stream socket and a datagram socket?	mcq	2026-05-17 13:29:36.034962	Stream sockets provide reliable, sequenced, and unduplicated data transfer using TCP, while datagram sockets offer bidirectional communication using UDP, but with no guaranteed order or reliability.
1219	37	What is the purpose of the java.net package in Java?	mcq	2026-05-17 13:29:36.040238	The java.net package provides a set of classes, defined in a package called java.net, to enable the rapid development of network applications.
1220	37	What is the function of the InetAddress class in Java?	mcq	2026-05-17 13:29:36.061632	The InetAddress class provides a way to work with IP addresses and host names, allowing you to get the host name and IP address of a device.
1221	37	What is the purpose of the ServerSocket class in Java?	mcq	2026-05-17 13:29:36.06504	The ServerSocket class is used to create server sockets for connection-oriented communication, allowing servers to wait for connection requests from clients.
1222	37	What is the function of the accept() method in the ServerSocket class?	mcq	2026-05-17 13:29:36.068983	The accept() method waits for a connection request and returns a Socket object, allowing the server to communicate with the client.
1223	37	What is the purpose of the Socket class in Java?	mcq	2026-05-17 13:29:36.073131	The Socket class is used to create client sockets for connection-oriented communication, allowing clients to connect to servers.
1224	37	What is the function of the getInputStream() method in the Socket class?	mcq	2026-05-17 13:29:36.077225	The getInputStream() method returns an InputStream object, allowing the client to read data from the server.
1225	37	What is the purpose of the InetAddress.getByName() method?	mcq	2026-05-17 13:29:36.080521	The InetAddress.getByName() method creates an InetAddress object from a host name or IP address, allowing you to work with IP addresses and host names.
833	17	Which one of the following is not the end result of abstraction in OOP?	multiple_choice	2026-04-08 16:44:44.130372	\N
189	18	Sector 0 of the disk is called which is used to boot the computer.	multiple_choice	2026-04-08 10:54:13.316109	\N
204	18	Which tool is used for managing and controlling network access and security policies on a Windows Server?	multiple_choice	2026-04-08 10:54:13.316109	\N
214	18	Which of the following backup technique is most space efficient?	multiple_choice	2026-04-08 10:54:13.316109	\N
183	19	What is an inline function?	multiple_choice	2026-04-08 10:54:13.316109	\N
191	19	Information transfer from one register to another is designated in symbolic form by means of a replacement operator is:	multiple_choice	2026-04-08 10:54:13.316109	\N
192	19	The structure and behavior of various functional modules (HW and SW) of a digital computer as well as how these modules interact to meet the requirement of the user.	multiple_choice	2026-04-08 10:54:13.316109	\N
194	19	Which statement correctly differentiates functions and procedures?	multiple_choice	2026-04-08 10:54:13.316109	\N
185	20	Which of the following concept of FSA is used in the compiler?	multiple_choice	2026-04-08 10:54:13.316109	\N
195	20	If we have more than one accepting states or an accepting state with an outdegree, which of the following actions will be taken?	multiple_choice	2026-04-08 10:54:13.316109	\N
198	20	A language is regular if and only if:	multiple_choice	2026-04-08 10:54:13.316109	\N
203	20	Which one of the following statement is TRUE?	multiple_choice	2026-04-08 10:54:13.316109	\N
318	17	One of the following is not the disadvantage of simple file processing?	multiple_choice	2026-04-08 11:02:19.828102	\N
326	17	In case of any shutdown during transaction before commit, which of the following statement is done automatically?	multiple_choice	2026-04-08 11:02:19.828102	\N
293	18	The result of the following Java code will be?	multiple_choice	2026-04-08 11:02:19.828102	\N
298	18	_______ is implemented by combining methods and attribute into a class.	multiple_choice	2026-04-08 11:02:19.828102	\N
305	18	Assume: Biruk wants to send a secure message M to Alem, and they want to assure its integrity and confidentiality. How do they make it possible if they use public crypto? (Consider public and private key pair K+B, and K-B respectively for Biruk, K+A, and K-A respectively for Alem).	multiple_choice	2026-04-08 11:02:19.828102	\N
309	18	In order to establish a neighborship, which is a need for EIGRP routers?	multiple_choice	2026-04-08 11:02:19.828102	\N
312	18	In public key encryption, if A wants to send an encrypted message to B, which statement is true?	multiple_choice	2026-04-08 11:02:19.828102	\N
317	18	Which OSI reference model layer is responsible for translating data in a form that can be understood by the receiver?	multiple_choice	2026-04-08 11:02:19.828102	\N
324	18	_______ is a program that executes compiled Java code on a specific platform.	multiple_choice	2026-04-08 11:02:19.828102	\N
325	18	Which factor that measures the quality of the management process?	multiple_choice	2026-04-08 11:02:19.828102	\N
296	19	_______ is a database schema that depicts key dependencies between the primary key and foreign key.	multiple_choice	2026-04-08 11:02:19.828102	\N
322	19	Which of the following is true regarding the command switchport mode dynamic auto?	multiple_choice	2026-04-08 11:02:19.828102	\N
308	20	Which one of the following creates a connection-oriented connection that provides reliable end-to-end transfer and uses window mechanism for control?	multiple_choice	2026-04-08 11:02:19.828102	\N
300	21	_______ describe when an activity will start interacting with the user.	multiple_choice	2026-04-08 11:02:19.828102	\N
481	18	The first step of machine learning is:	multiple_choice	2026-04-08 11:34:18.713484	\N
496	17	Which of the following JavaScript cannot do?	multiple_choice	2026-04-08 11:34:18.713484	\N
623	20	What command alters the group owner of a file?	multiple_choice	2026-04-08 11:34:29.136225	\N
690	20	One of the following statements is false	multiple_choice	2026-04-08 11:34:34.057608	\N
784	18	What is the use of isset() function in PHP?	multiple_choice	2026-04-08 16:44:44.130372	\N
60	17	In which OSI layer both error detection and correction is performed?	multiple_choice	2026-04-08 10:35:27.233171	\N
46	17	Which of the following data management approach is difficult to cross-referencing?	multiple_choice	2026-04-08 10:35:27.233171	\N
59	17	In which OSI layer dissimilar devices communicate by bit reordering?	multiple_choice	2026-04-08 10:35:27.233171	\N
61	17	Which one is combine Segment into Frame and Frame into Packet?	multiple_choice	2026-04-08 10:35:27.233171	\N
65	17	Which protocol is available in Data-link layer?	multiple_choice	2026-04-08 10:35:27.233171	\N
69	17	Which one is not available in IPv4 network?	multiple_choice	2026-04-08 10:35:27.233171	\N
75	17	The process of granting someone to access a resource is called?	multiple_choice	2026-04-08 10:35:27.233171	\N
77	17	Dividing a network & its IP addresses into segments is called?	multiple_choice	2026-04-08 10:35:27.233171	\N
91	17	What will be the access modifier of an object if you don't specify when declaring?	multiple_choice	2026-04-08 10:35:27.233171	\N
112	17	Which of the following is not a type of system requirement?	multiple_choice	2026-04-08 10:35:27.233171	\N
133	17	Consider a banking application that needs to store customer information such as name, address, and account balance. A Customer class that contains private fields for these attributes is created, as well as getter and setter methods to access and modify those fields. This allows us to keep the data private and enforce business logic within the class, while still allowing other parts of the program to interact with the object through well-defined interfaces. Which one of the following object-oriented concepts well fit with this application?	multiple_choice	2026-04-08 10:54:13.316109	\N
172	17	_____ is refers to the objective an artificial machine.	multiple_choice	2026-04-08 10:54:13.316109	\N
1133	17	The object cannot be	multiple_choice	2026-04-08 16:44:44.130372	\N
182	17	Which of the following is true about FILE *fp?	multiple_choice	2026-04-08 10:54:13.316109	\N
330	17	What is the correct HTML code for referring an external javascript?	multiple_choice	2026-04-08 11:02:19.828102	\N
355	17	Which tag used to add a background color for all <h1> elements?	multiple_choice	2026-04-08 11:02:19.828102	\N
368	17	What is the purpose of Agile software development?	multiple_choice	2026-04-08 11:33:58.43932	\N
390	17	Which of the following statement is true about the indexes?	multiple_choice	2026-04-08 11:34:12.895991	\N
404	17	In which OSI layer dissimilar devices communicate by bit reordering?	multiple_choice	2026-04-08 11:34:12.895991	\N
415	17	Workgroup name and computer name must be?	multiple_choice	2026-04-08 11:34:12.895991	\N
419	17	A relationship between different domains or forests that allow sharing of resources between them is called?	multiple_choice	2026-04-08 11:34:12.895991	\N
421	17	Which password policy prevents users from creating a new password that is the same as their current password or a recently used password?	multiple_choice	2026-04-08 11:34:12.895991	\N
432	17	Which one is False about FLSM and VLSM?	multiple_choice	2026-04-08 11:34:12.895991	\N
440	17	One of the following programming focuses on representing both structure and behavior of information system into small modules that combines data and process together?	multiple_choice	2026-04-08 11:34:12.895991	\N
451	17	Which of the following is not considered as a risk in project management?	multiple_choice	2026-04-08 11:34:12.895991	\N
455	17	What is the purpose of system analysis and design?	multiple_choice	2026-04-08 11:34:12.895991	\N
477	17	Which component of Active Directory provides a searchable catalog of objects across multiple domains in a forest?	multiple_choice	2026-04-08 11:34:18.713484	\N
508	17	The post-order traversal of a binary tree is O P Q R S T. Then possible pre-order traversal will be:	multiple_choice	2026-04-08 11:34:18.713484	\N
520	17	Which one of the following is different?	multiple_choice	2026-04-08 11:34:18.713484	\N
565	17	The result of the following Java code will be?	multiple_choice	2026-04-08 11:34:29.136225	\N
567	17	What command is used to show and create files?	multiple_choice	2026-04-08 11:34:29.136225	\N
573	17	You have just replaced a processor in a computer and now need to add a cooling to attach the cooling system to the processor?	multiple_choice	2026-04-08 11:34:29.136225	\N
578	17	Which of the following approaches is best for state decision support system software project management activities?	multiple_choice	2026-04-08 11:34:29.136225	\N
594	17	Which of the following is true regarding the command switchport mode dynamic auto?	multiple_choice	2026-04-08 11:34:29.136225	\N
624	17	Assume the relation staff(eid:integer, ename:string, age:integer, salary:real) write SQL statement that increases employee salary by 5%?	multiple_choice	2026-04-08 11:34:29.136225	\N
625	17	Digital signatures are primarily designed to provide additional protection with electronic messages in order to ensure:	multiple_choice	2026-04-08 11:34:29.136225	\N
643	17	Which types of switching each node receives the entire message, stores it, and then transmits it to the next node?	multiple_choice	2026-04-08 11:34:34.057608	\N
645	17	The DBMS acts as an interface between what two components of an enterprise-class database system?	multiple_choice	2026-04-08 11:34:34.057608	\N
655	17	Which TCP/IP layer allows an IP packet to make a physical link to transmission media?	multiple_choice	2026-04-08 11:34:34.057608	\N
657	17	One of the following is not the reason for the need of query optimization?	multiple_choice	2026-04-08 11:34:34.057608	\N
672	17	Which of the following primitive data types is not Integer type?	multiple_choice	2026-04-08 11:34:34.057608	\N
677	17	Which one of the following statements is the correct way of defining a CSS style using a class selector?	multiple_choice	2026-04-08 11:34:34.057608	\N
685	17	___________is a rule of no component of the primary key may contain a NULL value.	multiple_choice	2026-04-08 11:34:34.057608	\N
687	17	Among the following one is the process of analyzing the given relation schemas based on their functional dependencies and primary keys.	multiple_choice	2026-04-08 11:34:34.057608	\N
710	17	_________is s a problem which occurs when two transactions access the same data items concurrently and their operations interleaved.	multiple_choice	2026-04-08 11:34:34.057608	\N
719	17	What will happen when we run the following segment of Java code? public static void main(String args[]){ int i; int []a={3,4,0,5}; for( i=3;i>=0;i--){ System.out.print(30/a[i]); System.out.print(a[i]); }	multiple_choice	2026-04-08 11:34:34.057608	\N
730	17	Choose the correct statement about Java variables.	multiple_choice	2026-04-08 11:34:34.057608	\N
782	17	Which of the following primitive data types is not Integer type?	multiple_choice	2026-04-08 16:44:44.130372	\N
821	17	Which one of the following syntaxes is the correct way of defining a function in PHP?	multiple_choice	2026-04-08 16:44:44.130372	\N
823	17	Which of the following is the default file extension of PHP?	multiple_choice	2026-04-08 16:44:44.130372	\N
843	17	Based on the above question #13, what is the broadcasting address for subnet #2?	multiple_choice	2026-04-08 16:44:44.130372	\N
848	17	In a schedule S with two transactions T1 and T2, T1 reads the data item which was produced by T2 and T1 commits before T2 commits. In this case, the schedule S is said to be a ___________ schedule?	multiple_choice	2026-04-08 16:44:44.130372	\N
852	17	If we want to develop a program to display the names of 7 days in a week, what type of Java statement can be appropriate to solve the problem?	multiple_choice	2026-04-08 16:44:44.130372	\N
854	17	Which one of the following database models under record database model category?	multiple_choice	2026-04-08 16:44:44.130372	\N
862	17	Occurs when two transactions that access the same database items have operations interleaved	multiple_choice	2026-04-08 16:44:44.130372	\N
866	17	Security is a typical DBMS function aims to protect databases from _________	multiple_choice	2026-04-08 16:44:44.130372	\N
879	17	Which of the following statements about data structures is true regarding object-oriented programming but not structured programming?	multiple_choice	2026-04-08 16:44:44.130372	\N
889	17	What is the output of the following program? (Arrays.fill with 8)	multiple_choice	2026-04-08 16:44:44.130372	\N
897	17	A user submits a form on your website. Which combination of technologies best represents how the form data would be processed for server-side validation and storage?	multiple_choice	2026-04-08 16:44:44.130372	\N
906	17	As a project manager, Dawit is so happy that all expected project the deliverables have been accomplished of his project team. What is the next step for his project to proceed in order to verify the project scope by his project client?	multiple_choice	2026-04-08 16:44:44.130372	\N
924	17	Which of the following network device used for managing a network security?	multiple_choice	2026-04-08 16:44:44.130372	\N
938	17	Which of the following is a method for granting a user administrative privilege in Windows?	multiple_choice	2026-04-08 16:44:44.130372	\N
949	17	A fire extinguisher that is suitable for combustible metals.	multiple_choice	2026-04-08 16:44:44.130372	\N
953	17	You want to perform a case-insensitive string comparison in VB.NET. Which of the following options would you choose?	multiple_choice	2026-04-08 16:44:44.130372	\N
964	17	Which type of inheritance does not supported by Java?	multiple_choice	2026-04-08 16:44:44.130372	\N
966	17	When we have Student table which have firstName, surName, gender, studId and cgpa attributes on Haramaya database. And also, the table has 10 rows data that stored on Student tables. Since, we need to fetch data from our database Student table so, which one of the following java.sql class used to store the data that fetched from our database table?	multiple_choice	2026-04-08 16:44:44.130372	\N
970	17	Which one of the following is primitive data type?	multiple_choice	2026-04-08 16:44:44.130372	\N
973	17	Which one of the following is Not True about the functionality of Skeleton objects in Remote method Invocation System?	multiple_choice	2026-04-08 16:44:44.130372	\N
977	17	Which operating system is advantageous for corporate customers since it allows synchronization with Microsoft Exchange, Novell GroupWise email, Lotus Domino, and other business software?	multiple_choice	2026-04-08 16:44:44.130372	\N
996	17	Which of the following is NOT a security best practice for Linux systems?	multiple_choice	2026-04-08 16:44:44.130372	\N
1000	17	To convert ER Diagram to Relational Tables in case of one-to-many cardinality.	multiple_choice	2026-04-08 16:44:44.130372	\N
1003	17	Where several tuples can have the same apparent key value but have different attribute values for users at different classification levels.	multiple_choice	2026-04-08 16:44:44.130372	\N
1007	17	Which of the following is false about Mandatory Access Control(MAC)	multiple_choice	2026-04-08 16:44:44.130372	\N
1024	17	What is the best statement for taking advantage of a weakness in the security of an IT system?	multiple_choice	2026-04-08 16:44:44.130372	\N
1036	17	A __________________ is a software program that intercepts the printer's request to print, instead of going directly to the printer, it sends data to the hard drive, and then it controls the data from the hard drive going to the printer.	multiple_choice	2026-04-08 16:44:44.130372	\N
1037	17	If a computer beeps once then three times, then four times, then three more times during POST and the computer has a Phoenix BIOS, what is a possible suspect component?	multiple_choice	2026-04-08 16:44:44.130372	\N
1039	17	The transport layer protocols used for real time multimedia, file transfer, DNS and email respectively are	multiple_choice	2026-04-08 16:44:44.130372	\N
1049	17	With the following equipment list which of the following network scenario could be supported? Two IP subnets of 255.255.255.0, Seven 48 port switches, Two router interfaces	multiple_choice	2026-04-08 16:44:44.130372	\N
1052	17	Which of the below routing method always ensures the shortest path even though routers crash during course of routing?	multiple_choice	2026-04-08 16:44:44.130372	\N
1055	17	_______is an insertion operator which is used for overloading.	multiple_choice	2026-04-08 16:44:44.130372	\N
1058	17	Which of the following is the correct tag to place an image on the right side of the window with the text filling the area to the left of the image?	multiple_choice	2026-04-08 16:44:44.130372	\N
1072	17	If a method contains a local variable with the same name as one of its class's fields, the local variable the field in that method's scope.	multiple_choice	2026-04-08 16:44:44.130372	\N
1075	17	A system is in a state if there exists a set of transactions such that every transaction in the set is waiting for another transaction in the set.	multiple_choice	2026-04-08 16:44:44.130372	\N
1083	17	is implemented by combining methods and attribute into a class.	multiple_choice	2026-04-08 16:44:44.130372	\N
1087	17	Assume: Biruk wants to send a secure message M to Alem, and they want to assure its integrity and confidentiality. How do they make it possible if they use public crypto? (Consider public and Private key pair K+B, and K-B respectively for Biruk, K+A, and K-A respectively for Alem).	multiple_choice	2026-04-08 16:44:44.130372	\N
1091	17	A Communication between applications and the Android Operating System is handled by	multiple_choice	2026-04-08 16:44:44.130372	\N
1100	17	The ../notation in a relative path of hypertext reference matches	multiple_choice	2026-04-08 16:44:44.130372	\N
1108	17	_______is a program that executes compiled Java code on a specific platform.	multiple_choice	2026-04-08 16:44:44.130372	\N
1123	17	What is the maximum data transfer rate of USB High Speed?	multiple_choice	2026-04-08 16:44:44.130372	\N
1127	17	You have just replaced a computer and now need to add a cooling mechanism. What should you use to attach the cooling system to the processor?	multiple_choice	2026-04-08 16:44:44.130372	\N
1132	17	Digital signatures are primarily designed to provide additional protection with electronic messages in order to ensure	multiple_choice	2026-04-08 16:44:44.130372	\N
1138	17	Eavesdropping and packet sniffing are considered to be attacks of	multiple_choice	2026-04-08 16:44:44.130372	\N
25	18	What is the role of thermal paste in a computer system?	multiple_choice	2026-04-08 10:35:27.233171	\N
29	18	Which of the following is a reason to perform regular backups of your data?	multiple_choice	2026-04-08 10:35:27.233171	\N
32	18	How can you remove a virus or malware from your computer system?	multiple_choice	2026-04-08 10:35:27.233171	\N
36	18	Which of the following statement is true about distributed database systems?	multiple_choice	2026-04-08 10:35:27.233171	\N
39	18	It is a Recovery Techniques which is useful if transactions execute serially.	multiple_choice	2026-04-08 10:35:27.233171	\N
42	18	It is a technique that holds great promise for providing even more improvements to query processing efficiency in the future relational database system.	multiple_choice	2026-04-08 10:35:27.233171	\N
56	18	Let, network designer installed 6 hosts by using mush topology, so how many cables are needed?	multiple_choice	2026-04-08 10:35:27.233171	\N
89	18	What is the output of the Java program? (private static variable access)	multiple_choice	2026-04-08 10:35:27.233171	\N
130	18	One of the following is true about lexical and syntax analyzers:	multiple_choice	2026-04-08 10:54:13.316109	\N
140	18	A web based application model that used to add, modify and access objects hierarchically.	multiple_choice	2026-04-08 10:54:13.316109	\N
151	18	Which of the following JavaScript cannot do?	multiple_choice	2026-04-08 10:54:13.316109	\N
181	18	Among the following set of problems listed below, identify the one which can be solved using divide and conquer strategy?	multiple_choice	2026-04-08 10:54:13.316109	\N
329	18	On a router, you have numerous routes set up. What command only displays static routes?	multiple_choice	2026-04-08 11:02:19.828102	\N
335	18	When you design a class diagram, which class hierarchies' relationship you are not going to apply?	multiple_choice	2026-04-08 11:02:19.828102	\N
365	18	In Object-Oriented Programming, what does encapsulation mean?	multiple_choice	2026-04-08 11:33:58.43932	\N
376	18	What is the purpose of a BIOS (Basic Input/Output System)?	multiple_choice	2026-04-08 11:34:12.895991	\N
379	18	In which database design phase we will develop all the technologies and organizational specifications?	multiple_choice	2026-04-08 11:34:12.895991	\N
837	18	One of the following is true about relational database data model?	multiple_choice	2026-04-08 16:44:44.130372	\N
387	18	It is a technique that holds great promise for providing even more improvements to query processing efficiency in the future relational database system.	multiple_choice	2026-04-08 11:34:12.895991	\N
396	18	Which one is Metropolitan Area Network (MAN) technology?	multiple_choice	2026-04-08 11:34:12.895991	\N
414	18	Which one is not available in IPv4 network?	multiple_choice	2026-04-08 11:34:12.895991	\N
420	18	The process of granting someone to access a resource is called?	multiple_choice	2026-04-08 11:34:12.895991	\N
429	18	Which protocol is used to secure when transfer data through a network?	multiple_choice	2026-04-08 11:34:12.895991	\N
431	18	Which types of Trusts created automatically?	multiple_choice	2026-04-08 11:34:12.895991	\N
439	18	Which of the following is correct about the difference between structural and object oriented programming?	multiple_choice	2026-04-08 11:34:12.895991	\N
456	18	What is the purpose of the planning phase of the SDLC?	multiple_choice	2026-04-08 11:34:12.895991	\N
462	18	Which Of The Following Is An Example Of FTP.	multiple_choice	2026-04-08 11:34:12.895991	\N
468	18	Which of the following is used for concatenation in PHP?	multiple_choice	2026-04-08 11:34:12.895991	\N
475	18	One of the following is true about lexical and syntax analyzers:	multiple_choice	2026-04-08 11:34:18.713484	\N
478	18	Consider a banking application that needs to store customer information such as name, address, and account balance. A Customer class that contains private fields for these attributes is created, as well as getter and setter methods to access and modify those fields. This allows us to keep the data private and enforce business logic within the class, while still allowing other parts of the program to interact with the object through well-defined interfaces. Which one of the following object-oriented concepts well fit with this application?	multiple_choice	2026-04-08 11:34:18.713484	\N
488	18	A Javascript popup box used to alert dialog displaying the text 'Welcome JS' is created by calling:	multiple_choice	2026-04-08 11:34:18.713484	\N
489	18	The amortized time complexity of the dynamic array problem is?	multiple_choice	2026-04-08 11:34:18.713484	\N
500	18	One is not correct about binary number system.	multiple_choice	2026-04-08 11:34:18.713484	\N
504	18	What is the best data type definition for Oracle when a field is alphanumeric and has a fixed length?	multiple_choice	2026-04-08 11:34:18.713484	\N
511	18	The data structure required to check whether an expression contains a balanced parenthesis is?	multiple_choice	2026-04-08 11:34:18.713484	\N
524	18	One of the following is NOT the mechanism of the system threat that creates an environment to attack when operating system resources/user files are misused, which one?	multiple_choice	2026-04-08 11:34:18.713484	\N
532	18	Which of the following IPv4 address belongs class B address?	multiple_choice	2026-04-08 11:34:18.713484	\N
536	18	Information transfer from one register to another is designated in symbolic form by means of a replacement operator is:	multiple_choice	2026-04-08 11:34:18.713484	\N
542	18	Which types of system testing uses a procedure that demands resources in abnormal quantity, frequency or volume?	multiple_choice	2026-04-08 11:34:18.713484	\N
561	18	Which one of the following is wrong about interface?	multiple_choice	2026-04-08 11:34:18.713484	\N
566	18	Identify the necessary tool for creating and testing your android apps on different virtual devices.	multiple_choice	2026-04-08 11:34:29.136225	\N
574	18	Which one of the following access methods used in a dedicated management channel?	multiple_choice	2026-04-08 11:34:29.136225	\N
580	18	Which one of the following creates a connection-oriented connection that provides reliable end-to-end transfer and uses window mechanism for control?	multiple_choice	2026-04-08 11:34:29.136225	\N
581	18	In order to establish a neighborship, which is a need for EIGRP routers?	multiple_choice	2026-04-08 11:34:29.136225	\N
584	18	In public key encryption, if A wants to send an encrypted message to B, which statement is true?	multiple_choice	2026-04-08 11:34:29.136225	\N
588	18	One of the following cannot measure the quality of an abstraction?	multiple_choice	2026-04-08 11:34:29.136225	\N
605	18	What programming language is used to create system calls in UNIX?	multiple_choice	2026-04-08 11:34:29.136225	\N
630	18	Which function is not relevant to protect your site from characters that can potentially do damage to your system?	multiple_choice	2026-04-08 11:34:29.136225	\N
665	18	Which Java keyword cannot appear on instance variable declaration?	multiple_choice	2026-04-08 11:34:34.057608	\N
676	18	Which one of the following is the output of the given program? (PHP loop with continue)	multiple_choice	2026-04-08 11:34:34.057608	\N
678	18	Which one of the following PHP functions is used to redirect a user to a specific page?	multiple_choice	2026-04-08 11:34:34.057608	\N
679	18	Which one is the right name given for unique identification of each entity?	multiple_choice	2026-04-08 11:34:34.057608	\N
692	18	Which of the following OOP concept binds the code and data together and keeps them secure from the outside world?	multiple_choice	2026-04-08 11:34:34.057608	\N
693	18	From the following list of Java variables; which one is invalid?	multiple_choice	2026-04-08 11:34:34.057608	\N
696	18	A class declaration that begins with the keyword ______________ must be stored in a file that has exactly the same name as that class and ends with the .java file-name extension.	multiple_choice	2026-04-08 11:34:34.057608	\N
700	18	Which one of the following statements is False about segmentation and paging?	multiple_choice	2026-04-08 11:34:34.057608	\N
706	18	Transaction-processing systems usually allow multiple transactions to run concurrently. Which of the following best suits as the advantage(s) of allowing concurrent execution of transactions?	multiple_choice	2026-04-08 11:34:34.057608	\N
738	18	In a schedule S with two transactions T1 and T2, T1 reads the data item which was produced by T2 and T1 commits before T2 commits. In this case, the schedule S is said to be a ___________ schedule?	multiple_choice	2026-04-08 11:34:34.057608	\N
743	18	_______________ is a program that executes compiled Java bytecode on a specific platform.	multiple_choice	2026-04-08 11:34:34.057608	\N
750	18	Which one of the following scheduling algorithms is both preemptive and non-preemptive?	multiple_choice	2026-04-08 16:44:44.130372	\N
751	18	Which mode of transmission the entire capacity of the channel can be utilized for each direction?	multiple_choice	2026-04-08 16:44:44.130372	\N
771	18	Identify the correct statement based on the code snippet given below. $fop=fopen('xyz.txt','a+'); fwrite($fop,'hello'); fclose($fop);	multiple_choice	2026-04-08 16:44:44.130372	\N
779	18	Among the following lists one doesn't describe a field in a relation?	multiple_choice	2026-04-08 16:44:44.130372	\N
791	18	Which of the following is not primitive data type in Java?	multiple_choice	2026-04-08 16:44:44.130372	\N
798	18	_____________are rules that should be obeyed or followed while manipulating the data?	multiple_choice	2026-04-08 16:44:44.130372	\N
800	18	One of the following statements is false	multiple_choice	2026-04-08 16:44:44.130372	\N
802	18	Which of the following OOP concept binds the code and data together and keeps them secure from the outside world?	multiple_choice	2026-04-08 16:44:44.130372	\N
494	21	What are the advantages of arrays?	multiple_choice	2026-04-08 11:34:18.713484	\N
874	18	You're designing a state diagram for the 'Book' class in the library management system. The book can be in different states like 'Available,' 'Borrowed,' and 'Under Repair.' Which UML element would represent the transition between the 'Available' and 'Borrowed' states when a member successfully borrows the book?	multiple_choice	2026-04-08 16:44:44.130372	\N
876	18	Consider a class hierarchy with interfaces and abstract classes. Which of the following statements is CORRECT about implementing polymorphism in this scenario?	multiple_choice	2026-04-08 16:44:44.130372	\N
885	18	Assume a class implements two interfaces, both with a method named draw(), which of the following statement is true?	multiple_choice	2026-04-08 16:44:44.130372	\N
895	18	Security is a major concern when handling user data on an e-commerce website. Which of the following is NOT a recommended practice?	multiple_choice	2026-04-08 16:44:44.130372	\N
896	18	You're building a web application that allows users to register. On the server-side (using a language like PHP), how would you ensure a username is unique before storing it in the database?	multiple_choice	2026-04-08 16:44:44.130372	\N
905	18	One of the following is the main process of quality management to identifying which quality standards are relevant to the project and how to satisfy them; a metric is a standard of measurement.	multiple_choice	2026-04-08 16:44:44.130372	\N
919	18	Refer to the exhibit. A network administrator is configuring the MOTD on Multi-switch SW2. What is the purpose of this command?	multiple_choice	2026-04-08 16:44:44.130372	\N
923	18	A network administrator configured syslog with a level 2 trap. Which of the following types of logs would be generated?	multiple_choice	2026-04-08 16:44:44.130372	\N
937	18	Which of the following is a method for managing network devices that involves grouping them based on their function or location?	multiple_choice	2026-04-08 16:44:44.130372	\N
957	18	When we use the MySqlConnection object to retrieve, insert, update and delete data in database connectivity in ADO.NET?	multiple_choice	2026-04-08 16:44:44.130372	\N
985	18	Which one of the following is the advantage of following formal project management system in project management?	multiple_choice	2026-04-08 16:44:44.130372	\N
997	18	Which of the following file systems is commonly used for managing storage on a Linux system?	multiple_choice	2026-04-08 16:44:44.130372	\N
1005	18	Which of the following true about relation fragmentation?	multiple_choice	2026-04-08 16:44:44.130372	\N
1011	18	In JavaScript, a primitive value or data type is data that is not an object and has no methods or properties. Which one of the following is true about primitive data type?	multiple_choice	2026-04-08 16:44:44.130372	\N
1035	18	Which one of the following is a bad habit when performing computer hardware maintenance?	multiple_choice	2026-04-08 16:44:44.130372	\N
1041	18	Given an IP address and subnet mask of 192.168.20.39 and 255.255.255.240 then what is the broadcast address of this given IP?	multiple_choice	2026-04-08 16:44:44.130372	\N
1047	18	Consider the following three statements about link state and distance vector routing protocols, for a large network with 500 network nodes and 4000 links. Which one of the following is correct about S1, S2 and S3?	multiple_choice	2026-04-08 16:44:44.130372	\N
1088	18	defined for a simple connectionless communication that provides no error recovery and no delivery guarantee.	multiple_choice	2026-04-08 16:44:44.130372	\N
1099	18	_________is threats of a database, which can occur due to creation, insertion, updating, changing the status of data, and deletion.	multiple_choice	2026-04-08 16:44:44.130372	\N
1115	18	TTP response line with a status code that starts with 2xx means	multiple_choice	2026-04-08 16:44:44.130372	\N
30	19	How can you test the performance of your computer system?	multiple_choice	2026-04-08 10:35:27.233171	\N
58	19	Which division multiplexing is divided channel into fixed length and cannot available (reallocate) when channel is free?	multiple_choice	2026-04-08 10:35:27.233171	\N
66	19	Which one is incorrect about OSI and TCP/IP model?	multiple_choice	2026-04-08 10:35:27.233171	\N
87	19	Which one is False about FLSM and VLSM?	multiple_choice	2026-04-08 10:35:27.233171	\N
103	19	What is an activity in Android?	multiple_choice	2026-04-08 10:35:27.233171	\N
106	19	Which of the following is not considered as a risk in project management?	multiple_choice	2026-04-08 10:35:27.233171	\N
110	19	What is the purpose of system analysis and design?	multiple_choice	2026-04-08 10:35:27.233171	\N
121	19	Variable name in PHP starts with?	multiple_choice	2026-04-08 10:35:27.233171	\N
126	19	Which of the following is a correct syntax to create an object of interface named Animal?	multiple_choice	2026-04-08 10:54:13.316109	\N
127	19	Identify one which is preemption based algorithm when scheduling CPU:	multiple_choice	2026-04-08 10:54:13.316109	\N
160	19	Which of the following is not correct about PHP?	multiple_choice	2026-04-08 10:54:13.316109	\N
168	19	Which of the following DDoS in mobile systems wait for the owner to trigger the cyber attack?	multiple_choice	2026-04-08 10:54:13.316109	\N
171	19	Which of the following devices is layer 3(network Layer) device?	multiple_choice	2026-04-08 10:54:13.316109	\N
173	19	Which one of the following is not the advantage of using randomized algorithms?	multiple_choice	2026-04-08 10:54:13.316109	\N
176	19	Which of these is not an objective for use-case modeling?	multiple_choice	2026-04-08 10:54:13.316109	\N
179	19	One of the following is NOT the mechanism of the system threat that creates an environment to attack when operating system resources/user files are misused, which one?	multiple_choice	2026-04-08 10:54:13.316109	\N
347	19	Referencing the following HTML listing, how would you style only the first paragraph inside the footer element to have a smaller font size?	multiple_choice	2026-04-08 11:02:19.828102	\N
364	19	What is the primary function of the CPU?	multiple_choice	2026-04-08 11:33:58.43932	\N
373	19	How can you clean the keyboard of your computer system?	multiple_choice	2026-04-08 11:34:12.895991	\N
386	19	The aims of query processing is:	multiple_choice	2026-04-08 11:34:12.895991	\N
398	19	Which one is incorrect about MAC address and IP address?	multiple_choice	2026-04-08 11:34:12.895991	\N
405	19	In which OSI layer both error detection and correction is performed?	multiple_choice	2026-04-08 11:34:12.895991	\N
406	19	Which one is combine Segment into Frame and Frame into Packet?	multiple_choice	2026-04-08 11:34:12.895991	\N
416	19	Which one is false concerned on domain and workgroup?	multiple_choice	2026-04-08 11:34:12.895991	\N
445	19	The ______ method when used in the method field, leaves entity body empty.	multiple_choice	2026-04-08 11:34:12.895991	\N
452	19	Which of the following is not project management goal?	multiple_choice	2026-04-08 11:34:12.895991	\N
454	19	What are the Five Project Management Process Groups in order?	multiple_choice	2026-04-08 11:34:12.895991	\N
459	19	What is the purpose of a class diagram?	multiple_choice	2026-04-08 11:34:12.895991	\N
474	19	Which of the following is true about MAC address?	multiple_choice	2026-04-08 11:34:18.713484	\N
485	19	A web based application model that used to add, modify and access objects hierarchically.	multiple_choice	2026-04-08 11:34:18.713484	\N
377	22	How can you remove a virus or malware from your computer system?	multiple_choice	2026-04-08 11:34:12.895991	\N
512	19	What is the impact of not including a JOIN command when using multiple tables in a query?	multiple_choice	2026-04-08 11:34:18.713484	\N
519	19	The following java code snippet shows a class definition containing only parametrized constructor. public class Car { String type; String model; String color; public Car(String type, String model, String color) { this.type = type; this.model = model; this.color = color; } } Which of the following statement wrongly invokes the constructor?	multiple_choice	2026-04-08 11:34:18.713484	\N
523	19	Various new methods of dealing with applets that works by dividing the virtual address space up into equal-size regions, which is called.	multiple_choice	2026-04-08 11:34:18.713484	\N
531	19	Which one of the following RAID level offers optimal performance and reliability?	multiple_choice	2026-04-08 11:34:18.713484	\N
537	19	The structure and behavior of various functional modules (HW and SW) of a digital computer as well as how these modules interact to meet the requirement of the user.	multiple_choice	2026-04-08 11:34:18.713484	\N
538	19	Which of the following is not a step in elimination of states procedure?	multiple_choice	2026-04-08 11:34:18.713484	\N
544	19	A Double-ended queue supports operations such as adding and removing items from both the sides of the queue. They support four operations like addFront(adding item to top of the queue), addRear(adding item to the bottom of the queue), removeFront(removing item from the top of the queue) and removeRear(removing item from the bottom of the queue). You are given only stacks to implement this data structure. You can implement only push and pop operations. What are the total number of stacks required for this operation? (you can reuse the stack)	multiple_choice	2026-04-08 11:34:18.713484	\N
546	19	Which of the following is true about spanning trees?	multiple_choice	2026-04-08 11:34:18.713484	\N
568	19	_______ is a database schema that depicts key dependencies between the primary key and foreign key.	multiple_choice	2026-04-08 11:34:29.136225	\N
592	19	About the parts of a router, which of the following statements is true?	multiple_choice	2026-04-08 11:34:29.136225	\N
593	19	_______ is the tag for the heading that is the largest and the most bold.	multiple_choice	2026-04-08 11:34:29.136225	\N
600	19	If a method contains a local variable with the same as one of its class's the local variable _______ the field in the method's scope.	multiple_choice	2026-04-08 11:34:29.136225	\N
601	19	On a router, you have numerous routes set up. What command only displays static routes?	multiple_choice	2026-04-08 11:34:29.136225	\N
607	19	When you design a class diagram, which class hierarchies' relationship you are not going to apply?	multiple_choice	2026-04-08 11:34:29.136225	\N
608	19	Which information does the TCP header contain but the UDP header does not?	multiple_choice	2026-04-08 11:34:29.136225	\N
612	19	Identify the function that changes the output of intSalary = inputBox("What is your salary") into numerical representation.	multiple_choice	2026-04-08 11:34:29.136225	\N
614	19	A communication between application and the android Operating System is handled by _______	multiple_choice	2026-04-08 11:34:29.136225	\N
617	19	Which one of the following assigns the value 3 to the 0th index of the temp array?	multiple_choice	2026-04-08 11:34:29.136225	\N
619	19	Referencing the following HTML listing, how would you style only the first paragraph inside the footer element to have a smaller font size?	multiple_choice	2026-04-08 11:34:29.136225	\N
632	19	_______ defined for a simple connectionless communication that provides no error recovery and no delivery guarantee.	multiple_choice	2026-04-08 11:34:29.136225	\N
644	19	What happens if several catch blocks match the type of the thrown exception?	multiple_choice	2026-04-08 11:34:34.057608	\N
660	19	Which one of the following statements is True about operating systems as an I/O manager?	multiple_choice	2026-04-08 11:34:34.057608	\N
667	19	Based on the code snippet given below, which one of the following statements allow you to assign an email submitted from the form to a variable called email? UserEmail	multiple_choice	2026-04-08 11:34:34.057608	\N
684	19	___________is methods assume conflict is rare and only checks for conflicts at commit/terminate time?	multiple_choice	2026-04-08 11:34:34.057608	\N
686	19	Which one of the following is used to display an output in PHP?	multiple_choice	2026-04-08 11:34:34.057608	\N
694	19	Which one of the following PHP functions is used to execute SQL queries?	multiple_choice	2026-04-08 11:34:34.057608	\N
705	19	Which one of the following statements is True about operating systems?	multiple_choice	2026-04-08 11:34:34.057608	\N
715	19	For recovery purposes, the transaction processing system not needs to keep _______________?	multiple_choice	2026-04-08 11:34:34.057608	\N
732	19	Which one of the following statements is the right way of creating a cookie called product that can only stay for 2 weeks?	multiple_choice	2026-04-08 11:34:34.057608	\N
735	19	Which one of the following statements is True about process state transition?	multiple_choice	2026-04-08 11:34:34.057608	\N
758	19	Which one of the HTML5 attributes makes a text box inactive to edit?	multiple_choice	2026-04-08 16:44:44.130372	\N
759	19	A variable declared _______ has a GLOBAL SCOPE?	multiple_choice	2026-04-08 16:44:44.130372	\N
765	19	Which TCP/IP layer allows an IP packet to make a physical link to transmission media?	multiple_choice	2026-04-08 16:44:44.130372	\N
772	19	To ensure integrity of the data, a database system should ensure transactions to possess certain properties. The property which makes sure that the partial effects of incomplete transactions should not visible to the other transactions is called___________?	multiple_choice	2026-04-08 16:44:44.130372	\N
783	19	Which one of the following is wrong about structural and object-oriented programming paradigms?	multiple_choice	2026-04-08 16:44:44.130372	\N
785	19	One of the following is not true statement.	multiple_choice	2026-04-08 16:44:44.130372	\N
803	19	From the following list of Java variables; which one is invalid?	multiple_choice	2026-04-08 16:44:44.130372	\N
820	19	_________is s a problem which occurs when two transactions access the same data items concurrently and their operations interleaved.	multiple_choice	2026-04-08 16:44:44.130372	\N
825	19	For recovery purposes, the transaction processing system not needs to keep _______________?	multiple_choice	2026-04-08 16:44:44.130372	\N
829	19	What will happen when we run the following segment of Java code? public static void main(String args[]){ int i; int []a={3,4,0,5}; for( i=3;i>=0;i--){ System.out.print(30/a[i]); System.out.print(a[i]); }	multiple_choice	2026-04-08 16:44:44.130372	\N
834	19	Which of the following keyword is used to refer the member of base classes from a subclass?	multiple_choice	2026-04-08 16:44:44.130372	\N
841	19	Which connectivity device packets send to all connected device at the same time?	multiple_choice	2026-04-08 16:44:44.130372	\N
868	19	Which of the following best describes a class in object-oriented programming?	multiple_choice	2026-04-08 16:44:44.130372	\N
878	19	One of the following is major emphasis of Structural programming paradigm.	multiple_choice	2026-04-08 16:44:44.130372	\N
880	19	When designing complex software systems with multiple interacting objects, what design principle is crucial for maintainability and scalability?	multiple_choice	2026-04-08 16:44:44.130372	\N
888	19	What will happen if two thread of the same priority are called to be processed simultaneously?	multiple_choice	2026-04-08 16:44:44.130372	\N
892	19	Which of the following languages is primarily used for client-side scripting in web development?	multiple_choice	2026-04-08 16:44:44.130372	\N
901	19	You're tasked with creating a website for a news organization with daily content updates. How would you ensure efficient content management and user experience for readers?	multiple_choice	2026-04-08 16:44:44.130372	\N
925	19	Which command will back up the configuration that is stored in NVRAM to a TFTP server?	multiple_choice	2026-04-08 16:44:44.130372	\N
936	19	Which one of the following widgets is suitable to display data from an adapter or an array?	multiple_choice	2026-04-08 16:44:44.130372	\N
956	19	Which one of the following is not the correct mapping of the Dot Net Data Provider?	multiple_choice	2026-04-08 16:44:44.130372	\N
963	19	Which pillars of OOP is nothing but hiding the internal detail of the methods?	multiple_choice	2026-04-08 16:44:44.130372	\N
968	19	If you want to use your JDBC driver you must first register it with the DriverManager object. According to driver loading aspects, which one of the following is not correct about driver loading to connecting the respective data source?	multiple_choice	2026-04-08 16:44:44.130372	\N
994	19	If you are a system administrator for a small business that has multiple remote sites and you want to be able to remotely manage the servers at these sites and perform routine maintenance tasks, which of the following tools will you use?	multiple_choice	2026-04-08 16:44:44.130372	\N
1012	19	Which one of the following is wrong about session and cookies?	multiple_choice	2026-04-08 16:44:44.130372	\N
1018	19	What is an interpreted language which is used to manage the dynamic content of the website?	multiple_choice	2026-04-08 16:44:44.130372	\N
1019	19	Which of the following is a symbol in PHP scripting Language, which used to perform operations on variables or values?	multiple_choice	2026-04-08 16:44:44.130372	\N
1020	19	Which of the following method used to open a file using PHP scripting language?	multiple_choice	2026-04-08 16:44:44.130372	\N
1022	19	If Transport Layer Security is used to secure data (e.g. web pages) between a client and server, TLS uses:	multiple_choice	2026-04-08 16:44:44.130372	\N
1038	19	In the following pairs of OSI protocol layer/ sub-layer and its functionality the INCORRECT pair is:-	multiple_choice	2026-04-08 16:44:44.130372	\N
1050	19	Which command will allow host 192.168.144.25 to have telnet access to network 172.16.0.0?	multiple_choice	2026-04-08 16:44:44.130372	\N
1056	19	Which one of the following creates a connection-oriented connection that provides reliable end-to-end transfer and uses window mechanism for flow control?	multiple_choice	2026-04-08 16:44:44.130372	\N
1090	19	If you don't specify a return value, Android function will return,	multiple_choice	2026-04-08 16:44:44.130372	\N
1097	19	Which one of the following statements correctly describe the feature of object-Oriented programming?	multiple_choice	2026-04-08 16:44:44.130372	\N
28	20	How can you clean the keyboard of your computer system?	multiple_choice	2026-04-08 10:35:27.233171	\N
41	20	The aims of query processing is:	multiple_choice	2026-04-08 10:35:27.233171	\N
96	20	What will be the output of the Java array program?	multiple_choice	2026-04-08 10:35:27.233171	\N
104	20	What is the life cycle of services in android?	multiple_choice	2026-04-08 10:35:27.233171	\N
111	20	What is the purpose of the planning phase of the SDLC?	multiple_choice	2026-04-08 10:35:27.233171	\N
119	20	What is a web browser?	multiple_choice	2026-04-08 10:35:27.233171	\N
128	20	What is the output of the following java program? class Flower { public Flower() { this("Rose"); System.out.print("Flower."); } public Flower(String name) { System.out.print("I am "+name); } } public class RoseTest extends Flower { public RoseTest() { super(); System.out.print("Hi there!"); } public static void main(String[] args) { Flower flower = new RoseTest(); } }	multiple_choice	2026-04-08 10:54:13.316109	\N
135	20	Precedence of regular expression in decreasing order is:	multiple_choice	2026-04-08 10:54:13.316109	\N
136	20	The first step of machine learning is:	multiple_choice	2026-04-08 10:54:13.316109	\N
155	20	One is not correct about binary number system.	multiple_choice	2026-04-08 10:54:13.316109	\N
163	20	The post-order traversal of a binary tree is O P Q R S T. Then possible pre-order traversal will be:	multiple_choice	2026-04-08 10:54:13.316109	\N
180	20	Suppose that you are given the following code snippet. Which one of the following statements is wrong about the given code snippet? abstract class Animal { public Animal(String name) { System.out.println("I am animal class Constructor"); } abstract void sound(); final abstract void eat(); final void move() { } } public class Lion extends Animal { void sound() { } public static void main(String[] args) { } }	multiple_choice	2026-04-08 10:54:13.316109	\N
311	20	Which of the following is a physical memory format installed directly in today's desktop computer system?	multiple_choice	2026-04-08 11:02:19.828102	\N
346	20	If you want to display an image without any text around it, you should nest it inside what tag(s)?	multiple_choice	2026-04-08 11:02:19.828102	\N
348	20	Eavesdropping and packet sniffing are considered to be attacks of _______	multiple_choice	2026-04-08 11:02:19.828102	\N
362	20	When a new computer user wants to use virtualization, which hardware components need to support virtual technology for this to work properly?	multiple_choice	2026-04-08 11:02:19.828102	\N
369	20	Which of the following is a basic component of a computer system?	multiple_choice	2026-04-08 11:34:12.895991	\N
393	20	One of your classmates creates the student table. then he or she creates a view and he or she wants an update on his or her view with aggregation and summary but she or he can't see the updated result why?	multiple_choice	2026-04-08 11:34:12.895991	\N
397	20	Computer is connect to the network connection via?	multiple_choice	2026-04-08 11:34:12.895991	\N
417	20	Logical structure of active directory includes?	multiple_choice	2026-04-08 11:34:12.895991	\N
447	20	Which is the right way of declaring a variable in PHP?	multiple_choice	2026-04-08 11:34:12.895991	\N
471	20	Which of the following is a correct syntax to create an object of interface named Animal?	multiple_choice	2026-04-08 11:34:18.713484	\N
483	20	All of the following are examples of integral data types EXCEPT:	multiple_choice	2026-04-08 11:34:18.713484	\N
486	20	One of the operating system securities that identify each user of the system and associate the executing programs with those users. Which one?	multiple_choice	2026-04-08 11:34:18.713484	\N
491	20	Which of the following is not essential component of a data communications system?	multiple_choice	2026-04-08 11:34:18.713484	\N
498	20	How can the index.php script access the email form element of the following HTML form? <form action='index.php' method='post'><input type='text' name='email'/></form>	multiple_choice	2026-04-08 11:34:18.713484	\N
501	20	Which of the following act violates cyber security?	multiple_choice	2026-04-08 11:34:18.713484	\N
510	20	Which of the following is an infix expression?	multiple_choice	2026-04-08 11:34:18.713484	\N
951	20	What is the proper code to put data into the dataset called CustomerDataset using the CustomerDataAdapter object?	multiple_choice	2026-04-08 16:44:44.130372	\N
541	20	You create some new tables and populate them with copies of your production data. You run reports on your new tables but your queries take a lot longer than on the original tables. What should you create to help speed up reads in the database?	multiple_choice	2026-04-08 11:34:18.713484	\N
560	20	User views are included as part of which schema?	multiple_choice	2026-04-08 11:34:18.713484	\N
564	20	The statement 'x = 3 + 4*4' is executed. In this case what value will be assigned to the numeric variable x?	multiple_choice	2026-04-08 11:34:29.136225	\N
571	20	_______ is a valid name for a variable?	multiple_choice	2026-04-08 11:34:29.136225	\N
587	20	What will be the output of the following statement? txtBox.Text = FormatCurrency(1234.567)	multiple_choice	2026-04-08 11:34:29.136225	\N
638	20	Which one of the following statements is wrong about a web page?	multiple_choice	2026-04-08 11:34:34.057608	\N
671	20	If a process runs, out of the extra space allocated to it, then which action is not taken by the system?	multiple_choice	2026-04-08 11:34:34.057608	\N
673	20	Which one of the following is wrong about structural and object-oriented programming paradigms?	multiple_choice	2026-04-08 11:34:34.057608	\N
675	20	One of the following is not true statement.	multiple_choice	2026-04-08 11:34:34.057608	\N
702	20	Timestamp ordering protocol is said to be free from deadlock because of _________ reason?	multiple_choice	2026-04-08 11:34:34.057608	\N
707	20	Which one of the following subnet masks represents class A before and after subnetting?	multiple_choice	2026-04-08 11:34:34.057608	\N
708	20	Which mode of transmission the entire capacity of the channel can be utilized for each direction?	multiple_choice	2026-04-08 11:34:34.057608	\N
718	20	Which one of the following statements is wrong about a session?	multiple_choice	2026-04-08 11:34:34.057608	\N
721	20	Which one of the following is used for only local communication in private network?	multiple_choice	2026-04-08 11:34:34.057608	\N
726	20	Concept of OOP that provides code reusability is _________	multiple_choice	2026-04-08 11:34:34.057608	\N
728	20	One of the following is true statement about constructors?	multiple_choice	2026-04-08 11:34:34.057608	\N
729	20	Which one of the following is the correct way of creating a PHP variable?	multiple_choice	2026-04-08 11:34:34.057608	\N
731	20	Which connectivity device packets send to all connected device at the same time?	multiple_choice	2026-04-08 11:34:34.057608	\N
742	20	If we want to develop a program to display the names of 7 days in a week, what type of Java statement can be appropriate to solve the problem?	multiple_choice	2026-04-08 11:34:34.057608	\N
745	20	Which of the following is correct way of inheriting interface A by class B?	multiple_choice	2026-04-08 11:34:34.057608	\N
746	20	One of the following statements is false	multiple_choice	2026-04-08 16:44:44.130372	\N
748	20	Which one of the following statements is wrong about a web page?	multiple_choice	2026-04-08 16:44:44.130372	\N
749	20	Suppose String S=null; then what type of exception will occur when we execute the statement System.out.println(S.charAt(0));	multiple_choice	2026-04-08 16:44:44.130372	\N
755	20	The DBMS acts as an interface between what two components of an enterprise-class database system?	multiple_choice	2026-04-08 16:44:44.130372	\N
760	20	Which Java statement always executes its body at least once, even though the condition is not true?	multiple_choice	2026-04-08 16:44:44.130372	\N
763	20	Features of Java used to handle more than one job at a time.	multiple_choice	2026-04-08 16:44:44.130372	\N
781	20	If a process runs, out of the extra space allocated to it, then which action is not taken by the system?	multiple_choice	2026-04-08 16:44:44.130372	\N
786	20	Which one of the following is the output of the given program? (PHP loop with continue)	multiple_choice	2026-04-08 16:44:44.130372	\N
788	20	Which one of the following PHP functions is used to redirect a user to a specific page?	multiple_choice	2026-04-08 16:44:44.130372	\N
789	20	Which one is the right name given for unique identification of each entity?	multiple_choice	2026-04-08 16:44:44.130372	\N
814	20	Which keyword is used to prevent content of a variable from being modified?	multiple_choice	2026-04-08 16:44:44.130372	\N
817	20	Which one of the following subnet masks represents class A before and after subnetting?	multiple_choice	2026-04-08 16:44:44.130372	\N
826	20	Which of the following is true about Java static methods and instance methods?	multiple_choice	2026-04-08 16:44:44.130372	\N
832	20	Which one of the following is not an access modifier in Java?	multiple_choice	2026-04-08 16:44:44.130372	\N
842	20	Which one of the following statements is the right way of creating a cookie called product that can only stay for 2 weeks?	multiple_choice	2026-04-08 16:44:44.130372	\N
855	20	Which of the following is correct way of inheriting interface A by class B?	multiple_choice	2026-04-08 16:44:44.130372	\N
867	20	In which type of isolation level does Transactions must acquire long duration read locks on the individual data items that they read.	multiple_choice	2026-04-08 16:44:44.130372	\N
869	20	What is the principle in object-oriented programming that allows us to hide the internal implementation details of a class and only expose its functionalities through methods?	multiple_choice	2026-04-08 16:44:44.130372	\N
873	20	UML (Unified Modeling Language) offers various diagrams to represent user requirements in object-oriented systems. Which of the following UML diagrams is MOST suitable for capturing the high-level interactions between users and the system?	multiple_choice	2026-04-08 16:44:44.130372	\N
875	20	In your class diagram for the library management system, you have a class named 'Book' with attributes like title, author, and genre. You also have a class named 'Member' with attributes like name and contact information. What type of UML relationship would you use to show that a Book can be borrowed by a member?	multiple_choice	2026-04-08 16:44:44.130372	\N
877	20	When method overloading is determined?	multiple_choice	2026-04-08 16:44:44.130372	\N
887	20	What is the use of the finalize() method in Java?	multiple_choice	2026-04-08 16:44:44.130372	\N
909	20	While assessing your project processes for quality tools, you have identified some uncontrolled random or non-random process variations. Which of the following would be the appropriate chart you may use for this purpose?	multiple_choice	2026-04-08 16:44:44.130372	\N
912	20	When is UDP (user datagram protocol) preferred over TCP (Transmission Control Protocol)?	multiple_choice	2026-04-08 16:44:44.130372	\N
915	20	What command can be used on a windows PC to see the IP configuration of that computer?	multiple_choice	2026-04-08 16:44:44.130372	\N
916	20	Which of the following guided transmission media is best suited for high-speed, long-distance communication?	multiple_choice	2026-04-08 16:44:44.130372	\N
922	20	Which of the following is considered as a common network monitoring tool?	multiple_choice	2026-04-08 16:44:44.130372	\N
929	20	Which of the following is not part of an android main component?	multiple_choice	2026-04-08 16:44:44.130372	\N
930	20	Which android activity life cycle method is responsible to bring an activity to the foreground and enables user to interact with it?	multiple_choice	2026-04-08 16:44:44.130372	\N
931	20	Which of the following code displays 'hello mock' when button bt is clicked?	multiple_choice	2026-04-08 16:44:44.130372	\N
960	20	What is the output of the following C# program after expected (run)? (++a * ++a with a=10)	multiple_choice	2026-04-08 16:44:44.130372	\N
967	20	JDBC drivers are an interface that enables you to open database connections and to interact with it by sending SQL or database commands then receiving results with Java. Therefore which JDBC driver is 100% pure Java driver that is also called a thin drive and it requests directly to the database using its native protocol?	multiple_choice	2026-04-08 16:44:44.130372	\N
972	20	Which of the following compiler generates the stub and skeleton object from the remote Interface?	multiple_choice	2026-04-08 16:44:44.130372	\N
1013	20	Which one of the following fragment of HTML code is the correct method to display the formula of a^2=a*b^2+c^2?	multiple_choice	2026-04-08 16:44:44.130372	\N
1033	20	How could SCSI termination be performed?	multiple_choice	2026-04-08 16:44:44.130372	\N
1054	20	Which OSI reference model layer is responsible for translating data in a form that can be understood by the receiver?	multiple_choice	2026-04-08 16:44:44.130372	\N
1067	20	The super global array variables are accessible	multiple_choice	2026-04-08 16:44:44.130372	\N
1081	20	Which factor that measures the quality of the management process?	multiple_choice	2026-04-08 16:44:44.130372	\N
1093	20	To support the 802.1Q protocol, a trunk interface needs to be configured. What command will accomplish this?	multiple_choice	2026-04-08 16:44:44.130372	\N
1098	20	In Public key encryption, if A wants to send an encrypted message to B, which statement is true?	multiple_choice	2026-04-08 16:44:44.130372	\N
1102	20	What will be the output of the following statement? txtBox.Text = FormatCurrency(1234.567)	multiple_choice	2026-04-08 16:44:44.130372	\N
1111	20	Identify the necessary tool for creating and testing your android apps on different virtual devices.	multiple_choice	2026-04-08 16:44:44.130372	\N
1117	20	If you want to display an image without any text around it, you should nest it inside__________tag(s)?	multiple_choice	2026-04-08 16:44:44.130372	\N
1125	20	Assume: a computer lab where student demands the Administrator access to a Windows 11 system to install SQL Server; but that right should not be given to the student unless he/she is member of an employee. Which principle of cyber security is considered here?	multiple_choice	2026-04-08 16:44:44.130372	\N
35	21	Which of the following statement is not true about the database approach?	multiple_choice	2026-04-08 10:35:27.233171	\N
55	21	The advantage of wireless network over wired network is?	multiple_choice	2026-04-08 10:35:27.233171	\N
63	21	At which layer transmission mode (simplex, half duplex, full duplex) is determine?	multiple_choice	2026-04-08 10:35:27.233171	\N
92	21	Which of the following is false about abstraction in java?	multiple_choice	2026-04-08 10:35:27.233171	\N
94	21	Which of the following is correct about the difference between structural and object oriented programming?	multiple_choice	2026-04-08 10:35:27.233171	\N
107	21	Which of the following is not project management goal?	multiple_choice	2026-04-08 10:35:27.233171	\N
113	21	Which of the following is not a software development methodology?	multiple_choice	2026-04-08 10:35:27.233171	\N
115	21	How can we create and manage threads in java?	multiple_choice	2026-04-08 10:35:27.233171	\N
117	21	Which Of The Following Is An Example Of FTP.	multiple_choice	2026-04-08 10:35:27.233171	\N
124	21	Depth first search always expands the node in the problem representation of a search tree.	multiple_choice	2026-04-08 10:54:13.316109	\N
139	21	A process stack does not contain one of the following, which one?	multiple_choice	2026-04-08 10:54:13.316109	\N
146	21	Which of the following is not essential component of a data communications system?	multiple_choice	2026-04-08 10:54:13.316109	\N
147	21	The relation book (title, price) contains the titles and prices of different books. Assuming that no two books have the same price, what does the following SQL query list? SELECT title FROM book as B WHERE (SELECT count(*) FROM book as T WHERE T.price > B.price) < 5	multiple_choice	2026-04-08 10:54:13.316109	\N
166	21	The data structure required to check whether an expression contains a balanced parenthesis is?	multiple_choice	2026-04-08 10:54:13.316109	\N
170	21	_____ limits who gains access to the database while _____ limits what a user can access within the database.	multiple_choice	2026-04-08 10:54:13.316109	\N
175	21	Which one of the following is different?	multiple_choice	2026-04-08 10:54:13.316109	\N
184	21	A linear collection of data elements where the linear node is given by means of pointer is called?	multiple_choice	2026-04-08 10:54:13.316109	\N
188	21	Suppose you are an ORACLE DBA and you need to create a trigger on the EMPLOYEES table that monitors every row that is changed and places this information into the AUDIT_TABLE. What type of trigger do you create?	multiple_choice	2026-04-08 10:54:13.316109	\N
200	21	The UML diagram that depicts the interaction between entities such as objects, classes, user interfaces etc participated in an execution of a certain use case is known as:	multiple_choice	2026-04-08 10:54:13.316109	\N
207	21	Which system development method executes the phases of the SDLC is linear manner?	multiple_choice	2026-04-08 10:54:13.316109	\N
338	21	What needs to be configured according to the topology below to allow traffic to be routed to the host if it enters routers A with the destination address 198.44.4.217?	multiple_choice	2026-04-08 11:02:19.828102	\N
344	21	Assume: Dawit created some nested tags as displayed here: <p><b><i>Peace!</i></b></p>. Did he perform valid nesting? Why?	multiple_choice	2026-04-08 11:02:19.828102	\N
345	21	Which one of the following assigns the value 3 to the 0th index of the temp array?	multiple_choice	2026-04-08 11:02:19.828102	\N
375	21	How can you test the performance of your computer system?	multiple_choice	2026-04-08 11:34:12.895991	\N
378	21	Which of the following is a safety measure to take when repairing or maintaining a computer system?	multiple_choice	2026-04-08 11:34:12.895991	\N
381	21	Which of the following statement is true about distributed database systems?	multiple_choice	2026-04-08 11:34:12.895991	\N
382	21	Which of the following statement shows the difference between homogenous and heterogeneous in distributed database system respectively?	multiple_choice	2026-04-08 11:34:12.895991	\N
395	21	Which one of the following is carry information from sender to receiver?	multiple_choice	2026-04-08 11:34:12.895991	\N
400	21	The advantage of wireless network over wired network is?	multiple_choice	2026-04-08 11:34:12.895991	\N
426	21	Which one is used to store configured routing information permanently?	multiple_choice	2026-04-08 11:34:12.895991	\N
430	21	Which one is add?	multiple_choice	2026-04-08 11:34:12.895991	\N
433	21	Which of the following line of code is incorrect? (Java inheritance)	multiple_choice	2026-04-08 11:34:12.895991	\N
435	21	What is the output of the Java program? (method overriding)	multiple_choice	2026-04-08 11:34:12.895991	\N
446	21	The correct sequence of HTML tags for starting a webpage is?	multiple_choice	2026-04-08 11:34:12.895991	\N
465	21	Which of the following is used to read an HTML page and render it?	multiple_choice	2026-04-08 11:34:12.895991	\N
484	21	A process stack does not contain one of the following, which one?	multiple_choice	2026-04-08 11:34:18.713484	\N
497	21	The expression static_cast<int>(6.9) + static_cast<int>(7.9) evaluates to:	multiple_choice	2026-04-08 11:34:18.713484	\N
503	21	Declares the host that's the most authoritative for the zone and, as such, is the best source of DNS information for the zone.	multiple_choice	2026-04-08 11:34:18.713484	\N
529	21	A linear collection of data elements where the linear node is given by means of pointer is called?	multiple_choice	2026-04-08 11:34:18.713484	\N
534	21	Sector 0 of the disk is called which is used to boot the computer.	multiple_choice	2026-04-08 11:34:18.713484	\N
569	21	What is the importance of ssh command?	multiple_choice	2026-04-08 11:34:29.136225	\N
604	21	Suppose that the selector in a select Case block is the string variable myVar. Which of the following Case clause is invalid?	multiple_choice	2026-04-08 11:34:29.136225	\N
616	21	Assume: Dawit created some nested tags as displayed here: <p><b><i>Peace!</i></b></p>. Did he perform valid nesting? Why?	multiple_choice	2026-04-08 11:34:29.136225	\N
633	21	The super global array variables are accessible:	multiple_choice	2026-04-08 11:34:29.136225	\N
649	21	A variable declared _______ has a GLOBAL SCOPE?	multiple_choice	2026-04-08 11:34:34.057608	\N
656	21	A process stack does not contain ___________	multiple_choice	2026-04-08 11:34:34.057608	\N
662	21	To ensure integrity of the data, a database system should ensure transactions to possess certain properties. The property which makes sure that the partial effects of incomplete transactions should not visible to the other transactions is called___________?	multiple_choice	2026-04-08 11:34:34.057608	\N
666	21	Assume Mr. Daniel is running different applications at the same time like browsing the internet while preparing his assignment, so which type of operating system he used.	multiple_choice	2026-04-08 11:34:34.057608	\N
670	21	Choose the lists of the keywords in order that they would be used to handle exceptions in Java.	multiple_choice	2026-04-08 11:34:34.057608	\N
709	21	If a transaction is allowed to read a data item that was produced by an uncommitted transaction, what do we call this read?	multiple_choice	2026-04-08 11:34:34.057608	\N
744	21	Which one of the following database models under record database model category?	multiple_choice	2026-04-08 11:34:34.057608	\N
770	21	Which one of the following statements is True about operating systems as an I/O manager?	multiple_choice	2026-04-08 16:44:44.130372	\N
778	21	One of the following is not consider in cost estimation during query optimization?	multiple_choice	2026-04-08 16:44:44.130372	\N
792	21	The velocity of propagation of a signal through a guided medium varies with frequency. This type transmission impairment is called?	multiple_choice	2026-04-08 16:44:44.130372	\N
795	21	___________is a rule of no component of the primary key may contain a NULL value.	multiple_choice	2026-04-08 16:44:44.130372	\N
797	21	Among the following one is the process of analyzing the given relation schemas based on their functional dependencies and primary keys.	multiple_choice	2026-04-08 16:44:44.130372	\N
799	21	A program written in ___________ language does not require a server to run.	multiple_choice	2026-04-08 16:44:44.130372	\N
801	21	Which one is false about abstract class and interface in Java?	multiple_choice	2026-04-08 16:44:44.130372	\N
804	21	Which one of the following PHP functions is used to execute SQL queries?	multiple_choice	2026-04-08 16:44:44.130372	\N
809	21	Which one of the following is correct statement?	multiple_choice	2026-04-08 16:44:44.130372	\N
813	21	One of the following is false about Java database connectivity (JDBC)	multiple_choice	2026-04-08 16:44:44.130372	\N
816	21	Transaction-processing systems usually allow multiple transactions to run concurrently. Which of the following best suits as the advantage(s) of allowing concurrent execution of transactions?	multiple_choice	2026-04-08 16:44:44.130372	\N
830	21	____________means the transaction happens indivisibly; a transaction either happens completely or not at all.	multiple_choice	2026-04-08 16:44:44.130372	\N
836	21	Concept of OOP that provides code reusability is _________	multiple_choice	2026-04-08 16:44:44.130372	\N
844	21	Unshielded twisted pair cable that is used for 16 Mbps Token Ring is --------------------	multiple_choice	2026-04-08 16:44:44.130372	\N
846	21	One of the following is/are the recovery technique from catastrophic failures?	multiple_choice	2026-04-08 16:44:44.130372	\N
858	21	What is the term used to describe the process of assigning each fragment or copy of a fragment to a particular site in a distributed system?	multiple_choice	2026-04-08 16:44:44.130372	\N
870	21	During a system analysis project, the team decides to create multiple models, each focusing on a specific aspect of the system. Which of the following benefits does this approach offer?	multiple_choice	2026-04-08 16:44:44.130372	\N
900	21	A client wants a website showcasing their photography portfolio. They have hundreds of high-resolution images. How would you optimize the website's content management and user experience for these images?	multiple_choice	2026-04-08 16:44:44.130372	\N
948	21	Which component of a computer is responsible for sending visual output to a monitor or other display device?	multiple_choice	2026-04-08 16:44:44.130372	\N
971	21	Which one of the following correct sequences of execute and interpreted in java?	multiple_choice	2026-04-08 16:44:44.130372	\N
976	21	Which of the following is server side gateway which writes and transmits the response to the client machine?	multiple_choice	2026-04-08 16:44:44.130372	\N
979	21	Which of the following does not involve developing a mobile app strategy to determine how your organization might benefit from one during the mobile app development process?	multiple_choice	2026-04-08 16:44:44.130372	\N
982	21	Android provides several ways to store and share data. Which of the following can be a way of storing and retrieving key-value pairs of data that can be used to store user settings or application configuration data?	multiple_choice	2026-04-08 16:44:44.130372	\N
986	21	Which one of the following is true?	multiple_choice	2026-04-08 16:44:44.130372	\N
989	21	In project management project team should aware of modern quality management complements in project management. Which one can be characteristics of modern quality management?	multiple_choice	2026-04-08 16:44:44.130372	\N
995	21	You are responsible for managing a Linux mail server that is used by your organization. You want to configure the server to send and receive email securely. Which of the following protocols will you use to encrypt email transmissions?	multiple_choice	2026-04-08 16:44:44.130372	\N
1001	21	If a transaction transfers 100 birr from account A to account B, which is located at another site. What type of transaction is this?	multiple_choice	2026-04-08 16:44:44.130372	\N
1002	21	It is a loosely-coupled architecture optimized for applications that are inherently centralized and require high availability and performance	multiple_choice	2026-04-08 16:44:44.130372	\N
1016	21	A web browser will automatically send the cookies set by a server back to the server for all http requests to the server. Why?	multiple_choice	2026-04-08 16:44:44.130372	\N
1028	21	Which memory is known by the name cache memory?	multiple_choice	2026-04-08 16:44:44.130372	\N
383	22	A schedule where the operations of each transaction are executed consecutively without any other interference from other transactions.	multiple_choice	2026-04-08 11:34:12.895991	\N
1034	21	A place every software and hardware configuration is stored in a database, such things stored as folder and file property settings, port configuration, application preferences, and user profiles is:	multiple_choice	2026-04-08 16:44:44.130372	\N
1040	21	In one of the pairs of protocols given below, both the protocols can use multiple TCP connections between the same client and the server. Which one is that?	multiple_choice	2026-04-08 16:44:44.130372	\N
1044	21	Which OSI layer is responsible for encryption, compression and translation of packets sent from source to destination?	multiple_choice	2026-04-08 16:44:44.130372	\N
1051	21	Which one of the following is TRUE about the interior gateway routing protocols-Routing information protocol (RIP) and Open Shortest Path First (OSPF)?	multiple_choice	2026-04-08 16:44:44.130372	\N
1053	21	You are the network administrator for your company. You want to restrict all ping attempts from outside your company from reaching internal hosts. Your internal network is using the IP network of 200.15.24.0/24. Then which command should be executed on the corporate boundary router to accomplish the task?	multiple_choice	2026-04-08 16:44:44.130372	\N
1060	21	Which one of the following directories contains the configuration files?	multiple_choice	2026-04-08 16:44:44.130372	\N
1061	21	Which of the following variable holds information about the web server and page	multiple_choice	2026-04-08 16:44:44.130372	\N
1077	21	What is the correct way to open the file 'time.txt' as readable?	multiple_choice	2026-04-08 16:44:44.130372	\N
1082	21	Which of the following is true regarding the command switchport mode dynamic auto?	multiple_choice	2026-04-08 16:44:44.130372	\N
1085	21	Application-associated processing in the background is handled by	multiple_choice	2026-04-08 16:44:44.130372	\N
1104	21	Among the four frames of organization, coordination, and control are run?	multiple_choice	2026-04-08 16:44:44.130372	\N
1105	21	What is the importance of ssh command?	multiple_choice	2026-04-08 16:44:44.130372	\N
1110	21	What is the proper syntax when using a message dialog box?	multiple_choice	2026-04-08 16:44:44.130372	\N
1124	21	Based on the following source code, which page will be displayed?	multiple_choice	2026-04-08 16:44:44.130372	\N
1128	21	About the parts of a router, which of the following statements is true?	multiple_choice	2026-04-08 16:44:44.130372	\N
1135	21	Which tag used to add a background color for all <h1> elements?	multiple_choice	2026-04-08 16:44:44.130372	\N
1140	21	is a valid name for a variable?	multiple_choice	2026-04-08 16:44:44.130372	\N
31	22	What is the purpose of a BIOS (Basic Input/Output System)?	multiple_choice	2026-04-08 10:35:27.233171	\N
34	22	In which database design phase we will develop all the technologies and organizational specifications?	multiple_choice	2026-04-08 10:35:27.233171	\N
37	22	Which of the following statement shows the difference between homogenous and heterogeneous in distributed database system respectively?	multiple_choice	2026-04-08 10:35:27.233171	\N
48	22	One of your classmates creates the student table. then he or she creates a view and he or she wants an update on his or her view with aggregation and summary but she or he can't see the updated result why?	multiple_choice	2026-04-08 10:35:27.233171	\N
64	22	Which one is Protocol Data Unit (PDU) of Data-link layer?	multiple_choice	2026-04-08 10:35:27.233171	\N
70	22	Workgroup name and computer name must be?	multiple_choice	2026-04-08 10:35:27.233171	\N
76	22	Which password policy prevents users from creating a new password that is the same as their current password or a recently used password?	multiple_choice	2026-04-08 10:35:27.233171	\N
79	22	Subneting IP address to support 25 hosts, so how many available hosts?	multiple_choice	2026-04-08 10:35:27.233171	\N
81	22	Which one is used to store configured routing information permanently?	multiple_choice	2026-04-08 10:35:27.233171	\N
84	22	Which protocol is used to secure when transfer data through a network?	multiple_choice	2026-04-08 10:35:27.233171	\N
88	22	Which of the following line of code is incorrect? (Java inheritance)	multiple_choice	2026-04-08 10:35:27.233171	\N
95	22	One of the following programming focuses on representing both structure and behavior of information system into small modules that combines data and process together?	multiple_choice	2026-04-08 10:35:27.233171	\N
98	22	Which of the following is the correct way to handle an exception that occurs in this program? (ArithmeticException)	multiple_choice	2026-04-08 10:35:27.233171	\N
114	22	What is the purpose of a class diagram?	multiple_choice	2026-04-08 10:35:27.233171	\N
116	22	This Of The Following Is An Internet Protocol.	multiple_choice	2026-04-08 10:35:27.233171	\N
125	22	What kind of transmission medium is most appropriate to carry data in a computer network that is exposed to electrical interferences?	multiple_choice	2026-04-08 10:54:13.316109	\N
144	22	The amortized time complexity of the dynamic array problem is?	multiple_choice	2026-04-08 10:54:13.316109	\N
153	22	How can the index.php script access the email form element of the following HTML form? <form action='index.php' method='post'><input type='text' name='email'/></form>	multiple_choice	2026-04-08 10:54:13.316109	\N
164	22	Regular expression are:	multiple_choice	2026-04-08 10:54:13.316109	\N
187	22	Which of the following IPv4 address belongs class B address?	multiple_choice	2026-04-08 10:54:13.316109	\N
205	22	The most basic digital arithmetic circuit which Performs the addition of two binary digits.	multiple_choice	2026-04-08 10:54:13.316109	\N
208	22	Which one of the following is a correct representation of the fact 'Abebe is father of Natan' using first order logic in prolog?	multiple_choice	2026-04-08 10:54:13.316109	\N
299	22	_______ is a valid name for a variable?	multiple_choice	2026-04-08 11:02:19.828102	\N
314	22	Select the task involves when you write object-oriented programs.	multiple_choice	2026-04-08 11:02:19.828102	\N
320	22	About the parts of a router, which of the following statements is true?	multiple_choice	2026-04-08 11:02:19.828102	\N
327	22	In object-oriented development through which diagrams we are not analyze the dynamic semantics of problem or its implementation?	multiple_choice	2026-04-08 11:02:19.828102	\N
331	22	The correct order of query optimization is _______	multiple_choice	2026-04-08 11:02:19.828102	\N
337	22	Among the four frames of organization _______ addresses the question flow roles and responsibilities coordination and control are run?	multiple_choice	2026-04-08 11:02:19.828102	\N
351	22	What command alters the group owner of a file?	multiple_choice	2026-04-08 11:02:19.828102	\N
354	22	Which of the following variable holds information about the web server and page?	multiple_choice	2026-04-08 11:02:19.828102	\N
356	22	Application-associated processing in the background is handled by:	multiple_choice	2026-04-08 11:02:19.828102	\N
357	22	Which function is operated in layer 2 (function of a switch)?	multiple_choice	2026-04-08 11:02:19.828102	\N
358	22	Which function is not relevant to protect your site from characters that can potentially do damage to your system?	multiple_choice	2026-04-08 11:02:19.828102	\N
359	22	The _______ notation in a relative path of hypertext reference matches:	multiple_choice	2026-04-08 11:02:19.828102	\N
374	22	Which of the following is a reason to perform regular backups of your data?	multiple_choice	2026-04-08 11:34:12.895991	\N
384	22	It is a Recovery Techniques which is useful if transactions execute serially.	multiple_choice	2026-04-08 11:34:12.895991	\N
399	22	Which one is true about Connection-oriented and Connection-less communication?	multiple_choice	2026-04-08 11:34:12.895991	\N
407	22	At which layer routing protocols are determining the shortest path of the destination?	multiple_choice	2026-04-08 11:34:12.895991	\N
413	22	The Port Number of Secure Shell (SSH) is?	multiple_choice	2026-04-08 11:34:12.895991	\N
418	22	A collection of trees that share a common global catalog, directory schema, logical structure, and directory configuration is known as?	multiple_choice	2026-04-08 11:34:12.895991	\N
428	22	Which one is used single key to encrypt and decrypt?	multiple_choice	2026-04-08 11:34:12.895991	\N
436	22	What will be the access modifier of an object if you don't specify when declaring?	multiple_choice	2026-04-08 11:34:12.895991	\N
442	22	How do you insert a list item to the list? (ArrayList)	multiple_choice	2026-04-08 11:34:12.895991	\N
444	22	String s=null; System.out.println(s.length()); Which type of exception must be handled?	multiple_choice	2026-04-08 11:34:12.895991	\N
480	22	Precedence of regular expression in decreasing order is:	multiple_choice	2026-04-08 11:34:18.713484	\N
490	22	Which of the following is not a cybercrime?	multiple_choice	2026-04-08 11:34:18.713484	\N
493	22	______ allow you to specify the style of your page elements (spacing, margins, etc.) separately from the structure of your document.	multiple_choice	2026-04-08 11:34:18.713484	\N
509	22	Regular expression are:	multiple_choice	2026-04-08 11:34:18.713484	\N
513	22	Which of the following DDoS in mobile systems wait for the owner to trigger the cyber attack?	multiple_choice	2026-04-08 11:34:18.713484	\N
516	22	Which of the following devices is layer 3(network Layer) device?	multiple_choice	2026-04-08 11:34:18.713484	\N
527	22	Which of the following is true about FILE *fp?	multiple_choice	2026-04-08 11:34:18.713484	\N
535	22	A register that manages the memory address of the instruction to be executed next.	multiple_choice	2026-04-08 11:34:18.713484	\N
549	22	Which tool is used for managing and controlling network access and security policies on a Windows Server?	multiple_choice	2026-04-08 11:34:18.713484	\N
554	22	Suppose there is a database that maintains business activities of the company. In the database Sales data is stored into two tables - one for recent sales (the past six months) and one for older or archived sales data. You are tasked with creating a solution to allow managers to be able to see monthly sales data from the previous month and for the same period a year ago. What would you do?	multiple_choice	2026-04-08 11:34:18.713484	\N
563	22	Which one of the following directories contains the configuration files?	multiple_choice	2026-04-08 11:34:29.136225	\N
585	22	_______ is the default file system type of Linux.	multiple_choice	2026-04-08 11:34:29.136225	\N
595	22	Routing loops are not a problem for link-state protocols like distance-vector protocols. Why?	multiple_choice	2026-04-08 11:34:29.136225	\N
596	22	_______ is a program that executes compiled Java code on a specific platform.	multiple_choice	2026-04-08 11:34:29.136225	\N
603	22	The correct order of query optimization is _______	multiple_choice	2026-04-08 11:34:29.136225	\N
609	22	Among the four frames of organization _______ addresses the question flow roles and responsibilities coordination and control are run?	multiple_choice	2026-04-08 11:34:29.136225	\N
610	22	What needs to be configured according to the topology below to allow traffic to be routed to the host if it enters routers A with the destination address 198.44.4.217?	multiple_choice	2026-04-08 11:34:29.136225	\N
620	22	Eavesdropping and packet sniffing are considered to be attacks of _______	multiple_choice	2026-04-08 11:34:29.136225	\N
647	22	What will be the output of the following program? (Assuming program computes 3^2=9)	multiple_choice	2026-04-08 11:34:34.057608	\N
651	22	Software and hardware that uses hypertext Transfer Protocol to respond to client requests is ---?	multiple_choice	2026-04-08 11:34:34.057608	\N
661	22	Identify the correct statement based on the code snippet given below. $fop=fopen('xyz.txt','a+'); fwrite($fop,'hello'); fclose($fop);	multiple_choice	2026-04-08 11:34:34.057608	\N
669	22	Among the following lists one doesn't describe a field in a relation?	multiple_choice	2026-04-08 11:34:34.057608	\N
674	22	What is the use of isset() function in PHP?	multiple_choice	2026-04-08 11:34:34.057608	\N
683	22	Among the following one describes the functional dependency between non-key attributes of a relation?	multiple_choice	2026-04-08 11:34:34.057608	\N
701	22	______________is a technique/process of keeping and maintaining a log file of all transaction changes made to database to enable effective recovery in event of failure?	multiple_choice	2026-04-08 11:34:34.057608	\N
717	22	Which one of the following wireless transmission systems the sending and receiving antennas need not be aligned?	multiple_choice	2026-04-08 11:34:34.057608	\N
737	22	The built-in base class in Java, which is used to handle all exceptions is:	multiple_choice	2026-04-08 11:34:34.057608	\N
741	22	In which condition the finally block will not be executed?	multiple_choice	2026-04-08 11:34:34.057608	\N
756	22	One of the following is false statement about uses of servlet	multiple_choice	2026-04-08 16:44:44.130372	\N
768	22	Which of the following is not common member to both abstract classes and interfaces?	multiple_choice	2026-04-08 16:44:44.130372	\N
807	22	Which layer allows an IP packet to make a physical link to the media?	multiple_choice	2026-04-08 16:44:44.130372	\N
822	22	Which of the following is not a java.util.Scanner method?	multiple_choice	2026-04-08 16:44:44.130372	\N
840	22	Choose the correct statement about Java variables.	multiple_choice	2026-04-08 16:44:44.130372	\N
856	22	_____________ determines the extent to which individual nodes or DBs in a connected DDB can operate independently.	multiple_choice	2026-04-08 16:44:44.130372	\N
871	22	An analyst is developing a model to document the different states a 'Product Order' can go through (e.g., Submitted, Processing, and Shipped). Which modeling technique is most appropriate for this scenario?	multiple_choice	2026-04-08 16:44:44.130372	\N
883	22	Which of the following statement is INCORRECT about the Final keyword in Java?	multiple_choice	2026-04-08 16:44:44.130372	\N
893	22	What is the primary purpose of HyperText Markup Language (HTML) in web development?	multiple_choice	2026-04-08 16:44:44.130372	\N
911	22	Which layer in the TCP/IP model is used for formatting, compressing, and encrypting data?	multiple_choice	2026-04-08 16:44:44.130372	\N
918	22	What benefit does DHCP provides for a given network?	multiple_choice	2026-04-08 16:44:44.130372	\N
928	22	Which of the following switch port modes is used to connect end devices, such as computers or printers, to a switch?	multiple_choice	2026-04-08 16:44:44.130372	\N
932	22	Which of the following android library is used for drawing?	multiple_choice	2026-04-08 16:44:44.130372	\N
933	22	Which of the following android library is used to store color information of drawing?	multiple_choice	2026-04-08 16:44:44.130372	\N
941	22	Which of the following is a tool used for remotely administering a Windows computer?	multiple_choice	2026-04-08 16:44:44.130372	\N
975	22	When we need to display 'Hello GUI' text on the content of our Graphical User Interface, so which one of the following is correct?	multiple_choice	2026-04-08 16:44:44.130372	\N
984	22	Which one of the following methods used for selecting project in certain organization?	multiple_choice	2026-04-08 16:44:44.130372	\N
1092	22	In ER diagrammatic notation, has its name underlined inside the oval describes	multiple_choice	2026-04-08 16:44:44.130372	\N
1094	22	Which of the following assigns the value 3 to the 0th index of the temp array?	multiple_choice	2026-04-08 16:44:44.130372	\N
1101	22	Which of the following approaches is best for state decision support system software project management activities?	multiple_choice	2026-04-08 16:44:44.130372	\N
1113	22	OSPF uses what multicast address for neighbor discovery?	multiple_choice	2026-04-08 16:44:44.130372	\N
1126	22	Identify the function that changes the output of intSalary InputBox('What is your salary') into numerical representation	multiple_choice	2026-04-08 16:44:44.130372	\N
1130	22	On a router, you have numerous routes set up. What command only displays static routes?	multiple_choice	2026-04-08 16:44:44.130372	\N
1131	22	One of the following is not the disadvantage of simple file processing?	multiple_choice	2026-04-08 16:44:44.130372	\N
1134	22	What is the correct HTML code for referring an external JavaScript?	multiple_choice	2026-04-08 16:44:44.130372	\N
1137	22	What programming language is used to create system calls in UNIX?	multiple_choice	2026-04-08 16:44:44.130372	\N
49	23	The key difference between the hierarchical data model and the network data model is?	multiple_choice	2026-04-08 10:35:27.233171	\N
53	23	Which one is incorrect about MAC address and IP address?	multiple_choice	2026-04-08 10:35:27.233171	\N
57	23	Transmission media is present at the OSI layer of?	multiple_choice	2026-04-08 10:35:27.233171	\N
67	23	Which protocol is address resolution protocol responsible for translating from IP addresses to MAC addresses?	multiple_choice	2026-04-08 10:35:27.233171	\N
68	23	The Port Number of Secure Shell (SSH) is?	multiple_choice	2026-04-08 10:35:27.233171	\N
80	23	Which one is correct about Link-State routing algorithm?	multiple_choice	2026-04-08 10:35:27.233171	\N
97	23	How do you insert a list item to the list? (ArrayList)	multiple_choice	2026-04-08 10:35:27.233171	\N
100	23	The ______ method when used in the method field, leaves entity body empty.	multiple_choice	2026-04-08 10:35:27.233171	\N
120	23	Which of the following is used to read an HTML page and render it?	multiple_choice	2026-04-08 10:35:27.233171	\N
129	23	Which of the following is true about MAC address?	multiple_choice	2026-04-08 10:54:13.316109	\N
138	23	All of the following are examples of integral data types EXCEPT:	multiple_choice	2026-04-08 10:54:13.316109	\N
148	23	______ allow you to specify the style of your page elements (spacing, margins, etc.) separately from the structure of your document.	multiple_choice	2026-04-08 10:54:13.316109	\N
149	23	What are the advantages of arrays?	multiple_choice	2026-04-08 10:54:13.316109	\N
150	23	a+b* is equivalent to:	multiple_choice	2026-04-08 10:54:13.316109	\N
169	23	Which one of the following is not true about stack-based shift-reduce parser?	multiple_choice	2026-04-08 10:54:13.316109	\N
186	23	Which one of the following RAID level offers optimal performance and reliability?	multiple_choice	2026-04-08 10:54:13.316109	\N
199	23	A Double-ended queue supports operations such as adding and removing items from both the sides of the queue. They support four operations like addFront(adding item to top of the queue), addRear(adding item to the bottom of the queue), removeFront(removing item from the top of the queue) and removeRear(removing item from the bottom of the queue). You are given only stacks to implement this data structure. You can implement only push and pop operations. What are the total number of stacks required for this operation? (you can reuse the stack)	multiple_choice	2026-04-08 10:54:13.316109	\N
215	23	User views are included as part of which schema?	multiple_choice	2026-04-08 10:54:13.316109	\N
292	23	The statement 'x = 3 + 4*4' is executed. In this case what value will be assigned to the numeric variable x?	multiple_choice	2026-04-08 11:02:19.828102	\N
297	23	What is the importance of ssh command?	multiple_choice	2026-04-08 11:02:19.828102	\N
304	23	During installing a new video card into a desktop computer, what type of expansion slot is preferred today for high performance graphics adapters?	multiple_choice	2026-04-08 11:02:19.828102	\N
310	23	_______ is HTTP status code for client error such as page not found.	multiple_choice	2026-04-08 11:02:19.828102	\N
315	23	What will be the output of the following statement? txtBox.Text = FormatCurrency(1234.567)	multiple_choice	2026-04-08 11:02:19.828102	\N
316	23	One of the following cannot measure the quality of an abstraction?	multiple_choice	2026-04-08 11:02:19.828102	\N
339	23	Assume a concept denoted by X→Y, between two sets of attributes X and Y that are subsets of a relation R specifies a constraint on the possible tuples that can form a relation state r of R. The constraint is that, for any two tuples t1 and t2 in r that have t1[X]=t2[X], they must also have t1[Y]=t2[Y]. Which normalization level describes this concept?	multiple_choice	2026-04-08 11:02:19.828102	\N
366	23	Which protocol is used for secure communication over a computer network?	multiple_choice	2026-04-08 11:33:58.43932	\N
388	23	Assume the admin of the database and newly created user user1 by the admin. So Which of the following SQL query is used to access or modify the data from the admin by user?	multiple_choice	2026-04-08 11:34:12.895991	\N
402	23	Transmission media is present at the OSI layer of?	multiple_choice	2026-04-08 11:34:12.895991	\N
434	23	What is the output of the Java program? (private static variable access)	multiple_choice	2026-04-08 11:34:12.895991	\N
441	23	What will be the output of the Java array program?	multiple_choice	2026-04-08 11:34:12.895991	\N
448	23	What is an activity in Android?	multiple_choice	2026-04-08 11:34:12.895991	\N
453	23	Which of these truly defines Software design?	multiple_choice	2026-04-08 11:34:12.895991	\N
458	23	Which of the following is not a software development methodology?	multiple_choice	2026-04-08 11:34:12.895991	\N
466	23	Variable name in PHP starts with?	multiple_choice	2026-04-08 11:34:12.895991	\N
469	23	Depth first search always expands the node in the problem representation of a search tree.	multiple_choice	2026-04-08 11:34:18.713484	\N
482	23	Assume that production T -> A T*F, provided that T, *, and F are grammar symbols, is a final item of a given LR(0) item. How many grammar symbols will be popped from the parser stack?	multiple_choice	2026-04-08 11:34:18.713484	\N
495	23	a+b* is equivalent to:	multiple_choice	2026-04-08 11:34:18.713484	\N
517	23	_____ is refers to the objective an artificial machine.	multiple_choice	2026-04-08 11:34:18.713484	\N
525	23	Suppose that you are given the following code snippet. Which one of the following statements is wrong about the given code snippet? abstract class Animal { public Animal(String name) { System.out.println("I am animal class Constructor"); } abstract void sound(); final abstract void eat(); final void move() { } } public class Lion extends Animal { void sound() { } public static void main(String[] args) { } }	multiple_choice	2026-04-08 11:34:18.713484	\N
528	23	What is an inline function?	multiple_choice	2026-04-08 11:34:18.713484	\N
533	23	Suppose you are an ORACLE DBA and you need to create a trigger on the EMPLOYEES table that monitors every row that is changed and places this information into the AUDIT_TABLE. What type of trigger do you create?	multiple_choice	2026-04-08 11:34:18.713484	\N
550	23	The most basic digital arithmetic circuit which Performs the addition of two binary digits.	multiple_choice	2026-04-08 11:34:18.713484	\N
552	23	Which system development method executes the phases of the SDLC is linear manner?	multiple_choice	2026-04-08 11:34:18.713484	\N
557	23	Which of the following is an internet scam done by cyber-criminals where the user is convinced digitally to provide confidential information?	multiple_choice	2026-04-08 11:34:18.713484	\N
576	23	During installing a new video card into a desktop computer, what type of expansion slot is preferred today for high performance graphics adapters?	multiple_choice	2026-04-08 11:34:29.136225	\N
579	23	Assume: a computer lab where student demands the administrator access to a Windows 11 system to install SQL Server; but that right should not be given to the student unless he/she is member of an employee. Which principle of cyber security is considered here?	multiple_choice	2026-04-08 11:34:29.136225	\N
583	23	Which of the following is a physical memory format installed directly in today's desktop computer system?	multiple_choice	2026-04-08 11:34:29.136225	\N
611	23	Assume a concept denoted by X→Y, between two sets of attributes X and Y that are subsets of a relation R specifies a constraint on the possible tuples that can form a relation state r of R. The constraint is that, for any two tuples t1 and t2 in r that have t1[X]=t2[X], they must also have t1[Y]=t2[Y]. Which normalization level describes this concept?	multiple_choice	2026-04-08 11:34:29.136225	\N
615	23	Which one of the following statements correctly describe the feature of object-oriented programming?	multiple_choice	2026-04-08 11:34:29.136225	\N
621	23	_______ is threats of a database, which can occur due to creation, insertion, updating, changing the status of data, and deletion.	multiple_choice	2026-04-08 11:34:29.136225	\N
626	23	Which of the following variable holds information about the web server and page?	multiple_choice	2026-04-08 11:34:29.136225	\N
627	23	Which tag used to add a background color for all <h1> elements?	multiple_choice	2026-04-08 11:34:29.136225	\N
642	23	The activity of choosing an efficient execution strategy for processing a query is called ___________?	multiple_choice	2026-04-08 11:34:34.057608	\N
648	23	Which one of the HTML5 attributes makes a text box inactive to edit?	multiple_choice	2026-04-08 11:34:34.057608	\N
654	23	Which one of the following is not necessary condition for deadlock to occurred?	multiple_choice	2026-04-08 11:34:34.057608	\N
659	23	Given a class named Student, which of the following is a valid constructor declaration for this class?	multiple_choice	2026-04-08 11:34:34.057608	\N
664	23	Which layer allows an IP packet to make a physical link to the media?	multiple_choice	2026-04-08 11:34:34.057608	\N
689	23	A program written in ___________ language does not require a server to run.	multiple_choice	2026-04-08 11:34:34.057608	\N
704	23	Which keyword is used to prevent content of a variable from being modified?	multiple_choice	2026-04-08 11:34:34.057608	\N
724	23	Which of the following keyword is used to refer the member of base classes from a subclass?	multiple_choice	2026-04-08 11:34:34.057608	\N
727	23	One of the following is true about relational database data model?	multiple_choice	2026-04-08 11:34:34.057608	\N
739	23	An entity that cannot stand by itself or that cannot have a record unless there is another entity to be related with it is for its existence is called?	multiple_choice	2026-04-08 11:34:34.057608	\N
764	23	Which one of the following is not necessary condition for deadlock to occurred?	multiple_choice	2026-04-08 16:44:44.130372	\N
766	23	A process stack does not contain ___________	multiple_choice	2026-04-08 16:44:44.130372	\N
776	23	Assume Mr. Daniel is running different applications at the same time like browsing the internet while preparing his assignment, so which type of operating system he used.	multiple_choice	2026-04-08 16:44:44.130372	\N
777	23	Based on the code snippet given below, which one of the following statements allow you to assign an email submitted from the form to a variable called email? UserEmail	multiple_choice	2026-04-08 16:44:44.130372	\N
787	23	Which one of the following statements is the correct way of defining a CSS style using a class selector?	multiple_choice	2026-04-08 16:44:44.130372	\N
790	23	Which coding transition is at the middle of the bit and changes phase when a different bit is encountered?	multiple_choice	2026-04-08 16:44:44.130372	\N
805	23	Which method execute first when you run Servlet code?	multiple_choice	2026-04-08 16:44:44.130372	\N
806	23	A class declaration that begins with the keyword ______________ must be stored in a file that has exactly the same name as that class and ends with the .java file-name extension.	multiple_choice	2026-04-08 16:44:44.130372	\N
811	23	______________is a technique/process of keeping and maintaining a log file of all transaction changes made to database to enable effective recovery in event of failure?	multiple_choice	2026-04-08 16:44:44.130372	\N
831	23	Which one of the following is used for only local communication in private network?	multiple_choice	2026-04-08 16:44:44.130372	\N
839	23	Which one of the following is the correct way of creating a PHP variable?	multiple_choice	2026-04-08 16:44:44.130372	\N
857	23	In relational databases, _____________ values indicate unknown, missing, or nonapplicable data.	multiple_choice	2026-04-08 16:44:44.130372	\N
860	23	_____________used to interpret the meaning of the data elements corresponding to that attribute.	multiple_choice	2026-04-08 16:44:44.130372	\N
863	23	_______________ is a mechanism where all the previous logs are removed from the system and stored permanently in a storage disk.	multiple_choice	2026-04-08 16:44:44.130372	\N
881	23	Which feature of OOP is indicated by the following code? Class Student{ int marks; } class Topper extends Student{ private int age; public topper(int age){ this.age=age; }}	multiple_choice	2026-04-08 16:44:44.130372	\N
882	23	Consider the following snippet of code, which of the following statement is correct? (Removing Stmt-1 will make the program compilable and it will print 'Base: Hello Derived')	multiple_choice	2026-04-08 16:44:44.130372	\N
898	23	A user clicks a button on your webpage. How can you use client-side scripting (JavaScript) to enhance the user experience without requiring a full page reload?	multiple_choice	2026-04-08 16:44:44.130372	\N
910	23	A company has a network address of 192.168.1.64 with a subnet mask of 255.255.255.192. The company wants to create two subnetworks that would contain 10 hosts and 18 hosts respectively. Which two networks would achieve that?	multiple_choice	2026-04-08 16:44:44.130372	\N
939	23	Which of the following is a method for managing group membership in Linux?	multiple_choice	2026-04-08 16:44:44.130372	\N
945	23	Which of the following bus slot provides the highest video performance?	multiple_choice	2026-04-08 16:44:44.130372	\N
947	23	What is a recommended method of preventing overheating in a computer system?	multiple_choice	2026-04-08 16:44:44.130372	\N
974	23	In desktop application, which of the following is/are the basis to contain other user interface components like Label, Button, text Fields etc. in java Graphical User Interface (GUI) that is not contained another window.	multiple_choice	2026-04-08 16:44:44.130372	\N
998	23	Which of the following is false about constraints?	multiple_choice	2026-04-08 16:44:44.130372	\N
1009	23	Application programs and computing devices are having a communication with each other by exchanging a message using a communication standard called transmission control protocol. The followings are then true about transmission control protocol except	multiple_choice	2026-04-08 16:44:44.130372	\N
1015	23	The web server does not know who you are or what you do when you work with an application. But there is a way to store information to be used across multiple pages without storing on users computer. So, which of the following way holds information?	multiple_choice	2026-04-08 16:44:44.130372	\N
1026	23	A security manager is setting up resource permission in application. The security manager has discovered that he can establish object that contains accesses control model that most closely resembles is:	multiple_choice	2026-04-08 16:44:44.130372	\N
1027	23	A security officer has declared that information system must be certified before it can be used. This is belongs for:	multiple_choice	2026-04-08 16:44:44.130372	\N
1031	23	_________________is a method of using hard disk space as if it were RAM.	multiple_choice	2026-04-08 16:44:44.130372	\N
1048	23	Consider the following statements about the routing protocols. Routing Information Protocol (RIP) and Open Shortest Path First (OSPF) in an IPv4 network. Which of the statements above are CORRECT?	multiple_choice	2026-04-08 16:44:44.130372	\N
1068	23	Assume a concept denoted by X → Y, between two sets of attributes X and Y that are subsets of a relation R specifies a constraint on the possible tuples that can form a relation state r of R. Which normalization level describes this concept?	multiple_choice	2026-04-08 16:44:44.130372	\N
1074	23	The correct order of query optimization is __________	multiple_choice	2026-04-08 16:44:44.130372	\N
1076	23	When you design a class diagram, which class hierarchies' relationship you are not going to apply?	multiple_choice	2026-04-08 16:44:44.130372	\N
1079	23	Assume: Dawit created some nested tags as displayed here: <p> <b><i> Peace! </i></b></p>. Did he perform valid nesting? (Why?)	multiple_choice	2026-04-08 16:44:44.130372	\N
1080	23	Suppose that the selector in a Select Case block is the string variable myVar. Which of the following Case clause is Invalid?	multiple_choice	2026-04-08 16:44:44.130372	\N
1112	23	_______is HTTP status code for client error such as page not found.	multiple_choice	2026-04-08 16:44:44.130372	\N
1118	23	In order to establish a neighborship, which is a need for EIGRP routers?	multiple_choice	2026-04-08 16:44:44.130372	\N
1122	23	You install a new NIC for a user, and he asks 'what it does?'. Which of the following best characterizes the functions of this device?	multiple_choice	2026-04-08 16:44:44.130372	\N
1129	23	One of the following cannot measure the quality of an abstraction?	multiple_choice	2026-04-08 16:44:44.130372	\N
45	24	Which of the following statement is true about the indexes?	multiple_choice	2026-04-08 10:35:27.233171	\N
50	24	Which one of the following is carry information from sender to receiver?	multiple_choice	2026-04-08 10:35:27.233171	\N
51	24	Which one is Metropolitan Area Network (MAN) technology?	multiple_choice	2026-04-08 10:35:27.233171	\N
71	24	Which one is false concerned on domain and workgroup?	multiple_choice	2026-04-08 10:35:27.233171	\N
72	24	Logical structure of active directory includes?	multiple_choice	2026-04-08 10:35:27.233171	\N
73	24	A collection of trees that share a common global catalog, directory schema, logical structure, and directory configuration is known as?	multiple_choice	2026-04-08 10:35:27.233171	\N
74	24	A relationship between different domains or forests that allow sharing of resources between them is called?	multiple_choice	2026-04-08 10:35:27.233171	\N
78	24	Why subnetting a given IP address?	multiple_choice	2026-04-08 10:35:27.233171	\N
82	24	Which one is global configuration mode?	multiple_choice	2026-04-08 10:35:27.233171	\N
99	24	String s=null; System.out.println(s.length()); Which type of exception must be handled?	multiple_choice	2026-04-08 10:35:27.233171	\N
105	24	What is the life cycle of broadcast receivers in android?	multiple_choice	2026-04-08 10:35:27.233171	\N
123	24	Which of the following is used for concatenation in PHP?	multiple_choice	2026-04-08 10:35:27.233171	\N
131	24	Which of the following is the least strong security encryption standard?	multiple_choice	2026-04-08 10:54:13.316109	\N
132	24	Which component of Active Directory provides a searchable catalog of objects across multiple domains in a forest?	multiple_choice	2026-04-08 10:54:13.316109	\N
137	24	Assume that production T -> A T*F, provided that T, *, and F are grammar symbols, is a final item of a given LR(0) item. How many grammar symbols will be popped from the parser stack?	multiple_choice	2026-04-08 10:54:13.316109	\N
156	24	Which of the following act violates cyber security?	multiple_choice	2026-04-08 10:54:13.316109	\N
157	24	Amongst the ACID properties of a transaction, the 'Durability' property requires that the changes made to the database by a successful transaction persist:	multiple_choice	2026-04-08 10:54:13.316109	\N
159	24	What is the best data type definition for Oracle when a field is alphanumeric and has a fixed length?	multiple_choice	2026-04-08 10:54:13.316109	\N
165	24	Which of the following is an infix expression?	multiple_choice	2026-04-08 10:54:13.316109	\N
196	24	You create some new tables and populate them with copies of your production data. You run reports on your new tables but your queries take a lot longer than on the original tables. What should you create to help speed up reads in the database?	multiple_choice	2026-04-08 10:54:13.316109	\N
197	24	Which types of system testing uses a procedure that demands resources in abnormal quantity, frequency or volume?	multiple_choice	2026-04-08 10:54:13.316109	\N
201	24	Which of the following is true about spanning trees?	multiple_choice	2026-04-08 10:54:13.316109	\N
202	24	The fundamental building block of all digital logic circuits.	multiple_choice	2026-04-08 10:54:13.316109	\N
206	24	What is the preferred way for adding a background color in HTML?	multiple_choice	2026-04-08 10:54:13.316109	\N
210	24	Given the following set of unbreakable items with their associated values in Birr and weights in kilograms in a table, what is the maximum profit that can be made having a knapsack with a capacity of 6 kg. (Items: Value/Br: 60,20,32,15,40,36 | Weight/Kg: 4,2,2,1,3,2)	multiple_choice	2026-04-08 10:54:13.316109	\N
211	24	Which of the following is defined as an attempt to harm, damage or cause threat to a system or network?	multiple_choice	2026-04-08 10:54:13.316109	\N
216	24	Which one of the following is wrong about interface?	multiple_choice	2026-04-08 10:54:13.316109	\N
217	24	The action of the Simple reflex agent completely depends upon:	multiple_choice	2026-04-08 10:54:13.316109	\N
303	24	What is the proper syntax when using a message dialog box?	multiple_choice	2026-04-08 11:02:19.828102	\N
307	24	Assume: a computer lab where student demands the administrator access to a Windows 11 system to install SQL Server; but that right should not be given to the student unless he/she is member of an employee. Which principle of cyber security is considered here?	multiple_choice	2026-04-08 11:02:19.828102	\N
321	24	_______ is the tag for the heading that is the largest and the most bold.	multiple_choice	2026-04-08 11:02:19.828102	\N
341	24	What command will stop all plain-text password display in a router configuration files for unencrypted password?	multiple_choice	2026-04-08 11:02:19.828102	\N
342	24	A communication between application and the android Operating System is handled by _______	multiple_choice	2026-04-08 11:02:19.828102	\N
350	24	OSPF uses what multicast address for neighbor discovery?	multiple_choice	2026-04-08 11:02:19.828102	\N
361	24	The super global array variables are accessible:	multiple_choice	2026-04-08 11:02:19.828102	\N
391	24	Which of the following data management approach is difficult to cross-referencing?	multiple_choice	2026-04-08 11:34:12.895991	\N
392	24	Which of the following statement is served as a criterion for Optimization?	multiple_choice	2026-04-08 11:34:12.895991	\N
394	24	The key difference between the hierarchical data model and the network data model is?	multiple_choice	2026-04-08 11:34:12.895991	\N
408	24	At which layer transmission mode (simplex, half duplex, full duplex) is determine?	multiple_choice	2026-04-08 11:34:12.895991	\N
409	24	Which one is Protocol Data Unit (PDU) of Data-link layer?	multiple_choice	2026-04-08 11:34:12.895991	\N
410	24	Which protocol is available in Data-link layer?	multiple_choice	2026-04-08 11:34:12.895991	\N
411	24	Which one is incorrect about OSI and TCP/IP model?	multiple_choice	2026-04-08 11:34:12.895991	\N
425	24	Which one is correct about Link-State routing algorithm?	multiple_choice	2026-04-08 11:34:12.895991	\N
438	24	Which of the following is false about inheritance in java?	multiple_choice	2026-04-08 11:34:12.895991	\N
450	24	What is the life cycle of broadcast receivers in android?	multiple_choice	2026-04-08 11:34:12.895991	\N
460	24	How can we create and manage threads in java?	multiple_choice	2026-04-08 11:34:12.895991	\N
461	24	This Of The Following Is An Internet Protocol.	multiple_choice	2026-04-08 11:34:12.895991	\N
514	24	Which one of the following is not true about stack-based shift-reduce parser?	multiple_choice	2026-04-08 11:34:18.713484	\N
545	24	The UML diagram that depicts the interaction between entities such as objects, classes, user interfaces etc participated in an execution of a certain use case is known as:	multiple_choice	2026-04-08 11:34:18.713484	\N
556	24	Which of the following is defined as an attempt to harm, damage or cause threat to a system or network?	multiple_choice	2026-04-08 11:34:18.713484	\N
575	24	What is the proper syntax when using a message dialog box?	multiple_choice	2026-04-08 11:34:29.136225	\N
582	24	_______ is HTTP status code for client error such as page not found.	multiple_choice	2026-04-08 11:34:29.136225	\N
586	24	Select the task involves when you write object-oriented programs.	multiple_choice	2026-04-08 11:34:29.136225	\N
590	24	One of the following is not the disadvantage of simple file processing?	multiple_choice	2026-04-08 11:34:29.136225	\N
598	24	In case of any shutdown during transaction before commit, which of the following statement is done automatically?	multiple_choice	2026-04-08 11:34:29.136225	\N
606	24	Which of the following operations is utilized on java to allocate memory to an array variable?	multiple_choice	2026-04-08 11:34:29.136225	\N
618	24	If you want to display an image without any text around it, you should nest it inside what tag(s)?	multiple_choice	2026-04-08 11:34:29.136225	\N
622	24	OSPF uses what multicast address for neighbor discovery?	multiple_choice	2026-04-08 11:34:29.136225	\N
628	24	Application-associated processing in the background is handled by:	multiple_choice	2026-04-08 11:34:29.136225	\N
629	24	Which function is operated in layer 2 (function of a switch)?	multiple_choice	2026-04-08 11:34:29.136225	\N
635	24	_______ is an insertion operator which is used for overloading.	multiple_choice	2026-04-08 11:34:29.136225	\N
640	24	Which one of the following scheduling algorithms is both preemptive and non-preemptive?	multiple_choice	2026-04-08 11:34:34.057608	\N
652	24	One of the following is not true about inheritance?	multiple_choice	2026-04-08 11:34:34.057608	\N
668	24	One of the following is not consider in cost estimation during query optimization?	multiple_choice	2026-04-08 11:34:34.057608	\N
680	24	Which coding transition is at the middle of the bit and changes phase when a different bit is encountered?	multiple_choice	2026-04-08 11:34:34.057608	\N
681	24	Which of the following is not primitive data type in Java?	multiple_choice	2026-04-08 11:34:34.057608	\N
688	24	_____________are rules that should be obeyed or followed while manipulating the data?	multiple_choice	2026-04-08 11:34:34.057608	\N
698	24	Based on the html code given below identify the correct statement. Given Code: <p style='color:red;'>Hello Everyone</p>	multiple_choice	2026-04-08 11:34:34.057608	\N
714	24	Identify false statement among the given.	multiple_choice	2026-04-08 11:34:34.057608	\N
752	24	The activity of choosing an efficient execution strategy for processing a query is called ___________?	multiple_choice	2026-04-08 16:44:44.130372	\N
762	24	One of the following is not true about inheritance?	multiple_choice	2026-04-08 16:44:44.130372	\N
774	24	Which layer allows an IP packet to make a physical link to the media?	multiple_choice	2026-04-08 16:44:44.130372	\N
775	24	Which Java keyword cannot appear on instance variable declaration?	multiple_choice	2026-04-08 16:44:44.130372	\N
780	24	Choose the lists of the keywords in order that they would be used to handle exceptions in Java.	multiple_choice	2026-04-08 16:44:44.130372	\N
796	24	Which one of the following is used to display an output in PHP?	multiple_choice	2026-04-08 16:44:44.130372	\N
818	24	Which mode of transmission the entire capacity of the channel can be utilized for each direction?	multiple_choice	2026-04-08 16:44:44.130372	\N
824	24	Identify false statement among the given.	multiple_choice	2026-04-08 16:44:44.130372	\N
828	24	Which one of the following statements is wrong about a session?	multiple_choice	2026-04-08 16:44:44.130372	\N
845	24	Which one of the following statements is True about process state transition?	multiple_choice	2026-04-08 16:44:44.130372	\N
849	24	An entity that cannot stand by itself or that cannot have a record unless there is another entity to be related with it is for its existence is called?	multiple_choice	2026-04-08 16:44:44.130372	\N
850	24	Which wireless security method generates new keys each time when a client establishes connection to the router?	multiple_choice	2026-04-08 16:44:44.130372	\N
861	24	Not explicit schema-based constraints that can be expressed in the relational model	multiple_choice	2026-04-08 16:44:44.130372	\N
884	24	Consider a program that allows users to write data to different types of files (text, CSV). You plan to use polymorphism to achieve this. Which approach best utilizes polymorphism and I/O functionality?	multiple_choice	2026-04-08 16:44:44.130372	\N
902	24	When designing a client-server system with multiple clients accessing the server concurrently, what concurrency control mechanism would be most effective in preventing data inconsistencies?	multiple_choice	2026-04-08 16:44:44.130372	\N
903	24	During the evaluation phase of a client-server system, you identify performance bottlenecks. Which approach is the MOST effective for analyzing and improving concurrency issues?	multiple_choice	2026-04-08 16:44:44.130372	\N
917	24	What method can be used by two computers to ensure that packets are not dropped because too much data is being sent too quickly?	multiple_choice	2026-04-08 16:44:44.130372	\N
920	24	Which device performs the function of determining the path that messages should take through internetworks?	multiple_choice	2026-04-08 16:44:44.130372	\N
940	24	Which of the following is a method for restoring a system image backup in Windows?	multiple_choice	2026-04-08 16:44:44.130372	\N
946	24	Your client wants to buy laptops that can be expanded with additional ports not found in the base unit. The types of laptops your client is considering are designed to use which of the following?	multiple_choice	2026-04-08 16:44:44.130372	\N
952	24	What is the key difference between standard programming and event-driven programming?	multiple_choice	2026-04-08 16:44:44.130372	\N
959	24	Which one of the following use when a method wants to return more than one value?	multiple_choice	2026-04-08 16:44:44.130372	\N
980	24	Android application has go through a different stages in their life cycle. In which state activity start interacting with the user that means user can see the functionality and designing part of an application on the single screen.	multiple_choice	2026-04-08 16:44:44.130372	\N
993	24	Which of the following types of proxies or gateways is commonly used for filtering and controlling internet access in a network?	multiple_choice	2026-04-08 16:44:44.130372	\N
1004	24	Which of the following is the correct ways for handling recovery?	multiple_choice	2026-04-08 16:44:44.130372	\N
1021	24	A security manager needs to be able to regularity determine when operating system files change what kind of tool is needed for this risk?	multiple_choice	2026-04-08 16:44:44.130372	\N
1045	24	When a packet travels from router to router to its destination, what address continually changes from hop to hop?	multiple_choice	2026-04-08 16:44:44.130372	\N
1063	24	Select the task involves when you write object-oriented programs.	multiple_choice	2026-04-08 16:44:44.130372	\N
1066	24	The mathematical terms relation and tuple are referred to as?	multiple_choice	2026-04-08 16:44:44.130372	\N
1095	24	Which one of the following is true about Carrier Sense Multiple Access/Collision Detection (CSMA/CD) process on Ethernet LAN switch that configured with full-duplex?	multiple_choice	2026-04-08 16:44:44.130372	\N
1139	24	In case of any shut down during transaction before commit, which of the following statement is done automatically?	multiple_choice	2026-04-08 16:44:44.130372	\N
\.


--
-- TOC entry 5252 (class 0 OID 24630)
-- Dependencies: 235
-- Data for Name: quiz_attempts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quiz_attempts (id, user_id, quiz_id, score, total_questions, completed_at) FROM stdin;
13	1	37	1	10	2026-05-17 14:32:09.465062
14	1	35	1	5	2026-06-11 09:55:20.104926
\.


--
-- TOC entry 5246 (class 0 OID 24577)
-- Dependencies: 229
-- Data for Name: quizzes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quizzes (id, course_id, title, description, created_at, is_official, user_id, difficulty, quiz_type) FROM stdin;
35	11	Practice: Ch-1-Query Processing and Optimization (Easy)	AI Generated Content	2026-05-17 09:40:45.20599	f	1	Easy	quiz
36	11	Mid term Test	advanced database chapter 1 and 2 	2026-05-17 09:44:47.954628	t	\N	\N	quiz
37	9	advanced mid term exam	ch-1\n	2026-05-17 11:42:47.340337	t	\N	\N	quiz
17	4	Official Exam 1	\N	2026-04-08 16:58:43.524351	t	\N	\N	exam
18	4	Official Exam 2	\N	2026-04-08 16:58:43.524351	t	\N	\N	exam
19	4	Official Exam 3	\N	2026-04-08 16:58:43.524351	t	\N	\N	exam
20	4	Official Exam 4	\N	2026-04-08 16:58:43.524351	t	\N	\N	exam
21	4	Official Exam 5	\N	2026-04-08 16:58:43.524351	t	\N	\N	exam
22	4	Official Exam 6	\N	2026-04-08 16:58:43.524351	t	\N	\N	exam
23	4	Official Exam 7	\N	2026-04-08 16:58:43.524351	t	\N	\N	exam
24	4	Official Exam 8	\N	2026-04-08 16:58:43.524351	t	\N	\N	exam
\.


--
-- TOC entry 5262 (class 0 OID 32786)
-- Dependencies: 245
-- Data for Name: reported_questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reported_questions (id, question_id, reason, user_id, status, created_at) FROM stdin;
1	60	wrong answer	2	resolved	2026-04-08 18:21:38.814728
2	833	unclear wording 	1	resolved	2026-04-08 18:26:35.951359
\.


--
-- TOC entry 5284 (class 0 OID 49383)
-- Dependencies: 267
-- Data for Name: scheduled_notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.scheduled_notifications (id, user_id, type, scheduled_for, payload, sent, created_at) FROM stdin;
\.


--
-- TOC entry 5264 (class 0 OID 49155)
-- Dependencies: 247
-- Data for Name: study_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.study_sessions (id, user_id, material_id, started_at, duration_seconds, created_at) FROM stdin;
1	1	18	2026-05-20 21:47:01.871034	76	2026-05-20 21:47:01.871034
2	1	18	2026-05-20 21:55:42.317498	337	2026-05-20 21:55:42.317498
\.


--
-- TOC entry 5238 (class 0 OID 16406)
-- Dependencies: 221
-- Data for Name: system_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_settings (key, value) FROM stdin;
exam_date	2026-12-12
\.


--
-- TOC entry 5254 (class 0 OID 24651)
-- Dependencies: 237
-- Data for Name: user_notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_notes (id, user_id, material_id, content, updated_at, title) FROM stdin;
119	6	4	<p></p><p>📎&nbsp;<strong>Selection:</strong>&nbsp;<strong style="color: rgb(239, 68, 68);">Common&nbsp;Scenarios:</strong><em>&nbsp;Hidden&nbsp;form&nbsp;fields,&nbsp;tampering&nbsp;with&nbsp;URL&nbsp;parameters,&nbsp;and&nbsp;relying&nbsp;solely&nbsp;on&nbsp;client-side&nbsp;JavaScript&nbsp;validation.&nbsp;&nbsp;Prevention:&nbsp;Always&nbsp;validate&nbsp;and&nbsp;sanitize&nbsp;input&nbsp;on&nbsp;the&nbsp;server&nbsp;side,&nbsp;ensuring&nbsp;that&nbsp;all&nbsp;data&nbsp;from&nbsp;the&nbsp;user&nbsp;is&nbsp;treated&nbsp;as&nbsp;untrusted.</em></p>	2026-04-14 15:28:08.957185	My Notes
111	1	4	<h2><strong>hello</strong></h2>	2026-04-30 16:12:24.132174	My Notes
131	1	14	<p></p><p>📎&nbsp;<em>Database&nbsp;misuse&nbsp;could&nbsp;be&nbsp;Intentional&nbsp;or&nbsp;Accidental,&nbsp;where&nbsp;accidental&nbsp;misuse&nbsp;is&nbsp;easier&nbsp;to&nbsp;cope&nbsp;with&nbsp;than&nbsp;intentional&nbsp;misuse.</em></p>	2026-05-09 14:07:32.499837	My Notes
130	1	18	<p></p><p>📎&nbsp;<em>1000&nbsp;tuples&nbsp;in&nbsp;Staff.&nbsp;–&nbsp;50&nbsp;Managers&nbsp;–&nbsp;50&nbsp;tuples&nbsp;in&nbsp;Branch.&nbsp;–&nbsp;5&nbsp;London&nbsp;branches&nbsp;–&nbsp;No&nbsp;indexes&nbsp;or&nbsp;sort&nbsp;keys&nbsp;–&nbsp;All&nbsp;temporary&nbsp;results&nbsp;are&nbsp;written&nbsp;back&nbsp;to&nbsp;disk&nbsp;(memory&nbsp;is&nbsp;small)&nbsp;–&nbsp;T</em><strong style="color: rgb(239, 68, 68);"><em>uples&nbsp;are&nbsp;accessed&nbsp;one&nbsp;at&nbsp;a&nbsp;time&nbsp;(not&nbsp;in&nbsp;blocks)</em></strong></p>	2026-06-11 09:54:50.537561	My Notes
\.


--
-- TOC entry 5244 (class 0 OID 16450)
-- Dependencies: 227
-- Data for Name: user_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_progress (id, user_id, material_id, status, completed_at, percentage, last_accessed_at) FROM stdin;
130	1	21	in_progress	2026-05-14 21:51:43.780463	98	2026-05-14 21:51:50.205098
132	1	22	in_progress	2026-05-14 21:51:53.843446	98	2026-05-14 21:51:57.115146
134	1	23	in_progress	2026-05-14 21:52:00.704814	96	2026-05-14 21:52:03.3187
47	1	4	in_progress	2026-04-09 10:31:55.917294	54	2026-05-14 22:54:33.265615
140	1	31	completed	2026-05-16 22:23:51.96097	100	2026-05-16 22:23:52.165341
74	1	19	in_progress	2026-04-15 12:14:32.97988	2	2026-05-17 15:17:16.519912
56	2	4	in_progress	2026-04-09 12:13:14.684694	22	2026-04-14 09:36:25.052262
59	3	4	in_progress	2026-04-14 09:37:40.320461	54	2026-04-14 15:18:06.924646
78	1	18	in_progress	2026-04-30 16:12:39.790832	5	2026-06-11 09:57:10.585669
66	6	4	in_progress	2026-04-14 15:24:06.548516	63	2026-04-14 15:26:46.616081
69	7	4	in_progress	2026-04-14 15:54:38.055107	83	2026-04-14 15:54:43.300423
95	1	14	in_progress	2026-05-09 14:06:36.759519	16	2026-05-09 14:07:03.998471
103	1	13	in_progress	2026-05-14 21:46:35.544987	97	2026-05-14 21:46:45.160107
105	1	12	in_progress	2026-05-14 21:46:49.22826	98	2026-05-14 21:46:59.761526
80	1	17	in_progress	2026-04-30 16:49:32.019865	0	2026-05-14 21:47:13.788511
92	1	16	in_progress	2026-05-07 18:20:43.752469	16	2026-05-14 21:47:21.662251
72	1	15	in_progress	2026-04-15 12:07:46.741603	13	2026-05-14 21:47:29.349883
77	1	24	in_progress	2026-04-15 12:17:21.078926	0	2026-05-14 21:47:48.508384
113	1	25	in_progress	2026-05-14 21:48:07.191482	94	2026-05-14 21:48:11.893078
115	1	26	in_progress	2026-05-14 21:48:23.946351	98	2026-05-14 21:48:37.010066
117	1	27	in_progress	2026-05-14 21:49:04.133133	98	2026-05-14 21:49:19.607159
119	1	28	in_progress	2026-05-14 21:49:27.897679	99	2026-05-14 21:49:59.476999
123	1	29	in_progress	2026-05-14 21:50:13.446427	98	2026-05-14 21:50:19.55927
125	1	30	in_progress	2026-05-14 21:50:26.81085	97	2026-05-14 21:50:32.831861
128	1	20	in_progress	2026-05-14 21:51:25.491859	99	2026-05-14 21:51:36.157377
\.


--
-- TOC entry 5237 (class 0 OID 16389)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, theme, role, created_at, current_streak, max_streak, last_active_date, total_score, streak_freezes, daily_goal_minutes) FROM stdin;
2	markosss	aman@gmail.com	$2b$10$HCPSB4Zg0Xmaq2YTK3mjfeq5KrcaC0dJlyUKVy1YdDFmwF4BQfILa	eye	user	2026-04-01 10:18:15.997632	1	2	2026-05-09	6	0	20
3	eyob alemayehu	eyob@gmail.com	$2b$10$6cuvH/Uu18wuuzMpxqvfNOqj3/UiOEoWFssTwe8RM6Fl/c43hfS9u	light	user	2026-04-04 17:01:38.509254	1	2	2026-04-14	12	2	20
1	aman baye	amanbaye4@gmail.com	$2b$10$KWHuSlcUIcvrksMpoDSGu./S/5FlK00bxIYF7IW9XgjEIK8Wr1xGq	eye	admin	2026-04-01 10:02:25.513498	1	2	2026-06-11	17	2	20
6	awoke	awoke@gmail.com	$2b$10$lWdQrdkhwZyoDoxpUj1/vu01e9hWxElYBtXc1XIGTtM6PXkRu8emW	light	user	2026-04-14 15:23:56.388684	1	1	2026-04-14	5	2	20
7	abrham	abrham@gmail.com	$2b$10$Lkfs1HjMC8ATDj.qVZn4COzWQXqBoi07UekvSrQQ.hgdSF1RWT2le	light	user	2026-04-14 15:54:28.560376	1	1	2026-04-14	5	2	20
\.


--
-- TOC entry 5317 (class 0 OID 0)
-- Dependencies: 240
-- Name: ai_cache_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ai_cache_id_seq', 14, true);


--
-- TOC entry 5318 (class 0 OID 0)
-- Dependencies: 242
-- Name: ai_usage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ai_usage_id_seq', 17, true);


--
-- TOC entry 5319 (class 0 OID 0)
-- Dependencies: 258
-- Name: certificates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.certificates_id_seq', 2, true);


--
-- TOC entry 5320 (class 0 OID 0)
-- Dependencies: 222
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courses_id_seq', 17, true);


--
-- TOC entry 5321 (class 0 OID 0)
-- Dependencies: 238
-- Name: exam_attempts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exam_attempts_id_seq', 18, true);


--
-- TOC entry 5322 (class 0 OID 0)
-- Dependencies: 248
-- Name: flashcard_decks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.flashcard_decks_id_seq', 1, true);


--
-- TOC entry 5323 (class 0 OID 0)
-- Dependencies: 252
-- Name: flashcard_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.flashcard_reviews_id_seq', 13, true);


--
-- TOC entry 5324 (class 0 OID 0)
-- Dependencies: 250
-- Name: flashcards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.flashcards_id_seq', 11, true);


--
-- TOC entry 5325 (class 0 OID 0)
-- Dependencies: 260
-- Name: friendships_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.friendships_id_seq', 3, true);


--
-- TOC entry 5326 (class 0 OID 0)
-- Dependencies: 268
-- Name: material_videos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.material_videos_id_seq', 1, true);


--
-- TOC entry 5327 (class 0 OID 0)
-- Dependencies: 224
-- Name: materials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.materials_id_seq', 31, true);


--
-- TOC entry 5328 (class 0 OID 0)
-- Dependencies: 264
-- Name: notification_preferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notification_preferences_id_seq', 2, true);


--
-- TOC entry 5329 (class 0 OID 0)
-- Dependencies: 262
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 9, true);


--
-- TOC entry 5330 (class 0 OID 0)
-- Dependencies: 232
-- Name: options_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.options_id_seq', 4922, true);


--
-- TOC entry 5331 (class 0 OID 0)
-- Dependencies: 254
-- Name: pdf_bookmarks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pdf_bookmarks_id_seq', 4, true);


--
-- TOC entry 5332 (class 0 OID 0)
-- Dependencies: 256
-- Name: pdf_highlights_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pdf_highlights_id_seq', 1, false);


--
-- TOC entry 5333 (class 0 OID 0)
-- Dependencies: 230
-- Name: questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.questions_id_seq', 1225, true);


--
-- TOC entry 5334 (class 0 OID 0)
-- Dependencies: 234
-- Name: quiz_attempts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quiz_attempts_id_seq', 14, true);


--
-- TOC entry 5335 (class 0 OID 0)
-- Dependencies: 228
-- Name: quizzes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quizzes_id_seq', 37, true);


--
-- TOC entry 5336 (class 0 OID 0)
-- Dependencies: 244
-- Name: reported_questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reported_questions_id_seq', 2, true);


--
-- TOC entry 5337 (class 0 OID 0)
-- Dependencies: 266
-- Name: scheduled_notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.scheduled_notifications_id_seq', 1, false);


--
-- TOC entry 5338 (class 0 OID 0)
-- Dependencies: 246
-- Name: study_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.study_sessions_id_seq', 2, true);


--
-- TOC entry 5339 (class 0 OID 0)
-- Dependencies: 236
-- Name: user_notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_notes_id_seq', 135, true);


--
-- TOC entry 5340 (class 0 OID 0)
-- Dependencies: 226
-- Name: user_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_progress_id_seq', 151, true);


--
-- TOC entry 5341 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- TOC entry 4999 (class 2606 OID 24712)
-- Name: ai_cache ai_cache_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_cache
    ADD CONSTRAINT ai_cache_pkey PRIMARY KEY (id);


--
-- TOC entry 5001 (class 2606 OID 24714)
-- Name: ai_cache ai_cache_query_hash_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_cache
    ADD CONSTRAINT ai_cache_query_hash_key UNIQUE (query_hash);


--
-- TOC entry 5003 (class 2606 OID 24724)
-- Name: ai_usage ai_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_usage
    ADD CONSTRAINT ai_usage_pkey PRIMARY KEY (id);


--
-- TOC entry 5005 (class 2606 OID 24726)
-- Name: ai_usage ai_usage_user_id_usage_date_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_usage
    ADD CONSTRAINT ai_usage_user_id_usage_date_key UNIQUE (user_id, usage_date);


--
-- TOC entry 5025 (class 2606 OID 49295)
-- Name: certificates certificates_certificate_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_certificate_code_key UNIQUE (certificate_code);


--
-- TOC entry 5027 (class 2606 OID 49293)
-- Name: certificates certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_pkey PRIMARY KEY (id);


--
-- TOC entry 5029 (class 2606 OID 49297)
-- Name: certificates certificates_user_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_user_id_course_id_key UNIQUE (user_id, course_id);


--
-- TOC entry 4975 (class 2606 OID 16429)
-- Name: courses courses_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_code_key UNIQUE (code);


--
-- TOC entry 4977 (class 2606 OID 16427)
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- TOC entry 4997 (class 2606 OID 24687)
-- Name: exam_attempts exam_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_attempts
    ADD CONSTRAINT exam_attempts_pkey PRIMARY KEY (id);


--
-- TOC entry 5011 (class 2606 OID 49185)
-- Name: flashcard_decks flashcard_decks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flashcard_decks
    ADD CONSTRAINT flashcard_decks_pkey PRIMARY KEY (id);


--
-- TOC entry 5015 (class 2606 OID 49226)
-- Name: flashcard_reviews flashcard_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flashcard_reviews
    ADD CONSTRAINT flashcard_reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 5017 (class 2606 OID 49228)
-- Name: flashcard_reviews flashcard_reviews_user_id_card_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flashcard_reviews
    ADD CONSTRAINT flashcard_reviews_user_id_card_id_key UNIQUE (user_id, card_id);


--
-- TOC entry 5013 (class 2606 OID 49208)
-- Name: flashcards flashcards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flashcards
    ADD CONSTRAINT flashcards_pkey PRIMARY KEY (id);


--
-- TOC entry 5031 (class 2606 OID 49319)
-- Name: friendships friendships_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_pkey PRIMARY KEY (id);


--
-- TOC entry 5033 (class 2606 OID 49321)
-- Name: friendships friendships_user_id_friend_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_user_id_friend_id_key UNIQUE (user_id, friend_id);


--
-- TOC entry 5053 (class 2606 OID 57356)
-- Name: material_videos material_videos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_videos
    ADD CONSTRAINT material_videos_pkey PRIMARY KEY (id);


--
-- TOC entry 4979 (class 2606 OID 16443)
-- Name: materials materials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_pkey PRIMARY KEY (id);


--
-- TOC entry 5043 (class 2606 OID 49374)
-- Name: notification_preferences notification_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_pkey PRIMARY KEY (id);


--
-- TOC entry 5045 (class 2606 OID 49376)
-- Name: notification_preferences notification_preferences_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_user_id_key UNIQUE (user_id);


--
-- TOC entry 5041 (class 2606 OID 49349)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 4989 (class 2606 OID 24623)
-- Name: options options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.options
    ADD CONSTRAINT options_pkey PRIMARY KEY (id);


--
-- TOC entry 5019 (class 2606 OID 49248)
-- Name: pdf_bookmarks pdf_bookmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pdf_bookmarks
    ADD CONSTRAINT pdf_bookmarks_pkey PRIMARY KEY (id);


--
-- TOC entry 5021 (class 2606 OID 49250)
-- Name: pdf_bookmarks pdf_bookmarks_user_id_material_id_page_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pdf_bookmarks
    ADD CONSTRAINT pdf_bookmarks_user_id_material_id_page_number_key UNIQUE (user_id, material_id, page_number);


--
-- TOC entry 5023 (class 2606 OID 49274)
-- Name: pdf_highlights pdf_highlights_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pdf_highlights
    ADD CONSTRAINT pdf_highlights_pkey PRIMARY KEY (id);


--
-- TOC entry 4987 (class 2606 OID 24605)
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- TOC entry 4991 (class 2606 OID 24639)
-- Name: quiz_attempts quiz_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_pkey PRIMARY KEY (id);


--
-- TOC entry 4985 (class 2606 OID 24587)
-- Name: quizzes quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_pkey PRIMARY KEY (id);


--
-- TOC entry 5007 (class 2606 OID 32797)
-- Name: reported_questions reported_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reported_questions
    ADD CONSTRAINT reported_questions_pkey PRIMARY KEY (id);


--
-- TOC entry 5050 (class 2606 OID 49395)
-- Name: scheduled_notifications scheduled_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheduled_notifications
    ADD CONSTRAINT scheduled_notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 5009 (class 2606 OID 49164)
-- Name: study_sessions study_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.study_sessions
    ADD CONSTRAINT study_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 4973 (class 2606 OID 16414)
-- Name: system_settings system_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_pkey PRIMARY KEY (key);


--
-- TOC entry 4993 (class 2606 OID 24661)
-- Name: user_notes user_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notes
    ADD CONSTRAINT user_notes_pkey PRIMARY KEY (id);


--
-- TOC entry 4995 (class 2606 OID 24663)
-- Name: user_notes user_notes_user_id_material_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notes
    ADD CONSTRAINT user_notes_user_id_material_id_key UNIQUE (user_id, material_id);


--
-- TOC entry 4981 (class 2606 OID 16458)
-- Name: user_progress user_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_pkey PRIMARY KEY (id);


--
-- TOC entry 4983 (class 2606 OID 16460)
-- Name: user_progress user_progress_user_id_material_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_user_id_material_id_key UNIQUE (user_id, material_id);


--
-- TOC entry 4969 (class 2606 OID 16405)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4971 (class 2606 OID 16403)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5034 (class 1259 OID 49333)
-- Name: idx_friendships_friend; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_friendships_friend ON public.friendships USING btree (friend_id);


--
-- TOC entry 5035 (class 1259 OID 49334)
-- Name: idx_friendships_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_friendships_status ON public.friendships USING btree (status);


--
-- TOC entry 5036 (class 1259 OID 49332)
-- Name: idx_friendships_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_friendships_user ON public.friendships USING btree (user_id);


--
-- TOC entry 5051 (class 1259 OID 57367)
-- Name: idx_material_videos_material; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_material_videos_material ON public.material_videos USING btree (material_id);


--
-- TOC entry 5037 (class 1259 OID 49357)
-- Name: idx_notifications_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_created ON public.notifications USING btree (created_at DESC);


--
-- TOC entry 5038 (class 1259 OID 49356)
-- Name: idx_notifications_read; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_read ON public.notifications USING btree (is_read);


--
-- TOC entry 5039 (class 1259 OID 49355)
-- Name: idx_notifications_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user ON public.notifications USING btree (user_id);


--
-- TOC entry 5046 (class 1259 OID 49402)
-- Name: idx_scheduled_notifications_scheduled; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_scheduled_notifications_scheduled ON public.scheduled_notifications USING btree (scheduled_for);


--
-- TOC entry 5047 (class 1259 OID 49403)
-- Name: idx_scheduled_notifications_sent; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_scheduled_notifications_sent ON public.scheduled_notifications USING btree (sent);


--
-- TOC entry 5048 (class 1259 OID 49401)
-- Name: idx_scheduled_notifications_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_scheduled_notifications_user ON public.scheduled_notifications USING btree (user_id);


--
-- TOC entry 5066 (class 2606 OID 24727)
-- Name: ai_usage ai_usage_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_usage
    ADD CONSTRAINT ai_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5080 (class 2606 OID 49303)
-- Name: certificates certificates_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- TOC entry 5081 (class 2606 OID 49298)
-- Name: certificates certificates_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5065 (class 2606 OID 24688)
-- Name: exam_attempts exam_attempts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_attempts
    ADD CONSTRAINT exam_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5071 (class 2606 OID 49191)
-- Name: flashcard_decks flashcard_decks_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flashcard_decks
    ADD CONSTRAINT flashcard_decks_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE SET NULL;


--
-- TOC entry 5072 (class 2606 OID 49186)
-- Name: flashcard_decks flashcard_decks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flashcard_decks
    ADD CONSTRAINT flashcard_decks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5074 (class 2606 OID 49234)
-- Name: flashcard_reviews flashcard_reviews_card_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flashcard_reviews
    ADD CONSTRAINT flashcard_reviews_card_id_fkey FOREIGN KEY (card_id) REFERENCES public.flashcards(id) ON DELETE CASCADE;


--
-- TOC entry 5075 (class 2606 OID 49229)
-- Name: flashcard_reviews flashcard_reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flashcard_reviews
    ADD CONSTRAINT flashcard_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5073 (class 2606 OID 49209)
-- Name: flashcards flashcards_deck_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flashcards
    ADD CONSTRAINT flashcards_deck_id_fkey FOREIGN KEY (deck_id) REFERENCES public.flashcard_decks(id) ON DELETE CASCADE;


--
-- TOC entry 5082 (class 2606 OID 49327)
-- Name: friendships friendships_friend_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_friend_id_fkey FOREIGN KEY (friend_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5083 (class 2606 OID 49322)
-- Name: friendships friendships_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5087 (class 2606 OID 57362)
-- Name: material_videos material_videos_added_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_videos
    ADD CONSTRAINT material_videos_added_by_fkey FOREIGN KEY (added_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5088 (class 2606 OID 57357)
-- Name: material_videos material_videos_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_videos
    ADD CONSTRAINT material_videos_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id) ON DELETE CASCADE;


--
-- TOC entry 5054 (class 2606 OID 16444)
-- Name: materials materials_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- TOC entry 5085 (class 2606 OID 49377)
-- Name: notification_preferences notification_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5084 (class 2606 OID 49350)
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5060 (class 2606 OID 24624)
-- Name: options options_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.options
    ADD CONSTRAINT options_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;


--
-- TOC entry 5076 (class 2606 OID 49256)
-- Name: pdf_bookmarks pdf_bookmarks_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pdf_bookmarks
    ADD CONSTRAINT pdf_bookmarks_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id) ON DELETE CASCADE;


--
-- TOC entry 5077 (class 2606 OID 49251)
-- Name: pdf_bookmarks pdf_bookmarks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pdf_bookmarks
    ADD CONSTRAINT pdf_bookmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5078 (class 2606 OID 49280)
-- Name: pdf_highlights pdf_highlights_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pdf_highlights
    ADD CONSTRAINT pdf_highlights_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id) ON DELETE CASCADE;


--
-- TOC entry 5079 (class 2606 OID 49275)
-- Name: pdf_highlights pdf_highlights_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pdf_highlights
    ADD CONSTRAINT pdf_highlights_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5059 (class 2606 OID 24606)
-- Name: questions questions_quiz_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;


--
-- TOC entry 5061 (class 2606 OID 24645)
-- Name: quiz_attempts quiz_attempts_quiz_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;


--
-- TOC entry 5062 (class 2606 OID 24640)
-- Name: quiz_attempts quiz_attempts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5057 (class 2606 OID 24588)
-- Name: quizzes quizzes_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- TOC entry 5058 (class 2606 OID 24695)
-- Name: quizzes quizzes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5067 (class 2606 OID 32798)
-- Name: reported_questions reported_questions_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reported_questions
    ADD CONSTRAINT reported_questions_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;


--
-- TOC entry 5068 (class 2606 OID 32803)
-- Name: reported_questions reported_questions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reported_questions
    ADD CONSTRAINT reported_questions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5086 (class 2606 OID 49396)
-- Name: scheduled_notifications scheduled_notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheduled_notifications
    ADD CONSTRAINT scheduled_notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5069 (class 2606 OID 49170)
-- Name: study_sessions study_sessions_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.study_sessions
    ADD CONSTRAINT study_sessions_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id) ON DELETE SET NULL;


--
-- TOC entry 5070 (class 2606 OID 49165)
-- Name: study_sessions study_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.study_sessions
    ADD CONSTRAINT study_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5063 (class 2606 OID 24669)
-- Name: user_notes user_notes_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notes
    ADD CONSTRAINT user_notes_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id) ON DELETE CASCADE;


--
-- TOC entry 5064 (class 2606 OID 24664)
-- Name: user_notes user_notes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notes
    ADD CONSTRAINT user_notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5055 (class 2606 OID 16466)
-- Name: user_progress user_progress_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id) ON DELETE CASCADE;


--
-- TOC entry 5056 (class 2606 OID 16461)
-- Name: user_progress user_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-06-19 23:17:22

--
-- PostgreSQL database dump complete
--

\unrestrict abUxYNqbnZeMe3Zc9pGJG17Hmx3l2RhKYvyIAXQNjIXMBeM2uFKVaeSD3rBG590

