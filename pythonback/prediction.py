import numpy as np

import tensorflow as tf

import tensorflow_hub as hub
from PIL import Image
from PIL import ImageOps
import uuid
import subprocess
import os
import sys

module_handle = (
    "https://tfhub.dev/google/faster_rcnn/openimages_v4/inception_resnet_v2/1"
)

detector = hub.load(module_handle).signatures["default"]

classification_model = tf.keras.models.load_model("./garbage_classifier")

categoris = np.array(
    ["battery", "cardboard", "clothes", "glass", "metal", "plastic", "shoes"]
)


def convertImgExt(targetpath):
    path, ext = os.path.splitext(targetpath)
    savePath = "/Users/nicode./Desktop/saved/" + str(uuid.uuid4()) + ".jpeg"
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


def download_and_resize_image(url):
    temp_dir_path = "/Users/nicode./Desktop/tempImg/" + str(uuid.uuid4())
    pil_image = Image.open(url)
    w, h = pil_image.size
    # 이미지의 크기를 조절함 resize와 다른점은 이미지의 비율을 유지한다는것이고, Image.ANTIALIAS를 추가로 전달하면 좀더 부드럽게 리사이징 해준다고함.
    pil_image = ImageOps.fit(pil_image, (w, h), Image.ANTIALIAS)
    # 이미지를 RGB포맷으로 변환한다.
    pil_image_rgb = pil_image.convert("RGB")
    # quality는 저장될 이미지의 압축품질을 의미. 0 ~ 100이며 클수록 품질좋고 용량커짐.
    pil_image_rgb.save(temp_dir_path, format="JPEG", quality=90)
    return temp_dir_path

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


def main():
    image_url = convertImgExt(sys.argv[1])

    downloaded_image_path = download_and_resize_image(image_url)
    run_detector(detector, downloaded_image_path)


if __name__ == "__main__":
    main()
