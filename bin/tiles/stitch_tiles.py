from PIL import Image

# http://stackoverflow.com/questions/10657383/stitching-photos-together

MIN = 1
MAX = 12

def padTwoDigits(number):
    if number < 10:
        return "0" + str(number)
    return str(number)

def getFilename(y, x):
    return padTwoDigits(y) + "_" + padTwoDigits(x) + ".png"

def main():

    tiles = {}
    totalWidth = 0
    totalHeight = 0

    for y in range(1, MAX+1):
        tiles[y] = {}
        for x in range(1, MAX+1):
            fileName = getFilename(y, x)
            tile = Image.open(fileName)
            tiles[y][x] = tile

    for i in range(1, MAX+1):
        (width, height) = tiles[i][i].size
        totalWidth += width
        totalHeight += height

    print totalWidth
    print totalHeight

    (baseWidth, baseHeight) = tiles[1][1].size

    result = Image.new('RGB', (totalWidth, totalHeight))
    for y in range(1, MAX+1):
        for x in range(1, MAX+1):
            tile = tiles[y][x]
            h = (y-1) * baseWidth
            w = (x-1) * baseHeight
            result.paste(im=tile, box=(w,h))

    result.save("stich.png")


main()
