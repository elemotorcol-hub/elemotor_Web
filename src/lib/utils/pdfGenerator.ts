import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExtendedQuoteData } from '@/types/dashboard';

export const downloadQuotePDF = (quote: ExtendedQuoteData) => {
    const doc = new jsPDF();
    
    doc.setFillColor(10, 17, 15);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    const country = process.env.NEXT_PUBLIC_SITE_COUNTRY ?? 'CO';
    const countryName = country === 'EC' ? 'ECUADOR' : 'COLOMBIA';
    doc.text(`ELEMOTOR ${countryName}`, 105, 20, { align: 'center' });
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('COTIZACIÓN OFICIAL', 105, 30, { align: 'center' });

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`ID Cotización: ${quote.id}`, 20, 60);
    doc.text(`Fecha Solicitud: ${quote.date}`, 20, 70);
    doc.text(`Válida hasta: ${quote.validUntil}`, 20, 80);
    
    autoTable(doc, {
        startY: 95,
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255] },
        head: [['Descripción', 'Detalle']],
        body: [
            ['Vehículo de Interés', `${quote.model} ${quote.trimName || ''}`],
            ['Presupuesto Estimado', quote.amount],
            ['Estado', quote.status],
            ['Ciudad', quote.city || 'No Registrada'],
            ['Canal Contacto', quote.preferredChannel || 'email']
        ],
        theme: 'grid'
    });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Esta es una estimación sujeta a aprobación de crédito y disponibilidad de inventario.', 105, 280, { align: 'center' });
    const siteUrl = country === 'EC' ? 'www.elemotor.com.ec' : 'www.elemotor.com.co';
    doc.text(siteUrl, 105, 285, { align: 'center' });

    doc.save(`Cotizacion-${quote.id}.pdf`);
};
