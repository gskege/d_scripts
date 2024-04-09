import pyperclip
import os
import sys
double_slash = "\\"
def get_path(input):
    if double_slash in input:
        if len(sys.argv) > 1:
            return f"yarn test {input.split(double_slash)[-1]} {sys.argv[1]}"
        return f"yarn test {input.split(double_slash)[-1]}"
    return ''

def main():
    text = pyperclip.paste()
    new_text = get_path(text)
    # pyperclip.copy(new_text)
    os.system(new_text)


if __name__ == "__main__":
    main()
