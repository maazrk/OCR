import os
import glob
import json

class mapping_filenames:

    def __init__(self):
        self.count = 0
        self.file_dictionary = dict()
        self.contents = glob.glob("random_images/*.jpg")

    def complete_function(self):
        for idx, file_name in enumerate(self.contents):
            file_name = file_name.split('/')[-1]
            self.file_dictionary[file_name] = "img_"+str(idx)+".jpg"
            os.rename("random_images/"+file_name, "random_images/img_"+str(idx)+".jpg")

        with open("mapped_filenames.txt", "w") as file:
            file.write(json.dumps(self.file_dictionary))