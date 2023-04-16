FROM --platform=$BUILDPLATFORM andrius/asterisk
RUN apk --no-cache add curl jq aws-cli curl-dev
RUN aws --version
ENV CLUSTER_NAME=${CLUSTER_NAME}
COPY config/* /etc/asterisk
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
EXPOSE 5060/udp 
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["/usr/sbin/asterisk", "-cvvvdddf", "-T", "-W", "-U", "asterisk", "-p"]


