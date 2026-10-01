import { Router } from 'express';
import { checkBill, BillExtraction } from '../services/documents/billChecks';

const router = Router();

router.post('/analyze', (req, res) => {
  // We simulate the Gemini extraction for the demo gate.
  // In a real flow, the uploaded file goes to Gemini first, returning this JSON.
  
  const sampleBill: BillExtraction = {
    billNo: '83921',
    date: '2026-10-01',
    admissionDate: '2026-09-28',
    dischargeDate: '2026-09-30',
    tax: 2000,
    total: 42000,
    lines: [
      { id: 'ROOM_RENT', name: 'ROOM RENT', qty: 3, rate: 3200, amount: 9600, date: '2026-09-28' }, // 3 days instead of 2 -> 3200
      { id: 'PATHOLOGY', name: 'CBC TEST', qty: 1, rate: 3200, amount: 3200, date: '2026-09-29' },
      { id: 'PATHOLOGY', name: 'CBC TEST', qty: 1, rate: 3200, amount: 3200, date: '2026-09-29' }, // Duplicate -> 3200
      { id: 'ADMISSION_KIT', name: 'ADMISSION KIT', qty: 1, rate: 250, amount: 250, date: '2026-09-28' }, // Non-payable -> 250
      { id: 'DOCTOR_FEES', name: 'DOCTOR_FEES', qty: 1, rate: 3000, amount: 3000, date: '2026-09-29' }, // Tax applied -> 150
      { id: 'OTHER', name: 'SURGERY', qty: 1, rate: 22750, amount: 22750, date: '2026-09-29' }
    ]
  };

  const findings = checkBill(sampleBill);
  const totalDiscrepancy = findings.reduce((sum, f) => sum + f.amount, 0);

  res.json({
    billDetails: sampleBill,
    findings,
    totalDiscrepancy,
    explanation: {
      en: 'We reviewed your bill and found 4 potential discrepancies totalling ₹6,800. These include a possible duplicate charge, a room charge mismatch, and policy differences.',
      hi: '[AI-translated] हमने आपके बिल की समीक्षा की है और ₹6,800 की 4 संभावित विसंगतियां पाई हैं...',
      mr: '[AI-translated] आम्ही तुमच्या बिलाचे पुनरावलोकन केले आहे आणि ₹6,800 च्या 4 संभाव्य विसंगती आढळल्या आहेत...'
    }
  });
});

export default router;
