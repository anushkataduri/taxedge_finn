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
  card: {
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
  cardSelected: {
    borderColor: '#083B75',
    backgroundColor: '#F0F7FF',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  desc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});
