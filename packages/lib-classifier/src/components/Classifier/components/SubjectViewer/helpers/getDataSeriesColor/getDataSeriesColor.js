export default function getDataSeriesColor (seriesOptions = {}, seriesIndex, focusedSeries, themeColors) {
  const [focused] = Object.values(focusedSeries[seriesIndex])
  const { color } = seriesOptions
  const colorValues = Object.values(themeColors.drawingTools)
  if (focused) {
    return themeColors[color] ||
      color ||
      colorValues[seriesIndex]
  } else {
    return themeColors['light-4']
  }
}