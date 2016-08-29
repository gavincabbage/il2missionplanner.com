# Stream Server Setup notes

Using latest Amazon Linux 64-bit AMI,

## Install Redis and Webdis

1. Build Redis from source using [quickstart](http://redis.io/topics/quickstart) documentation.
2. Followed "Installing Redis more properly" steps to solidify install.
3. Build Webdis from source using [instructions](http://webd.is/).
4. Adapt Redis' "Installling Redis more properly" steps to solidify Webdis install (namely creating webdis service).

A notes on the install process:

- Had to install a few dependencies including `libevent-devel`
- Had to manually tell `gcc` which malloc to use with `MALLOC=libc` to get rid of `jemalloc.h` errors.
- Had to use `chkconfig` and `service` instead of Debian equivalents described in Quickstart.

To version:

- /etc/init.d/webdis
- /etc/init.d/redis_6379
- /etc/redis/redis.conf
- /etc/webdis/webdis.json
