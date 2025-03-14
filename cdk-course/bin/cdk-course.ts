#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { CdkCourseStack } from '../lib/cdk-course-stack'

const app = new cdk.App()
new CdkCourseStack(app, 'CdkCourseStack', {})
