import os
import glob
import json

class mapping_filenames:

    def __init__(self, input_dir):
        self.count = 0
        self.file_dictionary = dict()
        self.input_dir = input_dir
        self.contents = glob.glob(self.input_dir+"/*.jpg")

    def complete_function(self):
        print('Mapping Filenames')
        for idx, file_name in enumerate(self.contents):
            file_name = file_name.split('/')[-1]
            self.file_dictionary[file_name] = "img_"+str(idx)+".jpg"
            os.rename(self.input_dir+"/"+file_name, self.input_dir+"/img_"+str(idx)+".jpg")

        with open("mapped_filenames.txt", "w") as file:
            file.write(json.dumps(self.file_dictionary))