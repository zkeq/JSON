import redis
import sqlite3
# 创建连接池
redisPool = redis.ConnectionPool(host='127.0.0.1', port=6379, max_connections=20)
sqlPool = sqlite3
