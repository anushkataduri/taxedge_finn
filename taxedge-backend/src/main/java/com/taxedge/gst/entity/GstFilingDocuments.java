package com.taxedge.gst.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "gst_filing_documents")
@Data
public class GstFilingDocuments {

	@Id
	@Column(name = "document_id", nullable = false, unique = true, length = 9)
	private String documentId;

	@OneToOne
	@JoinColumn(name = "filing_id", nullable = false, unique = true)
	private GstFiling gstFiling;

	@Column(name = "sales_invoice", columnDefinition = "TEXT")
	private String salesInvoice;

	@Column(name = "purchase_invoices", columnDefinition = "TEXT")
	private String purchaseInvoices;

	@Column(name = "gstr2b_itc_statement", columnDefinition = "TEXT")
	private String gstr2bItcStatement;

	@Column(name = "credit_notes", columnDefinition = "TEXT")
	private String creditNotes;

	@Column(name = "debit_notes", columnDefinition = "TEXT")
	private String debitNotes;

	@Column(name = "e_invoice_data", columnDefinition = "TEXT")
	private String eInvoiceData;

	@Column(name = "e_way_bill_data", columnDefinition = "TEXT")
	private String eWayBillData;

	@Column(name = "expense_invoices_and_vouchers", columnDefinition = "TEXT")
	private String expenseInvoicesAndVouchers;

	@Column(name = "bank_statement", columnDefinition = "TEXT")
	private String bankStatement;

	@Column(name = "previous_gst_returns", columnDefinition = "TEXT")
	private String previousGstReturns;

	@Column(name = "previous_filing_acknowledgement", columnDefinition = "TEXT")
	private String previousFilingAcknowledgement;

	@Column(name = "other_supporting_documents", columnDefinition = "TEXT")
	private String otherSupportingDocuments;
}