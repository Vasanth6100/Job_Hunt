import re
from typing import Dict, Any, List

SCAM_KEYWORDS = [
    (r"\bwire\s*transfer\b", "Mentions suspicious wire transfer operations"),
    (r"\btelegram\s*(@|interview|hr|contact)\b", "Directs applicants to unverified Telegram channels for hiring"),
    (r"\bwhatsapp\s*(only|hr|\+|interview)\b", "Directs communication exclusively via personal WhatsApp"),
    (r"\bregistration\s*fee\b", "Demands upfront registration or processing fees"),
    (r"\bsecurity\s*deposit\b", "Demands upfront refundable/non-refundable security deposit"),
    (r"\b(crypto|bitcoin|usdt)\b", "Offers payment or asks investment in cryptocurrency"),
    (r"\bgift\s*cards?\b", "Requests handling of gift cards or financial instruments"),
    (r"\bguaranteed\s*(daily|weekly)?\s*(payout|earnings|income)\b", "Promises guaranteed unrealistically fast payouts"),
    (r"\bkit\s*dispatch\b", "Requires fee for equipment or starter kit dispatch"),
    (r"\bno\s*(interview|experience|qualification|resume)\s*(needed|required)\b", "Claims high compensation with zero requirements or vetting"),
    (r"\bearn\s*(₹|\$)?\d+[\d,]*\s*(daily|per\s*day|hourly)\b", "Advertises exaggerated daily or hourly cash earnings"),
]

def assess_job_risk(job: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates a job listing using rule-based heuristics to identify fraudulent or high-risk listings.
    Clearly designated as 'Prototype Fake Job Risk Analysis'.
    """
    reasons: List[str] = []
    risk_score = 0

    title = str(job.get("title", "")).strip()
    company = str(job.get("company", "")).strip()
    location = str(job.get("location", "")).strip()
    salary = str(job.get("salary", "")).strip()
    description = str(job.get("description", "")).strip()
    skills = job.get("skills", [])
    experience = str(job.get("experience", "")).strip()

    combined_text = f"{title} {company} {location} {salary} {description} {experience}".lower()

    # Rule 1: Suspicious scam keywords check
    for pattern, reason in SCAM_KEYWORDS:
        if re.search(pattern, combined_text, re.IGNORECASE):
            reasons.append(reason)
            risk_score += 25

    # Rule 2: Missing or blank company name
    if not company or company.lower() in ["confidential", "undisclosed", "n/a", "none"]:
        reasons.append("Company identity is missing or undisclosed")
        risk_score += 20

    # Rule 3: Missing location
    if not location or location.lower() in ["n/a", "none"]:
        reasons.append("Job location details are missing")
        risk_score += 15

    # Rule 4: Very short or vague job description
    if len(description) < 120:
        reasons.append("Job description is suspiciously brief and lacks project responsibilities")
        risk_score += 25

    # Rule 5: Unrealistic salary claims for 0 experience / freshers
    if ("lpa" in salary.lower() or "per week" in salary.lower()) and ("4" in salary or "5" in salary or "6" in salary or "50,000" in salary):
        if any(term in experience.lower() for term in ["0", "fresh", "any", "no experience", "anyone"]):
            if "unrealistic compensation" not in [r.lower() for r in reasons]:
                reasons.append("Abnormally inflated compensation package relative to zero required experience")
                risk_score += 30

    # Rule 6: Missing required technical skills
    if not skills or len(skills) <= 1:
        reasons.append("Listing specifies virtually no verifiable skill or competency requirements")
        risk_score += 15

    # Rule 7: Urgent bait phrasing in title
    if any(urgent in title.lower() for urgent in ["urgent", "instant joining", "immediate payout", "guaranteed"]):
        reasons.append("Title uses high-pressure urgency cues commonly observed in hiring phishing")
        risk_score += 15

    # Clamp risk score
    risk_score = min(100, max(5, risk_score))

    # Categorize risk level
    if risk_score >= 60:
        risk_level = "High"
    elif risk_score >= 30:
        risk_level = "Moderate"
    else:
        risk_level = "Low"

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "reasons": reasons,
        "disclaimer": "Prototype Fake Job Risk Analysis"
    }
