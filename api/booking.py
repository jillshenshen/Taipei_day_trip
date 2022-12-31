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
import secret as secret
from datetime import datetime,timedelta


booking_bp=Blueprint("booking",__name__,static_folder="static")

poolname="pool"
poolsize=5
user="root"
host="localhost"
password=secret.MYSQL_KEY
database="trip"

connectionpool=mysql.connector.pooling.MySQLConnectionPool(pool_name=poolname,pool_reset_session = True,pool_size=poolsize,user=user,host=host,password=password,database=database)

#-----------------------------建立 Booking API--------------------------------
@booking_bp.route("/api/booking", methods=["POST"])
def booking():
  
    cookie=request.cookies.get("Set-Cookie")
    attractionID=request.json["attractionID"]
    date=request.json["date"]
    time=request.json["time"]
    price=request.json["price"]
    now = datetime.now()
    two_days_from_now = now + timedelta(days=1) 
    
 

    content={}
    if not cookie:
        content={
                "error": True,
                "message": "請先登入帳號"
                }
        current_app.config['JSON_AS_ASCII'] = False
        json_string=jsonify(content)
        res=make_response(json_string,403)        
    else: 
        try:
            token=jwt.decode(cookie,secret.SECRET_KEY, algorithms=["HS256"])
            userID=token["id"]
          
            if time=="undefined" or date =="undefined" or date=="":
                content={
                "error": True,
                "message": "請選擇日期與時間"
                }
                current_app.config['JSON_AS_ASCII'] = False
                json_string=jsonify(content)
                res=make_response(json_string,400)

            elif date:
                dateChange = datetime.strptime(date, '%Y-%m-%d')
                if dateChange < two_days_from_now:   
                    content={
                    "error": True,
                    "message": "請選擇兩天以後的行程"
                    }
                    current_app.config['JSON_AS_ASCII'] = False
                    json_string=jsonify(content)
                    res=make_response(json_string,400)
                else:


            
                    try:
                        connection=connectionpool.get_connection()
                        cursor = connection.cursor()
                        sql='''insert into booking(user_id,attraction_id,date,time,price) VALUES (%s, %s, %s,%s,%s);'''
                        val=(userID,attractionID,date,time,price)
                        cursor.execute(sql,val)
                        connection.commit()
                        content={
                                    "ok": True
                                }
                        current_app.config['JSON_AS_ASCII'] = False
                        json_string=jsonify(content)
                        res=make_response(json_string,200)          
                    except:
                        content={
                        "error": True,
                        "message": "伺服器出現問題"
                        }
                        current_app.config['JSON_AS_ASCII'] = False
                        json_string=jsonify(content)
                        res=make_response(json_string,500)                   
                    finally:         
                        cursor.close()
                        connection.close()

        except:
            content={
                "error": True,
                "message": "請先登入帳號"           
            }       
            current_app.config['JSON_AS_ASCII'] = False
            json_string=jsonify(content)
            res=make_response(json_string,403)  
        

    
    return res
    

#-----------------------------取得 Booking API--------------------------------

@booking_bp.route("/api/booking", methods=["GET"])
def get_booking():
    cookie=request.cookies.get("Set-Cookie")
    content={}
    content["data"]=[]
    if not cookie:
        content={
                "error": True,
                "message": "請先登入會員"
                }
        current_app.config['JSON_AS_ASCII'] = False
        json_string=jsonify(content)
        res=make_response(json_string,403) 
    else:
        try:
            connection=connectionpool.get_connection()
            cursor = connection.cursor(dictionary=True) 
            token=jwt.decode(cookie,secret.SECRET_KEY, algorithms=["HS256"]) 
          
            userID=token["id"]
            sql='''select location.name,location.address,location.images,booking.attraction_id,booking.date,booking.time,booking.price,booking.id from location inner join booking on location.id=booking.attraction_id where booking.user_id=%s;'''
            val=(userID,)
            cursor.execute(sql,val)
            result=cursor.fetchall()
          
            if not result:
                content={
                         "data": None
                         }
                current_app.config['JSON_AS_ASCII'] = False
                json_string=jsonify(content)
                res=make_response(json_string,200)
            else:
                
              
                for i in result:
                    att={}
                    data={}
                    att["id"]=i["attraction_id"];
                    att["name"]=i["name"];
                    att["address"]=i["address"];
                    att["image"]=(i["images"].split(","))[-1]
                  
                    data["attraction"]=att
                    data["date"]=i["date"]
                    data["time"]=i["time"]
                    data["price"]=i["price"]
                    data["bookingID"]=i["id"]
                  
                    content["data"].append(data)
                   
                
                    current_app.config['JSON_AS_ASCII'] = False
                    json_string=jsonify(content)
                    res=make_response(json_string,200) 

        except:
            content={
                "error": True,
                "message": "失敗"           
            }       
            current_app.config['JSON_AS_ASCII'] = False
            json_string=jsonify(content)
            res=make_response(json_string,403)  

        finally:
            cursor.close()
            connection.close()

    return res        


#-------------------------Delete Booking API--------------------------------
@booking_bp.route("/api/booking", methods=["DELETE"])
def delete_this():
    cookie=request.cookies.get("Set-Cookie")
    bookingID=request.json["bookingID"]
    
    if cookie:
        try:
            connection=connectionpool.get_connection()
            cursor = connection.cursor() 
            token=jwt.decode(cookie,secret.SECRET_KEY, algorithms=["HS256"])

            sql='''delete from booking where id=%s'''
            val=(bookingID,)
            cursor.execute(sql,val)
            connection.commit()

            content={
                "ok":True
            }
            current_app.config['JSON_AS_ASCII'] = False
            json_string=jsonify(content)
            res=make_response(json_string,200) 


        except:
                content={
                "error": True,
                "message": "請先登入帳號"
                }
                current_app.config['JSON_AS_ASCII'] = False
                json_string=jsonify(content)
                res=make_response(json_string,403) 
        finally:
                cursor.close()
                connection.close()     


    else:
        content={
                "error": True,
                "message": "請先登入帳號"
                }
        current_app.config['JSON_AS_ASCII'] = False
        json_string=jsonify(content)
        res=make_response(json_string,403) 

    return res    