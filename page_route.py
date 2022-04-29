from flask import Blueprint, render_template

page_r = Blueprint('page', __name__)


@page_r.route("/")
def index():
    return render_template("index.html")
