local streamName = ARGV[1]
local password = ARGV[2]

if not streamName or not password then
    return 0
end

local stream = redis.call('HGETALL', 'stream:' .. streamName)
if not stream then
    return 0
end

if stream.pw ~= password then
    return 0
end

return stream.channel
