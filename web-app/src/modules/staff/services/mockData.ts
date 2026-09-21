/* ------------------------------------------------------------------ *
 * Development mock dataset for the staff side.
 * Delete this file once the Spring Boot API is live; the area services
 * are the only things that import it.
 * ------------------------------------------------------------------ */
import { STAGE_OF_STATUS } from '../constants/staff.constants'
import type {
  StaffApplication,
  StaffApplicationDetail,
  StaffMember,
} from '../types/staff.types'

const iso = (days: number) => new Date(Date.now() + days * 864e5).toISOString()

export const mockStaff: StaffMember[] = [
  {
    id: 'stf_001', employeeCode: 'TE-001', fullName: 'Vasavi Reddy', email: 'vasavi@taxedge.in',
    mobile: '9876500001', role: 'SUPER_ADMIN', department: 'Operations', isActive: true,
    assignedApplications: 0, joinedOn: iso(-720), createdAt: iso(-720), updatedAt: iso(-3),
  },
  {
    id: 'stf_002', employeeCode: 'TE-002', fullName: 'Rahul Menon', email: 'rahul@taxedge.in',
    mobile: '9876500002', role: 'ADMIN', department: 'Operations', isActive: true,
    assignedApplications: 0, joinedOn: iso(-540), createdAt: iso(-540), updatedAt: iso(-8),
  },
  {
    id: 'stf_003', employeeCode: 'TE-003', fullName: 'Priya Nair', email: 'priya@taxedge.in',
    mobile: '9876500003', role: 'MANAGER', department: 'Compliance', isActive: true,
    assignedApplications: 6, joinedOn: iso(-430), createdAt: iso(-430), updatedAt: iso(-1),
  },
  {
    id: 'stf_004', employeeCode: 'TE-004', fullName: 'Imran Shaikh', email: 'imran@taxedge.in',
    mobile: '9876500004', role: 'GST_AGENT', department: 'Compliance', isActive: true,
    assignedApplications: 9, joinedOn: iso(-320), createdAt: iso(-320), updatedAt: iso(-1),
  },
  {
    id: 'stf_005', employeeCode: 'TE-005', fullName: 'Sneha Kulkarni', email: 'sneha@taxedge.in',
    mobile: '9876500005', role: 'ITR_AGENT', department: 'Compliance', isActive: true,
    assignedApplications: 7, joinedOn: iso(-300), createdAt: iso(-300), updatedAt: iso(-2),
  },
  {
    id: 'stf_006', employeeCode: 'TE-006', fullName: 'Arjun Rao', email: 'arjun@taxedge.in',
    mobile: '9876500006', role: 'LOAN_AGENT', department: 'Lending', isActive: true,
    assignedApplications: 5, joinedOn: iso(-260), createdAt: iso(-260), updatedAt: iso(-4),
  },
  {
    id: 'stf_007', employeeCode: 'TE-007', fullName: 'Fatima Khan', email: 'fatima@taxedge.in',
    mobile: '9876500007', role: 'INSURANCE_AGENT', department: 'Insurance', isActive: true,
    assignedApplications: 3, joinedOn: iso(-190), createdAt: iso(-190), updatedAt: iso(-6),
  },
  {
    id: 'stf_008', employeeCode: 'TE-008', fullName: 'Kiran Patil', email: 'kiran@taxedge.in',
    mobile: '9876500008', role: 'REGISTRATION_AGENT', department: 'Compliance', isActive: true,
    assignedApplications: 4, joinedOn: iso(-150), createdAt: iso(-150), updatedAt: iso(-5),
  },
  {
    id: 'stf_009', employeeCode: 'TE-009', fullName: 'Deepak Sharma', email: 'deepak@taxedge.in',
    mobile: '9876500009', role: 'ACCOUNTS_AGENT', department: 'Accounts', isActive: true,
    assignedApplications: 2, joinedOn: iso(-120), createdAt: iso(-120), updatedAt: iso(-9),
  },
  {
    id: 'stf_010', employeeCode: 'TE-010', fullName: 'Ananya Iyer', email: 'ananya@taxedge.in',
    mobile: '9876500010', role: 'GST_AGENT', department: 'Compliance', isActive: false,
    assignedApplications: 0, joinedOn: iso(-410), createdAt: iso(-410), updatedAt: iso(-45),
  },
]

const staffRef = (id: string) => {
  const member = mockStaff.find((m) => m.id === id)
  return member ? { id: member.id, name: member.fullName, role: member.role } : null
}

interface Seed {
  id: string
  applicationId: string
  customer: StaffApplication['customer']
  service: StaffApplication['service']
  status: StaffApplication['status']
  assignedToId: string | null
  fee: number
  paymentStatus: StaffApplication['paymentStatus']
  createdDays: number
  updatedDays: number
  dueDays: number
}

const seeds: Seed[] = [
  { id: 'app_001', applicationId: 'TE-GST-24001', customer: { id: 'cus_01', name: 'Tanvox Technologies', mobile: '9812300001' }, service: 'GST', status: 'COMPLETED', assignedToId: 'stf_004', fee: 2499, paymentStatus: 'PAID', createdDays: -40, updatedDays: -9, dueDays: -12 },
  { id: 'app_002', applicationId: 'TE-GST-24014', customer: { id: 'cus_02', name: 'Vasavi Traders', mobile: '9812300002' }, service: 'GST', status: 'QUERY_RAISED', assignedToId: 'stf_004', fee: 2499, paymentStatus: 'PAID', createdDays: -12, updatedDays: -2, dueDays: -1 },
  { id: 'app_003', applicationId: 'TE-GST-24022', customer: { id: 'cus_03', name: 'Nandi Foods LLP', mobile: '9812300003' }, service: 'GST', status: 'MANAGER_REVIEW', assignedToId: null, fee: 2499, paymentStatus: 'PAID', createdDays: -5, updatedDays: -1, dueDays: 3 },
  { id: 'app_004', applicationId: 'TE-GST-24031', customer: { id: 'cus_04', name: 'Sri Balaji Steels', mobile: '9812300004' }, service: 'GST', status: 'READY_FOR_ASSIGNMENT', assignedToId: null, fee: 1999, paymentStatus: 'PAID', createdDays: -4, updatedDays: 0, dueDays: 4 },
  { id: 'app_005', applicationId: 'TE-ITR-24007', customer: { id: 'cus_05', name: 'Meera Krishnan', mobile: '9812300005' }, service: 'ITR', status: 'IN_PROGRESS', assignedToId: 'stf_005', fee: 1499, paymentStatus: 'PAID', createdDays: -9, updatedDays: -1, dueDays: 2 },
  { id: 'app_006', applicationId: 'TE-ITR-24012', customer: { id: 'cus_06', name: 'Harish Gupta', mobile: '9812300006' }, service: 'ITR', status: 'ASSIGNED', assignedToId: 'stf_005', fee: 1499, paymentStatus: 'PARTIAL', createdDays: -6, updatedDays: -2, dueDays: -2 },
  { id: 'app_007', applicationId: 'TE-ITR-24019', customer: { id: 'cus_07', name: 'Lakshmi Enterprises', mobile: '9812300007' }, service: 'ITR', status: 'SUBMITTED', assignedToId: null, fee: 2999, paymentStatus: 'UNPAID', createdDays: -2, updatedDays: -2, dueDays: 8 },
  { id: 'app_008', applicationId: 'TE-LOAN-24003', customer: { id: 'cus_08', name: 'Konark Logistics', mobile: '9812300008' }, service: 'LOAN', status: 'IN_PROGRESS', assignedToId: 'stf_006', fee: 4999, paymentStatus: 'PARTIAL', createdDays: -18, updatedDays: -3, dueDays: 6 },
  { id: 'app_009', applicationId: 'TE-LOAN-24009', customer: { id: 'cus_09', name: 'Ganesh Textiles', mobile: '9812300009' }, service: 'LOAN', status: 'QUERY_RAISED', assignedToId: 'stf_006', fee: 4999, paymentStatus: 'UNPAID', createdDays: -11, updatedDays: -1, dueDays: -3 },
  { id: 'app_010', applicationId: 'TE-INS-24004', customer: { id: 'cus_10', name: 'Rohit Verma', mobile: '9812300010' }, service: 'INSURANCE', status: 'ASSIGNED', assignedToId: 'stf_007', fee: 999, paymentStatus: 'PAID', createdDays: -7, updatedDays: -2, dueDays: 5 },
  { id: 'app_011', applicationId: 'TE-REG-24002', customer: { id: 'cus_11', name: 'Suhana Handicrafts', mobile: '9812300011' }, service: 'REGISTRATION', status: 'READY_FOR_ASSIGNMENT', assignedToId: null, fee: 5999, paymentStatus: 'PAID', createdDays: -3, updatedDays: 0, dueDays: 9 },
  { id: 'app_012', applicationId: 'TE-ACC-24005', customer: { id: 'cus_12', name: 'Deccan Retail', mobile: '9812300012' }, service: 'ACCOUNTS', status: 'IN_PROGRESS', assignedToId: 'stf_009', fee: 7999, paymentStatus: 'PARTIAL', createdDays: -22, updatedDays: -4, dueDays: 11 },
  { id: 'app_013', applicationId: 'TE-GST-24036', customer: { id: 'cus_13', name: 'Aditya Motors', mobile: '9812300013' }, service: 'GST', status: 'QUERY_RESOLVED', assignedToId: null, fee: 2499, paymentStatus: 'PAID', createdDays: -8, updatedDays: 0, dueDays: 1 },
  { id: 'app_014', applicationId: 'TE-ITR-24024', customer: { id: 'cus_14', name: 'Neha Bansal', mobile: '9812300014' }, service: 'ITR', status: 'COMPLETED', assignedToId: 'stf_005', fee: 1499, paymentStatus: 'PAID', createdDays: -30, updatedDays: -14, dueDays: -16 },
]

export const mockApplications: StaffApplication[] = seeds.map((seed) => ({
  id: seed.id,
  applicationId: seed.applicationId,
  customer: seed.customer,
  service: seed.service,
  status: seed.status,
  stage: STAGE_OF_STATUS[seed.status],
  assignedTo: seed.assignedToId ? staffRef(seed.assignedToId) : null,
  fee: seed.fee,
  paymentStatus: seed.paymentStatus,
  dueOn: iso(seed.dueDays),
  isOverdue: seed.dueDays < 0 && !['COMPLETED', 'REJECTED', 'CANCELLED'].includes(seed.status),
  createdAt: iso(seed.createdDays),
  updatedAt: iso(seed.updatedDays),
}))

export const buildDetail = (application: StaffApplication): StaffApplicationDetail => ({
  ...application,
  timeline: [
    { id: 'ev1', status: 'SUBMITTED', actor: application.customer.name, occurredAt: application.createdAt },
    { id: 'ev2', status: 'MANAGER_REVIEW', actor: 'Priya Nair', occurredAt: iso(-6), note: 'Documents checked against the service checklist' },
    ...(application.assignedTo
      ? [{ id: 'ev3', status: 'ASSIGNED' as const, actor: 'Priya Nair', occurredAt: iso(-4), note: `Assigned to ${application.assignedTo.name}` }]
      : []),
    { id: 'ev4', status: application.status, actor: application.assignedTo?.name ?? 'Priya Nair', occurredAt: application.updatedAt },
  ],
  assignmentHistory: application.assignedTo
    ? [
        { id: 'as1', action: 'ASSIGNED', staffName: application.assignedTo.name, staffRole: application.assignedTo.role, actedBy: 'Priya Nair', actedAt: iso(-4), note: 'Initial assignment from the agent bucket' },
      ]
    : [],
  queries:
    application.status === 'QUERY_RAISED'
      ? [{ id: 'q1', message: 'Rent agreement is unsigned — please upload a signed copy.', raisedBy: 'Priya Nair', raisedByRole: 'MANAGER', raisedAt: iso(-2), isResolved: false }]
      : [],
  notes: [
    { id: 'n1', message: 'Customer prefers calls after 6pm.', author: 'Priya Nair', authorRole: 'MANAGER', createdAt: iso(-5) },
  ],
  documents: [
    { id: 'd1', name: 'PAN card.pdf', sizeBytes: 184_320, uploadedBy: application.customer.name, uploadedAt: application.createdAt, isVerified: true },
    { id: 'd2', name: 'Address proof.pdf', sizeBytes: 421_888, uploadedBy: application.customer.name, uploadedAt: application.createdAt, isVerified: application.status !== 'QUERY_RAISED' },
    { id: 'd3', name: 'Bank statement.pdf', sizeBytes: 1_048_576, uploadedBy: application.customer.name, uploadedAt: iso(-6), isVerified: false },
  ],
})
