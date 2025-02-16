import { ParentSize } from '@visx/responsive'
import { ChartType, PriceChartType } from 'components/Charts/utils'
import { VolumeChart } from 'components/Charts/VolumeChart'
import { LoadingChart } from 'components/Tokens/TokenDetails/Skeleton'
import { useInfoTDPEnabled } from 'featureFlags/flags/infoTDP'
import { TokenPriceQuery } from 'graphql/data/TokenPrice'
import { isPricePoint, PricePoint, TimePeriod } from 'graphql/data/util'
import { Suspense, useMemo } from 'react'
import styled from 'styled-components'

import { PriceChart } from '../../Charts/PriceChart'
import TimePeriodSelector from './TimeSelector'

const TDP_CHART_HEIGHT_PX = 392

export const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 436px;
  margin-bottom: 24px;
  align-items: flex-start;
  width: 100%;
`

function usePriceHistory(tokenPriceData: TokenPriceQuery): PricePoint[] | undefined {
  // Appends the current price to the end of the priceHistory array
  const priceHistory = useMemo(() => {
    const market = tokenPriceData.token?.market
    const priceHistory = market?.priceHistory?.filter(isPricePoint)
    const currentPrice = market?.price?.value
    if (Array.isArray(priceHistory) && currentPrice !== undefined) {
      const timestamp = Date.now() / 1000
      return [...priceHistory, { timestamp, value: currentPrice }]
    }
    return priceHistory
  }, [tokenPriceData])

  return priceHistory
}
export default function ChartSection({
  chartType,
  priceChartType,
  timePeriod,
  onChangeTimePeriod,
  tokenPriceQuery,
  extractedColor,
}: {
  chartType: ChartType
  priceChartType?: PriceChartType
  timePeriod: TimePeriod
  onChangeTimePeriod: (t: TimePeriod) => void
  tokenPriceQuery?: TokenPriceQuery
  extractedColor: string
}) {
  if (!tokenPriceQuery) {
    return <LoadingChart />
  }

  return (
    <Suspense fallback={<LoadingChart />}>
      <ChartContainer data-testid="chart-container">
        <Chart
          chartType={chartType}
          priceChartType={priceChartType}
          timePeriod={timePeriod}
          tokenPriceQuery={tokenPriceQuery}
          extractedColor={extractedColor}
        />
        <TimePeriodSelector timePeriod={timePeriod} onChangeTimePeriod={onChangeTimePeriod} />
      </ChartContainer>
    </Suspense>
  )
}

function Chart({
  chartType,
  priceChartType,
  timePeriod,
  tokenPriceQuery,
  extractedColor,
}: {
  chartType: ChartType
  priceChartType?: PriceChartType
  timePeriod: TimePeriod
  tokenPriceQuery: TokenPriceQuery
  extractedColor: string
}) {
  const prices = usePriceHistory(tokenPriceQuery)

  const isInfoTDPEnabled = useInfoTDPEnabled()
  if (!isInfoTDPEnabled) {
    return (
      <ParentSize>
        {({ width }) => (
          <PriceChart prices={prices} width={width} height={TDP_CHART_HEIGHT_PX} timePeriod={timePeriod} />
        )}
      </ParentSize>
    )
  }

  switch (chartType) {
    case ChartType.PRICE:
      if (priceChartType === PriceChartType.CANDLESTICK) {
        return null
      }
      return (
        <ParentSize>
          {({ width }) => (
            <PriceChart prices={prices} width={width} height={TDP_CHART_HEIGHT_PX} timePeriod={timePeriod} />
          )}
        </ParentSize>
      )
    case ChartType.VOLUME:
      return (
        <VolumeChart
          volumes={prices}
          timePeriod={timePeriod}
          height={TDP_CHART_HEIGHT_PX}
          extractedColor={extractedColor}
        />
      )
    default:
      return null
  }
}
