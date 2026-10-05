package com.taxedge.gst.dto;

import lombok.Data;

@Data
public class GstFilingDocumentsDto {

	private String filingId;

	private String salesInvoice;

	private String purchaseInvoices;

	private String gstr2bItcStatement;

	private String creditNotes;

	private String debitNotes;

	private String eInvoiceData;

	private String eWayBillData;

	private String expenseInvoicesAndVouchers;

	private String bankStatement;

	private String previousGstReturns;

	private String previousFilingAcknowledgement;

	private String otherSupportingDocuments;
}