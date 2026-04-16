const axios = require('axios');

const sendSlackAlert = async (webhookUrl, message) => {
    if (!webhookUrl) {
        console.log('⚠️  No Slack webhook URL provided. Alert skipped.');
        return false;
    }

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
        console.log('✅ Slack alert sent successfully!');
        return true;
    } catch (error) {
        console.error('❌ Error sending Slack alert:', error.message);
        return false;
    }
};

module.exports = sendSlackAlert;
