export default function getCheckBoxTheme (color) {
  return {
    checkBox: {
      border: {
        color: {
          dark: color,
          light: color
        }
      },
      color: {
        dark: color,
        light: color
      },
      gap: 'xsmall',
      // icons: {
      //   checked: Circle
      // },
      size: '12px'
    },
  }
}