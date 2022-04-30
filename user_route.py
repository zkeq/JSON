from functools import wraps
from flask import Blueprint, request, redirect, jsonify
from sql import sqlPool, redisPool
import re
import requests
from tools import JsonTool, Tool
from config import ID, REDIRECT_URL, AK, API_URL
import redis

user_r = Blueprint('user', __name__, url_prefix='/api/user')
tool = Tool(redisPool)
json_tools = JsonTool(sqlPool)


def user_decorator():
    def _user_decorator(f):
        @wraps(f)
        def __user_decorator(*args, **kwargs):
            # check user if login
            token = request.headers.get("Authorization")
            if not token or not tool.check_token(token):
                return jsonify({
                    "success": False,
                    "message": "permission denied",
                    "data": {}
                }), 401
            result = f(*args, **kwargs)
            return result
        return __user_decorator
    return _user_decorator


@user_r.route("/set_username", methods=["POST"])
@user_decorator()
def update_user_name():
    # get token
    form_data = request.form
    auth = request.headers.get("Authorization")
    token = re.findall(r"^Bearer\s+(.*)$", auth)[0]
    new_user_name = form_data['username']
    # get user id
    user_id = tool.get_user_id(token)
    # check in sql , it has yet?
    # get user name
    user_name = json_tools.id_2_name(user_id)
    conn = sqlPool.connect("db.db")
    cur = conn.cursor()
    cur.execute("SELECT `id` FROM `user` WHERE `user_name` = ?", [new_user_name])
    user_exists = cur.fetchone()
    if user_exists:
        return {
            "message": "user exists!",
            "success": False
        }
    cur.execute("UPDATE `user` SET `user_name` = ? WHERE `id` = ?",
                [new_user_name, user_id])
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(
        {
            "message": "Success update user name INFO",
            "success": True,
            "data": {
                "old": user_name,
                "new": new_user_name
            }
        }
    )


@user_r.route("/get_username", methods=["POST"])
@user_decorator()
def user_name():
    # get token
    auth = request.headers.get("Authorization")
    token = re.findall(r"^Bearer\s+(.*)$", auth)[0]
    # get user id
    user_id = tool.get_user_id(token)
    # get user name
    user_name = json_tools.id_2_name(user_id)
    return jsonify({
        "message": "success info",
        "success": True,
        "data": {
            "username": user_name
        }
    })
