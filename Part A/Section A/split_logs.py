# from collections import Counter


def split_file(file_name: str, lines_per_file: int) -> list:
    with open(file_name, 'r') as file:
        lines = file.readlines()
        num_lines = len(lines)

    file_parts = []

    for i in range(0, num_lines, lines_per_file):
        chunk_name = f"{file_name}_part_{i//lines_per_file + 1}.txt"
        with open(chunk_name, 'w') as chunk_file:
            chunk_file.writelines(lines[i:i + lines_per_file])
        file_parts.append(chunk_name)
        print(f"Created chunk: {chunk_name}")   

    return file_parts


def count_errors_in_file(file_name: str) -> dict:
    error_count = {}
    with open(file_name, 'r') as file:
        for line in file:
            error_code = line.split(", Error: ")[1].strip().replace('"', '')
            if error_code in error_count:
                error_count[error_code] += 1 
            else:
                error_count[error_code] = 1
    return error_count


def merge_error_counts(file_parts: list) -> dict:
    total_error_count = {}

    for part in file_parts:
        part_counts: dict = count_errors_in_file(part)
        for error, count in part_counts.items():
            total_error_count[error] = total_error_count.get(error, 0) + count

    return total_error_count


def get_top_n_errors(error_count: dict, N: int):
    sorted_errors = sorted(error_count.items(), key=lambda item: item[1], reverse=True)
    return sorted_errors[:N]


def process_logs(file_name: str, N: int):
    file_parts: list = split_file(file_name, 100000)
    total_error_count: dict = merge_error_counts(file_parts)
    top_errors_lst = get_top_n_errors(total_error_count, N)

    return top_errors_lst


top_errors = process_logs("logs.txt", 5)
print(top_errors)
