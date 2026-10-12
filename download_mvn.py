import urllib.request
import tarfile
import os

maven_url = 'https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.tar.gz'
tar_path = 'maven.tar.gz'

print("Downloading Maven...")
urllib.request.urlretrieve(maven_url, tar_path)

print("Extracting Maven...")
with tarfile.open(tar_path, 'r:gz') as tar_ref:
    tar_ref.extractall('.')

print("Done. Maven is in apache-maven-3.9.6 folder.")
