FROM node:8

LABEL maintainer="Jose Quintana <joseluisq.net>"

WORKDIR /
RUN git clone --depth 1 https://github.com/wolfcw/libfaketime.git
WORKDIR /libfaketime/src
RUN make install

ENV WORKDIR=/usr/src/app
ENV LOG_DIR_PATH=/var/log/logger

WORKDIR $WORKDIR

COPY . .

VOLUME [ $WORKDIR ]

ENTRYPOINT npm run dev
