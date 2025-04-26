import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const commonStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Content containers
  content: {
    flex: 1,
  },
  
  // Screen padding
  screenPadding: {
    padding: 20,
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  
  // Icon button
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
  },
  
  // Text styles
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.primary,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 20,
    color: colors.primary,
    marginBottom: 15,
    fontWeight: '600',
  },
  
  // Links
  link: {
    color: colors.secondary,
    textDecorationLine: 'underline',
  },
  
  // Form styles
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: colors.textPrimary,
  },
  inputLabel: {
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 8,
  },
  
  // Button styles
  primaryButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: colors.transparent,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: 20,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '600',
  },
  
  // Stat items
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 30,
  },
  statText: {
    color: colors.textPrimary,
    marginLeft: 8,
    fontSize: 16,
  },
  
  // Detail styles
  detailsContainer: {
    marginTop: 10,
  },
  detailRow: {
    marginBottom: 15,
  },
  detailLabel: {
    color: colors.secondary,
    fontSize: 16,
    marginBottom: 5,
  },
  detailValue: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  
  // Grid layouts
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    justifyContent: 'center',
    paddingTop: 10,
  },
  
  // Skeleton loading
  skeletonHeader: {
    width: '100%',
    height: 60,
    backgroundColor: colors.skeleton,
    marginBottom: 20,
  },
  skeletonImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    backgroundColor: colors.skeleton,
    marginBottom: 20,
  },
  skeletonText: {
    width: 150,
    height: 20,
    borderRadius: 4,
    backgroundColor: colors.skeleton,
    marginBottom: 10,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
});
