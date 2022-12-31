from flask import *
app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
from flask import Flask ,request,render_template,session,redirect,url_for,make_response,json,Response

from api.attractions import attraction_bp
from api.login import login_bp
from api.booking import booking_bp
from api.order import order_bp
app=Flask(__name__,static_folder="static")
app.register_blueprint(attraction_bp)
app.register_blueprint(login_bp)
app.register_blueprint(booking_bp)
app.register_blueprint(order_bp)



# Pages
@app.route("/")
def index():
    return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
    return render_template("attraction.html")
@app.route("/booking")
def booking():
    return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
    return render_template("thankyou.html")

@app.route("/member")
def member():
    return render_template("member.html") 

@app.route("/order")
def orderList():
    return render_template("order.html")   

@app.errorhandler(404)
def error_date(error):
    return render_template("404.html"),404  


app.run(host='0.0.0.0',port=3000,debug=True)    
