import { z } from "zod";

// Lead validation schema
const leadSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email().optional(),
    phone: z.string().min(10).max(20),
    message: z.string().max(1000).optional(),
    source: z.string().max(50).optional(),
});

// Simple rate limiting (in-memory, resets on serverless function restart)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // max 5 requests per minute per IP

function checkRateLimit(ip) {
    const now = Date.now();
    const userRequests = rateLimitMap.get(ip) || [];

    // Remove old requests outside the window
    const recentRequests = userRequests.filter(
        (timestamp) => now - timestamp < RATE_LIMIT_WINDOW,
    );

    if (recentRequests.length >= MAX_REQUESTS) {
        return false;
    }

    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);
    return true;
}

export default async function handler(req, res) {
    // CORS headers (allow only specific domains in production)
    const allowedOrigins = [
        "https://brjoy.com.br",
        "https://www.brjoy.com.br",
        "http://localhost:4321",
        "http://localhost:3000",
    ];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // Rate limiting
    const ip =
        req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || "unknown";
    if (!checkRateLimit(ip)) {
        return res.status(429).json({
            error: "Too many requests. Please try again later.",
        });
    }

    // Validate webhook URL
    const webhookUrl = process.env.WEBHOOK_URL;
    if (!webhookUrl) {
        console.error("WEBHOOK_URL not configured");
        return res.status(500).json({ error: "Server misconfiguration" });
    }

    try {
        // Validate request body
        const validatedData = leadSchema.parse(req.body);

        // Sanitize data (basic XSS prevention)
        const sanitizedData = {
            name: validatedData.name.trim(),
            email: validatedData.email?.trim(),
            phone: validatedData.phone.replace(/[^\d+\s()-]/g, ""),
            message: validatedData.message?.trim(),
            source: validatedData.source?.trim(),
            timestamp: new Date().toISOString(),
            ip: ip !== "unknown" ? ip : undefined,
        };

        // Send to webhook
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(sanitizedData),
        });

        if (!response.ok) {
            throw new Error(`Webhook returned ${response.status}`);
        }

        return res.status(200).json({
            success: true,
            message: "Lead sent successfully",
        });
    } catch (error) {
        // Handle validation errors
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: "Invalid data",
                details: error.errors.map((e) => ({
                    field: e.path.join("."),
                    message: e.message,
                })),
            });
        }

        // Log error (should use proper logging service in production)
        console.error("Error sending lead:", error.message);

        return res.status(500).json({
            error: "Failed to send lead. Please try again.",
        });
    }
}
