# coding:utf-8
# DONE 做一个登录
# DONE 生成新 json 列表
# TODO 做一个后台，可以从 api 读取登录获取的 json 列表
# DONE 管理 json 列表
# TODO json 的模板可以自定义
# 弄模板这玩意干啥
from flask import Flask, request, jsonify
from login_route import login_r
from json_route import json_r, json_clear
from page_route import page_r
from user_route import user_r

app = Flask(__name__, template_folder="./front/build", static_folder="./front/build", static_url_path="")

# 注册bluePrintl
app.register_blueprint(login_r)
app.register_blueprint(json_r)
app.register_blueprint(json_clear)
app.register_blueprint(page_r)
app.register_blueprint(user_r)


@app.after_request
def after(response):
    response.headers["Access-control-Allow-Origin"] = "*"  # 设置源
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS,PUT,DELETE"
    response.headers["Access-Control-Allow-Headers"] = request.headers.get("Access-Control-Request-Headers")  # 设置请求头
    response.headers["Access-Control-Max-Age"] = 3600  # 设置预检请求的有效时间，避免频繁发送预检请求
    if request.method == "OPTIONS":
        response.status_code = 204

    return response


# no_route handler
@app.errorhandler(404)
def no_route(e):
    return jsonify({
        "success": False,
        "msg": "nothing here",
        "data": {}
    }), 404


# # error handler
# @app.errorhandler(Exception)
# def all_exception_handler(e):
#     print(e)
#     return jsonify({
#         "success": False,
#         "msg": "Internet Server Error",
#         "data": {}
#     }), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)