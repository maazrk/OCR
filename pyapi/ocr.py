import extract_input_fields
import segment_digits_from_directories
import mapping_filenames
import os
import tensorflow as tf

graph = tf.get_default_graph()

class ocr:

    def __init__(self):
        pass

    def complete_function(self, coord, input_dir, field_info):
        with graph.as_default():
            input_dir = os.path.dirname(input_dir)

            # try:
            mapping = mapping_filenames.mapping_filenames(input_dir)
            mapping.complete_function()                                                                               

            # creates field directories
            extracting = extract_input_fields.extracting_input_fields(field_info, input_dir)
            extracting.complete_function()

            # makes prediction for each field individually
            segmenting = segment_digits_from_directories.segmenting_digits_from_directory()
            segmenting.complete_function()

            coord.request_stop()
        return 'success123'
        # except:
            # return 'error'