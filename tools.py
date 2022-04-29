# coding:utf-8
import hashlib
import random
import redis
import re
from dbutils.pooled_db import PooledDB
from sql import sqlPool, redisPool


class Tool:
    def __init__(self, redis_pool: redis.ConnectionPool):
        self.redis = redis.Redis(connection_pool=redis_pool, decode_responses=True)

    # 生成 token
    def create_user_token(self, userId: int):
        _token = hashlib.md5(str(random.random()).encode("utf-8")).hexdigest()
        _redis_key = f"json:{_token}"
        if self.redis.get(_redis_key):
            return self.create_user_token(userId)
        self.redis.setex(_redis_key, 60 * 60 * 24 * 7, userId)
        return _token

    def check_token(self, auth: str):
        # get_token
        token = auth
        tokenTmp = re.findall(r"^Bearer\s+(.*)$", auth)
        if tokenTmp:
            token = tokenTmp[0]
        # check
        _redis_key = f"json:{token}"
        if self.redis.get(_redis_key):
            return True
        return False

    def get_user_id(self, token: str):
        if not self.check_token(token):
            return False
        _redis_key = f"json:{token}"
        return self.redis.get(_redis_key)


class JsonTool:
    def __init__(self, sql_pool: PooledDB):
        self.conn = sql_pool.connection()
        self.cur = self.conn.cursor()

    def id_2_name(self, user_id):
        self.cur.execute("SELECT `user_name` FROM `user` WHERE `id` = %s", user_id)
        user = self.cur.fetchone()[0]
        self.conn.close()
        return user

    def id_route_2_data(self, user_id, data_name):
        self.cur.execute("SELECT `json_data` FROM `json` WHERE `user_id` = %s AND `route_name` = %s", (user_id, data_name))
        json_data = self.cur.fetchone()
        self.conn.close()
        return json_data

    def id_2_info(self, user_id, pages: int, limit: int):
        start = (pages - 1) * limit
        self.cur.execute("SELECT `route_name` FROM `json` WHERE `user_id` = %s LIMIT %s,%s", (user_id, start, limit))
        route_name = self.cur.fetchall()
        self.cur.execute("SELECT COUNT(*)  FROM `json` WHERE `user_id` = %s", user_id)
        all_route = self.cur.fetchone()[0]
        self.conn.close()
        return route_name, all_route

