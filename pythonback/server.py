import numpy as np
import logging
import tensorflow as tf
import datetime
import tensorflow_hub as hub
import uuid
import subprocess
import os
from flask import Flask, request, jsonify
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
)
from datetime import timedelta
from flask_bcrypt import Bcrypt
from PIL import Image
from sqlalchemy import create_engine, Column, String, Date
from sqlalchemy.orm import declarative_base, sessionmaker

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

classification_model = tf.keras.models.load_model(
    "/Users/nicode./MainSpace/capstone_1/pythonback/garbage_classifier"
)

module_handle = (
    "https://tfhub.dev/google/faster_rcnn/openimages_v4/inception_resnet_v2/1"
)

detector = hub.load(module_handle).signatures["default"]

categoris = np.array(
    ["battery", "cardboard", "clothes", "glass", "metal", "plastic", "shoes"]
)


# 넘어온 이미지의 확장자에 따라 변환을 마치고 로컬에 저장한다.
def convertImgExt(targetpath):
    image_path = "/Users/nicode./MainSpace/capstone_1/pythonback/saved/"
    path, ext = os.path.splitext(targetpath)
    savePath = image_path + str(uuid.uuid4()) + ".jpeg"
    if ext.lower() == ".heic":
        try:
            # sips 명령어를 사용하여 HEIC 파일을 JPEG 파일로 변환
            subprocess.run(
                [
                    "sips",
                    "--setProperty",
                    "format",
                    "jpeg",
                    targetpath,
                    "--out",
                    savePath,
                ],
                check=True,
            )
        except subprocess.CalledProcessError as e:
            print(f"Error: {e}")
    elif ext.lower() == ".png":
        im = Image.open(targetpath).convert("RGB")
        im.save(savePath, "jpeg")
    elif ext.lower() == ".jpeg" or ext.lower() == ".jpg":
        im = Image.open(targetpath).convert("RGB")
        im.save(savePath, "jpeg")
    os.remove(targetpath)
    return savePath


def load_img(path):
    img = tf.io.read_file(path)
    img = tf.image.decode_jpeg(img, channels=3)
    return img


def run_detector(detector, path):
    # 임시 이미지 로드
    img = load_img(path)
    converted_img = tf.image.convert_image_dtype(img, tf.float32)[tf.newaxis, ...]

    # 객체 감지
    result = detector(converted_img)
    result = {key: value.numpy() for key, value in result.items()}

    detection_class_entities = np.array([])
    detection_scores = np.array([])
    detection_boxes = np.array([])

    for i in range(min(result["detection_boxes"].shape[0], 10)):
        if result["detection_scores"][i] >= 0.1:
            ymin, xmin, ymax, xmax = tuple(result["detection_boxes"][i])

            imgn = img.numpy()
            image_pil = Image.fromarray(np.uint8(imgn)).convert("RGB")
            im_width, im_height = image_pil.size
            (left, right, top, bottom) = (
                xmin * im_width,
                xmax * im_width,
                ymin * im_height,
                ymax * im_height,
            )

            cropped_img = image_pil.crop((left, top, right, bottom))
            cropped_img = cropped_img.resize((224, 224))
            cropped_img = np.array(cropped_img) / 255.0
            cropped_img = np.expand_dims(cropped_img, axis=0)
            pred = classification_model.predict(cropped_img)
            detection_boxes = np.append(detection_boxes, (ymin, xmin, ymax, xmax))
            detection_scores = np.append(detection_scores, np.max(pred))
            detection_class_entities = np.append(
                detection_class_entities, categoris[np.argmax(pred)]
            )
    return detection_class_entities, detection_scores, detection_boxes


app = Flask(__name__)

app.config.from_pyfile("config.py")
app.config["SECRET_KEY"] = "ef4uioh3f995ghu3"
app.config["BCRYPT_LEVEL"] = 10
app.config["JWT_SECRET_KEY"] = "fjiwoe3oeiwjr432"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=5)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=7)

jwt = JWTManager(app)
bcrypt = Bcrypt(app)

engine = create_engine(
    app.config["DB_URL"], encoding="utf-8", max_overflow=0, echo=True
)
app.database = engine
Base = declarative_base()


class user(Base):
    __tablename__ = "user"
    id = Column(String(32), primary_key=True)
    pw = Column(String(256), nullable=False)
    joindate = Column(Date, default=datetime.datetime.now)


user.__table__.create(bind=engine, checkfirst=True)
Session = sessionmaker(bind=engine)
session = Session()


@app.route("/uploadImage", methods=["POST", "get"])
def getImage():
    f2 = request.files["image"]
    logger.info("=========================================================")

    f2.save("/Users/nicode./MainSpace/capstone_1/pythonback/saved/" + f2.filename)
    p = convertImgExt(
        "/Users/nicode./MainSpace/capstone_1/pythonback/saved/" + f2.filename
    )
    cn, s, b = run_detector(detector, p)

    return jsonify(
        {
            "classNames": cn.tolist(),
            "score": s.tolist(),
            "boundBoxCoordinates": b.tolist(),
        }
    )


@app.route("/signup", methods=["POST", "GET"])
def signup():
    select = session.query(user).filter(user.id == request.form["email"]).count()
    if select != 0:
        return "email_overlap"

    newuser = user(
        id=request.form["email"],
        pw=bcrypt.generate_password_hash(request.form["password"]),
    )
    session.add(newuser)
    session.commit()
    return "signup_success"


@app.route("/login", methods=["POST", "GET"])
def login():
    email = request.form["email"]
    hash = ""
    selectAll = session.query(user).all()
    for row in selectAll:
        if row.id == email:
            hash = row.pw
    if hash == "":
        return jsonify({"res": "id_not_found"})
    check = bcrypt.check_password_hash(hash, request.form["password"])
    if check:
        access_token = create_access_token(identity=email)
        refresh_token = create_refresh_token(identity=email)
        return jsonify(
            {
                "res": "login_success",
                "access_token": access_token,
                "refresh_token": refresh_token,
            }
        )
    else:
        return jsonify({"res": "password_mismatch"})


@app.route("/getAccess", methods=["POST", "GET"])
@jwt_required(refresh=True)
def getAccess():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)
    return jsonify(access_token=access_token, email=current_user)


if __name__ == "__main__":
    app.run(debug=True)
