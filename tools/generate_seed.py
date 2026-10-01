"""Deterministic synthetic seed dataset for CX Intelligence. Run: python3 tools/generate_seed.py
All people/data are fictional. Output: fixtures/seed_cases.json
Categories are PRECOMPUTED here so the app needs no AI calls at seed/reset time."""
import json, os, random
from datetime import datetime, timedelta
R = random.Random(42)
OUT = os.path.join(os.path.dirname(__file__), "..", "fixtures", "seed_cases.json")
START = datetime(2026, 8, 3)  # week 1 Monday; 8 weeks -> ends 27 Sep 2026

first = ["Aarav","Diya","Rohan","Sneha","Kabir","Meera","Vihaan","Ananya","Arjun","Isha","Neel","Pooja","Sahil","Tara","Yash","Riya","Om","Kavya","Nikhil","Sana","Dev","Mitali","Rahul","Preeti","Harsh"]
last = ["P.","K.","S.","D.","M.","N.","J.","R.","T.","B."]
langs = ["en","hi","mr"]
customers = []
for i in range(25):
    customers.append({"id": f"CUST-{1001+i}", "name": f"{first[i]} {R.choice(last)}", "preferredLanguage": R.choices(langs, [5,3,3])[0],
                      "accountId": f"ACC-{1001+i}", "synthetic": True})

cats = {
 "billing_clarification": dict(label="Billing clarification requests", weekly=[1,1,2,2,3,3,4,5], team="Billing Support",
    contacts=[1,2,2,3,3,4], esc=0.35, res=(4,9), quotes=[
     ("Please explain these charges.","कृपया इन शुल्कों की व्याख्या करें।","कृपया या शुल्कांचे स्पष्टीकरण द्या."),
     ("I already sent the bill.","मैं बिल पहले ही भेज चुका हूँ।","मी बिल आधीच पाठवले आहे."),
     ("Nobody told me what this item is.","मुझे किसी ने नहीं बताया कि यह मद क्या है।","हा आयटम काय आहे ते कोणीही सांगितले नाही.")]),
 "claim_status": dict(label="Insurance claim status uncertainty", weekly=[1,1,1,2,1,1,2,1], team="Insurance Desk",
    contacts=[1,1,2,2,3], esc=0.25, res=(3,6), quotes=[
     ("Where is my insurance claim?","मेरा बीमा दावा कहाँ है?","माझा विमा दावा कुठे आहे?"),
     ("Nobody told me when it would be settled.","किसी ने नहीं बताया कि यह कब निपटेगा।","तो केव्हा निकाली निघेल ते कोणी सांगितले नाही.")]),
 "appointment_rescheduling": dict(label="Appointment rescheduling", weekly=[1,2,1,1,2,1,1,1], team="Front Desk",
    contacts=[1,1,1,2], esc=0.05, res=(1,2), quotes=[
     ("Can I move my appointment to next week?","क्या मैं अपॉइंटमेंट अगले हफ्ते कर सकता हूँ?","मी माझी अपॉइंटमेंट पुढच्या आठवड्यात घेऊ शकतो का?")]),
 "report_delay": dict(label="Lab report delays", weekly=[0,1,1,0,1,1,0,1], team="Diagnostics",
    contacts=[1,1,2,2], esc=0.20, res=(2,5), quotes=[
     ("My test report is not ready yet.","मेरी जाँच रिपोर्ट अभी तक तैयार नहीं है।","माझा चाचणी अहवाल अजून तयार नाही.")]),
}
channels = ["whatsapp","email","web"]
cases, n = [], 40001
for key, c in cats.items():
    for w, count in enumerate(c["weekly"]):
        for _ in range(count):
            created = START + timedelta(weeks=w, days=R.randint(0,6), hours=R.randint(9,18), minutes=R.randint(0,59))
            cust = R.choice(customers)
            q = R.choice(c["quotes"]); li = {"en":0,"hi":1,"mr":2}[cust["preferredLanguage"]]
            k = R.choice(c["contacts"]); resdays = R.randint(*c["res"])
            resolved = created + timedelta(days=resdays) < datetime(2026,9,28)
            first_ch = R.choice(channels)
            inter = []
            for j in range(k):
                ch = first_ch if j == 0 else R.choice(channels)
                inter.append({"channel": ch, "at": (created + timedelta(hours=j*R.randint(10,40))).isoformat(), "text": q[li] if j == 0 else q[0]})
            cases.append({"id": f"CASE-{n}", "customerId": cust["id"], "category": key, "team": c["team"],
              "createdAt": created.isoformat(), "week": w+1, "channel": first_ch,
              "status": "RESOLVED" if resolved else R.choice(["OPEN","AWAITING_REVIEW","ESCALATED"]),
              "escalated": R.random() < c["esc"], "contactCount": k, "repeatContact": k >= 2,
              "resolutionDays": resdays if resolved else None, "quote": q[li], "interactions": inter})
            n += 1

# test oracle (UI must COMPUTE these from raw rows - never hard-code)
oracle = {}
for key in cats:
    rows = [x for x in cases if x["category"] == key]
    first4 = sum(1 for x in rows if x["week"] <= 4); last4 = sum(1 for x in rows if x["week"] > 4)
    done = [x["resolutionDays"] for x in rows if x["resolutionDays"] is not None]
    oracle[key] = {"volume": len(rows), "first4weeks": first4, "last4weeks": last4,
      "trendPct": round((last4-first4)/first4*100) if first4 else None,
      "repeatContactRate": round(sum(x["repeatContact"] for x in rows)/len(rows), 2),
      "escalationRate": round(sum(x["escalated"] for x in rows)/len(rows), 2),
      "avgResolutionDays": round(sum(done)/len(done), 1) if done else None}
out = {"_note": "SYNTHETIC demo dataset. Categories precomputed. 'oracle' is for tests only - the app must compute figures from rows.",
       "period": {"start": START.date().isoformat(), "weeks": 8}, "categories": {k: v["label"] for k, v in cats.items()},
       "customers": customers, "cases": cases, "oracle": oracle, "sampleSize": len(cases)}
json.dump(out, open(OUT, "w"), indent=1, ensure_ascii=False)
print("cases:", len(cases), "interactions:", sum(len(c["interactions"]) for c in cases))
for k, v in oracle.items(): print(k, v)
