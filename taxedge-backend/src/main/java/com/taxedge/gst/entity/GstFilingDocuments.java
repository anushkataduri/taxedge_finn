package com.taxedge.gst.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
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

	@Lob
	@Column(name = "sales_invoice", columnDefinition = "LONGTEXT")
	private String salesInvoice;

	@Lob
	@Column(name = "purchase_invoices", columnDefinition = "LONGTEXT")
	private String purchaseInvoices;

	@Lob
	@Column(name = "gstr2b_itc_statement", columnDefinition = "LONGTEXT")
	private String gstr2bItcStatement;

	@Lob
	@Column(name = "credit_notes", columnDefinition = "LONGTEXT")
	private String creditNotes;

	@Lob
	@Column(name = "debit_notes", columnDefinition = "LONGTEXT")
	private String debitNotes;

	@Lob
	@Column(name = "e_invoice_data", columnDefinition = "LONGTEXT")
	private String eInvoiceData;

	@Lob
	@Column(name = "e_way_bill_data", columnDefinition = "LONGTEXT")
	private String eWayBillData;

	@Lob
	@Column(name = "expense_invoices_and_vouchers", columnDefinition = "LONGTEXT")
	private String expenseInvoicesAndVouchers;

	@Lob
	@Column(name = "bank_statement", columnDefinition = "LONGTEXT")
	private String bankStatement;

	@Lob
	@Column(name = "previous_gst_returns", columnDefinition = "LONGTEXT")
	private String previousGstReturns;

	@Lob
	@Column(name = "previous_filing_acknowledgement", columnDefinition = "LONGTEXT")
	private String previousFilingAcknowledgement;

	@Lob
	@Column(name = "other_supporting_documents", columnDefinition = "LONGTEXT")
	private String otherSupportingDocuments;
}