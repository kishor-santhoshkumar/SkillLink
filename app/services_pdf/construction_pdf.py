"""
Template 4: PREMIUM CONSTRUCTION THEME
Bold, confident, industry-focused design
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT, TA_CENTER
import logging

from .base_pdf import (
    PDFColors, PDFFonts, get_photo_image, create_style,
    format_phone, format_location, format_languages,
    get_verified_badge_text, split_into_columns, add_footer_branding, safe_get
)

logger = logging.getLogger(__name__)


def generate_construction_pdf(file_path: str, resume_data: dict) -> str:
    """
    Generate Premium Construction Theme template PDF
    
    Features:
    - Navy + steel grey accent header
    - Bold name with trade in highlight box
    - Uppercase section titles with letter spacing
    - Two-column bullet grid for skills
    - Boxed info cards with icons for service details
    - Strong typography
    - Industry identity visible
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
            'ConstructionName',
            styles['Heading1'],
            fontSize=26,
            textColor=PDFColors.WHITE,
            fontName=PDFFonts.BOLD,
            spaceAfter=6,
            spaceBefore=8,
            alignment=TA_LEFT,
            leading=30
        )
        
        trade_box_style = create_style(
            'ConstructionTradeBox',
            styles['Normal'],
            fontSize=12,
            textColor=PDFColors.WHITE,
            fontName=PDFFonts.BOLD,
            spaceAfter=4,
            alignment=TA_LEFT,
            leading=15
        )
        
        contact_style = create_style(
            'ConstructionContact',
            styles['Normal'],
            fontSize=9,
            textColor=PDFColors.WHITE,
            fontName=PDFFonts.REGULAR,
            spaceAfter=2,
            alignment=TA_LEFT,
            leading=11
        )
        
        section_title_style = create_style(
            'ConstructionSection',
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
            'ConstructionNormal',
            styles['Normal'],
            fontSize=10,
            textColor=PDFColors.DARK_SLATE,
            fontName=PDFFonts.REGULAR,
            spaceAfter=4,
            alignment=TA_LEFT,
            leading=13
        )
        
        bullet_style = create_style(
            'ConstructionBullet',
            styles['Normal'],
            fontSize=10,
            textColor=PDFColors.DARK_SLATE,
            fontName=PDFFonts.BOLD,
            spaceAfter=3,
            alignment=TA_LEFT,
            leading=13,
            leftIndent=12
        )
        
        card_label_style = create_style(
            'ConstructionCardLabel',
            styles['Normal'],
            fontSize=9,
            textColor=PDFColors.NAVY,
            fontName=PDFFonts.BOLD,
            spaceAfter=2,
            alignment=TA_CENTER,
            leading=11
        )
        
        card_value_style = create_style(
            'ConstructionCardValue',
            styles['Normal'],
            fontSize=10,
            textColor=PDFColors.DARK_SLATE,
            fontName=PDFFonts.REGULAR,
            spaceAfter=0,
            alignment=TA_CENTER,
            leading=12
        )
        
        # ============================================================
        # HEADER SECTION
        # ============================================================
        
        header_content = []
        
        # Name
        name = safe_get(resume_data, 'full_name', default='Skilled Worker')
        header_content.append(Paragraph(name.upper(), name_style))
        
        # Trade in highlight box
        if safe_get(resume_data, 'primary_trade'):
            trade_text = resume_data['primary_trade'].upper()
            if safe_get(resume_data, 'years_of_experience'):
                trade_text += f" | {resume_data['years_of_experience']}"
            
            # Create trade box
            trade_box_data = [[Paragraph(trade_text, trade_box_style)]]
            trade_box = Table(trade_box_data, colWidths=[3*inch])
            trade_box.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), PDFColors.BLUE),
                ('LEFTPADDING', (0, 0), (-1, -1), 10),
                ('RIGHTPADDING', (0, 0), (-1, -1), 10),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ]))
            header_content.append(trade_box)
            header_content.append(Spacer(1, 0.05*inch))
        
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
        
        # Create header table with photo
        photo_img = get_photo_image(safe_get(resume_data, 'profile_photo'), 1.2*inch, 1.2*inch)
        
        if photo_img:
            header_table = Table([[header_content, photo_img]], colWidths=[5.5*inch, 1.5*inch])
            header_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), PDFColors.NAVY),
                ('ALIGN', (0, 0), (0, 0), 'LEFT'),
                ('VALIGN', (0, 0), (0, 0), 'TOP'),
                ('ALIGN', (1, 0), (1, 0), 'CENTER'),
                ('VALIGN', (1, 0), (1, 0), 'MIDDLE'),
                ('TOPPADDING', (0, 0), (-1, -1), 12),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                ('LEFTPADDING', (0, 0), (0, 0), 20),
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
            badge_style = create_style(
                'ConstructionBadge',
                styles['Normal'],
                fontSize=10,
                textColor=PDFColors.BLUE,
                fontName=PDFFonts.BOLD,
                spaceAfter=4,
                alignment=TA_LEFT,
                leading=12
            )
            story.append(Paragraph(badge_text, badge_style))
            story.append(Spacer(1, 0.1*inch))
        
        # ============================================================
        # PROFESSIONAL SUMMARY
        # ============================================================
        summary = safe_get(resume_data, 'professional_summary')
        if summary:
            # Uppercase with letter spacing effect
            story.append(Paragraph('P R O F E S S I O N A L &nbsp; S U M M A R Y', section_title_style))
            story.append(HRFlowable(width="100%", thickness=2, color=PDFColors.BLUE, spaceAfter=6))
            story.append(Paragraph(summary, normal_style))
            story.append(Spacer(1, 0.15*inch))
        
        # ============================================================
        # SKILLS & EXPERTISE (Two-Column Bold)
        # ============================================================
        specializations = safe_get(resume_data, 'specializations')
        if specializations:
            story.append(Paragraph('S K I L L S &nbsp; & &nbsp; E X P E R T I S E', section_title_style))
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
        # WORK EXPERIENCE
        # ============================================================
        work_exp = safe_get(resume_data, 'structured_work_experience', default=[])
        if work_exp and isinstance(work_exp, list):
            story.append(Paragraph('W O R K &nbsp; E X P E R I E N C E', section_title_style))
            story.append(HRFlowable(width="100%", thickness=2, color=PDFColors.BLUE, spaceAfter=6))
            for bullet in work_exp:
                if bullet:
                    story.append(Paragraph(f"• {bullet}", bullet_style))
            story.append(Spacer(1, 0.15*inch))
        
        # ============================================================
        # SERVICE DETAILS (Info Cards)
        # ============================================================
        service_items = []
        if safe_get(resume_data, 'service_type'):
            service_items.append(('📋', 'Service', resume_data['service_type']))
        if safe_get(resume_data, 'own_tools') is not None:
            service_items.append(('🔧', 'Tools', 'Own Tools' if resume_data['own_tools'] else 'No Tools'))
        if safe_get(resume_data, 'availability'):
            service_items.append(('⏰', 'Availability', resume_data['availability']))
        if safe_get(resume_data, 'projects_completed'):
            service_items.append(('✅', 'Projects', f"{resume_data['projects_completed']}+"))
        
        if service_items:
            story.append(Paragraph('S E R V I C E &nbsp; D E T A I L S', section_title_style))
            story.append(HRFlowable(width="100%", thickness=2, color=PDFColors.BLUE, spaceAfter=6))
            
            # Create info cards (2 per row)
            card_rows = []
            for i in range(0, len(service_items), 2):
                row = []
                for j in range(2):
                    if i + j < len(service_items):
                        icon, label, value = service_items[i + j]
                        card_content = [
                            Paragraph(f"{icon} {label}", card_label_style),
                            Paragraph(value, card_value_style)
                        ]
                        row.append(card_content)
                    else:
                        row.append([Paragraph('', card_label_style)])
                card_rows.append(row)
            
            if card_rows:
                card_table = Table(card_rows, colWidths=[3.2*inch, 3.2*inch])
                card_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, -1), PDFColors.VERY_LIGHT_GREY),
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 12),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 12),
                    ('TOPPADDING', (0, 0), (-1, -1), 10),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
                    ('GRID', (0, 0), (-1, -1), 1, PDFColors.BORDER_GREY),
                ]))
                story.append(card_table)
            story.append(Spacer(1, 0.15*inch))
        
        # ============================================================
        # TOOLS & EQUIPMENT
        # ============================================================
        tools = safe_get(resume_data, 'tools_handled') or safe_get(resume_data, 'tools_known')
        if tools:
            story.append(Paragraph('T O O L S &nbsp; & &nbsp; E Q U I P M E N T', section_title_style))
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
        # EDUCATION & TRAINING
        # ============================================================
        education = safe_get(resume_data, 'education_level')
        training = safe_get(resume_data, 'technical_training')
        
        if education or training:
            story.append(Paragraph('E D U C A T I O N &nbsp; & &nbsp; T R A I N I N G', section_title_style))
            story.append(HRFlowable(width="100%", thickness=2, color=PDFColors.BLUE, spaceAfter=6))
            
            if education:
                story.append(Paragraph(f"<b>Education:</b> {education}", normal_style))
            if training:
                story.append(Paragraph(f"<b>Technical Training:</b> {training}", normal_style))
        
        # Build PDF
        doc.build(story, onFirstPage=add_footer_branding, onLaterPages=add_footer_branding)
        logger.info(f"Generated Premium Construction Theme PDF at: {file_path}")
        return file_path
        
    except Exception as e:
        logger.error(f"Error generating Construction PDF: {e}")
        raise
