from flask import Flask, request, jsonify
import numpy as np
import logging
import tensorflow as tf

import tensorflow_hub as hub
from PIL import Image
import uuid
import subprocess
import os

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


if __name__ == "__main__":
    app.run(debug=True)
