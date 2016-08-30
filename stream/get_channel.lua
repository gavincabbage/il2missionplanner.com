local streamName = ARGV[1]
local password = ARGV[2]

if not streamName or not password then
    return 1
end

local expectedPassword = redis.call('HGET', streamName, 'pw')
if not password then
    return 2
end

if expectedPassword ~= password then
    return 3
end

local channel = redis.call('HGET', streamName, 'channel')
return channel
