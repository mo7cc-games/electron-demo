import shell from 'shelljs';

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
}
// 获取当前执行命令的目录
const currentDir = process.cwd();
shell.cd(currentDir);
console.info('当前执行命令的目录:', shell.pwd().toString());

const result = shell.exec('git clean -fdX');
if (result.code !== 0) {
  console.warn('Error: Git clean command failed');
  shell.exit(1);
}

console.info('Untracked files and directories removed successfully.');

process.exit(0);
