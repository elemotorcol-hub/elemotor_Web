/**
 * @file SchemaScript.tsx
 * @description Server Component que inyecta datos estructurados JSON-LD en el <head>.
 * Úsalo en layout.tsx (schemas globales) o en páginas individuales (schemas específicos).
 *
 * @example
 * // En layout.tsx (global)
 * <SchemaScript schema={getOrganizationSchema()} id="schema-organization" />
 *
 * @example
 * // En una página de detalle de vehículo
 * <SchemaScript schema={getVehicleSchema(vehicle)} id={`schema-vehicle-${vehicle.id}`} />
 */

interface SchemaScriptProps {
  /** Objeto de schema.org serializable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: Record<string, any>;
  /** ID único para el elemento script (evita duplicados en hydration) */
  id: string;
}

export function SchemaScript({ schema, id }: SchemaScriptProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      // dangerouslySetInnerHTML es la forma correcta y segura de inyectar
      // JSON-LD en Next.js. El contenido proviene de nuestras funciones
      // internas y nunca de entrada del usuario, por lo que no hay riesgo XSS.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
