export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const webhookUrl = process.env.WEBHOOK_URL;

    if (!webhookUrl) {
        return res.status(500).json({ error: 'Server misconfiguration: WEBHOOK_URL not set' });
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });

        if (!response.ok) {
            throw new Error(`Webhook error: ${response.statusText}`);
        }

        return res.status(200).json({ success: true, message: 'Lead sent successfully' });
    } catch (error) {
        console.error('Error sending lead:', error);
        return res.status(500).json({ error: 'Failed to send lead' });
    }
}
