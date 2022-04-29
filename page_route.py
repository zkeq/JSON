import re
from functools import wraps

from flask import Blueprint, render_template, request
from sql import sqlPool, redisPool
from tools import Tool
from config import ID, REDIRECT_URL, AK, API_URL

page_r = Blueprint('page', __name__)

tool = Tool(redisPool)


@page_r.route("/")
def index():
    return render_template("index.html")

