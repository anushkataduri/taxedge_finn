import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#083B75',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },

  docHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  docIconTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  docIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docTitleTextGroup: {
    flex: 1,
    justifyContent: 'center',
  },

  docTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  docCategory: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 6,
    marginLeft: 46,
    lineHeight: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },

  uploadActionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  uploadedContainer: {
    marginTop: 12,
    marginLeft: 46,
  },

  uploadedBadge: {
    backgroundColor: '#DCFCE7',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  uploadedText: {
    color: '#166534',
  },
  pendingText: {
    color: '#92400E',

  fileNameText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#083B75',
    marginBottom: 12,
  },
  uploadedActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    justifyContent: 'flex-start',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionTextBtn: {
    fontSize: 12,
    fontWeight: '600',
    color: '#083B75',
    marginLeft: 4,
  },
  removeTextBtn: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 4,

  },
});
