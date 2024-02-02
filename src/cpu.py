import multiprocessing

# 获取CPU核数
num_cores = multiprocessing.cpu_count()
print("CPU核数:", num_cores)