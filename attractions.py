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

attraction_bp=Blueprint("attractions",__name__,static_folder="static")

poolname="pool"
poolsize=5
user="root"
host="localhost"
password="0000"
database="trip"

connectionpool=mysql.connector.pooling.MySQLConnectionPool(pool_name=poolname,pool_reset_session = True,pool_size=poolsize,user=user,host=host,password=password,database=database)




@attraction_bp.route("/api/attractions",methods=["GET"])
def attractions():
    page=request.args.get("page")
    keyword=request.args.get("keyword")
    content={}
    content["data"]=[]
    x=int(page)*12
    
    
    try:
        connection=connectionpool.get_connection()
        cursor = connection.cursor() 
        if keyword:
            sql='''select * from location where category=%s or name like concat('%',%s,'%')limit %s,12   '''	
            val=(keyword,keyword,x)

            next=(keyword,keyword,x+12)
            cursor.execute(sql,next)
            result=cursor.fetchall()
            content["nextPage"]=""
            if result:
                content["nextPage"]=int(page)+1
            if not result:
                content["nextPage"]=None

        else:
            sql='''select * from location  limit  %s,12  '''
            val=(x,)
            next=(x+12,)
            cursor.execute(sql,next)
            result=cursor.fetchall()
            content["nextPage"]=""
            if result:
                content["nextPage"]=int(page)+1
            if not result:
                content["nextPage"]=None
        cursor.execute(sql,val)
        result=cursor.fetchall()

        for i in result:
            dic={}
        
            dic["id"]=i[0]
            dic["name"]=i[1]
            dic["address"]=i[2]
            dic["category"]=i[3]
            dic["images"]=(i[5].split(","))
            dic["transport"]=i[6]
            dic["latitude"]=i[7]
            dic["longitude"]=i[8]
            dic["mrt"]=i[9]
            dic["description"]=i[11]
        
            content["data"].append(dic)
    except:    
        content={"error":True,"message":"伺服器出了問題，請找設計或維護網站的人..."}
        current_app.config['JSON_AS_ASCII'] = False
        json_string=jsonify(content)
        res=make_response(json_string,500)

    finally:
        cursor.close()
        connection.close()
       

   
    current_app.config['JSON_AS_ASCII'] = False
    json_string=jsonify(content)
    res=make_response(json_string,200)
    return res


@attraction_bp.route("/api/attraction/<attractionID>", methods=["GET"])
def id(attractionID):
    id=attractionID
    content={}
    content["data"]={}  
  
    
    try:
        connection=connectionpool.get_connection()
        cursor = connection.cursor() 
        
        sql='''select * from location where id=%s  '''	
        val=(id,)
        cursor.execute(sql,val)
        result=cursor.fetchone()
        if result:
            content["data"]["id"]=result[0]
            content["data"]["name"]=result[1]
            content["data"]["address"]=result[2]
            content["data"]["category"]=result[3]
            content["data"]["images"]=(result[5].split(","))
            content["data"]["transport"]=result[6]
            content["data"]["latitude"]=result[7]
            content["data"]["longitude"]=result[8]
            content["data"]["mrt"]=result[9]
            content["data"]["description"]=result[11]
            current_app.config['JSON_AS_ASCII'] = False
            json_string=jsonify(content)
            res=make_response(json_string,200)
        else:  
            content={"error": True,
                     "message": "無此景點編號資料"} 
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

@attraction_bp.route("/api/categories" , methods=["GET"])
def categories():      
        try:
            connection=connectionpool.get_connection()
            cursor = connection.cursor() 
            sql='''select distinct `category`  from location  '''	
            cursor.execute(sql)

            result=cursor.fetchall()
            data=[]	
            for i in result:
                    data.append(i[0])           
            content={}
            content["data"]=data			
        except:
            content={"error":True,"message":"伺服器出了問題，請找設計或維護網站的人..."}
            current_app.config['JSON_AS_ASCII'] = False
            json_string=jsonify(content)
            res=make_response(json_string,500)
        finally:
            cursor.close()
            connection.close()
          
                    
        current_app.config['JSON_AS_ASCII'] = False
        json_string=jsonify(content)
        res=make_response(json_string,200)
        return res    