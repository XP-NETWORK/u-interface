import { LoadingBubble } from 'components/Tokens/loading'
import { PropsWithChildren } from 'react'
import styled from 'styled-components'

const Container = styled.div<{
  $width?: number
  $minWidth?: number
  $maxWidth?: number
  $justifyContent?: string
  $grow?: boolean
}>`
  ${({ $width }) => `width: ${$width}px`};
  ${({ $minWidth }) => `min-width: ${$minWidth}px`};
  ${({ $maxWidth }) => `min-width: ${$maxWidth}px`};
  flex: ${({ $grow }) => ($grow ? '1' : '0')};
  display: flex;
  justify-content: ${({ $justifyContent }) => $justifyContent ?? 'flex-end'};
  align-items: center;
  font-variant-numeric: tabular-nums;
  overflow: hidden;
  padding: 12px 8px;
`
const LoadingDataBubble = styled(LoadingBubble)`
  width: 75%;
  height: 16px;
`
export function Cell({
  loading,
  width,
  minWidth,
  maxWidth,
  justifyContent,
  grow,
  children,
}: PropsWithChildren<{
  loading?: boolean
  width?: number
  minWidth?: number
  maxWidth?: number
  grow?: boolean
  justifyContent?: string
}>) {
  return (
    <Container $width={width} $minWidth={minWidth} $maxWidth={maxWidth} $grow={grow} $justifyContent={justifyContent}>
      {loading ? <LoadingDataBubble /> : children}
    </Container>
  )
}
