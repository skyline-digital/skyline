create type "public"."leadStatus" as enum ('new', 'open', 'in progress', 'closed', 'lost');

create type "public"."profileRole" as enum ('user', 'admin');

create table "public"."leads" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "name" text,
    "email" text,
    "source" text,
    "status" "leadStatus" not null default 'new'::"leadStatus",
    "message" text
);


alter table "public"."leads" enable row level security;

create table "public"."messages" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "sender_id" uuid,
    "reciever_id" uuid,
    "message" text
);


alter table "public"."messages" enable row level security;

create table "public"."profiles" (
    "id" uuid not null default gen_random_uuid(),
    "name" text,
    "avatar" text,
    "role" "profileRole" default 'user'::"profileRole"
);


alter table "public"."profiles" enable row level security;

CREATE UNIQUE INDEX leads_pkey ON public.leads USING btree (id);

CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

alter table "public"."leads" add constraint "leads_pkey" PRIMARY KEY using index "leads_pkey";

alter table "public"."messages" add constraint "messages_pkey" PRIMARY KEY using index "messages_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."messages" add constraint "messages_reciever_id_fkey" FOREIGN KEY (reciever_id) REFERENCES auth.users(id) not valid;

alter table "public"."messages" validate constraint "messages_reciever_id_fkey";

alter table "public"."messages" add constraint "messages_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES auth.users(id) not valid;

alter table "public"."messages" validate constraint "messages_sender_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$begin
  insert into public.profiles (id, role)
  values (new.id, 'user');
  return new;
end;$function$
;

grant delete on table "public"."leads" to "anon";

grant insert on table "public"."leads" to "anon";

grant references on table "public"."leads" to "anon";

grant select on table "public"."leads" to "anon";

grant trigger on table "public"."leads" to "anon";

grant truncate on table "public"."leads" to "anon";

grant update on table "public"."leads" to "anon";

grant delete on table "public"."leads" to "authenticated";

grant insert on table "public"."leads" to "authenticated";

grant references on table "public"."leads" to "authenticated";

grant select on table "public"."leads" to "authenticated";

grant trigger on table "public"."leads" to "authenticated";

grant truncate on table "public"."leads" to "authenticated";

grant update on table "public"."leads" to "authenticated";

grant delete on table "public"."leads" to "service_role";

grant insert on table "public"."leads" to "service_role";

grant references on table "public"."leads" to "service_role";

grant select on table "public"."leads" to "service_role";

grant trigger on table "public"."leads" to "service_role";

grant truncate on table "public"."leads" to "service_role";

grant update on table "public"."leads" to "service_role";

grant delete on table "public"."messages" to "anon";

grant insert on table "public"."messages" to "anon";

grant references on table "public"."messages" to "anon";

grant select on table "public"."messages" to "anon";

grant trigger on table "public"."messages" to "anon";

grant truncate on table "public"."messages" to "anon";

grant update on table "public"."messages" to "anon";

grant delete on table "public"."messages" to "authenticated";

grant insert on table "public"."messages" to "authenticated";

grant references on table "public"."messages" to "authenticated";

grant select on table "public"."messages" to "authenticated";

grant trigger on table "public"."messages" to "authenticated";

grant truncate on table "public"."messages" to "authenticated";

grant update on table "public"."messages" to "authenticated";

grant delete on table "public"."messages" to "service_role";

grant insert on table "public"."messages" to "service_role";

grant references on table "public"."messages" to "service_role";

grant select on table "public"."messages" to "service_role";

grant trigger on table "public"."messages" to "service_role";

grant truncate on table "public"."messages" to "service_role";

grant update on table "public"."messages" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

create policy "Allow operating on leads if admin"
on "public"."leads"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) IN ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.role = 'admin'::"profileRole"))));


create policy "Individuals can view their own profiles."
on "public"."profiles"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = id));



