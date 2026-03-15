"""
Template 3: SIDEBAR PROFESSIONAL
Contemporary two-column hiring layout
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Frame, PageTemplate, BaseDocTemplate
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT
import logging

from .base_pdf import (
    PDFColors, PDFFonts, get_photo_image, create_style,
    format_phone, format_location, format_languages,
    get_verified_badge_text, add_footer_branding, safe_get
)

logger = logging.getLogger(__name__)


def generate_sidebar_pdf(file_path: str, resume_data: dict) -> str:
    """
    Generate Sidebar Professional template PDF
    
    Features:
    - Blue vertical sidebar (25% width) on left
    - Photo at top of sidebar
    - Contact info, skills, tools, languages in sidebar
    - Main content (75% width) on right
    - Name, summary, experience, service details in main area
    - Modern recruitment profile style
    """
    try:
        # Document setup
        doc = SimpleDocTemplate(
            file_path,
            pagesize=letter,
            rightMargin=0,
            leftMargin=0,
            topMargin=0,
            bottomMargin=40
        )
        
        story = []
        styles = getSampleStyleSheet()
        
        # ============================================================
        # CUSTOM STYLES
        # ============================================================
        
        # Sidebar styles (white text on blue)
        sidebar_title_style = create_style(
            'SidebarTitle',
            styles['Heading2'],
            fontSize=10,
            textColor=PDFColors.WHITE,
            fontName=PDFFonts.BOLD,
            spaceAfter=6,
            spaceBefore=10,
            leading=12,
            alignment=TA_LEFT
        )
        
        sidebar_text_style = create_style(
            'SidebarText',
            styles['Normal'],
            fontSize=9,
            textColor=PDFColors.WHITE,
            fontName=PDFFonts.REGULAR,
            spaceAfter=3,
            alignment=TA_LEFT,
            leading=11
        )
        
        sidebar_bullet_style = create_style(
            'SidebarBullet',
            styles['Normal'],
            fontSize=9,
            textColor=PDFColors.WHITE,
            fontName=PDFFonts.REGULAR,
            spaceAfter=3,
            alignment=TA_LEFT,
            leading=11,
            leftIndent=8
        )
        
        # Main area styles
        name_style = create_style(
            'SidebarName',
            styles['Heading1'],
            fontSize=26,
            textColor=PDFColors.DARK_SLATE,
            fontName=PDFFonts.BOLD,
            spaceAfter=4,
            spaceBefore=0,
            alignment=TA_LEFT,
            leading=30
        )
        
        trade_style = create_style(
            'SidebarTrade',
            styles['Normal'],
            fontSize=13,
            textColor=PDFColors.SLATE,
            fontName=PDFFonts.REGULAR,
            spaceAfter=6,
            alignment=TA_LEFT,
            leading=16
        )
        
        section_title_style = create_style(
            'SidebarSection',
            styles['Heading2'],
            fontSize=11,
            textColor=PDFColors.NAVY,
            fontName=PDFFonts.BOLD,
            spaceAfter=6,
            spaceBefore=12,
            leading=13,
            alignment=TA_LEFT
        )
        
        normal_style = create_style(
            'SidebarNormal',
            styles['Normal'],
            fontSize=10,
            textColor=PDFColors.DARK_SLATE,
            fontName=PDFFonts.REGULAR,
            spaceAfter=4,
            alignment=TA_LEFT,
            leading=13
        )
        
        bullet_style = create_style(
            'SidebarBullet',
            styles['Normal'],
            fontSize=10,
            textColor=PDFColors.DARK_SLATE,
            fontName=PDFFonts.REGULAR,
            spaceAfter=3,
            alignment=TA_LEFT,
            leading=13,
            leftIndent=12
        )
        
        # ============================================================
        # BUILD SIDEBAR CONTENT (Left Column - 25%)
        # ============================================================
        
        sidebar_content = []
        
        # Photo at top
        photo_img = get_photo_image(safe_get(resume_data, 'profile_photo'), 1.3*inch, 1.3*inch)
        if photo_img:
            sidebar_content.append(photo_img)
            sidebar_content.append(Spacer(1, 0.15*inch))
        
        # Contact Info
        sidebar_content.append(Paragraph('CONTACT', sidebar_title_style))
        
        phone = safe_get(resume_data, 'phone_number') or safe_get(resume_data, 'contact_number')
        if phone:
            sidebar_content.append(Paragraph(format_phone(phone), sidebar_text_style))
        
        location = format_location(
            safe_get(resume_data, 'village_or_city'),
            safe_get(resume_data, 'district'),
            safe_get(resume_data, 'state'),
            safe_get(resume_data, 'location')
        )
        if location:
            sidebar_content.append(Paragraph(location, sidebar_text_style))
        
        sidebar_content.append(Spacer(1, 0.1*inch))
        
        # Languages
        languages = safe_get(resume_data, 'languages_spoken') or safe_get(resume_data, 'languages')
        if languages:
            sidebar_content.append(Paragraph('LANGUAGES', sidebar_title_style))
            lang_list = [l.strip() for l in languages.split(',') if l.strip()]
            for lang in lang_list:
                sidebar_content.append(Paragraph(f"• {lang}", sidebar_bullet_style))
            sidebar_content.append(Spacer(1, 0.1*inch))
        
        # Skills (compact list)
        specializations = safe_get(resume_data, 'specializations')
        if specializations:
            sidebar_content.append(Paragraph('SKILLS', sidebar_title_style))
            specs = [s.strip() for s in specializations.split(',') if s.strip()]
            for spec in specs[:8]:  # Limit to 8 skills in sidebar
                sidebar_content.append(Paragraph(f"• {spec}", sidebar_bullet_style))
            sidebar_content.append(Spacer(1, 0.1*inch))
        
        # Tools (compact list)
        tools = safe_get(resume_data, 'tools_handled') or safe_get(resume_data, 'tools_known')
        if tools:
            sidebar_content.append(Paragraph('TOOLS', sidebar_title_style))
            tool_list = [t.strip() for t in tools.split(',') if t.strip()]
            for tool in tool_list[:6]:  # Limit to 6 tools in sidebar
                sidebar_content.append(Paragraph(f"• {tool}", sidebar_bullet_style))
        
        # ============================================================
        # BUILD MAIN CONTENT (Right Column - 75%)
        # ============================================================
        
        main_content = []
        
        # Name and Trade
        name = safe_get(resume_data, 'full_name', default='Skilled Worker')
        main_content.append(Paragraph(name.upper(), name_style))
        
        trade_parts = []
        if safe_get(resume_data, 'primary_trade'):
            trade_parts.append(resume_data['primary_trade'])
        if safe_get(resume_data, 'years_of_experience'):
            trade_parts.append(f"{resume_data['years_of_experience']} Experience")
        if trade_parts:
            main_content.append(Paragraph(" | ".join(trade_parts), trade_style))
        
        main_content.append(Spacer(1, 0.15*inch))
        
        # Verified Badge
        badge_text = get_verified_badge_text(
            safe_get(resume_data, 'projects_completed'),
            safe_get(resume_data, 'client_rating') or safe_get(resume_data, 'average_rating')
        )
        if badge_text:
            badge_style = create_style(
                'SidebarBadge',
                styles['Normal'],
                fontSize=10,
                textColor=PDFColors.BLUE,
                fontName=PDFFonts.BOLD,
                spaceAfter=4,
                alignment=TA_LEFT,
                leading=12
            )
            main_content.append(Paragraph(badge_text, badge_style))
            main_content.append(Spacer(1, 0.1*inch))
        
        # Professional Summary
        summary = safe_get(resume_data, 'professional_summary')
        if summary:
            main_content.append(Paragraph('PROFESSIONAL SUMMARY', section_title_style))
            main_content.append(Paragraph(summary, normal_style))
            main_content.append(Spacer(1, 0.15*inch))
        
        # Work Background
        work_exp = safe_get(resume_data, 'structured_work_experience', default=[])
        if work_exp and isinstance(work_exp, list):
            main_content.append(Paragraph('WORK BACKGROUND', section_title_style))
            for bullet in work_exp:
                if bullet:
                    main_content.append(Paragraph(f"• {bullet}", bullet_style))
            main_content.append(Spacer(1, 0.15*inch))
        
        # Service Details
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
            main_content.append(Paragraph('SERVICE DETAILS', section_title_style))
            for label, value in service_items:
                main_content.append(Paragraph(f"<b>{label}:</b> {value}", normal_style))
            main_content.append(Spacer(1, 0.15*inch))
        
        # Education
        education = safe_get(resume_data, 'education_level')
        training = safe_get(resume_data, 'technical_training')
        
        if education or training:
            main_content.append(Paragraph('EDUCATION', section_title_style))
            if education:
                main_content.append(Paragraph(f"<b>Education:</b> {education}", normal_style))
            if training:
                main_content.append(Paragraph(f"<b>Technical Training:</b> {training}", normal_style))
        
        # ============================================================
        # CREATE TWO-COLUMN LAYOUT
        # ============================================================
        
        # Create table with sidebar and main content
        layout_data = [[sidebar_content, main_content]]
        layout_table = Table(layout_data, colWidths=[2*inch, 5.5*inch])
        layout_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, 0), PDFColors.NAVY),
            ('BACKGROUND', (1, 0), (1, 0), PDFColors.WHITE),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (0, 0), 15),
            ('RIGHTPADDING', (0, 0), (0, 0), 15),
            ('TOPPADDING', (0, 0), (0, 0), 20),
            ('BOTTOMPADDING', (0, 0), (0, 0), 20),
            ('LEFTPADDING', (1, 0), (1, 0), 20),
            ('RIGHTPADDING', (1, 0), (1, 0), 20),
            ('TOPPADDING', (1, 0), (1, 0), 20),
            ('BOTTOMPADDING', (1, 0), (1, 0), 20),
        ]))
        
        story.append(layout_table)
        
        # Build PDF
        doc.build(story, onFirstPage=add_footer_branding, onLaterPages=add_footer_branding)
        logger.info(f"Generated Sidebar Professional PDF at: {file_path}")
        return file_path
        
    except Exception as e:
        logger.error(f"Error generating Sidebar PDF: {e}")
        raise
