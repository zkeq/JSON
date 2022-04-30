# coding:utf-8
# import hashlib
# import random
# import redis
# import re

# # _token = hashlib.md5(str(random.random()).encode("utf-8")).hexdigest()
# # print(_token)

# if re.match("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{1,24}$","dsadsadas451"):
#     print(1)

import sqlite3
conn = sqlite3.connect("db.db")
cur = conn.cursor()
cur.execute("SELECT * FROM `user`")
print(cur.fetchall())
cur.execute("SELECT `user_name` FROM `user` WHERE `id` = ?", [2])
print(cur.fetchall())
print(cur.fetchall())
conn.close()