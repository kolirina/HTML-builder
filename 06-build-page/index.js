const fsPromises = require('fs').promises;
const path = require('path');
const { pipeline } = require('stream/promises');
const fs = require('fs');

async function readTemplateFile() {
    const templatePath = path.join(__dirname, 'template.html');
    try {
        const templateContent = await fsPromises.readFile(templatePath, 'utf-8');
        return templateContent;
    } catch (error) {
        console.error(`Error reading template file: ${error.message}`);
        throw error;
    }
}

async function findTemplateTags(templateContent) {
    const tagRegex = /\{\{([^}]+)\}\}/g;
    const tags = [];
    let match;

    while ((match = tagRegex.exec(templateContent)) !== null) {
        tags.push(match[1]);
    }

    return [...new Set(tags)]; // Removing duplicate tags
}

async function replaceTemplateTags(templateContent, tags, componentsFolder) {
    for (const tag of tags) {
        const componentPath = path.join(componentsFolder, `${tag}.html`);

        try {
            const componentContent = await fsPromises.readFile(componentPath, 'utf-8');
            const tagRegex = new RegExp(`\\{\\{${tag}\\}\\}`, 'g');
            templateContent = templateContent.replace(tagRegex, componentContent);
        } catch (error) {
            console.error(`Error reading component file ${tag}.html: ${error.message}`);
        }
    }

    return templateContent;
}

async function writeIndexHtml(outputFolder, content) {
    const indexPath = path.join(outputFolder, 'index.html');
    try {
        await fsPromises.writeFile(indexPath, content, 'utf-8');
        console.log('index.html created successfully.');
    } catch (error) {
        console.error(`Error writing index.html: ${error.message}`);
        throw error;
    }
}

async function mergeFiles(filePaths, destinationPath) {
    for (const filePath of filePaths) {
        const reader = fs.createReadStream(filePath, { encoding: 'binary' });
        const writer = fs.createWriteStream(destinationPath, { flags: 'a', encoding: 'binary' });

        try {
            await pipeline(reader, writer);
        } catch (error) {
            console.error(`Error processing file ${filePath}:`, error);
        } finally {
            writer.end();
        }
    }
}

async function bundleStyles() {
    try {
        const stylesFolder = path.join(__dirname, 'styles');
        const files = await fsPromises.readdir(stylesFolder, { withFileTypes: true });

        const cssFilePaths = files
            .filter((file) => file.isFile() && path.extname(file.name) === '.css')
            .map((file) => path.join(stylesFolder, file.name));

        const bundlePath = path.join(__dirname, 'project-dist', 'style.css');

        await mergeFiles(cssFilePaths, bundlePath);
        console.log('Bundle created successfully.');
    } catch (error) {
        console.error('Error creating bundle:', error);
    }
}

async function copyFiles(sourceFolder, destinationFolder) {
    try {
        const files = await fsPromises.readdir(sourceFolder, { withFileTypes: true });

        for (const file of files) {
            const sourcePath = path.join(sourceFolder, file.name);
            const destinationPath = path.join(destinationFolder, file.name);

            if (file.isDirectory()) {
                // If it's a directory, recursively copy it
                await fsPromises.mkdir(destinationPath, { recursive: true });
                await copyFiles(sourcePath, destinationPath);
            } else {
                // Use binary encoding for reading and writing
                const fileData = await fsPromises.readFile(sourcePath, { encoding: 'binary' });
                await fsPromises.writeFile(destinationPath, fileData, { encoding: 'binary' });
            }
        }
    } catch (error) {
        console.error(`Error copying files: ${error.message}`);
        throw error;
    }
}

async function copyDirectory(source, destination) {
    try {
        const files = await fsPromises.readdir(source, { withFileTypes: true });

        for (const file of files) {
            const sourcePath = path.join(source, file.name);
            const destinationPath = path.join(destination, file.name);

            if (file.isDirectory()) {
                await fsPromises.mkdir(destinationPath, { recursive: true });
                await copyDirectory(sourcePath, destinationPath);
            } else {
                await mergeFiles([sourcePath], destinationPath);
            }
        }
    } catch (error) {
        console.error(`Error copying directory: ${error.message}`);
        throw error;
    }
}

async function buildPage() {
    const outputFolder = path.join(__dirname, 'project-dist');
    const componentsFolder = path.join(__dirname, 'components');
    const stylesFolder = path.join(__dirname, 'styles');
    const assetsFolder = path.join(__dirname, 'assets');

    try {
        await fsPromises.mkdir(outputFolder, { recursive: true });

        const templateContent = await readTemplateFile();
        const tags = await findTemplateTags(templateContent);

        const modifiedTemplate = await replaceTemplateTags(templateContent, tags, componentsFolder);
        await writeIndexHtml(outputFolder, modifiedTemplate);

        await bundleStyles();

        await copyDirectory(assetsFolder, path.join(outputFolder, 'assets'));
        await copyFiles(assetsFolder, path.join(outputFolder, 'assets'));

        console.log('Build completed successfully.');
    } catch (error) {
        console.error(`Build failed: ${error.message}`);
    }
}

buildPage();