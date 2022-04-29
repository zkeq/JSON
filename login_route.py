from flask import Blueprint, request, redirect, jsonify
from sql import sqlPool, redisPool
import requests
from tools import Tool
from config import ID, REDIRECT_URL, AK, API_URL

login_r = Blueprint('login', __name__, url_prefix='/api/login')
tool = Tool(redisPool)


@login_r.route("/")
def login():
    return redirect(f"{API_URL}/v2/connect?appid={ID}&redirect_uri={REDIRECT_URL}", code=302)


@login_r.post("/handler")
def login_handler():
    token = request.form.get("token")
    payload = {
        "appid": ID,
        "app_secret": AK,
        "token": token
    }
    data = requests.post(f"{API_URL}/v2/userInfo", data=payload).json()
    if data['code'] != 200:
        return jsonify({
            "success": False,
            "message": "login failed, please try again",
            "data": {},
        })
    openid = data['data']['openId']
    # find in sql
    conn = sqlPool.connection()
    cur = conn.cursor()
    cur.execute("SELECT `id`,`role` FROM `user` WHERE `open_id` = %s", openid)
    r = cur.fetchone()
    if not r:
        cur.execute("INSERT INTO `user` (`role`,`user_name`,`open_id`) VALUES (%s,%s,%s)", ('user', "", openid))
        role = 'user'
        userId = cur.lastrowid
        conn.commit()
    else:
        role = r[1]
        userId = r[0]

    if role != 'admin':
        return jsonify({
            "success": False,
            "message": "user not in admin list",
            "data": {},
        })
    cur.close()
    conn.close()
    tool_util = Tool(redisPool)
    token_r = tool_util.create_user_token(userId)
    return jsonify({
            "success": True,
            "message": "ok",
            "data": {
                "token": token_r
            },
        })


@login_r.route("/is_login", methods=["GET", "POST"])
def is_login():
    token = request.headers.get("Authorization")
    if not token or not tool.check_token(token):
        return jsonify({
            "success": False,
            "message": "login first",
            "data": {}
        })
    return jsonify({
            "success": True,
            "message": "ok",
            "data": {}
        })
