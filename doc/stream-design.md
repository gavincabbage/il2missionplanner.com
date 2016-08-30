# Stream Design

## Overview

Use Redis, accessed via Webdis, as a message broker and system of record for
the mission streaming feature.

## Operations

1. **Start** a new stream and begin streaming.
2. **Reconnect** to an existing stream and begin streaming.
3. **Stop** streaming and disconnect from a stream. Q: Does this delete the stream?
4. **Connect** to a stream and begin receiving.
5. **Disconnect** from a stream and stop receiving.
6. **Stream** current state by publishing to Webdis/Redis.
7. **Receive** current state via subscription message from Webdis/Redis.
8. **List** all active streams.

## Out of Scope

- **Multiple leaders.** While technically possible, multiple leaders will overwrite
one another's changes naively. In general, the system is only intended to have one leader
streaming their mission plan.

## Schemata

### Stream Record

Stored as hashes with key of form `stream:name` where name is unique.

    stream:name {
        name            # stream name
        pw              # password
        code            # leader code
        channel         # channel for publishing and subscribing
        state           # latest recorded stream state
    }

### Stream Publish

Parameters required by Lua publishing script.

    {
        name            # stream name
        pw              # password
        code            # leader code
        state           # new state to publish
    }

## Operation: Start

1. User enters stream name, password and leader code.
2. Stream entry is added to Redis via Webdis call.

    --Lua
    KEYS stream:<name>
    --if it does not exist then
    HMSET stream:<name> name <name> pw <pw> code <code> state '{}'

3. Client state.streaming set to `true`, enabling publishing logic.

## Operation: Reconnect

1. User selects stream, enters password and leader code.
2. Existence of stream is checked, then password and leader code.

    --Lua
    HGETALL stream:<name>
    --then check pw and code
    --return true

3. Client state.streaming set to `true`, enabling publishing logic.

## Operation: Stop

1. Stream entry is removed from Redis.

    DEL stream:<name>

2. Client state.streaming set to false, disabling publishing logic.

## Operation: Connect

1. User selects stream, enters password.
2. Existence of stream is checked, then password. Stream channel returned.

    --Lua
    KEYS stream:<name>
    --if it exists, check password
    --if password is correct, return stream channel for client to subscribe

3. Client state.connectedToStream set to true, enabling view mode.
4. Subscribe to stream channel.

    SUBSCRIBE <stream>

5. Update state with each chunk from channel.

## Operation: Disconnect

1. Stream channel subscription is ended.

    UNSUBSCRIBE <stream>
    --or just end http connection?

2. Client state.connectedToStream set to false, disabling view mode.

## Operation: Stream

1. On state change, export state.
2. Call publishing Lua script with new state, password and leader code.
3. Lua script will check password and leader code.
4. Lua script will publish new state to stream's channel.
5. Lua script will set hash record's state to new state.

## Operation: Receive

1. Receive chunk with new state.
2. Import new state.

## Operation: List

1. List all streams.

    KEYS stream:*

## Misc. Notes

- Webdis Command Whitelist: https://github.com/nicolasff/webdis/issues/76
