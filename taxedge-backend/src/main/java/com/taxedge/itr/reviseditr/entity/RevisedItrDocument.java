package com.taxedge.itr.reviseditr.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "revised_itr_document")
@Data
public class RevisedItrDocument {

	@Id
	@Column(name = "document_id", nullable = false, unique = true)
	private String documentId;

	@ManyToOne
	@JoinColumn(name = "revised_itr_id", nullable = false)
	private RevisedItr revisedItr;

	@Column(name = "pan_card", columnDefinition = "TEXT")
	private String panCard;

	@Column(name = "aadhaar_card", columnDefinition = "TEXT")
	private String aadhaarCard;

	@Column(name = "form_16_form_16a", columnDefinition = "TEXT")
	private String form16Form16A;

	@Column(name = "ais_tis_statement", columnDefinition = "TEXT")
	private String aisTisStatement;

	@Column(name = "bank_statements", columnDefinition = "TEXT")
	private String bankStatements;

	@Column(name = "investment_proofs", columnDefinition = "TEXT")
	private String investmentProofs;
}
