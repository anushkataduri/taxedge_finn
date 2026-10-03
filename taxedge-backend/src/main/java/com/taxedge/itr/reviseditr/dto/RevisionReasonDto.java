package com.taxedge.itr.reviseditr.dto;

import com.taxedge.itr.reviseditr.enums.RevisionReason;

import lombok.Data;

@Data
public class RevisionReasonDto {

	private String revisedItrId;

	private RevisionReason reason;

	private String otherReason;
}
