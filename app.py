from flask import *
app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
# from crypt import methods
# from email import message
# from this import d
# from urllib import response
from flask import Flask ,request,render_template,session,redirect,url_for,make_response,json,Response

from attractions import attraction_bp
from login import login_bp
app=Flask(__name__,static_folder="static")
app.register_blueprint(attraction_bp)
app.register_blueprint(login_bp)



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




app.run(host='0.0.0.0',port=3000,debug=True)    
