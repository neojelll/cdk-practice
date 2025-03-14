import { SNSEvent } from 'aws-lambda'

const webHookUrl = ''

export async function handler(event: SNSEvent) {
	for (const record of event.Records) {
		await fetch(webHookUrl, {
			method: 'POST',
			body: JSON.stringify({
				text: `Histon, we have a problem ${record.Sns.Message}`,
			}),
		})
	}
}
