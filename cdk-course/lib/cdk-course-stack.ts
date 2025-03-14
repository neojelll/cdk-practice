import * as cdk from 'aws-cdk-lib'
import { Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront'
import { S3StaticWebsiteOrigin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { Bucket } from 'aws-cdk-lib/aws-s3'
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment'
// import {
// 	Cors,
// 	LambdaIntegration,
// 	ResourceOptions,
// 	RestApi,
// } from 'aws-cdk-lib/aws-apigateway'
// import { Alarm, Metric } from 'aws-cdk-lib/aws-cloudwatch'
// import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions'
// import { AttributeType, Billing, TableV2 } from 'aws-cdk-lib/aws-dynamodb'
// import { Runtime } from 'aws-cdk-lib/aws-lambda'
// import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
// import { Topic } from 'aws-cdk-lib/aws-sns'
// import {
// 	EmailSubscription,
// 	LambdaSubscription,
// } from 'aws-cdk-lib/aws-sns-subscriptions'
import { Construct } from 'constructs'
import { existsSync } from 'fs'
import { join } from 'path'

export class CdkCourseStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)

		// const emplTable = new TableV2(this, 'TS-EmplTable', {
		// 	partitionKey: {
		// 		name: 'id',
		// 		type: AttributeType.STRING,
		// 	},
		// 	billing: Billing.onDemand(),
		// 	removalPolicy: cdk.RemovalPolicy.DESTROY,
		// })

		// const emplLambda = new NodejsFunction(this, 'EmplLambda', {
		// 	runtime: Runtime.NODEJS_22_X,
		// 	handler: 'handler',
		// 	entry: join(__dirname, '..', 'services', 'handler.ts'),
		// 	environment: {
		// 		TABLE_NAME: emplTable.tableName,
		// 	},
		// })

		// emplTable.grantReadWriteData(emplLambda)

		// const optionsWithCors: ResourceOptions = {
		// 	defaultCorsPreflightOptions: {
		// 		allowOrigins: Cors.ALL_ORIGINS,
		// 		allowMethods: Cors.ALL_METHODS,
		// 	},
		// }

		// const api = new RestApi(this, 'EmplApi')
		// const emplResource = api.root.addResource('empl', optionsWithCors)

		// const emplLambdaIntegration = new LambdaIntegration(emplLambda)

		// emplResource.addMethod('GET', emplLambdaIntegration)
		// emplResource.addMethod('POST', emplLambdaIntegration)

		// const webHookLambda = new NodejsFunction(this, 'WebHookLambda', {
		// 	runtime: Runtime.NODEJS_22_X,
		// 	handler: 'handler',
		// 	entry: join(__dirname, '..', 'services', 'hook.ts'),
		// })

		// const alarmTopic = new Topic(this, 'AlarmTopic', {
		// 	displayName: 'AlarmTopic',
		// 	topicName: 'AlarmTopic',
		// })

		// alarmTopic.addSubscription(new LambdaSubscription(webHookLambda))
		// alarmTopic.addSubscription(new EmailSubscription('example@example.com'))

		// const sampleAlarm = new Alarm(this, 'ApiAlarm', {
		// 	metric: new Metric({
		// 		metricName: 'custom-error',
		// 		namespace: 'Custom',
		// 		period: cdk.Duration.minutes(1),
		// 		statistic: 'Sum',
		// 	}),
		// 	evaluationPeriods: 1,
		// 	threshold: 100,
		// })

		// const topicAction = new SnsAction(alarmTopic)
		// sampleAlarm.addAlarmAction(topicAction)
		// sampleAlarm.addOkAction(topicAction)

		// const apiAlarm = new Alarm(this, 'Api4xxAlarm', {
		// 	metric: new Metric({
		// 		metricName: '4XXError',
		// 		namespace: 'AWS/ApiGateway',
		// 		period: cdk.Duration.minutes(1),
		// 		statistic: 'Sum',
		// 		dimensionsMap: {
		// 			ApiName: 'EmplApi',
		// 		},
		// 	}),
		// 	evaluationPeriods: 1,
		// 	threshold: 1,
		// })

		// apiAlarm.addAlarmAction(topicAction)
		// apiAlarm.addOkAction(topicAction)

		const deploymentBucket = new Bucket(this, 'WebDeploymentBucket')

		const uiDir = join(__dirname, '..', '..', 'web', 'dist')
		if (!existsSync(uiDir)) {
			console.warn(`Ui dir not found: ${uiDir}`)
			return
		}

		const originIdentity = new OriginAccessIdentity(
			this,
			'OriginAccessIdentity'
		)
		deploymentBucket.grantRead(originIdentity)

		const distribution = new Distribution(this, 'WebDeploymentDistribution', {
			defaultRootObject: 'index.html',
			defaultBehavior: {
				origin: new S3StaticWebsiteOrigin(deploymentBucket),
			},
		})

		new BucketDeployment(this, 'WebDeployment', {
			destinationBucket: deploymentBucket,
			sources: [Source.asset(uiDir)],
			distribution: distribution,
		})

		new cdk.CfnOutput(this, 'AppUrl', {
			value: distribution.distributionDomainName,
		})
	}
}
