import pymysql
from dbutils.pooled_db import PooledDB
import redis

# 创建连接池
sqlPool: PooledDB = PooledDB(pymysql, 5, host="127.0.0.1", user='json', passwd='TnaYzrpY8DyfBYpZ', db='json', port=3306, charset="utf8mb4")
redisPool = redis.ConnectionPool(host='127.0.0.1', port=6379, max_connections=20)
