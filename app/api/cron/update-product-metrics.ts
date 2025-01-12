import type { NextApiRequest, NextApiResponse } from 'next'
import { calculateProductMetrics } from '@/lib/jobs/product-metrics'

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  // Verify cron job secret for security
  if (req.method !== 'POST' || 
      req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    await calculateProductMetrics()
    res.status(200).json({ message: 'Metrics updated successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error updating metrics' })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}