from flask import Blueprint
from crypt import methods
from email import message
from this import d
from urllib import response
from flask import Flask ,request,send_from_directory,render_template,session,redirect,url_for,make_response,json,Response
import requests

from flask import jsonify
import json ,jwt,re 
import mysql.connector
from mysql.connector import Error,pooling
from flask import current_app
import secret as secret
from datetime import datetime,timedelta
import random





order_bp=Blueprint("order",__name__,static_folder="static")

poolname="pool"
poolsize=5
user="root"
host="localhost"
password=secret.MYSQL_KEY
database="trip"

connectionpool=mysql.connector.pooling.MySQLConnectionPool(pool_name=poolname,pool_reset_session = True,pool_size=poolsize,user=user,host=host,password=password,database=database)

 #---------------------------建立新的訂單-----------------------------
@order_bp.route("/api/orders", methods=["POST"])
def order():
    cookie=request.cookies.get("Set-Cookie")
  
    prime=request.json["prime"]
    price=request.json["order"]["price"]
    att_id=""
    att_name=""
    att_address=""
    att_image=""
    booking_date=""
    booking_time=""
    for i in request.json["order"]["trip"]:
        att_id+=str(i["attraction"]["id"])+","
        att_name+=i["attraction"]["name"]+","
        att_address+=i["attraction"]["address"]+","
        att_image+=i["attraction"]["image"]+","
        booking_date+=i["date"]+","
        booking_time+=i["time"]+","
    att_id=att_id[:-1]
    att_name=att_name[:-1]
    att_address=att_address[:-1]
    att_image=att_image[:-1]
    booking_date=booking_date[:-1]
    booking_time=booking_time[:-1]
 
    contactName=request.json["contact"]["name"]
    contactEmail=request.json["contact"]["email"]
    contactPhone=request.json["contact"]["phone"]
    now = datetime.now()
    year = now.year
    month = now.month
    day = now.day
    date_string = "{}{:02d}{:02d}".format(year, month, day)
    random_string = ''.join(str(random.randint(0, 9)) for _ in range(12))
    order_number=date_string+random_string
    
    # 1. 確認登入狀態 ,是否帶有cookie    
    if not cookie:
      content={
                "error": True,
                "message": "請先登入帳號, cookie"
                }
      current_app.config['JSON_AS_ASCII'] = False
      json_string=jsonify(content)
      res=make_response(json_string,403)  
    else:
        try:
            # 2.確認token是否正確
            token=jwt.decode(cookie,secret.SECRET_KEY, algorithms=["HS256"])
            userID=token["id"]  
            pattern = r"^\+?[0-9]{6,14}$"

            #3.確認聯絡資訊是否有誤 
            if not contactPhone or not contactName or not contactEmail or not re.match(pattern,contactPhone):
              content={
                        "error": True,
                        "message": "請輸入正確聯絡資訊"
                      }
              current_app.config['JSON_AS_ASCII'] = False
              json_string=jsonify(content)
              res=make_response(json_string,400)   

            else:
                try: 
                  #4. 建立訂單資訊存入資料庫,預設付款未成功,刪除購物車商品
                  connection=connectionpool.get_connection()
                  cursor = connection.cursor(buffered=True)

                  sql='''insert into order_list(order_number,user_id,price,attraction_id,attraction_name,attraction_address,attraction_image,booking_date,booking_time,contact_name,contact_email,contact_phone) VALUES (%s, %s,%s, %s,%s, %s,%s, %s,%s, %s,%s, %s);'''
                  
                  status="未付款"
                  val=(order_number,userID,price,att_id,att_name,att_address,att_image,booking_date,booking_time,contactName,contactEmail,contactPhone)
                  cursor.execute(sql,val)

                  sql='''insert into payment(order_number,status) VALUES (%s,%s); '''
                  val=(order_number,status)
                  cursor.execute(sql,val)

                  sql='''delete from booking where user_id=%s'''
                  val=(userID,)
                  cursor.execute(sql,val)

                  connection.commit() 
                  cursor.close()
                  connection.close() 
                  
                  
                  

                  try:
                    #5. 串接第三方金流 
                    headers={'Content-Type': 'application/json',
                    'x-api-key': secret.PARTNER_KEY}

                    data = {
                          'prime': prime,
                          "partner_key":secret.PARTNER_KEY,
                          "merchant_id": "jillshen_CTBC",
                          "amount": 1,
                          "currency": "TWD",
                          "details": "Trip",
                          "cardholder": {
                        "phone_number": contactPhone,
                        "name": contactName,
                        "email": contactEmail,
                        "zip_code": "100",
                        "address": "台北市天龍區芝麻街1號1樓",
                        "national_id": "A123456789"
                      },
                      "remember": True
                      }
                    r = requests.post('https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime', json=data,headers=headers)
                    
                    pay_status=r.json()
                    
                    #6. 如果串接成功,付款狀態更新為已付款
                    if pay_status["status"]==0:
                      status="已付款"
                      connection=connectionpool.get_connection()
                      cursor = connection.cursor(buffered=True)
                      sql='''update payment set status=%s where order_number=%s; '''
                      val=(status,order_number)
                      cursor.execute(sql,val)
                      connection.commit() 
                      cursor.close()
                      connection.close() 
                     

                      content={
                                "data": {
                                  "number": order_number,
                                  "payment": {
                                    "status": 0,
                                    "message": "付款成功"
                                  }
                               }
                              }
                      current_app.config['JSON_AS_ASCII'] = False
                      json_string=jsonify(content)
                      res=make_response(json_string,200)  
                    else:
                      content={
                                "data": {
                                  "number": order_number,
                                  "payment": {
                                    "status": 1,
                                    "message": "付款失敗"
                                  }
                               }
                              }
                      current_app.config['JSON_AS_ASCII'] = False
                      json_string=jsonify(content)
                      res=make_response(json_string,200)  


                  except:
                      content={"error":True,"message":"伺服器出了問題"}
                      current_app.config['JSON_AS_ASCII'] = False
                      json_string=jsonify(content)
                      res=make_response(json_string,500)
                 
                          
                except:
                  content={"error":True,"message":"伺服器出了問題"}
                  current_app.config['JSON_AS_ASCII'] = False
                  json_string=jsonify(content)
                  res=make_response(json_string,500)

    
        except:
            content={
                "error": True,
                "message": "請先登入帳號"           
            }       
            current_app.config['JSON_AS_ASCII'] = False
            json_string=jsonify(content)
            res=make_response(json_string,403)     

    
    return res


#--------------------------------------------------------------

@order_bp.route("/api/orders", methods=["GET"])
def get_order():
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
        token=jwt.decode(cookie,secret.SECRET_KEY, algorithms=["HS256"]) 
        userID=token["id"]
     
        connection=connectionpool.get_connection()
        cursor = connection.cursor(dictionary=True) 
        sql='''select order_list.order_number,order_list.price,order_list.attraction_name,order_list.attraction_address,order_list.attraction_image,order_list.booking_date,order_list.booking_time,payment.status from order_list inner join payment on order_list.order_number=payment.order_number where order_list.user_id=%s'''
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
            list={}
            list["number"]=i["order_number"]
            list["price"]=i["price"]
            list["status"]=i["status"]

            list["trip"]=[]
            
            name=i["attraction_name"].split(",")
            address=i["attraction_address"].split(",")
            image=i["attraction_image"].split(",")
            date=i["booking_date"].split(",")
            time=i["booking_time"].split(",")
            
            
            for i in range(len(date)):  
              data={
                "date":date[i],
                "time":time[i],
                "attraction":{"name": name[i],
                              "address":address[i],
                              "image":image[i]
                }}
                           
              list["trip"].append(data)
            content["data"].append(list)
          
         
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

#-------------------------------------------------------
@order_bp.route("/api/order/<orderNumber>", methods=["GET"])
def get_orderNumber(orderNumber):
  content={}
  content["data"]={} 

  try:
      connection=connectionpool.get_connection()
      cursor = connection.cursor(dictionary=True) 
        
      sql='''select order_list.order_number,order_list.price,order_list.attraction_name,order_list.attraction_address,order_list.attraction_image,order_list.booking_date,order_list.booking_time,payment.status from order_list inner join payment on order_list.order_number=payment.order_number where order_list.order_number=%s  '''	
      
      val=(orderNumber,)
      cursor.execute(sql,val)
      result=cursor.fetchone()
      if result:
        print(orderNumber)
        content["data"]["number"]=result["order_number"]
        content["data"]["price"]=result["price"]
        content["data"]["status"]=result["status"]
        content["data"]["trip"]=[]
        name=result["attraction_name"].split(",")
        address=result["attraction_address"].split(",")
        image=result["attraction_image"].split(",")
        date=result["booking_date"].split(",")
        time=result["booking_time"].split(",")
        for i in range(len(date)):  
              data={
                "date":date[i],
                "time":time[i],
                "attraction":{"name": name[i],
                              "address":address[i],
                              "image":image[i]
                }}
              content["data"]["trip"].append(data)  
        print(content)      
        current_app.config['JSON_AS_ASCII'] = False
        json_string=jsonify(content)
        res=make_response(json_string,200)        



  except:
      content={"error":True,"message":"伺服器出了問題，請找設計或維護網站的人..."}
      current_app.config['JSON_AS_ASCII'] = False
      json_string=jsonify(content)
      res=make_response(json_string,500)

  finally:
      cursor.close()
      connection.close()   
  return res    







#------------------取得profile----------------------------

@order_bp.route("/api/image", methods=["POST"])
def get_image():
  cookie=request.cookies.get("Set-Cookie")
  try:
    token=jwt.decode(cookie,secret.SECRET_KEY, algorithms=["HS256"]) 
    userID=token["id"]
    fileName=f'profile/data{userID}.txt'
    data = request.get_data()
    with open(fileName, 'wb') as f:
      f.write(data)
    return 'File uploaded successfully'

  except:
    return "error"  



  


@order_bp.route("/api/image" ,methods=["GET"])
def send_image():
  cookie=request.cookies.get("Set-Cookie")
  try:
    token=jwt.decode(cookie,secret.SECRET_KEY, algorithms=["HS256"]) 
    userID=token["id"]
    fileName=f'data{userID}.txt'
    data=send_from_directory('./profile',fileName)
    return data
  except:
    return "false"  



@order_bp.route("/update-database" ,methods=["POST"])
def update_data():
  data=request.json
  cookie=request.cookies.get("Set-Cookie")
  emailData=request.json["email"]
 
  try:
      token=jwt.decode(cookie,secret.SECRET_KEY, algorithms=["HS256"]) 
      userID=token["id"]

      connection=connectionpool.get_connection()
      cursor = connection.cursor(dictionary=True)
      sql='''select email from member where email=%s and id !=%s'''
      val=(emailData,userID)
      cursor.execute(sql,val)
      result=cursor.fetchone()
      if result:
        content={"error":True,"message":"儲存失敗,請提供其他的email"}
        current_app.config['JSON_AS_ASCII'] = False
        json_string=jsonify(content)
        res=make_response(json_string,400) 
      else:
            update_query = 'UPDATE member SET '
            update_values = []
            if 'name' in data:
              update_query += 'name=%s'
              update_values.append(data['name'])
              
            if 'email' in data:
              update_query += ', email=%s'
              update_values.append(data['email'])
            if 'ids' in data:
              update_query+= ',ids=%s'
              update_values.append(data['ids'])
            if 'phone' in data:
              update_query+= ',phone=%s'
              update_values.append(data['phone'])
            if 'gender' in data:
              update_query+= ',gender=%s'
              update_values.append(data['gender']) 
            if 'first' in data:
              update_query+= ',first=%s'
              update_values.append(data['first'])   
            if 'last' in data:
              update_query+= ',last=%s'
              update_values.append(data['last'])
            if 'passport' in data:
              update_query+= ',passport=%s'
              update_values.append(data['passport'])
            if 'birth' in data:
              update_query+= ',birth=%s'
              update_values.append(data['birth'])
            if 'country' in data:
              update_query+= ',country=%s'
              update_values.append(data['country'])                
            
            update_query += ' WHERE id=%s'
            update_values.append(userID)
            cursor.execute(update_query, tuple(update_values)) 
            connection.commit() 

            content={
              "ok":True
            } 
            current_app.config['JSON_AS_ASCII'] = False
            json_string=jsonify(content)
            res=make_response(json_string,200) 
       
  except:
    content={"error":True,"message":"伺服器出了問題"}
    current_app.config['JSON_AS_ASCII'] = False
    json_string=jsonify(content)
    res=make_response(json_string,500)

  finally:
    cursor.close()
    connection.close()  
  
  return res



@order_bp.route("/update-database" ,methods=["GET"])
def update_get():
  cookie=request.cookies.get("Set-Cookie")
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
       sql='''select name,email,ids,phone,gender,last,first,passport,birth,country from member where id=%s'''
       val=(userID,)
       cursor.execute(sql,val)
       result=cursor.fetchone()
       print(result)
       content=result   

      
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
