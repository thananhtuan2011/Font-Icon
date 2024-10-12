const { exec } = require('child_process');

exec('git remote set-branches --add origin master');
exec('git fetch');
exec('git diff origin/master --name-only', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error running git diff: ${error}`);
    } else {
        const filePaths = stdout.split('\n');
        const includeFiles = getIncludeFiles(filePaths);
        exec(`ng test --code-coverage --watch=false --browsers ChromeHeadless ${includeFiles}`, (error, stdout, stderr) => {
            console.log(error, stdout, stderr);
        })
    }
});

function getIncludeFiles(files) {
    if (!Array.isArray(files)) {
        return;
    }

    const includeStartPath = 'src/';
    const includeEndFile = '.ts';
    let newFilePaths = files.filter((filePath) => {
        if (typeof filePath !== 'string') {
            return false;
        }

        if (!filePath.startsWith(includeStartPath) || !filePath.endsWith(includeEndFile)) {
            return false;
        }

        return true;
    })

    newFilePaths = newFilePaths.map(file => {
        const arrPath = file.split('/');
        arrPath[arrPath.length - 1] = '*.spec.ts'
        return arrPath.join('/');
    })
    newFilePaths = [...new Set(newFilePaths)];
    return `--include ${newFilePaths.join(' --include ')}`
}
