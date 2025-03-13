export const colors = {
    primary: '#5f33e1',
    secondary: '#303030',
    background: '#000000',
    text: '#ffffff',
    textSecondary: '#aaaaaa',
    border: '#404040',
    error: '#ff3b30',
    success: '#34c759',
    inputBackground: '#303030',
  };
  
  export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  };
  
  export const typography = {
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    subheader: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    body: {
      fontSize: 16,
      color: colors.text,
    },
    caption: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  };
  
  export const layouts = {
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  };