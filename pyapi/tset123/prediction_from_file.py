import numpy as np
from keras.preprocessing.image import ImageDataGenerator
from keras.models import load_model
from keras.utils import plot_model
from keras import applications 
import string
import glob
from datetime import datetime
import os
os.environ['TF_CPP_MIN_LOG_LEVEL']='2'

class filePrediction:

    def prediction(self):
        img_width, img_height = 150, 150
        test_directory = os.path.join("data")
        batch_size = 16

        datagen = ImageDataGenerator(rescale=1./255)
        vgg_model = applications.VGG16(weights='imagenet', include_top=False)
        generator = datagen.flow_from_directory(
            test_directory,
            target_size=(img_width, img_height),
            batch_size = batch_size,
            class_mode = None,
            shuffle=False)

        bottleneck = vgg_model.predict_generator(generator, verbose=1)
        np.save(open('bottleneck_features_test.npy', 'wb'), bottleneck)

        test_model = load_model('bottleneck_model.h5')
        test_data = np.load(open('bottleneck_features_test.npy', 'rb'))

        # Predicting the output
        predictions = test_model.predict(test_data, verbose=1)
        confidence = predictions
        predictions = np.argmax(predictions, axis=-1)
        label_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9, 'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 
            'P': 15, 'Q': 16, 'R': 17, 'S': 18, 'T': 19, 'U': 20, 'V': 21, 'W': 22, 'X': 23, 'Y': 24, 'Z': 25}        
        label_map = dict((v,k) for k,v in label_map.items()) #flip k,v
        predictions = [label_map[k] for k in predictions]

        return (predictions, confidence)