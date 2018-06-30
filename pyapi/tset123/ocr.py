import extract_input_fields
import segment_digits_from_directories
import mapping_filenames

mapping = mapping_filenames.mapping_filenames()
mapping.complete_function()                                                                               

# creates field directories
# extracting = extract_input_fields.extracting_input_fields()
# extracting.complete_function()

# makes prediction for each field individually
segmenting = segment_digits_from_directories.segmenting_digits_from_directory()
segmenting.complete_function()