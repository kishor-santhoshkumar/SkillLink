"""
Template 1: EXECUTIVE CLASSIC
Professional, structured, authoritative corporate style
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT
import logging

from .base_pdf import (
    PDFColors, PDFFonts, get_photo_image, create_style,
    format_phone, format_location, format_languages,
    get_verified_badge_text, split_into_columns, add_footer_branding, safe_get
)

logger = logging.getLogger(__name__)


def generate_executive_pdf(file_path: str, resume_data: dict) -> str:
    """
    Generate Executive Classic template PDF
    
    Features:
    - Navy header with white text
    - Profile photo in header (left aligned)
    - Strong horizontal blue lines separating sections
    - Two-column layout for skills
    - Structured grid for service details
    - Professional, corporate feel
    """
    try:
        # Document setup
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
        
        name_style = create_style(
            'ExecutiveName',
            styles['Heading1'],
            fontSize=24,
            textColor=PDFColors.WHITE,
            fontName=PDFFonts.BOLD,
            spaceAfter=4,
            spaceBefore=8,
            alignment=TA_LEFT,
            leading=28
        )
        
        trade_style = create_style(
            'ExecutiveTrade',
            styles['Normal'],
            fontSize=13,
            textColor=PDFColors.WHITE,
            fontName=PDFFonts.REGULAR,
            spaceAfter=4,
            alignment=TA_LEFT,
            leading=16
        )
        
        contact_style = create_style(
            'ExecutiveContact',
            styles['Normal'],
            fontSize=9,
            textColor=PDFColors.WHITE,
            fontName=PDFFonts.REGULAR,
            spaceAfter=2,
            alignment=TA_LEFT,
            leading=11
        )
        
        section_title_style = create_style(
            'ExecutiveSection',
            styles['Heading2'],
            fontSize=12,
            textColor=PDFColors.NAVY,
            fontName=PDFFonts.BOLD,
            spaceAfter=6,
            spaceBefore=10,
            leading=14,
            leftIndent=0
        )
        
        normal_style = create_style(
            'ExecutiveNormal',
            styles['Normal'],
            fontSize=10,
            textColor=PDFColors.DARK_SLATE,
            fontName=PDFFonts.REGULAR,
            spaceAfter=4,
            alignment=TA_LEFT,
            leading=13
        )
        
        bullet_style = create_style(
            'ExecutiveBullet',
            styles['Normal'],
            fontSize=10,
            textColor=PDFColors.DARK_SLATE,
            fontName=PDFFonts.REGULAR,
            spaceAfter=3,
            alignment=TA_LEFT,
            leading=13,
            leftIndent=12,
            bulletIndent=3
        )
        
        badge_style = create_style(
            'ExecutiveBadge',
            styles['Normal'],
            fontSize=10,
            textColor=PDFColors.BLUE,
            fontName=PDFFonts.BOLD,
            spaceAfter=4,
            alignment=TA_LEFT,
            leading=12
        )
        
        # ============================================================
        # HEADER SECTION
        # ============================================================
        
        header_content = []
        
        # Name
        name = safe_get(resume_data, 'full_name', default='Skilled Worker')
        header_content.append(Paragraph(name.upper(), name_style))
        
        # Trade and Experience
        trade_parts = []
        if safe_get(resume_data, 'primary_trade'):
            trade_parts.append(resume_data['primary_trade'])
        if safe_get(resume_data, 'years_of_experience'):
            trade_parts.append(f"{resume_data['years_of_experience']} Experience")
        if trade_parts:
            header_content.append(Paragraph(" | ".join(trade_parts), trade_style))
        
        # Contact info
        phone = safe_get(resume_data, 'phone_number') or safe_get(resume_data, 'contact_number')
        if phone:
            header_content.append(Paragraph(format_phone(phone), contact_style))
        
        location = format_location(
            safe_get(resume_data, 'village_or_city'),
            safe_get(resume_data, 'district'),
            safe_get(resume_data, 'state'),
            safe_get(resume_data, 'location')
        )
        if location:
            header_content.append(Paragraph(location, contact_style))
        
        languages = format_languages(
            safe_get(resume_data, 'languages_spoken'),
            safe_get(resume_data, 'languages')
        )
        if languages:
            header_content.append(Paragraph(languages, contact_style))
        
        # Create header table with photo
        photo_img = get_photo_image(safe_get(resume_data, 'profile_photo'), 1.2*inch, 1.2*inch)
        
        if photo_img:
            header_table = Table([[photo_img, header_content]], colWidths=[1.5*inch, 5.5*inch])
            header_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), PDFColors.NAVY),
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
            header_table = Table([[header_content]], colWidths=[7*inch])
            header_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), PDFColors.NAVY),
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
        # VERIFIED BADGE
        # ============================================================
        badge_text = get_verified_badge_text(
            safe_get(resume_data, 'projects_completed'),
            safe_get(resume_data, 'client_rating') or safe_get(resume_data, 'average_rating')
        )
        if badge_text:
            story.append(Paragraph(badge_text, badge_style))
            story.append(Spacer(1, 0.1*inch))
        
        # ============================================================
        # PROFESSIONAL SUMMARY
        # ============================================================
        summary = safe_get(resume_data, 'professional_summary')
        if summary:
            story.append(Paragraph('PROFESSIONAL SUMMARY', section_title_style))
            story.append(HRFlowable(width="100%", thickness=2, color=PDFColors.BLUE, spaceAfter=6))
            story.append(Paragraph(summary, normal_style))
            story.append(Spacer(1, 0.15*inch))
        
        # ============================================================
        # WORK EXPERIENCE
        # ============================================================
        work_exp = safe_get(resume_data, 'structured_work_experience', default=[])
        if work_exp and isinstance(work_exp, list):
            story.append(Paragraph('PROFESSIONAL EXPERIENCE', section_title_style))
            story.append(HRFlowable(width="100%", thickness=2, color=PDFColors.BLUE, spaceAfter=6))
            for bullet in work_exp:
                if bullet:
                    story.append(Paragraph(f"• {bullet}", bullet_style))
            story.append(Spacer(1, 0.15*inch))
        
        # ============================================================
        # SKILLS & EXPERTISE (Two-Column)
        # ============================================================
        specializations = safe_get(resume_data, 'specializations')
        if specializations:
            story.append(Paragraph('SKILLS & EXPERTISE', section_title_style))
            story.append(HRFlowable(width="100%", thickness=2, color=PDFColors.BLUE, spaceAfter=6))
            
            specs = [s.strip() for s in specializations.split(',') if s.strip()]
            spec_rows = split_into_columns(specs, 2)
            
            spec_data = []
            for row in spec_rows:
                spec_data.append([
                    Paragraph(f"• {row[0]}", bullet_style) if row[0] else Paragraph('', bullet_style),
                    Paragraph(f"• {row[1]}", bullet_style) if row[1] else Paragraph('', bullet_style)
                ])
            
            if spec_data:
                spec_table = Table(spec_data, colWidths=[3.3*inch, 3.3*inch])
                spec_table.setStyle(TableStyle([
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 0),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
                ]))
                story.append(spec_table)
            story.append(Spacer(1, 0.15*inch))
        
        # ============================================================
        # TOOLS & EQUIPMENT (Two-Column)
        # ============================================================
        tools = safe_get(resume_data, 'tools_handled') or safe_get(resume_data, 'tools_known')
        if tools:
            story.append(Paragraph('TOOLS & EQUIPMENT', section_title_style))
            story.append(HRFlowable(width="100%", thickness=2, color=PDFColors.BLUE, spaceAfter=6))
            
            tool_list = [t.strip() for t in tools.split(',') if t.strip()]
            tool_rows = split_into_columns(tool_list, 2)
            
            tool_data = []
            for row in tool_rows:
                tool_data.append([
                    Paragraph(f"• {row[0]}", bullet_style) if row[0] else Paragraph('', bullet_style),
                    Paragraph(f"• {row[1]}", bullet_style) if row[1] else Paragraph('', bullet_style)
                ])
            
            if tool_data:
                tool_table = Table(tool_data, colWidths=[3.3*inch, 3.3*inch])
                tool_table.setStyle(TableStyle([
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 0),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
                ]))
                story.append(tool_table)
            story.append(Spacer(1, 0.15*inch))
        
        # ============================================================
        # SERVICE DETAILS (Grid Box)
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
            story.append(HRFlowable(width="100%", thickness=2, color=PDFColors.BLUE, spaceAfter=6))
            
            service_data = []
            for label, value in service_items:
                service_data.append([
                    Paragraph(f"<b>{label}:</b> {value}", normal_style)
                ])
            
            service_table = Table(service_data, colWidths=[6.6*inch])
            service_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), PDFColors.LIGHT_GREY),
                ('LEFTPADDING', (0, 0), (-1, -1), 12),
                ('RIGHTPADDING', (0, 0), (-1, -1), 12),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ]))
            story.append(service_table)
            story.append(Spacer(1, 0.15*inch))
        
        # ============================================================
        # EDUCATION & TRAINING
        # ============================================================
        education = safe_get(resume_data, 'education_level')
        training = safe_get(resume_data, 'technical_training')
        
        if education or training:
            story.append(Paragraph('EDUCATION & TRAINING', section_title_style))
            story.append(HRFlowable(width="100%", thickness=2, color=PDFColors.BLUE, spaceAfter=6))
            
            if education:
                story.append(Paragraph(f"<b>Education:</b> {education}", normal_style))
            if training:
                story.append(Paragraph(f"<b>Technical Training:</b> {training}", normal_style))
            
            story.append(Spacer(1, 0.15*inch))
        
        # Build PDF
        doc.build(story, onFirstPage=add_footer_branding, onLaterPages=add_footer_branding)
        logger.info(f"Generated Executive Classic PDF at: {file_path}")
        return file_path
        
    except Exception as e:
        logger.error(f"Error generating Executive PDF: {e}")
        raise
