import { NextResponse } from 'next/server';
import axios from 'axios';

// CoinMarketCap API key
const CMC_API_KEY = 'c3c7f080-d991-4176-90c9-bd60024f20a1';
const ZORA_CONTRACT_ADDRESS = '0x1111111111166b7fe7bd91427724b487980afc69';

// Define types for the data structure
interface PriceData {
  price: number;
  volume: number;
  market_cap?: number;
  source: string;
}

interface HistoricalQuote {
  date: string;
  close: number;
}

interface HistoricalData {
  quotes: HistoricalQuote[];
  source: string;
}

// Cache to prevent excessive API calls
interface Cache<T> {
  data: T | null;
  timestamp: number;
  expiryTime: number;
}

let priceCache: Cache<PriceData> = {
  data: null,
  timestamp: 0,
  expiryTime: 60000 // 1 minute cache
};

let historicalCache: Cache<HistoricalData> = {
  data: null,
  timestamp: 0,
  expiryTime: 300000 // 5 minutes cache
};

// Fallback data in case API fails
const ZORA_FALLBACK_DATA = {
  current: {
    price: 0.0142,
    volume: 21500000, // $21.5M
    source: 'fallback'
  } as PriceData,
  historical: {
    quotes: [
      { date: '2023-05-21', close: 1.32 },
      { date: '2023-05-22', close: 1.36 },
      { date: '2023-05-23', close: 1.38 },
      { date: '2023-05-24', close: 1.29 },
      { date: '2023-05-25', close: 1.42 },
      { date: '2023-05-26', close: 1.45 },
      { date: '2023-05-27', close: 1.40 }
    ],
    source: 'fallback'
  } as HistoricalData
};

async function fetchCurrentPrice(): Promise<PriceData> {
  // Check if cache is valid
  const now = Date.now();
  if (priceCache.data && now - priceCache.timestamp < priceCache.expiryTime) {
    console.log('Using cached current price data');
    return priceCache.data;
  }
  
  try {
    const response = await axios.get(
      'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest', 
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY
        },
        params: {
          address: ZORA_CONTRACT_ADDRESS,
          convert: 'USD'
        }
      }
    );
    
    // Find the first entry in the data
    const dataValues = Object.values(response.data.data || {});
    if (dataValues.length === 0) {
      throw new Error('No data returned from CoinMarketCap');
    }
    
    const zoraData = dataValues[0] as any;
    
    if (zoraData && zoraData.quote && zoraData.quote.USD) {
      const result: PriceData = {
        price: zoraData.quote.USD.price,
        volume: zoraData.quote.USD.volume_24h,
        market_cap: zoraData.quote.USD.market_cap,
        source: 'coinmarketcap'
      };
      
      // Update cache
      priceCache = {
        data: result,
        timestamp: now,
        expiryTime: priceCache.expiryTime
      };
      
      return result;
    }
    
    throw new Error('Invalid response structure from CoinMarketCap');
  } catch (error) {
    console.error('Error fetching price from CoinMarketCap:', error);
    return ZORA_FALLBACK_DATA.current;
  }
}

async function fetchHistoricalData(): Promise<HistoricalData> {
  // Check if cache is valid
  const now = Date.now();
  if (historicalCache.data && now - historicalCache.timestamp < historicalCache.expiryTime) {
    console.log('Using cached historical data');
    return historicalCache.data;
  }
  
  try {
    // Get the last 7 days of historical data
    const response = await axios.get(
      'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/historical',
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY
        },
        params: {
          address: ZORA_CONTRACT_ADDRESS,
          convert: 'USD',
          interval: 'daily',
          count: 7, // Last 7 days
          time_end: Math.floor(Date.now() / 1000) // Now in Unix timestamp
        }
      }
    );
    
    // Find the first entry in the data
    const dataValues = Object.values(response.data.data || {});
    if (dataValues.length === 0) {
      throw new Error('No historical data returned from CoinMarketCap');
    }
    
    const zoraData = dataValues[0] as any;
    
    if (zoraData && zoraData.quotes && Array.isArray(zoraData.quotes)) {
      const quotes = zoraData.quotes.map((quote: any) => ({
        date: new Date(quote.timestamp).toISOString(),
        close: quote.quote.USD.price
      }));
      
      const result: HistoricalData = {
        quotes,
        source: 'coinmarketcap'
      };
      
      // Update cache
      historicalCache = {
        data: result,
        timestamp: now,
        expiryTime: historicalCache.expiryTime
      };
      
      return result;
    }
    
    throw new Error('Invalid historical data structure from CoinMarketCap');
  } catch (error) {
    console.error('Error fetching historical data from CoinMarketCap:', error);
    
    // Generate proper dates for the fallback data (last 7 days)
    const today = new Date();
    const quotes = ZORA_FALLBACK_DATA.historical.quotes.map((quote, index) => {
      const date = new Date();
      date.setDate(today.getDate() - (6 - index));
      return {
        date: date.toISOString(),
        close: quote.close
      };
    });
    
    return {
      quotes,
      source: 'fallback'
    };
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  
  console.log(`API request for ${type} data`);
  
  try {
    if (type === 'current') {
      const currentData = await fetchCurrentPrice();
      
      return NextResponse.json({
        price: currentData.price,
        volume: currentData.volume,
        status: 'success',
        source: currentData.source
      });
    } 
    else if (type === 'historical') {
      const historicalData = await fetchHistoricalData();
      
      return NextResponse.json({
        quotes: historicalData.quotes,
        status: 'success',
        source: historicalData.source
      });
    } 
    else {
      return NextResponse.json(
        { error: 'Invalid request type' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('API Error:', error);
    
    // Return fallback data on error
    if (type === 'current') {
      return NextResponse.json({
        price: ZORA_FALLBACK_DATA.current.price,
        volume: ZORA_FALLBACK_DATA.current.volume,
        status: 'success',
        source: 'fallback'
      });
    } else {
      // Generate proper dates for the chart (last 7 days)
      const today = new Date();
      const quotes = ZORA_FALLBACK_DATA.historical.quotes.map((quote, index) => {
        const date = new Date();
        date.setDate(today.getDate() - (6 - index));
        return {
          date: date.toISOString(),
          close: quote.close
        };
      });
      
      return NextResponse.json({
        quotes,
        status: 'success',
        source: 'fallback'
      });
    }
  }
} 