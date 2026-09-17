import type { IncomeTypeOption } from './ItrFiling'

export interface ConfirmProps {
  activeIncome: IncomeTypeOption
}

export const ItrStep5View = ({ activeIncome }: ConfirmProps) => (
  <div className="itr-confirm-hero">
    <div className="itr-confirm-check">✓</div>
    <h2 className="itr-confirm-title">Your application has been received</h2>
    <p className="itr-confirm-subtitle">
      Your return has entered the ITR queue for a Tax Executive to pick up and verify.
    </p>

    <div className="itr-app-id-pill">
      Application ID <strong>ITR-2026-00042</strong>
    </div>

    <div className="itr-milestone-pipeline">
      <span className="itr-pipeline-item itr-pipeline-item--active">◉ Received</span>
      <span>—</span>
      <span className="itr-pipeline-item">○ Verification</span>
      <span>—</span>
      <span className="itr-pipeline-item">○ Preparation</span>
      <span>—</span>
      <span className="itr-pipeline-item">○ Your approval</span>
      <span>—</span>
      <span className="itr-pipeline-item">○ Filed</span>
      <span>—</span>
      <span className="itr-pipeline-item">○ E-verified</span>
    </div>

    <div className="itr-confirm-summary-grid">
      <div className="itr-confirm-box">
        <div className="itr-confirm-box-title">What we have</div>
        <div className="itr-confirm-row">
          <span style={{ color: '#64748b' }}>Income type</span>
          <strong>{activeIncome.label}</strong>
        </div>
        <div className="itr-confirm-row">
          <span style={{ color: '#64748b' }}>Form</span>
          <strong>{activeIncome.formType}</strong>
        </div>
        <div className="itr-confirm-row">
          <span style={{ color: '#64748b' }}>Assessment year</span>
          <strong>AY 2026-27</strong>
        </div>
      </div>

      <div className="itr-confirm-box">
        <div className="itr-confirm-box-title">What happens next</div>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, textAlign: 'left' }}>
          A Tax Executive verifies your documents, prepares the return and sends you the computation to approve.
          You will get a notification at each stage.
        </p>
      </div>
    </div>
  </div>
)

export interface Step6Props {
  onApproveAndFile: () => void
  onRequestChange: () => void
}

export const ItrStep6View = ({ onApproveAndFile, onRequestChange }: Step6Props) => (
  <>
    <div>
      <h2 className="itr-card-heading">Please review your tax computation</h2>
      <p className="itr-card-subheading">
        Prepared by your Tax Executive. Nothing is filed until you approve it.
      </p>
    </div>

    <div className="itr-comp-hero-banner">
      <div className="itr-comp-hero-label">REFUND DUE TO YOU</div>
      <div className="itr-comp-hero-amount">₹29,585</div>
      <div className="itr-comp-hero-sub">Old regime · after TDS and advance tax already paid</div>
    </div>

    <div className="itr-comp-rows-list">
      <div className="itr-comp-row">
        <span>Gross total income</span>
        <strong>₹8,97,680</strong>
      </div>
      <div className="itr-comp-row">
        <span>Total deductions</span>
        <strong style={{ color: '#ea580c' }}>- ₹3,80,000</strong>
      </div>
      <div className="itr-comp-row">
        <span>Taxable income</span>
        <strong>₹5,17,680</strong>
      </div>
      <div className="itr-comp-row">
        <span>Tax + cess</span>
        <strong>₹16,675</strong>
      </div>
      <div className="itr-comp-row">
        <span>Taxes already paid</span>
        <strong>₹46,260</strong>
      </div>
      <div className="itr-comp-row itr-comp-row--total">
        <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>Refund due</span>
        <span style={{ fontWeight: 800, fontSize: '1.35rem', color: '#ea580c' }}>₹29,585</span>
      </div>
    </div>

    <div className="itr-comp-actions">
      <button type="button" className="itr-comp-btn-outline" onClick={onRequestChange}>
        Request a change
      </button>
      <button type="button" className="itr-comp-btn-primary" onClick={onApproveAndFile}>
        Approve &amp; file →
      </button>
    </div>
  </>
)

export interface Step7Props {
  onEverifyAadhaar: () => void
  onEverifyNetBanking: () => void
}

export const ItrStep7View = ({ onEverifyAadhaar, onEverifyNetBanking }: Step7Props) => (
  <>
    <div>
      <h2 className="itr-card-heading">Your ITR has been filed</h2>
      <p className="itr-card-subheading">
        Please e-verify to complete the process. A return that is never e-verified is treated as not filed at all.
      </p>
    </div>

    <div className="itr-filed-details-card">
      <div className="itr-filed-row">
        <span style={{ color: '#64748b' }}>Acknowledgement number</span>
        <strong style={{ letterSpacing: '0.03em', color: '#0f172a' }}>284419260902411</strong>
      </div>
      <div className="itr-filed-row">
        <span style={{ color: '#64748b' }}>Filed on</span>
        <strong>2 Sep 2026</strong>
      </div>
      <div className="itr-filed-row">
        <span style={{ color: '#64748b' }}>Form</span>
        <strong>ITR-1 · AY 2026-27</strong>
      </div>
      <div className="itr-filed-row">
        <span style={{ color: '#64748b' }}>Refund claimed</span>
        <strong style={{ color: '#ea580c', fontWeight: 800, fontSize: '1.05rem' }}>₹29,585</strong>
      </div>
    </div>

    <div className="itr-filed-btn-group">
      <button type="button" className="itr-everify-btn-primary" onClick={onEverifyAadhaar}>
        🔒 E-verify with Aadhaar OTP
      </button>
      <button type="button" className="itr-everify-btn-secondary" onClick={onEverifyNetBanking}>
        E-verify with net banking
      </button>
    </div>

    <div className="itr-everify-warning-box">
      <span style={{ fontSize: '1.35rem' }}>⚠️</span>
      <div>
        <strong>30 days to e-verify</strong>
        <br />
        If it is not e-verified within 30 days of filing, the department treats the return as never filed.
      </div>
    </div>
  </>
)
