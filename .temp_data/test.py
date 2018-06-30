import base64


data_new = base64.b64encode(open("bw.png", "rb").read())
# data_uri = open("bw.png", "rb").read().encode("base64").replace("\n", "")
# HTML Image Element
# img_tag = '<img alt="" src="data:image/png;base64,{0}">'.format(data_uri)
# print(data_uri[:30])
print(str(data_new[:30], 'utf-8'))
# CSS Background Image
# css = 'background-image: url(data:image/png;base64,{0});'.format(data_uri)
# print(css[])