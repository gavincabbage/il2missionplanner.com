local streamName = ARGV[1]
local password = ARGV[2]

if not streamName or not password then
    return 1
end

local stream = redis.call('HGETALL', streamName)
if not stream then
    return 2
end

if stream.pw ~= password then
    return 3
end

return stream.channel
