FROM dockerfile/nodejs

MAINTAINER Matthias Luebken, matthias@catalyst-zero.com

WORKDIR /home/micd

# Install Micd.JS Prerequisites
RUN npm install -g grunt-cli
RUN npm install -g bower

# Install Micd.JS packages
ADD package.json /home/micd/package.json
RUN npm install

# Manually trigger bower. Why doesnt this work via npm install?
ADD .bowerrc /home/micd/.bowerrc
ADD bower.json /home/micd/bower.json
RUN bower install --config.interactive=false --allow-root

# Make everything available for start
ADD . /home/micd

# currently only works for production
ENV NODE_ENV production

# Port 3000 for server
# Port 35729 for livereload
EXPOSE 3000 35729
CMD ["grunt"]
