import imutils
from flask import Flask, jsonify, request
import flask_sqlalchemy
from  flask_cors import CORS
import cv2
import numpy as np
from apscheduler.schedulers.background import BackgroundScheduler

import easyocr
from matplotlib import pyplot
import mysql.connector
from datetime import datetime,date
app = Flask(__name__)
CORS(app)
ParkingSlots=""
datetime_now=""
conn=""
cursor=""
def getJsonAsDict(cursor):
    return [dict((cursor.description[i][0], value) for i, value in enumerate(row)) for row in cursor.fetchall()]
@app.route("/ParkingSlots", methods=['GET'])
def getAllParkingSlots():

    ParkingSlots=""

    try:
        cursor.execute("Select * from ParkingSlots")
        ParkingSlots = getJsonAsDict(cursor)
        # ParkingSlots = cursor.fetchall()
    except Exception as e:

      print("Exception:",e)
      # Rolling back in case of error
      conn.rollback()

    finally:

        return (ParkingSlots)



@app.route("/AvailableParkingSlots", methods=['GET'])
def getAvailableParkingSlots():
    available_slots=""
    nr=""
    l = []

    try:
        cursor.execute("Select * from Locations")
        slots = cursor.fetchall()
        slots_nr=cursor.rowcount;

        for i in range (1,slots_nr+1):
            cursor.execute("Select * from ParkingSlots where reserved = 0 and location_id=%s",(i,))



            available_slots=cursor.fetchall()
            nr=(str(cursor.rowcount+1));
            print("RowCount:",nr)

            l.append(dict(id =i, slots = nr))
            # print(dict1)
            # dict1= [dict((cursor.description[i][0], value) for i, value in enumerate(row)) for row in cursor.fetchall()]
    except Exception as e:

      print("Exception:",e)
      # Rolling back in case of error
      conn.rollback()

    finally:

         return l

@app.route("/ParkingSlots<id>", methods=['GET'])
def getParkingSlotsByLocationID(id):
    global ParkingSlots
    try:
        cursor.execute("Select * from ParkingSlots where location_id = %s",(id,))
        ParkingSlots =getJsonAsDict(cursor);
    except Exception as e:
        print(e)
    finally:

        return ParkingSlots

@app.route("/ParkingSlots<id>", methods=["PUT","POST"])
def update(id):
    reserved = request.json['reserved']
    slot_number=request.json['slot_number']
    try:
        cursor.execute("UPDATE ParkingSlots SET reserved =%s  where location_id = %s and number=%s ",(reserved,id,slot_number,))
        conn.commit()
        # cursor.execute("Select * from ParkingSlots where location_id = %s and number=%s ",(id,slot_number,) )
        # a = cursor.fetchall()

        # print(a[0][0])
    except Exception as e:
        print(e)

    print("Reserved",reserved)
    # guide.title = title
    # guide.content = content
    #

    return jsonify({"result":"Succes"})

@app.route("/SlotNumberbyID<id>",methods=["GET"])
def getSlotNumberbySlotID(id):
    global ParkingSlots
    try:
        cursor.execute("Select * from ParkingSlots where idParkingSlots = %s", (id,))
        ParkingSlots = getJsonAsDict(cursor);
    except Exception as e:
        print(e)
    finally:

        return ParkingSlots

@app.route("/SlotIDbyNumber<number>",methods=["GET"])
def getSlotIDbySlotNumber(number):
    global ParkingSlots
    try:
        cursor.execute("Select * from ParkingSlots where number = %s", (number,))
        ParkingSlots = getJsonAsDict(cursor);
    except Exception as e:
        print(e)
    finally:

        return ParkingSlots




@app.route("/getlocations", methods=['GET'])
def get_location():

    locations=[]
    query="Select * from Locations"
    try:
        cursor.execute(query)
        locations = getJsonAsDict(cursor)
    except Exception as e:
        print(e)
    finally:

        return (jsonify(locations))



@app.route("/submit", methods=['POST'])
def submit():
    json=request.get_json()
    start_time = datetime.strptime(json["StartDate"], '%Y-%m-%d %H:%M:%S')
    end_time=datetime.strptime(json["EndDate"], '%Y-%m-%d %H:%M:%S')
    print(json)
    # query = "INSERT INTO Reservations VALUES (%s,%s,%s,%s,%s,%s)"
    query="INSERT INTO Reservations (plate_number, location_id, slot_id, StartDate, EndDate) " \
          "VALUES (%s,%s,%s,%s,%s);"

    try:
        cursor.execute(query,(json["PlateNumber"],json["location_id"],json["slot"],start_time,end_time))
        conn.commit()
    except Exception as e:
        print("Eroare:",e)

    return jsonify({"Result": "Succes, "})

# @app.route("/reservations", methods=['POST'])
# def reserve():
#      query = "INSERT INTO Reservation VALUES (%s,%s,%s,%s) ";
#      try:
#
#               cursor.execute(query,)
#      # query = "INSERT INTO ParkingSlots VALUES (%s,%s,%s,%s)"
#      # try:
#      #     for i in range (1,200):
#      #           cursor.execute(query,(i,1,i,0))
#      except Exception as e:
#         print(e)

@app.route("/getReservations",methods=["GET"])
def getReservations():
    Reservation = []
    query = "Select * from Reservations"
    try:
        cursor.execute(query)
        Reservation = getJsonAsDict(cursor)
    except Exception as e:
        print(e)
    finally:

        return (jsonify(Reservation))

@app.route("/getReservationsBySlotID<id>",methods=["GET"])
def searchReservationsbySlotID(id):
    Reservation = []
    result=True

    try:
        cursor.execute("Select * from Reservations where slot_id = %s", (id,))
        Reservation = getJsonAsDict(cursor)

        print(Reservation)
        # cursor.fetchall()
        # nr = (cursor.rowcount)
        # if(nr>0):
        #     result=True
        # else:
        #     result=False

    except Exception as e:
        print("Erorr:",e)
    finally:

        return (jsonify(Reservation))


@app.route("/script", methods=['GET'])
def script():
    img = cv2.imread('img.png')
    width = 600
    height = 400
    img = cv2.resize(img, (width, height))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    pyplot.figure(1)
    pyplot.subplot(221)
    pyplot.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    pyplot.subplot(222)
    pyplot.imshow(cv2.cvtColor(gray, cv2.COLOR_BGR2RGB))

    bfilter = cv2.bilateralFilter(gray, 11, 20, 20)  # Noise reduction
    edged = cv2.Canny(bfilter, 30, 200)  # Edge detection
    pyplot.subplot(223)
    pyplot.imshow(cv2.cvtColor(edged, cv2.COLOR_BGR2RGB))

    keypoints = cv2.findContours(edged.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    contours = imutils.grab_contours(keypoints)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)[:10]
    locations = []

    for contour in contours:
        approx = cv2.approxPolyDP(contour, 10, True)
        if len(approx) == 4:
            locations.append(approx)

    results = []
    acc = []
    most_accurate_plate=""
    if (locations):
        for index, location in enumerate(locations):

            mask = np.zeros(gray.shape, np.uint8)
            new_image = cv2.drawContours(mask, [location], 0, 255, -1)
            new_image = cv2.bitwise_and(img, img, mask=mask)
            pyplot.figure(2 + index)
            pyplot.subplot(121)
            pyplot.imshow(cv2.cvtColor(new_image, cv2.COLOR_BGR2RGB))
            (x, y) = np.where(mask == 255)
            (x1, y1) = (np.min(x), np.min(y))
            (x2, y2) = (np.max(x), np.max(y))
            cropped_image = new_image[x1:x2 + 1, y1:y2 + 1]
            pyplot.subplot(122)
            pyplot.imshow(cv2.cvtColor(cropped_image, cv2.COLOR_BGR2RGB))
            pyplot.suptitle("Location" + str(index + 1))
            reader = easyocr.Reader(['en'])
            result = reader.readtext(cropped_image)
            if (result):
                pyplot.xlabel("Number found:" + result[0][-2])
                acc.append(result[0][-1])
                results.append(result)
            if index == len(locations) - 1:
                print("Locations found(Rectangular shapes that looks like a plate) :", len(locations))
                print("Plates found:", len(results))
                print(results)
                if results:
                    most_accurate_plate= results[acc.index(max(acc))]
                    print("Most accurate result:",most_accurate_plate)

    pyplot.show()

    return jsonify({"Number plate" :most_accurate_plate})

def RemoveExpiredReservations():
    global datetime_now
    ExpiredReservations = []
    try:
        cursor.execute("""Select `slot_id`, `idReservations`,`location_id` from Reservations where EndDate < %(now)s""",{'now': datetime_now})
        ExpiredReservations = getJsonAsDict(cursor)
        # print(datetime_now,'2023-06-30 23:59:59')
        for reservation in ExpiredReservations:
            cursor.execute("Delete from Reservations where idReservations= %s ",(reservation["idReservations"],) )
            cursor.execute("Update ParkingSlots SET reserved = 0 where idParkingSlots= %s",(reservation['slot_id'],))
            cursor.execute("Update Locations SET available_spaces=available_spaces + 1 where id =%s ",(reservation['location_id'],))
            conn.commit()
    except Exception as e:
        print(e)


def getCurrent_time():
    now = datetime.today()
    global datetime_now
    datetime_now=now.strftime("%Y-%m-%d %H:%M:%S")



def UpdateReservedSlots():
  global datetime_now


  # now = datetime.today()
  # formated_now=now.strftime("%Y-%m-%d %H:%M:%S")
  # print("FORmat,",formated_now)
  try:
      cursor.execute("""Select `slot_id`,`location_id` from Reservations where StartDate < %(now)s AND EndDate > %(now)s""", {'now':datetime_now})

      ReservedNow = getJsonAsDict(cursor)
      print("Slots reserved now:",ReservedNow)
      if len(ReservedNow)!=0:
          for reservation in ReservedNow:
              cursor.execute("Select `idParkingSlots`, `location_id` from  ParkingSlots where idParkingSlots = %s AND reserved =0 ", (reservation['slot_id'],))
              parkingslots=getJsonAsDict(cursor)
              for slot in parkingslots:
                cursor.execute("Update ParkingSlots SET reserved=1 where idParkingSlots=%s",(slot['idParkingSlots'],))
                cursor.execute("Update Locations SET available_spaces=available_spaces-1 where id =%s ",(slot['location_id'],))
                conn.commit()

  except Exception as e:
      print(e)
def UpdateDB():
    UpdateReservedSlots()
    RemoveExpiredReservations()



if __name__ == "__main__":
    conn = mysql.connector.connect(
        user='admin',
        password='EJUj7dr4',
        host='licenta-db.c8fpudjzjpx3.eu-north-1.rds.amazonaws.com',
        database='aws-schema')
    cursor = conn.cursor(buffered=True)

    scheduler = BackgroundScheduler()
    scheduler.add_job(func=getCurrent_time, trigger="interval", seconds=1)
    scheduler.add_job(func=UpdateDB, trigger="interval", seconds=10)
    scheduler.start()
    app.run(debug=True, host='192.168.0.141' )


