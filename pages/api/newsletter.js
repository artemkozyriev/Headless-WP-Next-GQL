import axios from "axios";

export default async function handler(req, res) {

    const apiKey = process.env.CAMPAIGN_MONITOR_API_KEY;
    const audienceId = process.env.NEXT_PUBLIC_AUDIENCE_ID;

    const auth = btoa(`${apiKey}:`);
    const requestData = {
        EmailAddress: req.body.email,
        Resubscribe: true,
        ConsentToTrack: 'Yes',
    };

    try {
        const response = await axios.post(
            `https://api.createsend.com/api/v3.2/subscribers/${audienceId}.json`,
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    Authorization: `Basic ${auth}`,
                },
            }
        )

        

        return res.status(200).json({'success': true})
    } catch (error) {
        return res.status(200).json({'success': false, 'error': error.toString()})
    }

}