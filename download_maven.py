import urllib.request
import zipfile
import os

url = 'https://start.spring.io/starter.zip?type=maven-project&language=java&bootVersion=3.2.4&baseDir=backend_temp&groupId=com.taskflow&artifactId=backend&name=taskflow&packageName=com.taskflow&packaging=jar&javaVersion=17&dependencies=web,data-jpa,mysql,security,validation,lombok'
zip_path = 'backend_temp.zip'

print("Downloading Spring Boot zip...")
urllib.request.urlretrieve(url, zip_path)

print("Extracting zip...")
with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    zip_ref.extractall('.')

print("Done.")
