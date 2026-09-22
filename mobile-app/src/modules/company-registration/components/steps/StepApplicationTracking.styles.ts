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
  metaCard: {
    backgroundColor: '#083B75',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  metaId: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#93C5FD',
  },
  timeline: {
    paddingLeft: 8,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  iconColumn: {
    alignItems: 'center',
    marginRight: 12,
    width: 24,
  },
  line: {
    width: 2,
    height: 36,
    backgroundColor: '#CBD5E1',
    marginTop: 4,
  },
  lineCompleted: {
    backgroundColor: '#166534',
  },
  stageContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
  },
  stageTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  stageDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  stageTime: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  receiptBtn: {
    backgroundColor: '#083B75',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  receiptBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
