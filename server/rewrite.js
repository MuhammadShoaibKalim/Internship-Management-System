const fs = require('fs');

const FILE_PATH = 'client/src/pages/student/InternshipResult.jsx';
let content = fs.readFileSync(FILE_PATH, 'utf-8');

// 1. Add imports
content = content.replace(
    "import SectionHeader from '../../components/common/SectionHeader';",
    "import SectionHeader from '../../components/common/SectionHeader';\nimport html2canvas from 'html2canvas';\nimport { jsPDF } from 'jspdf';"
);
content = content.replace(
    "import React, { useState, useEffect } from 'react';",
    "import React, { useState, useEffect, useRef } from 'react';"
);

// 2. Add PDF Download handler logic
const pdfLogic = `
    const [downloadingPdf, setDownloadingPdf] = useState(false);
    const certificateRef = useRef(null);

    const handleDownloadPDF = async () => {
        if (!certificateRef.current) return;
        try {
            setDownloadingPdf(true);
            toast.loading("Generating High-Quality PDF...", { id: "pdfToast" });
            const canvas = await html2canvas(certificateRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width / 2, canvas.height / 2]
            });
            
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
            pdf.save(\`\${results?.industryEvaluation?.student?.name || 'Intern'}_Certificate.pdf\`);
            
            toast.success("Certificate Downloaded Successfully!", { id: "pdfToast" });
        } catch (err) {
            console.error("PDF Export Error", err);
            toast.error("Failed to generate PDF.", { id: "pdfToast" });
        } finally {
            setDownloadingPdf(false);
        }
    };
`;
content = content.replace(
    "    const industryScore = industryEvaluation?.overallScore || 0;",
    "    const industryScore = industryEvaluation?.overallScore || 0;\n" + pdfLogic
);

// 3. Update the button
content = content.replace(
    `<button onClick={() => window.print()} className="flex-1 md:flex-none py-4 px-6 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-95">`,
    `<button onClick={handleDownloadPDF} disabled={downloadingPdf} className="flex-1 md:flex-none py-4 px-6 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                                {downloadingPdf ? <Loader2 size={16} className="text-slate-400 animate-spin" /> : <Printer size={16} className="text-slate-400" />} Download PDF`
);
// Remove the existing inner text
content = content.replace("                                <Printer size={16} className=\"text-slate-400\" /> Download PDF\n                            </button>", "                            </button>");

// 4. Update the Grid layout
// Move Academic and Industry Performance sections into the left column
// Extract Academic Performance
const academicRegex = /\{\/\* Academic Performance \*\/\}.*?\{\/\* Industry Performance \*\/\}/s;
const academicMatch = content.match(academicRegex);
// Extract Industry Performance
const industryRegex = /\{\/\* Industry Performance \*\/\}.*?\{\/\* Coursera Style Certificate \*\/\}/s;
const industryMatch = content.match(industryRegex);

if (academicMatch && industryMatch) {
    let academicCode = academicMatch[0].replace('    {/* Industry Performance */}', '');
    let industryCode = industryMatch[0].replace('    {/* Coursera Style Certificate */}', '');

    // Now remove them from their current location
    content = content.replace(academicMatch[0], '{/* Industry Performance */}');
    content = content.replace(industryMatch[0], '{/* Coursera Style Certificate */}');

    // Replace the end of left column to insert them
    // The left column ends right before {/* Right Column: Performance Data */}
    content = content.replace(
        '                    {/* Right Column: Performance Data */}',
        academicCode + '\n' + industryCode + '\n                    {/* Right Column: Performance Data */}'
    );

    // Also, change grids to xl instead of lg
    content = content.replace('lg:grid-cols-12', 'xl:grid-cols-12');
    content = content.replace('lg:col-span-4', 'xl:col-span-4');
    content = content.replace('lg:col-span-8', 'xl:col-span-8');

    // Make traits grid 1 col instead of 3 in the smaller sidebar
    content = content.replace('grid-cols-1 md:grid-cols-3 gap-6', 'grid-cols-1 gap-4');
}

// 5. Add ref to certificate
content = content.replace(
    '<div className="relative border border-slate-300 p-8 md:p-16 print:p-12',
    '<div ref={certificateRef} className="relative border border-slate-300 p-8 md:p-16 print:p-12'
);

// Final: also fix the bottom print button to be download pdf
content = content.replace(
    `<button\n                                                onClick={() => window.print()}\n                                                className="flex-1 btn-premium from-indigo-600 to-indigo-900 py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-4 transition-all duration-500 active:scale-95"\n                                            >\n                                                <Download size={20} className="text-indigo-200" />\n                                                Print/Save Digital Certificate\n                                            </button>`,
    `<button\n                                                onClick={handleDownloadPDF}\n                                                disabled={downloadingPdf}\n                                                className="flex-1 btn-premium from-indigo-600 to-indigo-900 py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-4 transition-all duration-500 active:scale-95 disabled:opacity-50"\n                                            >\n                                                {downloadingPdf ? <Loader2 size={20} className="text-indigo-200 animate-spin" /> : <Download size={20} className="text-indigo-200" />}\n                                                Print/Save Digital Certificate\n                                            </button>`
);

fs.writeFileSync(FILE_PATH, content);
console.log('Done refactoring');
