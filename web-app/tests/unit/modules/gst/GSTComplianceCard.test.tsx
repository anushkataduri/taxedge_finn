import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { GSTComplianceCard } from '@modules/gst/components/compliance/GSTComplianceCard/GSTComplianceCard'

// Mock URL.createObjectURL and URL.revokeObjectURL
if (typeof window.URL.createObjectURL === 'undefined') {
  window.URL.createObjectURL = vi.fn(() => 'blob:mock-file-url')
}
if (typeof window.URL.revokeObjectURL === 'undefined') {
  window.URL.revokeObjectURL = vi.fn()
}

describe('GSTComplianceCard Document Upload & Preview', () => {
  it('renders initial upload dropzone with Browse button', () => {
    render(
      <MemoryRouter>
        <GSTComplianceCard />
      </MemoryRouter>
    )

    // Check initial state
    const uploadElements = screen.getAllByText('Choose a file to upload')
    expect(uploadElements.length).toBeGreaterThan(0)
    const browseButtons = screen.getAllByText('Browse')
    expect(browseButtons.length).toBeGreaterThan(0)
  })

  it('shows both View and Delete buttons after uploading a document in Purchase Register', async () => {
    render(
      <MemoryRouter>
        <GSTComplianceCard />
      </MemoryRouter>
    )

    const file = new File(['mock content'], 'sample_purchase_register.pdf', {
      type: 'application/pdf',
    })

    // Find the file input for Purchase Register
    const fileInputs = document.querySelectorAll('input[type="file"]')
    expect(fileInputs.length).toBeGreaterThan(0)

    const purchaseFileInput = fileInputs[0] as HTMLInputElement

    // Simulate file selection
    fireEvent.change(purchaseFileInput, { target: { files: [file] } })

    // Check that file name is displayed
    expect(screen.getByText('sample_purchase_register.pdf')).toBeInTheDocument()
    expect(screen.getByText(/File uploaded/i)).toBeInTheDocument()

    // Verify BOTH View and Delete buttons exist for this file
    const viewButtons = screen.getAllByRole('button', { name: /View/i })
    expect(viewButtons.length).toBeGreaterThan(0)

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i })
    expect(deleteButtons.length).toBeGreaterThan(0)

    // Click View button to open preview modal
    fireEvent.click(viewButtons[0])

    // Verify modal is open and shows document details
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'sample_purchase_register.pdf' })).toBeInTheDocument()
    expect(screen.getByText(/Uploaded & verified/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Open in new tab/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Download/i })).toBeInTheDocument()

    // Close the modal by clicking Done
    const doneButton = screen.getByRole('button', { name: /Done/i })
    fireEvent.click(doneButton)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    // Now click Delete to remove the file
    const deleteButton = screen.getByRole('button', { name: /Delete/i })
    fireEvent.click(deleteButton)

    // Verify file is removed and initial Browse button is back
    expect(screen.queryByText('sample_purchase_register.pdf')).not.toBeInTheDocument()
  })

  it('shows View and Delete buttons for GSTR-2B Statement file upload', () => {
    render(
      <MemoryRouter>
        <GSTComplianceCard />
      </MemoryRouter>
    )

    const statementFile = new File(['statement'], 'GSTR_2B_July_2026.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    // Find the inline statement file input (field 6)
    const allInputs = document.querySelectorAll('input[type="file"]')
    const gstr2bInput = allInputs[2] as HTMLInputElement

    fireEvent.change(gstr2bInput, { target: { files: [statementFile] } })

    // Check filename and statement attached text
    expect(screen.getByText('GSTR_2B_July_2026.xlsx')).toBeInTheDocument()
    expect(screen.getByText(/Statement attached/i)).toBeInTheDocument()

    // Check View and Delete buttons exist for the statement
    const viewButtons = screen.getAllByRole('button', { name: /View/i })
    expect(viewButtons.length).toBeGreaterThan(0)

    // Click view for statement file
    fireEvent.click(viewButtons[0])
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/Spreadsheet statement parsed and attached/i)).toBeInTheDocument()

    // Close modal
    fireEvent.click(screen.getByRole('button', { name: /Done/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    // Delete statement file
    const deleteButton = screen.getByRole('button', { name: /Delete/i })
    fireEvent.click(deleteButton)
    expect(screen.queryByText('GSTR_2B_July_2026.xlsx')).not.toBeInTheDocument()
  })
})
