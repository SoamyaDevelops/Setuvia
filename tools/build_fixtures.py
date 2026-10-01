import json, os
F = os.path.join(os.path.dirname(__file__), "..", "fixtures")

lines = [
 (1,"Room rent - semi-private",3,3200,"2026-09-12",0),
 (2,"Nursing charges",2,800,"2026-09-13",0),
 (3,"Doctor consultation",2,1500,"2026-09-13",0),
 (4,"MRI Lumbar Spine",1,3200,"2026-09-13 11:20",0),
 (5,"MRI Lumbar Spine",1,3200,"2026-09-13 11:20",0),
 (6,"Pathology - CBC and LFT panel",1,2400,"2026-09-13",0),
 (7,"Admission kit",1,250,"2026-09-12",0),
 (8,"Physiotherapy session",2,1500,"2026-09-14",150),
 (9,"Pharmacy - medicines",1,12600,"2026-09-14",0),
 (10,"Medical consumables",1,3000,"2026-09-14",0),
]
items=[{"line":l,"description":d,"qty":q,"rate":r,"amount":q*r,"date":dt,"tax":t} for l,d,q,r,dt,t in lines]
subtotal=sum(i["amount"] for i in items); tax=sum(i["tax"] for i in items)
assert subtotal==41850 and tax==150 and subtotal+tax==42000
bill={"_note":"SYNTHETIC DATA - fictional hospital, patient and amounts. Ground truth for tests and mock AI.",
 "billNumber":"83921","billDate":"2026-09-14","hospital":"Demo Hospital (fictional)",
 "patient":"Demo Customer","admissionDate":"2026-09-12","dischargeDate":"2026-09-14","stayDays":2,
 "insurance":{"insurer":"Demo Insurer (fictional)","policyRef":"POL-DEMO-1042"},
 "lineItems":items,"subtotal":subtotal,"taxTotal":tax,"printedTotal":42000,"currency":"INR"}
json.dump(bill,open(f"{F}/sample_bill.json","w"),indent=2,ensure_ascii=False)

tariff={"_note":"ILLUSTRATIVE SYNTHETIC tariff and policy sheet for the demo. Not real tax/medical/legal guidance.",
 "rates":{"Room rent - semi-private":{"unit":"per day","rate":3200},"Nursing charges":{"unit":"per day","rate":800},
  "Doctor consultation":{"unit":"per visit","rate":1500},"MRI Lumbar Spine":{"unit":"per scan","rate":3200},
  "Pathology - CBC and LFT panel":{"unit":"per panel","rate":2400},"Physiotherapy session":{"unit":"per session","rate":1500},
  "Admission kit":{"unit":"per admission","rate":250}},
 "taxExemptItems":["Physiotherapy session"],
 "insurancePolicy":{"policyRef":"POL-DEMO-1042","nonPayableItems":["Admission kit"]},
 "rules":{"duplicateWindow":"same description + same date/time + same amount","roomDaysRule":"billed room days should equal nights between admission and discharge"}}
json.dump(tariff,open(f"{F}/tariff.json","w"),indent=2,ensure_ascii=False)

findings=[
 {"id":"F1","type":"possible_duplicate","amount":3200,"evidenceStrength":"HIGH","detectedBy":"rule",
  "evidence":{"lines":[4,5],"rule":"same description + same timestamp + same amount"},
  "observation":"MRI Lumbar Spine appears twice on 13 Sep 2026 at 11:20, each for Rs 3,200 (lines 4 and 5).",
  "interpretation":"Possible duplicate entry of one scan.",
  "recommendation":"Ask the billing team to confirm whether two scans were performed."},
 {"id":"F2","type":"stay_mismatch","amount":3200,"evidenceStrength":"HIGH","detectedBy":"rule",
  "evidence":{"lines":[1],"rule":"billed room days (3) vs nights between admission 12 Sep and discharge 14 Sep (2); difference 1 x Rs 3,200"},
  "observation":"Room rent is billed for 3 days (Rs 9,600), while admission 12 Sep and discharge 14 Sep indicate 2 days.",
  "interpretation":"Possible date/stay mismatch on the room charge.",
  "recommendation":"Ask the billing team to verify the admission/discharge dates and billed days."},
 {"id":"F3","type":"insurance_review","amount":250,"evidenceStrength":"MEDIUM","detectedBy":"rule",
  "evidence":{"lines":[7],"rule":"item listed as non-payable in provided insurance policy sheet POL-DEMO-1042"},
  "observation":"Admission kit (Rs 250) is listed as non-payable in the provided policy sheet but appears in the bill.",
  "interpretation":"May not be claimable under the policy; requires clarification.",
  "recommendation":"Please verify with the insurer or billing team how this item is treated."},
 {"id":"F4","type":"tax_review","amount":150,"evidenceStrength":"MEDIUM","detectedBy":"rule",
  "evidence":{"lines":[8],"rule":"tax charged on item marked tax-exempt in provided tariff sheet"},
  "observation":"Tax of Rs 150 is applied to Physiotherapy session, which the provided tariff marks as tax-exempt.",
  "interpretation":"Possible tax treatment inconsistency.",
  "recommendation":"Please verify the tax treatment with the billing team."}]
assert sum(f["amount"] for f in findings)==6800
json.dump({"billNumber":"83921","total":42000,"issuesCount":4,"amountPotentiallyRequiringReview":6800,"findings":findings,
 "arithmetic":{"lineMathOk":True,"totalsReconcile":True}},open(f"{F}/bill_findings.expected.json","w"),indent=2,ensure_ascii=False)

expl={"_note":"AI-translated demo explanations. Label in UI: 'AI-translated - please verify with the billing team.' Numbers/IDs/dates unchanged.",
 "F1":{"en":"The MRI Lumbar Spine appears twice on 13 Sep 2026 at the same time, each for Rs 3,200. Please verify whether the scan was done twice.",
  "hi":"एमआरआई (लम्बर स्पाइन) 13 सितंबर 2026 को एक ही समय पर दो बार दिखाई देता है, प्रत्येक ₹3,200 का। कृपया पुष्टि करें कि स्कैन दो बार किया गया था या नहीं।",
  "mr":"एमआरआय (लंबर स्पाइन) 13 सप्टेंबर 2026 रोजी एकाच वेळी दोनदा दिसत आहे, प्रत्येकी ₹3,200. कृपया स्कॅन दोनदा केला होता का ते तपासा."},
 "F2":{"en":"Room rent appears to be charged for 3 days (Rs 9,600), while the admission (12 Sep) and discharge (14 Sep) dates indicate a 2-day stay. Please verify the dates.",
  "hi":"कमरे का किराया 3 दिनों के लिए (₹9,600) लगाया गया दिखाई देता है, जबकि भर्ती (12 सितंबर) और छुट्टी (14 सितंबर) की तारीखें 2 दिनों का प्रवास दर्शाती हैं। कृपया तारीखों की पुष्टि करें।",
  "mr":"रूम भाडे 3 दिवसांसाठी (₹9,600) आकारलेले दिसत आहे, तर दाखल (12 सप्टेंबर) आणि सुट्टी (14 सप्टेंबर) च्या तारखा 2 दिवसांचा मुक्काम दर्शवतात. कृपया तारखा तपासा."},
 "F3":{"en":"The 'Admission kit' (Rs 250) is listed as non-payable in the provided insurance policy sheet but appears in the bill. Please verify with the insurer or billing team.",
  "hi":"'एडमिशन किट' (₹250) उपलब्ध बीमा पॉलिसी शीट में अदेय (नॉन-पेएबल) के रूप में सूचीबद्ध है, लेकिन बिल में दिखाई देती है। कृपया बीमा कंपनी या बिलिंग टीम से पुष्टि करें।",
  "mr":"'ॲडमिशन किट' (₹250) उपलब्ध विमा पॉलिसी शीटमध्ये नॉन-पेएबल म्हणून नमूद आहे, परंतु बिलात दिसत आहे. कृपया विमा कंपनी किंवा बिलिंग टीमकडे खात्री करा."},
 "F4":{"en":"A tax of Rs 150 is applied to Physiotherapy, which the provided tariff sheet marks as tax-exempt. Please verify the tax treatment.",
  "hi":"फिजियोथेरेपी पर ₹150 का कर लगाया गया है, जबकि उपलब्ध टैरिफ शीट में इसे कर-मुक्त बताया गया है। कृपया कर की स्थिति की पुष्टि करें।",
  "mr":"फिजिओथेरपीवर ₹150 कर आकारलेला आहे, तर उपलब्ध टॅरिफ शीटमध्ये ते करमुक्त दाखवले आहे. कृपया कराची स्थिती तपासा."}}
json.dump(expl,open(f"{F}/explanations.json","w"),indent=2,ensure_ascii=False)

gp={"_note":"Golden path for mock/cached AI modes and the 5-minute demo. Synthetic.",
 "customer":{"id":"CUST-1042","name":"Demo Customer","accountId":"ACC-1042","since":"2023-01-15","preferredLanguage":"mr","phone":"+91-90000-01042","email":"demo.customer@example.com"},
 "case":{"id":"CASE-48291","issue":"Hospital billing discrepancy","priority":"medium","status":"AWAITING_REVIEW","channel":"whatsapp","ownerTeam":"Billing Support","slaHours":72},
 "intent":{"intent":"billing_dispute","sentiment_signal":"frustrated","urgency":"medium","entities":{"bill_id":"83921","amount":6800}},
 "conversation":[
  {"who":"customer","channel":"whatsapp","text":"I think something is wrong with my hospital bill."},
  {"who":"bot","channel":"whatsapp","text":"I can help check it. Please upload your bill (PDF or photo)."},
  {"who":"customer","channel":"whatsapp","text":"[Bill-83921.pdf]"},
  {"who":"bot","channel":"whatsapp","text":"I found 4 items that may require clarification."},
  {"who":"customer","channel":"whatsapp","text":"Explain them in Marathi."},
  {"who":"customer","channel":"whatsapp","text":"Create a query for the hospital."}],
 "queryDraft":{"subject":"Clarification request - Bill #83921 (CASE-48291)",
  "body":"Dear Billing Team,\n\nI am writing regarding Bill #83921 dated 14 Sep 2026. On reviewing the bill, I would appreciate clarification on the following items:\n\n1. MRI Lumbar Spine appears twice on 13 Sep 2026 at 11:20 (lines 4 and 5, Rs 3,200 each). Please confirm whether two scans were performed.\n2. Room rent is billed for 3 days (Rs 9,600), while admission on 12 Sep and discharge on 14 Sep indicate 2 days. Please verify the billed days.\n3. Admission kit (Rs 250) appears to be listed as non-payable in my insurance policy sheet. Please clarify its treatment.\n4. Tax of Rs 150 is applied to Physiotherapy, which appears to be tax-exempt in the tariff provided to me. Please verify.\n\nThe bill is attached. Kindly review and share the outcome.\n\nThank you."},
 "hospitalEmail":{"from":"billing@demohospital.example","subject":"Re: Clarification request - Bill #83921 (CASE-48291)","body":"Please provide more information about the charges you are disputing.","receivedAt":"2026-09-15T10:30:00+05:30"},
 "existingCaseBanner":{"caseId":"CASE-48291","linkMethod":"reference_id","alreadyIdentified":["Room charge (3 days vs 2 days)","Possible duplicate item (MRI)","Date discrepancy","Insurance and tax queries"]},
 "emailDraftReply":"Dear Billing Team,\n\nThank you for your response. The items we are querying are listed below, and Bill #83921 is attached to CASE-48291:\n\n- Lines 4 and 5: MRI Lumbar Spine billed twice on 13 Sep 2026 at 11:20 (Rs 3,200 each)\n- Line 1: Room rent billed for 3 days; admission 12 Sep and discharge 14 Sep indicate 2 days\n- Line 7: Admission kit (Rs 250) - insurance policy treatment\n- Line 8: Tax of Rs 150 on Physiotherapy - tariff shows it as exempt\n\nKindly review these items and confirm.\n\nThank you.",
 "statusReply":{"en":"Your billing query (CASE-48291) is awaiting review by the billing team. The hospital has asked for more detail on the disputed charges, and we have already shared the items you identified. You don't need to resend your bill or repeat the issue.",
  "hi":"आपकी बिलिंग क्वेरी (CASE-48291) बिलिंग टीम की समीक्षा की प्रतीक्षा में है। अस्पताल ने विवादित शुल्कों के बारे में अधिक जानकारी मांगी है, और आपने जो मदें बताई थीं वे हम पहले ही साझा कर चुके हैं। आपको अपना बिल दोबारा भेजने या समस्या दोहराने की ज़रूरत नहीं है।",
  "mr":"तुमची बिलिंग क्वेरी (CASE-48291) बिलिंग टीमच्या पुनरावलोकनाच्या प्रतीक्षेत आहे. रुग्णालयाने वादग्रस्त शुल्कांबद्दल अधिक माहिती मागितली आहे, आणि तुम्ही सांगितलेल्या बाबी आम्ही आधीच कळवल्या आहेत. तुम्हाला बिल पुन्हा पाठवण्याची किंवा समस्या पुन्हा सांगण्याची गरज नाही."},
 "agentPanel":{"summary":"Customer believes four billing items on Bill #83921 need clarification. The bill and main evidence were already provided on WhatsApp; the hospital has asked for more detail by email.",
  "frustrationSignal":"moderate","urgency":"medium","recommendedAction":"Billing review appears appropriate based on the uploaded evidence.","nextBestAction":"Follow up with billing team after SLA threshold."},
 "cxInsightFallback":{"category":"billing_clarification",
  "headline":"Billing-related clarification requests have become a recurring customer issue in the demo dataset.",
  "inferred":["Itemised bills may be hard for customers to interpret","Disputed-item details may be requested again after the customer has already provided them"],
  "recommendation":"Add a plain-language bill explainer link to the discharge message and collect the disputed line items in the first reply, so customers are not asked to repeat them.",
  "owner":"Billing Operations / Patient Experience",
  "metrics":["Repeat-contact rate","Resolution time","Billing clarification volume"],
  "disclaimer":"Inferred factors are hypotheses, not proven causes."}}
json.dump(gp,open(f"{F}/golden_path.json","w"),indent=2,ensure_ascii=False)
print("fixtures ok")
