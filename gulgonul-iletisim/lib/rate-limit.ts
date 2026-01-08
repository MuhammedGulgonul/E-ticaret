// Simple rate limiting to prevent spam
const rateLimitMap = new Map<string, number[]>()

export function checkRateLimit(ip: string, maxRequests: number = 3, windowMs: number = 3600000): boolean {
    const now = Date.now()
    const timestamps = rateLimitMap.get(ip) || []

    // Remove old timestamps outside the window
    const validTimestamps = timestamps.filter(t => now - t < windowMs)

    if (validTimestamps.length >= maxRequests) {
        return false // Rate limit exceeded
    }

    validTimestamps.push(now)
    rateLimitMap.set(ip, validTimestamps)

    return true // Rate limit OK
}
