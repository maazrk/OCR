import cv2
import numpy as np
import os
import sys
import glob
import pandas as pd
import json

class extracting_input_fields:

    def __init__(self):
        self.base_directory = "Field_Directories"
        
        if not os.path.exists(self.base_directory):
            os.makedirs(self.base_directory)

        self.structure = [
            {
                'input_field': 'Name',
                'type': 'string',
                'coordinates': 
                {
                    'left_corner': (0,0),
                    'height': 10,
                    'width': 10
                },
            },
            {
                'input_field' : 'Surname',
                'type' : 'string',
                'coordinates':
                {
                    'left_corner': (0, 0),
                    'height': 10,
                    'width': 10
                }
            }
        ]

    def write_to_csv(self, img_names, img_paths):
        dataframe = pd.DataFrame()
        dataframe['Image Name'] = img_names
        dataframe['Image Paths'] = img_paths
        dataframe.to_csv('output.csv', sep='\t') 

    def extract_information(self, structure_input, image_input, img_name_input):
        for info in structure_input:
            input_field = info['input_field']
            type_field = info['type']
            left_corner = info['coordinates']['left_corner']
            height = info['coordinates']['height']
            width = info['coordinates']['width']
            if not os.path.exists(os.path.join(self.base_directory, input_field)):
                os.makedirs(os.path.join(self.base_directory, input_field))
            x, y = left_corner
            img_name = os.path.join(self.base_directory, input_field, img_name_input)   
            image = image_input[y:y+height, x:x+width]
            cv2.imwrite(img_name, image)

    def complete_function(self):
        img_paths = []
        img_names = []
        path = os.path.join("Input_Directory", "*.jpg")
        images = glob.glob(path)
        images = [img.split('/')[-1] for img in images] # example img_1.jpg
        images = sorted(images, key = lambda name: int(name[4:-4]))
        for idx,img in enumerate(images):

            # updating to the loader
            update_info = dict()
            update_info["process"] = "Extracting Input Fields from Images"
            update_info["total_number_of_files"] = len(images)
            update_info["current_file_number"] = idx
            with open("update.txt", "w") as file:
                file.write(json.dumps(update_info))

            image = cv2.imread(os.path.join("Input_Directory", img))
            print(os.path.join("Input_Directory", img))
            img_name = img.split('/')[-1]
            self.extract_information(self.structure, image, img_name)
            img_names.append(img)
            img_paths.append(os.path.join("Input_Directory", img))

        self.write_to_csv(img_names, img_paths)