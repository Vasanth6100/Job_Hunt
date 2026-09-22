import re
from typing import Dict, Any, List
import io

# ─── Broad skills dictionary (Tech + Non-Tech) ────────────────────────────────
KNOWN_SKILLS = [
    # Programming Languages & Tech
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Golang", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "SQL", "HTML", "CSS", "Bash", "Shell",
    # Frameworks & Libraries
    "React", "React Native", "Vue.js", "Angular", "Next.js", "Node.js", "Express", "FastAPI", "Django", "Flask", "Spring Boot", "Tailwind CSS", "Bootstrap", "Redux",
    # AI / ML / Data
    "Machine Learning", "Deep Learning", "PyTorch", "TensorFlow", "HuggingFace", "Transformers", "Sentence Transformers", "Scikit-learn", "Pandas", "NumPy", "OpenCV", "NLP", "Computer Vision", "LLMs", "LangChain",
    # Cloud / DevOps
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux", "Git", "GitHub", "Prometheus", "Grafana", "Microservices", "REST APIs", "GraphQL", "Kafka",
    # Databases
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Elasticsearch",
    # Security / Design / QA
    "Cybersecurity", "SIEM", "Network Security", "Penetration Testing", "Figma", "UI/UX", "User Research", "Wireframing", "Selenium", "Pytest", "Postman",
    # Business / Admin / Non-tech
    "Microsoft Excel", "Excel", "Microsoft Word", "Word", "Microsoft Office", "PowerPoint", "Google Sheets", "Tally", "SAP", "ERP", "CRM",
    "Billing", "Invoicing", "Accounts", "Accounting", "Bookkeeping", "Payroll",
    "Data Entry", "Data Management", "Documentation", "Record Management", "Filing",
    "Customer Service", "Customer Support", "Client Relations", "Communication",
    "Scheduling", "Appointment Scheduling", "Calendar Management",
    "Administration", "Office Administration", "Front Desk", "Receptionist",
    "Sales Coordination", "Sales Support", "Order Processing",
    "Team Coordination", "Operations", "Compliance",
    "Procurement", "Vendor Management", "Supply Chain",
    "HR", "Recruitment", "Training",
    "Banking", "Finance", "Financial Analysis", "Investment",
    "Marketing", "Digital Marketing", "SEO", "Social Media",
    "Healthcare", "Medical Records", "Patient Management",
    "Quality Control", "Quality Assurance", "Auditing",
    "Report Writing", "Presentation", "Research",
    "English", "Hindi", "Marathi",
]

# ─── Role patterns with broad keyword matching ────────────────────────────────
ROLE_SKILL_PATTERNS = {
    "AI/ML Engineer": ["pytorch", "tensorflow", "machine learning", "deep learning", "nlp", "transformers", "scikit-learn"],
    "Python Developer": ["python", "fastapi", "django", "flask", "postgresql", "sql"],
    "Frontend Developer": ["react", "vue.js", "angular", "javascript", "typescript", "tailwind css", "css", "html"],
    "Full Stack Engineer": ["react", "node.js", "express", "mongodb", "typescript", "python"],
    "Cloud & DevOps Engineer": ["aws", "docker", "kubernetes", "terraform", "ci/cd", "linux"],
    "Data Scientist / Analyst": ["pandas", "numpy", "sql", "data visualization", "machine learning", "scikit-learn", "statistics"],
    "Cybersecurity Specialist": ["cybersecurity", "siem", "network security", "penetration testing"],
    "UI/UX Designer": ["figma", "ui/ux", "wireframing", "prototyping", "design systems"],
    # Non-tech roles
    "Billing & Accounts Executive": ["billing", "invoicing", "accounts", "accounting", "tally", "bookkeeping", "payroll"],
    "Administrative Assistant / Coordinator": ["administration", "office administration", "documentation", "record management", "scheduling", "filing", "front desk", "receptionist"],
    "Customer Service Executive": ["customer service", "customer support", "client relations", "communication"],
    "Sales Coordinator": ["sales coordination", "sales support", "order processing", "client relations"],
    "Operations Executive": ["operations", "compliance", "data management", "data entry", "reporting"],
    "HR Executive": ["hr", "recruitment", "training", "payroll"],
    "Finance / Banking Professional": ["banking", "finance", "financial analysis", "investment", "accounts"],
    "Healthcare Administrator": ["healthcare", "medical records", "patient management", "billing"],
    "Digital Marketing Executive": ["marketing", "digital marketing", "seo", "social media", "content"],
}

# ─── Education degree patterns ────────────────────────────────────────────────
EDUCATION_PATTERNS = [
    # Technical degrees
    r"\bb\.?tech\b", r"\bm\.?tech\b", r"\bb\.?e\.?\b", r"\bm\.?e\.?\b",
    r"\bb\.?sc\b", r"\bm\.?sc\b", r"\bb\.?s\.?\b", r"\bm\.?s\.?\b",
    r"\bph\.?d\b", r"\bdoctorate\b", r"\bdiploma\b",
    r"\bcomputer science\b", r"\binformation technology\b",
    r"\belectrical engineering\b", r"\bmechanical engineering\b",
    # Commerce / Business degrees
    r"\bb\.?b\.?i\b", r"\bb\.?com\b", r"\bm\.?com\b",
    r"\bbba\b", r"\bmba\b", r"\bbms\b", r"\bbca\b", r"\bmca\b",
    r"\bbusiness administration\b", r"\bcommerce\b",
    # Arts / Other
    r"\bb\.?a\.?\b", r"\bm\.?a\.?\b", r"\barts\b", r"\bhumanities\b",
    # School-level (Indian)
    r"\bssc\b", r"\bhsc\b", r"\b10th\b", r"\b12th\b",
    r"\bmaharashtra board\b", r"\bcbse\b", r"\bicse\b",
    r"\bmumbai university\b", r"\buniversity\b", r"\bcollege\b",
]

# ─── Experience year patterns ─────────────────────────────────────────────────
EXPERIENCE_YEAR_PATTERNS = [
    r"(\d{4})\s*[-–—to]+\s*(present|current|\d{4})",   # 2018 - 2022 or 2018 – Present
    r"(\d+\+?\s*(?:years?|yrs?|months?)(?:\s*of)?(?:\s*experience)?)",  # 3+ years of experience
]


def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        from pypdf import PdfReader
        reader = PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            t = page.extract_text()
            if t:
                text += t + "\n"
        return text
    except Exception as e:
        return f"Error reading PDF: {str(e)}"


def extract_text_from_docx(file_bytes: bytes) -> str:
    try:
        import docx
        doc = docx.Document(io.BytesIO(file_bytes))
        full_text = []
        for para in doc.paragraphs:
            if para.text:
                full_text.append(para.text)
        return "\n".join(full_text)
    except Exception as e:
        return f"Error reading DOCX: {str(e)}"


def _calculate_total_experience(text: str) -> str:
    """
    Extracts all date ranges from the text and calculates total work experience in years.
    Handles patterns like: 2018 – 2022, 2022 - 2025, March 2026 – Present, etc.
    """
    current_year = 2026  # Using current project year

    # Find all date ranges
    ranges = re.findall(
        r'(\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)?\s*\d{4})\s*[-–—to]+\s*(\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)?\s*(?:\d{4}|present|current))',
        text,
        re.IGNORECASE
    )

    total_months = 0
    for start_str, end_str in ranges:
        # Extract just the year numbers
        start_years = re.findall(r'\d{4}', start_str)
        end_years = re.findall(r'\d{4}', end_str)

        if not start_years:
            continue

        start_year = int(start_years[-1])

        if re.search(r'present|current', end_str, re.IGNORECASE):
            end_year = current_year
        elif end_years:
            end_year = int(end_years[-1])
        else:
            continue

        if 1990 <= start_year <= current_year and start_year <= end_year <= current_year:
            total_months += (end_year - start_year) * 12

    if total_months >= 12:
        years = total_months // 12
        months = total_months % 12
        if months > 0:
            return f"{years} year{'s' if years > 1 else ''} {months} month{'s' if months > 1 else ''} (calculated from work history)"
        return f"{years} year{'s' if years > 1 else ''} (calculated from work history)"

    # Fallback: look for direct mentions
    explicit = re.findall(r'(\d+\+?\s*(?:years?|yrs?|months?)\s*(?:of\s*)?(?:experience|exp)?)', text, re.IGNORECASE)
    if explicit:
        return explicit[0] + " (stated in resume)"

    return "Not specified"


def _extract_education(text: str) -> List[str]:
    """
    Finds education lines by scanning for known degree/institution keywords.
    Extracts the actual line content rather than generic labels.
    """
    detected = []
    seen = set()
    lines = text.split('\n')

    for line in lines:
        line_clean = line.strip()
        if not line_clean or len(line_clean) < 5 or len(line_clean) > 200:
            continue

        line_lower = line_clean.lower()
        for pattern in EDUCATION_PATTERNS:
            if re.search(pattern, line_lower):
                # Clean up and deduplicate
                key = re.sub(r'\s+', ' ', line_clean)[:120]
                if key not in seen:
                    seen.add(key)
                    detected.append(key)
                break

    return detected[:6] if detected else []


def parse_resume_text(text: str) -> Dict[str, Any]:
    """
    Parses resume text using rule-based and regex patterns.
    Works for both technical and non-technical resumes.
    Labeled honestly as 'Prototype Resume Analysis'.
    """
    lower_text = text.lower()

    # ── 1. Detect Skills (broad matching, multi-word aware) ──────────────────
    detected_skills: List[str] = []
    for skill in KNOWN_SKILLS:
        pattern = r'(?<![a-zA-Z])' + re.escape(skill.lower()) + r'(?![a-zA-Z])'
        if re.search(pattern, lower_text):
            detected_skills.append(skill)

    # ── 2. Extract Real Education Lines ──────────────────────────────────────
    detected_education = _extract_education(text)

    # ── 3. Calculate Work Experience from Date Ranges ────────────────────────
    exp_summary = _calculate_total_experience(text)

    # ── 4. Suggest Roles based on detected skills ─────────────────────────────
    detected_lower = [s.lower() for s in detected_skills]
    suggested_roles: List[str] = []

    for role, keywords in ROLE_SKILL_PATTERNS.items():
        overlap = sum(1 for kw in keywords if any(kw in dl for dl in detected_lower))
        if overlap >= 1:
            suggested_roles.append((role, overlap))

    # Sort by overlap count, take top 4
    suggested_roles.sort(key=lambda x: x[1], reverse=True)
    final_roles = [r[0] for r in suggested_roles[:4]]

    if not final_roles:
        # Infer from work experience titles in text
        if any(w in lower_text for w in ['receptionist', 'front desk', 'clinic', 'hospital']):
            final_roles = ['Healthcare Administrator', 'Administrative Assistant / Coordinator']
        elif any(w in lower_text for w in ['advisor', 'billing', 'invoice']):
            final_roles = ['Billing & Accounts Executive', 'Operations Executive']
        elif any(w in lower_text for w in ['sales', 'coordinator', 'quotation']):
            final_roles = ['Sales Coordinator', 'Operations Executive']
        else:
            final_roles = ['Administrative Executive', 'Operations Coordinator']

    # ── 5. Build Summary ──────────────────────────────────────────────────────
    skill_count = len(detected_skills)
    role_preview = ', '.join(final_roles[:2]) if final_roles else 'General Administration'
    summary = (
        f"Candidate profile highlights {skill_count} identified competencies with primary alignment toward "
        f"{role_preview}. "
        + (f"Possesses experience in {', '.join(detected_skills[:4])}." if detected_skills else
           "Resume content suggests administrative and coordination experience based on work history analysis.")
    )

    words = text.split()
    return {
        "summary": summary,
        "detected_skills": detected_skills,
        "education": detected_education,
        "experience_years_detected": exp_summary,
        "suggested_roles": final_roles,
        "word_count": len(words),
        "character_count": len(text),
        "disclaimer": "Prototype Resume Analysis"
    }
