package com.taxedge.gst.entity;

import com.taxedge.gst.enums.PrincipalPlaceAddressType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "gst_reg_documents")
@Data
public class Documents {

	@Id
	@Column(name = "document_id", nullable = false, unique = true)
	private String documentId;

	@OneToOne
	@JoinColumn(name = "gst_id", nullable = false)
	private Business business;

	@Lob
	@Column(name = "pan_card", columnDefinition = "LONGTEXT")
	private String panCard;

	@Lob
	@Column(name = "aadhaar_card", columnDefinition = "LONGTEXT")
	private String aadhaarCard;

	@Lob
	@Column(name = "business_registration_proof", columnDefinition = "LONGTEXT")
	private String businessRegistrationProof;

	@Enumerated(EnumType.STRING)
	@Column(name = "principal_place_address_type", length = 50)
	private PrincipalPlaceAddressType principalPlaceAddressType;

	@Lob
	@Column(name = "principal_place_address_proof", columnDefinition = "LONGTEXT")
	private String principalPlaceAddressProof;

	@Lob
	@Column(name = "bank_passbook_or_cancelled_cheque", columnDefinition = "LONGTEXT")
	private String bankPassbookOrCancelledCheque;

	@Lob
	@Column(name = "passport_size_photograph", columnDefinition = "LONGTEXT")
	private String passportSizePhotograph;
}