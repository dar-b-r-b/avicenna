CREATE TABLE public."user"
(
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
	last_name varchar NULL,
	"name" varchar NOT NULL,
	middle_name varchar NULL,
	login varchar NOT NULL,
	"password" varchar NOT NULL,
	"position" varchar NULL,
	CONSTRAINT user_pk PRIMARY KEY
	(id)
);
COMMENT ON COLUMN public."User"."position" IS 'Должность';


CREATE TABLE public.drug
(
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
	trade_name varchar NOT NULL,
	id_pharmacological_group integer NOT NULL,
	id_dosage_form integer NOT NULL,
	is_recipe boolean NOT NULL,
	CONSTRAINT drug_pk PRIMARY KEY(id)
);
COMMENT ON COLUMN public.drug.is_recipe IS 'По рецепту';

CREATE TABLE public.pharmacological_group
(
	id integer NOT NULL
	GENERATED ALWAYS AS IDENTITY,
	"name" varchar NOT NULL,
	CONSTRAINT pharmacological_group_pk PRIMARY KEY
	(id)
);


CREATE TABLE public.dosage_form (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
	"name" varchar NOT NULL,
	CONSTRAINT dosage_form_pk PRIMARY KEY (id)
);

CREATE TABLE public.composition (
	id_drug integer NOT NULL,
	id_component integer NOT NULL,
	dosage float8 NOT NULL,
	is_active boolean NOT NULL,
	CONSTRAINT composition_pk PRIMARY KEY (id_drug,id_component)
);


CREATE TABLE public.component (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
	"name" varchar NOT NULL,
	CONSTRAINT component_pk PRIMARY KEY (id)
);


CREATE TABLE public.allergy (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
	"name" varchar NOT NULL,
	CONSTRAINT allergy_pk PRIMARY KEY (id)
);

CREATE TABLE public.special_instructions (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
	"name" varchar NOT NULL,
	CONSTRAINT special_instructions_pk PRIMARY KEY (id)
);

CREATE TABLE public.disease (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
	"name" varchar NOT NULL,
	date_of_diagnosis date NOT NULL,
	is_chronic boolean NOT NULL,
	is_closed boolean NOT NULL,
	CONSTRAINT disease_pk PRIMARY KEY (id)
);

CREATE TABLE public.contraindications (
	id_component integer NOT NULL,
	id_contraindications integer NOT NULL,
	type_of_contraindications integer NOT NULL,
	CONSTRAINT contraindications_pk PRIMARY KEY (id_component,id_contraindications,type_of_contraindications)
);


CREATE TABLE public.contraindications_patient (
	id_contraindications integer NOT NULL GENERATED ALWAYS AS IDENTITY,
	id_patient integer NOT NULL,
	type_of_contraindication integer NOT NULL,
	CONSTRAINT contraindications_patient_pk PRIMARY KEY (id_contraindications,id_patient,type_of_contraindication)
);


CREATE TABLE public.patient (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
	last_name varchar NULL,
	"name" varchar NOT NULL,
	middle_name varchar NULL,
	date_of_birth date NOT NULL,
	sex varchar NOT NULL,
	CONSTRAINT patient_pk PRIMARY KEY (id)
);



-- Связи
ALTER TABLE public.drug ADD CONSTRAINT drug_fk FOREIGN KEY (id_pharmacological_group) REFERENCES public.pharmacological_group(id);
ALTER TABLE public.drug ADD CONSTRAINT drug_fk_1 FOREIGN KEY (id_dosage_form) REFERENCES public.dosage_form(id);

ALTER TABLE public.composition ADD CONSTRAINT composition_fk FOREIGN KEY (id_drug) REFERENCES public.drug(id);
ALTER TABLE public.composition ADD CONSTRAINT composition_fk_1 FOREIGN KEY (id_component) REFERENCES public.component(id);

ALTER TABLE public.contraindications ADD CONSTRAINT contraindications_fk FOREIGN KEY (id_contraindications) REFERENCES public.allergy(id);
ALTER TABLE public.contraindications ADD CONSTRAINT contraindications_fk_1 FOREIGN KEY (id_contraindications) REFERENCES public.disease(id);
ALTER TABLE public.contraindications ADD CONSTRAINT contraindications_fk_2 FOREIGN KEY (id_contraindications) REFERENCES public.special_instructions(id);
ALTER TABLE public.contraindications ADD CONSTRAINT contraindications_fk_3 FOREIGN KEY (id_component) REFERENCES public.component(id);

ALTER TABLE public.contraindications_patient ADD CONSTRAINT contraindications_patient_fk FOREIGN KEY (id_contraindications) REFERENCES public.allergy(id);
ALTER TABLE public.contraindications_patient ADD CONSTRAINT contraindications_patient_fk_1 FOREIGN KEY (id_contraindications) REFERENCES public.disease(id);
ALTER TABLE public.contraindications_patient ADD CONSTRAINT contraindications_patient_fk_2 FOREIGN KEY (id_contraindications) REFERENCES public.special_instructions(id);
ALTER TABLE public.contraindications_patient ADD CONSTRAINT contraindications_patient_fk_3 FOREIGN KEY (id_patient) REFERENCES public.patient(id);


ALTER TABLE public."user" ADD role_id integer;
COMMENT ON COLUMN public."user".role_id IS 'Роль';
ALTER TABLE public."user" DROP COLUMN "position";

CREATE TABLE public.user_role (
	id integer NOT NULL,
	"role" varchar NOT NULL
);

ALTER TABLE public.user_role ADD CONSTRAINT user_role_pk PRIMARY KEY (id);

ALTER TABLE public."user" ADD CONSTRAINT user_fk FOREIGN KEY (role_id) REFERENCES public.user_role(id);

ALTER TABLE public.patient ADD created_by int4 NULL;

ALTER TABLE public.patient ADD CONSTRAINT patient_fk FOREIGN KEY (created_by) REFERENCES public."user"(id);


INSERT INTO user_role
(id, "role")
VALUES(1, 'Admin');

INSERT INTO user_role
(id, "role")
VALUES(2, 'Doctor');

INSERT INTO user_role
(id, "role")
VALUES(3, 'Pharmacist');


ALTER TABLE public.composition DROP CONSTRAINT composition_fk;
ALTER TABLE public.composition ADD CONSTRAINT composition_fk FOREIGN KEY (id_drug) REFERENCES public.drug(id) ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE public.composition DROP CONSTRAINT composition_fk_1;
ALTER TABLE public.composition ADD CONSTRAINT composition_fk_1 FOREIGN KEY (id_component) REFERENCES public.component(id) ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE public.disease DROP COLUMN date_of_diagnosis;
ALTER TABLE public.disease DROP COLUMN is_chronic;
ALTER TABLE public.disease DROP COLUMN is_closed;


ALTER TABLE public.contraindications_patient ADD date_of_diagnosis date NULL;
ALTER TABLE public.contraindications_patient ADD is_chronic bool NULL;
ALTER TABLE public.contraindications_patient ADD is_closed bool NULL;

ALTER TABLE public.contraindications DROP CONSTRAINT contraindications_fk_3;
ALTER TABLE public.contraindications ADD CONSTRAINT contraindications_fk_3 FOREIGN KEY (id_component) REFERENCES public.component(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE public.contraindications DROP CONSTRAINT contraindications_fk_2;
ALTER TABLE public.contraindications ADD CONSTRAINT contraindications_fk_2 FOREIGN KEY (id_contraindications) REFERENCES public.special_instructions(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE public.contraindications DROP CONSTRAINT contraindications_fk_1;
ALTER TABLE public.contraindications ADD CONSTRAINT contraindications_fk_1 FOREIGN KEY (id_contraindications) REFERENCES public.disease(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE public.contraindications DROP CONSTRAINT contraindications_fk;
ALTER TABLE public.contraindications ADD CONSTRAINT contraindications_fk FOREIGN KEY (id_contraindications) REFERENCES public.allergy(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE public.contraindications_patient DROP CONSTRAINT contraindications_patient_fk;
ALTER TABLE public.contraindications_patient ADD CONSTRAINT contraindications_patient_fk FOREIGN KEY (id_contraindications) REFERENCES public.allergy(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE public.contraindications_patient DROP CONSTRAINT contraindications_patient_fk_1;
ALTER TABLE public.contraindications_patient ADD CONSTRAINT contraindications_patient_fk_1 FOREIGN KEY (id_contraindications) REFERENCES public.disease(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE public.contraindications_patient DROP CONSTRAINT contraindications_patient_fk_2;
ALTER TABLE public.contraindications_patient ADD CONSTRAINT contraindications_patient_fk_2 FOREIGN KEY (id_contraindications) REFERENCES public.special_instructions(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE public.contraindications_patient DROP CONSTRAINT contraindications_patient_fk_3;
ALTER TABLE public.contraindications_patient ADD CONSTRAINT contraindications_patient_fk_3 FOREIGN KEY (id_patient) REFERENCES public.patient(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE public.contraindications DROP CONSTRAINT contraindications_fk;
ALTER TABLE public.contraindications DROP CONSTRAINT contraindications_fk_1;
ALTER TABLE public.contraindications DROP CONSTRAINT contraindications_fk_2;

ALTER TABLE public.contraindications_patient DROP CONSTRAINT contraindications_patient_fk;
ALTER TABLE public.contraindications_patient DROP CONSTRAINT contraindications_patient_fk_1;
ALTER TABLE public.contraindications_patient DROP CONSTRAINT contraindications_patient_fk_2;


ALTER TABLE public.contraindications_patient DROP CONSTRAINT contraindications_patient_pk;
ALTER TABLE public.contraindications_patient DROP COLUMN id_contraindications;
ALTER TABLE public.contraindications_patient ADD id_contraindications int4 NOT NULL;
ALTER TABLE public.contraindications_patient ADD CONSTRAINT contraindications_patient_pk PRIMARY KEY (id_contraindications,id_patient,type_of_contraindication);


ALTER TABLE public.patient ADD snils varchar NULL;
ALTER TABLE public.drug ADD mnn varchar NULL;

ALTER TABLE public.composition ALTER COLUMN is_active DROP NOT NULL;

ALTER TABLE public.contraindications_patient DROP COLUMN is_closed;
ALTER TABLE public.contraindications_patient ADD close_date date NULL;
