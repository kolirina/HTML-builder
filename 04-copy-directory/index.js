const { readdir, mkdir, stat, copyFile, unlink } = require('fs/promises');
const path = require('path');

const currentPath = path.join(__dirname, 'files');
const destinationPath = path.join(__dirname, 'files-copy');

async function copyFiles() {
    const files = await readdir(currentPath);

    for (const file of files) {
        const filePath = path.join(currentPath, file);
        const destFilePath = path.join(destinationPath, file);

        await copyFile(filePath, destFilePath);
    }
}

async function clearFolder() {
    const files = await readdir(destinationPath);

    for (const file of files) {
        const filePath = path.join(destinationPath, file);

        await unlink(filePath);
    }
}

const copyAndClear = async() => {
    try {
        await stat(destinationPath);
        await clearFolder();
    } catch {
        await mkdir(destinationPath, { recursive: true });
    } finally {
        await copyFiles();
    }
};

copyAndClear();