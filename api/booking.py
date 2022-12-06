from flask import Blueprint
from crypt import methods
from email import message
from this import d
from urllib import response
from flask import Flask ,request,render_template,session,redirect,url_for,make_response,json,Response
from flask import jsonify
import json ,jwt
import mysql.connector
from mysql.connector import Error,pooling
from flask import current_app


booking_bp=Blueprint("booking",__name__,static_folder="static")

poolname="pool"
poolsize=5
user="root"
host="localhost"
password="0000"
database="trip"

connectionpool=mysql.connector.pooling.MySQLConnectionPool(pool_name=poolname,pool_reset_session = True,pool_size=poolsize,user=user,host=host,password=password,database=database)

# @booking_bp.route("/api/booking", methods=["GET"])
# def booking():
