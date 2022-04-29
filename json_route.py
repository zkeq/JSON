import re
from functools import wraps

import redis
from flask import Blueprint, request, jsonify
from sql import sqlPool, redisPool
from tools import Tool, JsonTool
from config import JSON_API_URL

json_r = Blueprint('json', __name__, url_prefix='/api/json')
json_clear = Blueprint('json_clear', __name__, url_prefix='/json')

tool = Tool(redisPool)
json_tools = JsonTool(sqlPool)


# TODO 重构代码，把数据库相关的功能全部转移到 tools 里面


def json_decorator():
    def _json_decorator(f):
        @wraps(f)
        def __json_decorator(*args, **kwargs):
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

        return __json_decorator

    return _json_decorator


@json_r.post("/add")
@json_decorator()
def new_data():
    # get token
    form_data = request.form
    auth = request.headers.get("Authorization")
    token = re.findall(r"^Bearer\s+(.*)$", auth)[0]
    # get user id
    user_id = tool.get_user_id(token)
    # get user data_name
    data_name = form_data['data_name']
    # get user data_content
    data_content = form_data['data_content']
    # check in sql , it has yet?
    user = json_tools.id_2_name(user_id)
    json_data = json_tools.id_route_2_data(user_id, data_name)
    if json_data:
        return {
            "message": "data exists!",
            "success": False
        }
    # insert data
    conn = sqlPool.connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO `json` (`json_data`,`user_id`,`route_name`) VALUES (%s,%s,%s)",
                (data_content, user_id, data_name))
    conn.commit()
    cur.close()
    conn.close()
    # return
    return jsonify(
        {
            "message": "Success INFO",
            "success": True,
            "data": {
                "user": user,
                "data_name": data_name,
                "url": JSON_API_URL + user + "/" + data_name
            }
        }
    )


@json_r.post("/update_json")
@json_decorator()
def update_data():
    # get token
    form_data = request.form
    auth = request.headers.get("Authorization")
    token = re.findall(r"^Bearer\s+(.*)$", auth)[0]
    # get user id
    user_id = tool.get_user_id(token)
    # get user data_name
    data_name = form_data['data_name']
    # get user data_content
    data_content = form_data['data_content']
    # check in sql , it has yet?
    user = json_tools.id_2_name(user_id)
    json_data = json_tools.id_route_2_data(user_id, data_name)
    if not json_data:
        return {
            "message": "data not exists!",
            "success": False
        }
    # update sql
    conn = sqlPool.connection()
    cur = conn.cursor()
    cur.execute("UPDATE `json` SET `json_data` = %s WHERE `user_id` = %s AND `route_name` = %s",
                (data_content, user_id, data_name))
    conn.commit()
    cur.close()
    conn.close()
    # return
    return jsonify(
        {
            "message": "Success update INFO",
            "success": True,
            "data": {
                "user": user,
                "data_name": data_name,
                "url": JSON_API_URL + user + "/" + data_name
            }
        }
    )


@json_r.post("/update_route")
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
        })


@json_r.post("/delete")
@json_decorator()
def delete_data():
    # get token
    form_data = request.form
    auth = request.headers.get("Authorization")
    token = re.findall(r"^Bearer\s+(.*)$", auth)[0]
    # get user id
    user_id = tool.get_user_id(token)
    # get user data_name
    data_name = form_data['data_name']
    # check in sql , it has yet?
    json_data = json_tools.id_route_2_data(user_id, data_name)
    conn = sqlPool.connection()
    cur = conn.cursor()
    cur.execute("SELECT `json_data` FROM `json` WHERE `user_id` = %s AND `route_name` = %s", (user_id, data_name))
    json_data = cur.fetchone()
    if not json_data:
        return {
            "message": "data not exists!",
            "success": False,
        }
    cur.execute(
        "DELETE FROM `json` WHERE `user_id` = %s AND `route_name` = %s", (user_id, data_name))
    conn.commit()
    return jsonify(
        {
            "message": "Success delte INFO",
            "success": True,
            "data": {
                "user_id": user_id,
                "data_name": data_name
            }
        }
    )


@json_r.post("/get")
@json_decorator()
def get():
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


@json_clear.route("/<path:user>/<path:json_data_name>")
def _sub_path(user, json_data_name):
    # find in sql
    conn = sqlPool.connection()
    cur = conn.cursor()
    cur.execute("SELECT `id` FROM `user` WHERE `user_name` = %s", user)
    user_id = cur.fetchone()[0]
    conn = sqlPool.connection()
    cur = conn.cursor()
    cur.execute("SELECT `json_data` FROM `json` WHERE `user_id` = %s AND `route_name` = %s",
                (user_id, json_data_name))
    json_data = cur.fetchone()
    if not json_data:
        return {
            "message": "data not exists!",
            "success": False
        }
    return json_data[0], 200, ({"content-type": "application/json", "access-control-allow-origin": "*"})
