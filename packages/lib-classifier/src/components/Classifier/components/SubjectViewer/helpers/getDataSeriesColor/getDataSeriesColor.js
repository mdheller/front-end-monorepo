export default function getDataSeriesColor (seriesOptions = {}, seriesIndex, focusedSeries, themeColors) {
  const [[label, focused]] = Object.entries(focusedSeries)
  const { color } = seriesOptions
  const colorValues = Object.values(themeColors.drawingTools)
  if (focused) {
    return themeColors[color] ||
      color ||
      colorValues[seriesIndex]
  } else {
    return themeColors['light-1']
  }
}