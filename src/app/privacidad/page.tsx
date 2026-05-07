import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
    title: 'Política de Privacidad',
    description: 'Política de Tratamiento de Datos Personales de ELEMOTOR.',
    path: '/privacidad',
});

export default function PrivacidadPage() {
    return (
        <main className="min-h-screen bg-[#050B09] flex flex-col pt-[72px]">
            <Navbar />

            <div className="flex-grow container mx-auto px-6 py-20 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-12">
                    Política de Tratamiento de Datos Personales
                </h1>

                <div className="prose prose-invert prose-green max-w-none text-gray-400 space-y-10">

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Responsable del Tratamiento</h2>
                        <p><strong className="text-white">ELEMOTOR</strong> es responsable del tratamiento de datos personales recolectados a través de su sitio web.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. Marco Legal</h2>
                        <p>Esta política se rige por:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>Ley 1581 de 2012 (Protección de Datos en Colombia)</li>
                            <li>Decreto 1377 de 2013</li>
                            <li>Normas complementarias de Habeas Data</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Datos que Recolectamos</h2>
                        <p>Podemos recolectar:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>Nombre completo</li>
                            <li>Número de identificación</li>
                            <li>Teléfono</li>
                            <li>Correo electrónico</li>
                            <li>Información de interés comercial</li>
                            <li>Datos de navegación (cookies)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Finalidad del Tratamiento</h2>
                        <p>Los datos serán utilizados para:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>Contactar clientes potenciales</li>
                            <li>Enviar cotizaciones</li>
                            <li>Gestionar procesos de importación</li>
                            <li>Brindar soporte y postventa</li>
                            <li>Enviar información comercial y promocional</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Autorización</h2>
                        <p>El usuario autoriza el tratamiento de sus datos al:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>Completar formularios</li>
                            <li>Solicitar información</li>
                            <li>Aceptar cookies</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">6. Derechos del Titular</h2>
                        <p>El usuario tiene derecho a:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>Conocer, actualizar y rectificar sus datos</li>
                            <li>Solicitar prueba de autorización</li>
                            <li>Revocar autorización</li>
                            <li>Solicitar eliminación de datos</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">7. Seguridad de la Información</h2>
                        <p>ELEMOTOR implementa medidas técnicas, humanas y administrativas para proteger los datos personales.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">8. Uso de Cookies</h2>
                        <p>El sitio utiliza cookies para:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>Mejorar la experiencia del usuario</li>
                            <li>Analizar comportamiento de navegación</li>
                            <li>Optimizar campañas comerciales</li>
                        </ul>
                        <p className="mt-4">El usuario puede desactivarlas desde su navegador.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">9. Transferencia de Datos</h2>
                        <p>Los datos podrán ser compartidos con:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>Aliados comerciales</li>
                            <li>Proveedores logísticos</li>
                            <li>Fabricantes internacionales</li>
                        </ul>
                        <p className="mt-4">Siempre bajo acuerdos de confidencialidad.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">10. Vigencia de los Datos</h2>
                        <p>Los datos se conservarán mientras exista relación comercial o legal.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">11. Modificaciones</h2>
                        <p>Esta política puede ser actualizada en cualquier momento.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">12. Contacto para Datos Personales</h2>
                        <p>Correo: <a href="mailto:info@elemotor.com.co" className="text-[#00D4AA] hover:underline">info@elemotor.com.co</a></p>
                        <p>Asunto: Protección de datos personales</p>
                    </section>

                </div>
            </div>

            <Footer />
        </main>
    );
}
