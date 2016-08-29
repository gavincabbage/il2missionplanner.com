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

## Operation: Start

## Operation: Reconnect

## Operation: Stop

## Operation: Connect

## Operation: Disconnect

## Operation: Stream

## Operation: Receive

## Misc. Notes

- Webdis Command Whitelist: https://github.com/nicolasff/webdis/issues/76
