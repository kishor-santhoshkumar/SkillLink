import re
import os
import json
from typing import Dict, Optional, Tuple
from groq import Groq
from dotenv import load_dotenv
from langdetect import detect, LangDetectException
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.enums import TA_LEFT, TA_CENTER
import logging

# Load environment variables from .env file
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)


def _get_groq_client():
    """Lazy initialization of Groq client."""
    load_dotenv(override=True)
    api_key = os.getenv("GROQ_API_KEY")
    
    if not api_key:
        logger.warning("GROQ_API_KEY not found in environment.")
        return None
    
    logger.info("Groq API key loaded successfully")
    return Groq(api_key=api_key)


def detect_language(text: str) -> str:
    """Detect the language of input text."""
    try:
        lang = detect(text)
        logger.info(f"Detected language: {lang}")
        return lang
    except LangDetectException:
        logger.warning("Could not detect language")
        return "unknown"


def calculate_resume_score(data: Dict[str, Optional[str]]) -> Dict[str, any]:
    """
    Calculate skilled worker professional profile quality score.
    
    Enhanced scoring logic for rural & urban skilled workers:
    - +10 if full_name exists
    - +15 if phone_number exists
    - +10 if profile_photo uploaded
    - +15 if primary_trade exists
    - +10 if years_of_experience exists
    - +10 if specializations exist
    - +5 if village_or_city exists
    - +5 if district exists
    - +5 if tools_handled exist
    - +5 if projects_completed exists
    - +5 if service_type exists
    - +5 if own_tools specified
    """
    score = 0
    feedback_parts = []
    
    if data.get("full_name"):
        score += 10
    else:
        feedback_parts.append("Add your full name")
    
    # Phone number is critical for contact
    phone = data.get("phone_number") or data.get("contact_number")
    if phone:
        score += 15
    else:
        feedback_parts.append("Add phone number for clients to contact you")
    
    # Profile photo builds trust
    if data.get("profile_photo"):
        score += 10
    else:
        feedback_parts.append("Add profile photo to improve hiring trust")
    
    if data.get("primary_trade"):
        score += 15
    else:
        feedback_parts.append("Specify your primary trade")
    
    if data.get("years_of_experience"):
        score += 10
    else:
        feedback_parts.append("Add years of experience")
    
    if data.get("specializations"):
        score += 10
    else:
        feedback_parts.append("List your specializations")
    
    # Location is important for local hiring
    if data.get("village_or_city"):
        score += 5
    else:
        feedback_parts.append("Add your village or city")
    
    if data.get("district"):
        score += 5
    
    # Tools and equipment
    tools = data.get("tools_handled") or data.get("tools_known")
    if tools:
        score += 5
    else:
        feedback_parts.append("List tools you can handle")
    
    if data.get("projects_completed"):
        score += 5
    
    if data.get("service_type"):
        score += 5
    
    # Generate actionable feedback
    if score >= 90:
        feedback = "Excellent! Your profile is complete and professional."
    elif score >= 70:
        feedback = f"Good profile! To improve: {', '.join(feedback_parts[:2])}"
    elif score >= 50:
        feedback = f"Decent start. Please add: {', '.join(feedback_parts[:3])}"
    else:
        feedback = f"Profile needs improvement. Missing: {', '.join(feedback_parts[:4])}"
    
    logger.info(f"Profile score calculated: {score}/100")
    
    return {
        "score": score,
        "feedback": feedback
    }


def generate_structured_resume(raw_input: str) -> Tuple[Dict[str, Optional[str]], int]:
    """
    Generate structured skilled worker profile from raw text using AI.
    
    Tailored for: Carpenters, Plumbers, Electricians, Mechanics, etc.
    """
    client = _get_groq_client()
    
    if not client:
        logger.warning("Groq client not available. Using fallback parsing.")
        return _fallback_parsing(raw_input), 50
    
    try:
        # Enhanced AI prompt for Rural & Urban Skilled Worker Professional Profile Platform
        system_prompt = """You are an expert profile writer for Rural & Urban Skilled Worker Professional Platform.

CONTEXT:
This system serves carpenters, plumbers, electricians, mechanics, masons, painters, welders, and other skilled workers.
Many users may be semi-literate or illiterate.
The output must look professional enough for contractors, construction companies, and MNC facility teams.

Your job:
1. Understand the input (it may be in English, Tamil, Hindi, or mixed languages).
2. Translate it internally to English if needed.
3. Create a PROFESSIONAL, ACHIEVEMENT-FOCUSED profile for skilled workers.

PROFESSIONAL WRITING GUIDELINES:
- Use strong action verbs (Executed, Delivered, Installed, Constructed, Repaired, Managed, Completed)
- Write achievement-focused bullet points with specific numbers
- Sound confident and skilled (NOT generic phrases like "hardworking individual")
- Use professional tone throughout
- Make the worker sound experienced, reliable, and capable
- Focus on practical skills, tools, and completed projects

Extract and enhance ALL the following fields:

BASIC DETAILS:
- full_name: Worker's full name
- phone_number: Phone/mobile number (critical for contact)
- village_or_city: Village name or city name
- district: District name
- state: State name

TRADE DETAILS:
- primary_trade: Main trade (Carpenter, Plumber, Electrician, Mechanic, Mason, Painter, Welder, AC Technician, etc.)
- years_of_experience: Years of experience (e.g., "8 years", "15 years", or "Fresher")
- specializations: Specific skills within the trade (comma-separated, professional terms)
- tools_handled: Tools and equipment they can handle (comma-separated, professional names)

WORK BACKGROUND:
- worked_as: Type of work (self-employed / company worker / contractor / freelancer)
- company_name: Company name if they worked for a company (optional)
- project_types: Types of projects worked on (houses, apartments, factories, commercial buildings, etc.)

SERVICE DETAILS:
- service_type: Type of service (daily wage / contract / per project / hourly)
- availability: Availability (full-time / part-time / weekends / flexible)
- travel_radius: How far they can travel (5km / 10km / 20km / 30km / city-wide / anywhere)
- expected_wage: Expected wage or rate (e.g., "₹1500 per day", "₹500 per hour")
- own_tools: Do they have own tools? (true/false)
- own_vehicle: Do they have own vehicle? (true/false)

TRUST & CREDIBILITY:
- projects_completed: Estimated number of projects completed (integer)
- reference_available: Do they have references? (true/false)

EDUCATION:
- education_level: Education level (illiterate / primary / secondary / high school / diploma / degree / ITI)
- technical_training: Technical training details (ITI / polytechnic / apprenticeship / self-taught / company training)

LANGUAGES:
- languages_spoken: Languages they can speak (comma-separated: English, Hindi, Tamil, Telugu, etc.)

AI-GENERATED CONTENT:
- professional_summary: Write a POWERFUL 3-4 line professional summary that:
  * Highlights years of experience and primary trade
  * Mentions key specializations and tools
  * Emphasizes reliability, quality, and trust
  * Uses confident, professional language
  * Example: "Highly skilled Electrician with 15+ years of experience specializing in residential and commercial electrical installations. Proven track record of delivering safe, quality electrical work on 300+ projects. Expert in panel upgrades, wiring, lighting design, and electrical troubleshooting. Known for reliability, safety compliance, and client satisfaction."

- structured_work_experience: Create 3-5 professional bullet points describing their work experience:
  * Use action verbs (Executed, Delivered, Installed, Constructed, Completed, Managed)
  * Include specific achievements and numbers
  * Focus on results, quality, and reliability
  * Make each bullet impactful and professional
  * Example bullets:
    - "Executed 300+ electrical installation projects for residential and commercial clients"
    - "Delivered safe, code-compliant electrical work with 99% client satisfaction rate"
    - "Specialized in panel upgrades, circuit installations, and lighting systems"
    - "Managed electrical projects from planning to completion with own tools and vehicle"
  Return as array of strings

- confidence_score: Your confidence in the extraction accuracy (0-100)

CRITICAL RULES:
- Always return ONLY valid JSON.
- Do not add explanations, markdown, or extra text.
- If a field is missing, return null.
- For boolean fields (own_tools, own_vehicle, reference_available), return true/false or null.
- Translate all content to professional English.
- Make the profile sound PROFESSIONAL and ACHIEVEMENT-FOCUSED.
- Use specific numbers and results wherever possible.
- Avoid generic phrases - be specific and impactful.

Output format (strict JSON):
{
  "full_name": "",
  "phone_number": "",
  "village_or_city": "",
  "district": "",
  "state": "",
  "primary_trade": "",
  "years_of_experience": "",
  "specializations": "",
  "tools_handled": "",
  "worked_as": "",
  "company_name": "",
  "project_types": "",
  "service_type": "",
  "availability": "",
  "travel_radius": "",
  "expected_wage": "",
  "own_tools": false,
  "own_vehicle": false,
  "projects_completed": 0,
  "reference_available": false,
  "education_level": "",
  "technical_training": "",
  "languages_spoken": "",
  "professional_summary": "",
  "structured_work_experience": ["bullet1", "bullet2", "bullet3"],
  "confidence_score": 85
}"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": raw_input}
            ],
            response_format={"type": "json_object"},
            temperature=0.3,
            max_tokens=1000
        )
        
        ai_response = response.choices[0].message.content.strip()
        
        try:
            structured_data = json.loads(ai_response)
            confidence_score = structured_data.get("confidence_score", 75)
            
            result = {
                # Basic details
                "full_name": structured_data.get("full_name"),
                "phone_number": structured_data.get("phone_number"),
                "village_or_city": structured_data.get("village_or_city"),
                "district": structured_data.get("district"),
                "state": structured_data.get("state"),
                
                # Trade details
                "primary_trade": structured_data.get("primary_trade"),
                "years_of_experience": structured_data.get("years_of_experience"),
                "specializations": structured_data.get("specializations"),
                "tools_handled": structured_data.get("tools_handled"),
                
                # Work background
                "worked_as": structured_data.get("worked_as"),
                "company_name": structured_data.get("company_name"),
                "project_types": structured_data.get("project_types"),
                
                # Service details
                "service_type": structured_data.get("service_type"),
                "availability": structured_data.get("availability"),
                "travel_radius": structured_data.get("travel_radius"),
                "expected_wage": structured_data.get("expected_wage"),
                "own_tools": structured_data.get("own_tools"),
                "own_vehicle": structured_data.get("own_vehicle"),
                
                # Trust & credibility
                "projects_completed": structured_data.get("projects_completed"),
                "reference_available": structured_data.get("reference_available"),
                
                # Education
                "education_level": structured_data.get("education_level"),
                "technical_training": structured_data.get("technical_training"),
                
                # Languages
                "languages_spoken": structured_data.get("languages_spoken"),
                
                # AI-generated content
                "professional_summary": structured_data.get("professional_summary"),
                "structured_work_experience": structured_data.get("structured_work_experience", []),
                
                # Legacy fields for backward compatibility
                "contact_number": structured_data.get("phone_number"),
                "tools_known": structured_data.get("tools_handled"),
                "languages": structured_data.get("languages_spoken"),
                "location": structured_data.get("village_or_city")
            }
            
            logger.info(f"Successfully extracted skilled worker profile (confidence: {confidence_score}%)")
            return result, confidence_score
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {e}")
            return _fallback_parsing(raw_input), 50
    
    except Exception as e:
        logger.error(f"Groq API error: {e}")
        return _fallback_parsing(raw_input), 50


def _fallback_parsing(raw_input: str) -> Dict[str, Optional[str]]:
    """Fallback function using simple regex parsing if AI fails."""
    result = {
        # Basic details
        "full_name": None,
        "phone_number": None,
        "village_or_city": None,
        "district": None,
        "state": None,
        
        # Trade details
        "primary_trade": None,
        "years_of_experience": None,
        "specializations": None,
        "tools_handled": None,
        
        # Work background
        "worked_as": None,
        "company_name": None,
        "project_types": None,
        
        # Service details
        "service_type": None,
        "availability": None,
        "travel_radius": None,
        "expected_wage": None,
        "own_tools": None,
        "own_vehicle": None,
        
        # Trust & credibility
        "projects_completed": None,
        "reference_available": None,
        
        # Education
        "education_level": None,
        "technical_training": None,
        
        # Languages
        "languages_spoken": None,
        
        # AI-generated content
        "professional_summary": None,
        
        # Legacy fields
        "contact_number": None,
        "tools_known": None,
        "languages": None,
        "location": None
    }
    
    # Extract name
    name_match = re.search(r"(?:my name is|i am|name:?)\s+([A-Za-z\s]+?)(?:\.|,|\n|and|$)", raw_input, re.IGNORECASE)
    if name_match:
        result["full_name"] = name_match.group(1).strip()
    
    # Extract phone
    phone_match = re.search(r"[\+\d][\d\s\-\(\)]{8,}", raw_input)
    if phone_match:
        phone = phone_match.group(0).strip()
        result["phone_number"] = phone
        result["contact_number"] = phone
    
    # Extract trade
    trades = ["carpenter", "plumber", "electrician", "mechanic", "mason", "painter", "welder", "ac technician"]
    for trade in trades:
        if trade in raw_input.lower():
            result["primary_trade"] = trade.capitalize()
            break
    
    # Extract experience
    exp_match = re.search(r"(\d+)\s*(?:years?|yrs?)", raw_input, re.IGNORECASE)
    if exp_match:
        result["years_of_experience"] = f"{exp_match.group(1)} years"
    
    # Extract location
    loc_match = re.search(r"\bin\s+([A-Za-z\s]+?)(?:\.|,|\n|$)", raw_input, re.IGNORECASE)
    if loc_match:
        location = loc_match.group(1).strip()
        result["village_or_city"] = location
        result["location"] = location
    
    result["professional_summary"] = f"Skilled {result['primary_trade'] or 'worker'} with {result['years_of_experience'] or 'experience'}."
    
    return result


def generate_formatted_resume(data: Dict[str, Optional[str]]) -> str:
    """
    Generate professionally formatted skilled worker resume with structured layout.
    
    Layout follows modern resume standards:
    - Large bold name header
    - Clear section divisions
    - Bullet-point formatting
    - Professional spacing
    """
    lines = []
    
    # ============================================================
    # HEADER SECTION - Name and Title
    # ============================================================
    if data.get("full_name"):
        lines.append("=" * 70)
        lines.append(data["full_name"].upper().center(70))
        lines.append("=" * 70)
        lines.append("")
    
    # Trade and Experience subtitle
    header_parts = []
    if data.get("primary_trade"):
        header_parts.append(data["primary_trade"])
    if data.get("years_of_experience"):
        header_parts.append(f"{data['years_of_experience']} Experience")
    
    if header_parts:
        lines.append(" | ".join(header_parts).center(70))
        lines.append("")
    
    # ============================================================
    # CONTACT INFORMATION
    # ============================================================
    lines.append("CONTACT")
    lines.append("-" * 70)
    
    contact_parts = []
    if data.get("contact_number"):
        contact_parts.append(f"Phone: {data['contact_number']}")
    if data.get("location"):
        contact_parts.append(f"Location: {data['location']}")
    
    if contact_parts:
        lines.append(" | ".join(contact_parts))
        lines.append("")
    
    # ============================================================
    # PROFESSIONAL SUMMARY
    # ============================================================
    if data.get("professional_summary"):
        lines.append("PROFESSIONAL SUMMARY")
        lines.append("-" * 70)
        # Wrap long summary text
        summary = data["professional_summary"]
        lines.append(summary)
        lines.append("")
    
    # ============================================================
    # WORK EXPERIENCE (Bullet Points)
    # ============================================================
    work_exp = data.get("structured_work_experience", [])
    if work_exp and isinstance(work_exp, list) and len(work_exp) > 0:
        lines.append("PROFESSIONAL EXPERIENCE")
        lines.append("-" * 70)
        for bullet in work_exp:
            if bullet:
                lines.append(f"• {bullet}")
        lines.append("")
    
    # ============================================================
    # SPECIALIZATIONS (Bullet Points)
    # ============================================================
    if data.get("specializations"):
        lines.append("CORE SPECIALIZATIONS")
        lines.append("-" * 70)
        specs = data["specializations"].split(",")
        for spec in specs:
            spec = spec.strip()
            if spec:
                lines.append(f"• {spec}")
        lines.append("")
    
    # ============================================================
    # TOOLS & EQUIPMENT (Bullet Points)
    # ============================================================
    if data.get("tools_known"):
        lines.append("TOOLS & EQUIPMENT")
        lines.append("-" * 70)
        tools = data["tools_known"].split(",")
        for tool in tools:
            tool = tool.strip()
            if tool:
                lines.append(f"• {tool}")
        lines.append("")
    
    # ============================================================
    # SERVICE DETAILS
    # ============================================================
    service_details = []
    if data.get("service_type"):
        service_details.append(f"Service Type: {data['service_type']}")
    if data.get("availability"):
        service_details.append(f"Availability: {data['availability']}")
    if data.get("travel_radius"):
        service_details.append(f"Travel Radius: {data['travel_radius']}")
    
    if service_details:
        lines.append("SERVICE DETAILS")
        lines.append("-" * 70)
        for detail in service_details:
            lines.append(detail)
        lines.append("")
    
    # ============================================================
    # PROJECTS COMPLETED
    # ============================================================
    if data.get("projects_completed"):
        lines.append("PROJECTS COMPLETED")
        lines.append("-" * 70)
        lines.append(f"Successfully completed {data['projects_completed']}+ projects")
        lines.append("")
    
    # ============================================================
    # EXPECTED WAGE
    # ============================================================
    if data.get("expected_wage"):
        lines.append("COMPENSATION")
        lines.append("-" * 70)
        lines.append(f"Expected Rate: {data['expected_wage']}")
        lines.append("")
    
    # ============================================================
    # LANGUAGES
    # ============================================================
    if data.get("languages"):
        lines.append("LANGUAGES")
        lines.append("-" * 70)
        langs = data["languages"].split(",")
        lang_list = ", ".join([lang.strip() for lang in langs if lang.strip()])
        lines.append(lang_list)
        lines.append("")
    
    formatted_resume = "\n".join(lines)
    logger.info("Generated professionally formatted skilled worker resume")
    return formatted_resume


def generate_resume_pdf(formatted_resume: str, file_path: str, resume_data: Dict = None) -> str:
    """
    Generate premium PDF resume using selected template.
    
    Routes to appropriate template generator based on resume_template field:
    - 'executive': Executive Classic (default)
    - 'modern': Modern Minimal Elite
    - 'sidebar': Sidebar Professional
    - 'construction': Premium Construction Theme
    - 'compact': Recruiter Quick Scan
    
    Falls back to legacy generator if template not recognized.
    """
    try:
        # Import premium template generators
        from app.services_pdf import (
            generate_executive_pdf,
            generate_modern_pdf,
            generate_sidebar_pdf,
            generate_construction_pdf,
            generate_compact_pdf
        )
        
        # Get template selection (default to 'executive')
        template = 'executive'
        if resume_data and isinstance(resume_data, dict):
            template = resume_data.get('resume_template', 'executive')
        
        # Route to appropriate template generator
        if template == 'modern':
            return generate_modern_pdf(file_path, resume_data or {})
        elif template == 'sidebar':
            return generate_sidebar_pdf(file_path, resume_data or {})
        elif template == 'construction':
            return generate_construction_pdf(file_path, resume_data or {})
        elif template == 'compact':
            return generate_compact_pdf(file_path, resume_data or {})
        else:
            # Default to executive template
            return generate_executive_pdf(file_path, resume_data or {})
    
    except ImportError as e:
        logger.warning(f"Premium templates not available, using legacy generator: {e}")
        # Fall back to legacy generator below
    except Exception as e:
        logger.error(f"Error with premium template, falling back to legacy: {e}")
    
    # ============================================================
    # LEGACY PDF GENERATOR (Fallback)
    # ============================================================
    try:
        from reportlab.lib.colors import HexColor, white
        from reportlab.platypus import Table, TableStyle, HRFlowable, Image
        from reportlab.lib import colors
        from pathlib import Path
        
        # ============================================================
        # COLOR SCHEME
        # ============================================================
        PRIMARY_COLOR = HexColor('#1F3A5F')      # Dark navy
        ACCENT_COLOR = HexColor('#F2F2F2')       # Light grey
        TEXT_COLOR = HexColor('#333333')         # Dark charcoal
        WHITE = white
        
        # ============================================================
        # DOCUMENT SETUP
        # ============================================================
        doc = SimpleDocTemplate(
            file_path,
            pagesize=letter,
            rightMargin=40,
            leftMargin=40,
            topMargin=30,
            bottomMargin=40
        )
        
        story = []
        styles = getSampleStyleSheet()
        
        # ============================================================
        # CUSTOM STYLES
        # ============================================================
        
        # Name Style - Large, Bold, White on Dark Background
        name_style = ParagraphStyle(
            'NameStyle',
            parent=styles['Heading1'],
            fontSize=22,
            textColor=WHITE,
            spaceAfter=4,
            spaceBefore=8,
            alignment=TA_LEFT,
            fontName='Helvetica-Bold',
            leading=26
        )
        
        # Trade/Subtitle Style
        trade_style = ParagraphStyle(
            'TradeStyle',
            parent=styles['Normal'],
            fontSize=13,
            textColor=WHITE,
            spaceAfter=4,
            alignment=TA_LEFT,
            fontName='Helvetica',
            leading=16
        )
        
        # Contact Info Style (in header)
        contact_header_style = ParagraphStyle(
            'ContactHeaderStyle',
            parent=styles['Normal'],
            fontSize=9,
            textColor=WHITE,
            spaceAfter=2,
            alignment=TA_LEFT,
            fontName='Helvetica',
            leading=11
        )
        
        # Section Title Style - Bold, Colored
        section_title_style = ParagraphStyle(
            'SectionTitle',
            parent=styles['Heading2'],
            fontSize=11,
            textColor=PRIMARY_COLOR,
            spaceAfter=6,
            spaceBefore=10,
            fontName='Helvetica-Bold',
            leading=13,
            leftIndent=0
        )
        
        # Normal Text Style
        normal_style = ParagraphStyle(
            'NormalText',
            parent=styles['Normal'],
            fontSize=9,
            textColor=TEXT_COLOR,
            spaceAfter=4,
            alignment=TA_LEFT,
            fontName='Helvetica',
            leading=12
        )
        
        # Bullet Style
        bullet_style = ParagraphStyle(
            'BulletText',
            parent=styles['Normal'],
            fontSize=9,
            textColor=TEXT_COLOR,
            spaceAfter=3,
            alignment=TA_LEFT,
            fontName='Helvetica',
            leading=12,
            leftIndent=12,
            bulletIndent=3
        )
        
        # Badge Style
        badge_style = ParagraphStyle(
            'BadgeStyle',
            parent=styles['Normal'],
            fontSize=9,
            textColor=PRIMARY_COLOR,
            spaceAfter=4,
            alignment=TA_LEFT,
            fontName='Helvetica-Bold',
            leading=11
        )
        
        # ============================================================
        # BUILD HEADER SECTION WITH PROFILE PHOTO
        # ============================================================
        
        # Get data from resume_data if available
        if not resume_data:
            resume_data = {}
        
        # Check for profile photo
        profile_photo_path = resume_data.get('profile_photo')
        has_photo = False
        photo_img = None
        
        if profile_photo_path and Path(profile_photo_path).exists():
            try:
                photo_img = Image(profile_photo_path, width=1.2*inch, height=1.2*inch)
                has_photo = True
            except:
                has_photo = False
        
        # Build header content
        header_content = []
        
        # Name
        name = resume_data.get('full_name', 'Skilled Worker')
        header_content.append(Paragraph(name.upper(), name_style))
        
        # Trade and Experience
        trade_parts = []
        if resume_data.get('primary_trade'):
            trade_parts.append(resume_data['primary_trade'])
        if resume_data.get('years_of_experience'):
            trade_parts.append(f"{resume_data['years_of_experience']} Experience")
        if trade_parts:
            header_content.append(Paragraph(" | ".join(trade_parts), trade_style))
        
        # Contact info
        contact_parts = []
        phone = resume_data.get('phone_number') or resume_data.get('contact_number')
        if phone:
            contact_parts.append(f"📱 {phone}")
        
        # Location
        location_parts = []
        if resume_data.get('village_or_city'):
            location_parts.append(resume_data['village_or_city'])
        if resume_data.get('district'):
            location_parts.append(resume_data['district'])
        if resume_data.get('state'):
            location_parts.append(resume_data['state'])
        elif resume_data.get('location'):
            location_parts.append(resume_data['location'])
        
        if location_parts:
            contact_parts.append(f"📍 {', '.join(location_parts)}")
        
        # Languages
        languages = resume_data.get('languages_spoken') or resume_data.get('languages')
        if languages:
            lang_list = languages.split(',')[:3]  # First 3 languages
            contact_parts.append(f"🗣️ {', '.join([l.strip() for l in lang_list])}")
        
        for part in contact_parts:
            header_content.append(Paragraph(part, contact_header_style))
        
        # Create header table
        if has_photo:
            # Two-column layout: photo on left, info on right
            header_table_data = [[photo_img, header_content]]
            header_table = Table(header_table_data, colWidths=[1.5*inch, 5.5*inch])
            header_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), PRIMARY_COLOR),
                ('ALIGN', (0, 0), (0, 0), 'CENTER'),
                ('VALIGN', (0, 0), (0, 0), 'MIDDLE'),
                ('ALIGN', (1, 0), (1, 0), 'LEFT'),
                ('VALIGN', (1, 0), (1, 0), 'TOP'),
                ('TOPPADDING', (0, 0), (-1, -1), 12),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                ('LEFTPADDING', (0, 0), (0, 0), 15),
                ('LEFTPADDING', (1, 0), (1, 0), 15),
                ('RIGHTPADDING', (0, 0), (-1, -1), 15),
            ]))
        else:
            # Single column layout without photo
            header_table_data = [[header_content]]
            header_table = Table(header_table_data, colWidths=[7*inch])
            header_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), PRIMARY_COLOR),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('TOPPADDING', (0, 0), (-1, -1), 12),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                ('LEFTPADDING', (0, 0), (-1, -1), 20),
                ('RIGHTPADDING', (0, 0), (-1, -1), 20),
            ]))
        
        story.append(header_table)
        story.append(Spacer(1, 0.25*inch))
        
        # ============================================================
        # VERIFIED WORKER BADGE (if applicable)
        # ============================================================
        projects = resume_data.get('projects_completed', 0) or 0
        rating = resume_data.get('client_rating') or resume_data.get('average_rating') or 0
        
        if projects >= 20 and rating >= 4.0:
            badge_text = f"✓ VERIFIED WORKER | {projects}+ Projects | {rating:.1f}★ Rating"
            story.append(Paragraph(badge_text, badge_style))
            story.append(Spacer(1, 0.1*inch))
        
        # ============================================================
        # PROFESSIONAL SUMMARY
        # ============================================================
        summary = resume_data.get('professional_summary')
        if summary:
            story.append(Paragraph('PROFESSIONAL SUMMARY', section_title_style))
            story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY_COLOR, spaceAfter=6))
            story.append(Paragraph(summary, normal_style))
            story.append(Spacer(1, 0.12*inch))
        
        # ============================================================
        # WORK EXPERIENCE (Structured Bullets)
        # ============================================================
        work_exp = resume_data.get('structured_work_experience', [])
        if work_exp and isinstance(work_exp, list) and len(work_exp) > 0:
            story.append(Paragraph('PROFESSIONAL EXPERIENCE', section_title_style))
            story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY_COLOR, spaceAfter=6))
            for bullet in work_exp:
                if bullet:
                    story.append(Paragraph(f"• {bullet}", bullet_style))
            story.append(Spacer(1, 0.12*inch))
        
        # ============================================================
        # CORE SKILLS / SPECIALIZATIONS (Two-Column)
        # ============================================================
        specializations = resume_data.get('specializations')
        if specializations:
            story.append(Paragraph('CORE SKILLS', section_title_style))
            story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY_COLOR, spaceAfter=6))
            
            specs = [s.strip() for s in specializations.split(',') if s.strip()]
            
            # Create two-column layout
            spec_data = []
            for i in range(0, len(specs), 2):
                row = []
                row.append(Paragraph(f"• {specs[i]}", bullet_style))
                if i + 1 < len(specs):
                    row.append(Paragraph(f"• {specs[i + 1]}", bullet_style))
                else:
                    row.append(Paragraph('', bullet_style))
                spec_data.append(row)
            
            if spec_data:
                spec_table = Table(spec_data, colWidths=[3.3*inch, 3.3*inch])
                spec_table.setStyle(TableStyle([
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 0),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
                ]))
                story.append(spec_table)
            story.append(Spacer(1, 0.12*inch))
        
        # ============================================================
        # TOOLS & EQUIPMENT (Two-Column)
        # ============================================================
        tools = resume_data.get('tools_handled') or resume_data.get('tools_known')
        if tools:
            story.append(Paragraph('TOOLS & EQUIPMENT', section_title_style))
            story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY_COLOR, spaceAfter=6))
            
            tool_list = [t.strip() for t in tools.split(',') if t.strip()]
            
            # Create two-column layout
            tool_data = []
            for i in range(0, len(tool_list), 2):
                row = []
                row.append(Paragraph(f"• {tool_list[i]}", bullet_style))
                if i + 1 < len(tool_list):
                    row.append(Paragraph(f"• {tool_list[i + 1]}", bullet_style))
                else:
                    row.append(Paragraph('', bullet_style))
                tool_data.append(row)
            
            if tool_data:
                tool_table = Table(tool_data, colWidths=[3.3*inch, 3.3*inch])
                tool_table.setStyle(TableStyle([
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 0),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
                ]))
                story.append(tool_table)
            story.append(Spacer(1, 0.12*inch))
        
        # ============================================================
        # WORK BACKGROUND
        # ============================================================
        worked_as = resume_data.get('worked_as')
        company_name = resume_data.get('company_name')
        project_types = resume_data.get('project_types')
        
        if worked_as or company_name or project_types:
            story.append(Paragraph('WORK BACKGROUND', section_title_style))
            story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY_COLOR, spaceAfter=6))
            
            if worked_as:
                story.append(Paragraph(f"<b>Work Type:</b> {worked_as}", normal_style))
            if company_name:
                story.append(Paragraph(f"<b>Company:</b> {company_name}", normal_style))
            if project_types:
                story.append(Paragraph(f"<b>Project Types:</b> {project_types}", normal_style))
            
            story.append(Spacer(1, 0.12*inch))
        
        # ============================================================
        # SERVICE DETAILS (Styled Box)
        # ============================================================
        service_type = resume_data.get('service_type')
        availability = resume_data.get('availability')
        travel_radius = resume_data.get('travel_radius')
        expected_wage = resume_data.get('expected_wage')
        own_tools = resume_data.get('own_tools')
        own_vehicle = resume_data.get('own_vehicle')
        
        if any([service_type, availability, travel_radius, expected_wage, own_tools is not None, own_vehicle is not None]):
            story.append(Paragraph('SERVICE DETAILS', section_title_style))
            story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY_COLOR, spaceAfter=6))
            
            service_data = []
            if service_type:
                service_data.append([Paragraph(f"<b>Service Type:</b> {service_type}", normal_style)])
            if availability:
                service_data.append([Paragraph(f"<b>Availability:</b> {availability}", normal_style)])
            if travel_radius:
                service_data.append([Paragraph(f"<b>Travel Radius:</b> {travel_radius}", normal_style)])
            if expected_wage:
                service_data.append([Paragraph(f"<b>Expected Wage:</b> {expected_wage}", normal_style)])
            if own_tools is not None:
                service_data.append([Paragraph(f"<b>Own Tools:</b> {'Yes' if own_tools else 'No'}", normal_style)])
            if own_vehicle is not None:
                service_data.append([Paragraph(f"<b>Own Vehicle:</b> {'Yes' if own_vehicle else 'No'}", normal_style)])
            
            if service_data:
                service_table = Table(service_data, colWidths=[6.6*inch])
                service_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, -1), ACCENT_COLOR),
                    ('LEFTPADDING', (0, 0), (-1, -1), 12),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 12),
                    ('TOPPADDING', (0, 0), (-1, -1), 6),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ]))
                story.append(service_table)
            story.append(Spacer(1, 0.12*inch))
        
        # ============================================================
        # PROJECTS COMPLETED
        # ============================================================
        if projects:
            story.append(Paragraph('PROJECTS COMPLETED', section_title_style))
            story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY_COLOR, spaceAfter=6))
            story.append(Paragraph(f"Successfully completed <b>{projects}+</b> projects", normal_style))
            story.append(Spacer(1, 0.12*inch))
        
        # ============================================================
        # TRUST & CREDENTIALS
        # ============================================================
        reference_available = resume_data.get('reference_available')
        
        if rating or reference_available:
            story.append(Paragraph('TRUST & CREDENTIALS', section_title_style))
            story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY_COLOR, spaceAfter=6))
            
            if rating:
                story.append(Paragraph(f"<b>Client Rating:</b> {rating:.1f}/5.0 ★", normal_style))
            if reference_available:
                story.append(Paragraph(f"<b>References:</b> Available upon request", normal_style))
            
            story.append(Spacer(1, 0.12*inch))
        
        # ============================================================
        # EDUCATION & TRAINING
        # ============================================================
        education_level = resume_data.get('education_level')
        technical_training = resume_data.get('technical_training')
        
        if education_level or technical_training:
            story.append(Paragraph('EDUCATION & TRAINING', section_title_style))
            story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY_COLOR, spaceAfter=6))
            
            if education_level:
                story.append(Paragraph(f"<b>Education:</b> {education_level}", normal_style))
            if technical_training:
                story.append(Paragraph(f"<b>Technical Training:</b> {technical_training}", normal_style))
            
            story.append(Spacer(1, 0.12*inch))
        
        # ============================================================
        # LANGUAGES
        # ============================================================
        if languages:
            story.append(Paragraph('LANGUAGES', section_title_style))
            story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY_COLOR, spaceAfter=6))
            lang_list = [l.strip() for l in languages.split(',') if l.strip()]
            story.append(Paragraph(", ".join(lang_list), normal_style))
        
        # Build PDF
        doc.build(story)
        logger.info(f"Generated modern professional PDF profile at: {file_path}")
        return file_path
        
    except Exception as e:
        logger.error(f"Error generating PDF: {e}")
        raise

