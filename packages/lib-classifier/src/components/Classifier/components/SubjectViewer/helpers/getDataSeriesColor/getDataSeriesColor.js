export default function getDataSeriesColor (series, seriesIndex, focusedSeries, themeColors) {
  const [[label, focused]] = Object.entries(focusedSeries)
  const dataSeriesColor = series.seriesOptions?.color
  const colorValues = Object.values(themeColors.drawingTools)
  if (focused) {
    return themeColors[dataSeriesColor] ||
      dataSeriesColor ||
      colorValues[seriesIndex]
  } else {
    return themeColors['light-1']
  }
}