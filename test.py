# coding:utf-8
import hashlib
import random
import redis

_token = hashlib.md5(str(random.random()).encode("utf-8")).hexdigest()
print(_token)
