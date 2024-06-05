import subprocess
import sys

# ANSI转义序列颜色代码
class Color:
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    MAGENTA = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    RESET = '\033[0m'  # 重置颜色

ts_file_paths = []
less_file_paths = []

# 定义一个过滤函数，用于检查字符串是否为空
def is_not_empty(s):
    return bool(s.strip())

def get_diff_files(current_branch, remote_main_branch):
    try:
        # 使用subprocess.run来执行git命令
        result = subprocess.run(
            ['git', 'diff', '--name-only','--diff-filter=d', remote_main_branch + '...' + current_branch],
            check=True, stdout=subprocess.PIPE, text=True)
        
        # 返回差异文件列表
        return list(filter(is_not_empty,result.stdout.strip().split('\n')))
    except subprocess.CalledProcessError as e:
        print("Failed to get differences:", e)
        return []

def git_fetcher():
    try:
        subprocess.run(['git', 'fetch'])    
    except subprocess.CalledProcessError as e:
        print("Failed to fetch",e)

def get_current_branch_name():
    return subprocess.run(['git', 'branch', '--show-current'],
            check=True, stdout=subprocess.PIPE, text=True).stdout.strip()

def check_ts_syntax_rules():
  for file_path in ts_file_paths:   
       # 打开文件
    with open(file_path, 'r', encoding='utf-8') as file:
        # 逐行读取文件
        for line in file:
            if 'className=' in line:
                print_colored_text(file_path,Color.CYAN)
                print(line)
                break

def check_less_syntax_rules():
  for file_path in less_file_paths:     
      # 打开文件
    with open(file_path, 'r', encoding='utf-8') as file:
        # 逐行读取文件
        for line in file:
            if '.gen-' in line:
                print_colored_text(file_path,Color.CYAN)
                print(line)
                break
          

def check_syntax_rules(diff_files):
     for file in diff_files:
         if file.endswith('.ts') or file.endswith('.tsx'):
             ts_file_paths.append(file)
         elif file.endswith('.less'):
             less_file_paths.append(file)
             
def line(str):
    repeat = 50
    return f"{'='* repeat} {str} {'='* repeat}"

# 定义打印彩色文本的函数
def print_colored_text(text, color):
    print(color + text + Color.RESET)


def checkout_branch(branch):
    try:
        subprocess.run(['git', 'checkout','-b', branch, f'origin/{branch}'])    
    except subprocess.CalledProcessError as e:
        print("Failed checkout",e)

def git_pull():
    try:
        subprocess.run(['git', 'pull'])    
    except subprocess.CalledProcessError as e:
        print("Failed git pull",e)    
        
def main():
    if len(sys.argv) > 1:
      git_fetcher()     
      current_branch_name = get_current_branch_name()
      if  current_branch_name != sys.argv[1]:
          checkout_branch(sys.argv[1])
        #   重新获取当前分支
          current_branch_name = get_current_branch_name()
      git_pull()          
      # 使用函数获取远程分支与主分支的差异文件
     
      diff_files = get_diff_files(current_branch_name, 'origin/master')

      print_colored_text(f'The total number of additions and modifications: {len(diff_files)}',Color.YELLOW)
      if diff_files:
          check_syntax_rules(diff_files)
          print_colored_text(line('less'),Color.RED)
          check_less_syntax_rules()
          print_colored_text(line('ts,tsx'),Color.RED)
          check_ts_syntax_rules()
          sys.exit(0)  # 正常退出
      else:
          print_colored_text("No differences found or an error occurred.",Color.RED)
          sys.exit(1)
    else:
      print_colored_text('Please provide a branch name!',Color.RED) 


if __name__ == '__main__':
  main()
