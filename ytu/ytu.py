import pyperclip
import os
double_slash = "\\"
def get_path(input):
    if double_slash in input:
        return "yarn test " + input.split(double_slash)[-1] + " -u"
    return ''

def main():
    text = pyperclip.paste()
    new_text = get_path(text)
    # pyperclip.copy(new_text)
    os.system(new_text)


if __name__ == "__main__":
    main()
