import subprocess

heic_file_path = '/Users/nicode./Desktop/test.HEIC'
jpg_file_path = '/Users/nicode./Desktop/test.jpg'

# HEIC 파일 열기
with open(heic_file_path, 'rb') as heic_file:
    heic_data = heic_file.read()

# HEIC 파일을 JPEG 형식으로 변환
try:
    # sips 명령어를 사용하여 HEIC 파일을 JPEG 파일로 변환
    subprocess.run(['sips', '--setProperty', 'format', 'jpeg', heic_file_path, '--out', jpg_file_path], check=True)
except subprocess.CalledProcessError as e:
    print(f'Error: {e}')

