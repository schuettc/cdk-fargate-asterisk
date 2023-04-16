import { SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class VPCResources extends Construct {
  public securityGroup: SecurityGroup;
  public vpc: Vpc;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.vpc = new Vpc(this, 'VPC', {
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'AsteriskPublic',
          subnetType: SubnetType.PUBLIC,
          mapPublicIpOnLaunch: true,
        },
      ],
      maxAzs: 2,
    });

    this.securityGroup = new SecurityGroup(this, 'AsteriskSecurityGroup', {
      vpc: this.vpc,
      description: 'Security Group for Asterisk Instance',
      allowAllOutbound: true,
    });
  }
}
