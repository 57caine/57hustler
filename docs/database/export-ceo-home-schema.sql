-- CEO HOME: read-only catalog snapshot. Does not read personal table rows.
-- Captures actual definitions; this is NOT a migration to apply.
BEGIN TRANSACTION READ ONLY;

WITH expected(name) AS (
  VALUES ('net_worth_items'), ('real_estate_properties'), ('family_members'),
         ('education_costs'), ('future_expenses'), ('income_streams'), ('owner_settings')
), targets AS (
  SELECT c.oid, c.relname, c.relrowsecurity, c.relforcerowsecurity,
         pg_catalog.pg_get_userbyid(c.relowner) AS owner_role
  FROM pg_catalog.pg_class c
  JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
  JOIN expected e ON e.name = c.relname
  WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p')
), table_definitions AS (
  SELECT t.relname,
    jsonb_build_object(
      'schema', 'public', 'table', t.relname, 'owner_role', t.owner_role,
      'rls_enabled', t.relrowsecurity, 'rls_forced', t.relforcerowsecurity,
      'columns', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
          'position', a.attnum, 'name', a.attname,
          'type', pg_catalog.format_type(a.atttypid, a.atttypmod),
          'not_null', a.attnotnull, 'identity', a.attidentity,
          'generated', a.attgenerated,
          'default_expression', pg_catalog.pg_get_expr(d.adbin, d.adrelid)
        ) ORDER BY a.attnum)
        FROM pg_catalog.pg_attribute a
        LEFT JOIN pg_catalog.pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
        WHERE a.attrelid = t.oid AND a.attnum > 0 AND NOT a.attisdropped
      ), '[]'::jsonb),
      'constraints', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
          'name', con.conname, 'kind', con.contype,
          'definition', pg_catalog.pg_get_constraintdef(con.oid, true),
          'deferrable', con.condeferrable, 'initially_deferred', con.condeferred,
          'validated', con.convalidated
        ) ORDER BY con.conname)
        FROM pg_catalog.pg_constraint con WHERE con.conrelid = t.oid
      ), '[]'::jsonb),
      'indexes', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
          'name', i.relname, 'definition', pg_catalog.pg_get_indexdef(ix.indexrelid),
          'primary', ix.indisprimary, 'unique', ix.indisunique, 'valid', ix.indisvalid
        ) ORDER BY i.relname)
        FROM pg_catalog.pg_index ix
        JOIN pg_catalog.pg_class i ON i.oid = ix.indexrelid WHERE ix.indrelid = t.oid
      ), '[]'::jsonb),
      'policies', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
          'name', p.policyname, 'permissive', p.permissive, 'roles', p.roles,
          'command', p.cmd, 'using', p.qual, 'with_check', p.with_check
        ) ORDER BY p.policyname)
        FROM pg_catalog.pg_policies p WHERE p.schemaname = 'public' AND p.tablename = t.relname
      ), '[]'::jsonb),
      'table_grants', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
          'grantor', g.grantor, 'grantee', g.grantee,
          'privilege', g.privilege_type, 'grantable', g.is_grantable
        ) ORDER BY g.grantee, g.privilege_type)
        FROM information_schema.table_privileges g
        WHERE g.table_schema = 'public' AND g.table_name = t.relname
      ), '[]'::jsonb),
      'triggers', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
          'name', tr.tgname, 'enabled', tr.tgenabled,
          'definition', pg_catalog.pg_get_triggerdef(tr.oid, true)
        ) ORDER BY tr.tgname)
        FROM pg_catalog.pg_trigger tr WHERE tr.tgrelid = t.oid AND NOT tr.tgisinternal
      ), '[]'::jsonb)
    ) AS definition
  FROM targets t
), enum_definitions AS (
  SELECT typ.oid, ns.nspname, typ.typname
  FROM pg_catalog.pg_type typ
  JOIN pg_catalog.pg_namespace ns ON ns.oid = typ.typnamespace
  WHERE typ.typtype = 'e' AND EXISTS (
    SELECT 1 FROM pg_catalog.pg_attribute a JOIN targets t ON t.oid = a.attrelid
    WHERE a.atttypid = typ.oid AND a.attnum > 0 AND NOT a.attisdropped
  )
)
SELECT jsonb_pretty(jsonb_build_object(
  'captured_at', current_timestamp,
  'postgres_version', current_setting('server_version'),
  'scope', 'CEO HOME public table definitions only; no personal records',
  'missing_tables', COALESCE((SELECT jsonb_agg(e.name ORDER BY e.name)
    FROM expected e WHERE NOT EXISTS (SELECT 1 FROM targets t WHERE t.relname = e.name)), '[]'::jsonb),
  'tables', COALESCE((SELECT jsonb_agg(d.definition ORDER BY d.relname) FROM table_definitions d), '[]'::jsonb),
  'enum_types', COALESCE((SELECT jsonb_agg(jsonb_build_object(
    'schema', e.nspname, 'name', e.typname, 'values', (
      SELECT jsonb_agg(v.enumlabel ORDER BY v.enumsortorder) FROM pg_catalog.pg_enum v WHERE v.enumtypid = e.oid
    )) ORDER BY e.nspname, e.typname) FROM enum_definitions e), '[]'::jsonb)
)) AS ceo_home_schema;

ROLLBACK;
