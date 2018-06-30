import math
import cv2
import numpy as np
import matplotlib.pyplot as plt
import os
import glob
from keras.applications import VGG16
import string
import csv
import pandas as pd
from keras.models import load_model
import shutil
import json
from prediction_from_file import filePrediction
from keras.preprocessing.image import ImageDataGenerator
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

class segmenting_digits_from_directory:

    def __init__(self):
        self.model = load_model("bottleneck_model.h5")
        self.img_width, self.img_heigth = 150, 150
        self.datagen = ImageDataGenerator(rescale=1/.255)
        # self.THRESHOLD = 0.01
    
    def make_prediction(self):
        pred = filePrediction()
        predictions, confidence = pred.prediction()
        word = "".join(predictions)
        return (word, confidence)

    def write_to_csv(self, field, field_entry, confidence, confidence_entry):
        dataframe = pd.DataFrame()
        # dataframe = pd.read_csv("output.csv")
        dataframe[field] = field_entry
        dataframe[confidence] = confidence_entry
        dataframe.to_csv("output.csv", sep='\t')

    def segmentation(self, img):
        THRESHOLD = 0.01
        img = cv2.imread(img, 0)
        img = cv2.bitwise_not(img)
        col_histo_width = img.shape[1]
        col_histo_height = 200
        col_histogram = np.zeros((col_histo_height, col_histo_width), np.uint8)

        # Initializing horizontal histogram
        row_histo_height = img.shape[0]
        row_histo_width = 400
        row_histogram = np.zeros((row_histo_height, row_histo_width), np.uint8)

        # Calculating horizontal histogram
        row_histo_width = 0
        for row in range(row_histo_height):
            running_sum = sum(img[row, :]) // 255
            row_histogram[row, :running_sum] = 255
            if running_sum > row_histo_width:
                row_histo_width = running_sum

        # cut off the histogram image where histo ends
        row_histogram = row_histogram[:, :row_histo_width]

        # calculating bounding indexes for rows using the histogram 
        all_digit_rects = []
        line_rects = []
        starting_idx = False
        for j in range(row_histo_height):
            thresholded_idx = int(THRESHOLD*row_histo_width)
            if row_histogram[j,thresholded_idx] == 255 and not starting_idx:
                starting_idx = j
            elif row_histogram[j,thresholded_idx] != 255 and starting_idx != False:
                last_idx = j
                if abs(starting_idx - last_idx) > 1:
                    line_rects.append((starting_idx, last_idx))
                starting_idx = False

        if len(line_rects) == 0:
            line_rects.append((0, row_histo_height))

        for idx, line_rect in enumerate(line_rects):
            line = img[line_rect[0]:line_rect[1], :]

            # Initializing vertical histogram
            col_histo_width = img.shape[1]
            col_histogram = np.zeros((col_histo_height, col_histo_width), np.uint8)

            # calculating vertical histogram for current row
            col_histo_height = 0
            for column in range(col_histo_width):
                running_sum = sum(line[:, column]) // 255
                col_histogram[:running_sum, column] = 255
                if running_sum > col_histo_height:
                    col_histo_height = running_sum
            col_histogram = col_histogram[:col_histo_height, :]

        # calculating bounding boxes for each digit
            digit_rects = []
            starting_idx = False
            for j in range(col_histo_width):
                thresholded_idx = int(THRESHOLD*col_histo_height)
                if col_histogram[thresholded_idx,j] == 255 and not starting_idx:
                    starting_idx = j
                elif col_histogram[thresholded_idx,j] != 255 and starting_idx != False:
                    last_idx = j
                    if abs(starting_idx - last_idx) > 1:
                        digit_rects.append((starting_idx, last_idx))
                    starting_idx = False
            for digit in digit_rects:
                all_digit_rects.append((line_rect[0],line_rect[1], digit[0], digit[1]))

        coordinates = []
        # returning character coordinates
        for idx, digit in enumerate(all_digit_rects):
            y1, y2, x1, x2 = (all_digit_rects[idx][0], all_digit_rects[idx][1], all_digit_rects[idx][2], all_digit_rects[idx][3])
            coordinates.append((x1, y1, x2, y2))
        # print(coordinates)
        return coordinates

    def complete_function(self):
        field_directories = os.listdir(os.path.join("Field_Directories"))
        # reading different fields
        count = 0
        update_info = dict()
        for index, field in enumerate(field_directories):
            
            current_field_entry = []
            current_field_confidence = []
            
            print("Processing Field : {0}".format(field))
            # reading the images in sorted order
            images = glob.glob(os.path.join("Field_Directories",field, "*.jpg"))
            images = [img.split('/')[-1] for img in images]
            images = sorted(images, key = lambda name: int(name[4:-4]))
            total_number_of_files = len(images)
            for idx,img in enumerate(images):

                # updating the loader
                update_info["process"] = "Segmenting Characters from Images"
                update_info["field"] = field
                update_info["total_number_of_files"] = total_number_of_files
                update_info["current_file_number"] = idx
                with open("update_text.txt", "w") as file:
                    file.write(json.dumps(update_info))

                reading_image = os.path.join("Field_Directories", field, img)
                print("\tWorking on Image : {0}".format(reading_image))
                character_coordinates = self.segmentation(reading_image)
                # print(len(character_coordinates))
                image = cv2.imread(reading_image)
                # reading character coordinates in the image
                for idx, coordinates in enumerate(character_coordinates):
                    x1, y1, x2, y2 = coordinates
                    if not os.path.exists("data"):
                        os.makedirs("data")
                        os.makedirs(os.path.join("data", "test"))
                    img_name = "img_"+str(idx)+".jpg"
                    character = image[y1: y2, x1:x2]
                    cv2.imwrite(os.path.join("data", "test", img_name), character)
                
                word, confidence = self.make_prediction()
                confidences = []
                for row in confidence:
                    confidences.append(np.max(row))
                # print(word,np.max(confidence))
                current_field_entry.append(word)
                current_field_confidence.append(confidences)
                shutil.rmtree("data")
            self.write_to_csv(field, current_field_entry, "Confidence"+str(field), current_field_confidence)