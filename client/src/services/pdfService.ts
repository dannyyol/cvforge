import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { A4_DIMENSIONS, performPagination } from '../utils/paginationUtils';

export async function generateCVPDF(filename: string = 'resume.pdf'): Promise<void> {
  const measureRef = document.querySelector('[aria-hidden="true"]') as HTMLElement | null;

  if (!measureRef) {
    throw new Error('CV content not found for PDF generation');
  }

  // Use the shared pagination logic
  const { pages } = performPagination(measureRef);

  if (pages.length === 0) {
    throw new Error('No CV content blocks found for PDF generation');
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [A4_DIMENSIONS.width, A4_DIMENSIONS.height],
  });

  for (let i = 0; i < pages.length; i++) {
    const pageContainer = document.createElement('div');
    pageContainer.style.width = `${A4_DIMENSIONS.width}px`;
    pageContainer.style.height = `${A4_DIMENSIONS.height}px`;
    pageContainer.style.backgroundColor = '#ffffff';
    pageContainer.style.position = 'absolute';
    pageContainer.style.left = '-10000px';
    pageContainer.style.top = '0';
    pageContainer.style.overflow = 'hidden';

    const pageInner = document.createElement('div');
    pageInner.className = 'page-inner cv-preview-container';
    pageInner.style.boxSizing = 'border-box';
    pageInner.style.width = `${A4_DIMENSIONS.width}px`;
    pageInner.style.height = `${A4_DIMENSIONS.height}px`;
    pageInner.style.paddingTop = `${A4_DIMENSIONS.margin}px`;
    pageInner.style.paddingBottom = `${A4_DIMENSIONS.margin}px`;
    pageInner.style.paddingLeft = `${A4_DIMENSIONS.margin}px`;
    pageInner.style.paddingRight = `${A4_DIMENSIONS.margin}px`;
    pageInner.style.overflow = 'hidden';
    pageInner.style.display = 'flex';
    pageInner.style.flexDirection = 'column';

    // Append paginated elements with their marginTop
    for (const el of pages[i].elements) {
      const wrapper = document.createElement('div');
      wrapper.style.marginTop = `${el.marginTop}px`;
      wrapper.innerHTML = el.html;
      pageInner.appendChild(wrapper);
    }

    pageContainer.appendChild(pageInner);
    document.body.appendChild(pageContainer);

    const canvas = await html2canvas(pageContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: A4_DIMENSIONS.width,
      height: A4_DIMENSIONS.height,
    });

    document.body.removeChild(pageContainer);

    const imgData = canvas.toDataURL('image/png');

    if (i > 0) {
      pdf.addPage([A4_DIMENSIONS.width, A4_DIMENSIONS.height], 'portrait');
    }

    pdf.addImage(imgData, 'PNG', 0, 0, A4_DIMENSIONS.width, A4_DIMENSIONS.height);
  }

  pdf.save(filename);
}
