from flask import Flask,jsonify
from flask_sqlalchemy import SQLAlchemy
# import easyocr
# from easyocr import Reader
# from matplotlib import pyplot
import cv2

app=Flask(__name__)

@app.route("/",methods=['GET'])
def get():
        print("load")
        return jsonify({"Hello" :" World"})

@app.route("/script",methods=['GET'])
def script():
    width = 600
    height = 400

    # load the image, resize it, and convert it to grayscale
    image = cv2.imread("image3.jpg")
    # image = cv2.resize(image, (width, height))
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # load the number plate detector
    n_plate_detector = cv2.CascadeClassifier("haarcascade_car.xml")
    detections = n_plate_detector.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=7)

    # loop over the number plate bounding boxes
    for (x, y, w, h) in detections:
        # draw a rectangle around the number plate
        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 255), 2)
        cv2.putText(image, "Number plate detected", (x - 20, y - 10),
                    cv2.FONT_HERSHEY_COMPLEX, 0.5, (0, 255, 255), 2)

        # extract the number plate from the grayscale image
        number_plate = gray[y:y + h, x:x + w]

    # reader = Reader(['en'])
    # result = reader.readtext(number_plate)
    # text = result[0][-2]
    # pyplot.figure(1)
    # pyplot.imshow(number_plate)
    # pyplot.figure(2)
    # pyplot.imshow(image)
    # pyplot.show()


    print('text')
    return jsonify({"Number" :'text'})

if __name__ == "__main__":
    app.run(debug=True)
