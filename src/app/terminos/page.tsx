import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
    title: 'Términos y Condiciones',
    description: 'Términos y Condiciones de uso del sitio web de ELEMOTOR.',
    path: '/terminos',
});

export default function TerminosPage() {
    return (
        <main className="min-h-screen bg-[#050B09] flex flex-col pt-[72px]">
            <Navbar />

            <div className="flex-grow container mx-auto px-6 py-20 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-12">
                    Términos y Condiciones de Uso
                </h1>

                <div className="prose prose-invert prose-green max-w-none text-gray-400 space-y-10">

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Identificación del Responsable</h2>
                        <p>El presente sitio web es operado por <strong className="text-white">ELEMOTOR</strong>, empresa dedicada a la importación, comercialización y gestión de vehículos eléctricos en Colombia, en adelante &quot;LA EMPRESA&quot;.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. Aceptación de los Términos</h2>
                        <p>Al acceder, navegar o utilizar este sitio web, el usuario acepta haber leído, entendido y aceptado estos Términos y Condiciones. Si no está de acuerdo, debe abstenerse de usar la plataforma.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Objeto del Sitio Web</h2>
                        <p>El sitio web tiene como finalidad:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>Informar sobre vehículos disponibles y soluciones de movilidad eléctrica</li>
                            <li>Permitir la solicitud de cotizaciones</li>
                            <li>Facilitar procesos de importación bajo pedido</li>
                            <li>Brindar asesoría comercial y técnica</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Naturaleza del Servicio</h2>
                        <p>ELEMOTOR actúa como:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>Importador directo de vehículos</li>
                            <li>Intermediario entre fabricantes internacionales y clientes</li>
                            <li>Gestor logístico, documental y comercial</li>
                        </ul>
                        <p className="mt-4">El usuario entiende que:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>Los vehículos pueden ser importados bajo pedido</li>
                            <li>Los tiempos de entrega dependen de procesos logísticos y aduaneros externos</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Proceso de Compra e Importación</h2>
                        <p>El proceso incluye:</p>
                        <ol className="list-decimal list-inside space-y-1 mt-2">
                            <li>Selección del vehículo</li>
                            <li>Cotización personalizada</li>
                            <li>Aprobación del cliente</li>
                            <li>Pago inicial o total</li>
                            <li>Importación y nacionalización</li>
                            <li>Entrega del vehículo</li>
                        </ol>
                        <p className="mt-4"><strong className="text-white">Parágrafo:</strong> Los tiempos pueden variar por aduanas, transporte internacional o regulaciones del país.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">6. Precios y Pagos</h2>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>Los precios están expresados en pesos colombianos (COP) o dólares (USD)</li>
                            <li>Pueden variar sin previo aviso por tasa de cambio o costos logísticos</li>
                            <li>El cliente acepta los valores al momento de confirmar la compra</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">7. Responsabilidad del Usuario</h2>
                        <p>El usuario se compromete a:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>Proporcionar información veraz</li>
                            <li>No usar el sitio para fines ilícitos</li>
                            <li>No interferir con la seguridad del sistema</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">8. Garantías y Postventa</h2>
                        <p>ELEMOTOR ofrece:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>Garantías según fabricante</li>
                            <li>Servicios de postventa</li>
                            <li>Asesoría técnica</li>
                        </ul>
                        <p className="mt-4">No obstante, la garantía puede variar según marca y origen del vehículo. Algunos servicios dependen de terceros.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">9. Limitación de Responsabilidad</h2>
                        <p>ELEMOTOR no será responsable por:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>Retrasos en importación por causas externas</li>
                            <li>Cambios regulatorios</li>
                            <li>Fuerza mayor (pandemias, bloqueos, etc.)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">10. Propiedad Intelectual</h2>
                        <p>Todo el contenido del sitio (textos, imágenes, marca, diseño) es propiedad de ELEMOTOR y está protegido por la ley.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">11. Modificaciones</h2>
                        <p>ELEMOTOR podrá modificar estos términos en cualquier momento. Los cambios entrarán en vigencia al ser publicados.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">12. Legislación Aplicable</h2>
                        <p>Estos términos se rigen por las leyes de la República de Colombia.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">13. Contacto</h2>
                        <p>Correo: <a href="mailto:info@elemotor.com.co" className="text-[#00D4AA] hover:underline">info@elemotor.com.co</a></p>
                        <p>Teléfono: +57 XXX XXX XXXX</p>
                    </section>

                </div>
            </div>

            <Footer />
        </main>
    );
}
