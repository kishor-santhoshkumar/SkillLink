"""
Template 2: MODERN MINIMAL ELITE
Elegant, airy, minimalistic design
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import logging

from .base_pdf import (
    PDFColors, PDFFonts, get_photo_image, create_style,
    format_phone, format_location, format_languages,
    get_verified_badge_text, add_footer_branding, safe_get
)

logger = logging.getLogger(__name__)


def generate_modern_pdf(file_path: str, resume_data: dict) -> str:
    """
    Generate Modern Minimal Elite template PDF
    
    Features:
    - Centered header with thin blue underline
    - Large whitespace
    - Light grey section titles
    - Soft blue accent icons
    - Tag-style rounded pills for skills
    - Timeline style for experience
    - High-end resume builder style
    """
    try:
        # Document setup
        doc = SimpleDocTemplate(
            file_path,
            pagesize=letter,
            rightMargin=50,
            leftMargin=50,
            topMargin=40,
            bottomMargin=40
        )
        
        story = []
        styles = getSampleStyleSheet()
        
        # ============================================================
        # CUSTOM STYLES
        # ============================================================
        
        name_style = create_style(
            'ModernName',
            styles['Heading1'],
            fontSize=32,
            textColor=PDFColors.DARK_SLATE,
            fontName=PDFFonts.REGULAR,
            spaceAfter=6,
            spaceBefore=0,
            alignment=TA_CENTER,
            leading=36
        )
        
        trade_style = create_style(
            'ModernTrade',
            styles['Normal'],
            fontSize=12,
            textColor=PDFColors.SLATE,
            fontName=PDFFonts.REGULAR,
            spaceAfter=4,
            alignment=TA_CENTER,
            leading=15
        )
        
        contact_style = create_style(
            'ModernContact',
            styles['Normal'],
            fontSize=10,
            textColor=PDFColors.SLATE,
            fontName=PDFFonts.REGULAR,
            spaceAfter=2,
            alignment=TA_CENTER,
            leading=13
        )
        
        section_title_style = create_style(
            'ModernSection',
            styles['Heading2'],
            fontSize=11,
            textColor=PDFColors.GREY,
            fontName=PDFFonts.BOLD,
            spaceAfter=8,
            spaceBefore=12,
            leading=13,
            alignment=TA_LEFT
        )
        
        normal_style = create_style(
            'ModernNormal',
            styles['Normal'],
            fontSize=10,
            textColor=PDFColors.SLATE,
            fontName=PDFFonts.REGULAR,
            spaceAfter=5,
            alignment=TA_LEFT,
            leading=14
        )
        
        bullet_style = create_style(
            'ModernBullet',
            styles['Normal'],
            fontSize=10,
            textColor=PDFColors.SLATE,
            fontName=PDFFonts.REGULAR,
            spaceAfter=4,
            alignment=TA_LEFT,
            leading=14,
            leftIndent=15
        )
        
        pill_style = create_style(
            'ModernPill',
            styles['Normal'],
            fontSize=9,
            textColor=PDFColors.BLUE,
            fontName=PDFFonts.REGULAR,
            spaceAfter=3,
            alignment=TA_CENTER,
            leading=11
        )
        
        timeline_style = create_style(
            'ModernTimeline',
            styles['Normal'],
            fontSize=10,
            textColor=PDFColors.SLATE,
            fontName=PDFFonts.REGULAR,
            spaceAfter=4,
            alignment=TA_LEFT,
            leading=14,
            leftIndent=20
        )
        
        # ============================================================
        # HEADER SECTION (Centered)
        # ============================================================
        
        # Photo at top (centered) if available
        photo_img = get_photo_image(safe_get(resume_data, 'profile_photo'), 1.2*inch, 1.2*inch)
        if photo_img:
            # Center the photo
            photo_table = Table([[photo_img]], colWidths=[1.2*inch])
            photo_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (0, 0), 'CENTER'),
                ('VALIGN', (0, 0), (0, 0), 'MIDDLE'),
            ]))
            story.append(photo_table)
            story.append(Spacer(1, 0.15*inch))
        
        # Name
        name = safe_get(resume_data, 'full_name', default='Skilled Worker')
        story.append(Paragraph(name.upper(), name_style))
        
        # Thin blue underline
        story.append(HRFlowable(width="30%", thickness=1, color=PDFColors.BLUE, spaceAfter=8, spaceBefore=0))
        
        # Trade and Experience
        trade_parts = []
        if safe_get(resume_data, 'primary_trade'):
            trade_parts.append(resume_data['primary_trade'])
        if safe_get(resume_data, 'years_of_experience'):
            trade_parts.append(f"{resume_data['years_of_experience']}")
        if trade_parts:
            story.append(Paragraph(" • ".join(trade_parts), trade_style))
        
        # Contact info (one line)
        contact_parts = []
        phone = safe_get(resume_data, 'phone_number') or safe_get(resume_data, 'contact_number')
        if phone:
            contact_parts.append(format_phone(phone))
        
        location = format_location(
            safe_get(resume_data, 'village_or_city'),
            safe_get(resume_data, 'district'),
            safe_get(resume_data, 'state'),
            safe_get(resume_data, 'location')
        )
        if location:
            contact_parts.append(location)
        
        if contact_parts:
            story.append(Paragraph(" • ".join(contact_parts), contact_style))
        
        story.append(Spacer(1, 0.3*inch))
        
        # ============================================================
        # VERIFIED BADGE
        # ============================================================
        badge_text = get_verified_badge_text(
            safe_get(resume_data, 'projects_completed'),
            safe_get(resume_data, 'client_rating') or safe_get(resume_data, 'average_rating')
        )
        if badge_text:
            badge_style = create_style(
                'ModernBadge',
                styles['Normal'],
                fontSize=10,
                textColor=PDFColors.BLUE,
                fontName=PDFFonts.BOLD,
                spaceAfter=4,
                alignment=TA_CENTER,
                leading=12
            )
            story.append(Paragraph(badge_text, badge_style))
            story.append(Spacer(1, 0.15*inch))
        
        # ============================================================
        # PROFESSIONAL SUMMARY
        # ============================================================
        summary = safe_get(resume_data, 'professional_summary')
        if summary:
            story.append(Paragraph('PROFESSIONAL SUMMARY', section_title_style))
            story.append(Paragraph(summary, normal_style))
            story.append(Spacer(1, 0.2*inch))
        
        # ============================================================
        # CORE COMPETENCIES (Pill Style)
        # ============================================================
        specializations = safe_get(resume_data, 'specializations')
        if specializations:
            story.append(Paragraph('CORE COMPETENCIES', section_title_style))
            
            specs = [s.strip() for s in specializations.split(',') if s.strip()]
            
            # Create pill-style layout (3 columns)
            pill_data = []
            for i in range(0, len(specs), 3):
                row = []
                for j in range(3):
                    if i + j < len(specs):
                        pill_text = f"<para align='center'>{specs[i + j]}</para>"
                        row.append(Paragraph(pill_text, pill_style))
                    else:
                        row.append(Paragraph('', pill_style))
                pill_data.append(row)
            
            if pill_data:
                pill_table = Table(pill_data, colWidths=[2.1*inch, 2.1*inch, 2.1*inch])
                pill_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, -1), PDFColors.LIGHT_BLUE),
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 8),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
                    ('TOPPADDING', (0, 0), (-1, -1), 6),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                    ('GRID', (0, 0), (-1, -1), 0.5, PDFColors.BORDER_GREY),
                ]))
                story.append(pill_table)
            story.append(Spacer(1, 0.2*inch))
        
        # ============================================================
        # EXPERIENCE TIMELINE
        # ============================================================
        work_exp = safe_get(resume_data, 'structured_work_experience', default=[])
        if work_exp and isinstance(work_exp, list):
            story.append(Paragraph('EXPERIENCE TIMELINE', section_title_style))
            
            for bullet in work_exp:
                if bullet:
                    # Add vertical line indicator effect with bullet
                    story.append(Paragraph(f"│ {bullet}", timeline_style))
            
            story.append(Spacer(1, 0.2*inch))
        
        # ============================================================
        # TOOLS & EQUIPMENT
        # ============================================================
        tools = safe_get(resume_data, 'tools_handled') or safe_get(resume_data, 'tools_known')
        if tools:
            story.append(Paragraph('TOOLS & EQUIPMENT', section_title_style))
            
            tool_list = [t.strip() for t in tools.split(',') if t.strip()]
            for tool in tool_list:
                story.append(Paragraph(f"• {tool}", bullet_style))
            
            story.append(Spacer(1, 0.2*inch))
        
        # ============================================================
        # SERVICE DETAILS
        # ============================================================
        service_items = []
        if safe_get(resume_data, 'service_type'):
            service_items.append(('Service Type', resume_data['service_type']))
        if safe_get(resume_data, 'availability'):
            service_items.append(('Availability', resume_data['availability']))
        if safe_get(resume_data, 'travel_radius'):
            service_items.append(('Travel Radius', resume_data['travel_radius']))
        if safe_get(resume_data, 'expected_wage'):
            service_items.append(('Expected Wage', resume_data['expected_wage']))
        if safe_get(resume_data, 'own_tools') is not None:
            service_items.append(('Own Tools', 'Yes' if resume_data['own_tools'] else 'No'))
        if safe_get(resume_data, 'own_vehicle') is not None:
            service_items.append(('Own Vehicle', 'Yes' if resume_data['own_vehicle'] else 'No'))
        
        if service_items:
            story.append(Paragraph('SERVICE DETAILS', section_title_style))
            
            for label, value in service_items:
                story.append(Paragraph(f"<b>{label}:</b> {value}", normal_style))
            
            story.append(Spacer(1, 0.2*inch))
        
        # ============================================================
        # EDUCATION & TRAINING
        # ============================================================
        education = safe_get(resume_data, 'education_level')
        training = safe_get(resume_data, 'technical_training')
        
        if education or training:
            story.append(Paragraph('EDUCATION & TRAINING', section_title_style))
            
            if education:
                story.append(Paragraph(f"<b>Education:</b> {education}", normal_style))
            if training:
                story.append(Paragraph(f"<b>Technical Training:</b> {training}", normal_style))
            
            story.append(Spacer(1, 0.2*inch))
        
        # ============================================================
        # LANGUAGES
        # ============================================================
        languages = safe_get(resume_data, 'languages_spoken') or safe_get(resume_data, 'languages')
        if languages:
            story.append(Paragraph('LANGUAGES', section_title_style))
            lang_list = [l.strip() for l in languages.split(',') if l.strip()]
            story.append(Paragraph(", ".join(lang_list), normal_style))
        
        # Build PDF
        doc.build(story, onFirstPage=add_footer_branding, onLaterPages=add_footer_branding)
        logger.info(f"Generated Modern Minimal Elite PDF at: {file_path}")
        return file_path
        
    except Exception as e:
        logger.error(f"Error generating Modern PDF: {e}")
        raise
