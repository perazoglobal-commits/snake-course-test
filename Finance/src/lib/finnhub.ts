export async function fetchClosingPrice(symbol: string): Promise<number | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol.toUpperCase())}?interval=1d&range=1d`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json()
    const price: number | undefined = data?.chart?.result?.[0]?.meta?.regularMarketPrice
    return price && price > 0 ? price : null
  } catch {
    return null
  }
}
