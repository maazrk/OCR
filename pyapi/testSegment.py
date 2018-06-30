import cv2
import numpy as np

img = '/media/groot/Data_and_Games/Projects/ComputerVision/deepblue/test/electron-python-example/demo_inputs/print/img_0_modified.jpg'
THRESHOLD = 0.05
img = cv2.imread(img, 0)
ret,img = cv2.threshold(img,127,255,cv2.THRESH_BINARY)
img = cv2.bitwise_not(img)
col_histo_width = img.shape[1]
col_histo_height = img.shape[0]
col_histogram = np.zeros((col_histo_height, col_histo_width), np.uint8)

# Initializing horizontal histogram
row_histo_height = img.shape[0]
row_histo_width = img.shape[1]
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
        if abs(starting_idx - last_idx) > 15:
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

cv2.imshow('col', img)
cv2.waitKey(0)
coordinates = []
# returning character coordinates
for idx, digit in enumerate(all_digit_rects):
    y1, y2, x1, x2 = (all_digit_rects[idx][0], all_digit_rects[idx][1], all_digit_rects[idx][2], all_digit_rects[idx][3])
    coordinates.append((x1, y1, x2, y2))
print(coordinates)
# return coordinates