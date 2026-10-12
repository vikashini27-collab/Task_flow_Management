import os
import re

base_dir = r"d:\Task_management_system\TASKFLOW\backend\src\main\java\com\taskflow"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove lombok imports
    content = re.sub(r'import lombok\..*;\n', '', content)
    
    # Remove lombok annotations
    content = re.sub(r'@Data\n', '', content)
    content = re.sub(r'@Getter\n', '', content)
    content = re.sub(r'@Setter\n', '', content)
    content = re.sub(r'@NoArgsConstructor\n', '', content)
    content = re.sub(r'@AllArgsConstructor\n', '', content)
    content = re.sub(r'@Builder\n', '', content)
    content = re.sub(r'@RequiredArgsConstructor\n', '', content)

    # We have to manually add constructors, getters, setters.
    # Actually, generating this via AST is hard in python regex.
    # Since there are only a few files, let's just overwrite them completely.

    return content

# I will just overwrite the few files that were using lombok.
# Let's generate the complete java code without lombok.
