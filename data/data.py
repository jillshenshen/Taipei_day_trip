from crypt import methods
from email import message
from this import d
from flask import Flask ,request,render_template,session,redirect,url_for,make_response
import mysql.connector
import json 
from mysql.connector import Error

app=Flask(__name__,static_folder="public",static_url_path="/")
app.secret_key="member"

connection = mysql.connector.connect(
host="localhost",
database="trip",
user="root",
password="0000"
)
root="/Users/mac/Desktop/taipei-day-trip/data/taipei-attractions.json"
with open(root, 'r', encoding="utf-8") as file:
    data=json.load(file)
    c_list=data["result"]["results"]
   
    
    cursor=connection.cursor(prepared=True)   
    for i in c_list:
        name=i.get("name")
        address=i.get("address")
        category=i.get("CAT")
        new_url=i.get("files")
        transport=i.get("direction")
        latitude=i.get("latitude")
        longitude=i.get("longitude")
        mrt=i.get("MRT")
        description=i.get("description")

        files=i.get("file")
        url=files.split("https://")
        new_links=""
        link=""
        for x in range(len(url)):
            if x>0:
                link="https://"+url[x]
                str=link[-3:-1]
                if str=="jp" or str=="JP":
                    new_links+=link+","
        new_links=new_links[:-1] 
        insert_re = "insert into location(name,address,category,images,transport,latitude,longitude,mrt,description) values(%s,%s,%s,%s,%s,%s,%s,%s,%s);"
        val=(name,address,category,new_links,transport,latitude,longitude,mrt,description)   
        cursor.execute(insert_re,val) 
                
    connection.commit()
    connection.close()              
    
   
               

        
      
            
           




      
       
        




