const axios = require('axios');

const sendSlackAlert = async (webhookUrl, message) => {
    if (!webhookUrl) return false;

    try {
        await axios.post(webhookUrl, {
            text: message,
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: message
                    }
                }
            ]
        });
        return true;
    } catch (error) {
        console.error('❌ Error sending Slack alert:', error.message);
        return false;
    }
};

module.exports = sendSlackAlert;
