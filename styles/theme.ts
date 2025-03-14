// Create a new theme file with minimalist colors
export const theme = {
  light: {
    background: '#ffffff',
    surface: '#f8fafc',
    primary: '#0f172a',
    secondary: '#64748b',
    accent: '#0891b2',
    border: '#e2e8f0',
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
      inverse: '#ffffff',
    }
  },
  dark: {
    background: '#0f172a',
    surface: '#1e293b',
    primary: '#f8fafc',
    secondary: '#94a3b8',
    accent: '#0891b2',
    border: '#334155',
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
      inverse: '#0f172a',
    }
  }
};

// Update component styles
const styles = StyleSheet.create({
  deviceCard: {
    backgroundColor: theme.light.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.light.border,
  },
  darkCard: {
    backgroundColor: theme.dark.surface,
    borderColor: theme.dark.border,
  },
  input: {
    backgroundColor: theme.light.surface,
    borderWidth: 1,
    borderColor: theme.light.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.light.text.primary,
  },
  darkInput: {
    backgroundColor: theme.dark.surface,
    borderColor: theme.dark.border,
    color: theme.dark.text.primary,
  },
  button: {
    backgroundColor: theme.light.accent,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.light.text.inverse,
    fontSize: 16,
    fontWeight: '500',
  },
  copyableField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  copyText: {
    fontSize: 14,
    color: theme.light.accent,
    fontWeight: '500',
  },
}); 