from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import time

searchKey = input("key word input :")

driver = webdriver.Chrome()
driver.get(
    f"https://www.google.com/search?q={searchKey}&bih=742&biw=1205&hl=ko&source=hp&ei=bId9ZNKTIKLK9AOg6ITgDw&iflsig=AOEireoAAAAAZH2VfMx-9dg2Ph9af3Jmcv0jMF8YRLGq&ved=0ahUKEwjS-Z7dxqv_AhUiJX0KHSA0AfwQ4dUDCAs&uact=5&oq={searchKey}&gs_lcp=Cgdnd3Mtd2l6EANQ5AFYggZgmQdoAXAAeACAAQCIAQCSAQCYAQCgAQGwAQA&sclient=gws-wiz"
)

btn = driver.find_element(
    By.CSS_SELECTOR,
    "#cnt > div:nth-child(8) > div > div > div > div.TrmO7 > div > a:nth-child(3)",
)
time.sleep(10)
btn.click()


driver.close()
