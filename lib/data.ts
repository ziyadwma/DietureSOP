export const users = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    name: "Super Admin",
    role: "super_admin",
    departments: ["Administration"],
  },
  {
    id: "2",
    username: "writer",
    password: "write123",
    name: "SOP Writer",
    role: "writer",
    departments: ["Quality"],
  },
  {
    id: "3",
    username: "approver",
    password: "approve123",
    name: "SOP Approver",
    role: "approver",
    departments: ["Quality"],
  },
  {
    id: "4",
    username: "depthead",
    password: "dept123",
    name: "Department Head",
    role: "department_head",
    departments: ["Operations"],
  },
  {
    id: "5",
    username: "staff",
    password: "staff123",
    name: "General Staff",
    role: "staff",
    departments: ["Operations"],
  },
]

export const departments = ["All", "Administration", "Quality", "Operations", "Finance", "HR", "IT", "Manufacturing"]

export const sopStatuses = ["draft", "pending_approval", "approved", "rejected", "archived"]

export const sops = [
  {
    id: "1",
    title: "Customer Service Protocol",
    department: "Operations",
    version: "1.2",
    status: "approved",
    createdBy: "2",
    approvedBy: "3",
    createdAt: "2023-10-15",
    updatedAt: "2023-11-02",
    content: `# Customer Service Protocol

## Purpose
This SOP outlines the standard procedures for handling customer inquiries and complaints.

## Scope
This procedure applies to all customer-facing staff in the Operations department.

## Responsibilities
- Customer Service Representatives
- Operations Manager
- Department Head

## Procedure
1. Greet the customer within 30 seconds of their arrival
2. Listen attentively to their inquiry or complaint
3. Document all relevant details in the CRM system
4. Provide a solution or escalate to a supervisor if necessary
5. Follow up with the customer within 24 hours

## References
- Customer Service Handbook
- Complaint Resolution Guidelines`,
    revisions: [
      {
        version: "1.0",
        date: "2023-10-15",
        author: "SOP Writer",
        changes: "Initial document creation",
      },
      {
        version: "1.1",
        date: "2023-10-25",
        author: "SOP Writer",
        changes: "Updated follow-up timeline from 48 to 24 hours",
      },
      {
        version: "1.2",
        date: "2023-11-02",
        author: "SOP Writer",
        changes: "Added references section",
      },
    ],
  },
  {
    id: "2",
    title: "Equipment Maintenance Schedule",
    department: "Manufacturing",
    version: "2.1",
    status: "approved",
    createdBy: "2",
    approvedBy: "3",
    createdAt: "2023-09-10",
    updatedAt: "2023-12-05",
    content: `# Equipment Maintenance Schedule

## Purpose
This SOP establishes a standardized schedule for routine maintenance of manufacturing equipment.

## Scope
This procedure applies to all equipment in the Manufacturing department.

## Responsibilities
- Maintenance Technicians
- Manufacturing Supervisor
- Quality Control

## Procedure
1. Daily visual inspection of all equipment
2. Weekly lubrication of moving parts
3. Monthly calibration check
4. Quarterly comprehensive maintenance
5. Annual certification by external vendor

## References
- Equipment Manuals
- Maintenance Log Templates`,
    revisions: [
      {
        version: "1.0",
        date: "2023-09-10",
        author: "SOP Writer",
        changes: "Initial document creation",
      },
      {
        version: "2.0",
        date: "2023-11-15",
        author: "SOP Writer",
        changes: "Major revision to include quarterly maintenance",
      },
      {
        version: "2.1",
        date: "2023-12-05",
        author: "SOP Writer",
        changes: "Added annual certification requirement",
      },
    ],
  },
  {
    id: "3",
    title: "New Employee Onboarding",
    department: "HR",
    version: "1.0",
    status: "pending_approval",
    createdBy: "2",
    approvedBy: null,
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
    content: `# New Employee Onboarding

## Purpose
This SOP outlines the process for onboarding new employees to ensure a smooth transition.

## Scope
This procedure applies to all new hires across all departments.

## Responsibilities
- HR Department
- Department Managers
- IT Support

## Procedure
1. Prepare workstation and access credentials before start date
2. Conduct orientation on first day
3. Complete required paperwork
4. Provide department-specific training
5. Schedule 30-day check-in meeting

## References
- Employee Handbook
- Department Training Materials`,
    revisions: [
      {
        version: "1.0",
        date: "2024-01-20",
        author: "SOP Writer",
        changes: "Initial document creation",
      },
    ],
  },
  {
    id: "4",
    title: "Expense Reimbursement Process",
    department: "Finance",
    version: "3.2",
    status: "approved",
    createdBy: "2",
    approvedBy: "3",
    createdAt: "2023-08-05",
    updatedAt: "2024-02-10",
    content: `# Expense Reimbursement Process

## Purpose
This SOP establishes the process for submitting and approving expense reimbursements.

## Scope
This procedure applies to all employees submitting expenses for reimbursement.

## Responsibilities
- Employees
- Department Managers
- Finance Department

## Procedure
1. Complete expense report form within 30 days of expense
2. Attach all original receipts
3. Obtain manager approval
4. Submit to Finance department
5. Reimbursement will be processed within 14 business days

## References
- Expense Policy
- Per Diem Rates
- Mileage Reimbursement Calculator`,
    revisions: [
      {
        version: "1.0",
        date: "2023-08-05",
        author: "SOP Writer",
        changes: "Initial document creation",
      },
      {
        version: "2.0",
        date: "2023-09-12",
        author: "SOP Writer",
        changes: "Updated to include digital receipt submission",
      },
      {
        version: "3.0",
        date: "2023-11-30",
        author: "SOP Writer",
        changes: "Major revision to align with new finance system",
      },
      {
        version: "3.1",
        date: "2024-01-15",
        author: "SOP Writer",
        changes: "Updated reimbursement timeline from 21 to 14 days",
      },
      {
        version: "3.2",
        date: "2024-02-10",
        author: "SOP Writer",
        changes: "Added reference to mileage calculator",
      },
    ],
  },
  {
    id: "5",
    title: "IT Security Incident Response",
    department: "IT",
    version: "2.3",
    status: "approved",
    createdBy: "2",
    approvedBy: "3",
    createdAt: "2023-07-20",
    updatedAt: "2024-03-01",
    content: `# IT Security Incident Response

## Purpose
This SOP outlines the steps to be taken in response to an IT security incident.

## Scope
This procedure applies to all IT staff and security incidents affecting company systems.

## Responsibilities
- IT Security Team
- IT Director
- Department Heads
- Executive Management

## Procedure
1. Identify and confirm the security incident
2. Isolate affected systems to prevent further damage
3. Investigate the cause and extent of the breach
4. Remediate vulnerabilities and restore systems
5. Document the incident and response actions
6. Conduct post-incident review and update procedures

## References
- Security Incident Classification Guide
- Data Breach Notification Requirements
- System Restoration Procedures`,
    revisions: [
      {
        version: "1.0",
        date: "2023-07-20",
        author: "SOP Writer",
        changes: "Initial document creation",
      },
      {
        version: "2.0",
        date: "2023-10-05",
        author: "SOP Writer",
        changes: "Major revision to include ransomware response",
      },
      {
        version: "2.1",
        date: "2023-12-12",
        author: "SOP Writer",
        changes: "Updated notification requirements",
      },
      {
        version: "2.2",
        date: "2024-01-25",
        author: "SOP Writer",
        changes: "Added post-incident review process",
      },
      {
        version: "2.3",
        date: "2024-03-01",
        author: "SOP Writer",
        changes: "Updated system isolation procedures",
      },
    ],
  },
  {
    id: "6",
    title: "Quality Control Inspection",
    department: "Quality",
    version: "1.5",
    status: "draft",
    createdBy: "2",
    approvedBy: null,
    createdAt: "2024-02-15",
    updatedAt: "2024-03-10",
    content: `# Quality Control Inspection

## Purpose
This SOP establishes the process for conducting quality control inspections of manufactured products.

## Scope
This procedure applies to all quality control inspections in the manufacturing process.

## Responsibilities
- Quality Control Inspectors
- Manufacturing Supervisor
- Quality Manager

## Procedure
1. Select samples according to the sampling plan
2. Conduct visual inspection for defects
3. Perform dimensional measurements
4. Test functionality according to product specifications
5. Document all inspection results
6. Determine acceptance or rejection of the batch

## References
- Product Specifications
- Acceptance Criteria
- Sampling Plans
- Inspection Checklists`,
    revisions: [
      {
        version: "1.0",
        date: "2024-02-15",
        author: "SOP Writer",
        changes: "Initial document creation",
      },
      {
        version: "1.1",
        date: "2024-02-20",
        author: "SOP Writer",
        changes: "Added sampling plan guidelines",
      },
      {
        version: "1.2",
        date: "2024-02-25",
        author: "SOP Writer",
        changes: "Updated visual inspection criteria",
      },
      {
        version: "1.3",
        date: "2024-03-01",
        author: "SOP Writer",
        changes: "Added functional testing requirements",
      },
      {
        version: "1.4",
        date: "2024-03-05",
        author: "SOP Writer",
        changes: "Updated documentation requirements",
      },
      {
        version: "1.5",
        date: "2024-03-10",
        author: "SOP Writer",
        changes: "Added reference to inspection checklists",
      },
    ],
  },
]

