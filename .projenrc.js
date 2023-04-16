const { awscdk } = require('projen');
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.70.0',
  defaultReleaseBranch: 'main',
  name: 'cdk-fargate-asterisk',
  license: 'MIT-0',
  author: 'Court Schuett',
  copyrightOwner: 'Court Schuett',
  authorAddress: 'https://aws.amazon.com',
  defaultReleaseBranch: 'main',
  appEntrypoint: 'cdk-fargate-asterisk.ts',
  depsUpgradeOptions: {
    ignoreProjen: false,
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['schuettc'],
  },
  deps: ['dotenv'],
  autoApproveUpgrades: true,
  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',
  defaultReleaseBranch: 'main',
});

const common_exclude = [
  '.yalc',
  'cdk.out',
  'cdk.context.json',
  'yarn-error.log',
  'dependabot.yml',
  '.DS_Store',
];

project.addTask('launch', {
  exec: 'yarn && yarn projen && yarn build && yarn cdk bootstrap && yarn cdk deploy --require-approval never',
});

project.gitignore.exclude(...common_exclude);
project.synth();
