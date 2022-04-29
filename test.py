# coding:utf-8
import hashlib
import random
import redis
import re

# _token = hashlib.md5(str(random.random()).encode("utf-8")).hexdigest()
# print(_token)

if re.match("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{1,24}$","dsadsadas451"):
    print(1)