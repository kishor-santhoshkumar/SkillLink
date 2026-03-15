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
    Calculate skilled worker profile quality score.
    
    Scoring logic for skilled workers:
    - +15 if full_name exists
    - +20 if primary_trade exists
    - +15 if years_of_experience exists
    - +15 if specializations exist
    - +10 if contact_number exists
    - +10 if location exists
    - +10 if projects_completed exists
    - +5 if service_type exists
    """
    score = 0
    feedback_parts = []
    
    if data.get("full_name"):
        score += 15
    else:
        feedback_parts.append("Add your full name")
    
    if data.get("primary_trade"):
        score += 20
    else:
        feedback_parts.append("Specify your primary trade")
    
    if data.get("years_of_experience"):
        score += 15
    else:
        feedback_parts.append("Add years of experience")
    
    if data.get("specializations"):
        score += 15
    else:
        feedback_parts.append("List your specializations")
    
    if data.get("contact_number"):
        score += 10
    else:
        feedback_parts.append("Add phone number")
    
    if data.get("location"):
        score += 10
    else:
        feedback_parts.append("Add your location")
    
    if data.get("projects_completed"):
        score += 10
    else:
        feedback_parts.append("Mention projects completed")
    
    if data.get("service_type"):
        score += 5
    
    # Generate feedback
    if score >= 90:
        feedback = "Excellent! Your profile is complete and professional."
    elif score >= 70:
        feedback = f"Good profile! Consider adding: {', '.join(feedback_parts[:2])}"
    elif score >= 50:
        feedback = f"Decent start. Please add: {', '.join(feedback_parts[:3])}"
    else:
        feedback = f"Profile needs improvement. Missing: {', '.join(feedback_parts)}"
    
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
        # AI prompt tailored for skilled workers
        system_prompt = """You are an AI assistant specialized in extracting information from skilled worker profiles.

Your job:
1. Understand the input (it may be in English, Tamil, Hindi, or mixed languages).
2. Translate it internally to English if needed.
3. Extract information about skilled workers like carpenters, plumbers, electricians, mechanics, etc.

Extract the following fields:
- full_name: Worker's full name
- contact_number: Phone/mobile number
- primary_trade: Main trade (Carpenter, Plumber, Electrician, Mechanic, Mason, Painter, Welder, etc.)
- years_of_experience: Years of experience (e.g., "3 years" or "Fresher")
- specializations: Specific skills within the trade (e.g., "pipe fitting, bathroom installation" for plumber)
- service_type: Type of service (daily wage, contract, per project, hourly)
- availability: Availability (full-time, part-time, weekends)
- travel_radius: How far they can travel (5km, 10km, 20km, city-wide, anywhere)
- projects_completed: Estimated number of projects completed
- tools_known: Tools and equipment they know how to use
- expected_wage: Expected wage or rate (if mentioned)
- location: City or area
- languages: Languages known (comma-separated)
- professional_summary: A brief 2-3 sentence summary in professional English
- confidence_score: Your confidence in the extraction accuracy (0-100)

CRITICAL RULES:
- Always return ONLY valid JSON.
- Do not add explanations, markdown, or extra text.
- If a field is missing or not found, return null.
- Translate all content to professional English.
- Focus on practical skills, not academic qualifications.

Output format (strict JSON):
{
  "full_name": "",
  "contact_number": "",
  "primary_trade": "",
  "years_of_experience": "",
  "specializations": "",
  "service_type": "",
  "availability": "",
  "travel_radius": "",
  "projects_completed": 0,
  "tools_known": "",
  "expected_wage": "",
  "location": "",
  "languages": "",
  "professional_summary": "",
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
                "full_name": structured_data.get("full_name"),
                "contact_number": structured_data.get("contact_number"),
                "primary_trade": structured_data.get("primary_trade"),
                "years_of_experience": structured_data.get("years_of_experience"),
                "specializations": structured_data.get("specializations"),
                "service_type": structured_data.get("service_type"),
                "availability": structured_data.get("availability"),
                "travel_radius": structured_data.get("travel_radius"),
                "projects_completed": structured_data.get("projects_completed"),
                "tools_known": structured_data.get("tools_known"),
                "expected_wage": structured_data.get("expected_wage"),
                "location": structured_data.get("location"),
                "languages": structured_data.get("languages"),
                "professional_summary": structured_data.get("professional_summary")
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
        "full_name": None,
        "contact_number": None,
        "primary_trade": None,
        "years_of_experience": None,
        "specializations": None,
        "service_type": None,
        "availability": None,
        "travel_radius": None,
        "projects_completed": None,
        "tools_known": None,
        "expected_wage": None,
        "location": None,
        "languages": None,
        "professional_summary": None
    }
    
    # Extract name
    name_match = re.search(r"(?:my name is|i am|name:?)\s+([A-Za-z\s]+?)(?:\.|,|\n|and|$)", raw_input, re.IGNORECASE)
    if name_match:
        result["full_name"] = name_match.group(1).strip()
    
    # Extract phone
    phone_match = re.search(r"[\+\d][\d\s\-\(\)]{8,}", raw_input)
    if phone_match:
        result["contact_number"] = phone_match.group(0).strip()
    
    # Extract trade
    trades = ["carpenter", "plumber", "electrician", "mechanic", "mason", "painter", "welder"]
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
        result["location"] = loc_match.group(1).strip()
    
    result["professional_summary"] = f"Skilled {result['primary_trade'] or 'worker'} with {result['years_of_experience'] or 'experience'}."
    
    return result


def generate_formatted_resume(data: Dict[str, Optional[str]]) -> str:
    """Generate professionally formatted skilled worker profile text."""
    lines = []
    
    # Header - Full Name
    if data.get("full_name"):
        lines.append("=" * 60)
        lines.append(data["full_name"].upper().center(60))
        lines.append("=" * 60)
        lines.append("")
    
    # Trade and Experience
    header_parts = []
    if data.get("primary_trade"):
        header_parts.append(data["primary_trade"])
    if data.get("years_of_experience"):
        header_parts.append(f"{data['years_of_experience']} Experience")
    
    if header_parts:
        lines.append(" | ".join(header_parts).center(60))
        lines.append("")
    
    # Contact Information
    contact_info = []
    if data.get("location"):
        contact_info.append(f"📍 Location: {data['location']}")
    if data.get("contact_number"):
        contact_info.append(f"📱 Phone: {data['contact_number']}")
    if data.get("languages"):
        contact_info.append(f"🌐 Languages: {data['languages']}")
    
    if contact_info:
        for info in contact_info:
            lines.append(info)
        lines.append("")
        lines.append("-" * 60)
        lines.append("")
    
    # Services Offered
    if data.get("specializations"):
        lines.append("SERVICES OFFERED")
        lines.append("-" * 60)
        for spec in data["specializations"].split(","):
            lines.append(f"• {spec.strip()}")
        lines.append("")
    
    # Experience Summary
    if data.get("professional_summary"):
        lines.append("EXPERIENCE")
        lines.append("-" * 60)
        lines.append(data["professional_summary"])
        lines.append("")
    
    # Service Details
    service_details = []
    if data.get("service_type"):
        service_details.append(f"Service Type: {data['service_type']}")
    if data.get("availability"):
        service_details.append(f"Availability: {data['availability']}")
    if data.get("travel_radius"):
        service_details.append(f"Travel Radius: {data['travel_radius']}")
    
    if service_details:
        lines.append("SERVICE DETAILS")
        lines.append("-" * 60)
        for detail in service_details:
            lines.append(detail)
        lines.append("")
    
    # Projects Completed
    if data.get("projects_completed"):
        lines.append("PROJECTS COMPLETED")
        lines.append("-" * 60)
        lines.append(f"{data['projects_completed']} projects")
        lines.append("")
    
    # Tools Known
    if data.get("tools_known"):
        lines.append("TOOLS KNOWN")
        lines.append("-" * 60)
        lines.append(data["tools_known"])
        lines.append("")
    
    # Expected Wage
    if data.get("expected_wage"):
        lines.append("EXPECTED WAGE")
        lines.append("-" * 60)
        lines.append(data["expected_wage"])
        lines.append("")
    
    formatted_resume = "\n".join(lines)
    logger.info("Generated formatted skilled worker profile")
    return formatted_resume


def generate_resume_pdf(formatted_resume: str, file_path: str, resume_data: Dict = None) -> str:
    """Generate a PDF file from formatted skilled worker profile."""
    try:
        doc = SimpleDocTemplate(
            file_path,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18
        )
        
        story = []
        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor='#2C3E50',
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=14,
            textColor='#34495E',
            spaceAfter=12,
            spaceBefore=12,
            fontName='Helvetica-Bold'
        )
        
        normal_style = ParagraphStyle(
            'CustomNormal',
            parent=styles['Normal'],
            fontSize=11,
            spaceAfter=6,
            alignment=TA_LEFT
        )
        
        # Parse and add content
        lines = formatted_resume.split('\n')
        
        for line in lines:
            line = line.strip()
            
            if not line:
                story.append(Spacer(1, 0.2 * inch))
                continue
            
            if line.startswith('==='):
                continue
            elif line.isupper() and len(line) > 10 and '=' not in line and '-' not in line:
                story.append(Paragraph(line, title_style))
                story.append(Spacer(1, 0.3 * inch))
            elif line.isupper() and len(line) < 30:
                story.append(Spacer(1, 0.2 * inch))
                story.append(Paragraph(line, heading_style))
            elif line.startswith('---'):
                continue
            else:
                story.append(Paragraph(line, normal_style))
        
        doc.build(story)
        logger.info(f"Generated PDF profile at: {file_path}")
        return file_path
        
    except Exception as e:
        logger.error(f"Error generating PDF: {e}")
        raise
