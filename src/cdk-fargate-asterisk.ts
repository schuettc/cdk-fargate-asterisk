/* eslint-disable import/no-extraneous-dependencies */
import { App, Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { config } from 'dotenv';
import { ECSResources, VPCResources } from '.';

config();

export interface CDKFargateAsteriskProps extends StackProps {
  logLevel: string;
}

export class CDKFargateAsterisk extends Stack {
  constructor(scope: Construct, id: string, props: CDKFargateAsteriskProps) {
    super(scope, id, props);
    const vpcResources = new VPCResources(this, 'VPCResources');

    const ecsResources = new ECSResources(this, 'ECSResources', {
      vpc: vpcResources.vpc,
      securityGroup: vpcResources.securityGroup,
      logLevel: props.logLevel,
    });

    new CfnOutput(this, 'ClusterArn', {
      value: 'CLUSTER=' + ecsResources.cluster.clusterArn,
    });
    new CfnOutput(this, 'getTask', {
      value:
        'TASK=$( aws ecs list-tasks --cluster $CLUSTER --query taskArns --output text )',
    });

    new CfnOutput(this, 'ecsExecuteAsterisk', {
      value:
        'aws ecs execute-command --cluster $CLUSTER --task $TASK --command "asterisk -rvvvvvv" --interactive',
    });
    new CfnOutput(this, 'ecsExecuteSh', {
      value:
        'aws ecs execute-command --cluster $CLUSTER --task $TASK --command "sh" --interactive',
    });
  }
}

const app = new App();

const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const stackProps = {
  logLevel: process.env.LOG_LEVEL || 'INFO',
};

new CDKFargateAsterisk(app, 'cdk-fargate-asterisk', {
  ...stackProps,
  env: devEnv,
});

app.synth();
