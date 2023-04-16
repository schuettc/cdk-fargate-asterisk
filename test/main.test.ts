import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const stackProps = {
  logLevel: process.env.LOG_LEVEL || 'INFO',
};
import { CDKFargateAsterisk } from '../src/cdk-fargate-asterisk';

test('Snapshot', () => {
  const app = new App();
  const stack = new CDKFargateAsterisk(app, 'test', {
    ...stackProps,
    env: devEnv,
  });

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});
