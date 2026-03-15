"""
Template 5: RECRUITER QUICK SCAN (Compact Elite)
Efficient, sharp, optimized for 1 page
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT
import logging

from .base_pdf import (
    PDFColors, PDFFonts, create_style,
    format_phone, format_location,
    get_verified_badge_text, add_footer_branding, safe_get
)

logger = logging.getLogger(__name__)


def generate_compact_pdf(file_path: str, resume_data: dict) -> str:
    """
    Generate Recruiter Quick Scan template PDF
    
    Features:
    - Compact inline header (name + trade on one line)
    - Tight spacing throughout
    - Skills in 3-column grid with pipe separators
    - Service details inline
    - Optimized for quick scanning
    - HR-friendly layout
    - Efficient one-page design
    """
    try:
        # Document setup with tighter margins
        doc = SimpleDocTemplate(
            file_path,
            pagesize=letter,
            rightMargin=40,
            leftMargin=40,
            topMargin=30,
            bottomMargin=35
        )
        
        story = []
        styles = getSampleStyleSheet()
        
        # ============================================================
        # CUSTOM STYLES (Compact)
        # ============================================================
        
        header_style = create_style(
            'CompactHeader',
            styles['Heading1'],
            fontSize=20,
            textColor=PDFColors.DARK_SLATE,
            fontName=PDFFonts.BOLD,
            spaceAfter=3,
            spaceBefore=0,
            alignment=TA_LEFT,
            leading=24
        )
        
        subheader_style = create_style(
            'CompactSubheader',
            styles['Normal'],
            fontSize=10,
            textColor=PDFColors.SLATE,
            fontName=PDFFonts.REGULAR,
            spaceAfter=2,
            alignment=TA_LEFT,
            leading=12
        )
        
        section_title_style = create_style(
            'CompactSection',
            styles['Heading2'],
            fontSize=10,
            textColor=PDFColors.NAVY,
            fontName=PDFFonts.BOLD,
            spaceAfter=4,
            spaceBefore=8,
            leading=12,
            alignment=TA_LEFT
        )
        
        normal_style = create_style(
            'CompactNormal',
            styles['Normal'],
            fontSize=9,
            textColor=PDFColors.DARK_SLATE,
            fontName=PDFFonts.REGULAR,
            spaceAfter=3,
            alignment=TA_LEFT,
            leading=11
        )
        
        inline_style = create_style(
            'CompactInline',
            styles['Normal'],
            fontSize=9,
            textColor=PDFColors.SLATE,
            fontName=PDFFonts.REGULAR,
            spaceAfter=2,
            alignment=TA_LEFT,
            leading=11
        )
        
        # ============================================================
        # INLINE HEADER
        # ============================================================
        
        # Photo (small, inline) if available
        photo_img = get_photo_image(safe_get(resume_data, 'profile_photo'), 0.8*inch, 0.8*inch)
        
        # Name + Trade on one line (with photo if available)
        name = safe_get(resume_data, 'full_name', default='Skilled Worker')
        trade = safe_get(resume_data, 'primary_trade', default='')
        
        if trade:
            header_text = f"{name.upper()} • {trade}"
        else:
            header_text = name.upper()
        
        # Create header with photo if available
        if photo_img:
            header_content = [
                [photo_img, Paragraph(header_text, header_style)]
            ]
            header_table = Table(header_content, colWidths=[1*inch, 5.5*inch])
            header_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (0, 0), 'LEFT'),
                ('VALIGN', (0, 0), (0, 0), 'MIDDLE'),
                ('ALIGN', (1, 0), (1, 0), 'LEFT'),
                ('VALIGN', (1, 0), (1, 0), 'MIDDLE'),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('RIGHTPADDING', (0, 0), (0, 0), 10),
            ]))
            story.append(header_table)
        else:
            story.append(Paragraph(header_text, header_style))
        
        # Contact info + Experience on one line
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
        
        if safe_get(resume_data, 'years_of_experience'):
            contact_parts.append(f"{resume_data['years_of_experience']}")
        
        if contact_parts:
            story.append(Paragraph(" • ".join(contact_parts), subheader_style))
        
        story.append(HRFlowable(width="100%", thickness=1, color=PDFColors.BORDER_GREY, spaceAfter=6, spaceBefore=2))
        
        # ============================================================
        # VERIFIED BADGE (Compact)
        # ============================================================
        badge_text = get_verified_badge_text(
            safe_get(resume_data, 'projects_completed'),
            safe_get(resume_data, 'client_rating') or safe_get(resume_data, 'average_rating')
        )
        if badge_text:
            badge_style = create_style(
                'CompactBadge',
                styles['Normal'],
                fontSize=9,
                textColor=PDFColors.BLUE,
                fontName=PDFFonts.BOLD,
                spaceAfter=3,
                alignment=TA_LEFT,
                leading=11
            )
            story.append(Paragraph(badge_text, badge_style))
            story.append(Spacer(1, 0.05*inch))
        
        # ============================================================
        # SUMMARY (Compact)
        # ============================================================
        summary = safe_get(resume_data, 'professional_summary')
        if summary:
            story.append(Paragraph('SUMMARY', section_title_style))
            story.append(Paragraph(summary, normal_style))
            story.append(Spacer(1, 0.08*inch))
        
        # ============================================================
        # SKILLS (3-Column Grid with Pipes)
        # ============================================================
        specializations = safe_get(resume_data, 'specializations')
        if specializations:
            story.append(Paragraph('SKILLS', section_title_style))
            
            specs = [s.strip() for s in specializations.split(',') if s.strip()]
            
            # Create 3-column layout with pipe separators
            skill_rows = []
            for i in range(0, len(specs), 3):
                row_items = []
                for j in range(3):
                    if i + j < len(specs):
                        row_items.append(specs[i + j])
                    else:
                        row_items.append('')
                
                # Join with pipes
                row_text = " | ".join([item for item in row_items if item])
                skill_rows.append(Paragraph(row_text, inline_style))
            
            for row in skill_rows:
                story.append(row)
            
            story.append(Spacer(1, 0.08*inch))
        
        # ============================================================
        # EXPERIENCE (Inline Format)
        # ============================================================
        work_exp = safe_get(resume_data, 'structured_work_experience', default=[])
        if work_exp and isinstance(work_exp, list):
            story.append(Paragraph('EXPERIENCE', section_title_style))
            
            # Show first 3 bullets only for compact layout
            for bullet in work_exp[:3]:
                if bullet:
                    story.append(Paragraph(f"• {bullet}", normal_style))
            
            story.append(Spacer(1, 0.08*inch))
        
        # ============================================================
        # SERVICE (Inline Grid)
        # ============================================================
        service_parts = []
        if safe_get(resume_data, 'service_type'):
            service_parts.append(resume_data['service_type'])
        if safe_get(resume_data, 'availability'):
            service_parts.append(resume_data['availability'])
        if safe_get(resume_data, 'own_tools'):
            service_parts.append('Own tools')
        if safe_get(resume_data, 'travel_radius'):
            service_parts.append(resume_data['travel_radius'])
        
        if service_parts:
            story.append(Paragraph('SERVICE', section_title_style))
            service_text = " • ".join(service_parts)
            story.append(Paragraph(service_text, inline_style))
            story.append(Spacer(1, 0.08*inch))
        
        # ============================================================
        # TOOLS (Inline Format)
        # ============================================================
        tools = safe_get(resume_data, 'tools_handled') or safe_get(resume_data, 'tools_known')
        if tools:
            story.append(Paragraph('TOOLS', section_title_style))
            
            tool_list = [t.strip() for t in tools.split(',') if t.strip()]
            
            # Create 3-column layout with pipes
            tool_rows = []
            for i in range(0, len(tool_list), 3):
                row_items = []
                for j in range(3):
                    if i + j < len(tool_list):
                        row_items.append(tool_list[i + j])
                    else:
                        row_items.append('')
                
                row_text = " | ".join([item for item in row_items if item])
                tool_rows.append(Paragraph(row_text, inline_style))
            
            for row in tool_rows[:2]:  # Limit to 2 rows for compact layout
                story.append(row)
            
            story.append(Spacer(1, 0.08*inch))
        
        # ============================================================
        # WORK BACKGROUND (Compact)
        # ============================================================
        worked_as = safe_get(resume_data, 'worked_as')
        projects = safe_get(resume_data, 'projects_completed')
        
        if worked_as or projects:
            story.append(Paragraph('BACKGROUND', section_title_style))
            
            bg_parts = []
            if safe_get(resume_data, 'years_of_experience'):
                bg_parts.append(resume_data['years_of_experience'])
            if projects:
                bg_parts.append(f"{projects}+ projects")
            if worked_as:
                bg_parts.append(worked_as)
            
            if bg_parts:
                story.append(Paragraph(" • ".join(bg_parts), inline_style))
                story.append(Spacer(1, 0.08*inch))
        
        # ============================================================
        # EDUCATION (Compact)
        # ============================================================
        education = safe_get(resume_data, 'education_level')
        training = safe_get(resume_data, 'technical_training')
        
        if education or training:
            story.append(Paragraph('EDUCATION', section_title_style))
            
            edu_parts = []
            if education:
                edu_parts.append(education)
            if training:
                edu_parts.append(training)
            
            if edu_parts:
                story.append(Paragraph(" • ".join(edu_parts), inline_style))
                story.append(Spacer(1, 0.08*inch))
        
        # ============================================================
        # LANGUAGES (Compact)
        # ============================================================
        languages = safe_get(resume_data, 'languages_spoken') or safe_get(resume_data, 'languages')
        if languages:
            story.append(Paragraph('LANGUAGES', section_title_style))
            lang_list = [l.strip() for l in languages.split(',') if l.strip()]
            story.append(Paragraph(" | ".join(lang_list), inline_style))
        
        # Build PDF
        doc.build(story, onFirstPage=add_footer_branding, onLaterPages=add_footer_branding)
        logger.info(f"Generated Recruiter Quick Scan PDF at: {file_path}")
        return file_path
        
    except Exception as e:
        logger.error(f"Error generating Compact PDF: {e}")
        raise
