from flask import Blueprint
from crypt import methods
from email import message
from this import d
from urllib import response
from flask import Flask ,request,render_template,session,redirect,url_for,make_response,json,Response
from flask import jsonify
import json ,jwt,re
import mysql.connector
from mysql.connector import Error,pooling
from flask import current_app
import secret as secret

login_bp=Blueprint("login",__name__,static_folder="static")

poolname="pool"
poolsize=5
user="root"
host="localhost"
password=secret.MYSQL_KEY
database="trip"

connectionpool=mysql.connector.pooling.MySQLConnectionPool(pool_name=poolname,pool_reset_session = True,pool_size=poolsize,user=user,host=host,password=password,database=database)


#-----------------------------會員註冊API--------------------------------
@login_bp.route("/api/user", methods=["POST"])
def signup():
    name=request.json["name"]
    email=request.json["email"]
    password=request.json["password"]
    content={}
    if not name or not email or not password:
        content={"error":True,"message":"註冊失敗,請提供詳細註冊資料"}
        current_app.config['JSON_AS_ASCII'] = False
        json_string=jsonify(content)
        res=make_response(json_string,400)
    email_regex = r'^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'
    if not re.match(email_regex, email):
        content={"error":True,"message":"註冊失敗,請提供正確email"}
        current_app.config['JSON_AS_ASCII'] = False
        json_string=jsonify(content)
        res=make_response(json_string,400)


    else:    

        try:
            connection=connectionpool.get_connection()
            cursor = connection.cursor()      
            sql='''select email from member where email=%s'''
            val=(email,)
            cursor.execute(sql,val)
            result=cursor.fetchone() 
            if result:
                content={"error":True,"message":"註冊失敗,請提供其他的email"}
                current_app.config['JSON_AS_ASCII'] = False
                json_string=jsonify(content)
                res=make_response(json_string,400)
            else:
                new_sql="insert into member(name,email,password) VALUES (%s, %s, %s);"
                new_data=(name,email,password)           
                cursor.execute(new_sql,new_data)
                connection.commit()
        
                content={"ok":True}
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

# -----------------------------會員登入API--------------------------------

@login_bp.route("/api/user/auth", methods=["PUT"])
def login():
    current_app.config['JSON_AS_ASCII'] = False
    email=request.json["email"]
    password=request.json["password"]
    content={}
    try:
        connection=connectionpool.get_connection()
        cursor = connection.cursor()
        sql='''select * from member where email=%s and password=%s'''
        val=(email,password)
        cursor.execute(sql,val)
        result=cursor.fetchone()
        if result:
          
            token=jwt.encode({
                'id':result[0],
                'name':result[1],
                'email':result[2],               
            },secret.SECRET_KEY,algorithm="HS256")
           

            
            content={"ok":True}
            current_app.config['JSON_AS_ASCII'] = False
            json_string=jsonify(content)
            res=make_response(json_string,200)
            res.set_cookie(key="Set-Cookie" ,value=token, max_age=604800)
            
        else:
            content={"error":True,"message":"帳號或密碼輸入錯誤"}
            current_app.config['JSON_AS_ASCII'] = False
            json_string=jsonify(content)
            res=make_response(json_string,400)           
    except:
            content={"error":True,"message":"伺服器出了問題，請找設計或維護網站的人..."}
            current_app.config['JSON_AS_ASCII'] = False
            json_string=jsonify(content)
            res=make_response(json_string,500)
    finally:
            cursor.close()
            connection.close()    
    return res


#-----------------------------會員確認API--------------------------------
@login_bp.route("/api/user/auth", methods=["GET"])
def check():
    cookie=request.cookies.get("Set-Cookie")
   
    if cookie:
        try:
            token=jwt.decode(cookie,secret.SECRET_KEY, algorithms=["HS256"])     
            content={"data":token}
        except:
            content={"data":None}       
    else:
        content={"data":None}    
    current_app.config['JSON_AS_ASCII'] = False
    json_string=jsonify(content)
    res=make_response(json_string,200)
    return res

#-----------------------------會員登出API--------------------------------
@login_bp.route("/api/user/auth", methods=["DELETE"])
def delete():
    content={"ok":True}
    current_app.config['JSON_AS_ASCII'] = False
    json_string=jsonify(content)
    res=make_response(json_string,200)
    res.set_cookie(key="Set-Cookie" ,value='', max_age=-1)
    return res