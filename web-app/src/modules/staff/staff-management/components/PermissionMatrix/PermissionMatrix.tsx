import { PERMISSIONS, ROLE_LABELS, ROLE_PERMISSIONS, STAFF_ROLES } from '@core/auth'

import './PermissionMatrix.css'

const PERMISSION_LABELS: Record<string, string> = {
  'staff.dashboard.view': 'View staff dashboard',
  'applications.view': 'View applications',
  'applications.review': 'Review and verify documents',
  'applications.assign': 'Assign and reassign',
  'applications.stage.update': 'Change stage',
  'applications.query': 'Raise queries',
  'customers.view': 'View customers',
  'assignments.view': 'View the agent bucket',
  'assignments.claim': 'Claim from the bucket',
  'documents.view': 'View documents',
  'reports.view': 'View reports',
  'staff.manage': 'Manage staff',
  'services.manage': 'Manage services',
  'pricing.manage': 'Manage pricing',
  'notifications.view': 'View notifications',
  'settings.manage': 'Manage settings',
}

/** Read-only view of what each role can do. The backend is the enforcer. */
export const PermissionMatrix = () => (
  <div className="permission-matrix__wrap">
    <table className="permission-matrix">
      <thead>
        <tr>
          <th scope="col">Permission</th>
          {STAFF_ROLES.map((role) => (
            <th key={role} scope="col">
              {ROLE_LABELS[role]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {PERMISSIONS.map((permission) => (
          <tr key={permission}>
            <th scope="row">{PERMISSION_LABELS[permission] ?? permission}</th>
            {STAFF_ROLES.map((role) => (
              <td key={role}>
                {ROLE_PERMISSIONS[role].includes(permission) ? (
                  <span className="permission-matrix__yes" aria-label="Allowed">
                    ✓
                  </span>
                ) : (
                  <span className="permission-matrix__no" aria-label="Not allowed">
                    ·
                  </span>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
