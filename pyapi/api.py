from __future__ import print_function
import os
from calc import calc as real_calc
import sys
import zerorpc
import base64
import cv2
import csv
import json
import ocr
import threading
import tensorflow as tf
import numpy as np


class PyApi(object):

    def getProjectDirPath(self):
        projectDir = os.path.realpath('')
        return projectDir

    def traverseUp(self, path):
        upPath = os.path.join(path, '..')
        upPath = os.path.realpath(upPath)
        return upPath

    def getCurrDir(self, customPath):

        currDir = os.path.realpath(customPath)
        children = [os.path.join(currDir, child)
                    for child in os.listdir(currDir)]
        response = []
        for child in children:
            part_res = {}
            if os.path.isdir(child):
                part_res['type'] = 'dir'
            else:
                part_res['type'] = 'file'
            part_res['full_path'] = child
            part_res['name'] = os.path.basename(child)
            response.append(part_res)

        return response

    def displayImage(self, path):
        try:
            encoded_img = ''
            with open(path, "rb") as image:
                img_data = image.read()
                encoded_img = base64.b64encode(img_data)
                encoded_img =  str(encoded_img, 'utf-8')
            height, width, channels = cv2.imread(path).shape
            # encoded_img = open(path, "rb").read().encode("base64").replace("\n", "")
            return {'encoded_img': encoded_img, 'height': height, 'width': width}
        except:
            return 'error'

    
    def sendCsvData(self, path):
        data = list(csv.reader(open(path, 'r')))
        first_idx = 0
        for idx, ele in enumerate(data[0]):
            if ele == "Image Name":
                first_idx = idx
                break
        
        data = np.array(data)
        print(data[:, first_idx:].tolist())
        return data[:, first_idx:].tolist()
    
    def saveCsvData(self, columns, data):

        with open('../.temp_data/op.csv', 'w') as fp:

            csvWriter = csv.writer(fp, delimiter=',')
            tempRow = ['imageName']
            for col in columns[1:]:
                tempRow.append(col)
            csvWriter.writerow(tempRow)

            for row in data:
                tempRow = [row['imageLink']['name']]
                for col in columns[1:]:
                    tempRow.append(row[col])
                csvWriter.writerow(tempRow)
        
        return 'success'
    
    def readAndReturnFirstImage(self, path):

        dirs = os.listdir(path)
        file_path = os.path.join(path, dirs[0])
        file_name = dirs[0]

        return [file_name, file_path]
    
    def makePredictions(self, path, fieldInfo):
        ocr_ref = ocr.ocr()
        coord = tf.train.Coordinator()

        threads = [threading.Thread(target=ocr_ref.complete_function, args=(coord, path, fieldInfo))]
        threads[0].daemon = True
        threads[0].start()
        # threads[0].join()
        # coord.join(threads)
        # res = ocr_ref.complete_function(path, fieldInfo)
        
        return 'running'
        
    def testCropping(self, path, fieldInfo):
        dimensions = fieldInfo[0]
        with open('.temp_data/testdim.txt', 'w') as fp:
            fp.write(json.dumps(dimensions))
        img = cv2.imread(path)
        x_coord = int(dimensions['x'])
        y_coord = int(dimensions['y'])
        width = int(dimensions['width'])
        height = int(dimensions['height'])

        if len(img.shape) == 3:
            crop_img = img[y_coord:y_coord+height, x_coord:x_coord+width, :]
        else:
            crop_img = img[y_coord:y_coord+height, x_coord:x_coord+width]
        cv2.imwrite('.temp_data/test.jpg', crop_img)
        return 'success'

    def getStatus(self):
        percent_complete = 0
        process_name = 'Loading the networks'

        data = {
            'process': 'Loading the Nets!',
            'total_number_of_files': 1,
            'current_file_number': 0
        }
        if os.path.exists('update.txt'):
            with open('update.txt') as fp:
                data = json.load(fp)
        print(data)
        return data

    def echo(self, text):
        """echo any text"""
        return text


def parse_port():
    port = 4242
    try:
        port = int(sys.argv[1])
    except Exception as e:
        pass
    return '{}'.format(port)


def main():
    addr = 'tcp://127.0.0.1:' + parse_port()
    s = zerorpc.Server(PyApi())
    s.bind(addr)
    print('start running on {}'.format(addr))
    s.run()


if __name__ == '__main__':
    main()
