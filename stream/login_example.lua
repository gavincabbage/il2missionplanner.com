local jsonPayload = ARGV[1]

if not jsonPayload then
    return 'No such json data'
end

local user = cjson.decode(jsonPayload)

if not user.login then
    return 'User login is not set'
end

if not user.password then
    return 'User password is not set'
end

local expectedPassword = redis.call('HGET', 'users', user.login)
if not expectedPassword then
    return 0
end

if expectedPassword ~= user.password then
    return 0
end

return 1
