#!/bin/sh

# run as user asterisk by default
ASTERISK_USER=${ASTERISK_USER:-asterisk}

if [ "$1" = "" ]; then
  COMMAND="/usr/sbin/asterisk -T -W -U ${ASTERISK_USER} -p -cvvvdddf"
else
  COMMAND="$@"
fi

echo "METADATA: " ${ECS_CONTAINER_METADATA_URI_V4}
curl -o metadata.json ${ECS_CONTAINER_METADATA_URI_V4}/task
cat metadata.json
TASK_ARN=$( curl ${ECS_CONTAINER_METADATA_URI_V4}/task | jq -r '.TaskARN' )
echo "TASK_ARN: " $TASK_ARN
CLUSTER=$( curl ${ECS_CONTAINER_METADATA_URI_V4}/task | jq -r '.Cluster' )
echo "CLUSTER: " $CLUSTER
ENI=$(aws ecs describe-tasks --tasks $TASK_ARN --cluster $CLUSTER | jq -r '.tasks[0].attachments[0].details[1].value' )
echo "ENI: " $ENI
PUBLIC_IP=$( aws ec2 describe-network-interfaces --network-interface-ids $ENI | jq -r '.NetworkInterfaces[0].Association.PublicIp' )
echo "PUBLIC_IP: ${PUBLIC_IP}"

sed -i "s/PUBLIC_IP/$PUBLIC_IP/g" /etc/asterisk/pjsip.conf

if [ "${ASTERISK_UID}" != "" ] && [ "${ASTERISK_GID}" != "" ]; then
  # recreate user and group for asterisk
  # if they've sent as env variables (i.e. to macth with host user to fix permissions for mounted folders

  deluser asterisk && \
  adduser --gecos "" --no-create-home --uid ${ASTERISK_UID} --disabled-password ${ASTERISK_USER} || exit

  chown -R ${ASTERISK_UID}:${ASTERISK_UID} /etc/asterisk \
                                           /var/*/asterisk \
                                           /usr/*/asterisk
fi

exec ${COMMAND}