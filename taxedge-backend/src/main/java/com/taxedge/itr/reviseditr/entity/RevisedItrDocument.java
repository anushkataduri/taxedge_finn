package com.taxedge.itr.reviseditr.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
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

	@Lob
	@Column(name = "pan_card", columnDefinition = "LONGTEXT")
	private String panCard;

	@Lob
	@Column(name = "aadhaar_card", columnDefinition = "LONGTEXT")
	private String aadhaarCard;

	@Lob
	@Column(name = "form_16_form_16a", columnDefinition = "LONGTEXT")
	private String form16Form16A;

	@Lob
	@Column(name = "ais_tis_statement", columnDefinition = "LONGTEXT")
	private String aisTisStatement;

	@Lob
	@Column(name = "bank_statements", columnDefinition = "LONGTEXT")
	private String bankStatements;

	@Lob
	@Column(name = "investment_proofs", columnDefinition = "LONGTEXT")
	private String investmentProofs;
}
