import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const A4_UK = {
  width: 794,
  height: 1123,
  margin: 40,
};

export async function generateCVPDF(filename: string = 'resume.pdf'): Promise<void> {
  const measureRef = document.querySelector('[aria-hidden="true"]');

  if (!measureRef) {
    throw new Error('CV content not found for PDF generation');
  }

  const sectionElements = Array.from(
    measureRef.querySelectorAll('[data-cv-section]')
  ) as HTMLElement[];

  if (sectionElements.length === 0) {
    throw new Error('No CV sections found for PDF generation');
  }

  const SECTION_MARGIN_BOTTOM = 32;
  const pageInnerHeight = A4_UK.height - 2 * A4_UK.margin;

  const sectionData = sectionElements.map((element) => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    const marginTop = parseFloat(style.marginTop || '0');
    const marginBottom = parseFloat(style.marginBottom || '0');
    const totalHeight = rect.height + marginTop + marginBottom + SECTION_MARGIN_BOTTOM;

    return {
      element: element.cloneNode(true) as HTMLElement,
      height: totalHeight,
      id: element.getAttribute('data-section-id') || '',
    };
  });

  interface PageContent {
    elements: HTMLElement[];
  }

  const pages: PageContent[] = [];
  let currentPageElements: HTMLElement[] = [];
  let currentPageHeight = 0;

  for (let i = 0; i < sectionData.length; i++) {
    const section = sectionData[i];
    const isLastSection = i === sectionData.length - 1;
    const sectionHeightToUse = isLastSection ? section.height - SECTION_MARGIN_BOTTOM : section.height;

    if (currentPageHeight + sectionHeightToUse <= pageInnerHeight) {
      currentPageElements.push(section.element);
      currentPageHeight += sectionHeightToUse;
    } else {
      if (currentPageElements.length > 0) {
        pages.push({ elements: [...currentPageElements] });
      }

      currentPageElements = [section.element];
      currentPageHeight = section.height;
    }
  }

  if (currentPageElements.length > 0) {
    pages.push({ elements: [...currentPageElements] });
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [A4_UK.width, A4_UK.height],
  });

  for (let i = 0; i < pages.length; i++) {
    const pageContainer = document.createElement('div');
    pageContainer.style.width = `${A4_UK.width}px`;
    pageContainer.style.height = `${A4_UK.height}px`;
    pageContainer.style.padding = `${A4_UK.margin}px`;
    pageContainer.style.boxSizing = 'border-box';
    pageContainer.style.backgroundColor = '#ffffff';
    pageContainer.style.position = 'absolute';
    pageContainer.style.left = '-10000px';
    pageContainer.style.top = '0';

    pages[i].elements.forEach((element, idx) => {
      const clonedElement = element.cloneNode(true) as HTMLElement;
      if (idx < pages[i].elements.length - 1) {
        clonedElement.style.marginBottom = '32px';
      }
      pageContainer.appendChild(clonedElement);
    });

    document.body.appendChild(pageContainer);

    const canvas = await html2canvas(pageContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: A4_UK.width,
      height: A4_UK.height,
    });

    document.body.removeChild(pageContainer);

    const imgData = canvas.toDataURL('image/png');

    if (i > 0) {
      pdf.addPage();
    }

    pdf.addImage(imgData, 'PNG', 0, 0, A4_UK.width, A4_UK.height);
  }

  pdf.save(filename);
}
