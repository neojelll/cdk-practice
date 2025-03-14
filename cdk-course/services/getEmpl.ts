import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'

export async function getEmpl(
	event: APIGatewayEvent,
	ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
	if (event.queryStringParameters && 'id' in event.queryStringParameters) {
		const emplId = event.queryStringParameters['id']!
		const getItemResponse = await ddbClient.send(
			new GetItemCommand({
				TableName: process.env.TABLE_NAME,
				Key: {
					id: { S: emplId },
				},
			})
		)

		if (getItemResponse.Item) {
			const unmarshalledItem = unmarshall(getItemResponse.Item)
			return {
				statusCode: 200,
				body: JSON.stringify(unmarshalledItem),
			}
		}
	}

	return {
		statusCode: 400,
		body: JSON.stringify('something is wrong!'),
	}
}
