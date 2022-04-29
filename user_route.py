from flask import Blueprint, request, redirect, jsonify
from sql import sqlPool, redisPool
import requests
from tools import Tool
from config import ID, REDIRECT_URL, AK, API_URL

user_r = Blueprint('user', __name__, url_prefix='/api/user')
tool = Tool(redisPool)
json_tools = JsonTool(sqlPool)


@json_r.route("/info", methods=["GET"])
@json_decorator()
def info():
    # get token
    pages = request.args.get("page")
    limit = request.args.get("limit")
    auth = request.headers.get("Authorization")
    token = re.findall(r"^Bearer\s+(.*)$", auth)[0]
    # get user id
    user_id = tool.get_user_id(token)
    # get user name
    user_name = json_tools.id_2_name(user_id)[0]
    # get user data
    route_name, count = json_tools.id_2_info(user_id, int(pages), int(limit))
    route_list = []
    for i in route_name:
        route_list.append(i[0])
    return jsonify({
        "message": "success info",
        "success": False,
        "data":
            {
                "username": user_name,
                "route_name": route_list,
                "count": count
            }
    })


@json_r.route("/update_data_name", methods=["POST"])
@json_decorator()
def update_data_name():
    # get token
    form_data = request.form
    auth = request.headers.get("Authorization")
    token = re.findall(r"^Bearer\s+(.*)$", auth)[0]
    data_name = form_data['data_name']
    new_data_name = form_data['new_data_name']
    # get user id
    user_id = tool.get_user_id(token)
    # get user name
    user = json_tools.id_2_name(user_id)[0]
    # get user json_content
    json_data = json_tools.id_route_2_data(user_id, data_name)
    # check in sql , it has yet?
    if json_data:
        return {
            "message": "data exists!",
            "success": False
        }
    # update sql
    conn = sqlPool.connection()
    cur = conn.cursor()
    cur.execute("UPDATE `json` SET `route_name` = %s WHERE `user_id` = %s AND `route_name` = %s",
                (new_data_name, user_id, data_name))
    conn.commit()
    # return
    return jsonify(
        {
            "message": "Success update route name INFO",
            "success": True,
            "data": {
                "user": user,
                "data_name": data_name,
                "new_data_name": new_data_name,
                "url": JSON_API_URL + user + "/" + new_data_name
            }
        }
    )


@json_r.route("/update_user_name", methods=["POST"])
@json_decorator()
def update_user_name():
    # get token
    form_data = request.form
    auth = request.headers.get("Authorization")
    token = re.findall(r"^Bearer\s+(.*)$", auth)[0]
    new_user_name = form_data['new_user_name']
    # get user id
    user_id = tool.get_user_id(token)
    # check in sql , it has yet?
    # get user name
    user = json_tools.id_2_name(user_id)[0]
    cur.execute("SELECT `user_name` FROM `user` WHERE `id` = %s", user_id)
    user_name = cur.fetchone()[0]
    cur.execute("SELECT * FROM `user` WHERE `user_name` = %s", new_user_name)
    user_exists = cur.fetchone()
    if user_exists:
        return {
            "message": "user exists!",
            "success": False
        }
    conn = sqlPool.connection()
    cur = conn.cursor()
    cur.execute("UPDATE `user` SET `user_name` = %s WHERE `user_name` = %s", (new_user_name, user_name))
    conn.commit()
    return jsonify(
        {
            "message": "Success update route name INFO",
            "success": True,
            "data": {
                "old_data_name": user_name,
                "new_user_name": new_user_name
            }
        }
    )


@json_r.route("/set_user_name", methods=["POST"])
@json_decorator()
def set_user_name():
    form_data = request.form
    auth = request.headers.get("Authorization")
    token = re.findall(r"^Bearer\s+(.*)$", auth)[0]
    r = redis.Redis(connection_pool=redisPool, decode_responses=True)
    _redis_key = f"json:{token}"
    user_id = r.get(_redis_key).decode()
    r.quit()
    user_name = form_data['user_name']
    # check in sql , it has yet?
    conn = sqlPool.connection()
    cur = conn.cursor()
    cur.execute("UPDATE `user` SET `user_name` = %s WHERE `id` = %s", (user_name, user_id))
    conn.commit()
    return jsonify(
        {
            "message": "Success set user name INFO",
            "success": True,
            "data": {
                "user_name": user_name,
                "user_id": user_id
            }
        }
    )